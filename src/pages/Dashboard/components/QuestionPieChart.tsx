import { QuestionCircleOutlined } from '@ant-design/icons';
import { Card, Empty, Skeleton, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';
import { CHART_HEIGHT } from '../constants';

interface QuestionChartData {
	name: string;
	value: number;
	color: string;
	[key: string]: string | number;
}

interface QuestionPieChartProps {
	data: QuestionChartData[];
	isLoading: boolean;
}

/**
 * Question Distribution Pie Chart Component
 */
export const QuestionPieChart: React.FC<QuestionPieChartProps> = ({ data, isLoading }) => {
	const { token } = useThemeToken();
	const { t } = useTranslation();

	return (
		<Card
			title={
				<Space>
					<QuestionCircleOutlined style={{ fontSize: 18, color: token.colorSuccess }} />
					<span style={{ fontWeight: 600 }}>{t('dashboard.questionDistribution')}</span>
				</Space>
			}
			bordered={false}
			style={{ borderRadius: token.borderRadiusLG, ...elevation[2] }}
		>
			{isLoading ? (
				<Skeleton active paragraph={{ rows: 8 }} />
			) : data.length === 0 ? (
				<Empty description={t('dashboard.noQuestionData')} style={{ padding: '60px 0' }} />
			) : (
				<ResponsiveContainer width="100%" height={CHART_HEIGHT}>
					<PieChart aria-label={t('dashboard.questionChartLabel')}>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							innerRadius={60}
							outerRadius={100}
							paddingAngle={5}
							dataKey="value"
							label={(entry) => `${entry.name} (${entry.value})`}
							labelLine={{
								stroke: token.colorTextSecondary,
								strokeWidth: 1,
							}}
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: token.colorBgContainer,
								border: `1px solid ${token.colorBorder}`,
								borderRadius: token.borderRadius,
								color: token.colorText,
								...elevation[3],
							}}
							itemStyle={{
								color: token.colorText,
							}}
							labelStyle={{
								color: token.colorText,
								fontWeight: 600,
							}}
						/>
					</PieChart>
				</ResponsiveContainer>
			)}
		</Card>
	);
};
