import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    Button,
    Space,
    Input,
    Select,
    Tag,
    Typography,
    Popconfirm,
    Tooltip,
    Row,
    Col,
    Card,
    Flex,
    Avatar,
    Modal,
    Form,
    message,
} from 'antd';
import { elevation } from '../../styles/elevation';
import { cardColors } from '../../styles/cardColors';
import type { ColumnsType } from 'antd/es/table';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined,
    TeamOutlined,
    UserOutlined,
    CrownOutlined,
} from '@ant-design/icons';
import { GroupResponse, GroupMemberRole, GroupCreateRequest } from '../../types';
import groupService from '../../services/groupService';
import dayjs from 'dayjs';
import { showError, showSuccess } from '../../utils/errorHandler';

const { Title, Text } = Typography;
const { Search } = Input;

const GroupList: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState<GroupResponse[]>([]);
    const [total, setTotal] = useState(0);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [form] = Form.useForm();
    const [filters, setFilters] = useState({
        page: 1,
        size: 10,
        type: undefined as string | undefined,
        search: '',
    });

    // Calculate statistics
    const stats = useMemo(() => {
        return {
            total: total,
            class: groups.filter((g) => g.type === 'class').length,
            studyGroup: groups.filter((g) => g.type === 'study-group').length,
            other: groups.filter((g) => !['class', 'study-group'].includes(g.type)).length,
        };
    }, [groups, total]);

    useEffect(() => {
        fetchGroups();
    }, [filters]);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await groupService.getGroups({
                page: filters.page,
                size: filters.size,
                type: filters.type,
                search: filters.search,
            });
            setGroups(response.groups || []);
            setTotal(response.total);
        } catch (error) {
            showError('Không thể tải danh sách nhóm');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await groupService.deleteGroup(id);
            showSuccess('Đã xóa nhóm thành công');
            fetchGroups();
        } catch (error) {
            // Error handled by interceptor
        }
    };

    const handleCreate = async (values: GroupCreateRequest) => {
        setCreateLoading(true);
        try {
            await groupService.createGroup(values);
            showSuccess('Đã tạo nhóm thành công');
            setCreateModalOpen(false);
            form.resetFields();
            fetchGroups();
        } catch (error) {
            // Error handled by interceptor
        } finally {
            setCreateLoading(false);
        }
    };

    const getRoleBadge = (role?: string) => {
        const roleMap: Record<string, { color: string; label: string }> = {
            [GroupMemberRole.Owner]: { color: 'gold', label: 'Chủ sở hữu' },
            [GroupMemberRole.CoOwner]: { color: 'blue', label: 'Đồng quản lý' },
            [GroupMemberRole.Member]: { color: 'default', label: 'Thành viên' },
        };
        if (!role) return null;
        const config = roleMap[role] || { color: 'default', label: role };
        return <Tag color={config.color}>{config.label}</Tag>;
    };

    const getTypeBadge = (type: string) => {
        const typeMap: Record<string, { color: string; label: string }> = {
            'class': { color: 'purple', label: 'Lớp học' },
            'study-group': { color: 'cyan', label: 'Nhóm học' },
        };
        const config = typeMap[type] || { color: 'default', label: type };
        return <Tag color={config.color}>{config.label}</Tag>;
    };

    const columns: ColumnsType<GroupResponse> = [
        {
            title: 'Tên nhóm',
            dataIndex: 'display_name',
            key: 'display_name',
            width: 280,
            render: (text, record) => (
                <Space direction="vertical" size={0}>
                    <Typography.Link
                        strong
                        onClick={() => navigate(`/groups/${record.id}`)}
                    >
                        {text || record.name}
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
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 120,
            render: (type) => getTypeBadge(type),
        },
        {
            title: 'Thành viên',
            dataIndex: 'member_count',
            key: 'member_count',
            width: 120,
            render: (count) => (
                <Space>
                    <TeamOutlined />
                    <Text>{count || 0} thành viên</Text>
                </Space>
            ),
        },
        {
            title: 'Vai trò của bạn',
            dataIndex: 'member_role',
            key: 'member_role',
            width: 140,
            render: (role) => getRoleBadge(role) || <Text type="secondary">—</Text>,
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
            width: 160,
            render: (_, record) => (
                <Space size="small" style={{ display: 'flex' }}>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/groups/${record.id}`)}
                        />
                    </Tooltip>
                    {record.can_edit && (
                        <Tooltip title="Chỉnh sửa">
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => navigate(`/groups/${record.id}/edit`)}
                            />
                        </Tooltip>
                    )}
                    {record.can_delete && (
                        <Popconfirm
                            title="Xóa nhóm?"
                            description="Bạn có chắc muốn xóa nhóm này?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                        >
                            <Tooltip title="Xóa">
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Flex justify="space-between" align="center">
                <Space direction="vertical" size={4}>
                    <Title level={2} style={{ margin: 0, fontWeight: 600 }}>
                        <TeamOutlined style={{ marginRight: 8 }} /> Quản lý nhóm
                    </Title>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                        Quản lý các nhóm học và lớp học trong hệ thống
                    </Text>
                </Space>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => setCreateModalOpen(true)}
                    style={{ fontWeight: 500, height: 44, borderRadius: 10, paddingLeft: 24, paddingRight: 24 }}
                >
                    Tạo nhóm mới
                </Button>
            </Flex>

            <Card style={{ ...elevation[1], borderRadius: 16 }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Row gutter={16}>
                        <Col flex="auto">
                            <Search
                                placeholder="Tìm kiếm nhóm..."
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
                                placeholder="Loại nhóm"
                                style={{ width: 160 }}
                                size="large"
                                allowClear
                                onChange={(value) =>
                                    setFilters({ ...filters, type: value, page: 1 })
                                }
                                options={[
                                    { label: 'Lớp học', value: 'class' },
                                    { label: 'Nhóm học', value: 'study-group' },
                                ]}
                            />
                        </Col>
                    </Row>

                    <Table
                        columns={columns}
                        dataSource={groups}
                        rowKey="id"
                        loading={loading}
                        scroll={{ x: 1000 }}
                        pagination={{
                            current: filters.page,
                            pageSize: filters.size,
                            total: total,
                            showSizeChanger: true,
                            showTotal: (total) => `Tổng: ${total} nhóm`,
                            onChange: (page, size) =>
                                setFilters({ ...filters, page, size }),
                        }}
                    />
                </Space>
            </Card>

            {/* Statistics Summary */}
            <Card bordered={false} style={{ ...elevation[1], borderRadius: 16, background: '#f5f5f5' }}>
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>Thống kê nhóm</Text>
                    <Row gutter={[12, 12]}>
                        <Col xs={12} sm={6}>
                            <Flex align="center" gap={8}>
                                <Avatar size={36} icon={<TeamOutlined style={{ fontSize: 16 }} />}
                                    style={{ backgroundColor: cardColors.blue, flexShrink: 0 }} />
                                <Space direction="vertical" size={0}>
                                    <Text style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{stats.total}</Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Tổng nhóm</Text>
                                </Space>
                            </Flex>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Flex align="center" gap={8}>
                                <Avatar size={36} icon={<CrownOutlined style={{ fontSize: 16 }} />}
                                    style={{ backgroundColor: cardColors.purple, flexShrink: 0 }} />
                                <Space direction="vertical" size={0}>
                                    <Text style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{stats.class}</Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Lớp học</Text>
                                </Space>
                            </Flex>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Flex align="center" gap={8}>
                                <Avatar size={36} icon={<UserOutlined style={{ fontSize: 16 }} />}
                                    style={{ backgroundColor: cardColors.cyan, flexShrink: 0 }} />
                                <Space direction="vertical" size={0}>
                                    <Text style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{stats.studyGroup}</Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Nhóm học</Text>
                                </Space>
                            </Flex>
                        </Col>
                    </Row>
                </Space>
            </Card>

            {/* Create Group Modal */}
            <Modal
                title="Tạo nhóm mới"
                open={createModalOpen}
                onCancel={() => {
                    setCreateModalOpen(false);
                    form.resetFields();
                }}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreate}
                    style={{ marginTop: 16 }}
                >
                    <Form.Item
                        name="name"
                        label="Mã nhóm"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mã nhóm' },
                            { pattern: /^[a-z0-9-]+$/, message: 'Chỉ chứa chữ thường, số và gạch ngang' }
                        ]}
                    >
                        <Input placeholder="vd: lop-12a1" />
                    </Form.Item>
                    <Form.Item
                        name="display_name"
                        label="Tên hiển thị"
                        rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị' }]}
                    >
                        <Input placeholder="vd: Lớp 12A1" />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={3} placeholder="Mô tả về nhóm..." />
                    </Form.Item>
                    <Form.Item name="type" label="Loại">
                        <Select
                            placeholder="Chọn loại nhóm"
                            options={[
                                { label: 'Lớp học', value: 'class' },
                                { label: 'Nhóm học', value: 'study-group' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setCreateModalOpen(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit" loading={createLoading}>
                                Tạo nhóm
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};

export default GroupList;
