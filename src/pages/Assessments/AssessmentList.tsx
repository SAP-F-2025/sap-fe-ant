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
	message,
} from 'antd';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import { elevation } from '../../styles/elevation';
import { cardColors } from '../../styles/cardColors';
import type { ColumnsType } from 'antd/es/table';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	DownloadOutlined,
	EyeOutlined,
	SearchOutlined,
	FileTextOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	FileProtectOutlined,
	InboxOutlined,
} from '@ant-design/icons';
import { Assessment, AssessmentStatus } from '../../types';
import assessmentService from '../../services/assessmentService';
import importExportService from '../../services/importExportService';
import dayjs from 'dayjs';
import { useThemeToken } from '../../theme/ThemeProvider';
import { showError, showSuccess } from '../../utils/errorHandler';

const { Title, Text } = Typography;
const { Search } = Input;

const AssessmentList: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const token = useThemeToken();
	const [loading, setLoading] = useState(false);
	const [assessments, setAssessments] = useState<Assessment[]>([]);
	const [total, setTotal] = useState(0);
	const [allAssessmentsStats, setAllAssessmentsStats] = useState<Assessment[]>([]);
	const [filters, setFilters] = useState({
		page: 1,
		size: 10,
		status: undefined as string | undefined,
		search: '',
	});
	const [exportingId, setExportingId] = useState<number | null>(null);

	// Calculate statistics from ALL assessments, not just current page
	const stats = useMemo(() => {
		return {
			total: total,
			active:
				allAssessmentsStats?.filter((a) => a.status === AssessmentStatus.Active).length ||
				0,
			draft:
				allAssessmentsStats?.filter((a) => a.status === AssessmentStatus.Draft).length || 0,
			archived:
				allAssessmentsStats?.filter((a) => a.status === AssessmentStatus.Archived).length ||
				0,
		};
	}, [allAssessmentsStats, total]);

	useEffect(() => {
		fetchAssessments();
	}, [filters]);

	// Fetch all assessments for statistics (only once on mount)
	useEffect(() => {
		fetchAllAssessmentsForStats();
	}, []);

	const fetchAssessments = async () => {
		setLoading(true);
		try {
			const response = await assessmentService.getAssessments(filters);
			setAssessments(response.assessments);
			setTotal(response.total);
		} catch (error) {
			// showError('Failed to load assessments');
		} finally {
			setLoading(false);
		}
	};

	// Fetch all assessments for statistics calculation
	const fetchAllAssessmentsForStats = async () => {
		try {
			const response = await assessmentService.getAssessments({
				page: 1,
				size: 10000,
			});
			setAllAssessmentsStats(response.assessments || []);
		} catch (error) {
			console.error('Failed to fetch assessment statistics:', error);
		}
	};

	const handleDelete = async (id: number) => {
		try {
			await assessmentService.deleteAssessment(id);
			showSuccess(t('assessmentList.deleteSuccess'));
			fetchAssessments();
		} catch (error) {
			// Error handled by interceptor
		}
	};

	const handlePublish = async (id: number) => {
		try {
			await assessmentService.publishAssessment(id);
			showSuccess(t('assessmentList.publishSuccess'));
			fetchAssessments();
		} catch (error) {
			// message.error('Failed to publish assessment');
		}
	};

	const handleArchive = async (id: number) => {
		try {
			await assessmentService.archiveAssessment(id);
			showSuccess(t('assessmentList.archiveSuccess'));
			fetchAssessments();
		} catch (error) {
			// message.error('Failed to archive assessment');
		}
	};

	const getStatusBadge = (status: AssessmentStatus) => {
		const statusMap: Record<AssessmentStatus, 'active' | 'draft' | 'archived' | 'pending'> = {
			[AssessmentStatus.Active]: 'active',
			[AssessmentStatus.Draft]: 'draft',
			[AssessmentStatus.Archived]: 'archived',
			[AssessmentStatus.Expired]: 'pending',
		};
		return <StatusBadge status={statusMap[status]} />;
	};

	const handleExportResults = async (assessment: Assessment) => {
		try {
			setExportingId(assessment.id);
			const blob = await importExportService.exportAssessmentResults(assessment.id);
			const filename = `${assessment.title}_results.xlsx`;
			importExportService.downloadFile(blob, filename);
			message.success(t('assessmentList.exportSuccess', 'Results exported successfully'));
		} catch (error: any) {
			message.error(
				error.response?.data?.message ||
				t('assessmentList.exportError', 'Failed to export results')
			);
		} finally {
			setExportingId(null);
		}
	};

	const columns: ColumnsType<Assessment> = [
		{
			title: t('assessmentList.columnTitle'),
			dataIndex: 'title',
			key: 'title',
			width: 300,
			render: (text, record) => (
				<Space direction="vertical" size={0}>
					<Typography.Link strong onClick={() => navigate(`/assessments/${record.id}`)}>
						{text}
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
			title: t('assessmentList.columnStatus'),
			dataIndex: 'status',
			key: 'status',
			width: 140,
			render: (status) => getStatusBadge(status),
		},
		{
			title: t('assessmentList.columnInfo'),
			key: 'info',
			width: 200,
			render: (_, record) => (
				<Space direction="vertical" size={0}>
					<Typography.Text style={{ fontSize: 12 }}>
						{record.questions_count || 0} {t('assessmentList.questions')}
					</Typography.Text>
					<Typography.Text style={{ fontSize: 12 }}>
						{t('assessmentList.duration')}: {record.duration}{' '}
						{t('assessmentList.minutes')}
					</Typography.Text>
					<Typography.Text style={{ fontSize: 12 }}>
						{t('assessmentList.passingScore')}: {record.passing_score}%
					</Typography.Text>
				</Space>
			),
		},
		{
			title: t('assessmentList.columnDueDate'),
			dataIndex: 'due_date',
			key: 'due_date',
			width: 150,
			render: (date) => (date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-'),
		},
		{
			title: t('assessmentList.columnCreated'),
			dataIndex: 'created_at',
			key: 'created_at',
			width: 150,
			render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
		},
		{
			title: t('assessmentList.columnActions'),
			key: 'action',
			fixed: 'right',
			width: 220,
			render: (_, record) => (
				<Space size="small" style={{ display: 'flex' }}>
					<Tooltip title={t('assessmentList.viewDetail')}>
						<Button
							type="text"
							icon={<EyeOutlined />}
							onClick={() => navigate(`/assessments/${record.id}`)}
						/>
					</Tooltip>
					<Tooltip title={t('assessmentList.exportResults', 'Export Results')}>
						<Button
							type="text"
							icon={<DownloadOutlined />}
							loading={exportingId === record.id}
							onClick={() => handleExportResults(record)}
						/>
					</Tooltip>
					<Tooltip title={t('assessmentList.edit')}>
						<Button
							type="text"
							icon={<EditOutlined />}
							onClick={() => navigate(`/assessments/edit/${record.id}`)}
						/>
					</Tooltip>
					{record.status === AssessmentStatus.Draft ? (
						<Tooltip title={t('assessmentList.publish')}>
							<Button
								type="text"
								icon={<CheckCircleOutlined />}
								onClick={(e) => {
									e.stopPropagation();
									handlePublish(record.id);
								}}
							/>
						</Tooltip>
					) : record.status === AssessmentStatus.Active ? (
						<Tooltip title={t('assessmentList.archive')}>
							<Button
								type="text"
								icon={<CloseCircleOutlined />}
								onClick={(e) => {
									e.stopPropagation();
									handleArchive(record.id);
								}}
							/>
						</Tooltip>
					) : (
						<Button
							type="text"
							icon={<CheckCircleOutlined />}
							style={{
								visibility: 'hidden',
								pointerEvents: 'none',
							}}
						/>
					)}
					<Popconfirm
						title={t('assessmentList.confirmDelete')}
						description={t('assessmentList.confirmDeleteDesc')}
						onConfirm={() => handleDelete(record.id)}
						okText={t('common.delete')}
						cancelText={t('common.cancel')}
						okButtonProps={{ danger: true }}
					>
						<Tooltip title={t('assessmentList.delete')}>
							<Button type="text" danger icon={<DeleteOutlined />} />
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
						<FileTextOutlined style={{ marginRight: 8 }} /> {t('assessmentList.title')}
					</Title>
					<Text type="secondary" style={{ fontSize: 14 }}>
						{t('assessmentList.subtitle')}
					</Text>
				</Space>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					size="large"
					onClick={() => navigate('/assessments/new')}
					style={{
						fontWeight: 500,
						height: 44,
						borderRadius: 10,
						paddingLeft: 24,
						paddingRight: 24,
					}}
				>
					{t('assessmentList.createNew')}
				</Button>
			</Flex>

			<Card style={{ ...elevation[1], borderRadius: 16 }}>
				<Space direction="vertical" size="middle" style={{ width: '100%' }}>
					<Row gutter={16}>
						<Col flex="auto">
							<Search
								placeholder={t('assessmentList.searchPlaceholder')}
								allowClear
								enterButton={<SearchOutlined />}
								size="large"
								onSearch={(value) =>
									setFilters({
										...filters,
										search: value,
										page: 1,
									})
								}
							/>
						</Col>
						<Col>
							<Select
								placeholder={t('assessmentList.statusFilter')}
								style={{ width: 180 }}
								size="large"
								allowClear
								onChange={(value) =>
									setFilters({
										...filters,
										status: value,
										page: 1,
									})
								}
								options={[
									{
										label: t('assessment.status.draft'),
										value: AssessmentStatus.Draft,
									},
									{
										label: t('assessment.status.active'),
										value: AssessmentStatus.Active,
									},
									{
										label: t('assessment.status.completed'),
										value: AssessmentStatus.Expired,
									},
									{
										label: t('assessmentList.archivedAssessments'),
										value: AssessmentStatus.Archived,
									},
								]}
							/>
						</Col>
					</Row>

					<Table
						columns={columns}
						dataSource={assessments}
						rowKey="id"
						loading={loading}
						scroll={{ x: 1200 }}
						pagination={{
							current: filters.page,
							pageSize: filters.size,
							total: total,
							showSizeChanger: true,
							showTotal: (total) =>
								t('assessmentList.totalItems', {
									count: total,
								}),
							onChange: (page, size) => setFilters({ ...filters, page, size }),
						}}
					/>
				</Space>
			</Card>

			{/* Statistics Summary - Moved to bottom */}
			<Card
				variant="borderless"
				style={{
					...elevation[1],
					borderRadius: 16,
					background: '#f5f5f5',
				}}
			>
				<Space direction="vertical" size={8} style={{ width: '100%' }}>
					<Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
						{t('assessmentList.statsTitle')}
					</Text>
					<Row gutter={[12, 12]}>
						<Col xs={12} sm={6}>
							<Flex align="center" gap={8}>
								<Avatar
									size={36}
									icon={<FileTextOutlined style={{ fontSize: 16 }} />}
									style={{
										backgroundColor: cardColors.blue,
										flexShrink: 0,
									}}
								/>
								<Space direction="vertical" size={0}>
									<Text
										style={{
											fontSize: 20,
											fontWeight: 700,
											lineHeight: 1.2,
										}}
									>
										{stats.total}
									</Text>
									<Text type="secondary" style={{ fontSize: 12 }}>
										{t('assessmentList.totalAssessments')}
									</Text>
								</Space>
							</Flex>
						</Col>
						<Col xs={12} sm={6}>
							<Flex align="center" gap={8}>
								<Avatar
									size={36}
									icon={<CheckCircleOutlined style={{ fontSize: 16 }} />}
									style={{
										backgroundColor: cardColors.green,
										flexShrink: 0,
									}}
								/>
								<Space direction="vertical" size={0}>
									<Text
										style={{
											fontSize: 20,
											fontWeight: 700,
											lineHeight: 1.2,
										}}
									>
										{stats.active}
									</Text>
									<Text type="secondary" style={{ fontSize: 12 }}>
										{t('assessmentList.activeAssessments')}
									</Text>
								</Space>
							</Flex>
						</Col>
						<Col xs={12} sm={6}>
							<Flex align="center" gap={8}>
								<Avatar
									size={36}
									icon={<EditOutlined style={{ fontSize: 16 }} />}
									style={{
										backgroundColor: cardColors.cyan,
										flexShrink: 0,
									}}
								/>
								<Space direction="vertical" size={0}>
									<Text
										style={{
											fontSize: 20,
											fontWeight: 700,
											lineHeight: 1.2,
										}}
									>
										{stats.draft}
									</Text>
									<Text type="secondary" style={{ fontSize: 12 }}>
										{t('assessmentList.draftAssessments')}
									</Text>
								</Space>
							</Flex>
						</Col>
						<Col xs={12} sm={6}>
							<Flex align="center" gap={8}>
								<Avatar
									size={36}
									icon={<InboxOutlined style={{ fontSize: 16 }} />}
									style={{
										backgroundColor: cardColors.orange,
										flexShrink: 0,
									}}
								/>
								<Space direction="vertical" size={0}>
									<Text
										style={{
											fontSize: 20,
											fontWeight: 700,
											lineHeight: 1.2,
										}}
									>
										{stats.archived}
									</Text>
									<Text type="secondary" style={{ fontSize: 12 }}>
										{t('assessmentList.archivedAssessments')}
									</Text>
								</Space>
							</Flex>
						</Col>
					</Row>
				</Space>
			</Card>
		</Space>
	);
};

export default AssessmentList;
