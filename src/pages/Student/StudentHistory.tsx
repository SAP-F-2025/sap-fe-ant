import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Input, Select } from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import studentService from '../../services/studentService';
import type { AttemptWithAssessment, AttemptStatus } from '../../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { Option } = Select;

const StudentHistory: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<AttemptStatus | undefined>();

  const { data, isLoading } = useQuery({
    queryKey: ['student-history', page, pageSize, statusFilter],
    queryFn: () =>
      studentService.getAttemptHistory({
        page,
        size: pageSize,
        status: statusFilter,
      }),
  });

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
      in_progress: {
        color: 'processing',
        icon: <ClockCircleOutlined />,
        text: 'Đang làm',
      },
      completed: {
        color: 'success',
        icon: <CheckCircleOutlined />,
        text: 'Đã hoàn thành',
      },
      abandoned: {
        color: 'default',
        icon: <CloseCircleOutlined />,
        text: 'Đã bỏ',
      },
      timeout: {
        color: 'error',
        icon: <ClockCircleOutlined />,
        text: 'Hết giờ',
      },
    };

    const statusInfo = statusMap[status] || {
      color: 'default',
      icon: null,
      text: status,
    };

    return (
      <Tag color={statusInfo.color} icon={statusInfo.icon}>
        {statusInfo.text}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Bài kiểm tra',
      dataIndex: 'assessment_title',
      key: 'assessment',
      render: (title: string) => (
        <div>
          <Text strong>{title || 'Không xác định'}</Text>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: 'Đang làm', value: 'in_progress' },
        { text: 'Đã hoàn thành', value: 'completed' },
        { text: 'Đã bỏ', value: 'abandoned' },
        { text: 'Hết giờ', value: 'timeout' },
      ],
      onFilter: (value: any, record: AttemptWithAssessment) => record.status === value,
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
      key: 'score',
      width: 100,
      render: (score: number | undefined, record: AttemptWithAssessment) => {
        if (record.status !== 'completed' || score === undefined) {
          return <Text type="secondary">-</Text>;
        }
        return (
          <Text type={record.passed ? 'success' : 'danger'} strong>
            {score.toFixed(1)}%
          </Text>
        );
      },
      sorter: (a: AttemptWithAssessment, b: AttemptWithAssessment) =>
        (a.score || 0) - (b.score || 0),
    },
    {
      title: 'Kết quả',
      dataIndex: 'passed',
      key: 'passed',
      width: 100,
      render: (passed: boolean | undefined, record: AttemptWithAssessment) => {
        if (record.status !== 'completed') {
          return <Text type="secondary">-</Text>;
        }
        return passed ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Đạt
          </Tag>
        ) : (
          <Tag color="error" icon={<CloseCircleOutlined />}>
            Không đạt
          </Tag>
        );
      },
    },
    {
      title: 'Bắt đầu',
      dataIndex: 'started_at',
      key: 'started_at',
      width: 180,
      render: (date: string) => (
        <div>
          <div>{dayjs(date).format('DD/MM/YYYY')}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {dayjs(date).format('HH:mm')}
          </Text>
        </div>
      ),
      sorter: (a: AttemptWithAssessment, b: AttemptWithAssessment) =>
        dayjs(a.started_at).unix() - dayjs(b.started_at).unix(),
      defaultSortOrder: 'descend' as const,
    },
    {
      title: 'Hoàn thành',
      dataIndex: 'completed_at',
      key: 'completed_at',
      width: 180,
      render: (date: string | undefined) =>
        date ? (
          <div>
            <div>{dayjs(date).format('DD/MM/YYYY')}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {dayjs(date).format('HH:mm')}
            </Text>
          </div>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: 'Thời gian',
      key: 'time_spent',
      width: 120,
      render: (_: any, record: AttemptWithAssessment) => {
        if (!record.completed_at) {
          return <Text type="secondary">-</Text>;
        }
        const duration = dayjs(record.completed_at).diff(dayjs(record.started_at), 'minute');
        return <Text>{duration} phút</Text>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: AttemptWithAssessment) => (
        <Space>
          {record.status === 'in_progress' ? (
            <Button
              type="primary"
              size="small"
              icon={<PlayCircleOutlined />}
              onClick={() => navigate(`/student/take/${record.id}`)}
            >
              Tiếp tục
            </Button>
          ) : (
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/student/results/${record.id}`)}
            >
              Xem
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>Lịch sử làm bài</Title>
        <Text type="secondary">Xem tất cả các lần làm bài đã qua và đang làm</Text>
      </div>

      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Filters */}
          <Space size="middle">
            <Select
              placeholder="Lọc theo trạng thái"
              allowClear
              style={{ width: 200 }}
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="in_progress">Đang làm</Option>
              <Option value="completed">Đã hoàn thành</Option>
              <Option value="abandoned">Đã bỏ</Option>
              <Option value="timeout">Hết giờ</Option>
            </Select>
          </Space>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={data?.data || []}
            rowKey="id"
            loading={isLoading}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: data?.total || 0,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} lần làm bài`,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
            scroll={{ x: 1200 }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default StudentHistory;
