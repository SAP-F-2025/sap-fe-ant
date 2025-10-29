import React from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Tag, Space, Button, Flex } from 'antd';
import {
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  ArrowRightOutlined,
  HourglassOutlined,
  CloseCircleOutlined as CloseIcon,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import studentService from '../../services/studentService';
import type { StudentDashboardStats } from '../../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { gradients } from '../../theme/gradients';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery<StudentDashboardStats>({
    queryKey: ['student-dashboard-stats'],
    queryFn: () => studentService.getDashboardStats(),
  });

  const recentAttemptsColumns = [
    {
      title: 'Bài kiểm tra',
      dataIndex: 'assessment_title',
      key: 'assessment_title',
      render: (title: string) => <Text strong>{title}</Text>,
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
      key: 'score',
      render: (score: number, record: any) => {
        // Check if grading is pending
        if (!record.is_graded) {
          return (
            <Tag icon={<HourglassOutlined />} color="warning">
              Đang chấm
            </Tag>
          );
        }
        return (
          <Text type={score >= 70 ? 'success' : 'danger'}>{score.toFixed(1)}%</Text>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'passed',
      key: 'passed',
      render: (passed: boolean, record: any) => {
        // Check if grading is pending
        if (!record.is_graded) {
          return (
            <Tag icon={<HourglassOutlined />} color="warning">
              Đang chấm
            </Tag>
          );
        }
        return (
          <Tag color={passed ? 'success' : 'error'} icon={passed ? <CheckCircleOutlined /> : <CloseIcon />}>
            {passed ? 'Đạt' : 'Không đạt'}
          </Tag>
        );
      },
    },
    {
      title: 'Hoàn thành',
      dataIndex: 'completed_at',
      key: 'completed_at',
      render: (date: string) => dayjs(date).fromNow(),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          type="link"
          icon={<ArrowRightOutlined />}
          onClick={() => navigate(`/student/results/${record.id}`)}
        >
          Xem
        </Button>
      ),
    },
  ];

  const upcomingColumns = [
    {
      title: 'Bài kiểm tra',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => <Text strong>{title}</Text>,
    },
    {
      title: 'Hạn nộp',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thời gian còn lại',
      dataIndex: 'days_remaining',
      key: 'days_remaining',
      render: (days: number) => {
        const color = days <= 1 ? 'red' : days <= 3 ? 'orange' : 'green';
        return (
          <Tag color={color}>
            {days === 0 ? 'Hôm nay' : `Còn ${days} ngày`}
          </Tag>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          type="primary"
          size="small"
          onClick={() => navigate(`/student/assessments/${record.id}`)}
        >
          Bắt đầu
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        bordered={false}
        style={{
          background: gradients.primary,
          borderRadius: 24,
          padding: '32px',
          color: '#ffffff',
          marginBottom: '24px',
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Flex
          align="center"
          justify="space-between"
          wrap
          style={{ gap: 24, width: '100%' }}
        >
          <Space direction="vertical" size={8} style={{ color: '#ffffff' }}>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>
              Chào mừng trở lại
            </Text>
            <Title level={2} style={{ color: '#ffffff', margin: 0 }}>
              {user?.displayName || 'Học viên'}
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.75)' }}>
              Chúc bạn có một ngày học tập hiệu quả với nhiều kết quả tốt đẹp.
            </Text>
          </Space>
          <Button
            type="primary"
            size="large"
            style={{
              background: 'rgba(255,255,255,0.2)',
              borderColor: 'rgba(255,255,255,0.4)',
              color: '#ffffff',
              backdropFilter: 'blur(2px)',
              alignSelf: 'flex-start',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
            }}
            onClick={() => navigate('/student/assessments')}
          >
            Tiếp tục học
          </Button>
        </Flex>
      </Card>

      {/* Overview Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading}>
            <Statistic
              title="Bài kiểm tra khả dụng"
              value={stats?.overview.total_assessments_available || 0}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading}>
            <Statistic
              title="Đã hoàn thành"
              value={stats?.overview.total_assessments_completed || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading}>
            <Statistic
              title="Đang làm"
              value={stats?.overview.total_assessments_in_progress || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading}>
            <Statistic
              title="Tổng số lần làm"
              value={stats?.overview.total_attempts || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Performance Stats */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading}>
            <Statistic
              title="Điểm trung bình"
              value={stats?.performance.average_score || 0}
              precision={1}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading}>
            <Statistic
              title="Tỷ lệ đạt"
              value={stats?.performance.pass_rate || 0}
              precision={1}
              suffix="%"
              prefix={
                (stats?.performance.pass_rate || 0) >= 50 ? (
                  <RiseOutlined />
                ) : (
                  <FallOutlined />
                )
              }
              valueStyle={{
                color: (stats?.performance.pass_rate || 0) >= 50 ? '#52c41a' : '#f5222d',
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading}>
            <Statistic
              title="Điểm cao nhất"
              value={stats?.performance.highest_score || 0}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading}>
            <Statistic
              title="Điểm thấp nhất"
              value={stats?.performance.lowest_score || 0}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Attempts */}
      <Card
        title="Lần làm bài gần đây"
        style={{ marginTop: '24px' }}
        extra={
          <Button type="link" onClick={() => navigate('/student/history')}>
            Xem tất cả
          </Button>
        }
        loading={isLoading}
      >
        <Table
          columns={recentAttemptsColumns}
          dataSource={stats?.recent_attempts || []}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: 'Chưa có lần làm bài nào' }}
        />
      </Card>

      {/* Upcoming Assessments */}
      <Card
        title="Bài kiểm tra sắp tới"
        style={{ marginTop: '24px' }}
        extra={
          <Button type="link" onClick={() => navigate('/student/assessments')}>
            Xem tất cả
          </Button>
        }
        loading={isLoading}
      >
        <Table
          columns={upcomingColumns}
          dataSource={stats?.upcoming_assessments || []}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: 'Không có bài kiểm tra sắp tới' }}
        />
      </Card>

      {/* Quick Actions */}
      <Card title="Thao tác nhanh" style={{ marginTop: '24px' }}>
        <Space size="middle" wrap>
          <Button
            type="primary"
            icon={<BookOutlined />}
            onClick={() => navigate('/student/assessments')}
          >
            Xem bài kiểm tra
          </Button>
          <Button
            icon={<FileTextOutlined />}
            onClick={() => navigate('/student/history')}
          >
            Xem lịch sử
          </Button>
          <Button
            icon={<ClockCircleOutlined />}
            onClick={() => {
              // Navigate to in-progress attempts
              navigate('/student/history');
            }}
          >
            Tiếp tục làm bài
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default StudentDashboard;
