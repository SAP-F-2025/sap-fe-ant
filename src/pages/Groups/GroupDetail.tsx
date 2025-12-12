import {
	ArrowLeftOutlined,
	CheckCircleOutlined,
	CrownOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	FileTextOutlined,
	LogoutOutlined,
	ShareAltOutlined,
	StarOutlined,
	TeamOutlined,
	UserAddOutlined,
	UserOutlined,
} from '@ant-design/icons';
import {
	Avatar,
	Button,
	Card,
	Col,
	Divider,
	Empty,
	Flex,
	Form,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Spin,
	Table,
	Tabs,
	Tag,
	Tooltip,
	Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import groupService from '../../services/groupService';
import userService from '../../services/userService';
import { elevation } from '../../styles/elevation';
import { GroupMemberResponse, GroupMemberRole, GroupResponse, User } from '../../types';
import { showError, showSuccess } from '../../utils/errorHandler';
import InviteManagementTab from '../../components/Groups/InviteManagementTab';
import GroupAssessmentsTab from './GroupAssessmentsTab';
import GroupGradingTab from './GroupGradingTab';
import GroupProctoringTab from './GroupProctoringTab';

const { Title, Text } = Typography;

const GroupDetail: React.FC = () => {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const location = useLocation();
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

	// Leave group
	const [leaveLoading, setLeaveLoading] = useState(false);

	const groupId = parseInt(id || '0');

	// Detect if we're in student context
	const isStudentContext = location.pathname.startsWith('/student');
	const basePath = isStudentContext ? '/student/groups' : '/groups';

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
			showError(t('groups.loadDetailError'));
			navigate(basePath);
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
			showError(t('groups.members.loadError'));
		} finally {
			setMembersLoading(false);
		}
	};

	const handleSearchUsers = async (search: string) => {
		if (search.length < 2) return;
		setSearchLoading(true);
		try {
			const response = await userService.searchUsers({
				q: search,
				size: 10,
			});
			// Filter out existing members
			const existingIds = members.map((m) => m.user_id);
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
			await groupService.addMember(groupId, {
				user_id: values.user_id,
				role: values.role,
			});
			showSuccess(t('groups.addMemberSuccess'));
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
			showSuccess(t('groups.removeMemberSuccess'));
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
			await groupService.updateMemberRole(groupId, selectedMember.user_id, {
				role: values.role,
			});
			showSuccess(t('groups.changeRoleSuccess'));
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
			showSuccess(t('groups.deleteSuccess'));
			navigate(basePath);
		} catch (error) {
			// handled by interceptor
		}
	};

	const handleLeaveGroup = async () => {
		setLeaveLoading(true);
		try {
			await groupService.leaveGroup(groupId);
			showSuccess(t('groups.leave.success'));
			navigate(basePath);
		} catch (error: any) {
			const msg = error?.response?.data?.message || '';
			if (msg.includes('owner')) {
				showError(t('groups.leave.ownerError'));
			}
		} finally {
			setLeaveLoading(false);
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
		const config: Record<GroupMemberRole, { color: string; labelKey: string }> = {
			[GroupMemberRole.Owner]: {
				color: 'gold',
				labelKey: 'groups.role.owner',
			},
			[GroupMemberRole.CoOwner]: {
				color: 'blue',
				labelKey: 'groups.role.coOwner',
			},
			[GroupMemberRole.Member]: {
				color: 'default',
				labelKey: 'groups.role.member',
			},
		};
		return <Tag color={config[role]?.color}>{t(config[role]?.labelKey) || role}</Tag>;
	};

	const memberColumns: ColumnsType<GroupMemberResponse> = [
		{
			title: t('groups.members.name'),
			key: 'user',
			render: (_, record) => (
				<Flex align="center" gap={12}>
					<Avatar src={record.user?.avatar_url} icon={<UserOutlined />} size={40} />
					<Space direction="vertical" size={0}>
						<Text strong>
							{record.user?.full_name ||
								record.user?.email ||
								t('groups.members.unknownUser')}
						</Text>
						{record.user?.email && record.user?.full_name && (
							<Text type="secondary" style={{ fontSize: 12 }}>
								{record.user.email}
							</Text>
						)}
					</Space>
				</Flex>
			),
		},
		{
			title: t('groups.columns.role'),
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
			title: t('groups.columns.joinedAt'),
			dataIndex: 'joined_at',
			key: 'joined_at',
			width: 160,
			render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
		},
		{
			title: t('groups.columns.actions'),
			key: 'actions',
			width: 120,
			render: (_, record) => (
				<Space>
					{record.can_modify && record.role !== GroupMemberRole.Owner && (
						<Tooltip title={t('groups.members.changeRole')}>
							<Button
								type="text"
								icon={<EditOutlined />}
								onClick={() => openRoleModal(record)}
							/>
						</Tooltip>
					)}
					{record.can_remove && (
						<Popconfirm
							title={t('groups.members.removeConfirm.title')}
							description={t('groups.members.removeConfirm.content', {
								name: record.user?.full_name || record.user_id,
							})}
							onConfirm={() => handleRemoveMember(record.user_id)}
							okText={t('groups.members.removeConfirm.okText')}
							cancelText={t('groups.members.removeConfirm.cancelText')}
							okButtonProps={{ danger: true }}
						>
							<Tooltip title={t('groups.members.remove')}>
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
		return <Empty description={t('groups.empty.title')} />;
	}

	return (
		<Space direction="vertical" size="large" style={{ width: '100%' }}>
			{/* Header */}
			<Flex justify="space-between" align="flex-start" wrap="wrap" gap={12}>
				<Space direction="vertical" size={4}>
					<Button
						icon={<ArrowLeftOutlined />}
						onClick={() => navigate(basePath)}
						size="small"
					>
						{t('groups.detail.backToList')}
					</Button>
					<Title level={3} style={{ margin: 0, wordBreak: 'break-word' }}>
						<TeamOutlined style={{ marginRight: 8 }} />
						{group.display_name || group.name}
					</Title>
				</Space>
				<Space size={8} wrap>
					{group.can_edit && (
						<Tooltip title={t('groups.tooltip.edit')}>
							<Button
								icon={<EditOutlined />}
								onClick={() => navigate(`${basePath}/${groupId}/edit`)}
							/>
						</Tooltip>
					)}
					{group.can_delete && (
						<Popconfirm
							title={t('groups.deleteConfirm.title')}
							description={t('groups.deleteConfirm.warning')}
							onConfirm={handleDelete}
							okText={t('groups.deleteConfirm.okText')}
							cancelText={t('groups.deleteConfirm.cancelText')}
							okButtonProps={{ danger: true }}
						>
							<Tooltip title={t('groups.tooltip.delete')}>
								<Button danger icon={<DeleteOutlined />} />
							</Tooltip>
						</Popconfirm>
					)}
					{group.is_member && !group.is_owner && (
						<Popconfirm
							title={t('groups.leave.confirmTitle')}
							description={t('groups.leave.confirmContent')}
							onConfirm={handleLeaveGroup}
							okText={t('groups.leave.button')}
							cancelText={t('common.cancel')}
							okButtonProps={{ danger: true, loading: leaveLoading }}
						>
							<Tooltip title={t('groups.leave.button')}>
								<Button icon={<LogoutOutlined />} />
							</Tooltip>
						</Popconfirm>
					)}
				</Space>
			</Flex>

			{/* Group Info */}
			<Row gutter={16}>
				<Col xs={24} lg={6} xl={5}>
					<Card size="small" style={{ ...elevation[1], borderRadius: 16 }}>
						<Space direction="vertical" size={8} style={{ width: '100%' }}>
							<Text strong style={{ fontSize: 14 }}>
								{t('groups.detail.info')}
							</Text>
							<Divider style={{ margin: '4px 0' }} />
							<Flex justify="space-between" align="center">
								<Text type="secondary">{t('groups.columns.code')}:</Text>
								<Text
									style={{
										textAlign: 'right',
										wordBreak: 'break-all',
									}}
								>
									{group.name}
								</Text>
							</Flex>
							<Flex justify="space-between" align="center">
								<Text type="secondary">{t('groups.columns.type')}:</Text>
								<Tag
									color={group.type === 'class' ? 'purple' : 'cyan'}
									style={{ margin: 0 }}
								>
									{group.type === 'class'
										? t('groups.type.class')
										: t('groups.type.studyGroup')}
								</Tag>
							</Flex>
							<Flex justify="space-between" align="center">
								<Text type="secondary">{t('groups.columns.memberCount')}:</Text>
								<Text strong>{group.member_count || 0}</Text>
							</Flex>
							<Flex justify="space-between" align="center">
								<Text type="secondary">{t('groups.columns.createdAt')}:</Text>
								<Text>{dayjs(group.created_at).format('DD/MM/YYYY')}</Text>
							</Flex>
							{group.description && (
								<>
									<Divider style={{ margin: '4px 0' }} />
									<Text type="secondary" style={{ fontSize: 12 }}>
										{group.description}
									</Text>
								</>
							)}
						</Space>
					</Card>
				</Col>

				<Col xs={24} lg={18} xl={19}>
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
											{t('groups.detail.membersTab')} ({members.length})
										</Space>
									),
									children: (
										<Space
											direction="vertical"
											size="middle"
											style={{ width: '100%' }}
										>
											{group.can_manage && (
												<Flex justify="flex-end">
													<Button
														type="primary"
														icon={<UserAddOutlined />}
														onClick={() => setAddMemberOpen(true)}
													>
														{t('groups.members.add')}
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
											{t('groups.detail.assessmentsTab')}
										</Space>
									),
									children: (
										<GroupAssessmentsTab
											groupId={groupId}
											canManage={group.can_manage}
										/>
									),
								},
								// Grading tab - only for group managers (owner/co-owner)
								...(group.can_manage
									? [
										{
											key: 'grading',
											label: (
												<Space>
													<CheckCircleOutlined />
													{t('groups.detail.gradingTab')}
												</Space>
											),
											children: <GroupGradingTab groupId={groupId} />,
										},
										{
											key: 'proctoring',
											label: (
												<Space>
													<EyeOutlined />
													{t('groups.detail.proctoringTab')}
												</Space>
											),
											children: <GroupProctoringTab groupId={groupId} />,
										},
										{
											key: 'invites',
											label: (
												<Space>
													<ShareAltOutlined />
													{t('groups.invite.tabTitle')}
												</Space>
											),
											children: (
												<InviteManagementTab
													groupId={groupId}
													canManage={group.can_manage}
												/>
											),
										},
									]
									: []),
							]}
						/>
					</Card>
				</Col>
			</Row>

			{/* Add Member Modal */}
			<Modal
				title={t('groups.members.addModal.title')}
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
						label={t('groups.members.addModal.searchLabel')}
						rules={[
							{
								required: true,
								message: t('groups.members.addModal.selectRequired'),
							},
						]}
					>
						<Select
							showSearch
							placeholder={t('groups.members.addModal.searchPlaceholder')}
							loading={searchLoading}
							filterOption={false}
							onSearch={handleSearchUsers}
							notFoundContent={searchLoading ? <Spin size="small" /> : null}
							options={searchUsers.map((u) => ({
								label: (
									<Flex align="center" gap={8}>
										<Avatar
											size="small"
											src={u.avatar_url}
											icon={<UserOutlined />}
										/>
										<span>
											{u.full_name} ({u.email})
										</span>
									</Flex>
								),
								value: u.id,
							}))}
						/>
					</Form.Item>
					<Form.Item
						name="role"
						label={t('groups.members.addModal.selectRole')}
						initialValue={GroupMemberRole.Member}
					>
						<Select
							options={[
								{
									label: t('groups.role.member'),
									value: GroupMemberRole.Member,
								},
								{
									label: t('groups.role.coOwner'),
									value: GroupMemberRole.CoOwner,
								},
							]}
						/>
					</Form.Item>
					<Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
						<Space>
							<Button onClick={() => setAddMemberOpen(false)}>
								{t('common.cancel')}
							</Button>
							<Button type="primary" htmlType="submit" loading={addMemberLoading}>
								{t('groups.members.addModal.submit')}
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Modal>

			{/* Change Role Modal */}
			<Modal
				title={t('groups.members.changeRoleModal.title')}
				open={roleModalOpen}
				onCancel={() => setRoleModalOpen(false)}
				footer={null}
				destroyOnClose
			>
				<Form form={roleForm} layout="vertical" onFinish={handleChangeRole}>
					<Form.Item
						name="role"
						label={t('groups.members.changeRoleModal.newRole')}
						rules={[{ required: true }]}
					>
						<Select
							options={[
								{
									label: t('groups.role.coOwner'),
									value: GroupMemberRole.CoOwner,
								},
								{
									label: t('groups.role.member'),
									value: GroupMemberRole.Member,
								},
							]}
						/>
					</Form.Item>
					<Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
						<Space>
							<Button onClick={() => setRoleModalOpen(false)}>
								{t('common.cancel')}
							</Button>
							<Button type="primary" htmlType="submit" loading={roleChangeLoading}>
								{t('groups.members.changeRoleModal.submit')}
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Modal>
		</Space>
	);
};

export default GroupDetail;
