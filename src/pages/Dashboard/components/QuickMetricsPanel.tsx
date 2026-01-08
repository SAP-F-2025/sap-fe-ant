import {
    AlertOutlined,
    CheckCircleOutlined,
    RiseOutlined,
    TrophyOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { Card, Flex, Progress, Skeleton, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';
import type { DashboardStats } from '../../../types';
import type { DashboardOverview } from '../../../types/proctoring';
import { STAT_CARD_COLORS, SEVERITY_COLORS } from '../constants';

const { Text, Title } = Typography;

interface MetricRowProps {
    label: string;
    value: number;
    suffix?: string;
    color: string;
    icon: React.ReactNode;
}

const MetricRow: React.FC<MetricRowProps> = ({ label, value, suffix = '', color, icon }) => (
    <Flex align="center" gap={10} style={{ marginBottom: 12 }}>
        <div
            style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                backgroundColor: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
                fontSize: 14,
            }}
        >
            {icon}
        </div>
        <Flex vertical style={{ flex: 1 }}>
            <Flex justify="space-between" align="center">
                <Text style={{ fontSize: 12, color: '#666' }}>{label}</Text>
                <Text strong style={{ fontSize: 14, color }}>
                    {value.toFixed(1)}{suffix}
                </Text>
            </Flex>
            <Progress
                percent={value}
                size="small"
                strokeColor={color}
                showInfo={false}
                style={{ margin: 0 }}
            />
        </Flex>
    </Flex>
);

interface ViolationsSummaryProps {
    data: DashboardOverview | undefined;
    isLoading: boolean;
}

const ViolationsSummary: React.FC<ViolationsSummaryProps> = ({ data, isLoading }) => {
    const { t } = useTranslation();
    const { token } = useThemeToken();
    const navigate = useNavigate();

    if (isLoading) {
        return <Skeleton.Button active style={{ width: '100%', height: 60 }} />;
    }

    const criticalCount = data?.critical_count || 0;
    const totalViolations = data?.total_violations || 0;

    return (
        <Card
            bordered={false}
            style={{
                background: criticalCount > 0 ? `${SEVERITY_COLORS.critical}08` : '#f5f5f5',
                borderRadius: 8,
                border: criticalCount > 0 ? `1px solid ${SEVERITY_COLORS.critical}30` : '1px solid #e8e8e8',
                cursor: 'pointer',
            }}
            styles={{ body: { padding: '10px 12px' } }}
            onClick={() => navigate('/grading')}
        >
            <Flex justify="space-between" align="center">
                <Flex align="center" gap={8}>
                    {criticalCount > 0 ? (
                        <WarningOutlined style={{ color: SEVERITY_COLORS.critical, fontSize: 16 }} />
                    ) : (
                        <AlertOutlined style={{ color: token.colorTextSecondary, fontSize: 16 }} />
                    )}
                    <div>
                        <Text style={{ fontSize: 11, color: '#666', display: 'block' }}>
                            {t('dashboard.proctoringOverview')}
                        </Text>
                        <Text strong style={{ fontSize: 13 }}>
                            {totalViolations > 0
                                ? `${criticalCount} ${t('dashboard.critical').toLowerCase()}`
                                : t('dashboard.noProctoringData')
                            }
                        </Text>
                    </div>
                </Flex>
                {totalViolations > 0 && (
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        {totalViolations} {t('dashboard.totalViolations')}
                    </Text>
                )}
            </Flex>
        </Card>
    );
};

interface QuickMetricsPanelProps {
    stats: DashboardStats | undefined;
    proctoringOverview: DashboardOverview | undefined;
    isLoading: boolean;
}

/**
 * QuickMetricsPanel Component
 * Right side panel with key metrics and violations summary
 * Combines QuickStats + ProctoringOverview into compact form
 */
export const QuickMetricsPanel: React.FC<QuickMetricsPanelProps> = ({
    stats,
    proctoringOverview,
    isLoading,
}) => {
    const { t } = useTranslation();
    const { token } = useThemeToken();

    if (isLoading || !stats) {
        return (
            <Card
                bordered={false}
                style={{
                    borderRadius: token.borderRadiusLG,
                    height: '100%',
                    ...elevation[1],
                }}
            >
                <Skeleton active paragraph={{ rows: 5 }} />
            </Card>
        );
    }

    const metrics = [
        {
            label: t('dashboard.completionRate'),
            value: stats.metrics.completion_rate,
            suffix: '%',
            color: STAT_CARD_COLORS.success,
            icon: <TrophyOutlined />,
        },
        {
            label: t('dashboard.averageScore'),
            value: stats.metrics.average_score,
            color: STAT_CARD_COLORS.primary,
            icon: <CheckCircleOutlined />,
        },
        {
            label: t('dashboard.passRate'),
            value: stats.metrics.pass_rate,
            suffix: '%',
            color: STAT_CARD_COLORS.warning,
            icon: <RiseOutlined />,
        },
    ];

    return (
        <Card
            bordered={false}
            style={{
                borderRadius: token.borderRadiusLG,
                height: '100%',
                ...elevation[1],
            }}
        >
            <Flex vertical gap={12}>
                {/* Quick Metrics */}
                <div>
                    <Text strong style={{ fontSize: 13, marginBottom: 12, display: 'block' }}>
                        {t('dashboard.quickMetrics')}
                    </Text>
                    {metrics.map((metric) => (
                        <MetricRow key={metric.label} {...metric} />
                    ))}
                </div>

                {/* Violations Summary */}
                <ViolationsSummary
                    data={proctoringOverview}
                    isLoading={isLoading}
                />
            </Flex>
        </Card>
    );
};
