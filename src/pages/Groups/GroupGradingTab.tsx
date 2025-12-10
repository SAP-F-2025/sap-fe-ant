import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	EyeOutlined,
	SyncOutlined,
	TrophyOutlined,
	UserOutlined,
} from '@ant-design/icons';
import {
	Avatar,
	Button,
	Card,
	Col,
	Empty,
	Input,
	Row,
	Select,
	Space,
	Spin,
	Statistic,
	Table,
	Tag,
	Typography,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { gradingService, type AttemptListItem } from '../../services/gradingService';
import { cardColors } from '../../styles/cardColors';
import { elevation } from '../../styles/elevation';
import { useThemeToken } from '../../theme/ThemeProvider';

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

	// Filters
	const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
	const [searchText, setSearchText] = useState('');

	// Calculate statistics
	const stats = useMemo(() => {
		const graded = attempts.filter((a) => a.score !== undefined).length;
		const pending = attempts.filter(
			(a) => a.status === 'completed' && a.score === undefined
		).length;
		const avgScore =
			graded > 0
				? Math.round(
						attempts
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
	}, [attempts, total]);

	useEffect(() => {
		fetchAttempts();
	}, [pagination.current, pagination.pageSize, statusFilter, groupId]);

	const fetchAttempts = async () => {
		try {
			setLoading(true);
			const response = await gradingService.getAttempts({
				page: pagination.current,
				size: pagination.pageSize,
				status: statusFilter,
				group_id: groupId,
			});

			setAttempts(response.data || []);
			setTotal(response.total || 0);
		} catch {
			// Silent fail - show empty state
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

	const filteredAttempts = useMemo(() => {
		if (!searchText) return attempts;
		const search = searchText.toLowerCase();
		return attempts.filter(
			(a) =>
				a.student?.full_name?.toLowerCase().includes(search) ||
				a.student?.email?.toLowerCase().includes(search) ||
				a.assessment?.title?.toLowerCase().includes(search)
		);
	}, [attempts, searchText]);

	const getStatusTag = (attempt: AttemptListItem) => {
		if (attempt.score !== undefined) {
			return (
				<Tag color="success" icon={<CheckCircleOutlined />}>
					{t('gradingList.statusGraded')}
				</Tag>
			);
		}
		if (attempt.status === 'completed') {
			return (
				<Tag color="warning" icon={<ClockCircleOutlined />}>
					{t('gradingList.statusPending')}
				</Tag>
			);
		}
		if (attempt.status === 'in_progress') {
			return (
				<Tag color="processing" icon={<SyncOutlined spin />}>
					{t('gradingList.statusInProgress')}
				</Tag>
			);
		}
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
			title: t('gradingList.assessment'),
			key: 'assessment',
			render: (_, record) => (
				<Text>{record.assessment?.title || `Assessment #${record.assessment_id}`}</Text>
			),
		},
		{
			title: t('gradingList.status'),
			key: 'status',
			width: 140,
			render: (_, record) => getStatusTag(record),
			filters: [
				{ text: t('gradingList.statusGraded'), value: 'graded' },
				{ text: t('gradingList.statusPending'), value: 'completed' },
				{ text: t('gradingList.statusInProgress'), value: 'in_progress' },
			],
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
			sorter: (a, b) => dayjs(a.completed_at || 0).unix() - dayjs(b.completed_at || 0).unix(),
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

	if (loading && attempts.length === 0) {
		return (
			<div style={{ textAlign: 'center', padding: 48 }}>
				<Spin size="large" />
			</div>
		);
	}

	return (
		<Space direction="vertical" size="large" style={{ width: '100%' }}>
			{/* Statistics */}
			<Row gutter={[16, 16]}>
				<Col xs={12} sm={6}>
					<Card
						style={{ ...elevation[0], borderRadius: 12, background: cardColors.blue }}
					>
						<Statistic
							title={t('gradingList.totalAttempts')}
							value={stats.total}
							prefix={<TrophyOutlined />}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={6}>
					<Card
						style={{ ...elevation[0], borderRadius: 12, background: cardColors.green }}
					>
						<Statistic
							title={t('gradingList.graded')}
							value={stats.graded}
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: token.token.colorSuccess }}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={6}>
					<Card
						style={{ ...elevation[0], borderRadius: 12, background: cardColors.orange }}
					>
						<Statistic
							title={t('gradingList.pending')}
							value={stats.pending}
							prefix={<ClockCircleOutlined />}
							valueStyle={{ color: token.token.colorWarning }}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={6}>
					<Card
						style={{ ...elevation[0], borderRadius: 12, background: cardColors.purple }}
					>
						<Statistic
							title={t('gradingList.avgScore')}
							value={stats.avgScore}
							suffix="%"
						/>
					</Card>
				</Col>
			</Row>

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
				</Space>
			</Card>

			{/* Table */}
			{filteredAttempts.length === 0 && !loading ? (
				<Card style={{ ...elevation[0], borderRadius: 12 }}>
					<Empty
						description={t('gradingList.noAttempts')}
						image={Empty.PRESENTED_IMAGE_SIMPLE}
					/>
				</Card>
			) : (
				<Card style={{ ...elevation[0], borderRadius: 12 }}>
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
				</Card>
			)}
		</Space>
	);
};

export default GroupGradingTab;
