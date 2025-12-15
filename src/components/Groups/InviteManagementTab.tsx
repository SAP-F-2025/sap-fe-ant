import {
	CalendarOutlined,
	CopyOutlined,
	DeleteOutlined,
	LinkOutlined,
	NumberOutlined,
	PlusOutlined,
	QrcodeOutlined,
	ReloadOutlined,
	UserOutlined,
} from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	DatePicker,
	Empty,
	Flex,
	Form,
	InputNumber,
	message,
	Modal,
	Popconfirm,
	QRCode,
	Row,
	Select,
	Space,
	Tag,
	Tooltip,
	Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import groupService from '../../services/groupService';
import { elevation } from '../../styles/elevation';
import {
	CreateInviteCodeRequest,
	CreateInviteLinkRequest,
	GroupInviteResponse,
	GroupMemberRole,
	InviteType,
} from '../../types';
import { showError, showSuccess } from '../../utils/errorHandler';

const { Text, Title } = Typography;

interface InviteManagementTabProps {
	groupId: number;
	canManage: boolean;
}

const InviteManagementTab: React.FC<InviteManagementTabProps> = ({ groupId, canManage }) => {
	const { t } = useTranslation();
	const [invites, setInvites] = useState<GroupInviteResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [createType, setCreateType] = useState<'link' | 'code'>('link');
	const [createLoading, setCreateLoading] = useState(false);
	const [qrModalOpen, setQrModalOpen] = useState(false);
	const [selectedInvite, setSelectedInvite] = useState<GroupInviteResponse | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		fetchInvites();
	}, [groupId]);

	const fetchInvites = async () => {
		setLoading(true);
		try {
			const data = await groupService.getInvites(groupId);
			setInvites(data || []);
		} catch (error) {
			showError(t('groups.invite.loadError') || 'Failed to load invites');
		} finally {
			setLoading(false);
		}
	};

	const openCreateModal = (type: 'link' | 'code') => {
		setCreateType(type);
		form.resetFields();
		// Set default values
		form.setFieldsValue({
			expiration: '7days',
			max_uses: null,
			default_role: 'member',
		});
		setCreateModalOpen(true);
	};

	const handleCreate = async (values: any) => {
		setCreateLoading(true);
		try {
			let expiresAt: string | undefined;
			if (values.expiration === '7days') {
				expiresAt = dayjs().add(7, 'day').toISOString();
			} else if (values.expiration === '30days') {
				expiresAt = dayjs().add(30, 'day').toISOString();
			} else if (values.expiration === 'custom' && values.custom_date) {
				expiresAt = values.custom_date.toISOString();
			}

			const data: CreateInviteLinkRequest | CreateInviteCodeRequest = {
				max_uses: values.max_uses || undefined,
				expires_at: expiresAt,
				default_role: values.default_role,
			};

			if (createType === 'link') {
				await groupService.createInviteLink(groupId, data);
			} else {
				await groupService.createInviteCode(groupId, data);
			}

			showSuccess(t('groups.invite.createSuccess'));
			setCreateModalOpen(false);
			form.resetFields();
			fetchInvites();
		} catch {
			// handled by interceptor
		} finally {
			setCreateLoading(false);
		}
	};

	const handleDelete = async (inviteId: number) => {
		try {
			await groupService.deleteInvite(groupId, inviteId);
			showSuccess(t('groups.invite.deleteSuccess'));
			fetchInvites();
		} catch {
			// handled by interceptor
		}
	};

	const handleRegenerate = async (inviteId: number) => {
		try {
			await groupService.regenerateInvite(groupId, inviteId);
			showSuccess(t('groups.invite.regenerateSuccess'));
			fetchInvites();
		} catch {
			// handled by interceptor
		}
	};

	const copyToClipboard = (text: string, type: 'link' | 'code') => {
		navigator.clipboard.writeText(text);
		message.success(
			type === 'link' ? t('groups.invite.linkCopied') : t('groups.invite.codeCopied')
		);
	};

	const getInviteUrl = (invite: GroupInviteResponse) => {
		const baseUrl = window.location.origin;
		return `${baseUrl}/join/${invite.token}`;
	};

	const openQrModal = (invite: GroupInviteResponse) => {
		setSelectedInvite(invite);
		setQrModalOpen(true);
	};

	const getRoleColor = (role: GroupMemberRole) => {
		const colors: Record<string, string> = {
			[GroupMemberRole.Owner]: 'gold',
			[GroupMemberRole.CoOwner]: 'blue',
			[GroupMemberRole.Member]: 'default',
		};
		return colors[role] || 'default';
	};

	const getRoleLabel = (role: GroupMemberRole) => {
		const labels: Record<string, string> = {
			[GroupMemberRole.Owner]: t('groups.role.owner'),
			[GroupMemberRole.CoOwner]: t('groups.role.coOwner'),
			[GroupMemberRole.Member]: t('groups.role.member'),
		};
		return labels[role] || role;
	};

	const getStatusTag = (invite: GroupInviteResponse) => {
		if (invite.is_expired) {
			return <Tag color="red">{t('groups.invite.expired')}</Tag>;
		}
		if (invite.is_exhausted) {
			return <Tag color="orange">{t('groups.invite.exhausted')}</Tag>;
		}
		return <Tag color="green">Active</Tag>;
	};

	if (!canManage) {
		return null;
	}

	const linkInvites = invites.filter((i) => i.type === InviteType.Link);
	const codeInvites = invites.filter((i) => i.type === InviteType.Code);

	const InviteCard: React.FC<{ invite: GroupInviteResponse }> = ({ invite }) => {
		const isLink = invite.type === InviteType.Link;
		const isActive = !invite.is_expired && !invite.is_exhausted;

		return (
			<Card
				size="small"
				style={{
					...elevation[1],
					borderRadius: 12,
					opacity: isActive ? 1 : 0.7,
					borderLeft: `4px solid ${isLink ? '#1890ff' : '#52c41a'}`,
				}}
			>
				<Flex vertical gap={12}>
					{/* Header */}
					<Flex justify="space-between" align="center">
						<Space>
							{isLink ? (
								<LinkOutlined style={{ fontSize: 18, color: '#1890ff' }} />
							) : (
								<NumberOutlined style={{ fontSize: 18, color: '#52c41a' }} />
							)}
							<Text strong>{isLink ? 'Invite Link' : 'Invite Code'}</Text>
						</Space>
						{getStatusTag(invite)}
					</Flex>

					{/* Value */}
					{isLink ? (
						<Flex gap={8} align="center">
							<Text
								type="secondary"
								style={{
									fontSize: 12,
									flex: 1,
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
								}}
							>
								{getInviteUrl(invite)}
							</Text>
							<Tooltip title={t('groups.invite.copyLink')}>
								<Button
									size="small"
									icon={<CopyOutlined />}
									onClick={() => copyToClipboard(getInviteUrl(invite), 'link')}
								/>
							</Tooltip>
							<Tooltip title="QR Code">
								<Button
									size="small"
									icon={<QrcodeOutlined />}
									onClick={() => openQrModal(invite)}
								/>
							</Tooltip>
						</Flex>
					) : (
						<Flex justify="center" align="center" gap={8}>
							<Text
								code
								style={{
									fontSize: 28,
									letterSpacing: 8,
									fontWeight: 600,
									padding: '8px 16px',
									cursor: 'pointer',
									margin: 0,
								}}
								onClick={() => copyToClipboard(invite.code || '', 'code')}
							>
								{invite.code}
							</Text>
							<Tooltip title={t('groups.invite.copyCode') || 'Copy Code'}>
								<Button
									size="middle"
									icon={<CopyOutlined />}
									onClick={() => copyToClipboard(invite.code || '', 'code')}
								/>
							</Tooltip>
						</Flex>
					)}

					{/* Info */}
					<Flex gap={16} wrap="wrap">
						<Tooltip title={t('groups.invite.usesCount')}>
							<Space size={4}>
								<UserOutlined style={{ color: '#8c8c8c' }} />
								<Text type="secondary" style={{ fontSize: 12 }}>
									{invite.uses_count}
									{invite.max_uses ? ` / ${invite.max_uses}` : ` / ∞`}
								</Text>
							</Space>
						</Tooltip>
						<Tooltip title={t('groups.invite.expiresAt')}>
							<Space size={4}>
								<CalendarOutlined style={{ color: '#8c8c8c' }} />
								<Text type="secondary" style={{ fontSize: 12 }}>
									{invite.expires_at
										? dayjs(invite.expires_at).format('DD/MM/YYYY')
										: t('groups.invite.neverExpires')}
								</Text>
							</Space>
						</Tooltip>
						<Tag color={getRoleColor(invite.default_role)}>
							{getRoleLabel(invite.default_role)}
						</Tag>
					</Flex>

					{/* Actions */}
					<Flex justify="flex-end" gap={8}>
						<Tooltip title={t('groups.invite.regenerate')}>
							<Button
								size="small"
								icon={<ReloadOutlined />}
								onClick={() => handleRegenerate(invite.id)}
							>
								{t('groups.invite.regenerate')}
							</Button>
						</Tooltip>
						<Popconfirm
							title={t('groups.invite.deleteConfirm.title')}
							description={t('groups.invite.deleteConfirm.content')}
							onConfirm={() => handleDelete(invite.id)}
							okText={t('groups.invite.deleteConfirm.okText')}
							cancelText={t('groups.invite.deleteConfirm.cancelText')}
							okButtonProps={{ danger: true }}
						>
							<Button size="small" danger icon={<DeleteOutlined />}>
								{t('groups.invite.deleteInvite')}
							</Button>
						</Popconfirm>
					</Flex>
				</Flex>
			</Card>
		);
	};

	const expirationValue = Form.useWatch('expiration', form);

	return (
		<Space direction="vertical" size="large" style={{ width: '100%' }}>
			{/* Action buttons */}
			<Flex justify="flex-end" gap={12}>
				<Button icon={<LinkOutlined />} onClick={() => openCreateModal('link')}>
					{t('groups.invite.createLink')}
				</Button>
				<Button icon={<PlusOutlined />} onClick={() => openCreateModal('code')}>
					{t('groups.invite.createCode')}
				</Button>
			</Flex>

			{invites.length === 0 ? (
				<Empty description={t('groups.invite.empty')} />
			) : (
				<Space direction="vertical" size="middle" style={{ width: '100%' }}>
					{/* Link invites */}
					{linkInvites.length > 0 && (
						<div>
							<Title level={5} style={{ marginBottom: 12 }}>
								<LinkOutlined /> Invite Links ({linkInvites.length})
							</Title>
							<Row gutter={[16, 16]}>
								{linkInvites.map((invite) => (
									<Col key={invite.id} xs={24} lg={12}>
										<InviteCard invite={invite} />
									</Col>
								))}
							</Row>
						</div>
					)}

					{/* Code invites */}
					{codeInvites.length > 0 && (
						<div>
							<Title level={5} style={{ marginBottom: 12 }}>
								<NumberOutlined /> Invite Codes ({codeInvites.length})
							</Title>
							<Row gutter={[16, 16]}>
								{codeInvites.map((invite) => (
									<Col key={invite.id} xs={24} sm={12} lg={8}>
										<InviteCard invite={invite} />
									</Col>
								))}
							</Row>
						</div>
					)}
				</Space>
			)}

			{/* Create Invite Modal */}
			<Modal
				title={
					<Space>
						{createType === 'link' ? <LinkOutlined /> : <NumberOutlined />}
						{createType === 'link'
							? t('groups.invite.modal.createLinkTitle')
							: t('groups.invite.modal.createCodeTitle')}
					</Space>
				}
				open={createModalOpen}
				onCancel={() => setCreateModalOpen(false)}
				footer={null}
				destroyOnClose
				width={480}
			>
				<Form form={form} layout="vertical" onFinish={handleCreate}>
					<Form.Item
						name="expiration"
						label={t('groups.invite.modal.expirationLabel')}
						initialValue="7days"
					>
						<Select
							options={[
								{ label: t('groups.invite.modal.days7'), value: '7days' },
								{ label: t('groups.invite.modal.days30'), value: '30days' },
								{ label: t('groups.invite.neverExpires'), value: 'never' },
								{ label: t('groups.invite.modal.custom'), value: 'custom' },
							]}
						/>
					</Form.Item>

					{expirationValue === 'custom' && (
						<Form.Item
							name="custom_date"
							rules={[{ required: true, message: 'Please select a date' }]}
						>
							<DatePicker
								showTime
								style={{ width: '100%' }}
								disabledDate={(current) =>
									current && current < dayjs().startOf('day')
								}
							/>
						</Form.Item>
					)}

					<Form.Item
						name="max_uses"
						label={t('groups.invite.modal.maxUsesLabel')}
						extra={t('groups.invite.modal.unlimitedUses')}
					>
						<InputNumber min={1} max={1000} placeholder="∞" style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item
						name="default_role"
						label={t('groups.invite.modal.roleLabel')}
						initialValue="member"
					>
						<Select
							options={[
								{ label: t('groups.role.member'), value: 'member' },
								{ label: t('groups.role.coOwner'), value: 'co-owner' },
							]}
						/>
					</Form.Item>

					<Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
						<Space>
							<Button onClick={() => setCreateModalOpen(false)}>
								{t('groups.invite.modal.cancel')}
							</Button>
							<Button type="primary" htmlType="submit" loading={createLoading}>
								{t('groups.invite.modal.submit')}
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Modal>

			{/* QR Code Modal */}
			<Modal
				title="QR Code"
				open={qrModalOpen}
				onCancel={() => setQrModalOpen(false)}
				footer={
					<Button
						type="primary"
						icon={<CopyOutlined />}
						onClick={() => {
							if (selectedInvite) {
								copyToClipboard(getInviteUrl(selectedInvite), 'link');
							}
						}}
					>
						{t('groups.invite.copyLink')}
					</Button>
				}
				width={360}
			>
				{selectedInvite && (
					<Flex vertical align="center" gap={16}>
						<QRCode value={getInviteUrl(selectedInvite)} size={256} errorLevel="M" />
						<Text
							type="secondary"
							style={{ fontSize: 12, textAlign: 'center', wordBreak: 'break-all' }}
						>
							{getInviteUrl(selectedInvite)}
						</Text>
					</Flex>
				)}
			</Modal>
		</Space>
	);
};

export default InviteManagementTab;
