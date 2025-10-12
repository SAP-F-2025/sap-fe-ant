import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Select,
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  Typography,
  Alert,
  Avatar,
  Spin,
} from 'antd';
import { DeleteOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  QuestionBankShare,
  QuestionBankSharePermission,
  ShareQuestionBankRequest,
  User,
} from '../../types';
import questionBankService from '../../services/questionBankService';
import { useSearchUsers } from '../../hooks/useUsers';
import { showSuccess, showError } from '../../utils/errorHandler';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

const { Text } = Typography;

interface Props {
  bankId: number;
  bankName: string;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

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

export const ShareQuestionBankModal: React.FC<Props> = ({
  bankId,
  bankName,
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [shares, setShares] = useState<QuestionBankShare[]>([]);
  const [fetchingShares, setFetchingShares] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 500);
  const { data: searchResults, isLoading: isSearching } = useSearchUsers(
    debouncedSearch,
    debouncedSearch.length > 0
  );

  useEffect(() => {
    if (visible) {
      fetchShares();
    } else {
      form.resetFields();
    }
  }, [visible, bankId]);

  const fetchShares = async () => {
    setFetchingShares(true);
    try {
      const data = await questionBankService.getQuestionBankShares(bankId);
      setShares(data);
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setFetchingShares(false);
    }
  };

  const handleShare = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const userIds = values.user_ids || [];

      if (userIds.length === 0) {
        showError('Vui lòng chọn ít nhất một người dùng');
        setLoading(false);
        return;
      }

      const data: ShareQuestionBankRequest = {
        user_ids: userIds,
        permission: values.permission,
      };

      await questionBankService.shareQuestionBank(bankId, data);
      showSuccess(`Đã chia sẻ ngân hàng với ${userIds.length} người dùng`);
      form.resetFields();
      setSearchQuery('');
      fetchShares();
      onSuccess?.();
    } catch (error) {
      // Error handled by interceptor or form validation
    } finally {
      setLoading(false);
    }
  };

  const handleUnshare = async (userId: string) => {
    try {
      await questionBankService.unshareQuestionBank(bankId, userId);
      showSuccess('Đã hủy chia sẻ');
      fetchShares();
      onSuccess?.();
    } catch (error) {
      // Error handled by interceptor
    }
  };

  const handleUpdatePermission = async (userId: string, permission: QuestionBankSharePermission) => {
    try {
      await questionBankService.updateSharePermission(bankId, userId, { permission });
      showSuccess('Đã cập nhật quyền');
      fetchShares();
      onSuccess?.();
    } catch (error) {
      // Error handled by interceptor
    }
  };

  const columns: ColumnsType<QuestionBankShare> = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar 
            src={record.user?.avatar_url} 
            icon={<UserOutlined />}
            size={40}
          />
          <Space direction="vertical" size={0}>
            <Text strong>{record.user?.full_name || record.user_id}</Text>
            {record.user?.email && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.user.email}
              </Text>
            )}
          </Space>
        </Space>
      ),
    },
    {
      title: 'Quyền',
      dataIndex: 'permission',
      width: 200,
      render: (permission: QuestionBankSharePermission, record) => (
        <Select
          value={permission}
          style={{ width: '100%' }}
          onChange={(value) => handleUpdatePermission(record.user_id, value)}
          options={Object.entries(permissionLabels).map(([key, label]) => ({
            value: key,
            label: (
              <Space>
                <Tag color={permissionColors[key as QuestionBankSharePermission]}>
                  {label}
                </Tag>
              </Space>
            ),
          }))}
        />
      ),
    },
    {
      title: 'Ngày chia sẻ',
      dataIndex: 'shared_at',
      width: 150,
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="Hủy chia sẻ?"
          description="Người dùng này sẽ không thể truy cập ngân hàng nữa"
          onConfirm={() => handleUnshare(record.user_id)}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <Button type="text" danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <UserAddOutlined />
          <span>Chia sẻ: {bankName}</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          message="Hướng dẫn chia sẻ"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Tìm kiếm người dùng theo tên hoặc email</li>
              <li><strong>Chỉ xem:</strong> Chỉ có thể xem câu hỏi</li>
              <li><strong>Có thể chỉnh sửa:</strong> Có thể xem và thêm/xóa câu hỏi</li>
              <li><strong>Toàn quyền:</strong> Có thể xem, chỉnh sửa, và xóa ngân hàng</li>
            </ul>
          }
          type="info"
          showIcon
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleShare}
          initialValues={{
            permission: QuestionBankSharePermission.ViewOnly,
          }}
        >
          <Form.Item
            label="Chọn người dùng"
            name="user_ids"
            rules={[{ required: true, message: 'Vui lòng chọn người dùng' }]}
            tooltip="Tìm kiếm và chọn người dùng để chia sẻ"
          >
            <Select
              mode="multiple"
              placeholder="Tìm kiếm theo tên hoặc email..."
              showSearch
              filterOption={false}
              onSearch={setSearchQuery}
              notFoundContent={isSearching ? <Spin size="small" /> : 'Không tìm thấy người dùng'}
              options={searchResults?.users.map((user: User) => ({
                value: user.id,
                label: (
                  <Space>
                    <Avatar size="small" src={user.avatar_url} icon={<UserOutlined />} />
                    <span>{user.full_name}</span>
                    <span style={{ color: '#999', fontSize: 12 }}>({user.email})</span>
                  </Space>
                ),
              }))}
            />
          </Form.Item>

          <Form.Item label="Quyền truy cập" name="permission">
            <Select
              options={Object.entries(permissionLabels).map(([key, label]) => ({
                value: key,
                label: (
                  <Space>
                    <Tag color={permissionColors[key as QuestionBankSharePermission]}>
                      {label}
                    </Tag>
                  </Space>
                ),
              }))}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<UserAddOutlined />}
              loading={loading}
              block
            >
              Chia sẻ
            </Button>
          </Form.Item>
        </Form>

        <div>
          <Typography.Title level={5}>
            Đã chia sẻ với ({shares.length})
          </Typography.Title>
          <Table
            columns={columns}
            dataSource={shares}
            rowKey="id"
            loading={fetchingShares}
            pagination={false}
            locale={{
              emptyText: 'Chưa chia sẻ với ai',
            }}
            size="small"
          />
        </div>
      </Space>
    </Modal>
  );
};

export default ShareQuestionBankModal;
