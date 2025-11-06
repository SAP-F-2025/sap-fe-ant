import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Radio,
  Checkbox,
  Input,
  Select,
  Space,
  Typography,
  Progress,
  Tag,
  App,
  Alert,
  Spin,
  Row,
  Col,
  Statistic,
} from 'antd';
import { ProctoringMonitor } from '../../components/Proctoring/ProctoringMonitor';
import type { ProctoringEvent } from '../../hooks/useMediaPipeFaceDetection';
import {
  ClockCircleOutlined,
  CheckOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';
import type { AttemptDetail, SubmitAnswerRequest, CompleteAttemptRequest } from '../../types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const TakeAssessment: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { modal } = App.useApp();

  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [autoSaving, setAutoSaving] = useState(false);
  const [proctoringEvents, setProctoringEvents] = useState<ProctoringEvent[]>([]);

  // Fetch attempt details (includes questions)
  const { data: attempt, isLoading } = useQuery<AttemptDetail>({
    queryKey: ['attempt-detail', attemptId],
    queryFn: () => studentService.getAttemptDetails(Number(attemptId)),
    enabled: !!attemptId,
  });

  // Log assessment settings
  useEffect(() => {
    if (attempt?.assessment) {
      console.log('=== ASSESSMENT SETTINGS ===');
      console.log('Title:', attempt.assessment.title);
      console.log('Settings:', attempt.assessment.settings);
      console.log('Require Webcam:', attempt.assessment.settings?.require_webcam);
      console.log('===========================');
    }
  }, [attempt]);

  // Questions are included in attempt details
  const questions = attempt?.questions || [];

  // Initialize currentQuestionId when questions load
  useEffect(() => {
    if (questions.length > 0 && currentQuestionId === null) {
      setCurrentQuestionId(questions[0].id);
    }
  }, [questions, currentQuestionId]);

  // Get current question by ID (not index)
  const currentQuestion = currentQuestionId
    ? questions.find(q => q.id === currentQuestionId)
    : null;

  // Get current index for display purposes
  const currentQuestionIndex = currentQuestion
    ? questions.findIndex(q => q.id === currentQuestion.id)
    : 0;

  // Load existing answers from attempt
  useEffect(() => {
    if (attempt?.answers) {
      const existingAnswers: Record<number, any> = {};
      attempt.answers.forEach((ans) => {
        if (ans.answer !== null && ans.answer !== undefined) {
          existingAnswers[ans.question_id] = ans.answer;
        }
      });
      setAnswers(existingAnswers);
    }
  }, [attempt]);

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: (data: SubmitAnswerRequest) =>
      studentService.submitAnswer(Number(attemptId), data),
    onSuccess: () => {
      setAutoSaving(false);
    },
    onError: () => {
      setAutoSaving(false);
    },
  });

  // Submit attempt mutation
  const submitAttemptMutation = useMutation({
    mutationFn: (data: CompleteAttemptRequest) => studentService.submitAttempt(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attempt-detail', attemptId] });
      modal.success({
        title: 'Đã nộp bài',
        content: 'Bài kiểm tra của bạn đã được nộp thành công!',
        onOk: () => {
          navigate(`/student/results/${attemptId}`);
        },
      });
    },
    onError: (error: any) => {
      modal.error({
        title: 'Nộp bài thất bại',
        content: error.message || 'Không thể nộp bài kiểm tra',
      });
    },
  });

  // Timer countdown
  useEffect(() => {
    if (!attempt) return;

    const fetchTimeRemaining = async () => {
      try {
        const timeData = await studentService.getTimeRemaining(Number(attemptId));
        setTimeRemaining(timeData.data); // Changed from time_remaining to data
      } catch (error) {
        console.error('Error fetching time remaining:', error);
      }
    };

    fetchTimeRemaining();
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [attempt, attemptId]);

  // Auto-save answer when changed
  useEffect(() => {
    if (!currentQuestion || !answers[currentQuestion.id]) return;

    const timer = setTimeout(() => {
      handleSaveAnswer(currentQuestion.id, answers[currentQuestion.id]);
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [answers, currentQuestion]);

  const buildCompleteAttemptRequest = (endReason?: string): CompleteAttemptRequest => {
    // Convert answers from Record<number, any> to SubmitAnswerRequest[]
    const answersArray: SubmitAnswerRequest[] = Object.entries(answers).map(
      ([questionId, answer]) => ({
        question_id: Number(questionId),
        answer,
      })
    );

    return {
      attempt_id: Number(attemptId),
      answers: answersArray,
      end_reason: endReason,
    };
  };

  const handleTimeUp = () => {
    modal.warning({
      title: 'Hết giờ!',
      content: 'Thời gian làm bài đã hết. Câu trả lời của bạn sẽ được nộp tự động.',
      onOk: () => {
        submitAttemptMutation.mutate(buildCompleteAttemptRequest('timeout'));
      },
    });
  };

  const handleSaveAnswer = async (questionId: number, answer: any) => {
    setAutoSaving(true);
    submitAnswerMutation.mutate({
      question_id: questionId,
      answer,
    });
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handlePreviousQuestion = () => {
    const currentIndex = questions.findIndex(q => q.id === currentQuestionId);
    if (currentIndex > 0) {
      setCurrentQuestionId(questions[currentIndex - 1].id);
    }
  };

  const handleNextQuestion = () => {
    const currentIndex = questions.findIndex(q => q.id === currentQuestionId);
    if (currentIndex < questions.length - 1) {
      setCurrentQuestionId(questions[currentIndex + 1].id);
    }
  };

  const goToQuestion = (questionId: number) => {
    setCurrentQuestionId(questionId);
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = questions.length;

    modal.confirm({
      title: 'Nộp bài?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn nộp bài?</p>
          <p>
            Đã trả lời: {answeredCount} / {totalQuestions} câu
          </p>
          {answeredCount < totalQuestions && (
            <Alert
              message={`Bạn còn ${totalQuestions - answeredCount} câu chưa trả lời`}
              type="warning"
              showIcon
              style={{ marginTop: 16 }}
            />
          )}
        </div>
      ),
      okText: 'Nộp bài',
      okType: 'primary',
      cancelText: 'Hủy',
      onOk: () => {
        submitAttemptMutation.mutate(buildCompleteAttemptRequest('submitted'));
      },
    });
  };

  const renderQuestionContent = (question: any) => {
    const questionId = question.id;
    const currentAnswer = answers[questionId];

    switch (question.type) {
      case 'multiple_choice':
        return (
          <Radio.Group
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {question.content.options?.map((option: any) => (
                <Radio key={option.id} value={option.id} style={{ padding: '8px' }}>
                  <Space direction="vertical">
                    {option.image_url && (
                      <img
                        src={option.image_url}
                        alt={option.text}
                        style={{ maxWidth: '200px', maxHeight: '150px', marginBottom: '4px' }}
                      />
                    )}
                    <Text>{option.text}</Text>
                  </Space>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        );

      case 'true_false':
        const trueLabel = question.content?.true_label || 'Đúng';
        const falseLabel = question.content?.false_label || 'Sai';

        return (
          <Radio.Group
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
          >
            <Space direction="vertical">
              <Radio value={true}>{trueLabel}</Radio>
              <Radio value={false}>{falseLabel}</Radio>
            </Space>
          </Radio.Group>
        );

      case 'essay':
        const minWords = question.content?.min_words;
        const maxWords = question.content?.max_words;
        const suggestedLength = question.content?.suggested_length;
        const currentText = currentAnswer || '';
        const wordCount = currentText.trim().split(/\s+/).filter(Boolean).length;

        return (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* Info Alerts */}
            {(minWords || maxWords || suggestedLength) && (
              <Alert
                message="Yêu cầu"
                description={
                  <Space direction="vertical" size="small">
                    {minWords && <Text>• Số từ tối thiểu: {minWords} từ</Text>}
                    {maxWords && <Text>• Số từ tối đa: {maxWords} từ</Text>}
                    {suggestedLength && <Text>• Độ dài gợi ý: {suggestedLength}</Text>}
                  </Space>
                }
                type="info"
                showIcon
              />
            )}

            {/* Text Area */}
            <TextArea
              rows={12}
              placeholder="Nhập câu trả lời của bạn..."
              value={currentText}
              onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            />

            {/* Word Counter */}
            <Card size="small" style={{ backgroundColor: '#fafafa' }}>
              <Space split={<span>|</span>}>
                <Text>
                  <strong>Số từ:</strong>{' '}
                  <Tag color={
                    (minWords && wordCount < minWords) || (maxWords && wordCount > maxWords)
                      ? 'warning'
                      : 'success'
                  }>
                    {wordCount}
                  </Tag>
                </Text>
                {minWords && (
                  <Text type={wordCount < minWords ? 'danger' : 'secondary'}>
                    Tối thiểu: {minWords}
                  </Text>
                )}
                {maxWords && (
                  <Text type={wordCount > maxWords ? 'danger' : 'secondary'}>
                    Tối đa: {maxWords}
                  </Text>
                )}
              </Space>
            </Card>
          </Space>
        );

      case 'short_answer':
        const maxLength = question.content?.max_length || 200;
        const placeholderText = question.content?.placeholder_text || 'Nhập câu trả lời ngắn...';
        const caseSensitive = question.content?.case_sensitive;

        return (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Input
              placeholder={placeholderText}
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(questionId, e.target.value)}
              maxLength={maxLength}
              showCount
              style={{ width: '100%' }}
            />
            {caseSensitive && (
              <Alert
                message="Lưu ý: Câu trả lời có phân biệt chữ hoa chữ thường"
                type="info"
                showIcon
                style={{ marginTop: '8px' }}
              />
            )}
          </Space>
        );

      case 'fill_blank':
        // Check if using new fill_blank structure (fields directly in content)
        if (question.content?.template && question.content?.blanks) {
          const { template, blanks, case_sensitive } = question.content;
          const blankMatches = template.match(/\{blank\d+\}/g) || [];
          const uniqueBlanks = Array.from(new Set(blankMatches));

          // Split template by blanks
          const parts = template.split(/(\{blank\d+\})/);

          return (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div style={{ fontSize: '16px', lineHeight: '2' }}>
                {parts.map((part, index) => {
                  const blankMatch = part.match(/\{(blank\d+)\}/);
                  if (blankMatch) {
                    const blankId = blankMatch[1];
                    const blankDef = blanks[blankId];
                    const currentValue = currentAnswer?.[blankId] || '';

                    return (
                      <Input
                        key={index}
                        placeholder={blankDef?.placeholder_text || 'Điền vào chỗ trống...'}
                        value={currentValue}
                        onChange={(e) => {
                          const newAnswer = { ...currentAnswer, [blankId]: e.target.value };
                          handleAnswerChange(questionId, newAnswer);
                        }}
                        style={{
                          width: '200px',
                          margin: '0 4px',
                          display: 'inline-block',
                        }}
                      />
                    );
                  }
                  return <span key={index}>{part}</span>;
                })}
              </div>
              {case_sensitive && (
                <Alert
                  message="Lưu ý: Câu trả lời có phân biệt chữ hoa chữ thường"
                  type="info"
                  showIcon
                  style={{ marginTop: '8px' }}
                />
              )}
            </Space>
          );
        }

        // Fallback for old structure
        return (
          <Input
            placeholder="Điền vào chỗ trống..."
            value={currentAnswer || ''}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
          />
        );

      case 'matching':
        if (question.content?.left_items && question.content?.right_items) {
          const { left_items, right_items } = question.content;
          const currentMatches = currentAnswer || {};

          return (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card title="Danh sách bên trái" size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {left_items.map((leftItem: any) => (
                        <div key={leftItem.id} style={{ marginBottom: '12px' }}>
                          <div style={{ marginBottom: '8px' }}>
                            {leftItem.image_url && (
                              <img
                                src={leftItem.image_url}
                                alt={leftItem.text}
                                style={{ maxWidth: '100%', maxHeight: '100px', marginBottom: '8px' }}
                              />
                            )}
                            <Text strong>{leftItem.text}</Text>
                          </div>
                          <Select
                            placeholder="Chọn cặp ghép"
                            style={{ width: '100%' }}
                            value={currentMatches[leftItem.id] || undefined}
                            onChange={(value) => {
                              const newMatches = { ...currentMatches, [leftItem.id]: value };
                              handleAnswerChange(questionId, newMatches);
                            }}
                            options={right_items.map((rightItem: any) => ({
                              label: rightItem.text,
                              value: rightItem.id,
                            }))}
                          />
                        </div>
                      ))}
                    </Space>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Danh sách bên phải" size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {right_items.map((rightItem: any) => (
                        <div key={rightItem.id} style={{ padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
                          {rightItem.image_url && (
                            <img
                              src={rightItem.image_url}
                              alt={rightItem.text}
                              style={{ maxWidth: '100%', maxHeight: '100px', marginBottom: '8px' }}
                            />
                          )}
                          <Text>{rightItem.text}</Text>
                        </div>
                      ))}
                    </Space>
                  </Card>
                </Col>
              </Row>
            </Space>
          );
        }
        return <Text type="secondary">Câu hỏi ghép cặp không hợp lệ</Text>;

      case 'ordering':
        if (question.content?.items) {
          const { items } = question.content;
          const currentOrder = currentAnswer || items.map((item: any) => item.id);

          const moveItem = (fromIndex: number, toIndex: number) => {
            const newOrder = [...currentOrder];
            const [removed] = newOrder.splice(fromIndex, 1);
            newOrder.splice(toIndex, 0, removed);
            handleAnswerChange(questionId, newOrder);
          };

          return (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Alert
                message="Kéo thả hoặc dùng nút ↑↓ để sắp xếp các items theo thứ tự đúng"
                type="info"
                showIcon
              />
              <div>
                {currentOrder.map((itemId: string, index: number) => {
                  const item = items.find((i: any) => i.id === itemId);
                  if (!item) return null;

                  return (
                    <Card
                      key={itemId}
                      size="small"
                      style={{ marginBottom: '8px' }}
                      extra={
                        <Space>
                          <Button
                            size="small"
                            icon={<span>↑</span>}
                            disabled={index === 0}
                            onClick={() => moveItem(index, index - 1)}
                          />
                          <Button
                            size="small"
                            icon={<span>↓</span>}
                            disabled={index === currentOrder.length - 1}
                            onClick={() => moveItem(index, index + 1)}
                          />
                        </Space>
                      }
                    >
                      <Space>
                        <Tag color="blue">{index + 1}</Tag>
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.text}
                            style={{ maxWidth: '100px', maxHeight: '60px' }}
                          />
                        )}
                        <Text>{item.text}</Text>
                      </Space>
                    </Card>
                  );
                })}
              </div>
            </Space>
          );
        }
        return <Text type="secondary">Câu hỏi sắp xếp không hợp lệ</Text>;

      default:
        return <Text type="secondary">Loại câu hỏi không được hỗ trợ</Text>;
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const totalTime = (attempt?.assessment?.duration || 60) * 60;
    const percentage = (timeRemaining / totalTime) * 100;
    if (percentage > 50) return '#52c41a';
    if (percentage > 20) return '#faad14';
    return '#f5222d';
  };

  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Đang tải bài kiểm tra...</Text>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Không tìm thấy bài kiểm tra"
          description="Bài kiểm tra bạn đang tìm không tồn tại hoặc đã bị xóa."
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Không có câu hỏi"
          description="Bài kiểm tra này chưa có câu hỏi nào. Vui lòng liên hệ giáo viên."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Lỗi tải câu hỏi"
          description="Không thể tải câu hỏi hiện tại. Vui lòng thử lại."
          type="error"
          showIcon
        />
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const requireWebcam = attempt?.assessment?.settings?.require_webcam;

  const handleProctoringViolation = (event: ProctoringEvent) => {
    setProctoringEvents(prev => [...prev, event]);
    console.log('Proctoring violation:', event);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Title level={3} style={{ margin: 0 }}>
              {attempt.assessment?.title}
            </Title>
            <Text type="secondary">
              Câu {currentQuestionIndex + 1} / {questions.length}
            </Text>
          </Col>
          <Col>
            <Statistic
              title="Thời gian còn lại"
              value={formatTime(timeRemaining)}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: getTimeColor(), fontSize: '24px' }}
            />
          </Col>
          <Col>
            <Statistic
              title="Đã trả lời"
              value={answeredCount}
              suffix={`/ ${questions.length}`}
              valueStyle={{ fontSize: '24px' }}
            />
          </Col>
        </Row>
        <Progress
          percent={progress}
          showInfo={false}
          strokeColor="#1890ff"
          style={{ marginTop: '16px' }}
        />
        {autoSaving && (
          <Tag color="processing" style={{ marginTop: '8px' }}>
            <SaveOutlined /> Đang lưu...
          </Tag>
        )}
      </Card>

      {/* Question Card */}
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Question Header */}
          <div>
            <Space>
              <Tag color="blue">Câu {currentQuestionIndex + 1}</Tag>
              <Tag>{currentQuestion.points} điểm</Tag>
              {/* DEPRECATED: time_limit per question not used. Only Assessment.Duration is enforced.
              {currentQuestion.time_limit && (
                <Tag icon={<ClockCircleOutlined />}>
                  {currentQuestion.time_limit} giây
                </Tag>
              )}
              */}
            </Space>
          </div>

          {/* Question Text */}
          <div>
            <Paragraph strong style={{ fontSize: '16px' }}>
              {currentQuestion.text}
            </Paragraph>
          </div>

          {/* Answer Input */}
          <div>{renderQuestionContent(currentQuestion)}</div>

          {/* Navigation */}
          <Row justify="space-between" align="middle">
            <Col>
              <Button
                icon={<LeftOutlined />}
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Trước
              </Button>
            </Col>
            <Col>
              <Space>
                <Text type="secondary">
                  {answeredCount} / {questions.length} đã trả lời
                </Text>
              </Space>
            </Col>
            <Col>
              <Space>
                {currentQuestionIndex === questions.length - 1 ? (
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={handleSubmit}
                    loading={submitAttemptMutation.isPending}
                  >
                    Nộp bài
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    icon={<RightOutlined />}
                    onClick={handleNextQuestion}
                  >
                    Tiếp theo
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </Space>
      </Card>

      {/* Question Navigation Grid */}
      <Card title="Điều hướng câu hỏi" style={{ marginTop: '16px' }}>
        <Space wrap>
          {questions.map((q, index) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = q.id === currentQuestionId;
            return (
              <Button
                key={q.id}
                type={isCurrent ? 'primary' : isAnswered ? 'default' : 'dashed'}
                onClick={() => goToQuestion(q.id)}
                style={{
                  width: '40px',
                  backgroundColor: isAnswered && !isCurrent ? '#52c41a' : undefined,
                  borderColor: isAnswered && !isCurrent ? '#52c41a' : undefined,
                  color: isAnswered && !isCurrent ? '#fff' : undefined,
                }}
              >
                {index + 1}
              </Button>
            );
          })}
        </Space>
      </Card>

      {/* Proctoring Monitor - Floating */}
      {requireWebcam && (
        <ProctoringMonitor
          onViolation={handleProctoringViolation}
          showLandmarks={false}
          compact
          violationCount={proctoringEvents.length}
        />
      )}

      {/* Warning: Leave page */}
      <Alert
        message="Cảnh báo"
        description="Không đóng hoặc làm mới trang này trong khi làm bài. Tiến trình của bạn được tự động lưu."
        type="warning"
        showIcon
        style={{ marginTop: '16px' }}
      />
    </div>
  );
};

export default TakeAssessment;
