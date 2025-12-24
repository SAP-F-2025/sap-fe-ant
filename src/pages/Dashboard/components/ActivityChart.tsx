import { TrophyOutlined } from '@ant-design/icons';
import { Card, Empty, Skeleton, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';
import { CHART_HEIGHT, STAT_CARD_COLORS } from '../constants';

interface ActivityChartData {
	month: string;
	attempts: number;
	users: number;
	score: number;
}

interface ActivityChartProps {
	data: ActivityChartData[];
	isLoading: boolean;
}

/**
 * Activity Chart Component
 * Displays activity trends with area chart
 */
export const ActivityChart: React.FC<ActivityChartProps> = ({ data, isLoading }) => {
	const { token } = useThemeToken();
	const { t } = useTranslation();

	return (
		<Card
			title={
				<Space>
					<TrophyOutlined style={{ fontSize: 18, color: token.colorPrimary }} />
					<span style={{ fontWeight: 600 }}>{t('dashboard.activityScore')}</span>
				</Space>
			}
			variant="borderless"
			style={{ borderRadius: token.borderRadiusLG, ...elevation[2] }}
		>
			{isLoading ? (
				<Skeleton active paragraph={{ rows: 8 }} />
			) : data.length === 0 ? (
				<Empty description={t('dashboard.noActivityData')} style={{ padding: '60px 0' }} />
			) : (
				<ResponsiveContainer width="100%" height={CHART_HEIGHT}>
					<AreaChart data={data} aria-label={t('dashboard.activityChartLabel')}>
						<defs>
							<linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor={STAT_CARD_COLORS.primary}
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor={STAT_CARD_COLORS.primary}
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor={STAT_CARD_COLORS.success}
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor={STAT_CARD_COLORS.success}
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke={token.colorBorderSecondary}
							opacity={0.3}
						/>
						<XAxis
							dataKey="month"
							stroke={token.colorTextSecondary}
							style={{ fontSize: 12, fontWeight: 500 }}
						/>
						<YAxis
							stroke={token.colorTextSecondary}
							style={{ fontSize: 12, fontWeight: 500 }}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: token.colorBgContainer,
								border: `1px solid ${token.colorBorder}`,
								borderRadius: token.borderRadius,
								...elevation[3],
							}}
						/>
						<Legend wrapperStyle={{ fontWeight: 500 }} />
						<Area
							type="monotone"
							dataKey="attempts"
							stroke={STAT_CARD_COLORS.primary}
							strokeWidth={3}
							fillOpacity={1}
							fill="url(#colorAttempts)"
							name={t('dashboard.attemptsCount')}
						/>
						<Area
							type="monotone"
							dataKey="score"
							stroke={STAT_CARD_COLORS.success}
							strokeWidth={3}
							fillOpacity={1}
							fill="url(#colorScore)"
							name={t('dashboard.avgScore')}
						/>
					</AreaChart>
				</ResponsiveContainer>
			)}
		</Card>
	);
};
