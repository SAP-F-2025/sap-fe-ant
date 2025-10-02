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
  Tag,
  Divider,
} from 'antd';
import { getStaggerDelay } from '../../styles/animations';
import { elevation } from '../../styles/elevation';
import {
  FileTextOutlined,
  QuestionCircleOutlined,
  BankOutlined,
  CheckCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  FallOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
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
import { mockAssessments, mockQuestions, mockQuestionBanks, mockAttempts } from '../../services/mockData';

const { Title, Text, Paragraph } = Typography;

/**
 * Modern Dashboard with Charts
 * Features:
 * - Interactive charts (Recharts)
 * - Real-time statistics
 * - Responsive grid layout
 * - Ant Design v5 components (Flex, Segmented, FloatButton)
 * - Color-coded metrics
 * - Trend indicators
 */

// Mock data for charts
const activityData = [
  { month: 'T1', attempts: 45, users: 120, score: 75 },
  { month: 'T2', attempts: 52, users: 135, score: 78 },
  { month: 'T3', attempts: 48, users: 128, score: 76 },
  { month: 'T4', attempts: 61, users: 148, score: 80 },
  { month: 'T5', attempts: 55, users: 142, score: 79 },
  { month: 'T6', attempts: 67, users: 156, score: 82 },
  { month: 'T7', attempts: 72, users: 165, score: 84 },
  { month: 'T8', attempts: 68, users: 160, score: 83 },
];

const questionTypeData = [
  { name: 'Trắc nghiệm', value: 450, color: '#1890ff' },
  { name: 'Đúng/Sai', value: 280, color: '#52c41a' },
  { name: 'Tự luận', value: 150, color: '#faad14' },
  { name: 'Điền khuyết', value: 120, color: '#eb2f96' },
  { name: 'Khác', value: 80, color: '#722ed1' },
];

const performanceData = [
  { subject: 'Toán học', score: 85 },
  { subject: 'Tiếng Anh', score: 78 },
  { subject: 'Lịch sử', score: 82 },
  { subject: 'Địa lý', score: 75 },
  { subject: 'Khoa học', score: 88 },
];

const recentActivities = [
  {
    id: 1,
    user: 'Nguyễn Văn A',
    action: 'hoàn thành bài thi',
    assessment: 'Toán học lớp 12',
    time: '5 phút trước',
    score: 85,
    type: 'success',
  },
  {
    id: 2,
    user: 'Trần Thị B',
    action: 'tạo câu hỏi mới',
    assessment: 'Ngân hàng Tiếng Anh',
    time: '12 phút trước',
    type: 'info',
  },
  {
    id: 3,
    user: 'Lê Văn C',
    action: 'bắt đầu bài thi',
    assessment: 'Lịch sử Việt Nam',
    time: '25 phút trước',
    type: 'processing',
  },
  {
    id: 4,
    user: 'Phạm Thị D',
    action: 'xuất bản bài thi',
    assessment: 'Địa lý tự nhiên',
    time: '1 giờ trước',
    type: 'warning',
  },
];

const Dashboard: React.FC = () => {
  const { token } = useThemeToken();
  const [timePeriod, setTimePeriod] = useState<string>('week');

  const stats = {
    assessments: mockAssessments.length,
    questions: mockQuestions.length,
    questionBanks: mockQuestionBanks.length,
    attempts: mockAttempts.length,
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%', animation: 'fadeIn 400ms ease-in-out' }}>
      {/* Header with Flex */}
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

      {/* Statistics Cards - Modern Design */}
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
            <Flex vertical align="center" gap={12}>
              <Avatar
                size={44}
                icon={<FileTextOutlined style={{ fontSize: 20 }} />}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }}
              />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>
                {stats.assessments}
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>
                Tổng số bài thi
              </Text>
            </Flex>
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
            <Flex vertical align="center" gap={12}>
              <Avatar
                size={44}
                icon={<QuestionCircleOutlined style={{ fontSize: 20 }} />}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }}
              />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>
                {stats.questions}
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>
                Tổng số câu hỏi
              </Text>
            </Flex>
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
            <Flex vertical align="center" gap={12}>
              <Avatar
                size={44}
                icon={<BankOutlined style={{ fontSize: 20 }} />}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }}
              />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>
                {stats.questionBanks}
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>
                Ngân hàng câu hỏi
              </Text>
            </Flex>
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
            <Flex vertical align="center" gap={12}>
              <Avatar
                size={44}
                icon={<CheckCircleOutlined style={{ fontSize: 20 }} />}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }}
              />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>
                {stats.attempts}
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>
                Lượt làm bài
              </Text>
            </Flex>
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
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={activityData}>
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
          </Card>
        </Col>

        {/* Pie Chart - Question Types */}
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
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={questionTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.name} (${entry.value})`}
                  labelLine={{ stroke: token.colorTextSecondary, strokeWidth: 1 }}
                >
                  {questionTypeData.map((entry, index) => (
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
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
                        <Text strong>{activity.user}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {activity.time}
                        </Text>
                      </Flex>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        {activity.action} <Text strong>{activity.assessment}</Text>
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
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: token.borderRadiusLG, ...elevation[1] }}>
            <Statistic
              title="Tỷ lệ hoàn thành"
              value={85.5}
              precision={1}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a', fontWeight: 600 }}
            />
            <Progress
              percent={85.5}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              showInfo={false}
              style={{ marginTop: 8 }}
              strokeWidth={8}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: token.borderRadiusLG, ...elevation[1] }}>
            <Statistic
              title="Điểm trung bình"
              value={78.3}
              precision={1}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff', fontWeight: 600 }}
            />
            <Progress
              percent={78.3}
              strokeColor="#1890ff"
              showInfo={false}
              style={{ marginTop: 8 }}
              strokeWidth={8}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: token.borderRadiusLG, ...elevation[1] }}>
            <Statistic
              title="Tỷ lệ đạt"
              value={72.8}
              precision={1}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#faad14', fontWeight: 600 }}
            />
            <Progress
              percent={72.8}
              strokeColor="#faad14"
              showInfo={false}
              style={{ marginTop: 8 }}
              strokeWidth={8}
            />
          </Card>
        </Col>
      </Row>

      {/* FloatButton for help */}
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
