import {
	DeleteOutlined,
	EditOutlined,
	PlusOutlined,
	SortAscendingOutlined,
	SortDescendingOutlined,
	TeamOutlined,
	UserOutlined,
} from '@ant-design/icons';
import {
	Avatar,
	Button,
	Card,
	Col,
	Empty,
	Flex,
	Form,
	Input,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Spin,
	Tabs,
	Tag,
	Tooltip,
	Typography,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import groupService from '../../services/groupService';
import { elevation } from '../../styles/elevation';
import { GroupResponse } from '../../types';
import { showError, showSuccess } from '../../utils/errorHandler';

const { Title, Text } = Typography;

const StudentGroups: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<'my' | 'memberships'>('my');
	const [myGroups, setMyGroups] = useState<GroupResponse[]>([]);
	const [memberships, setMemberships] = useState<GroupResponse[]>([]);
	const [loading, setLoading] = useState(false);

	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [createLoading, setCreateLoading] = useState(false);
	const [form] = Form.useForm();

	// Sort state
	const [sortBy, setSortBy] = useState<'created_at' | 'name' | 'type' | 'member_count'>('created_at');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	useEffect(() => {
		fetchGroups();
	}, []);

	const fetchGroups = async () => {
		setLoading(true);
		try {
			const [myGroupsRes, membershipsRes] = await Promise.all([
				groupService.getMyGroups(),
				groupService.getMyMemberships(),
			]);
			setMyGroups(myGroupsRes.groups || []);
			setMemberships(membershipsRes.groups || []);
		} catch (error) {
			showError(t('studentGroups.loadError'));
		} finally {
			setLoading(false);
		}
	};

	const handleCreateGroup = async (values: { name: string; display_name: string; type: string; description?: string }) => {
		setCreateLoading(true);
		try {
			await groupService.createGroup(values);
			showSuccess(t('studentGroups.createSuccess'));
			setCreateModalOpen(false);
			form.resetFields();
			fetchGroups();
		} catch (error) {
			// handled by interceptor
		} finally {
			setCreateLoading(false);
		}
	};

	const handleDeleteGroup = async (groupId: number) => {
		try {
			await groupService.deleteGroup(groupId);
			showSuccess(t('studentGroups.deleteSuccess'));
			fetchGroups();
		} catch (error) {
			// handled by interceptor
		}
	};

	// Sort function
	const sortGroups = (groups: GroupResponse[]) => {
		return [...groups].sort((a, b) => {
			let comparison = 0;
			switch (sortBy) {
				case 'created_at':
					comparison = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
					break;
				case 'name':
					comparison = (a.display_name || a.name || '').localeCompare(b.display_name || b.name || '');
					break;
				case 'type':
					comparison = (a.type || '').localeCompare(b.type || '');
					break;
				case 'member_count':
					// Member count: larger groups first (reverse the comparison)
					comparison = (b.member_count || 0) - (a.member_count || 0);
					break;
			}
			return sortOrder === 'asc' ? comparison : -comparison;
		});
	};

	// Sorted groups
	const sortedMyGroups = useMemo(() => sortGroups(myGroups), [myGroups, sortBy, sortOrder]);
	const sortedMemberships = useMemo(() => sortGroups(memberships), [memberships, sortBy, sortOrder]);

	const GroupCard: React.FC<{ group: GroupResponse; showActions?: boolean }> = ({ group, showActions = false }) => (
		<Card
			hoverable
			style={{ ...elevation[1], borderRadius: 12, height: '100%' }}
			onClick={() => navigate(`/student/groups/${group.id}`)}
		>
			<Flex vertical gap={12}>
				<Flex justify="space-between" align="flex-start">
					<Space>
						<Avatar
							size={48}
							icon={<TeamOutlined />}
							style={{ backgroundColor: '#1890ff' }}
						/>
						<Space direction="vertical" size={0}>
							<Text strong style={{ fontSize: 16 }}>
								{group.display_name || group.name}
							</Text>
							<Text type="secondary" style={{ fontSize: 12 }}>
								{group.name}
							</Text>
						</Space>
					</Space>
					<Tag color={group.type === 'class' ? 'purple' : 'cyan'}>
						{group.type === 'class' ? t('studentGroups.typeClass') : t('studentGroups.typeStudyGroup')}
					</Tag>
				</Flex>

				{group.description && (
					<Text type="secondary" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
						{group.description}
					</Text>
				)}

				<Flex justify="space-between" align="center">
					<Space size="large">
						<Tooltip title={t('studentGroups.memberCount')}>
							<Space>
								<UserOutlined style={{ color: '#8c8c8c' }} />
								<Text type="secondary">{group.member_count || 0}</Text>
							</Space>
						</Tooltip>
					</Space>

					{showActions && group.can_delete && (
						<Space onClick={(e) => e.stopPropagation()}>
							<Tooltip title={t('common.edit')}>
								<Button
									type="text"
									size="small"
									icon={<EditOutlined />}
									onClick={(e) => {
										e.stopPropagation();
										navigate(`/student/groups/${group.id}`);
									}}
								/>
							</Tooltip>
							<Popconfirm
								title={t('studentGroups.deleteConfirm.title')}
								description={t('studentGroups.deleteConfirm.description')}
								onConfirm={(e) => {
									e?.stopPropagation();
									handleDeleteGroup(group.id);
								}}
								onCancel={(e) => e?.stopPropagation()}
								okText={t('common.delete')}
								cancelText={t('common.cancel')}
								okButtonProps={{ danger: true }}
							>
								<Button
									type="text"
									danger
									size="small"
									icon={<DeleteOutlined />}
									onClick={(e) => e.stopPropagation()}
								/>
							</Popconfirm>
						</Space>
					)}
				</Flex>
			</Flex>
		</Card>
	);

	const renderGroupGrid = (groups: GroupResponse[], showActions = false) => {
		if (groups.length === 0) {
			return (
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					description={
						activeTab === 'my'
							? t('studentGroups.empty.myGroups')
							: t('studentGroups.empty.memberships')
					}
				>
					{activeTab === 'my' && (
						<Button
							type="primary"
							icon={<PlusOutlined />}
							onClick={() => setCreateModalOpen(true)}
						>
							{t('studentGroups.createFirst')}
						</Button>
					)}
				</Empty>
			);
		}

		return (
			<Row gutter={[16, 16]}>
				{groups.map((group) => (
					<Col key={group.id} xs={24} sm={12} lg={8} xl={6}>
						<GroupCard group={group} showActions={showActions} />
					</Col>
				))}
			</Row>
		);
	};

	return (
		<Space direction="vertical" size="large" style={{ width: '100%' }}>
			{/* Header */}
			<Flex justify="space-between" align="center" wrap="wrap" gap={12}>
				<Title level={2} style={{ margin: 0 }}>
					<TeamOutlined style={{ marginRight: 8 }} />
					{t('studentGroups.title')}
				</Title>
				<Space wrap>
					{/* Sort Controls */}
					<Select
						value={sortBy}
						onChange={setSortBy}
						style={{ width: 150 }}
						options={[
							{ label: 'Ngày tạo', value: 'created_at' },
							{ label: 'Tên nhóm', value: 'name' },
							{ label: 'Loại nhóm', value: 'type' },
							{ label: 'Số thành viên', value: 'member_count' },
						]}
					/>
					<Tooltip title={sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}>
						<Button
							icon={sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
							onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
						/>
					</Tooltip>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={() => setCreateModalOpen(true)}
					>
						{t('studentGroups.create')}
					</Button>
				</Space>
			</Flex>

			{/* Tabs */}
			{loading ? (
				<Flex justify="center" align="center" style={{ minHeight: 300 }}>
					<Spin size="large" />
				</Flex>
			) : (
				<Tabs
					activeKey={activeTab}
					onChange={(key) => setActiveTab(key as 'my' | 'memberships')}
					items={[
						{
							key: 'my',
							label: (
								<Space>
									<TeamOutlined />
									{t('studentGroups.tabs.myGroups')}
									<Tag>{myGroups.length}</Tag>
								</Space>
							),
							children: renderGroupGrid(sortedMyGroups, true),
						},
						{
							key: 'memberships',
							label: (
								<Space>
									<UserOutlined />
									{t('studentGroups.tabs.memberships')}
									<Tag>{memberships.length}</Tag>
								</Space>
							),
							children: renderGroupGrid(sortedMemberships, false),
						},
					]}
				/>
			)}

			{/* Create Group Modal */}
			<Modal
				title={t('studentGroups.createModal.title')}
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
					onFinish={handleCreateGroup}
					initialValues={{ type: 'study-group' }}
				>
					<Form.Item
						name="name"
						label={t('studentGroups.createModal.code')}
						rules={[
							{ required: true, message: t('studentGroups.createModal.codeRequired') },
							{ pattern: /^[a-zA-Z0-9-_]+$/, message: t('studentGroups.createModal.codePattern') },
						]}
					>
						<Input placeholder={t('studentGroups.createModal.codePlaceholder')} />
					</Form.Item>

					<Form.Item
						name="display_name"
						label={t('studentGroups.createModal.name')}
						rules={[{ required: true, message: t('studentGroups.createModal.nameRequired') }]}
					>
						<Input placeholder={t('studentGroups.createModal.namePlaceholder')} />
					</Form.Item>

					<Form.Item
						name="type"
						label={t('studentGroups.createModal.type')}
					>
						<Select
							options={[
								{ label: t('studentGroups.typeStudyGroup'), value: 'study-group' },
								{ label: t('studentGroups.typeClass'), value: 'class' },
							]}
						/>
					</Form.Item>

					<Form.Item
						name="description"
						label={t('studentGroups.createModal.description')}
					>
						<Input.TextArea
							rows={3}
							placeholder={t('studentGroups.createModal.descriptionPlaceholder')}
						/>
					</Form.Item>

					<Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
						<Space>
							<Button onClick={() => setCreateModalOpen(false)}>
								{t('common.cancel')}
							</Button>
							<Button type="primary" htmlType="submit" loading={createLoading}>
								{t('studentGroups.createModal.submit')}
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Modal>
		</Space>
	);
};

export default StudentGroups;
