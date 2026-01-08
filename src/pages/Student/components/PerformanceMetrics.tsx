import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    BarChartOutlined,
    CheckCircleOutlined,
    FireOutlined,
} from '@ant-design/icons';
import { Card, Flex, Progress, Skeleton, Tooltip, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';
import type { StudentDashboardStats } from '../../../types';
import { getScoreColor, SCORE_COLORS } from './constants';

const { Text, Title } = Typography;

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
    tooltip?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, color, tooltip }) => {
    const { token } = useThemeToken();

    const content = (
        <div
            style={{
                padding: '16px',
                borderRadius: token.borderRadius,
                background: token.colorBgTextHover,
                transition: 'all 0.2s ease',
                marginBottom: 12,
            }}
            className="metric-card-item"
        >
            <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
                <Flex align="center" gap={10}>
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: `${color}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: color,
                            fontSize: 16,
                        }}
                    >
                        {icon}
                    </div>
                    <Text style={{ fontSize: 14, fontWeight: 500 }}>{label}</Text>
                </Flex>
                <Title level={4} style={{ margin: 0, color: color, fontWeight: 700 }}>
                    {value.toFixed(1)}%
                </Title>
            </Flex>
            <Progress
                percent={value}
                showInfo={false}
                strokeColor={{
                    '0%': color,
                    '100%': `${color}cc`,
                }}
                trailColor={token.colorBorderSecondary}
                size={{ height: 8 }}
                style={{ margin: 0 }}
            />
        </div>
    );

    return tooltip ? <Tooltip title={tooltip}>{content}</Tooltip> : content;
};

interface PerformanceMetricsProps {
    performance: StudentDashboardStats['performance'] | undefined;
    isLoading: boolean;
}

/**
 * PerformanceMetrics Component
 * Enhanced UI with card-style metrics and gradient progress bars
 */
export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
    performance,
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
                <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
        );
    }

    const hasData = performance && (performance.pass_rate > 0 || performance.highest_score > 0);

    const metrics: MetricCardProps[] = [
        {
            icon: <CheckCircleOutlined />,
            label: t('studentDashboard.performance.passRate'),
            value: performance?.pass_rate ?? 0,
            color: getScoreColor(performance?.pass_rate ?? 0),
            tooltip: t('studentDashboard.quickStats.passRateTooltip'),
        },
        {
            icon: <ArrowUpOutlined />,
            label: t('studentDashboard.performance.highestScore'),
            value: performance?.highest_score ?? 0,
            color: SCORE_COLORS.excellent,
            tooltip: t('studentDashboard.quickStats.highestScoreTooltip'),
        },
        {
            icon: <ArrowDownOutlined />,
            label: t('studentDashboard.performance.lowestScore'),
            value: performance?.lowest_score ?? 0,
            color: getScoreColor(performance?.lowest_score ?? 0),
            tooltip: t('studentDashboard.quickStats.lowestScoreTooltip'),
        },
    ];

    return (
        <Card
            title={
                <Flex align="center" gap={8}>
                    <BarChartOutlined style={{ fontSize: 18, color: token.colorWarning }} />
                    <span style={{ fontWeight: 600 }}>{t('studentDashboard.quickStats.title')}</span>
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
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: token.colorBgTextHover,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 16,
                        }}
                    >
                        <FireOutlined style={{ fontSize: 32, color: token.colorTextQuaternary }} />
                    </div>
                    <Text type="secondary">{t('studentDashboard.performance.noData')}</Text>
                </Flex>
            ) : (
                <div>
                    {metrics.map((metric) => (
                        <MetricCard key={metric.label} {...metric} />
                    ))}
                </div>
            )}
            {/* Hover styles */}
            <style>{`
				.metric-card-item:hover {
					background: ${token.colorBgTextActive} !important;
					transform: translateX(4px);
				}
			`}</style>
        </Card>
    );
};
