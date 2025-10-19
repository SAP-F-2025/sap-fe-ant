import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Typography,
  Tooltip,
  Modal,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import teacherService from '../../services/teacherService';
import apiService from '../../services/api';
import type { Assessment, AssessmentStatus } from '../../types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { confirm } = Modal;

const MyAssessments: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  // Fetch assessments
  const { data, isLoading } = useQuery({
    queryKey: ['my-assessments', currentPage, pageSize, searchText, statusFilter],
    queryFn: () =>
      teacherService.getMyAssessments({
        page: currentPage,
        size: pageSize,
        search: searchText,
        status: statusFilter,
      }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiService.delete(`/api/v1/assessments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-assessments'] });
    },
  });

  const handleDelete = (id: number, title: string) => {
    confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa bài thi "${title}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: Assessment) => (
        <Space direction="vertical" size={0}>
          <Text strong>{title}</Text>
          {record.description && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.description.substring(0, 80)}
              {record.description.length > 80 ? '...' : ''}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: AssessmentStatus) => {
        const statusMap: Record<
          string,
          { color: string; text: string; icon: React.ReactNode }
        > = {
          Draft: { color: 'default', text: 'Nháp', icon: <EditOutlined /> },
          Active: { color: 'success', text: 'Hoạt động', icon: <CheckCircleOutlined /> },
          Expired: { color: 'warning', text: 'Hết hạn', icon: <ClockCircleOutlined /> },
          Archived: { color: 'default', text: 'Lưu trữ', icon: <FileTextOutlined /> },
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
      title: 'Câu hỏi',
      dataIndex: 'questions_count',
      key: 'questions_count',
      width: 100,
      align: 'center' as const,
      render: (count: number) => (
        <Text>{count || 0}</Text>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      align: 'center' as const,
      render: (duration: number) => <Text>{duration} phút</Text>,
    },
    {
      title: 'Điểm đạt',
      dataIndex: 'passing_score',
      key: 'passing_score',
      width: 100,
      align: 'center' as const,
      render: (score: number) => <Text>{score}%</Text>,
    },
    {
      title: 'Hạn nộp',
      dataIndex: 'due_date',
      key: 'due_date',
      width: 150,
      render: (date: string) =>
        date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-',
    },
    {
      title: 'Tạo lúc',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: Assessment) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/assessments/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/assessments/edit/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Xem tiến độ">
            <Button
              type="text"
              icon={<TeamOutlined />}
              onClick={() => navigate(`/teacher/student-progress`)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id, record.title)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16 }}>
        <Title level={2}>Bài thi của tôi</Title>
        <Text type="secondary">Quản lý các bài thi bạn đã tạo</Text>
      </div>

      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* Filters and Actions */}
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <Input
                placeholder="Tìm kiếm bài thi..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
                allowClear
              />
              <Select
                placeholder="Lọc theo trạng thái"
                style={{ width: 150 }}
                value={statusFilter}
                onChange={setStatusFilter}
                allowClear
              >
                <Select.Option value="Draft">Nháp</Select.Option>
                <Select.Option value="Active">Hoạt động</Select.Option>
                <Select.Option value="Expired">Hết hạn</Select.Option>
                <Select.Option value="Archived">Lưu trữ</Select.Option>
              </Select>
            </Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/assessments/new')}
            >
              Tạo bài thi mới
            </Button>
          </Space>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={data?.assessments || []}
            rowKey="id"
            loading={isLoading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: data?.total || 0,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size || 10);
              },
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} bài thi`,
            }}
            scroll={{ x: 1200 }}
            locale={{
              emptyText: 'Bạn chưa tạo bài thi nào',
            }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default MyAssessments;
