import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  Typography,
  Modal,
  message,
  Tooltip,
  Row,
  Col,
  Card,
  Badge,
  Flex,
  Avatar,
} from 'antd';
import { elevation } from '../../styles/elevation';
import { cardColors } from '../../styles/cardColors';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  BankOutlined,
  LockOutlined,
  UnlockOutlined,
  GlobalOutlined,
  FolderOutlined,
  ShareAltOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { QuestionBank } from '../../types';
import questionBankService from '../../services/questionBankService';
import dayjs from 'dayjs';
import { useThemeToken } from '../../theme/ThemeProvider';

const { Title, Text } = Typography;
const { Search } = Input;

const QuestionBankList: React.FC = () => {
  const navigate = useNavigate();
  const token = useThemeToken();
  const [loading, setLoading] = useState(false);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    page: 1,
    size: 10,
    search: '',
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const totalQuestions = questionBanks.reduce(
      (sum, bank) => sum + (bank.question_count || 0),
      0
    );
    return {
      total: questionBanks.length,
      public: questionBanks.filter((b) => b.is_public).length,
      private: questionBanks.filter((b) => !b.is_public).length,
      totalQuestions,
    };
  }, [questionBanks]);

  useEffect(() => {
    fetchQuestionBanks();
  }, [filters]);

  const fetchQuestionBanks = async () => {
    setLoading(true);
    try {
      const response = await questionBankService.getQuestionBanks(filters);
      setQuestionBanks(response.data);
      setTotal(response.total);
    } catch (error) {
      message.error('Không thể tải danh sách ngân hàng câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa ngân hàng câu hỏi này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await questionBankService.deleteQuestionBank(id);
          message.success('Xóa ngân hàng câu hỏi thành công');
          fetchQuestionBanks();
        } catch (error) {
          message.error('Không thể xóa ngân hàng câu hỏi');
        }
      },
    });
  };

  const handleShare = (id: number) => {
    Modal.info({
      title: 'Chia sẻ ngân hàng câu hỏi',
      content: (
        <div>
          <p>Tính năng chia sẻ sẽ được bổ sung trong phiên bản tiếp theo.</p>
          <p>Bạn có thể thay đổi trạng thái Công khai/Riêng tư trong trang chỉnh sửa.</p>
        </div>
      ),
      okText: 'Đóng',
    });
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
            {record.is_public ? (
              <Tooltip title="Công khai">
                <UnlockOutlined style={{ color: '#52c41a' }} />
              </Tooltip>
            ) : (
              <Tooltip title="Riêng tư">
                <LockOutlined style={{ color: '#faad14' }} />
              </Tooltip>
            )}
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
      title: 'Thẻ',
      dataIndex: 'tags',
      key: 'tags',
      width: 250,
      render: (tags) =>
        tags?.slice(0, 3).map((tag: string) => (
          <Tag key={tag} color="blue">
            {tag}
          </Tag>
        )),
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
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/question-banks/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/question-banks/edit/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chia sẻ">
            <Button
              type="text"
              icon={<ShareAltOutlined />}
              onClick={() => handleShare(record.id)}
            />
          </Tooltip>
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
            <BankOutlined style={{ marginRight: 8 }} /> Ngân hàng câu hỏi
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Quản lý và chia sẻ ngân hàng câu hỏi
          </Text>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate('/question-banks/new')}
          style={{ fontWeight: 500, height: 44, borderRadius: 10, paddingLeft: 24, paddingRight: 24 }}
        >
          Tạo ngân hàng mới
        </Button>
      </Flex>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: cardColors.cyan, borderRadius: 16, ...elevation[1] }} styles={{ body: { padding: 20 } }}>
            <Flex vertical align="center" gap={12}>
              <Avatar size={44} icon={<BankOutlined style={{ fontSize: 20 }} />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }} />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>{stats.total}</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>Tổng ngân hàng</Text>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: cardColors.blue, borderRadius: 16, ...elevation[1] }} styles={{ body: { padding: 20 } }}>
            <Flex vertical align="center" gap={12}>
              <Avatar size={44} icon={<GlobalOutlined style={{ fontSize: 20 }} />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }} />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>{stats.public}</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>Công khai</Text>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: cardColors.magenta, borderRadius: 16, ...elevation[1] }} styles={{ body: { padding: 20 } }}>
            <Flex vertical align="center" gap={12}>
              <Avatar size={44} icon={<LockOutlined style={{ fontSize: 20 }} />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }} />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>{stats.private}</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>Riêng tư</Text>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: cardColors.gold, borderRadius: 16, ...elevation[1] }} styles={{ body: { padding: 20 } }}>
            <Flex vertical align="center" gap={12}>
              <Avatar size={44} icon={<FolderOutlined style={{ fontSize: 20 }} />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }} />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>{stats.totalQuestions}</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>Tổng câu hỏi</Text>
            </Flex>
          </Card>
        </Col>
      </Row>

      <Card style={{ ...elevation[1], borderRadius: 16 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Search
            placeholder="Tìm kiếm ngân hàng câu hỏi..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={(value) =>
              setFilters({ ...filters, search: value, page: 1 })
            }
          />

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
        </Space>
      </Card>
    </Space>
  );
};

export default QuestionBankList;
