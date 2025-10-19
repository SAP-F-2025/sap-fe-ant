import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Radio,
  Checkbox,
  Input,
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

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [autoSaving, setAutoSaving] = useState(false);

  // Fetch attempt details (includes questions)
  const { data: attempt, isLoading } = useQuery<AttemptDetail>({
    queryKey: ['attempt-detail', attemptId],
    queryFn: () => studentService.getAttemptDetails(Number(attemptId)),
    enabled: !!attemptId,
  });

  // Questions are included in attempt details
  const questions = attempt?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

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
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
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
                  {option.text}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        );

      case 'true_false':
        return (
          <Radio.Group
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
          >
            <Space direction="vertical">
              <Radio value={true}>Đúng</Radio>
              <Radio value={false}>Sai</Radio>
            </Space>
          </Radio.Group>
        );

      case 'essay':
      case 'short_answer':
        return (
          <TextArea
            rows={question.type === 'essay' ? 8 : 4}
            placeholder="Nhập câu trả lời của bạn..."
            value={currentAnswer || ''}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
          />
        );

      case 'fill_blank':
        return (
          <Input
            placeholder="Điền vào chỗ trống..."
            value={currentAnswer || ''}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
          />
        );

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
            const isCurrent = index === currentQuestionIndex;
            return (
              <Button
                key={q.id}
                type={isCurrent ? 'primary' : isAnswered ? 'default' : 'dashed'}
                onClick={() => setCurrentQuestionIndex(index)}
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
