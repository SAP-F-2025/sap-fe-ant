import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Space,
  Button,
  Tag,
  Typography,
  Row,
  Col,
  Statistic,
  Spin,
  message,
} from 'antd';
import {
  EditOutlined,
  RollbackOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Assessment, AssessmentStatus, AssessmentStats } from '../../types';
import assessmentService from '../../services/assessmentService';
import dayjs from 'dayjs';
import { ManageAssessmentQuestions } from '../../components/Assessment/ManageAssessmentQuestions';

const { Title } = Typography;

const AssessmentDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [stats, setStats] = useState<AssessmentStats | null>(null);

  useEffect(() => {
    if (id) {
      fetchAssessment(parseInt(id));
      fetchStats(parseInt(id));
    }
  }, [id]);

  const fetchAssessment = async (assessmentId: number) => {
    setLoading(true);
    try {
      const data = await assessmentService.getAssessment(assessmentId);
      setAssessment(data);
    } catch (error) {
      message.error('Không thể tải thông tin bài thi');
      navigate('/assessments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (assessmentId: number) => {
    try {
      const data = await assessmentService.getAssessmentStats(assessmentId);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const getStatusTag = (status: AssessmentStatus) => {
    const statusConfig = {
      [AssessmentStatus.Draft]: { color: 'default', text: 'Nháp' },
      [AssessmentStatus.Active]: { color: 'success', text: 'Đang hoạt động' },
      [AssessmentStatus.Expired]: { color: 'warning', text: 'Hết hạn' },
      [AssessmentStatus.Archived]: { color: 'error', text: 'Lưu trữ' },
    };
    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const handlePublish = async () => {
    if (!id) return;
    try {
      await assessmentService.publishAssessment(parseInt(id));
      message.success('Xuất bản bài thi thành công');
      fetchAssessment(parseInt(id));
    } catch (error) {
      message.error('Không thể xuất bản bài thi');
    }
  };

  const handleArchive = async () => {
    if (!id) return;
    try {
      await assessmentService.archiveAssessment(parseInt(id));
      message.success('Lưu trữ bài thi thành công');
      fetchAssessment(parseInt(id));
    } catch (error) {
      message.error('Không thể lưu trữ bài thi');
    }
  };

  if (loading || !assessment) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Space>
            <Button
              icon={<RollbackOutlined />}
              onClick={() => navigate('/assessments')}
            >
              Quay lại
            </Button>
          </Space>
        </Col>
        <Col>
          <Space>
            {assessment.status === AssessmentStatus.Draft && (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handlePublish}
              >
                Xuất bản
              </Button>
            )}
            {assessment.status === AssessmentStatus.Active && (
              <Button icon={<CloseCircleOutlined />} onClick={handleArchive}>
                Lưu trữ
              </Button>
            )}
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/assessments/edit/${id}`)}
            >
              Chỉnh sửa
            </Button>
          </Space>
        </Col>
      </Row>

      <Card>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Title level={2} style={{ marginBottom: 8 }}>
              {assessment.title}
            </Title>
            {getStatusTag(assessment.status)}
          </div>

          {assessment.description && (
            <Typography.Paragraph>{assessment.description}</Typography.Paragraph>
          )}
        </Space>
      </Card>

      {stats && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng lượt làm bài"
                value={stats.total_attempts}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Điểm trung bình"
                value={stats.average_score}
                precision={1}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tỷ lệ đạt"
                value={stats.pass_rate}
                precision={1}
                suffix="%"
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Thời gian trung bình"
                value={stats.average_time}
                suffix="phút"
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Card title="Thông tin chi tiết">
        <Descriptions column={{ xs: 1, sm: 2, lg: 3 }} bordered>
          <Descriptions.Item label="Thời gian làm bài">
            {assessment.duration} phút
          </Descriptions.Item>
          <Descriptions.Item label="Điểm qua môn">
            {assessment.passing_score}%
          </Descriptions.Item>
          <Descriptions.Item label="Số lần thử tối đa">
            {assessment.max_attempts}
          </Descriptions.Item>
          <Descriptions.Item label="Số câu hỏi">
            <FileTextOutlined /> {assessment.questions_count || 0} câu
          </Descriptions.Item>
          <Descriptions.Item label="Tổng điểm">
            {assessment.total_points || 0} điểm
          </Descriptions.Item>
          <Descriptions.Item label="Hạn nộp bài">
            {assessment.due_date
              ? dayjs(assessment.due_date).format('DD/MM/YYYY HH:mm')
              : 'Không giới hạn'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo" span={3}>
            {dayjs(assessment.created_at).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {assessment.settings && (
        <Card title="Cài đặt bài thi">
          <Descriptions column={{ xs: 1, sm: 2, lg: 3 }} bordered>
            <Descriptions.Item label="Xáo trộn câu hỏi">
              {assessment.settings.randomize_questions ? (
                <Tag color="success">Có</Tag>
              ) : (
                <Tag>Không</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Xáo trộn đáp án">
              {assessment.settings.randomize_options ? (
                <Tag color="success">Có</Tag>
              ) : (
                <Tag>Không</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Hiển thị thanh tiến trình">
              {assessment.settings.show_progress_bar ? (
                <Tag color="success">Có</Tag>
              ) : (
                <Tag>Không</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Hiển thị kết quả">
              {assessment.settings.show_results ? (
                <Tag color="success">Có</Tag>
              ) : (
                <Tag>Không</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Hiển thị đáp án đúng">
              {assessment.settings.show_correct_answers ? (
                <Tag color="success">Có</Tag>
              ) : (
                <Tag>Không</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Bắt buộc giới hạn thời gian">
              {assessment.settings.time_limit_enforced ? (
                <Tag color="warning">Có</Tag>
              ) : (
                <Tag>Không</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Yêu cầu camera">
              {assessment.settings.require_webcam ? (
                <Tag color="warning">Có</Tag>
              ) : (
                <Tag>Không</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ngăn chuyển tab">
              {assessment.settings.prevent_tab_switching ? (
                <Tag color="warning">Có</Tag>
              ) : (
                <Tag>Không</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Yêu cầu toàn màn hình">
              {assessment.settings.require_full_screen ? (
                <Tag color="warning">Có</Tag>
              ) : (
                <Tag>Không</Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      <ManageAssessmentQuestions
        assessmentId={parseInt(id!)}
        questions={assessment.questions}
        onQuestionsChange={() => {
          fetchAssessment(parseInt(id!));
        }}
      />
    </Space>
  );
};

export default AssessmentDetail;
