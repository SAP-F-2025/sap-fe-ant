import { CustomerServiceOutlined, FileTextOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Col, FloatButton, Row, Space } from 'antd';
import React, { useState } from 'react';

// Components
import {
	ActivityChart,
	DashboardHeader,
	PerformanceChart,
	QuestionPieChart,
	QuickStats,
	RecentActivities,
	StatsRow,
} from './components';

// Hooks
import { useDashboardData } from './hooks';

/**
 * Dashboard Page
 * Admin overview with statistics, charts, and recent activities
 * 
 * Refactored to follow best practices:
 * - Extracted components for better maintainability
 * - Custom hook for data fetching (useDashboardData)
 * - Constants file for magic numbers
 * - Memoized chart data transformations
 * - Proper loading and error states
 */
const Dashboard: React.FC = () => {
	const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'year'>('month');

	// All data fetching centralized in custom hook
	const {
		stats,
		recentActivities,
		isLoading,
		chartData,
	} = useDashboardData(timePeriod);

	const handleTimePeriodChange = (value: string | number) => {
		setTimePeriod(value as 'week' | 'month' | 'year');
	};

	return (
		<Space
			direction="vertical"
			size="large"
			style={{ width: '100%', animation: 'fadeIn 400ms ease-in-out' }}
		>
			{/* Header with time period filter */}
			<DashboardHeader timePeriod={timePeriod} onTimePeriodChange={handleTimePeriodChange} />

			{/* Compact Statistics Cards */}
			<StatsRow stats={stats} />

			{/* Charts Row - Activity & Question Distribution */}
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={16}>
					<ActivityChart data={chartData.activity} isLoading={isLoading.activity} />
				</Col>
				<Col xs={24} lg={8}>
					<QuestionPieChart data={chartData.question} isLoading={isLoading.question} />
				</Col>
			</Row>

			{/* Performance & Recent Activities Row */}
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={12}>
					<PerformanceChart data={chartData.performance} isLoading={isLoading.performance} />
				</Col>
				<Col xs={24} lg={12}>
					<RecentActivities activities={recentActivities} isLoading={isLoading.activities} />
				</Col>
			</Row>

			{/* Quick Stats - Completion, Average, Pass Rate */}
			<QuickStats stats={stats} />

			{/* Floating Action Button */}
			<FloatButton.Group
				trigger="hover"
				type="primary"
				style={{ right: 24, bottom: 24 }}
				icon={<CustomerServiceOutlined />}
			>
				<FloatButton tooltip="Hướng dẫn" icon={<QuestionCircleOutlined />} />
				<FloatButton tooltip="Báo cáo" icon={<FileTextOutlined />} />
			</FloatButton.Group>
		</Space>
	);
};

export default Dashboard;
