import {
	DeleteOutlined,
	EditOutlined,
	EyeInvisibleOutlined,
	EyeOutlined,
	RollbackOutlined,
	ShareAltOutlined,
	UserOutlined,
} from '@ant-design/icons';
import {
	Badge,
	Button,
	Card,
	Col,
	Empty,
	message,
	Row,
	Space,
	Table,
	Tag,
	Tooltip,
	Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import questionBankService from '../../services/questionBankService';
import { elevation } from '../../styles/elevation';
import { QuestionBank, QuestionBankSharePermission } from '../../types';

const { Title, Text } = Typography;

const permissionColors = {
	[QuestionBankSharePermission.ViewOnly]: 'default',
	[QuestionBankSharePermission.CanEdit]: 'processing',
	[QuestionBankSharePermission.CanDelete]: 'warning',
};

const permissionIcons = {
	[QuestionBankSharePermission.ViewOnly]: <EyeInvisibleOutlined />,
	[QuestionBankSharePermission.CanEdit]: <EditOutlined />,
	[QuestionBankSharePermission.CanDelete]: <DeleteOutlined />,
};

const SharedQuestionBanks: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const permissionLabels = {
		[QuestionBankSharePermission.ViewOnly]: t('sharedQuestionBanks.permission.viewOnly'),
		[QuestionBankSharePermission.CanEdit]: t('sharedQuestionBanks.permission.canEdit'),
		[QuestionBankSharePermission.CanDelete]: t('sharedQuestionBanks.permission.fullAccess'),
	};

	const [loading, setLoading] = useState(false);
	const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
	const [total, setTotal] = useState(0);
	const [filters, setFilters] = useState({
		page: 1,
		size: 10,
	});

	useEffect(() => {
		fetchSharedQuestionBanks();
	}, [filters]);

	const fetchSharedQuestionBanks = async () => {
		setLoading(true);
		try {
			const response = await questionBankService.getSharedQuestionBanks(filters);
			setQuestionBanks(response.banks);
			setTotal(response.total);
		} catch (error) {
			message.error(t('sharedQuestionBanks.loadError'));
		} finally {
			setLoading(false);
		}
	};

	const columns: ColumnsType<QuestionBank> = [
		{
			title: t('sharedQuestionBanks.columns.bankName'),
			dataIndex: 'name',
			key: 'name',
			width: 300,
			render: (text, record) => (
				<Space direction="vertical" size={0}>
					<Space>
						<Typography.Text strong>{text}</Typography.Text>
						<Tooltip
							title={
								record.is_public
									? t('sharedQuestionBanks.public')
									: t('sharedQuestionBanks.private')
							}
						>
							{record.is_public ? (
								<ShareAltOutlined style={{ color: '#52c41a' }} />
							) : (
								<UserOutlined style={{ color: '#faad14' }} />
							)}
						</Tooltip>
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
			title: t('sharedQuestionBanks.columns.questionCount'),
			dataIndex: 'question_count',
			key: 'question_count',
			width: 120,
			align: 'center',
			render: (count) => (
				<Badge count={count || 0} showZero color="#1890ff" style={{ fontSize: 14 }} />
			),
		},
		{
			title: t('sharedQuestionBanks.columns.myPermission'),
			key: 'permission',
			width: 150,
			render: (_, record: any) => {
				if (record.is_owner || record.access_level === 'owner') {
					return <Tag color="gold">{t('sharedQuestionBanks.permission.owner')}</Tag>;
				}
				const permission = record.can_delete
					? QuestionBankSharePermission.CanDelete
					: record.can_edit
						? QuestionBankSharePermission.CanEdit
						: QuestionBankSharePermission.ViewOnly;
				return (
					<Tag icon={permissionIcons[permission]} color={permissionColors[permission]}>
						{permissionLabels[permission]}
					</Tag>
				);
			},
		},
		{
			title: t('sharedQuestionBanks.columns.sharer'),
			key: 'creator',
			width: 150,
			render: (_, record: any) => (
				<Space>
					<UserOutlined />
					<Text>{record.creator?.full_name || 'N/A'}</Text>
				</Space>
			),
		},
		{
			title: t('sharedQuestionBanks.columns.createdAt'),
			dataIndex: 'created_at',
			key: 'created_at',
			width: 150,
			render: (date) => dayjs(date).format('DD/MM/YYYY'),
		},
		{
			title: t('sharedQuestionBanks.columns.actions'),
			key: 'action',
			fixed: 'right',
			width: 100,
			render: (_, record) => (
				<Space size="small">
					<Tooltip title={t('sharedQuestionBanks.viewDetail')}>
						<Button
							type="text"
							icon={<EyeOutlined />}
							onClick={() => navigate(`/question-banks/${record.id}`)}
						/>
					</Tooltip>
				</Space>
			),
		},
	];

	return (
		<Space direction="vertical" size="large" style={{ width: '100%' }}>
			<Row justify="space-between" align="middle">
				<Col>
					<Space direction="vertical" size={4}>
						<Title level={2} style={{ margin: 0, fontWeight: 600 }}>
							<ShareAltOutlined style={{ marginRight: 8 }} />{' '}
							{t('sharedQuestionBanks.title')}
						</Title>
						<Text type="secondary" style={{ fontSize: 14 }}>
							{t('sharedQuestionBanks.subtitle')}
						</Text>
					</Space>
				</Col>
				<Col>
					<Button icon={<RollbackOutlined />} onClick={() => navigate('/question-banks')}>
						{t('sharedQuestionBanks.back')}
					</Button>
				</Col>
			</Row>

			<Card style={{ ...elevation[1], borderRadius: 16 }}>
				{questionBanks.length === 0 && !loading ? (
					<Empty
						description={
							<Space direction="vertical" size="small">
								<Text type="secondary">{t('sharedQuestionBanks.empty.title')}</Text>
								<Text type="secondary" style={{ fontSize: 12 }}>
									{t('sharedQuestionBanks.empty.description')}
								</Text>
							</Space>
						}
						image={Empty.PRESENTED_IMAGE_SIMPLE}
					/>
				) : (
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
							showTotal: (total) => t('sharedQuestionBanks.showTotal', { total }),
							onChange: (page, size) => setFilters({ ...filters, page, size }),
						}}
					/>
				)}
			</Card>
		</Space>
	);
};

export default SharedQuestionBanks;
