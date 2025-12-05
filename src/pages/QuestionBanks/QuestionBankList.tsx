import {
	BankOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	FolderOutlined,
	GlobalOutlined,
	LockOutlined,
	PlusOutlined,
	SearchOutlined,
	ShareAltOutlined,
	UnlockOutlined,
} from '@ant-design/icons';
import {
	Avatar,
	Badge,
	Button,
	Card,
	Col,
	Flex,
	Input,
	message,
	Popconfirm,
	Row,
	Space,
	Table,
	Tooltip,
	Typography
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ShareQuestionBankModal } from '../../components/QuestionBank/ShareQuestionBankModal';
import questionBankService from '../../services/questionBankService';
import { cardColors } from '../../styles/cardColors';
import { elevation } from '../../styles/elevation';
import { useThemeToken } from '../../theme/ThemeProvider';
import { QuestionBank } from '../../types';
import { showSuccess } from '../../utils/errorHandler';


const { Title, Text } = Typography;
const { Search } = Input;

const QuestionBankList: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const token = useThemeToken();
	const [loading, setLoading] = useState(false);
	const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
	const [total, setTotal] = useState(0);
	const [allBanksStats, setAllBanksStats] = useState<QuestionBank[]>([]);
	const [filters, setFilters] = useState({
		page: 1,
		size: 10,
		search: '',
	});
	const [shareModalVisible, setShareModalVisible] = useState(false);
	const [selectedBank, setSelectedBank] = useState<QuestionBank | null>(null);

	// Calculate statistics from ALL banks, not just current page
	const stats = useMemo(() => {
		const totalQuestions = allBanksStats.reduce(
			(sum, bank) => sum + (bank.question_count || 0),
			0
		);
		return {
			total: total,
			public: allBanksStats?.filter((b) => b.is_public).length || 0,
			private: allBanksStats?.filter((b) => !b.is_public).length || 0,
			totalQuestions,
		};
	}, [allBanksStats, total]);

	useEffect(() => {
		fetchQuestionBanks();
	}, [filters]);

	// Fetch all banks for statistics (only once on mount)
	useEffect(() => {
		fetchAllBanksForStats();
	}, []);

	const fetchQuestionBanks = async () => {
		setLoading(true);
		try {
			const response = await questionBankService.getQuestionBanks(filters);
			setQuestionBanks(response.banks);
			setTotal(response.total);
		} catch (error) {
			message.error(t('questionBankList.loadError'));
		} finally {
			setLoading(false);
		}
	};

	// Fetch all banks for statistics calculation
	const fetchAllBanksForStats = async () => {
		try {
			const response = await questionBankService.getQuestionBanks({ page: 1, size: 10000 });
			setAllBanksStats(response.banks || []);
		} catch (error) {
			console.error('Failed to fetch question bank statistics:', error);
		}
	};

	const handleDelete = async (id: number) => {
		try {
			await questionBankService.deleteQuestionBank(id);
			showSuccess(t('questionBankList.deleteSuccess'));
			fetchQuestionBanks();
		} catch (error) {
			message.error(t('questionBankList.deleteError'));
		}
	};

	const handleShare = (bank: QuestionBank) => {
		setSelectedBank(bank);
		setShareModalVisible(true);
	};

	const handleShareModalClose = () => {
		setShareModalVisible(false);
		// Clear selected bank after animation completes
		setTimeout(() => setSelectedBank(null), 300);
	};



	const columns: ColumnsType<QuestionBank> = [
		{
			title: t('questionBankList.columnName'),
			dataIndex: 'name',
			key: 'name',
			width: 300,
			render: (text, record) => (
				<Space direction="vertical" size={0}>
					<Space>
						<Typography.Text strong>{text}</Typography.Text>
						{record.is_public ? (
							<Tooltip title={t('questionBankList.publicTooltip')}>
								<UnlockOutlined style={{ color: '#52c41a' }} />
							</Tooltip>
						) : (
							<Tooltip title={t('questionBankList.privateTooltip')}>
								<LockOutlined style={{ color: '#faad14' }} />
							</Tooltip>
						)}
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
			title: t('questionBankList.columnQuestions'),
			dataIndex: 'question_count',
			key: 'question_count',
			width: 120,
			align: 'center',
			render: (count) => (
				<Badge
					count={count || 0}
					showZero
					color="#1890ff"
					style={{ fontSize: 14 }}
				/>
			),
		},
		{
			title: t('questionBankList.columnCreated'),
			dataIndex: 'created_at',
			key: 'created_at',
			width: 150,
			render: (date) => dayjs(date).format('DD/MM/YYYY'),
		},
		{
			title: t('questionBankList.columnActions'),
			key: 'action',
			fixed: 'right',
			width: 120,
			render: (_, record) => (
				<Space size="small">
					<Tooltip title={t('questionBankList.viewDetail')}>
						<Button
							type="text"
							icon={<EyeOutlined />}
							onClick={() => navigate(`/question-banks/${record.id}`)}
						/>
					</Tooltip>
					<Tooltip title={t('questionBankList.edit')}>
						<Button
							type="text"
							icon={<EditOutlined />}
							onClick={() => navigate(`/question-banks/edit/${record.id}`)}
						/>
					</Tooltip>
					<Tooltip title={t('questionBankList.share')}>
						<Button
							type="text"
							icon={<ShareAltOutlined />}
							onClick={() => handleShare(record)}
						/>
					</Tooltip>
					<Popconfirm
						title={t('questionBankList.confirmDelete')}
						description={t('questionBankList.confirmDeleteDesc')}
						onConfirm={() => handleDelete(record.id)}
						okText={t('common.delete')}
						cancelText={t('common.cancel')}
						okButtonProps={{ danger: true }}
					>
						<Tooltip title={t('questionBankList.delete')}>
							<Button
								type="text"
								danger
								icon={<DeleteOutlined />}
							/>
						</Tooltip>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Space direction="vertical" size="large" style={{ width: '100%' }}>
			<Flex justify="space-between" align="center">
				<Space direction="vertical" size={4}>
					<Title level={2} style={{ margin: 0, fontWeight: 600 }}>
						<BankOutlined style={{ marginRight: 8 }} /> {t('questionBankList.title')}
					</Title>
					<Text type="secondary" style={{ fontSize: 14 }}>
						{t('questionBankList.subtitle')}
					</Text>
				</Space>
				<Space>
					<Button
						icon={<GlobalOutlined />}
						size="large"
						onClick={() => navigate('/question-banks/public')}
						style={{ height: 44, borderRadius: 10 }}
					>
						{t('questionBankList.public')}
					</Button>
					<Button
						icon={<ShareAltOutlined />}
						size="large"
						onClick={() => navigate('/question-banks/shared')}
						style={{ height: 44, borderRadius: 10 }}
					>
						{t('questionBankList.shared')}
					</Button>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						size="large"
						onClick={() => navigate('/question-banks/new')}
						style={{ fontWeight: 500, height: 44, borderRadius: 10, paddingLeft: 24, paddingRight: 24 }}
					>
						{t('questionBankList.createNew')}
					</Button>
				</Space>
			</Flex>



			<Card style={{ ...elevation[1], borderRadius: 16 }}>
				<Space direction="vertical" size="middle" style={{ width: '100%' }}>
					<Search
						placeholder={t('questionBankList.searchPlaceholder')}
						allowClear
						enterButton={<SearchOutlined />}
						size="large"
						onSearch={(value) =>
							setFilters({ ...filters, search: value, page: 1 })
						}
					/>

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
							showTotal: (total) => t('questionBankList.totalItems', { count: total }),
							onChange: (page, size) =>
								setFilters({ ...filters, page, size }),
						}}
					/>
				</Space>
			</Card>

			{/* Statistics Summary - Moved to bottom */}
			<Card bordered={false} style={{ ...elevation[1], borderRadius: 16, background: '#f5f5f5' }}>
				<Space direction="vertical" size={8} style={{ width: '100%' }}>
					<Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>{t('questionBankList.statsTitle')}</Text>
					<Row gutter={[12, 12]}>
						<Col xs={12} sm={6}>
							<Flex align="center" gap={8}>
								<Avatar size={36} icon={<BankOutlined style={{ fontSize: 16 }} />}
									style={{ backgroundColor: cardColors.cyan, flexShrink: 0 }} />
								<Space direction="vertical" size={0}>
									<Text style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{stats.total}</Text>
									<Text type="secondary" style={{ fontSize: 12 }}>{t('questionBankList.totalBanks')}</Text>
								</Space>
							</Flex>
						</Col>
						<Col xs={12} sm={6}>
							<Flex align="center" gap={8}>
								<Avatar size={36} icon={<GlobalOutlined style={{ fontSize: 16 }} />}
									style={{ backgroundColor: cardColors.blue, flexShrink: 0 }} />
								<Space direction="vertical" size={0}>
									<Text style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{stats.public}</Text>
									<Text type="secondary" style={{ fontSize: 12 }}>{t('questionBankList.publicBanks')}</Text>
								</Space>
							</Flex>
						</Col>
						<Col xs={12} sm={6}>
							<Flex align="center" gap={8}>
								<Avatar size={36} icon={<LockOutlined style={{ fontSize: 16 }} />}
									style={{ backgroundColor: cardColors.magenta, flexShrink: 0 }} />
								<Space direction="vertical" size={0}>
									<Text style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{stats.private}</Text>
									<Text type="secondary" style={{ fontSize: 12 }}>{t('questionBankList.privateBanks')}</Text>
								</Space>
							</Flex>
						</Col>
						<Col xs={12} sm={6}>
							<Flex align="center" gap={8}>
								<Avatar size={36} icon={<FolderOutlined style={{ fontSize: 16 }} />}
									style={{ backgroundColor: cardColors.gold, flexShrink: 0 }} />
								<Space direction="vertical" size={0}>
									<Text style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{stats.totalQuestions}</Text>
									<Text type="secondary" style={{ fontSize: 12 }}>{t('questionBankList.totalQuestions')}</Text>
								</Space>
							</Flex>
						</Col>
					</Row>
				</Space>
			</Card>

			<ShareQuestionBankModal
				bankId={selectedBank?.id || 0}
				bankName={selectedBank?.name || ''}
				visible={shareModalVisible}
				onCancel={handleShareModalClose}
				onSuccess={() => {
					fetchQuestionBanks();
				}}
			/>
		</Space>
	);
};

export default QuestionBankList;
