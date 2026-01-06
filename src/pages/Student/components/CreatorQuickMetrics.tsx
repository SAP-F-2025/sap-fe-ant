import {
    ArrowUpOutlined,
    CheckCircleOutlined,
    TrophyOutlined,
} from '@ant-design/icons';
import { Card, Flex, Progress, Skeleton, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';

const { Text, Title } = Typography;

interface MetricItemProps {
    label: string;
    value: number;
    color: string;
    icon: React.ReactNode;
}

const MetricItem: React.FC<MetricItemProps> = ({ label, value, color, icon }) => {
    const { token } = useThemeToken();

    return (
        <div
            style={{
                padding: '16px',
                borderRadius: token.borderRadius,
                background: token.colorBgTextHover,
                marginBottom: 12,
            }}
        >
            <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
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
};

interface CreatorQuickMetricsProps {
    metrics: {
        average_score: number;
        pass_rate: number;
        completion_rate: number;
    } | undefined;
    isLoading: boolean;
}

export const CreatorQuickMetrics: React.FC<CreatorQuickMetricsProps> = ({ metrics, isLoading }) => {
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

    const metricItems: MetricItemProps[] = [
        {
            icon: <TrophyOutlined />,
            label: t('creatorDashboard.metrics.averageScore'),
            value: metrics?.average_score ?? 0,
            color: '#3b82f6',
        },
        {
            icon: <CheckCircleOutlined />,
            label: t('creatorDashboard.metrics.passRate'),
            value: metrics?.pass_rate ?? 0,
            color: '#10b981',
        },
        {
            icon: <ArrowUpOutlined />,
            label: t('creatorDashboard.metrics.completionRate'),
            value: metrics?.completion_rate ?? 0,
            color: '#8b5cf6',
        },
    ];

    return (
        <Card
            title={
                <Flex align="center" gap={8}>
                    <TrophyOutlined style={{ fontSize: 18, color: token.colorWarning }} />
                    <span style={{ fontWeight: 600 }}>{t('creatorDashboard.metrics.title')}</span>
                </Flex>
            }
            bordered={false}
            style={{ borderRadius: token.borderRadiusLG, ...elevation[2], height: '100%' }}
        >
            {metricItems.map((item) => (
                <MetricItem key={item.label} {...item} />
            ))}
        </Card>
    );
};
