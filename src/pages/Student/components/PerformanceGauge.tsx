import { TrophyOutlined } from '@ant-design/icons';
import { Card, Flex, Skeleton, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';
import type { StudentDashboardStats } from '../../../types';
import { getScoreColor, SCORE_COLORS } from './constants';

const { Text, Title } = Typography;

interface PerformanceGaugeProps {
    performance: StudentDashboardStats['performance'] | undefined;
    isLoading: boolean;
}

/**
 * PerformanceGauge Component
 * Displays a beautiful semi-circular gauge showing the average score
 * with gradient fill, animated effects, and color-coded based on performance
 */
export const PerformanceGauge: React.FC<PerformanceGaugeProps> = ({ performance, isLoading }) => {
    const { t } = useTranslation();
    const { token } = useThemeToken();

    const averageScore = performance?.average_score ?? 0;
    const scoreColor = getScoreColor(averageScore);

    // Determine score label
    const getScoreLabel = (score: number): string => {
        if (score >= 80) return t('studentDashboard.performance.excellent', 'Excellent');
        if (score >= 70) return t('studentDashboard.performance.good', 'Good');
        if (score >= 50) return t('studentDashboard.performance.average', 'Average');
        if (score > 0) return t('studentDashboard.performance.needsImprovement', 'Needs Improvement');
        return t('studentDashboard.performance.noData', 'No Data');
    };

    // Data for the gauge - using a full donut with gradient effect
    const gaugeData = [
        { name: 'score', value: averageScore },
        { name: 'remaining', value: Math.max(0, 100 - averageScore) },
    ];

    if (isLoading) {
        return (
            <Card
                bordered={false}
                style={{ borderRadius: token.borderRadiusLG, ...elevation[2], height: '100%' }}
            >
                <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
        );
    }

    const hasData = performance && performance.average_score > 0;

    return (
        <Card
            title={
                <Flex align="center" gap={8}>
                    <TrophyOutlined style={{ fontSize: 18, color: token.colorPrimary }} />
                    <span style={{ fontWeight: 600 }}>{t('studentDashboard.performance.title')}</span>
                </Flex>
            }
            bordered={false}
            style={{ borderRadius: token.borderRadiusLG, ...elevation[2], height: '100%' }}
        >
            {!hasData ? (
                <Flex
                    vertical
                    align="center"
                    justify="center"
                    style={{ padding: '40px 20px', textAlign: 'center' }}
                >
                    <div
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${token.colorBgTextHover} 0%, ${token.colorBorderSecondary} 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 16,
                        }}
                    >
                        <TrophyOutlined style={{ fontSize: 48, color: token.colorTextQuaternary }} />
                    </div>
                    <Text type="secondary">{t('studentDashboard.performance.noData')}</Text>
                </Flex>
            ) : (
                <Flex vertical align="center" style={{ position: 'relative', paddingTop: 20, paddingBottom: 20 }}>
                    {/* Gauge Chart Container */}
                    <div style={{ position: 'relative', width: '100%', maxWidth: 280, height: 180 }}>
                        {/* Background glow effect */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -30%)',
                                width: 160,
                                height: 160,
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${scoreColor}20 0%, transparent 70%)`,
                                filter: 'blur(20px)',
                            }}
                        />

                        {/* Chart */}
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <defs>
                                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor={scoreColor} stopOpacity={1} />
                                        <stop offset="100%" stopColor={scoreColor} stopOpacity={0.7} />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                                <Pie
                                    data={gaugeData}
                                    cx="50%"
                                    cy="90%"
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                    animationBegin={0}
                                    animationDuration={1200}
                                    animationEasing="ease-out"
                                    stroke="none"
                                >
                                    <Cell
                                        fill="url(#scoreGradient)"
                                        style={{ filter: 'url(#glow)' }}
                                    />
                                    <Cell fill={token.colorBorderSecondary} />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center content overlay */}
                        <Flex
                            vertical
                            align="center"
                            justify="center"
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                textAlign: 'center',
                            }}
                        >
                            <Title
                                level={1}
                                style={{
                                    margin: 0,
                                    fontSize: 42,
                                    fontWeight: 700,
                                    color: scoreColor,
                                    lineHeight: 1,
                                    textShadow: `0 2px 10px ${scoreColor}40`,
                                }}
                            >
                                {averageScore.toFixed(1)}%
                            </Title>
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: token.colorTextSecondary,
                                    marginTop: 4,
                                }}
                            >
                                {t('studentDashboard.performance.averageScore')}
                            </Text>
                        </Flex>
                    </div>

                    {/* Score label badge */}
                    <div
                        style={{
                            marginTop: 16,
                            padding: '6px 16px',
                            borderRadius: 20,
                            background: `${scoreColor}15`,
                            border: `1px solid ${scoreColor}30`,
                        }}
                    >
                        <Text style={{ color: scoreColor, fontWeight: 600, fontSize: 13 }}>
                            {getScoreLabel(averageScore)}
                        </Text>
                    </div>

                    {/* Mini stats row */}
                    <Flex gap={24} style={{ marginTop: 20 }}>
                        <Flex vertical align="center">
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {t('studentDashboard.performance.passRate')}
                            </Text>
                            <Text strong style={{ fontSize: 16, color: SCORE_COLORS.good }}>
                                {(performance?.pass_rate ?? 0).toFixed(1)}%
                            </Text>
                        </Flex>
                        <div style={{ width: 1, background: token.colorBorderSecondary }} />
                        <Flex vertical align="center">
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {t('studentDashboard.performance.highestScore')}
                            </Text>
                            <Text strong style={{ fontSize: 16, color: SCORE_COLORS.excellent }}>
                                {(performance?.highest_score ?? 0).toFixed(1)}%
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
            )}
        </Card>
    );
};
