import {
	CustomerServiceOutlined,
	FileTextOutlined,
	QuestionCircleOutlined,
} from '@ant-design/icons';
import { Col, FloatButton, Row, Space } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import {
	ActivityChart,
	CompactStatsRow,
	DashboardHeader,
	DetailTabs,
	QuickMetricsPanel,
} from './components';

// Hooks
import { useDashboardData } from './hooks';

/**
 * Dashboard Page - Option A: Single-View + Tabs Layout
 * 
 * Design principles (based on 2024 best practices):
 * - Above-the-fold priority: Key metrics visible without scrolling
 * - Progressive disclosure: Summary first, drill-down via tabs
 * - High data density: 5 KPIs in 1 compact row
 * - Clean Corporate style
 */
const Dashboard: React.FC = () => {
	const { t } = useTranslation();
	const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'year'>('month');

	// All data fetching centralized in custom hook
	const {
		stats,
		recentActivities,
		isLoading,
		chartData,
		proctoringOverview,
		realTimeStats,
	} = useDashboardData(timePeriod);

	const handleTimePeriodChange = (value: string | number) => {
		setTimePeriod(value as 'week' | 'month' | 'year');
	};

	return (
		<Space
			direction="vertical"
			size="middle"
			style={{ width: '100%', animation: 'fadeIn 400ms ease-in-out' }}
		>
			{/* Header with time period filter */}
			<DashboardHeader timePeriod={timePeriod} onTimePeriodChange={handleTimePeriodChange} />

			{/* Row 1: Compact Stats - 5 KPIs in 1 row */}
			<CompactStatsRow
				stats={stats}
				realTimeStats={realTimeStats}
				isLoading={isLoading.stats}
			/>

			{/* Row 2: Activity Chart + Quick Metrics Panel */}
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={15}>
					<ActivityChart data={chartData.activity} isLoading={isLoading.activity} />
				</Col>
				<Col xs={24} lg={9}>
					<QuickMetricsPanel
						stats={stats}
						proctoringOverview={proctoringOverview}
						isLoading={isLoading.stats}
					/>
				</Col>
			</Row>

			{/* Row 3: Tabbed Detail Sections (below the fold) */}
			<DetailTabs
				questionChartData={chartData.question}
				performanceChartData={chartData.performance}
				recentActivities={recentActivities}
				proctoringOverview={proctoringOverview}
				isLoading={{
					question: isLoading.question,
					performance: isLoading.performance,
					activities: isLoading.activities,
					proctoring: isLoading.proctoring,
				}}
			/>

			{/* Floating Action Button */}
			<FloatButton.Group
				trigger="hover"
				type="primary"
				style={{ right: 24, bottom: 24 }}
				icon={<CustomerServiceOutlined />}
			>
				<FloatButton tooltip={t('dashboard.guide')} icon={<QuestionCircleOutlined />} />
				<FloatButton tooltip={t('dashboard.report')} icon={<FileTextOutlined />} />
			</FloatButton.Group>
		</Space>
	);
};

export default Dashboard;
