import React, { useState } from 'react';
import {
  Card,
  Table,
  Select,
  Space,
  Tag,
  Typography,
  Input,
  Button,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import teacherService from '../../services/teacherService';
import type { Assessment, Attempt } from '../../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { Option } = Select;

const StudentProgress: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAssessment, setSelectedAssessment] = useState<number | undefined>();
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch teacher's assessments
  const { data: assessmentsData, isLoading: loadingAssessments } = useQuery({
    queryKey: ['teacher-assessments'],
    queryFn: () => teacherService.getMyAssessments({ page: 1, size: 100 }),
  });

  // Fetch attempts for selected assessment
  const { data: attemptsData, isLoading: loadingAttempts } = useQuery({
    queryKey: ['assessment-attempts', selectedAssessment, currentPage],
    queryFn: () =>
      teacherService.getAssessmentAttempts(selectedAssessment!, {
        page: currentPage,
        size: pageSize,
      }),
    enabled: !!selectedAssessment,
  });

  // Fetch assessment stats
  const { data: assessmentStats } = useQuery({
    queryKey: ['assessment-attempts-stats', selectedAssessment],
    queryFn: () => teacherService.getAssessmentAttemptsStats(selectedAssessment!),
    enabled: !!selectedAssessment,
  });

  const columns = [
    {
      title: 'Học sinh',
      dataIndex: 'student_id',
      key: 'student_id',
      render: (studentId: string | number, record: Attempt) => (
        <Space>
          <UserOutlined />
          <Text strong>Student {studentId}</Text>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<
          string,
          { color: string; text: string; icon: React.ReactNode }
        > = {
          in_progress: {
            color: 'processing',
            text: 'Đang làm',
            icon: <ClockCircleOutlined />,
          },
          completed: {
            color: 'success',
            text: 'Hoàn thành',
            icon: <CheckCircleOutlined />,
          },
          abandoned: { color: 'default', text: 'Đã bỏ', icon: null },
          timeout: { color: 'error', text: 'Hết giờ', icon: null },
        };
        const mapped = statusMap[status] || {
          color: 'default',
          text: status,
          icon: null,
        };
        return (
          <Tag color={mapped.color} icon={mapped.icon}>
            {mapped.text}
          </Tag>
        );
      },
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
      key: 'score',
      sorter: (a: Attempt, b: Attempt) => (a.score || 0) - (b.score || 0),
      render: (score: number | undefined, record: Attempt) =>
        record.status === 'completed' && score !== undefined ? (
          <Text type={score >= 70 ? 'success' : 'danger'} strong>
            {score.toFixed(1)}%
          </Text>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: 'Kết quả',
      dataIndex: 'passed',
      key: 'passed',
      render: (passed: boolean | undefined, record: Attempt) =>
        record.status === 'completed' && passed !== undefined ? (
          <Tag color={passed ? 'success' : 'error'}>
            {passed ? 'Đạt' : 'Không đạt'}
          </Tag>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: 'Bắt đầu',
      dataIndex: 'started_at',
      key: 'started_at',
      sorter: (a: Attempt, b: Attempt) =>
        new Date(a.started_at).getTime() - new Date(b.started_at).getTime(),
      render: (date: string) => (
        <Space direction="vertical" size={0}>
          <Text>{dayjs(date).format('DD/MM/YYYY HH:mm')}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(date).fromNow()}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Hoàn thành',
      dataIndex: 'completed_at',
      key: 'completed_at',
      render: (date: string | undefined, record: Attempt) =>
        record.status === 'completed' && date ? (
          <Space direction="vertical" size={0}>
            <Text>{dayjs(date).format('DD/MM/YYYY HH:mm')}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {dayjs(date).fromNow()}
            </Text>
          </Space>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Attempt) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => navigate(`/grading/${record.id}`)}
          >
            Xem chi tiết
          </Button>
          {record.status === 'completed' && (
            <Button
              type="link"
              size="small"
              onClick={() => navigate(`/grading/${record.id}`)}
            >
              Chấm điểm
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const filteredData = attemptsData?.attempts || [];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Tiến độ học sinh</Title>
      <Text type="secondary">Theo dõi tiến độ làm bài của học sinh</Text>

      {/* Assessment Selection */}
      <Card style={{ marginTop: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Space style={{ width: '100%' }} size="middle">
            <Select
              style={{ width: 400 }}
              placeholder="Chọn bài thi để xem tiến độ"
              loading={loadingAssessments}
              value={selectedAssessment}
              onChange={setSelectedAssessment}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={assessmentsData?.assessments.map((assessment: Assessment) => ({
                label: assessment.title,
                value: assessment.id,
              }))}
            />
            <Input
              placeholder="Tìm kiếm học sinh..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          </Space>

          {/* Stats for selected assessment */}
          {selectedAssessment && assessmentStats && (
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Tổng lượt làm"
                    value={assessmentStats.total_attempts}
                    prefix={<FileTextOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Đã hoàn thành"
                    value={assessmentStats.completed_attempts}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Điểm trung bình"
                    value={assessmentStats.average_score}
                    precision={1}
                    suffix="%"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Tỷ lệ đạt"
                    value={assessmentStats.pass_rate}
                    precision={1}
                    suffix="%"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>
          )}
        </Space>
      </Card>

      {/* Attempts Table */}
      {selectedAssessment && (
        <Card style={{ marginTop: '24px' }}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            loading={loadingAttempts}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: attemptsData?.total || 0,
              onChange: (page) => setCurrentPage(page),
              showSizeChanger: false,
              showTotal: (total) => `Tổng ${total} lượt làm bài`,
            }}
            locale={{
              emptyText: 'Chưa có học sinh nào làm bài thi này',
            }}
          />
        </Card>
      )}

      {!selectedAssessment && (
        <Card style={{ marginTop: '24px' }}>
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
            }}
          >
            <FileTextOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
            <Title level={4} style={{ marginTop: 16 }}>
              Chọn bài thi để xem tiến độ
            </Title>
            <Text type="secondary">
              Vui lòng chọn một bài thi từ danh sách để xem tiến độ học sinh
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentProgress;
