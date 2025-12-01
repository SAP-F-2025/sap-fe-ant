import { RiseOutlined } from '@ant-design/icons';
import { Card, Empty, Skeleton, Space } from 'antd';
import React from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';
import { CHART_HEIGHT, STAT_CARD_COLORS } from '../constants';

interface PerformanceChartData {
	subject: string;
	score: number;
}

interface PerformanceChartProps {
	data: PerformanceChartData[];
	isLoading: boolean;
}

/**
 * Performance by Subject Bar Chart Component
 */
export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, isLoading }) => {
	const { token } = useThemeToken();

	return (
		<Card
			title={
				<Space>
					<RiseOutlined style={{ fontSize: 18, color: token.colorWarning }} />
					<span style={{ fontWeight: 600 }}>Điểm số theo môn học</span>
				</Space>
			}
			bordered={false}
			style={{ borderRadius: token.borderRadiusLG, ...elevation[2] }}
		>
			{isLoading ? (
				<Skeleton active paragraph={{ rows: 8 }} />
			) : data.length === 0 ? (
				<Empty description="Chưa có dữ liệu điểm số" style={{ padding: '60px 0' }} />
			) : (
				<ResponsiveContainer width="100%" height={CHART_HEIGHT}>
					<BarChart data={data} aria-label="Biểu đồ điểm số theo môn học">
						<CartesianGrid
							strokeDasharray="3 3"
							stroke={token.colorBorderSecondary}
							opacity={0.3}
						/>
						<XAxis
							dataKey="subject"
							stroke={token.colorTextSecondary}
							style={{ fontSize: 12, fontWeight: 500 }}
						/>
						<YAxis stroke={token.colorTextSecondary} style={{ fontSize: 12, fontWeight: 500 }} />
						<Tooltip
							contentStyle={{
								backgroundColor: token.colorBgContainer,
								border: `1px solid ${token.colorBorder}`,
								borderRadius: token.borderRadius,
								...elevation[3],
							}}
						/>
						<Bar
							dataKey="score"
							fill={STAT_CARD_COLORS.primary}
							radius={[8, 8, 0, 0]}
							maxBarSize={60}
							name="Điểm trung bình"
						/>
					</BarChart>
				</ResponsiveContainer>
			)}
		</Card>
	);
};
