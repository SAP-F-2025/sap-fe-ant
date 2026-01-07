import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	EyeOutlined,
	HourglassOutlined,
	PlayCircleOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Select, Space, Table, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import studentService from '../../services/studentService';
import type { AttemptStatus, AttemptWithAssessment } from '../../types';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { Option } = Select;

const StudentHistory: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { t } = useTranslation();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [statusFilter, setStatusFilter] = useState<AttemptStatus | undefined>();

	const { data, isLoading, isFetching } = useQuery({
		queryKey: ['student-history', page, pageSize, statusFilter],
		queryFn: () =>
			studentService.getAttemptHistory({
				page,
				size: pageSize,
				status: statusFilter,
			}),
		placeholderData: (previousData) => previousData, // Keep previous data while fetching (v5 syntax)
		staleTime: 30 * 1000, // Cache data for 30 seconds
		refetchOnWindowFocus: true, // Refetch when user returns to tab
	});

	// Reset to page 1 when filter changes
	useEffect(() => {
		setPage(1);
	}, [statusFilter]);

	// Helper function to check if results should be hidden
	const isPendingGrading = (record: AttemptWithAssessment): boolean => {
		// Only completed attempts can be pending grading
		if (record.status !== 'completed') {
			return false;
		}

		// Check if there are ungraded questions
		return record.is_pending_grade ?? false;
	};

	const getStatusTag = (status: string) => {
		const statusMap: Record<string, { color: string; icon: React.ReactNode; textKey: string }> =
		{
			in_progress: {
				color: 'processing',
				icon: <ClockCircleOutlined />,
				textKey: 'studentHistory.status.inProgress',
			},
			completed: {
				color: 'success',
				icon: <CheckCircleOutlined />,
				textKey: 'studentHistory.status.completed',
			},
			abandoned: {
				color: 'default',
				icon: <CloseCircleOutlined />,
				textKey: 'studentHistory.status.abandoned',
			},
			timeout: {
				color: 'error',
				icon: <ClockCircleOutlined />,
				textKey: 'studentHistory.status.timeout',
			},
		};

		const statusInfo = statusMap[status] || {
			color: 'default',
			icon: null,
			textKey: status,
		};

		return (
			<Tag color={statusInfo.color} icon={statusInfo.icon}>
				{t(statusInfo.textKey)}
			</Tag>
		);
	};

	const columns = [
		{
			title: t('studentHistory.columns.assessment'),
			dataIndex: 'assessment_title',
			key: 'assessment',
			render: (title: string) => (
				<div>
					<Text strong>{title || t('studentHistory.unknown')}</Text>
				</div>
			),
		},
		{
			title: t('studentHistory.columns.status'),
			dataIndex: 'status',
			key: 'status',
			width: 140,
			render: (status: string) => getStatusTag(status),
			filters: [
				{
					text: t('studentHistory.status.inProgress'),
					value: 'in_progress',
				},
				{
					text: t('studentHistory.status.completed'),
					value: 'completed',
				},
				{
					text: t('studentHistory.status.abandoned'),
					value: 'abandoned',
				},
				{ text: t('studentHistory.status.timeout'), value: 'timeout' },
			],
			onFilter: (value: any, record: AttemptWithAssessment) => record.status === value,
		},
		{
			title: t('studentHistory.columns.score'),
			dataIndex: 'score',
			key: 'score',
			width: 120,
			render: (score: number | undefined, record: AttemptWithAssessment) => {
				// Check if not completed
				if (record.status !== 'completed') {
					return <Text type="secondary">-</Text>;
				}

				// Check if pending grading
				if (isPendingGrading(record)) {
					return (
						<Tag icon={<HourglassOutlined />} color="warning">
							{t('studentHistory.grading')}
						</Tag>
					);
				}

				// Show score if available
				if (score === undefined) {
					return <Text type="secondary">-</Text>;
				}

				const percentage = record.percentage ?? score;
				return (
					<Text type={record.passed ? 'success' : 'danger'} strong>
						{percentage.toFixed(1)}%
					</Text>
				);
			},
		},
		{
			title: t('studentHistory.columns.result'),
			dataIndex: 'passed',
			key: 'passed',
			width: 120,
			render: (passed: boolean | undefined, record: AttemptWithAssessment) => {
				// Check if not completed
				if (record.status !== 'completed') {
					return <Text type="secondary">-</Text>;
				}

				// Check if pending grading
				if (isPendingGrading(record)) {
					return (
						<Tag icon={<HourglassOutlined />} color="warning">
							{t('studentHistory.grading')}
						</Tag>
					);
				}

				// Show pass/fail status
				return passed ? (
					<Tag color="success" icon={<CheckCircleOutlined />}>
						{t('studentHistory.passed')}
					</Tag>
				) : (
					<Tag color="error" icon={<CloseCircleOutlined />}>
						{t('studentHistory.failed')}
					</Tag>
				);
			},
		},
		{
			title: t('studentHistory.columns.startedAt'),
			dataIndex: 'started_at',
			key: 'started_at',
			width: 180,
			render: (date: string) => (
				<div>
					<div>{dayjs(date).format('DD/MM/YYYY')}</div>
					<Text type="secondary" style={{ fontSize: '12px' }}>
						{dayjs(date).format('HH:mm')}
					</Text>
				</div>
			),
		},
		{
			title: t('studentHistory.columns.completedAt'),
			dataIndex: 'completed_at',
			key: 'completed_at',
			width: 180,
			render: (date: string | undefined) =>
				date ? (
					<div>
						<div>{dayjs(date).format('DD/MM/YYYY')}</div>
						<Text type="secondary" style={{ fontSize: '12px' }}>
							{dayjs(date).format('HH:mm')}
						</Text>
					</div>
				) : (
					<Text type="secondary">-</Text>
				),
		},
		{
			title: t('studentHistory.columns.timeSpent'),
			key: 'time_spent',
			width: 120,
			render: (_: any, record: AttemptWithAssessment) => {
				if (!record.completed_at) {
					return <Text type="secondary">-</Text>;
				}
				const duration = dayjs(record.completed_at).diff(
					dayjs(record.started_at),
					'minute'
				);
				return <Text>{t('studentHistory.minutes', { count: duration })}</Text>;
			},
		},
		{
			title: t('studentHistory.columns.action'),
			key: 'action',
			width: 120,
			fixed: 'right' as const,
			render: (_: any, record: AttemptWithAssessment) => (
				<Space>
					{record.status === 'in_progress' ? (
						<Button
							type="primary"
							size="small"
							icon={<PlayCircleOutlined />}
							onClick={() => {
								// Check if identity verification is required for resume
								if (record.assessment?.settings?.require_identity_verification) {
									navigate('/student/face-verification', {
										state: {
											assessment: {
												id: record.assessment_id,
												title: record.assessment_title,
												duration: record.assessment?.duration || 60,
												passing_score: record.assessment?.passing_score || 0,
												attempts_used: 0,
												max_attempts: 1,
											},
											resumeAttemptId: record.id,
										},
									});
								} else {
									navigate(`/student/take/${record.id}`);
								}
							}}
						>
							{t('studentHistory.continue')}
						</Button>

					) : (
						<Button
							type="link"
							size="small"
							icon={<EyeOutlined />}
							onClick={() => navigate(`/student/results/${record.id}`)}
						>
							{t('studentHistory.view')}
						</Button>
					)}
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: '24px' }}>
			<div style={{ marginBottom: '24px' }}>
				<Title level={2}>{t('studentHistory.title')}</Title>
				<Text type="secondary">{t('studentHistory.subtitle')}</Text>
			</div>

			<Card>
				<Space direction="vertical" size="large" style={{ width: '100%' }}>
					{/* Filters */}
					<Space size="middle">
						<Select
							placeholder={t('studentHistory.filterPlaceholder')}
							allowClear
							style={{ width: 200 }}
							value={statusFilter}
							onChange={setStatusFilter}
						>
							<Option value="in_progress">
								{t('studentHistory.status.inProgress')}
							</Option>
							<Option value="completed">
								{t('studentHistory.status.completed')}
							</Option>
							<Option value="abandoned">
								{t('studentHistory.status.abandoned')}
							</Option>
							<Option value="timeout">{t('studentHistory.status.timeout')}</Option>
						</Select>
					</Space>

					{/* Table */}
					<Table
						columns={columns}
						dataSource={data?.data || []}
						rowKey="id"
						loading={isLoading}
						pagination={{
							current: page,
							pageSize: pageSize,
							total: data?.total || 0,
							showSizeChanger: true,
							showTotal: (total) =>
								t('studentHistory.totalAttempts', {
									count: total,
								}),
							onChange: (page, pageSize) => {
								setPage(page);
								setPageSize(pageSize);
							},
						}}
						scroll={{ x: 1200 }}
					/>
				</Space>
			</Card>
		</div>
	);
};

export default StudentHistory;
