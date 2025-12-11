import {
	CopyOutlined,
	DeleteOutlined,
	LinkOutlined,
	QrcodeOutlined,
	ReloadOutlined,
} from '@ant-design/icons';
import {
	Alert,
	Button,
	DatePicker,
	Divider,
	Empty,
	Flex,
	Form,
	InputNumber,
	List,
	Modal,
	QRCode,
	Space,
	Spin,
	Switch,
	Tag,
	Tooltip,
	Typography,
	message,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import inviteLinkService from '../../services/inviteLinkService';
import { elevation } from '../../styles/elevation';
import { CreateInviteLinkRequest, GroupInviteLinkResponse } from '../../types';

const { Text, Paragraph } = Typography;

interface GenerateInviteLinkModalProps {
	open: boolean;
	onClose: () => void;
	groupId: number;
	groupName: string;
}

const GenerateInviteLinkModal: React.FC<GenerateInviteLinkModalProps> = ({
	open,
	onClose,
	groupId,
	groupName,
}) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [generatedLink, setGeneratedLink] = useState<GroupInviteLinkResponse | null>(null);
	const [existingLinks, setExistingLinks] = useState<GroupInviteLinkResponse[]>([]);
	const [linksLoading, setLinksLoading] = useState(false);
	const [showQR, setShowQR] = useState(false);
	const [hasLimit, setHasLimit] = useState(false);
	const [hasExpiry, setHasExpiry] = useState(false);

	useEffect(() => {
		if (open) {
			fetchExistingLinks();
			resetForm();
		}
	}, [open, groupId]);

	const resetForm = () => {
		form.resetFields();
		setGeneratedLink(null);
		setHasLimit(false);
		setHasExpiry(false);
		setShowQR(false);
	};

	const fetchExistingLinks = async () => {
		setLinksLoading(true);
		try {
			const links = await inviteLinkService.getInviteLinks(groupId);
			setExistingLinks(links.filter((link) => link.is_active));
		} catch {
			// API not implemented yet - silent fail
			setExistingLinks([]);
		} finally {
			setLinksLoading(false);
		}
	};

	const handleGenerate = async () => {
		try {
			const values = await form.validateFields();
			setLoading(true);

			const request: CreateInviteLinkRequest = {};

			if (hasLimit && values.use_limit) {
				request.use_limit = values.use_limit;
			}

			if (hasExpiry && values.expires_at) {
				// Calculate hours from now to expiry
				const hoursUntilExpiry = dayjs(values.expires_at).diff(dayjs(), 'hour');
				request.expires_in_hours = Math.max(1, hoursUntilExpiry);
			}

			const response = await inviteLinkService.createInviteLink(groupId, request);
			setGeneratedLink(response);
			message.success(t('groups.inviteLink.generateSuccess'));
			fetchExistingLinks();
		} catch (error) {
			// Check if error is validation error
			if (error && typeof error === 'object' && 'errorFields' in error) {
				return; // Form validation error
			}
			message.error(t('groups.inviteLink.generateError'));
		} finally {
			setLoading(false);
		}
	};

	const handleCopyLink = async (url: string) => {
		try {
			await navigator.clipboard.writeText(url);
			message.success(t('groups.inviteLink.copied'));
		} catch {
			message.error(t('groups.inviteLink.copyError'));
		}
	};

	const handleDeleteLink = async (linkId: number) => {
		try {
			await inviteLinkService.deleteInviteLink(groupId, linkId);
			message.success(t('groups.inviteLink.deleteSuccess'));
			fetchExistingLinks();
			if (generatedLink?.id === linkId) {
				setGeneratedLink(null);
			}
		} catch {
			message.error(t('groups.inviteLink.deleteError'));
		}
	};

	const getInviteUrl = (token: string) => {
		return inviteLinkService.getInviteUrl(token);
	};

	const renderLinkStatus = (link: GroupInviteLinkResponse) => {
		const isExpired = link.expires_at && dayjs(link.expires_at).isBefore(dayjs());
		const isLimitReached = link.use_limit !== null && link.used_count >= link.use_limit;

		if (isExpired) {
			return <Tag color="error">{t('groups.inviteLink.status.expired')}</Tag>;
		}
		if (isLimitReached) {
			return <Tag color="warning">{t('groups.inviteLink.status.limitReached')}</Tag>;
		}
		return <Tag color="success">{t('groups.inviteLink.status.active')}</Tag>;
	};

	return (
		<Modal
			title={
				<Space>
					<LinkOutlined />
					{t('groups.inviteLink.title')}
				</Space>
			}
			open={open}
			onCancel={onClose}
			footer={null}
			width={600}
			destroyOnClose
		>
			<Space direction="vertical" style={{ width: '100%' }} size="large">
				{/* Group name */}
				<Alert
					message={t('groups.inviteLink.forGroup', { name: groupName })}
					type="info"
					showIcon
				/>

				{/* Generate new link form */}
				<div style={{ ...elevation[1], padding: 16, borderRadius: 8 }}>
					<Text strong style={{ display: 'block', marginBottom: 16 }}>
						{t('groups.inviteLink.generateNew')}
					</Text>

					<Form form={form} layout="vertical" size="middle">
						{/* Use Limit Option */}
						<Flex align="center" gap={12} style={{ marginBottom: 16 }}>
							<Switch checked={hasLimit} onChange={setHasLimit} />
							<Text>{t('groups.inviteLink.setUseLimit')}</Text>
						</Flex>
						{hasLimit && (
							<Form.Item
								name="use_limit"
								label={t('groups.inviteLink.useLimit')}
								rules={[
									{
										required: hasLimit,
										message: t('groups.inviteLink.useLimitRequired'),
									},
								]}
								initialValue={10}
							>
								<InputNumber
									min={1}
									max={1000}
									style={{ width: '100%' }}
									placeholder={t('groups.inviteLink.useLimitPlaceholder')}
									addonAfter={t('groups.inviteLink.times')}
								/>
							</Form.Item>
						)}

						{/* Expiry Option */}
						<Flex align="center" gap={12} style={{ marginBottom: 16 }}>
							<Switch checked={hasExpiry} onChange={setHasExpiry} />
							<Text>{t('groups.inviteLink.setExpiry')}</Text>
						</Flex>
						{hasExpiry && (
							<Form.Item
								name="expires_at"
								label={t('groups.inviteLink.expiresAt')}
								rules={[
									{
										required: hasExpiry,
										message: t('groups.inviteLink.expiryRequired'),
									},
								]}
								initialValue={dayjs().add(7, 'day')}
							>
								<DatePicker
									showTime
									style={{ width: '100%' }}
									disabledDate={(current) =>
										current && current < dayjs().startOf('day')
									}
									placeholder={t('groups.inviteLink.expiryPlaceholder')}
									format="DD/MM/YYYY HH:mm"
								/>
							</Form.Item>
						)}

						<Button
							type="primary"
							icon={<LinkOutlined />}
							onClick={handleGenerate}
							loading={loading}
							block
						>
							{t('groups.inviteLink.generate')}
						</Button>
					</Form>
				</div>

				{/* Generated Link Display */}
				{generatedLink && (
					<div
						style={{
							...elevation[2],
							padding: 16,
							borderRadius: 8,
							background: 'var(--ant-color-success-bg)',
						}}
					>
						<Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
							<Text strong style={{ color: 'var(--ant-color-success)' }}>
								{t('groups.inviteLink.linkGenerated')}
							</Text>
							<Space>
								<Tooltip title={t('groups.inviteLink.showQR')}>
									<Button
										type="text"
										icon={<QrcodeOutlined />}
										onClick={() => setShowQR(!showQR)}
									/>
								</Tooltip>
								<Tooltip title={t('groups.inviteLink.regenerate')}>
									<Button
										type="text"
										icon={<ReloadOutlined />}
										onClick={resetForm}
									/>
								</Tooltip>
							</Space>
						</Flex>

						<Paragraph
							copyable={{
								text: getInviteUrl(generatedLink.token),
								tooltips: [
									t('groups.inviteLink.copyLink'),
									t('groups.inviteLink.copied'),
								],
							}}
							style={{
								padding: '8px 12px',
								background: 'var(--ant-color-bg-container)',
								borderRadius: 4,
								marginBottom: showQR ? 16 : 0,
								wordBreak: 'break-all',
							}}
						>
							{getInviteUrl(generatedLink.token)}
						</Paragraph>

						{showQR && (
							<Flex justify="center" style={{ marginTop: 16 }}>
								<QRCode
									value={getInviteUrl(generatedLink.token)}
									size={200}
									bordered={false}
								/>
							</Flex>
						)}

						<Flex gap={16} style={{ marginTop: 12 }}>
							{generatedLink.use_limit !== null && (
								<Text type="secondary" style={{ fontSize: 12 }}>
									{t('groups.inviteLink.limitInfo', {
										used: generatedLink.used_count,
										limit: generatedLink.use_limit,
									})}
								</Text>
							)}
							{generatedLink.expires_at && (
								<Text type="secondary" style={{ fontSize: 12 }}>
									{t('groups.inviteLink.expiryInfo', {
										date: dayjs(generatedLink.expires_at).format(
											'DD/MM/YYYY HH:mm'
										),
									})}
								</Text>
							)}
						</Flex>
					</div>
				)}

				<Divider style={{ margin: '8px 0' }} />

				{/* Existing Links */}
				<div>
					<Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
						<Text strong>{t('groups.inviteLink.existingLinks')}</Text>
						<Button
							type="text"
							size="small"
							icon={<ReloadOutlined />}
							onClick={fetchExistingLinks}
							loading={linksLoading}
						>
							{t('groups.inviteLink.refresh')}
						</Button>
					</Flex>

					{linksLoading ? (
						<Flex justify="center" style={{ padding: 24 }}>
							<Spin />
						</Flex>
					) : existingLinks.length === 0 ? (
						<Empty
							image={Empty.PRESENTED_IMAGE_SIMPLE}
							description={t('groups.inviteLink.noLinks')}
						/>
					) : (
						<List
							size="small"
							dataSource={existingLinks}
							renderItem={(link) => (
								<List.Item
									key={link.id}
									actions={[
										<Tooltip title={t('groups.inviteLink.copyLink')} key="copy">
											<Button
												type="text"
												size="small"
												icon={<CopyOutlined />}
												onClick={() =>
													handleCopyLink(getInviteUrl(link.token))
												}
											/>
										</Tooltip>,
										<Tooltip title={t('groups.inviteLink.delete')} key="delete">
											<Button
												type="text"
												size="small"
												danger
												icon={<DeleteOutlined />}
												onClick={() => handleDeleteLink(link.id)}
											/>
										</Tooltip>,
									]}
								>
									<List.Item.Meta
										title={
											<Flex align="center" gap={8}>
												<Text
													style={{
														fontSize: 12,
														fontFamily: 'monospace',
													}}
													ellipsis
												>
													...{link.token.slice(-12)}
												</Text>
												{renderLinkStatus(link)}
											</Flex>
										}
										description={
											<Space split={<Text type="secondary">•</Text>}>
												{link.use_limit !== null && (
													<Text type="secondary" style={{ fontSize: 11 }}>
														{link.used_count}/{link.use_limit}{' '}
														{t('groups.inviteLink.used')}
													</Text>
												)}
												{link.expires_at && (
													<Text type="secondary" style={{ fontSize: 11 }}>
														{t('groups.inviteLink.expiresOn')}{' '}
														{dayjs(link.expires_at).format(
															'DD/MM/YYYY'
														)}
													</Text>
												)}
												<Text type="secondary" style={{ fontSize: 11 }}>
													{t('groups.inviteLink.createdOn')}{' '}
													{dayjs(link.created_at).format('DD/MM/YYYY')}
												</Text>
											</Space>
										}
									/>
								</List.Item>
							)}
						/>
					)}
				</div>
			</Space>
		</Modal>
	);
};

export default GenerateInviteLinkModal;
