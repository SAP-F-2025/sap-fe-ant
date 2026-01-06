import { useQuery } from '@tanstack/react-query';
import { Col, Row, Space } from 'antd';
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import studentService from '../../services/studentService';
import type { StudentDashboardStats } from '../../types';

// New components
import {
	PerformanceGauge,
	PerformanceMetrics,
	RecentAttemptsCard,
	StudentDashboardHeader,
	StudentQuickActions,
	StudentStatsRow,
	UpcomingAssessmentsCard,
} from './components';

/**
 * Student Dashboard - Redesigned
 *
 * Features:
 * - Large gradient stat cards for key metrics
 * - Performance gauge with circular chart
 * - Progress bars for quick stats
 * - Card-based upcoming assessments
 * - Timeline-style recent attempts
 * - Floating quick action buttons
 */
const StudentDashboard: React.FC = () => {
	const { user } = useAuth();

	// Fetch dashboard stats
	const { data: stats, isLoading } = useQuery<StudentDashboardStats>({
		queryKey: ['student-dashboard-stats'],
		queryFn: () => studentService.getDashboardStats(),
	});

	return (
		<Space
			direction="vertical"
			size="middle"
			style={{
				width: '100%',
				padding: '24px',
				animation: 'fadeIn 400ms ease-in-out',
			}}
		>
			{/* Row 1: Welcome Header */}
			<StudentDashboardHeader user={user} />

			{/* Row 2: Overview Stats - 4 Large Gradient Cards */}
			<StudentStatsRow stats={stats?.overview} isLoading={isLoading} />

			{/* Row 3: Performance Section - Gauge + Metrics */}
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={14}>
					<PerformanceGauge performance={stats?.performance} isLoading={isLoading} />
				</Col>
				<Col xs={24} lg={10}>
					<PerformanceMetrics performance={stats?.performance} isLoading={isLoading} />
				</Col>
			</Row>

			{/* Row 4: Upcoming Assessments + Recent Attempts */}
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={14}>
					<UpcomingAssessmentsCard
						data={stats?.upcoming_assessments}
						isLoading={isLoading}
					/>
				</Col>
				<Col xs={24} lg={10}>
					<RecentAttemptsCard data={stats?.recent_attempts} isLoading={isLoading} />
				</Col>
			</Row>

			{/* Floating Quick Actions */}
			<StudentQuickActions />

			{/* FadeIn Animation */}
			<style>{`
				@keyframes fadeIn {
					from { opacity: 0; transform: translateY(10px); }
					to { opacity: 1; transform: translateY(0); }
				}
			`}</style>
		</Space>
	);
};

export default StudentDashboard;
