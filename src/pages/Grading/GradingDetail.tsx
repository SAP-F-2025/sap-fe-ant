import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Space,
  Typography,
  Descriptions,
  Tag,
  Button,
  Divider,
  InputNumber,
  Input,
  Row,
  Col,
  Alert,
  Spin,
  message,
  Progress,
  Avatar,
  Flex,
  Badge,
  Collapse,
  Empty,
  Tooltip,
  Modal,
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  TrophyOutlined,
  SaveOutlined,
  ThunderboltOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FlagOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { elevation } from '../../styles/elevation';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import { gradingService, type StudentAnswerDetail, type AttemptDetailResponse } from '../../services/gradingService';
import { QuestionType } from '../../types';

dayjs.extend(duration);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

interface AnswerGrade {
  score: number;
  feedback: string;
}

const GradingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoGrading, setAutoGrading] = useState(false);
  const [attempt, setAttempt] = useState<AttemptDetailResponse | null>(null);
  const [grades, setGrades] = useState<Map<number, AnswerGrade>>(new Map());
  const [expandedAnswers, setExpandedAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchAttemptDetail(parseInt(id));
    }
  }, [id]);

  const fetchAttemptDetail = async (attemptId: number) => {
    try {
      setLoading(true);
      const data = await gradingService.getAttemptDetail(attemptId);
      setAttempt(data);

      // Initialize grades from existing scores
      const initialGrades = new Map<number, AnswerGrade>();
      data.answers.forEach(answer => {
        if (answer.is_graded) {
          initialGrades.set(answer.id, {
            score: answer.score || 0,
            feedback: answer.feedback || '',
          });
        }
      });
      setGrades(initialGrades);
    } catch (error) {
      message.error('Không thể tải chi tiết bài làm');
      navigate('/grading');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (answerId: number, field: 'score' | 'feedback', value: number | string) => {
    const currentGrade = grades.get(answerId) || { score: 0, feedback: '' };
    setGrades(new Map(grades.set(answerId, {
      ...currentGrade,
      [field]: value,
    })));
  };

  const handleSaveGrades = async () => {
    if (!attempt) return;

    const gradesToSubmit = Array.from(grades.entries()).map(([answerId, grade]) => ({
      answer_id: answerId,
      score: grade.score,
      feedback: grade.feedback,
    }));

    if (gradesToSubmit.length === 0) {
      message.warning('Vui lòng chấm điểm ít nhất một câu trả lời');
      return;
    }

    try {
      setSaving(true);
      await gradingService.batchGradeAnswers({ grades: gradesToSubmit });
      message.success('Đã lưu điểm thành công');

      // Reload attempt to get updated data
      if (id) {
        await fetchAttemptDetail(parseInt(id));
      }
    } catch (error) {
      message.error('Không thể lưu điểm');
    } finally {
      setSaving(false);
    }
  };

  const handleAutoGrade = () => {
    if (!attempt) return;

    confirm({
      title: 'Chấm điểm tự động',
      icon: <ThunderboltOutlined />,
      content: 'Bạn có chắc chắn muốn chấm điểm tự động cho bài làm này? Điểm số hiện tại sẽ bị ghi đè.',
      okText: 'Chấm tự động',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setAutoGrading(true);
          const result = await gradingService.autoGradeAttempt(attempt.id);
          message.success(
            `Đã chấm tự động ${result.graded_answers} câu. ${result.pending_manual_grading} câu cần chấm thủ công.`
          );

          // Reload attempt
          if (id) {
            await fetchAttemptDetail(parseInt(id));
          }
        } catch (error) {
          message.error('Không thể chấm điểm tự động');
        } finally {
          setAutoGrading(false);
        }
      },
    });
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      completed: 'success',
      in_progress: 'processing',
      abandoned: 'default',
      timeout: 'error',
    };
    return statusMap[status] || 'default';
  };

  const getQuestionTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      multiple_choice: 'Trắc nghiệm',
      true_false: 'Đúng/Sai',
      essay: 'Tự luận',
      fill_blank: 'Điền khuyết',
      matching: 'Nối câu',
      ordering: 'Sắp xếp',
      short_answer: 'Câu trả lời ngắn',
    };
    return typeMap[type] || type;
  };

  const calculateTotalScore = () => {
    if (!attempt) return 0;
    return 0;
    // return attempt.answers.reduce((total, answer) => {
    //   const grade = grades.get(answer.id);
    //   return total + (grade?.score || answer.score || 0);
    // }, 0);
  };

  const calculateMaxScore = () => {
    if (!attempt) return 0;
    return 0;
   // return attempt.answers.reduce((total, answer) => total + answer.max_score, 0);
  };

  const calculateProgress = () => {
    if (!attempt) return 0;
    // const gradedCount = attempt.answers.filter(a => a.is_graded || grades.has(a.id)).length;
    // return (gradedCount / attempt.answers.length) * 100;
      return 0;
  };

  const renderAnswerContent = (answer: StudentAnswerDetail) => {
    const question = answer.question;
    if (!question) return <Text type="secondary">Không có dữ liệu câu hỏi</Text>;

    // Render based on question type
    switch (question.type) {
      case QuestionType.MultipleChoice:
      case QuestionType.TrueFalse:
        const selectedOptions = Array.isArray(answer.answer) ? answer.answer : [answer.answer];
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            {question.content.options?.map((option: any) => {
              const isSelected = selectedOptions.includes(option.id);
              const isCorrect = question.content.correct_answers?.includes(option.id);
              return (
                <div key={option.id} style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: `1px solid ${isSelected ? (isCorrect ? '#52c41a' : '#ff4d4f') : '#d9d9d9'}`,
                  backgroundColor: isSelected ? (isCorrect ? '#f6ffed' : '#fff2f0') : 'transparent',
                }}>
                  <Space>
                    {isSelected && (isCorrect ?
                      <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
                      <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                    )}
                    <Text>{option.text}</Text>
                  </Space>
                </div>
              );
            })}
          </Space>
        );

      case QuestionType.Essay:
      case QuestionType.ShortAnswer:
        return (
          <Card size="small" style={{ backgroundColor: '#fafafa' }}>
            <Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
              {answer.answer || <Text type="secondary">Không có câu trả lời</Text>}
            </Paragraph>
          </Card>
        );

      case QuestionType.FillBlank:
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            {Object.entries(answer.answer || {}).map(([key, value]) => (
              <div key={key}>
                <Text strong>Chỗ trống {key}: </Text>
                <Tag color="blue">{String(value)}</Tag>
              </div>
            ))}
          </Space>
        );

      default:
        return (
          <Card size="small" style={{ backgroundColor: '#fafafa' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(answer.answer, null, 2)}
            </pre>
          </Card>
        );
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  if (!attempt) {
    return (
      <Empty description="Không tìm thấy bài làm" />
    );
  }

  const totalScore = calculateTotalScore();
  const maxScore = calculateMaxScore();
  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  const passed = percentage >= (attempt.assessment?.passing_score || 0);
  const progress = calculateProgress();

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Header */}
      <Flex justify="space-between" align="center">
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/grading')}>
            Quay lại
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            Chi tiết bài làm
          </Title>
        </Space>
        <Space>
          <Button
            type="default"
            icon={<ThunderboltOutlined />}
            onClick={handleAutoGrade}
            loading={autoGrading}
          >
            Chấm tự động
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSaveGrades}
            loading={saving}
            disabled={grades.size === 0}
          >
            Lưu điểm
          </Button>
        </Space>
      </Flex>

      {/* Progress */}
      <Card style={{ ...elevation[1], borderRadius: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <Flex justify="space-between">
            <Text strong>Tiến độ chấm điểm</Text>
            <Text>{Math.round(progress)}%</Text>
          </Flex>
          <Progress
            percent={progress}
            strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
            showInfo={false}
          />
        </Space>
      </Card>

      {/* Attempt Info */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <Text strong>Thông tin bài làm</Text>
              </Space>
            }
            style={{ ...elevation[1], borderRadius: 16 }}
          >
            <Descriptions column={{ xs: 1, sm: 2 }} bordered>
              <Descriptions.Item label="Bài thi">
                {attempt.assessment?.title}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(attempt.status)}>
                  {attempt.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Học viên">
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} src={attempt.student?.avatar_url} />
                  <Text>{attempt.student?.full_name || `Student #${attempt.student_id}`}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {attempt.student?.email || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Bắt đầu">
                {dayjs(attempt.started_at).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Hoàn thành">
                {attempt.completed_at ? dayjs(attempt.completed_at).format('DD/MM/YYYY HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian làm bài">
                <Space>
                  <ClockCircleOutlined />
                  {attempt.time_spent
                    ? dayjs.duration(attempt.time_spent, 'seconds').format('HH:mm:ss')
                    : '-'
                  }
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Số câu hỏi">
                {attempt.answers.length}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <TrophyOutlined />
                <Text strong>Điểm số</Text>
              </Space>
            }
            style={{ ...elevation[1], borderRadius: 16 }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <Title level={1} style={{ margin: 0, fontSize: 48 }}>
                  {totalScore.toFixed(1)}
                </Title>
                <Text type="secondary">/ {maxScore} điểm</Text>
              </div>

              <Progress
                type="circle"
                percent={Math.round(percentage)}
                strokeColor={passed ? '#52c41a' : '#ff4d4f'}
                format={() => `${Math.round(percentage)}%`}
              />

              <Alert
                message={passed ? 'Đạt yêu cầu' : 'Chưa đạt'}
                description={`Điểm chuẩn: ${attempt.assessment?.passing_score || 0}%`}
                type={passed ? 'success' : 'error'}
                showIcon
                icon={passed ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              />
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Proctoring Events */}
      {attempt.proctoring_events && attempt.proctoring_events.length > 0 && (
        <Card
          title={
            <Space>
              <ExclamationCircleOutlined style={{ color: '#faad14' }} />
              <Text strong>Cảnh báo giám sát</Text>
              <Badge count={attempt.proctoring_events.length} />
            </Space>
          }
          style={{ ...elevation[1], borderRadius: 16 }}
        >
          <Collapse ghost>
            {attempt.proctoring_events.map((event, index) => (
              <Collapse.Panel
                key={event.id}
                header={
                  <Space>
                    <Tag color={
                      event.severity === 'critical' ? 'red' :
                      event.severity === 'high' ? 'orange' :
                      event.severity === 'medium' ? 'gold' : 'default'
                    }>
                      {event.severity}
                    </Tag>
                    <Text>{event.event_type}</Text>
                    <Text type="secondary">
                      {dayjs(event.timestamp).format('HH:mm:ss')}
                    </Text>
                  </Space>
                }
              >
                <pre>{JSON.stringify(event.details, null, 2)}</pre>
              </Collapse.Panel>
            ))}
          </Collapse>
        </Card>
      )}

      {/* Answers */}
      <Card
        title={
          <Space>
            <FileTextOutlined />
            <Text strong>Câu trả lời ({attempt.answers.length})</Text>
          </Space>
        }
        style={{ ...elevation[1], borderRadius: 16 }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {attempt.answers.map((answer, index) => {
            const currentGrade = grades.get(answer.id);
            const displayScore = currentGrade?.score ?? answer.score ?? 0;
            const displayFeedback = currentGrade?.feedback ?? answer.feedback ?? '';

            return (
              <Card
                key={answer.id}
                type="inner"
                title={
                  <Flex justify="space-between" align="center">
                    <Space>
                      <Badge count={index + 1} style={{ backgroundColor: '#1890ff' }} />
                      <Text strong>Câu {index + 1}</Text>
                      <Tag>{getQuestionTypeLabel(answer.question?.type || '')}</Tag>
                      {answer.flagged && (
                        <Tooltip title="Câu hỏi được đánh dấu">
                          <FlagOutlined style={{ color: '#ff4d4f' }} />
                        </Tooltip>
                      )}
                    </Space>
                    <Space>
                      {answer.is_graded && (
                        <Tag color="success" icon={<CheckCircleOutlined />}>
                          Đã chấm
                        </Tag>
                      )}
                      <Text strong>
                        {displayScore} / {answer.max_score} điểm
                      </Text>
                    </Space>
                  </Flex>
                }
                style={{ borderRadius: 12 }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  {/* Question Text */}
                  <div>
                    <Text strong>Câu hỏi:</Text>
                    <Paragraph style={{ marginTop: 8 }}>
                      {answer.question?.text}
                    </Paragraph>
                  </div>

                  <Divider style={{ margin: '8px 0' }} />

                  {/* Student Answer */}
                  <div>
                    <Text strong>Câu trả lời của học viên:</Text>
                    <div style={{ marginTop: 8 }}>
                      {renderAnswerContent(answer)}
                    </div>
                  </div>

                  {/* Explanation */}
                  {answer.question?.explanation && (
                    <>
                      <Divider style={{ margin: '8px 0' }} />
                      <Alert
                        message="Giải thích"
                        description={answer.question.explanation}
                        type="info"
                        showIcon
                        icon={<EyeOutlined />}
                      />
                    </>
                  )}

                  <Divider style={{ margin: '8px 0' }} />

                  {/* Grading Section */}
                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text strong>Điểm số:</Text>
                        <InputNumber
                          min={0}
                          max={answer.max_score}
                          step={0.5}
                          value={displayScore}
                          onChange={(value) => handleGradeChange(answer.id, 'score', value || 0)}
                          style={{ width: '100%' }}
                          size="large"
                        />
                      </Space>
                    </Col>
                    <Col xs={24} sm={16}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text strong>Nhận xét:</Text>
                        <TextArea
                          rows={3}
                          value={displayFeedback}
                          onChange={(e) => handleGradeChange(answer.id, 'feedback', e.target.value)}
                          placeholder="Nhập nhận xét cho học viên..."
                        />
                      </Space>
                    </Col>
                  </Row>

                  {/* Grading Info */}
                  {answer.is_graded && answer.graded_at && (
                    <Alert
                      message={
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Đã chấm lúc {dayjs(answer.graded_at).format('DD/MM/YYYY HH:mm')}
                          {answer.graded_by && ` bởi giáo viên #${answer.graded_by}`}
                        </Text>
                      }
                      type="info"
                      showIcon={false}
                      style={{ padding: '4px 12px' }}
                    />
                  )}
                </Space>
              </Card>
            );
          })}
        </Space>
      </Card>
    </Space>
  );
};

export default GradingDetail;
