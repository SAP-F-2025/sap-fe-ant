import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  message,
  Card,
  Row,
  Col,
  Flex,
  Avatar,
  Select,
  Input,
} from 'antd';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import { elevation } from '../../styles/elevation';
import { cardColors } from '../../styles/cardColors';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  TrophyOutlined,
  FileSearchOutlined,
  SyncOutlined,
  UserOutlined,
  SearchOutlined,
  FilterOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { AttemptStatus, Assessment } from '../../types';
import dayjs from 'dayjs';
import { useThemeToken } from '../../theme/ThemeProvider';
import { gradingService, type AttemptListItem } from '../../services/gradingService';
import { assessmentService } from '../../services/assessmentService';

const { Title, Text } = Typography;
const { Search } = Input;

const GradingList: React.FC = () => {
  const navigate = useNavigate();
  const token = useThemeToken();
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState<AttemptListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // Filters
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [searchText, setSearchText] = useState('');
  const [assessmentFilter, setAssessmentFilter] = useState<number | undefined>(undefined);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  // Calculate statistics
  const stats = useMemo(() => {
    const graded = attempts.filter((a) => a.score !== undefined).length;
    const pending = attempts.filter(
      (a) => a.status === 'completed' && a.score === undefined
    ).length;
    const avgScore =
      graded > 0
        ? Math.round(
            attempts
              .filter((a) => a.score !== undefined)
              .reduce((sum, a) => sum + (a.score || 0), 0) / graded
          )
        : 0;
    return {
      total: attempts.length,
      graded,
      pending,
      avgScore,
    };
  }, [attempts]);

  useEffect(() => {
    fetchAttempts();
  }, [pagination.current, pagination.pageSize, statusFilter, assessmentFilter]);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await assessmentService.getAssessments({ page: 1, size: 100 });
      setAssessments(response.assessments || []);
    } catch (error) {
      console.error('Không thể tải danh sách bài thi', error);
    }
  };

  const fetchAttempts = async () => {
    try {
      setLoading(true);
      const response = await gradingService.getAttempts({
        page: pagination.current - 1, // API uses 0-indexed pages
        size: pagination.pageSize,
        status: statusFilter,
        assessment_id: assessmentFilter,
      });

      setAttempts(response.data); // Changed from 'attempts' to 'data'
      setTotal(response.total); // Changed from 'total_elements' to 'total'
    } catch (error) {
      message.error('Không thể tải danh sách bài làm');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination({
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'in-progress' | 'completed' | 'failed' | 'pending'> = {
      in_progress: 'in-progress',
      completed: 'completed',
      abandoned: 'failed',
      timeout: 'failed',
    };
    return <StatusBadge status={statusMap[status] || 'pending'} />;
  };

  const handleViewDetail = (attemptId: number) => {
    navigate(`/grading/${attemptId}`);
  };

  const handleAutoGradeAll = async () => {
    if (!assessmentFilter) {
      message.warning('Vui lòng chọn bài thi để chấm tự động');
      return;
    }

    try {
      setLoading(true);
      const result = await gradingService.autoGradeAssessment(assessmentFilter);
      message.success(
        `Đã xử lý ${result.processed_attempts} bài. Chấm tự động: ${result.auto_graded}, Cần chấm thủ công: ${result.manual_required}`
      );
      await fetchAttempts();
    } catch (error) {
      message.error('Không thể chấm điểm tự động');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<AttemptListItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Bài thi',
      dataIndex: ['assessment', 'title'],
      key: 'assessment',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.assessment?.title || `Bài thi #${record.assessment_id}`}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Điểm chuẩn: {record.assessment?.passing_score}%
          </Text>
        </Space>
      ),
    },
    {
      title: 'Học viên',
      dataIndex: ['student', 'full_name'],
      key: 'student',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar
            size="small"
            icon={<UserOutlined />}
            src={record.student?.avatar_url}
          />
          <Space direction="vertical" size={0}>
            <Text>{record.student?.full_name || `HV-${record.student_id}`}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.student?.email}
            </Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status) => getStatusBadge(status),
      filters: [
        { text: 'Đang làm', value: 'in_progress' },
        { text: 'Hoàn thành', value: 'completed' },
        { text: 'Bỏ cuộc', value: 'abandoned' },
        { text: 'Hết giờ', value: 'timeout' },
      ],
      filteredValue: statusFilter ? [statusFilter] : null,
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
      key: 'score',
      width: 120,
      align: 'center',
      sorter: (a, b) => (a.score || 0) - (b.score || 0),
      render: (score, record) => (
        <Space direction="vertical" size={0}>
          {score !== undefined ? (
            <>
              <Text strong style={{ fontSize: 18 }}>
                {score.toFixed(1)}
              </Text>
              {record.passed !== undefined && (
                record.passed ? (
                  <Tag color="success">Đạt</Tag>
                ) : (
                  <Tag color="error">Không đạt</Tag>
                )
              )}
            </>
          ) : (
            <Tag color="warning">Chưa chấm</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'started_at',
      key: 'started_at',
      width: 160,
      sorter: (a, b) => dayjs(a.started_at).unix() - dayjs(b.started_at).unix(),
      render: (date) => (
        <Space direction="vertical" size={0}>
          <Text>{dayjs(date).format('DD/MM/YYYY')}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(date).format('HH:mm:ss')}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Thời gian hoàn thành',
      dataIndex: 'completed_at',
      key: 'completed_at',
      width: 160,
      sorter: (a, b) => {
        if (!a.completed_at) return 1;
        if (!b.completed_at) return -1;
        return dayjs(a.completed_at).unix() - dayjs(b.completed_at).unix();
      },
      render: (date) => date ? (
        <Space direction="vertical" size={0}>
          <Text>{dayjs(date).format('DD/MM/YYYY')}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(date).format('HH:mm:ss')}
          </Text>
        </Space>
      ) : (
        <Text type="secondary">-</Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record.id)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Flex justify="space-between" align="center">
        <Space direction="vertical" size={4}>
          <Title level={2} style={{ margin: 0, fontWeight: 600 }}>
            <CheckCircleOutlined style={{ marginRight: 8 }} /> Chấm điểm
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Quản lý và chấm điểm bài làm của học viên
          </Text>
        </Space>
        <Space>
          <Button
            icon={<SyncOutlined />}
            onClick={fetchAttempts}
            loading={loading}
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            onClick={handleAutoGradeAll}
            disabled={!assessmentFilter}
          >
            Chấm tự động tất cả
          </Button>
        </Space>
      </Flex>

      {/* Filters */}
      <Card style={{ ...elevation[1], borderRadius: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" style={{ width: '100%' }} size={4}>
              <Text strong>Trạng thái</Text>
              <Select
                style={{ width: '100%' }}
                placeholder="Tất cả trạng thái"
                allowClear
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { label: 'Đang làm', value: 'in_progress' },
                  { label: 'Hoàn thành', value: 'completed' },
                  { label: 'Bỏ cuộc', value: 'abandoned' },
                  { label: 'Hết giờ', value: 'timeout' },
                ]}
              />
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" style={{ width: '100%' }} size={4}>
              <Text strong>Bài thi</Text>
              <Select
                style={{ width: '100%' }}
                placeholder="Tất cả bài thi"
                allowClear
                showSearch
                value={assessmentFilter}
                onChange={setAssessmentFilter}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={assessments.map(assessment => ({
                  label: assessment.title,
                  value: assessment.id,
                }))}
              />
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" style={{ width: '100%' }} size={4}>
              <Text strong>Tìm kiếm</Text>
              <Search
                placeholder="Tìm theo tên học viên..."
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={fetchAttempts}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: cardColors.geekblue, borderRadius: 16, ...elevation[1] }} styles={{ body: { padding: 20 } }}>
            <Flex vertical align="center" gap={12}>
              <Avatar size={44} icon={<FileSearchOutlined style={{ fontSize: 20 }} />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }} />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>{stats.total}</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>Tổng bài làm</Text>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: cardColors.green, borderRadius: 16, ...elevation[1] }} styles={{ body: { padding: 20 } }}>
            <Flex vertical align="center" gap={12}>
              <Avatar size={44} icon={<CheckCircleOutlined style={{ fontSize: 20 }} />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }} />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>{stats.graded}</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>Đã chấm</Text>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: cardColors.orange, borderRadius: 16, ...elevation[1] }} styles={{ body: { padding: 20 } }}>
            <Flex vertical align="center" gap={12}>
              <Avatar size={44} icon={<ClockCircleOutlined style={{ fontSize: 20 }} />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }} />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>{stats.pending}</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>Chờ chấm</Text>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: cardColors.volcano, borderRadius: 16, ...elevation[1] }} styles={{ body: { padding: 20 } }}>
            <Flex vertical align="center" gap={12}>
              <Avatar size={44} icon={<TrophyOutlined style={{ fontSize: 20 }} />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }} />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>{stats.avgScore}</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>Điểm trung bình</Text>
            </Flex>
          </Card>
        </Col>
      </Row>

      <Card style={{ ...elevation[1], borderRadius: 16 }}>
        <Table
          columns={columns}
          dataSource={attempts}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bài làm`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
        />
      </Card>
    </Space>
  );
};

export default GradingList;
