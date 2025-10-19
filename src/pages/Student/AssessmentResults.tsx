import React from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Tag,
  Space,
  Button,
  Divider,
  Alert,
  Collapse,
  Progress,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  FileTextOutlined,
  HomeOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';
import type { AttemptDetail, StudentAnswer } from '../../types';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const AssessmentResults: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();

  const { data: attempt, isLoading } = useQuery<AttemptDetail>({
    queryKey: ['attempt-detail', attemptId],
    queryFn: () => studentService.getAttemptDetails(Number(attemptId)),
    enabled: !!attemptId,
  });

  if (isLoading) {
    return (
      <div style={{ padding: '24px' }}>
        <Card loading />
      </div>
    );
  }

  if (!attempt) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Không tìm thấy kết quả"
          description="Không thể tìm thấy kết quả bài kiểm tra."
          type="error"
          showIcon
        />
      </div>
    );
  }

  const score = attempt.score || 0;
  const passed = attempt.passed || false;
  const totalQuestions = attempt.answers?.length || 0;
  const correctAnswers =
    attempt.answers?.filter((a: StudentAnswer) => a.is_correct).length || 0;
  const timeSpent = attempt.completed_at && attempt.started_at
    ? dayjs(attempt.completed_at).diff(dayjs(attempt.started_at), 'second')
    : 0;

  const renderAnswerFeedback = (answer: StudentAnswer, questionNumber: number) => {
    const question = attempt.questions?.find((q) => q.question_id === answer.question_id);

    if (!question) return null;

    return (
      <Panel
        header={
          <Space>
            <Tag color={answer.is_correct ? 'success' : 'error'}>
              {answer.is_correct ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            </Tag>
            <Text strong>Câu {questionNumber}</Text>
            <Text type="secondary">
              {answer.score} / {answer.max_score} điểm
            </Text>
          </Space>
        }
        key={answer.id}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* Question Text */}
          <div>
            <Text strong>Câu hỏi:</Text>
            <Paragraph>{question.question.text}</Paragraph>
          </div>

          {/* Student Answer */}
          <div>
            <Text strong>Câu trả lời của bạn:</Text>
            <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              {typeof answer.answer === 'object'
                ? JSON.stringify(answer.answer)
                : answer.answer?.toString() || 'Chưa trả lời'}
            </div>
          </div>

          {/* Correct Answer (if available and show_correct_answers is true) */}
          {attempt.assessment?.settings?.show_correct_answers && (
            <div>
              <Text strong type="success">
                Đáp án đúng:
              </Text>
              <div
                style={{
                  padding: '8px',
                  backgroundColor: '#f6ffed',
                  borderRadius: '4px',
                  border: '1px solid #b7eb8f',
                }}
              >
                {question.question.content.correct_answers?.join(', ') || 'N/A'}
              </div>
            </div>
          )}

          {/* Explanation */}
          {question.question.explanation && (
            <div>
              <Text strong type="secondary">
                Giải thích:
              </Text>
              <Paragraph type="secondary">{question.question.explanation}</Paragraph>
            </div>
          )}

          {/* Grader Feedback */}
          {answer.feedback && (
            <div>
              <Text strong>Nhận xét:</Text>
              <Alert message={answer.feedback} type="info" showIcon />
            </div>
          )}
        </Space>
      </Panel>
    );
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            {passed ? (
              <CheckCircleOutlined
                style={{ fontSize: '64px', color: '#52c41a', marginBottom: '16px' }}
              />
            ) : (
              <CloseCircleOutlined
                style={{ fontSize: '64px', color: '#f5222d', marginBottom: '16px' }}
              />
            )}
            <Title level={2} style={{ margin: 0 }}>
              {passed ? 'Chúc mừng!' : 'Hoàn thành bài kiểm tra'}
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              {attempt.assessment?.title}
            </Text>
          </div>

          <Divider />

          {/* Score Overview */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Điểm cuối cùng"
                  value={score}
                  precision={1}
                  suffix="%"
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: passed ? '#52c41a' : '#f5222d', fontSize: '32px' }}
                />
                <Progress
                  percent={score}
                  strokeColor={passed ? '#52c41a' : '#f5222d'}
                  showInfo={false}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Trạng thái"
                  value={passed ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                  valueStyle={{
                    color: passed ? '#52c41a' : '#f5222d',
                    fontSize: '24px',
                  }}
                />
                <Text type="secondary">
                  Điểm đạt: {attempt.assessment?.passing_score}%
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Câu trả lời đúng"
                  value={correctAnswers}
                  suffix={`/ ${totalQuestions}`}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ fontSize: '24px' }}
                />
                <Text type="secondary">
                  {totalQuestions > 0
                    ? ((correctAnswers / totalQuestions) * 100).toFixed(1)
                    : 0}
                  % độ chính xác
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Thời gian làm bài"
                  value={Math.floor(timeSpent / 60)}
                  suffix="phút"
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ fontSize: '24px' }}
                />
                <Text type="secondary">
                  Giới hạn: {attempt.assessment?.duration} phút
                </Text>
              </Card>
            </Col>
          </Row>

          {/* Status Alert */}
          {attempt.assessment?.settings?.show_results && (
            <Alert
              message={passed ? 'Bạn đã đạt bài kiểm tra này!' : 'Bạn chưa đạt bài kiểm tra này'}
              description={
                passed
                  ? `Xuất sắc! Điểm số ${score.toFixed(1)}% của bạn đã đạt yêu cầu ${attempt.assessment?.passing_score}%.`
                  : `Điểm số ${score.toFixed(1)}% của bạn thấp hơn yêu cầu ${attempt.assessment?.passing_score}%. ${attempt.assessment?.settings?.allow_retake ? 'Bạn có thể làm lại bài kiểm tra này.' : ''}`
              }
              type={passed ? 'success' : 'error'}
              showIcon
            />
          )}
        </Space>
      </Card>

      {/* Detailed Feedback */}
      {attempt.assessment?.settings?.show_correct_answers && attempt.answers && (
        <Card
          title={
            <Space>
              <FileTextOutlined />
              <Text strong>Chi tiết đáp án</Text>
            </Space>
          }
          style={{ marginTop: '24px' }}
        >
          <Collapse accordion>
            {attempt.answers.map((answer, index) => renderAnswerFeedback(answer, index + 1))}
          </Collapse>
        </Card>
      )}

      {/* Actions */}
      <Card style={{ marginTop: '24px' }}>
        <Space size="middle" wrap>
          <Button
            type="primary"
            icon={<HomeOutlined />}
            onClick={() => navigate('/student/dashboard')}
          >
            Về trang chủ
          </Button>
          <Button
            icon={<FileTextOutlined />}
            onClick={() => navigate('/student/history')}
          >
            Xem lịch sử
          </Button>
          {attempt.assessment?.settings?.allow_retake && !passed && (
            <Button
              icon={<ReloadOutlined />}
              onClick={() => navigate('/student/assessments')}
            >
              Làm lại
            </Button>
          )}
        </Space>
      </Card>

      {/* Additional Info */}
      <Card title="Thông tin bài kiểm tra" style={{ marginTop: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text type="secondary">Bắt đầu lúc:</Text>
            <div>
              <Text strong>{dayjs(attempt.started_at).format('DD/MM/YYYY HH:mm')}</Text>
            </div>
          </Col>
          <Col span={12}>
            <Text type="secondary">Hoàn thành lúc:</Text>
            <div>
              <Text strong>
                {attempt.completed_at
                  ? dayjs(attempt.completed_at).format('DD/MM/YYYY HH:mm')
                  : 'N/A'}
              </Text>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AssessmentResults;
