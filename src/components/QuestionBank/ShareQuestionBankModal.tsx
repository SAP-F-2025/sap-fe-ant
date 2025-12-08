import { DeleteOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import {
	Alert,
	Avatar,
	Button,
	Form,
	Modal,
	Popconfirm,
	Select,
	Space,
	Spin,
	Table,
	Tag,
	Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useSearchUsers } from '../../hooks/useUsers';
import questionBankService from '../../services/questionBankService';
import {
	QuestionBankShare,
	QuestionBankSharePermission,
	ShareQuestionBankRequest,
	User,
} from '../../types';
import { showError, showSuccess } from '../../utils/errorHandler';

const { Text } = Typography;

interface Props {
	bankId: number;
	bankName: string;
	visible: boolean;
	onCancel: () => void;
	onSuccess?: () => void;
}

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
	const { t } = useTranslation();

	const permissionLabels = {
		[QuestionBankSharePermission.ViewOnly]: t('shareQuestionBank.permission.viewOnly'),
		[QuestionBankSharePermission.CanEdit]: t('shareQuestionBank.permission.canEdit'),
		[QuestionBankSharePermission.CanDelete]: t('shareQuestionBank.permission.fullAccess'),
	};

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
				showError(t('shareQuestionBank.selectAtLeastOne'));
				setLoading(false);
				return;
			}

			const data: ShareQuestionBankRequest = {
				user_ids: userIds,
				permission: values.permission,
			};

			await questionBankService.shareQuestionBank(bankId, data);
			showSuccess(t('shareQuestionBank.shareSuccess', { count: userIds.length }));
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
			showSuccess(t('shareQuestionBank.unshareSuccess'));
			fetchShares();
			onSuccess?.();
		} catch (error) {
			// Error handled by interceptor
		}
	};

	const handleUpdatePermission = async (userId: string, permission: QuestionBankSharePermission) => {
		try {
			await questionBankService.updateSharePermission(bankId, userId, { permission });
			showSuccess(t('shareQuestionBank.updatePermissionSuccess'));
			fetchShares();
			onSuccess?.();
		} catch (error) {
			// Error handled by interceptor
		}
	};

	const columns: ColumnsType<QuestionBankShare> = [
		{
			title: t('shareQuestionBank.columns.user'),
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
			title: t('shareQuestionBank.columns.permission'),
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
			title: t('shareQuestionBank.columns.sharedDate'),
			dataIndex: 'shared_at',
			width: 150,
			render: (date) => new Date(date).toLocaleDateString('vi-VN'),
		},
		{
			title: t('shareQuestionBank.columns.actions'),
			key: 'action',
			width: 80,
			render: (_, record) => (
				<Popconfirm
					title={t('shareQuestionBank.unshareConfirm.title')}
					description={t('shareQuestionBank.unshareConfirm.description')}
					onConfirm={() => handleUnshare(record.user_id)}
					okText={t('shareQuestionBank.unshareConfirm.confirm')}
					cancelText={t('shareQuestionBank.unshareConfirm.cancel')}
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
					<span>{t('shareQuestionBank.title')}: {bankName}</span>
				</Space>
			}
			open={visible}
			onCancel={onCancel}
			width={800}
			footer={null}
		>
			<Space direction="vertical" size="large" style={{ width: '100%' }}>
				<Alert
					message={t('shareQuestionBank.guide.title')}
					description={
						<ul style={{ margin: 0, paddingLeft: 20 }}>
							<li>{t('shareQuestionBank.guide.search')}</li>
							<li><strong>{t('shareQuestionBank.permission.viewOnly')}:</strong> {t('shareQuestionBank.guide.viewOnlyDesc')}</li>
							<li><strong>{t('shareQuestionBank.permission.canEdit')}:</strong> {t('shareQuestionBank.guide.canEditDesc')}</li>
							<li><strong>{t('shareQuestionBank.permission.fullAccess')}:</strong> {t('shareQuestionBank.guide.fullAccessDesc')}</li>
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
						label={t('shareQuestionBank.selectUsers')}
						name="user_ids"
						rules={[{ required: true, message: t('shareQuestionBank.selectUsersRequired') }]}
						tooltip={t('shareQuestionBank.selectUsersTooltip')}
					>
						<Select
							mode="multiple"
							placeholder={t('shareQuestionBank.searchPlaceholder')}
							showSearch
							filterOption={false}
							onSearch={setSearchQuery}
							notFoundContent={isSearching ? <Spin size="small" /> : t('shareQuestionBank.noUsersFound')}
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

					<Form.Item label={t('shareQuestionBank.accessPermission')} name="permission">
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
							{t('shareQuestionBank.share')}
						</Button>
					</Form.Item>
				</Form>

				<div>
					<Typography.Title level={5}>
						{t('shareQuestionBank.sharedWith', { count: shares.length })}
					</Typography.Title>
					<Table
						columns={columns}
						dataSource={shares}
						rowKey="id"
						loading={fetchingShares}
						pagination={false}
						locale={{
							emptyText: t('shareQuestionBank.noSharesYet'),
						}}
						size="small"
					/>
				</div>
			</Space>
		</Modal>
	);
};

export default ShareQuestionBankModal;
