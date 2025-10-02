import React, { useState } from 'react';
import {
  Card,
  Space,
  Button,
  Input,
  Select,
  Tag,
  Typography,
  Form,
  Modal,
  Row,
  Col,
  Flex,
  Avatar,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  SearchOutlined,
  TeamOutlined,
  MailOutlined,
  SafetyOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { DataTable } from '../../components/DataTable/DataTable';
import type { DataTableColumn } from '../../components/DataTable/DataTable';
import { FormDrawer } from '../../components/FormDrawer/FormDrawer';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useBulkDeleteUsers,
  User,
  UserCreateInput,
  UsersQueryParams,
} from '../../hooks/useUsers';
import { useDebounce } from 'use-debounce';
import { z } from 'zod';
import { useThemeToken } from '../../theme/ThemeProvider';
import { cardColors } from '../../styles/cardColors';
import { elevation } from '../../styles/elevation';

const { Title, Text } = Typography;

// Validation schema
const userSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống').max(100, 'Tên quá dài'),
  email: z.string().email('Email không hợp lệ'),
  role: z.enum(['admin', 'teacher', 'student'], {
    errorMap: () => ({ message: 'Vai trò không hợp lệ' }),
  }),
  status: z.enum(['active', 'inactive']).optional(),
});

const UserManagement: React.FC = () => {
  const { token } = useThemeToken();

  // Query params state
  const [queryParams, setQueryParams] = useState<UsersQueryParams>({
    page: 1,
    size: 10,
    search: '',
    role: undefined,
    status: undefined,
    sortField: undefined,
    sortOrder: undefined,
  });

  // Debounced search
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  // Update search in query params
  React.useEffect(() => {
    setQueryParams((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  // Fetch users
  const { data, isLoading, refetch } = useUsers(queryParams);

  // Mutations
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const bulkDeleteMutation = useBulkDeleteUsers();

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // Row selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Get role color and icon
  const getRoleConfig = (role: string) => {
    const configs = {
      admin: { color: '#ff4d4f', icon: <SafetyOutlined />, label: 'Admin' },
      teacher: { color: '#1890ff', icon: <TeamOutlined />, label: 'Giáo viên' },
      student: { color: '#52c41a', icon: <UserOutlined />, label: 'Học sinh' },
    };
    return configs[role as keyof typeof configs] || configs.student;
  };

  // Table columns with modern design
  const columns: DataTableColumn<User>[] = [
    {
      key: 'user',
      title: 'Người dùng',
      width: 300,
      exportable: true,
      render: (_: any, record: User) => {
        const roleConfig = getRoleConfig(record.role);
        return (
          <Flex align="center" gap={token.marginSM}>
            <Avatar
              size={48}
              icon={roleConfig.icon}
              style={{
                backgroundColor: `${roleConfig.color}15`,
                color: roleConfig.color,
                border: `2px solid ${roleConfig.color}30`,
              }}
            />
            <Flex vertical gap={2}>
              <Text strong style={{ fontSize: 14 }}>
                {record.name}
              </Text>
              <Flex align="center" gap={4}>
                <MailOutlined style={{ fontSize: 12, color: token.colorTextTertiary }} />
                <Text type="secondary" style={{ fontSize: 12 }} copyable>
                  {record.email}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        );
      },
    },
    {
      key: 'role',
      title: 'Vai trò',
      dataIndex: 'role',
      width: 150,
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Giáo viên', value: 'teacher' },
        { text: 'Học sinh', value: 'student' },
      ],
      exportable: true,
      render: (role: string) => {
        const config = getRoleConfig(role);
        return (
          <Tag
            icon={config.icon}
            color={config.color}
            style={{
              padding: '4px 12px',
              fontSize: 13,
              borderRadius: token.borderRadiusLG,
            }}
          >
            {config.label}
          </Tag>
        );
      },
    },
    {
      key: 'status',
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      filters: [
        { text: 'Hoạt động', value: 'active' },
        { text: 'Không hoạt động', value: 'inactive' },
      ],
      exportable: true,
      render: (status: string) => (
        <Tag
          color={status === 'active' ? 'success' : 'default'}
          style={{
            padding: '4px 12px',
            fontSize: 13,
            borderRadius: token.borderRadiusLG,
          }}
        >
          {status === 'active' ? 'Hoạt động' : 'Ngưng hoạt động'}
        </Tag>
      ),
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 150,
      sorter: true,
      exportable: true,
      render: (date: string) => (
        <Text type="secondary">{new Date(date).toLocaleDateString('vi-VN')}</Text>
      ),
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: 120,
      fixed: 'right',
      exportable: false,
      hideable: false,
      render: (_: any, record: User) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: token.colorPrimary }}
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

  // Handlers
  const handlePageChange = (page: number, size: number) => {
    setQueryParams((prev) => ({ ...prev, page, size }));
  };

  const handleSortChange = (field: string | null, order: 'ascend' | 'descend' | null) => {
    setQueryParams((prev) => ({
      ...prev,
      sortField: field || undefined,
      sortOrder: order || undefined,
    }));
  };

  const handleFilterChange = (filters: Record<string, any>) => {
    setQueryParams((prev) => ({
      ...prev,
      role: filters.role?.[0],
      status: filters.status?.[0],
      page: 1,
    }));
  };

  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setDrawerOpen(true);
  };

  const handleSubmit = async (values: UserCreateInput) => {
    if (editingUser) {
      await updateMutation.mutateAsync({ ...values, id: editingUser.id });
    } else {
      await createMutation.mutateAsync(values);
    }
    setDrawerOpen(false);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa người dùng này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const handleBulkDelete = () => {
    const ids = selectedRowKeys as number[];
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa ${ids.length} người dùng đã chọn?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        bulkDeleteMutation.mutate(ids);
        setSelectedRowKeys([]);
      },
    });
  };

  // Statistics
  const stats = {
    total: data?.total || 0,
    admins: data?.data.filter((u) => u.role === 'admin').length || 0,
    teachers: data?.data.filter((u) => u.role === 'teacher').length || 0,
    students: data?.data.filter((u) => u.role === 'student').length || 0,
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Header */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={token.marginMD}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            <TeamOutlined /> Quản lý người dùng
          </Title>
          <Text type="secondary">Quản lý tất cả người dùng trong hệ thống</Text>
        </div>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          size="large"
          onClick={handleCreate}
          style={{
            borderRadius: token.borderRadiusLG,
            height: 40,
            paddingInline: token.paddingLG,
          }}
        >
          Thêm người dùng
        </Button>
      </Flex>

      {/* Quick Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ background: cardColors.purple, borderRadius: 16, ...elevation[1] }} styles={{ body: { padding: 20 } }}>
            <Flex vertical align="center" gap={12}>
              <Avatar size={44} icon={<TeamOutlined style={{ fontSize: 20 }} />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }} />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>{stats.total}</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>Tổng số</Text>
            </Flex>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ background: cardColors.red, borderRadius: 16, ...elevation[1] }} styles={{ body: { padding: 20 } }}>
            <Flex vertical align="center" gap={12}>
              <Avatar size={44} icon={<SafetyOutlined style={{ fontSize: 20 }} />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }} />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>{stats.admins}</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>Admin</Text>
            </Flex>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ background: cardColors.blue, borderRadius: 16, ...elevation[1] }} styles={{ body: { padding: 20 } }}>
            <Flex vertical align="center" gap={12}>
              <Avatar size={44} icon={<TeamOutlined style={{ fontSize: 20 }} />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }} />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>{stats.teachers}</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>Giáo viên</Text>
            </Flex>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ background: cardColors.green, borderRadius: 16, ...elevation[1] }} styles={{ body: { padding: 20 } }}>
            <Flex vertical align="center" gap={12}>
              <Avatar size={44} icon={<UserOutlined style={{ fontSize: 20 }} />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }} />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>{stats.students}</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>Học sinh</Text>
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card bordered={false} style={{ borderRadius: token.borderRadiusLG }}>
        <Flex gap={token.marginMD} wrap="wrap">
          <Input
            placeholder="Tìm kiếm theo tên hoặc email..."
            prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
            allowClear
            style={{ minWidth: 300, flex: 1 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="large"
          />
          <Select
            placeholder="Vai trò"
            style={{ width: 150 }}
            size="large"
            allowClear
            value={queryParams.role}
            onChange={(value) =>
              setQueryParams((prev) => ({ ...prev, role: value, page: 1 }))
            }
          >
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="teacher">Giáo viên</Select.Option>
            <Select.Option value="student">Học sinh</Select.Option>
          </Select>
          <Select
            placeholder="Trạng thái"
            style={{ width: 150 }}
            size="large"
            allowClear
            value={queryParams.status}
            onChange={(value) =>
              setQueryParams((prev) => ({ ...prev, status: value, page: 1 }))
            }
          >
            <Select.Option value="active">Hoạt động</Select.Option>
            <Select.Option value="inactive">Ngưng hoạt động</Select.Option>
          </Select>
        </Flex>
      </Card>

      {/* Data Table */}
      <Card bordered={false} style={{ borderRadius: token.borderRadiusLG }}>
        <DataTable<User>
          columns={columns}
          dataSource={data?.data}
          loading={isLoading}
          total={data?.total}
          currentPage={queryParams.page}
          pageSize={queryParams.size}
          onPageChange={handlePageChange}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={(keys) => setSelectedRowKeys(keys)}
          bulkActions={[
            {
              key: 'delete',
              label: 'Xóa đã chọn',
              icon: <DeleteOutlined />,
              danger: true,
              onClick: handleBulkDelete,
            },
          ]}
          exportFileName="users"
          onRefresh={() => refetch()}
          emptyText="Không có người dùng nào"
          emptyDescription="Bắt đầu bằng cách thêm người dùng mới"
        />
      </Card>

      {/* Form Drawer */}
      <FormDrawer<UserCreateInput>
        form={form}
        title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        schema={userSchema as any}
        loading={createMutation.isPending || updateMutation.isPending}
        submitText={editingUser ? 'Cập nhật' : 'Tạo'}
      >
        <Form.Item
          name="name"
          label="Tên đầy đủ"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Nhập tên người dùng"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Nhập email"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="Vai trò"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
        >
          <Select placeholder="Chọn vai trò" size="large">
            <Select.Option value="admin">
              <Space>
                <SafetyOutlined />
                Admin
              </Space>
            </Select.Option>
            <Select.Option value="teacher">
              <Space>
                <TeamOutlined />
                Giáo viên
              </Space>
            </Select.Option>
            <Select.Option value="student">
              <Space>
                <UserOutlined />
                Học sinh
              </Space>
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Trạng thái" initialValue="active">
          <Select size="large">
            <Select.Option value="active">Hoạt động</Select.Option>
            <Select.Option value="inactive">Ngưng hoạt động</Select.Option>
          </Select>
        </Form.Item>
      </FormDrawer>
    </Space>
  );
};

export default UserManagement;
