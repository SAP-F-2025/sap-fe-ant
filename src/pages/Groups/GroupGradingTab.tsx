import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	ExclamationCircleOutlined,
	EyeOutlined,
	SyncOutlined,
	UserOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import {
	Avatar,
	Badge,
	Button,
	Card,
	Col,
	Empty,
	Input,
	Row,
	Select,
	Space,
	Spin,
	Table,
	Tag,
	Tooltip,
	Typography,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { gradingService, type AttemptListItem } from '../../services/gradingService';
import proctoringDashboardService from '../../services/proctoringDashboardService';
import { elevation } from '../../styles/elevation';
import { useThemeToken } from '../../theme/ThemeProvider';
import { AttemptViolationSummary, getSeverityColor, getSeverityName } from '../../types/proctoring';
import { AssessmentSidebar, GradingStatsRow } from './components';

const { Text } = Typography;
const { Search } = Input;

interface GroupGradingTabProps {
	groupId: number;
}

const GroupGradingTab: React.FC<GroupGradingTabProps> = ({ groupId }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const token = useThemeToken();
	const [loading, setLoading] = useState(false);
	const [attempts, setAttempts] = useState<AttemptListItem[]>([]);
	const [total, setTotal] = useState(0);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
	});
	const [violationSummaries, setViolationSummaries] = useState<
		Record<string, AttemptViolationSummary>
	>({});

	// Selected assessment from sidebar
	const [selectedAssessmentId, setSelectedAssessmentId] = useState<number | null>(null);
	const [selectedAssessmentTitle, setSelectedAssessmentTitle] = useState<string>('');

	// Filters
	const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
	const [searchText, setSearchText] = useState('');

	// Fetch attempts when assessment is selected
	useEffect(() => {
		if (selectedAssessmentId) {
			fetchAttempts();
		} else {
			setAttempts([]);
			setTotal(0);
		}
	}, [pagination.current, pagination.pageSize, statusFilter, selectedAssessmentId]);

	// Fetch violation summaries when attempts change
	useEffect(() => {
		const fetchViolationSummaries = async () => {
			if (attempts.length === 0) return;

			const attemptIds = attempts.map((a) => a.id);
			try {
				const response = await proctoringDashboardService.getAttemptSummaries(attemptIds);
				const summaryMap: Record<string, AttemptViolationSummary> = {};
				response.data.forEach((s) => {
					summaryMap[s.attempt_id.toString()] = s;
				});
				setViolationSummaries(summaryMap);
			} catch (error) {
				// Silently fail - proctoring data is supplementary
			}
		};

		fetchViolationSummaries();
	}, [attempts]);

	const fetchAttempts = async () => {
		if (!selectedAssessmentId) return;

		try {
			setLoading(true);
			const response = await gradingService.getAttempts({
				page: pagination.current,
				size: pagination.pageSize,
				status: statusFilter,
				assessment_id: selectedAssessmentId,
				group_id: groupId,
			});

			setAttempts(response.data || []);
			setTotal(response.total || 0);
		} catch {
			setAttempts([]);
			setTotal(0);
		} finally {
			setLoading(false);
		}
	};

	const handleTableChange = (newPagination: TablePaginationConfig) => {
		setPagination({
			current: newPagination.current || 1,
			pageSize: newPagination.pageSize || 10,
		});
	};

	const handleAssessmentSelect = (assessmentId: number | null) => {
		setSelectedAssessmentId(assessmentId);
		// Reset pagination when changing assessment
		setPagination((prev) => ({ ...prev, current: 1 }));
	};

	const filteredAttempts = useMemo(() => {
		if (!searchText) return attempts;
		const search = searchText.toLowerCase();
		return attempts.filter(
			(a) =>
				a.student?.full_name?.toLowerCase().includes(search) ||
				a.student?.email?.toLowerCase().includes(search)
		);
	}, [attempts, searchText]);

	const getStatusTag = (attempt: AttemptListItem) => {
		// Handle in_progress status
		if (attempt.status === 'in_progress') {
			return (
				<Tag color="processing" icon={<SyncOutlined spin />}>
					{t('gradingList.statusInProgress')}
				</Tag>
			);
		}

		// Handle timeout status
		if (attempt.status === 'timeout') {
			// Timeout attempts may still need grading
			if (attempt.is_pending_grade === true) {
				return (
					<Tag color="warning" icon={<ClockCircleOutlined />}>
						{t('gradingList.statusPending')}
					</Tag>
				);
			}
			return (
				<Tag color="error">
					{t('gradingList.statusTimeout')}
				</Tag>
			);
		}

		// Handle abandoned status
		if (attempt.status === 'abandoned') {
			return (
				<Tag color="default">
					{t('gradingList.statusAbandoned')}
				</Tag>
			);
		}

		// Handle completed status - check grading status
		if (attempt.status === 'completed') {
			// is_pending_grade is the primary indicator
			if (attempt.is_pending_grade === true) {
				return (
					<Tag color="warning" icon={<ClockCircleOutlined />}>
						{t('gradingList.statusPending')}
					</Tag>
				);
			}
			// is_pending_grade === false or score exists means graded
			return (
				<Tag color="success" icon={<CheckCircleOutlined />}>
					{t('gradingList.statusGraded')}
				</Tag>
			);
		}

		// Fallback for unknown statuses
		return <Tag>{attempt.status}</Tag>;
	};

	const columns: ColumnsType<AttemptListItem> = [
		{
			title: t('gradingList.student'),
			key: 'student',
			render: (_, record) => (
				<Space>
					<Avatar size="small" src={record.student?.avatar_url} icon={<UserOutlined />} />
					<div>
						<Text strong>
							{record.student?.full_name || `Student #${record.student_id}`}
						</Text>
						{record.student?.email && (
							<>
								<br />
								<Text type="secondary" style={{ fontSize: 12 }}>
									{record.student.email}
								</Text>
							</>
						)}
					</div>
				</Space>
			),
		},
		{
			title: t('gradingList.status'),
			key: 'status',
			width: 140,
			render: (_, record) => getStatusTag(record),
		},
		{
			title: t('gradingList.score'),
			key: 'score',
			width: 100,
			align: 'center',
			render: (_, record) =>
				record.score !== undefined ? (
					<Tag color={record.passed ? 'success' : 'error'}>{record.score}</Tag>
				) : (
					<Text type="secondary">-</Text>
				),
		},
		{
			title: t('gradingList.violations'),
			key: 'violations',
			width: 120,
			align: 'center',
			render: (_, record) => {
				const summary = violationSummaries[record.id.toString()];
				if (!summary || summary.total_violations === 0) {
					return (
						<Tooltip title={t('gradingList.noViolations')}>
							<Tag color="success">{t('gradingList.clean')}</Tag>
						</Tooltip>
					);
				}

				const severityColor = getSeverityColor(summary.max_severity_level);
				const severityLabel = getSeverityName(summary.max_severity_level);

				return (
					<Tooltip
						title={
							<div>
								<div>
									{t('gradingList.totalViolations')}: {summary.total_violations}
								</div>
								<div>
									{t('gradingList.highestSeverity')}:{' '}
									{t(`proctoring.severity.${severityLabel.toLowerCase()}`)}
								</div>
							</div>
						}
					>
						<Badge
							count={summary.total_violations}
							overflowCount={99}
							style={{ backgroundColor: severityColor }}
						>
							{summary.max_severity_level >= 2 ? (
								<Tag color={severityColor} icon={<ExclamationCircleOutlined />}>
									{t(`proctoring.severity.${severityLabel.toLowerCase()}`)}
								</Tag>
							) : (
								<Tag color={severityColor} icon={<WarningOutlined />}>
									{t(`proctoring.severity.${severityLabel.toLowerCase()}`)}
								</Tag>
							)}
						</Badge>
					</Tooltip>
				);
			},
		},
		{
			title: t('gradingList.submittedAt'),
			dataIndex: 'completed_at',
			key: 'completed_at',
			width: 160,
			render: (date: string) =>
				date ? (
					<Text type="secondary">{dayjs(date).format('DD/MM/YYYY HH:mm')}</Text>
				) : (
					<Text type="secondary">-</Text>
				),
		},
		{
			title: t('gradingList.action'),
			key: 'action',
			width: 100,
			align: 'center',
			render: (_, record) => (
				<Button
					type="link"
					icon={<EyeOutlined />}
					onClick={() => navigate(`/grading/${record.id}`)}
				>
					{t('gradingList.view')}
				</Button>
			),
		},
	];

	return (
		<Row gutter={24}>
			{/* Left Sidebar - Assessment List */}
			<Col xs={24} lg={6}>
				<AssessmentSidebar
					groupId={groupId}
					selectedId={selectedAssessmentId}
					onSelect={handleAssessmentSelect}
				/>
			</Col>

			{/* Right Panel - Grading Content */}
			<Col xs={24} lg={18}>
				{selectedAssessmentId ? (
					<Space direction="vertical" size="middle" style={{ width: '100%' }}>
						{/* Stats Row */}
						<GradingStatsRow
							assessmentId={selectedAssessmentId}
							groupId={groupId}
							assessmentTitle={selectedAssessmentTitle}
						/>

						{/* Filters */}
						<Card style={{ ...elevation[0], borderRadius: 12 }}>
							<Space wrap>
								<Search
									placeholder={t('gradingList.searchPlaceholder')}
									allowClear
									style={{ width: 250 }}
									onSearch={setSearchText}
									onChange={(e) => !e.target.value && setSearchText('')}
								/>
								<Select
									placeholder={t('gradingList.filterStatus')}
									style={{ width: 150 }}
									allowClear
									value={statusFilter}
									onChange={setStatusFilter}
									options={[
										{ label: t('gradingList.statusGraded'), value: 'graded' },
										{ label: t('gradingList.statusPending'), value: 'completed' },
										{ label: t('gradingList.statusInProgress'), value: 'in_progress' },
									]}
								/>
								<Button
									icon={<SyncOutlined />}
									onClick={fetchAttempts}
									loading={loading}
								>
									{t('common.refresh', 'Làm mới')}
								</Button>
							</Space>
						</Card>

						{/* Table */}
						<Card style={{ ...elevation[0], borderRadius: 12 }}>
							{filteredAttempts.length === 0 && !loading ? (
								<Empty
									description={t('groupGrading.noAttempts', 'Chưa có bài nộp nào')}
									image={Empty.PRESENTED_IMAGE_SIMPLE}
								/>
							) : (
								<Table
									columns={columns}
									dataSource={filteredAttempts}
									rowKey="id"
									loading={loading}
									pagination={{
										current: pagination.current,
										pageSize: pagination.pageSize,
										total: total,
										showSizeChanger: true,
										showTotal: (total) => t('gradingList.totalItems', { total }),
									}}
									onChange={handleTableChange}
									size="middle"
								/>
							)}
						</Card>
					</Space>
				) : (
					<Card
						style={{
							...elevation[1],
							borderRadius: 16,
							minHeight: 400,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Empty
							description={
								<Space direction="vertical" align="center">
									<Text type="secondary" style={{ fontSize: 16 }}>
										{t('groupGrading.selectAssessment', 'Chọn một bài thi để xem chi tiết chấm điểm')}
									</Text>
								</Space>
							}
							image={Empty.PRESENTED_IMAGE_SIMPLE}
						/>
					</Card>
				)}
			</Col>
		</Row>
	);
};

export default GroupGradingTab;
