import {
	ArrowRightOutlined,
	BookOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined as CloseIcon,
	FallOutlined,
	FileTextOutlined,
	HourglassOutlined,
	RiseOutlined,
	TrophyOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Row, Space, Statistic, Table, Tag, theme, Typography } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import studentService from '../../services/studentService';
import type { StudentDashboardStats } from '../../types';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { useToken } = theme;

const StudentDashboard: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { token } = useToken();
	const { t } = useTranslation();

	// Fetch dashboard stats
	const { data: stats, isLoading } = useQuery<StudentDashboardStats>({
		queryKey: ['student-dashboard-stats'],
		queryFn: () => studentService.getDashboardStats(),
	});

	const recentAttemptsColumns = [
		{
			title: t('studentDashboard.recentAttempts.columns.assessment'),
			dataIndex: 'assessment_title',
			key: 'assessment_title',
			render: (title: string) => <Text strong>{title}</Text>,
		},
		{
			title: t('studentDashboard.recentAttempts.columns.score'),
			dataIndex: 'score',
			key: 'score',
			render: (score: number, record: any) => {
				// Check if grading is pending
				if (!record.is_graded) {
					return (
						<Tag icon={<HourglassOutlined />} color="warning">
							{t('studentDashboard.recentAttempts.grading')}
						</Tag>
					);
				}
				return (
					<Text type={score >= 70 ? 'success' : 'danger'}>{score.toFixed(1)}%</Text>
				);
			},
		},
		{
			title: t('studentDashboard.recentAttempts.columns.status'),
			dataIndex: 'passed',
			key: 'passed',
			render: (passed: boolean, record: any) => {
				// Check if grading is pending
				if (!record.is_graded) {
					return (
						<Tag icon={<HourglassOutlined />} color="warning">
							{t('studentDashboard.recentAttempts.grading')}
						</Tag>
					);
				}
				return (
					<Tag color={passed ? 'success' : 'error'} icon={passed ? <CheckCircleOutlined /> : <CloseIcon />}>
						{passed ? t('studentDashboard.recentAttempts.passed') : t('studentDashboard.recentAttempts.failed')}
					</Tag>
				);
			},
		},
		{
			title: t('studentDashboard.recentAttempts.columns.completedAt'),
			dataIndex: 'completed_at',
			key: 'completed_at',
			render: (date: string) => dayjs(date).fromNow(),
		},
		{
			title: t('studentDashboard.recentAttempts.columns.action'),
			key: 'action',
			render: (_: any, record: any) => (
				<Button
					type="link"
					icon={<ArrowRightOutlined />}
					onClick={() => navigate(`/student/results/${record.id}`)}
				>
					{t('studentDashboard.recentAttempts.view')}
				</Button>
			),
		},
	];

	const upcomingColumns = [
		{
			title: t('studentDashboard.upcoming.columns.assessment'),
			dataIndex: 'title',
			key: 'title',
			render: (title: string) => <Text strong>{title}</Text>,
		},
		{
			title: t('studentDashboard.upcoming.columns.dueDate'),
			dataIndex: 'due_date',
			key: 'due_date',
			render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
		},
		{
			title: t('studentDashboard.upcoming.columns.timeRemaining'),
			dataIndex: 'days_remaining',
			key: 'days_remaining',
			render: (days: number) => {
				const color = days <= 1 ? 'red' : days <= 3 ? 'orange' : 'green';
				return (
					<Tag color={color}>
						{days === 0 ? t('studentDashboard.upcoming.today') : t('studentDashboard.upcoming.daysRemaining', { count: days })}
					</Tag>
				);
			},
		},
		{
			title: t('studentDashboard.upcoming.columns.action'),
			key: 'action',
			render: (_: any, record: any) => (
				<Button
					type="primary"
					size="small"
					onClick={() => navigate(`/student/assessments/${record.id}`)}
				>
					{t('studentDashboard.upcoming.start')}
				</Button>
			),
		},
	];

	return (
		<div style={{ padding: '24px' }}>
			<Title level={2}>{t('studentDashboard.title')}</Title>
			<Text type="secondary">{t('studentDashboard.welcomeBack', { name: user?.displayName })}</Text>

			{/* Overview Stats */}
			<Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
				<Col xs={24} sm={12} lg={6}>
					<Card loading={isLoading}>
						<Statistic
							title={t('studentDashboard.overview.assessmentsAvailable')}
							value={stats?.overview.total_assessments_available || 0}
							prefix={<BookOutlined />}
							valueStyle={{ color: token.colorPrimary }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card loading={isLoading}>
						<Statistic
							title={t('studentDashboard.overview.completed')}
							value={stats?.overview.total_assessments_completed || 0}
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: token.colorSuccess }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card loading={isLoading}>
						<Statistic
							title={t('studentDashboard.overview.inProgress')}
							value={stats?.overview.total_assessments_in_progress || 0}
							prefix={<ClockCircleOutlined />}
							valueStyle={{ color: token.colorWarning }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card loading={isLoading}>
						<Statistic
							title={t('studentDashboard.overview.totalAttempts')}
							value={stats?.overview.total_attempts || 0}
							prefix={<FileTextOutlined />}
						/>
					</Card>
				</Col>
			</Row>

			{/* Performance Stats */}
			<Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
				<Col xs={24} sm={12} lg={6}>
					<Card loading={isLoading}>
						<Statistic
							title={t('studentDashboard.performance.averageScore')}
							value={stats?.performance.average_score || 0}
							precision={1}
							suffix="%"
							prefix={<TrophyOutlined />}
							valueStyle={{ color: token.colorPrimary }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card loading={isLoading}>
						<Statistic
							title={t('studentDashboard.performance.passRate')}
							value={stats?.performance.pass_rate || 0}
							precision={1}
							suffix="%"
							prefix={
								(stats?.performance.pass_rate || 0) >= 50 ? (
									<RiseOutlined />
								) : (
									<FallOutlined />
								)
							}
							valueStyle={{
								color: (stats?.performance.pass_rate || 0) >= 50 ? token.colorSuccess : token.colorError,
							}}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card loading={isLoading}>
						<Statistic
							title={t('studentDashboard.performance.highestScore')}
							value={stats?.performance.highest_score || 0}
							precision={1}
							suffix="%"
							valueStyle={{ color: token.colorSuccess }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card loading={isLoading}>
						<Statistic
							title={t('studentDashboard.performance.lowestScore')}
							value={stats?.performance.lowest_score || 0}
							precision={1}
							suffix="%"
							valueStyle={{ color: token.colorError }}
						/>
					</Card>
				</Col>
			</Row>

			{/* Recent Attempts */}
			<Card
				title={t('studentDashboard.recentAttempts.title')}
				style={{ marginTop: '24px' }}
				extra={
					<Button type="link" onClick={() => navigate('/student/history')}>
						{t('studentDashboard.recentAttempts.viewAll')}
					</Button>
				}
				loading={isLoading}
			>
				<Table
					columns={recentAttemptsColumns}
					dataSource={stats?.recent_attempts || []}
					rowKey="id"
					pagination={false}
					locale={{ emptyText: t('studentDashboard.recentAttempts.noAttempts') }}
				/>
			</Card>

			{/* Upcoming Assessments */}
			<Card
				title={t('studentDashboard.upcoming.title')}
				style={{ marginTop: '24px' }}
				extra={
					<Button type="link" onClick={() => navigate('/student/assessments')}>
						{t('studentDashboard.upcoming.viewAll')}
					</Button>
				}
				loading={isLoading}
			>
				<Table
					columns={upcomingColumns}
					dataSource={stats?.upcoming_assessments || []}
					rowKey="id"
					pagination={false}
					locale={{ emptyText: t('studentDashboard.upcoming.noUpcoming') }}
				/>
			</Card>

			{/* Quick Actions */}
			<Card title={t('studentDashboard.quickActions.title')} style={{ marginTop: '24px' }}>
				<Space size="middle" wrap>
					<Button
						type="primary"
						icon={<BookOutlined />}
						onClick={() => navigate('/student/assessments')}
					>
						{t('studentDashboard.quickActions.viewAssessments')}
					</Button>
					<Button
						icon={<FileTextOutlined />}
						onClick={() => navigate('/student/history')}
					>
						{t('studentDashboard.quickActions.viewHistory')}
					</Button>
					<Button
						icon={<ClockCircleOutlined />}
						onClick={() => {
							// Navigate to in-progress attempts
							navigate('/student/history');
						}}
					>
						{t('studentDashboard.quickActions.continueAttempt')}
					</Button>
				</Space>
			</Card>
		</div>
	);
};

export default StudentDashboard;
