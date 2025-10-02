import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Typography,
  Modal,
  message,
  Tooltip,
  Row,
  Col,
  Card,
  Flex,
  Avatar,
} from 'antd';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import { elevation } from '../../styles/elevation';
import { cardColors } from '../../styles/cardColors';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileProtectOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { Assessment, AssessmentStatus } from '../../types';
import assessmentService from '../../services/assessmentService';
import dayjs from 'dayjs';
import { useThemeToken } from '../../theme/ThemeProvider';

const { Title, Text } = Typography;
const { Search } = Input;

const AssessmentList: React.FC = () => {
  const navigate = useNavigate();
  const token = useThemeToken();
  const [loading, setLoading] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    page: 1,
    size: 10,
    status: undefined as string | undefined,
    search: '',
  });

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: assessments.length,
      active: assessments.filter((a) => a.status === AssessmentStatus.Active).length,
      draft: assessments.filter((a) => a.status === AssessmentStatus.Draft).length,
      archived: assessments.filter((a) => a.status === AssessmentStatus.Archived).length,
    };
  }, [assessments]);

  useEffect(() => {
    fetchAssessments();
  }, [filters]);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const response = await assessmentService.getAssessments(filters);
      setAssessments(response.data);
      setTotal(response.total);
    } catch (error) {
      message.error('Không thể tải danh sách bài thi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bài thi này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await assessmentService.deleteAssessment(id);
          message.success('Xóa bài thi thành công');
          fetchAssessments();
        } catch (error) {
          message.error('Không thể xóa bài thi');
        }
      },
    });
  };

  const handlePublish = async (id: number) => {
    try {
      await assessmentService.publishAssessment(id);
      message.success('Xuất bản bài thi thành công');
      fetchAssessments();
    } catch (error) {
      message.error('Không thể xuất bản bài thi');
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await assessmentService.archiveAssessment(id);
      message.success('Lưu trữ bài thi thành công');
      fetchAssessments();
    } catch (error) {
      message.error('Không thể lưu trữ bài thi');
    }
  };

  const getStatusBadge = (status: AssessmentStatus) => {
    const statusMap: Record<AssessmentStatus, 'active' | 'draft' | 'archived' | 'pending'> = {
      [AssessmentStatus.Active]: 'active',
      [AssessmentStatus.Draft]: 'draft',
      [AssessmentStatus.Archived]: 'archived',
      [AssessmentStatus.Expired]: 'pending',
    };
    return <StatusBadge status={statusMap[status]} />;
  };

  const columns: ColumnsType<Assessment> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Link
            strong
            onClick={() => navigate(`/assessments/${record.id}`)}
          >
            {text}
          </Typography.Link>
          {record.description && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {record.description.length > 60
                ? `${record.description.substring(0, 60)}...`
                : record.description}
            </Typography.Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status) => getStatusBadge(status),
    },
    {
      title: 'Thông tin',
      key: 'info',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text style={{ fontSize: 12 }}>
            {record.question_count || 0} câu hỏi
          </Typography.Text>
          <Typography.Text style={{ fontSize: 12 }}>
            Thời gian: {record.duration} phút
          </Typography.Text>
          <Typography.Text style={{ fontSize: 12 }}>
            Điểm đạt: {record.passing_score}%
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Hạn nộp',
      dataIndex: 'due_date',
      key: 'due_date',
      width: 150,
      render: (date) =>
        date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="small">
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
          {record.status === AssessmentStatus.Draft && (
            <Tooltip title="Xuất bản">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => handlePublish(record.id)}
              />
            </Tooltip>
          )}
          {record.status === AssessmentStatus.Active && (
            <Tooltip title="Lưu trữ">
              <Button
                type="text"
                icon={<CloseCircleOutlined />}
                onClick={() => handleArchive(record.id)}
              />
            </Tooltip>
          )}
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Flex justify="space-between" align="center">
        <Space direction="vertical" size={4}>
          <Title level={2} style={{ margin: 0, fontWeight: 600 }}>
            <FileTextOutlined style={{ marginRight: 8 }} /> Quản lý bài thi
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Tạo và quản lý các bài kiểm tra đánh giá
          </Text>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate('/assessments/new')}
          style={{ fontWeight: 500, height: 44, borderRadius: 10, paddingLeft: 24, paddingRight: 24 }}
        >
          Tạo bài thi mới
        </Button>
      </Flex>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: cardColors.blue,
              borderRadius: 16,
              border: 'none',
              ...elevation[1],
            }}
            styles={{
              body: { padding: 20 },
            }}
          >
            <Flex vertical align="center" gap={12}>
              <Avatar
                size={44}
                icon={<FileTextOutlined style={{ fontSize: 20 }} />}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }}
              />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>
                {stats.total}
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>
                Tổng số bài thi
              </Text>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: cardColors.green,
              borderRadius: 16,
              border: 'none',
              ...elevation[1],
            }}
            styles={{
              body: { padding: 20 },
            }}
          >
            <Flex vertical align="center" gap={12}>
              <Avatar
                size={44}
                icon={<CheckCircleOutlined style={{ fontSize: 20 }} />}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }}
              />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>
                {stats.active}
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>
                Đang hoạt động
              </Text>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: cardColors.cyan,
              borderRadius: 16,
              border: 'none',
              ...elevation[1],
            }}
            styles={{
              body: { padding: 20 },
            }}
          >
            <Flex vertical align="center" gap={12}>
              <Avatar
                size={44}
                icon={<EditOutlined style={{ fontSize: 20 }} />}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }}
              />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>
                {stats.draft}
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>
                Nháp
              </Text>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: cardColors.orange,
              borderRadius: 16,
              border: 'none',
              ...elevation[1],
            }}
            styles={{
              body: { padding: 20 },
            }}
          >
            <Flex vertical align="center" gap={12}>
              <Avatar
                size={44}
                icon={<InboxOutlined style={{ fontSize: 20 }} />}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }}
              />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>
                {stats.archived}
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>
                Đã lưu trữ
              </Text>
            </Flex>
          </Card>
        </Col>
      </Row>

      <Card style={{ ...elevation[1], borderRadius: 16 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col flex="auto">
              <Search
                placeholder="Tìm kiếm theo tiêu đề..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={(value) =>
                  setFilters({ ...filters, search: value, page: 1 })
                }
              />
            </Col>
            <Col>
              <Select
                placeholder="Trạng thái"
                style={{ width: 180 }}
                size="large"
                allowClear
                onChange={(value) =>
                  setFilters({ ...filters, status: value, page: 1 })
                }
                options={[
                  { label: 'Nháp', value: AssessmentStatus.Draft },
                  { label: 'Đang hoạt động', value: AssessmentStatus.Active },
                  { label: 'Hết hạn', value: AssessmentStatus.Expired },
                  { label: 'Lưu trữ', value: AssessmentStatus.Archived },
                ]}
              />
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={assessments}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1200 }}
            pagination={{
              current: filters.page,
              pageSize: filters.size,
              total: total,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} bài thi`,
              onChange: (page, size) =>
                setFilters({ ...filters, page, size }),
            }}
          />
        </Space>
      </Card>
    </Space>
  );
};

export default AssessmentList;
