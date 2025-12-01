import React from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Tag, Space, Button, theme } from 'antd';
import {
  BookOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  EditOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import teacherService from '../../services/teacherService';
import type { DashboardStats } from '../../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { useToken } = theme;

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { token } = useToken();

  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['teacher-dashboard-stats'],
    queryFn: () => teacherService.getDashboardStats(),
  });

  // Get creator stats if user ID is available
  const { data: creatorStats } = useQuery({
    queryKey: ['teacher-creator-stats', user?.id],
    queryFn: () => teacherService.getCreatorStats(user?.id || ''),
    enabled: !!user?.id,
  });

  const recentActivitiesColumns = [
    {
      title: 'Học sinh',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => {
        const actionMap: Record<string, { text: string; color: string }> = {
          completed_assessment: { text: 'Hoàn thành bài thi', color: 'success' },
          started_assessment: { text: 'Bắt đầu bài thi', color: 'processing' },
          created_question: { text: 'Tạo câu hỏi', color: 'default' },
          created_assessment: { text: 'Tạo bài thi', color: 'default' },
          published_assessment: { text: 'Xuất bản bài thi', color: 'success' },
        };
        const mapped = actionMap[action] || { text: action, color: 'default' };
        return <Tag color={mapped.color}>{mapped.text}</Tag>;
      },
    },
    {
      title: 'Bài thi/Nội dung',
      dataIndex: 'assessment_title',
      key: 'assessment_title',
      render: (title: string) => title || '-',
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
      key: 'score',
      render: (score: number | undefined) =>
        score !== undefined ? (
          <Text type={score >= 70 ? 'success' : 'danger'}>{score.toFixed(1)}%</Text>
        ) : (
          '-'
        ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).fromNow(),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Dashboard giáo viên</Title>
      <Text type="secondary">Chào mừng trở lại, {user?.displayName}!</Text>

      {/* Overview Stats */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading}>
            <Statistic
              title="Tổng bài thi"
              value={stats?.overview.total_assessments || 0}
              prefix={<BookOutlined />}
              valueStyle={{ color: token.colorPrimary }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading}>
            <Statistic
              title="Tổng câu hỏi"
              value={stats?.overview.total_questions || 0}
              prefix={<QuestionCircleOutlined />}
              valueStyle={{ color: token.colorSuccess }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading}>
            <Statistic
              title="Ngân hàng câu hỏi"
              value={stats?.overview.total_question_banks || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: token.colorWarning }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading}>
            <Statistic
              title="Lượt làm bài"
              value={stats?.overview.total_attempts || 0}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Performance Metrics */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} sm={8}>
          <Card loading={isLoading}>
            <Statistic
              title="Điểm trung bình"
              value={stats?.metrics.average_score || 0}
              precision={1}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: token.colorPrimary }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={isLoading}>
            <Statistic
              title="Tỷ lệ hoàn thành"
              value={stats?.metrics.completion_rate || 0}
              precision={1}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: token.colorSuccess }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={isLoading}>
            <Statistic
              title="Tỷ lệ đạt"
              value={stats?.metrics.pass_rate || 0}
              precision={1}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: token.colorSuccess }}
            />
          </Card>
        </Col>
      </Row>

      {/* Creator Stats */}
      {creatorStats && (
        <Card title="Thống kê của tôi" style={{ marginTop: '24px' }}>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic
                title="Bài thi của tôi"
                value={creatorStats.total_assessments}
                prefix={<BookOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Câu hỏi của tôi"
                value={creatorStats.total_questions}
                prefix={<QuestionCircleOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Ngân hàng của tôi"
                value={creatorStats.total_question_banks}
                prefix={<FileTextOutlined />}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* Recent Activities */}
      <Card
        title="Hoạt động gần đây"
        style={{ marginTop: '24px' }}
        loading={isLoading}
      >
        <Table
          columns={recentActivitiesColumns}
          dataSource={stats?.recent_activities || []}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: 'Chưa có hoạt động nào' }}
        />
      </Card>

      {/* Quick Actions */}
      <Card title="Thao tác nhanh" style={{ marginTop: '24px' }}>
        <Space size="middle" wrap>
          <Button
            type="primary"
            icon={<BookOutlined />}
            onClick={() => navigate('/assessments/new')}
          >
            Tạo bài thi mới
          </Button>
          <Button
            icon={<QuestionCircleOutlined />}
            onClick={() => navigate('/questions/new')}
          >
            Tạo câu hỏi mới
          </Button>
          <Button
            icon={<FileTextOutlined />}
            onClick={() => navigate('/question-banks/new')}
          >
            Tạo ngân hàng câu hỏi
          </Button>
          <Button
            icon={<TeamOutlined />}
            onClick={() => navigate('/teacher/student-progress')}
          >
            Xem tiến độ học sinh
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate('/grading')}
          >
            Chấm điểm
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
