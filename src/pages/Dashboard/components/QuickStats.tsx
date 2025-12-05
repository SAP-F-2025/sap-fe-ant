import { CheckCircleOutlined, RiseOutlined, TrophyOutlined } from '@ant-design/icons';
import { Card, Col, Progress, Row, Skeleton, Statistic } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';
import type { DashboardStats } from '../../../types';
import { STAT_CARD_COLORS } from '../constants';

interface QuickStatsProps {
	stats: DashboardStats | undefined;
}

interface QuickStatCardProps {
	title: string;
	value: number;
	icon: React.ReactNode;
	color: string;
	suffix?: string;
}

/**
 * Individual quick stat card with progress bar
 */
const QuickStatCard: React.FC<QuickStatCardProps> = ({ title, value, icon, color, suffix }) => {
	const { token } = useThemeToken();

	return (
		<Card bordered={false} style={{ borderRadius: token.borderRadiusLG, ...elevation[1] }}>
			<Statistic
				title={title}
				value={value}
				precision={1}
				suffix={suffix}
				prefix={icon}
				valueStyle={{ color, fontWeight: 600 }}
			/>
			<Progress
				percent={value}
				strokeColor={color}
				showInfo={false}
				style={{ marginTop: 8 }}
				strokeWidth={8}
			/>
		</Card>
	);
};

/**
 * Quick Stats Row Component
 * Displays completion rate, average score, and pass rate
 */
export const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
	const { token } = useThemeToken();
	const { t } = useTranslation();

	if (!stats) {
		return (
			<Row gutter={[16, 16]}>
				{[0, 1, 2].map((i) => (
					<Col key={i} xs={24} sm={8}>
						<Card bordered={false} style={{ borderRadius: token.borderRadiusLG, ...elevation[1] }}>
							<Skeleton active paragraph={{ rows: 2 }} />
						</Card>
					</Col>
				))}
			</Row>
		);
	}

	const quickStatItems = [
		{
			title: t('dashboard.completionRate'),
			value: stats.metrics.completion_rate,
			icon: <TrophyOutlined />,
			color: STAT_CARD_COLORS.success,
			suffix: '%',
		},
		{
			title: t('dashboard.averageScore'),
			value: stats.metrics.average_score,
			icon: <CheckCircleOutlined />,
			color: STAT_CARD_COLORS.primary,
		},
		{
			title: t('dashboard.passRate'),
			value: stats.metrics.pass_rate,
			icon: <RiseOutlined />,
			color: STAT_CARD_COLORS.warning,
			suffix: '%',
		},
	];

	return (
		<Row gutter={[16, 16]}>
			{quickStatItems.map((item) => (
				<Col key={item.title} xs={24} sm={8}>
					<QuickStatCard {...item} />
				</Col>
			))}
		</Row>
	);
};
