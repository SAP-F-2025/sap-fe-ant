import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  message,
  Tooltip,
  Card,
  Badge,
  Empty,
  Row,
  Col,
} from 'antd';
import { elevation } from '../../styles/elevation';
import type { ColumnsType } from 'antd/es/table';
import {
  EyeOutlined,
  ShareAltOutlined,
  UserOutlined,
  EyeInvisibleOutlined,
  EditOutlined,
  DeleteOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { QuestionBank, QuestionBankSharePermission } from '../../types';
import questionBankService from '../../services/questionBankService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const permissionLabels = {
  [QuestionBankSharePermission.ViewOnly]: 'Chỉ xem',
  [QuestionBankSharePermission.CanEdit]: 'Có thể chỉnh sửa',
  [QuestionBankSharePermission.CanDelete]: 'Toàn quyền',
};

const permissionColors = {
  [QuestionBankSharePermission.ViewOnly]: 'default',
  [QuestionBankSharePermission.CanEdit]: 'processing',
  [QuestionBankSharePermission.CanDelete]: 'warning',
};

const permissionIcons = {
  [QuestionBankSharePermission.ViewOnly]: <EyeInvisibleOutlined />,
  [QuestionBankSharePermission.CanEdit]: <EditOutlined />,
  [QuestionBankSharePermission.CanDelete]: <DeleteOutlined />,
};

const SharedQuestionBanks: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    page: 1,
    size: 10,
  });

  useEffect(() => {
    fetchSharedQuestionBanks();
  }, [filters]);

  const fetchSharedQuestionBanks = async () => {
    setLoading(true);
    try {
      const response = await questionBankService.getSharedQuestionBanks(filters);
      setQuestionBanks(response.banks);
      setTotal(response.total);
    } catch (error) {
      message.error('Không thể tải danh sách ngân hàng được chia sẻ');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<QuestionBank> = [
    {
      title: 'Tên ngân hàng',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <Typography.Text strong>{text}</Typography.Text>
            <Tooltip title={record.is_public ? 'Công khai' : 'Riêng tư'}>
              {record.is_public ? (
                <ShareAltOutlined style={{ color: '#52c41a' }} />
              ) : (
                <UserOutlined style={{ color: '#faad14' }} />
              )}
            </Tooltip>
          </Space>
          {record.description && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {record.description.length > 80
                ? `${record.description.substring(0, 80)}...`
                : record.description}
            </Typography.Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Số câu hỏi',
      dataIndex: 'question_count',
      key: 'question_count',
      width: 120,
      align: 'center',
      render: (count) => (
        <Badge
          count={count || 0}
          showZero
          color="#1890ff"
          style={{ fontSize: 14 }}
        />
      ),
    },
    {
      title: 'Quyền của tôi',
      key: 'permission',
      width: 150,
      render: (_, record: any) => {
        if (record.is_owner || record.access_level === 'owner') {
          return <Tag color="gold">Chủ sở hữu</Tag>;
        }
        const permission = record.can_delete
          ? QuestionBankSharePermission.CanDelete
          : record.can_edit
          ? QuestionBankSharePermission.CanEdit
          : QuestionBankSharePermission.ViewOnly;
        return (
          <Tag
            icon={permissionIcons[permission]}
            color={permissionColors[permission]}
          >
            {permissionLabels[permission]}
          </Tag>
        );
      },
    },
    {
      title: 'Người chia sẻ',
      key: 'creator',
      width: 150,
      render: (_, record: any) => (
        <Space>
          <UserOutlined />
          <Text>{record.creator?.full_name || 'N/A'}</Text>
        </Space>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/question-banks/${record.id}`)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Space direction="vertical" size={4}>
            <Title level={2} style={{ margin: 0, fontWeight: 600 }}>
              <ShareAltOutlined style={{ marginRight: 8 }} /> Được chia sẻ với tôi
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              Các ngân hàng câu hỏi mà người khác đã chia sẻ với bạn
            </Text>
          </Space>
        </Col>
        <Col>
          <Button
            icon={<RollbackOutlined />}
            onClick={() => navigate('/question-banks')}
          >
            Quay lại
          </Button>
        </Col>
      </Row>

      <Card style={{ ...elevation[1], borderRadius: 16 }}>
        {questionBanks.length === 0 && !loading ? (
          <Empty
            description={
              <Space direction="vertical" size="small">
                <Text type="secondary">Chưa có ngân hàng nào được chia sẻ với bạn</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Khi có người chia sẻ ngân hàng câu hỏi, nó sẽ xuất hiện ở đây
                </Text>
              </Space>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={questionBanks}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1000 }}
            pagination={{
              current: filters.page,
              pageSize: filters.size,
              total: total,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} ngân hàng`,
              onChange: (page, size) =>
                setFilters({ ...filters, page, size }),
            }}
          />
        )}
      </Card>
    </Space>
  );
};

export default SharedQuestionBanks;
