import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	EyeOutlined,
	FileSearchOutlined,
	HourglassOutlined,
	SyncOutlined,
	ThunderboltOutlined,
	TrophyOutlined,
	UserOutlined,
} from '@ant-design/icons';
import {
	Avatar,
	Button,
	Card,
	Col,
	Flex,
	Input,
	Row,
	Select,
	Space,
	Table,
	Tag,
	Typography,
	message,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import { assessmentService } from '../../services/assessmentService';
import { gradingService, type AttemptListItem } from '../../services/gradingService';
import { cardColors } from '../../styles/cardColors';
import { elevation } from '../../styles/elevation';
import { useThemeToken } from '../../theme/ThemeProvider';
import { Assessment } from '../../types';

const { Title, Text } = Typography;
const { Search } = Input;

const GradingList: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const token = useThemeToken();
	const [loading, setLoading] = useState(false);
	const [attempts, setAttempts] = useState<AttemptListItem[]>([]);
	const [total, setTotal] = useState(0);
	const [allAttemptsStats, setAllAttemptsStats] = useState<AttemptListItem[]>([]);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
	});

	// Filters
	const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
	const [searchText, setSearchText] = useState('');
	const [assessmentFilter, setAssessmentFilter] = useState<number | undefined>(undefined);
	const [assessments, setAssessments] = useState<Assessment[]>([]);

	// Sorting
	const [sortBy, setSortBy] = useState<string | undefined>(undefined);
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);

	// Selection state for attempts
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [selectedAttempts, setSelectedAttempts] = useState<AttemptListItem[]>([]);

	// Calculate statistics from ALL attempts, not just current page
	const stats = useMemo(() => {
		const graded = allAttemptsStats.filter((a) => a.score !== undefined).length;
		const pending = allAttemptsStats.filter(
			(a) => a.status === 'completed' && a.score === undefined
		).length;
		const avgScore =
			graded > 0
				? Math.round(
					allAttemptsStats
						.filter((a) => a.score !== undefined)
						.reduce((sum, a) => sum + (a.score || 0), 0) / graded
				)
				: 0;
		return {
			total: total,
			graded,
			pending,
			avgScore,
		};
	}, [allAttemptsStats, total]);

	useEffect(() => {
		fetchAttempts();
	}, [pagination.current, pagination.pageSize, statusFilter, assessmentFilter, sortBy, sortOrder]);

	// Reset to page 1 when filters change
	useEffect(() => {
		setPagination(prev => ({ ...prev, current: 1 }));
	}, [statusFilter, assessmentFilter]);

	useEffect(() => {
		fetchAssessments();
	}, []);

	// Fetch all attempts for statistics (only once on mount)
	useEffect(() => {
		fetchAllAttemptsForStats();
	}, []);

	const fetchAssessments = async () => {
		try {
			const response = await assessmentService.getAssessments({
				page: 1,
				size: 100,
			});
			setAssessments(response.assessments || []);
		} catch (error) {
			console.error(t('gradingList.loadError'), error);
		}
	};

	const fetchAttempts = async () => {
		try {
			setLoading(true);
			const response = await gradingService.getAttempts({
				page: pagination.current,
				size: pagination.pageSize,
				status: statusFilter,
				assessment_id: assessmentFilter,
				sort_by: sortBy,
				sort_order: sortOrder,
			});

			setAttempts(response.data); // Changed from 'attempts' to 'data'
			setTotal(response.total); // Changed from 'total_elements' to 'total'
		} catch (error) {
			message.error(t('gradingList.loadError'));
		} finally {
			setLoading(false);
		}
	};

	// Fetch all attempts for statistics calculation
	const fetchAllAttemptsForStats = async () => {
		try {
			const response = await gradingService.getAttempts({
				page: 1,
				size: 10000,
			});
			setAllAttemptsStats(response.data || []);
		} catch (error) {
			console.error('Failed to fetch grading statistics:', error);
		}
	};

	const handleTableChange = (
		newPagination: TablePaginationConfig,
		filters: Record<string, FilterValue | null>,
		sorter: SorterResult<AttemptListItem> | SorterResult<AttemptListItem>[]
	) => {
		// Update pagination
		setPagination({
			current: newPagination.current || 1,
			pageSize: newPagination.pageSize || 10,
		});

		// Update sorting
		if (!Array.isArray(sorter) && sorter.field && sorter.order) {
			const field = sorter.field as string;
			setSortBy(field);
			setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
		} else if (!Array.isArray(sorter) && !sorter.order) {
			// Clear sorting
			setSortBy(undefined);
			setSortOrder(undefined);
		}
	};

	const getStatusBadge = (status: string, isPendingGrade?: boolean) => {
		// Show pending grade status with icon if is_pending_grade is true
		if (isPendingGrade) {
			return (
				<Tag color="warning" icon={<HourglassOutlined />}>
					{t('gradingList.statusPendingGrade')}
				</Tag>
			);
		}

		const statusMap: Record<string, 'in-progress' | 'completed' | 'failed' | 'pending'> = {
			in_progress: 'in-progress',
			completed: 'completed',
			abandoned: 'failed',
			timeout: 'failed',
		};
		return <StatusBadge status={statusMap[status] || 'pending'} />;
	};

	const handleViewDetail = (attemptId: number) => {
		navigate(`/grading/${attemptId}`);
	};

	const handleAutoGradeAll = async () => {
		if (!assessmentFilter) {
			message.warning(t('gradingList.selectAssessment'));
			return;
		}

		try {
			setLoading(true);
			const result = await gradingService.autoGradeAssessment(assessmentFilter);
			message.success(
				t('gradingList.autoGradeSuccess', {
					processed: result.processed_attempts,
					graded: result.auto_graded,
					manual: result.manual_required,
				})
			);
			await fetchAttempts();
		} catch (error) {
			message.error(t('gradingList.autoGradeError'));
		} finally {
			setLoading(false);
		}
	};

	const columns: ColumnsType<AttemptListItem> = [
		{
			title: t('gradingList.columnId'),
			dataIndex: 'id',
			key: 'id',
			width: 80,
		},
		{
			title: t('gradingList.columnAssessment'),
			dataIndex: ['assessment', 'title'],
			key: 'assessment',
			width: 200,
			render: (_, record) => (
				<Space direction="vertical" size={0}>
					<Text strong>
						{record.assessment?.title ||
							t('gradingList.assessmentFallback', {
								id: record.assessment_id,
							})}
					</Text>
					<Text type="secondary" style={{ fontSize: 12 }}>
						{t('gradingList.passingScore')}: {record.assessment?.passing_score}%
					</Text>
				</Space>
			),
		},
		{
			title: t('gradingList.columnStudent'),
			dataIndex: ['student', 'full_name'],
			key: 'student',
			width: 200,
			render: (_, record) => (
				<Space>
					<Avatar size="small" icon={<UserOutlined />} src={record.student?.avatar_url} />
					<Space direction="vertical" size={0}>
						<Text>{record.student?.full_name || `HV-${record.student_id}`}</Text>
						<Text type="secondary" style={{ fontSize: 12 }}>
							{record.student?.email}
						</Text>
					</Space>
				</Space>
			),
		},
		{
			title: t('gradingList.columnStatus'),
			dataIndex: 'status',
			key: 'status',
			width: 130,
			sorter: true,
			render: (status, record) => getStatusBadge(status, record.is_pending_grade),
			filters: [
				{
					text: t('gradingList.statusInProgress'),
					value: 'in_progress',
				},
				{ text: t('gradingList.statusCompleted'), value: 'completed' },
				{ text: t('gradingList.statusAbandoned'), value: 'abandoned' },
				{ text: t('gradingList.statusTimeout'), value: 'timeout' },
			],
			filteredValue: statusFilter ? [statusFilter] : null,
		},
		{
			title: t('gradingList.columnScore'),
			dataIndex: 'score',
			key: 'score',
			width: 120,
			align: 'center',
			sorter: true,
			render: (score, record) => (
				<Space direction="vertical" size={0}>
					{score !== undefined ? (
						<>
							<Text strong style={{ fontSize: 18 }}>
								{score.toFixed(1)}
							</Text>
							{record.passed !== undefined &&
								(record.passed ? (
									<Tag color="success">{t('gradingList.passed')}</Tag>
								) : (
									<Tag color="error">{t('gradingList.failed')}</Tag>
								))}
						</>
					) : (
						<Tag color="warning">{t('gradingList.notGraded')}</Tag>
					)}
				</Space>
			),
		},
		{
			title: t('gradingList.columnStarted'),
			dataIndex: 'started_at',
			key: 'started_at',
			width: 160,
			sorter: true,
			render: (date) => (
				<Space direction="vertical" size={0}>
					<Text>{dayjs(date).format('DD/MM/YYYY')}</Text>
					<Text type="secondary" style={{ fontSize: 12 }}>
						{dayjs(date).format('HH:mm:ss')}
					</Text>
				</Space>
			),
		},
		{
			title: t('gradingList.columnCompleted'),
			dataIndex: 'completed_at',
			key: 'completed_at',
			width: 160,
			sorter: true,
			render: (date) =>
				date ? (
					<Space direction="vertical" size={0}>
						<Text>{dayjs(date).format('DD/MM/YYYY')}</Text>
						<Text type="secondary" style={{ fontSize: 12 }}>
							{dayjs(date).format('HH:mm:ss')}
						</Text>
					</Space>
				) : (
					<Text type="secondary">-</Text>
				),
		},
		{
			title: t('gradingList.columnActions'),
			key: 'action',
			fixed: 'right',
			width: 120,
			render: (_, record) => (
				<Button
					type="primary"
					size="small"
					icon={<EyeOutlined />}
					onClick={() => handleViewDetail(record.id)}
				>
					{t('gradingList.viewDetail')}
				</Button>
			),
		},
	];

	return (
		<Space direction="vertical" size="large" style={{ width: '100%' }}>
			<Flex justify="space-between" align="center">
				<Space direction="vertical" size={4}>
					<Title level={2} style={{ margin: 0, fontWeight: 600 }}>
						<CheckCircleOutlined style={{ marginRight: 8 }} /> {t('gradingList.title')}
					</Title>
					<Text type="secondary" style={{ fontSize: 14 }}>
						{t('gradingList.subtitle')}
					</Text>
				</Space>
				<Space>
					<Button icon={<SyncOutlined />} onClick={fetchAttempts} loading={loading}>
						{t('gradingList.refresh')}
					</Button>
					<Button
						type="primary"
						icon={<ThunderboltOutlined />}
						onClick={handleAutoGradeAll}
						disabled={!assessmentFilter}
					>
						{t('gradingList.autoGradeAll')}
					</Button>
				</Space>
			</Flex>

			{/* Filters */}
			<Card style={{ ...elevation[1], borderRadius: 16 }}>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} md={8}>
						<Space direction="vertical" style={{ width: '100%' }} size={4}>
							<Text strong>{t('gradingList.statusFilter')}</Text>
							<Select
								style={{ width: '100%' }}
								placeholder={t('gradingList.allStatuses')}
								allowClear
								value={statusFilter}
								onChange={setStatusFilter}
								options={[
									{
										label: t('gradingList.statusInProgress'),
										value: 'in_progress',
									},
									{
										label: t('gradingList.statusCompleted'),
										value: 'completed',
									},
									{
										label: t('gradingList.statusAbandoned'),
										value: 'abandoned',
									},
									{
										label: t('gradingList.statusTimeout'),
										value: 'timeout',
									},
								]}
							/>
						</Space>
					</Col>
					<Col xs={24} sm={12} md={8}>
						<Space direction="vertical" style={{ width: '100%' }} size={4}>
							<Text strong>{t('gradingList.assessmentFilter')}</Text>
							<Select
								style={{ width: '100%' }}
								placeholder={t('gradingList.allAssessments')}
								allowClear
								showSearch
								value={assessmentFilter}
								onChange={setAssessmentFilter}
								filterOption={(input, option) =>
									(option?.label ?? '')
										.toLowerCase()
										.includes(input.toLowerCase())
								}
								options={assessments.map((assessment) => ({
									label: assessment.title,
									value: assessment.id,
								}))}
							/>
						</Space>
					</Col>
					<Col xs={24} sm={12} md={8}>
						<Space direction="vertical" style={{ width: '100%' }} size={4}>
							<Text strong>{t('gradingList.searchLabel')}</Text>
							<Search
								placeholder={t('gradingList.searchPlaceholder')}
								allowClear
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								onSearch={fetchAttempts}
							/>
						</Space>
					</Col>
				</Row>
			</Card>

			<Card style={{ ...elevation[1], borderRadius: 16 }}>
				{selectedAttempts.length > 0 && (
					<div
						style={{
							marginBottom: 16,
							padding: 12,
							background: '#e6f7ff',
							borderRadius: 8,
						}}
					>
						<Space>
							<Text strong>
								{t('gradingList.selectedCount', {
									count: selectedAttempts.length,
									defaultValue: `${selectedAttempts.length} attempt(s) selected`,
								})}
							</Text>
							<Button
								size="small"
								onClick={() => {
									setSelectedRowKeys([]);
									setSelectedAttempts([]);
								}}
							>
								{t('common.clearSelection', 'Clear Selection')}
							</Button>
						</Space>
					</div>
				)}
				<Table
					columns={columns}
					dataSource={attempts}
					rowKey="id"
					loading={loading}
					scroll={{ x: 1400 }}
					rowSelection={{
						selectedRowKeys,
						onChange: (keys, rows) => {
							setSelectedRowKeys(keys);
							setSelectedAttempts(rows);
						},
					}}
					pagination={{
						current: pagination.current,
						pageSize: pagination.pageSize,
						total: total,
						showSizeChanger: true,
						showTotal: (total) => t('gradingList.totalItems', { count: total }),
						pageSizeOptions: ['10', '20', '50', '100'],
					}}
					onChange={handleTableChange}
				/>
			</Card>

			{/* Statistics Summary - Moved to bottom */}
			<Card
				bordered={false}
				style={{
					...elevation[1],
					borderRadius: 16,
					background: '#f5f5f5',
				}}
			>
				<Space direction="vertical" size={8} style={{ width: '100%' }}>
					<Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
						{t('gradingList.statsTitle')}
					</Text>
					<Row gutter={[12, 12]}>
						<Col xs={12} sm={6}>
							<Flex align="center" gap={8}>
								<Avatar
									size={36}
									icon={<FileSearchOutlined style={{ fontSize: 16 }} />}
									style={{
										backgroundColor: cardColors.geekblue,
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
										{t('gradingList.totalSubmissions')}
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
										{stats.graded}
									</Text>
									<Text type="secondary" style={{ fontSize: 12 }}>
										{t('gradingList.graded')}
									</Text>
								</Space>
							</Flex>
						</Col>
						<Col xs={12} sm={6}>
							<Flex align="center" gap={8}>
								<Avatar
									size={36}
									icon={<ClockCircleOutlined style={{ fontSize: 16 }} />}
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
										{stats.pending}
									</Text>
									<Text type="secondary" style={{ fontSize: 12 }}>
										{t('gradingList.pending')}
									</Text>
								</Space>
							</Flex>
						</Col>
						<Col xs={12} sm={6}>
							<Flex align="center" gap={8}>
								<Avatar
									size={36}
									icon={<TrophyOutlined style={{ fontSize: 16 }} />}
									style={{
										backgroundColor: cardColors.volcano,
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
										{stats.avgScore}
									</Text>
									<Text type="secondary" style={{ fontSize: 12 }}>
										{t('gradingList.avgScore')}
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

export default GradingList;
