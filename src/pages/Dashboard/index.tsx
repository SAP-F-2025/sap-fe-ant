import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Flex,
  Segmented,
  Progress,
  Avatar,
  Badge,
  FloatButton,
  Skeleton,
  Empty,
  Divider,
} from 'antd';
import { SimpleCameraTest } from '../../components/Proctoring/SimpleCameraTest';
import { useQuery } from '@tanstack/react-query';
import { getStaggerDelay } from '../../styles/animations';
import { elevation } from '../../styles/elevation';
import {
  FileTextOutlined,
  QuestionCircleOutlined,
  BankOutlined,
  CheckCircleOutlined,
  UserOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useThemeToken } from '../../theme/ThemeProvider';
import dashboardService from '../../services/dashboardService';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { token } = useThemeToken();
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'year'>('month');

  // React Query hooks with stale-while-revalidate
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getDashboardStats(),
    staleTime: 30000, // 30s
  });

  const { data: activityData = [], isLoading: activityLoading } = useQuery({
    queryKey: ['activity-trends', timePeriod],
    queryFn: () => dashboardService.getActivityTrends(timePeriod),
    staleTime: 60000,
  });

  const { data: questionTypeData = [], isLoading: questionLoading } = useQuery({
    queryKey: ['question-distribution'],
    queryFn: () => dashboardService.getQuestionDistribution(),
    staleTime: 300000,
  });

  const { data: performanceData = [], isLoading: performanceLoading } = useQuery({
    queryKey: ['performance-by-subject'],
    queryFn: () => dashboardService.getPerformanceBySubject(5),
    staleTime: 60000,
  });

  const { data: recentActivities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: () => dashboardService.getRecentActivities(4),
    staleTime: 10000,
    refetchInterval: 30000,
  });

  const getActionText = (action: string) => {
    const actionMap: Record<string, string> = {
      completed_assessment: 'hoàn thành bài thi',
      started_assessment: 'bắt đầu bài thi',
      created_question: 'tạo câu hỏi mới',
      created_assessment: 'tạo bài thi mới',
      published_assessment: 'xuất bản bài thi',
    };
    return actionMap[action] || action;
  };

  // Map data for charts
  const questionChartData = questionTypeData.map((item, index) => ({
    name: item.name,
    value: item.count,
    color: ['#1890ff', '#52c41a', '#faad14', '#eb2f96', '#722ed1'][index % 5],
  }));

  const performanceChartData = performanceData.map(item => ({
    subject: item.subject_name,
    score: item.average_score,
  }));

  const activityChartData = activityData.map(item => ({
    month: item.period,
    attempts: item.attempts,
    users: item.users,
    score: item.average_score,
  }));

  return (
    <Space direction="vertical" size="large" style={{ width: '100%', animation: 'fadeIn 400ms ease-in-out' }}>
      {/* Header */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={token.marginMD}>
        <Space direction="vertical" size={4}>
          <Title level={2} style={{ margin: 0, fontWeight: 600 }}>
            Dashboard
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>Tổng quan hệ thống đánh giá</Text>
        </Space>
        <Segmented
          options={[
            { label: 'Tuần này', value: 'week' },
            { label: 'Tháng này', value: 'month' },
            { label: 'Năm nay', value: 'year' },
          ]}
          value={timePeriod}
          onChange={setTimePeriod}
          style={{ borderRadius: 8 }}
        />
      </Flex>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6} style={{ animationDelay: getStaggerDelay(0) }}>
          <Card
            bordered={false}
            style={{
              background: '#1890ff',
              borderRadius: 16,
              border: 'none',
              ...elevation[1],
            }}
            styles={{ body: { padding: 20 } }}
          >
            {!stats ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <Flex vertical align="center" gap={12}>
                <Avatar
                  size={44}
                  icon={<FileTextOutlined style={{ fontSize: 20 }} />}
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }}
                />
                <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>
                  {stats.overview.total_assessments}
                </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>
                  Tổng số bài thi
                </Text>
              </Flex>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6} style={{ animationDelay: getStaggerDelay(1) }}>
          <Card
            bordered={false}
            style={{
              background: '#52c41a',
              borderRadius: 16,
              border: 'none',
              ...elevation[1],
            }}
            styles={{ body: { padding: 20 } }}
          >
            {!stats ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <Flex vertical align="center" gap={12}>
                <Avatar
                  size={44}
                  icon={<QuestionCircleOutlined style={{ fontSize: 20 }} />}
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }}
                />
                <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>
                  {stats.overview.total_questions}
                </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>
                  Tổng số câu hỏi
                </Text>
              </Flex>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6} style={{ animationDelay: getStaggerDelay(2) }}>
          <Card
            bordered={false}
            style={{
              background: '#13c2c2',
              borderRadius: 16,
              border: 'none',
              ...elevation[1],
            }}
            styles={{ body: { padding: 20 } }}
          >
            {!stats ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <Flex vertical align="center" gap={12}>
                <Avatar
                  size={44}
                  icon={<BankOutlined style={{ fontSize: 20 }} />}
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }}
                />
                <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>
                  {stats.overview.total_question_banks}
                </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>
                  Ngân hàng câu hỏi
                </Text>
              </Flex>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6} style={{ animationDelay: getStaggerDelay(3) }}>
          <Card
            bordered={false}
            style={{
              background: '#faad14',
              borderRadius: 16,
              border: 'none',
              ...elevation[1],
            }}
            styles={{ body: { padding: 20 } }}
          >
            {!stats ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <Flex vertical align="center" gap={12}>
                <Avatar
                  size={44}
                  icon={<CheckCircleOutlined style={{ fontSize: 20 }} />}
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }}
                />
                <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>
                  {stats.overview.total_attempts}
                </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>
                  Lượt làm bài
                </Text>
              </Flex>
            )}
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]}>
        {/* Activity Chart */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <TrophyOutlined style={{ fontSize: 18, color: token.colorPrimary }} />
                <span style={{ fontWeight: 600 }}>Hoạt động & Điểm số</span>
              </Space>
            }
            bordered={false}
            style={{ borderRadius: token.borderRadiusLG, ...elevation[2] }}
          >
            {activityLoading ? (
              <Skeleton active paragraph={{ rows: 8 }} />
            ) : activityData.length === 0 ? (
              <Empty description="Chưa có dữ liệu hoạt động" style={{ padding: '60px 0' }} />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={activityChartData}>
                  <defs>
                    <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#52c41a" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#52c41a" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={token.colorBorderSecondary} opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    stroke={token.colorTextSecondary}
                    style={{ fontSize: 12, fontWeight: 500 }}
                  />
                  <YAxis 
                    stroke={token.colorTextSecondary}
                    style={{ fontSize: 12, fontWeight: 500 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: token.colorBgContainer,
                      border: `1px solid ${token.colorBorder}`,
                      borderRadius: token.borderRadius,
                      ...elevation[3],
                    }}
                  />
                  <Legend wrapperStyle={{ fontWeight: 500 }} />
                  <Area
                    type="monotone"
                    dataKey="attempts"
                    stroke="#1890ff"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAttempts)"
                    name="Lượt làm bài"
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#52c41a"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    name="Điểm TB"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        {/* Pie Chart */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <QuestionCircleOutlined style={{ fontSize: 18, color: token.colorSuccess }} />
                <span style={{ fontWeight: 600 }}>Phân bổ loại câu hỏi</span>
              </Space>
            }
            bordered={false}
            style={{ borderRadius: token.borderRadiusLG, ...elevation[2] }}
          >
            {questionLoading ? (
              <Skeleton active paragraph={{ rows: 8 }} />
            ) : questionTypeData.length === 0 ? (
              <Empty description="Chưa có dữ liệu câu hỏi" style={{ padding: '60px 0' }} />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={questionChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={(entry) => `${entry.name} (${entry.value})`}
                    labelLine={{ stroke: token.colorTextSecondary, strokeWidth: 1 }}
                  >
                    {questionChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: token.colorBgContainer,
                      border: `1px solid ${token.colorBorder}`,
                      borderRadius: token.borderRadius,
                      ...elevation[3],
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

      {/* Performance & Activities Row */}
      <Row gutter={[16, 16]}>
        {/* Performance by Subject */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <RiseOutlined style={{ fontSize: 18, color: token.colorWarning }} />
                <span style={{ fontWeight: 600 }}>Điểm số theo môn học</span>
              </Space>
            }
            bordered={false}
            style={{ borderRadius: token.borderRadiusLG, ...elevation[2] }}
          >
            {performanceLoading ? (
              <Skeleton active paragraph={{ rows: 8 }} />
            ) : performanceData.length === 0 ? (
              <Empty description="Chưa có dữ liệu điểm số" style={{ padding: '60px 0' }} />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={token.colorBorderSecondary} opacity={0.3} />
                  <XAxis 
                    dataKey="subject" 
                    stroke={token.colorTextSecondary}
                    style={{ fontSize: 12, fontWeight: 500 }}
                  />
                  <YAxis 
                    stroke={token.colorTextSecondary}
                    style={{ fontSize: 12, fontWeight: 500 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: token.colorBgContainer,
                      border: `1px solid ${token.colorBorder}`,
                      borderRadius: token.borderRadius,
                      ...elevation[3],
                    }}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="#1890ff" 
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined style={{ fontSize: 18, color: token.colorInfo }} />
                <span style={{ fontWeight: 600 }}>Hoạt động gần đây</span>
              </Space>
            }
            bordered={false}
            style={{ borderRadius: token.borderRadiusLG, height: '100%', ...elevation[2] }}
          >
            {activitiesLoading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : recentActivities.length === 0 ? (
              <Empty description="Chưa có hoạt động nào" style={{ padding: '40px 0' }} />
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {recentActivities.map((activity, index) => (
                  <Card
                    key={activity.id}
                    size="small"
                    bordered={false}
                    style={{ 
                      backgroundColor: token.colorBgLayout,
                      ...elevation[1],
                      animation: 'fadeIn 400ms ease-in-out',
                      animationDelay: getStaggerDelay(index, 100),
                    }}
                  >
                    <Flex gap={token.marginMD} align="start">
                      <Avatar
                        icon={<UserOutlined />}
                        style={{ backgroundColor: token.colorPrimary, ...elevation[1] }}
                      />
                      <Flex vertical style={{ flex: 1 }} gap={4}>
                        <Flex justify="space-between" align="start" wrap="wrap">
                          <Text strong>{activity.user_name}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {activity.time_ago}
                          </Text>
                        </Flex>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {getActionText(activity.action)}{' '}
                          <Text strong>
                            {activity.assessment_title || activity.question_bank_name || ''}
                          </Text>
                        </Text>
                        {activity.score && (
                          <Badge
                            count={`${activity.score} điểm`}
                            style={{
                              backgroundColor: '#52c41a',
                              marginTop: 4,
                            }}
                          />
                        )}
                      </Flex>
                    </Flex>
                  </Card>
                ))}
              </Space>
            )}
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: token.borderRadiusLG, ...elevation[1] }}>
            {!stats ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <>
                <Statistic
                  title="Tỷ lệ hoàn thành"
                  value={stats.metrics.completion_rate}
                  precision={1}
                  suffix="%"
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#52c41a', fontWeight: 600 }}
                />
                <Progress
                  percent={stats.metrics.completion_rate}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                  showInfo={false}
                  style={{ marginTop: 8 }}
                  strokeWidth={8}
                />
              </>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: token.borderRadiusLG, ...elevation[1] }}>
            {!stats ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <>
                <Statistic
                  title="Điểm trung bình"
                  value={stats.metrics.average_score}
                  precision={1}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#1890ff', fontWeight: 600 }}
                />
                <Progress
                  percent={stats.metrics.average_score}
                  strokeColor="#1890ff"
                  showInfo={false}
                  style={{ marginTop: 8 }}
                  strokeWidth={8}
                />
              </>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: token.borderRadiusLG, ...elevation[1] }}>
            {!stats ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <>
                <Statistic
                  title="Tỷ lệ đạt"
                  value={stats.metrics.pass_rate}
                  precision={1}
                  suffix="%"
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: '#faad14', fontWeight: 600 }}
                />
                <Progress
                  percent={stats.metrics.pass_rate}
                  strokeColor="#faad14"
                  showInfo={false}
                  style={{ marginTop: 8 }}
                  strokeWidth={8}
                />
              </>
            )}
          </Card>
        </Col>
      </Row>

      {/* Camera Test */}
      {/* <Divider>Camera Test</Divider>
      <SimpleCameraTest /> */}

      {/* FloatButton */}
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24, bottom: 24 }}
        icon={<CustomerServiceOutlined />}
      >
        <FloatButton
          tooltip="Hướng dẫn"
          icon={<QuestionCircleOutlined />}
        />
        <FloatButton
          tooltip="Báo cáo"
          icon={<FileTextOutlined />}
        />
      </FloatButton.Group>
    </Space>
  );
};

export default Dashboard;
