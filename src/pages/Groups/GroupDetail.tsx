import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Card,
    Button,
    Space,
    Typography,
    Descriptions,
    Tag,
    Table,
    Avatar,
    Popconfirm,
    Tooltip,
    Modal,
    Form,
    Select,
    Divider,
    Flex,
    Spin,
    Empty,
    Row,
    Col,
    Tabs,
} from 'antd';
import { elevation } from '../../styles/elevation';
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    UserAddOutlined,
    TeamOutlined,
    CrownOutlined,
    UserOutlined,
    StarOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import {
    GroupResponse,
    GroupMemberResponse,
    GroupMemberRole,
    User,
} from '../../types';
import groupService from '../../services/groupService';
import userService from '../../services/userService';
import GroupAssessmentsTab from './GroupAssessmentsTab';
import dayjs from 'dayjs';
import { showError, showSuccess } from '../../utils/errorHandler';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

const GroupDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [group, setGroup] = useState<GroupResponse | null>(null);
    const [members, setMembers] = useState<GroupMemberResponse[]>([]);
    const [membersLoading, setMembersLoading] = useState(false);

    // Add member modal
    const [addMemberOpen, setAddMemberOpen] = useState(false);
    const [addMemberLoading, setAddMemberLoading] = useState(false);
    const [searchUsers, setSearchUsers] = useState<User[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [form] = Form.useForm();

    // Role change modal
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<GroupMemberResponse | null>(null);
    const [roleChangeLoading, setRoleChangeLoading] = useState(false);
    const [roleForm] = Form.useForm();

    const groupId = parseInt(id || '0');

    useEffect(() => {
        if (groupId) {
            fetchGroup();
            fetchMembers();
        }
    }, [groupId]);

    const fetchGroup = async () => {
        setLoading(true);
        try {
            const data = await groupService.getGroup(groupId);
            setGroup(data);
        } catch (error) {
            showError('Không thể tải thông tin nhóm');
            navigate('/groups');
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async () => {
        setMembersLoading(true);
        try {
            const data = await groupService.getMembers(groupId);
            setMembers(data || []);
        } catch (error) {
            showError('Không thể tải danh sách thành viên');
        } finally {
            setMembersLoading(false);
        }
    };

    const handleSearchUsers = async (search: string) => {
        if (search.length < 2) return;
        setSearchLoading(true);
        try {
            const response = await userService.searchUsers({ q: search, size: 10 });
            // Filter out existing members
            const existingIds = members.map(m => m.user_id);
            setSearchUsers((response.users || []).filter((u: User) => !existingIds.includes(u.id)));
        } catch (error) {
            // ignore
        } finally {
            setSearchLoading(false);
        }
    };

    const handleAddMember = async (values: { user_id: string; role?: string }) => {
        setAddMemberLoading(true);
        try {
            await groupService.addMember(groupId, { user_id: values.user_id, role: values.role });
            showSuccess('Đã thêm thành viên');
            setAddMemberOpen(false);
            form.resetFields();
            fetchMembers();
        } catch (error) {
            // handled by interceptor
        } finally {
            setAddMemberLoading(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        try {
            await groupService.removeMember(groupId, userId);
            showSuccess('Đã xóa thành viên');
            fetchMembers();
        } catch (error) {
            // handled by interceptor
        }
    };

    const openRoleModal = (member: GroupMemberResponse) => {
        setSelectedMember(member);
        roleForm.setFieldsValue({ role: member.role });
        setRoleModalOpen(true);
    };

    const handleChangeRole = async (values: { role: string }) => {
        if (!selectedMember) return;
        setRoleChangeLoading(true);
        try {
            await groupService.updateMemberRole(groupId, selectedMember.user_id, { role: values.role });
            showSuccess('Đã cập nhật vai trò');
            setRoleModalOpen(false);
            fetchMembers();
        } catch (error) {
            // handled by interceptor
        } finally {
            setRoleChangeLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await groupService.deleteGroup(groupId);
            showSuccess('Đã xóa nhóm');
            navigate('/groups');
        } catch (error) {
            // handled by interceptor
        }
    };

    const getRoleIcon = (role: GroupMemberRole) => {
        switch (role) {
            case GroupMemberRole.Owner:
                return <CrownOutlined style={{ color: '#faad14' }} />;
            case GroupMemberRole.CoOwner:
                return <StarOutlined style={{ color: '#1890ff' }} />;
            default:
                return <UserOutlined />;
        }
    };

    const getRoleTag = (role: GroupMemberRole) => {
        const config: Record<GroupMemberRole, { color: string; label: string }> = {
            [GroupMemberRole.Owner]: { color: 'gold', label: 'Chủ sở hữu' },
            [GroupMemberRole.CoOwner]: { color: 'blue', label: 'Đồng quản lý' },
            [GroupMemberRole.Member]: { color: 'default', label: 'Thành viên' },
        };
        return <Tag color={config[role]?.color}>{config[role]?.label || role}</Tag>;
    };

    const memberColumns: ColumnsType<GroupMemberResponse> = [
        {
            title: 'Thành viên',
            key: 'user',
            render: (_, record) => (
                <Flex align="center" gap={12}>
                    <Avatar
                        src={record.user?.avatar_url}
                        icon={<UserOutlined />}
                        size={40}
                    />
                    <Space direction="vertical" size={0}>
                        <Text strong>{record.user?.full_name || record.user_id}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {record.user?.email}
                        </Text>
                    </Space>
                </Flex>
            ),
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            width: 150,
            render: (role) => (
                <Space>
                    {getRoleIcon(role)}
                    {getRoleTag(role)}
                </Space>
            ),
        },
        {
            title: 'Ngày tham gia',
            dataIndex: 'joined_at',
            key: 'joined_at',
            width: 160,
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space>
                    {record.can_modify && record.role !== GroupMemberRole.Owner && (
                        <Tooltip title="Thay đổi vai trò">
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => openRoleModal(record)}
                            />
                        </Tooltip>
                    )}
                    {record.can_remove && (
                        <Popconfirm
                            title="Xóa thành viên?"
                            description="Bạn có chắc muốn xóa thành viên này?"
                            onConfirm={() => handleRemoveMember(record.user_id)}
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                        >
                            <Tooltip title="Xóa">
                                <Button type="text" danger icon={<DeleteOutlined />} />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    if (loading) {
        return (
            <Flex justify="center" align="center" style={{ minHeight: 400 }}>
                <Spin size="large" />
            </Flex>
        );
    }

    if (!group) {
        return <Empty description="Không tìm thấy nhóm" />;
    }

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Header */}
            <Flex justify="space-between" align="center">
                <Space>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/groups')}
                    >
                        Quay lại
                    </Button>
                    <Title level={2} style={{ margin: 0 }}>
                        <TeamOutlined style={{ marginRight: 8 }} />
                        {group.display_name || group.name}
                    </Title>
                </Space>
                <Space>
                    {group.can_edit && (
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/groups/${groupId}/edit`)}
                        >
                            Chỉnh sửa
                        </Button>
                    )}
                    {group.can_delete && (
                        <Popconfirm
                            title="Xóa nhóm?"
                            description="Hành động này không thể hoàn tác"
                            onConfirm={handleDelete}
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                        >
                            <Button danger icon={<DeleteOutlined />}>
                                Xóa nhóm
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            </Flex>

            {/* Group Info */}
            <Row gutter={16}>
                <Col xs={24} lg={8}>
                    <Card style={{ ...elevation[1], borderRadius: 16 }}>
                        <Title level={5}>Thông tin nhóm</Title>
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Mã nhóm">{group.name}</Descriptions.Item>
                            <Descriptions.Item label="Loại">
                                <Tag color={group.type === 'class' ? 'purple' : 'cyan'}>
                                    {group.type === 'class' ? 'Lớp học' : group.type}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Thành viên">
                                {group.member_count || 0}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày tạo">
                                {dayjs(group.created_at).format('DD/MM/YYYY')}
                            </Descriptions.Item>
                        </Descriptions>
                        {group.description && (
                            <>
                                <Divider style={{ margin: '12px 0' }} />
                                <Text type="secondary">{group.description}</Text>
                            </>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={16}>
                    {/* Tabs for Members and Assessments */}
                    <Card style={{ ...elevation[1], borderRadius: 16 }}>
                        <Tabs
                            defaultActiveKey="members"
                            items={[
                                {
                                    key: 'members',
                                    label: (
                                        <Space>
                                            <TeamOutlined />
                                            Thành viên ({members.length})
                                        </Space>
                                    ),
                                    children: (
                                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                            {group.can_manage && (
                                                <Flex justify="flex-end">
                                                    <Button
                                                        type="primary"
                                                        icon={<UserAddOutlined />}
                                                        onClick={() => setAddMemberOpen(true)}
                                                    >
                                                        Thêm thành viên
                                                    </Button>
                                                </Flex>
                                            )}
                                            <Table
                                                columns={memberColumns}
                                                dataSource={members}
                                                rowKey="id"
                                                loading={membersLoading}
                                                pagination={false}
                                                size="middle"
                                            />
                                        </Space>
                                    ),
                                },
                                {
                                    key: 'assessments',
                                    label: (
                                        <Space>
                                            <FileTextOutlined />
                                            Bài thi
                                        </Space>
                                    ),
                                    children: (
                                        <GroupAssessmentsTab
                                            groupId={groupId}
                                            canManage={group.can_manage}
                                        />
                                    ),
                                },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Add Member Modal */}
            <Modal
                title="Thêm thành viên"
                open={addMemberOpen}
                onCancel={() => {
                    setAddMemberOpen(false);
                    form.resetFields();
                    setSearchUsers([]);
                }}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleAddMember}>
                    <Form.Item
                        name="user_id"
                        label="Tìm người dùng"
                        rules={[{ required: true, message: 'Vui lòng chọn người dùng' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Nhập email hoặc tên để tìm..."
                            loading={searchLoading}
                            filterOption={false}
                            onSearch={handleSearchUsers}
                            notFoundContent={searchLoading ? <Spin size="small" /> : null}
                            options={searchUsers.map((u) => ({
                                label: (
                                    <Flex align="center" gap={8}>
                                        <Avatar size="small" src={u.avatar_url} icon={<UserOutlined />} />
                                        <span>{u.full_name} ({u.email})</span>
                                    </Flex>
                                ),
                                value: u.id,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Vai trò"
                        initialValue={GroupMemberRole.Member}
                    >
                        <Select
                            options={[
                                { label: 'Thành viên', value: GroupMemberRole.Member },
                                { label: 'Đồng quản lý', value: GroupMemberRole.CoOwner },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setAddMemberOpen(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit" loading={addMemberLoading}>
                                Thêm thành viên
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Change Role Modal */}
            <Modal
                title="Thay đổi vai trò"
                open={roleModalOpen}
                onCancel={() => setRoleModalOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={roleForm} layout="vertical" onFinish={handleChangeRole}>
                    <Form.Item
                        name="role"
                        label="Vai trò mới"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { label: 'Đồng quản lý', value: GroupMemberRole.CoOwner },
                                { label: 'Thành viên', value: GroupMemberRole.Member },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setRoleModalOpen(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit" loading={roleChangeLoading}>
                                Cập nhật
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};

export default GroupDetail;
