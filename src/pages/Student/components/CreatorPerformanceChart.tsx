import { LineChartOutlined } from '@ant-design/icons';
import { Card, Flex, Skeleton } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';

interface ChartDataPoint {
    period: string;
    attempts: number;
    average_score: number;
}

interface CreatorPerformanceChartProps {
    data: ChartDataPoint[];
    isLoading: boolean;
}

export const CreatorPerformanceChart: React.FC<CreatorPerformanceChartProps> = ({
    data,
    isLoading,
}) => {
    const { t } = useTranslation();
    const { token } = useThemeToken();

    if (isLoading) {
        return (
            <Card
                bordered={false}
                style={{ borderRadius: token.borderRadiusLG, ...elevation[2], height: '100%' }}
            >
                <Skeleton active paragraph={{ rows: 8 }} />
            </Card>
        );
    }

    const chartData = data.map((item) => ({
        name: item.period,
        attempts: item.attempts,
        avgScore: item.average_score,
    }));

    return (
        <Card
            title={
                <Flex align="center" gap={8}>
                    <LineChartOutlined style={{ fontSize: 18, color: token.colorPrimary }} />
                    <span style={{ fontWeight: 600 }}>{t('creatorDashboard.performance.title')}</span>
                </Flex>
            }
            bordered={false}
            style={{ borderRadius: token.borderRadiusLG, ...elevation[2], height: '100%' }}
        >
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={token.colorBorderSecondary} />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: token.colorTextSecondary, fontSize: 12 }}
                        axisLine={{ stroke: token.colorBorderSecondary }}
                    />
                    <YAxis
                        yAxisId="left"
                        tick={{ fill: token.colorTextSecondary, fontSize: 12 }}
                        axisLine={{ stroke: token.colorBorderSecondary }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 100]}
                        tick={{ fill: token.colorTextSecondary, fontSize: 12 }}
                        axisLine={{ stroke: token.colorBorderSecondary }}
                    />
                    <Tooltip
                        contentStyle={{
                            background: token.colorBgElevated,
                            border: `1px solid ${token.colorBorderSecondary}`,
                            borderRadius: token.borderRadius,
                        }}
                    />
                    <Legend />
                    <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="attempts"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorAttempts)"
                        name={t('creatorDashboard.performance.attempts')}
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="avgScore"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                        name={t('creatorDashboard.performance.avgScore')}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
};
