import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    BankOutlined,
    CheckCircleOutlined,
    FileTextOutlined,
    QuestionCircleOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { Card, Col, Flex, Row, Skeleton, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { elevation } from '../../../styles/elevation';
import type { DashboardStats } from '../../../types';
import type { RealTimeStats } from '../../../types/proctoring';
import { STAT_CARD_COLORS } from '../constants';

const { Text, Title } = Typography;

interface StatCardProps {
    icon: React.ReactNode;
    value: number;
    label: string;
    color: string;
    trend?: number;
    isLive?: boolean;
}

/**
 * Large prominent stat card - matching mockup design
 * Features: Large icon, big number, trend badge, live indicator
 */
const StatCard: React.FC<StatCardProps> = ({
    icon,
    value,
    label,
    color,
    trend,
    isLive,
}) => {
    const hasTrend = trend !== undefined && trend !== 0;
    const isPositive = trend !== undefined && trend > 0;

    return (
        <Card
            bordered={false}
            style={{
                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                borderRadius: 16,
                border: 'none',
                ...elevation[2],
                height: '100%',
                minHeight: 140,
                overflow: 'hidden',
                position: 'relative',
            }}
            styles={{ body: { padding: '20px 24px', height: '100%' } }}
        >
            {/* Background decorative circle */}
            <div
                style={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                }}
            />

            <Flex vertical justify="space-between" style={{ height: '100%', position: 'relative' }}>
                {/* Top: Icon + Live indicator */}
                <Flex justify="space-between" align="flex-start">
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            backgroundColor: 'rgba(255,255,255,0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 24,
                        }}
                    >
                        {icon}
                    </div>
                    {isLive && (
                        <Flex
                            align="center"
                            gap={6}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                padding: '4px 10px',
                                borderRadius: 20,
                            }}
                        >
                            <div
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: '#52c41a',
                                    boxShadow: '0 0 6px #52c41a',
                                    animation: 'pulse 2s infinite',
                                }}
                            />
                            <Text style={{ color: 'white', fontSize: 11, fontWeight: 500 }}>
                                Live
                            </Text>
                        </Flex>
                    )}
                    {hasTrend && (
                        <Flex
                            align="center"
                            gap={4}
                            style={{
                                backgroundColor: isPositive
                                    ? 'rgba(82, 196, 26, 0.3)'
                                    : 'rgba(255, 77, 79, 0.3)',
                                padding: '4px 10px',
                                borderRadius: 20,
                            }}
                        >
                            {isPositive ? (
                                <ArrowUpOutlined style={{ fontSize: 12, color: 'white' }} />
                            ) : (
                                <ArrowDownOutlined style={{ fontSize: 12, color: 'white' }} />
                            )}
                            <Text style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>
                                {Math.abs(trend).toFixed(1)}%
                            </Text>
                        </Flex>
                    )}
                </Flex>

                {/* Bottom: Value + Label */}
                <div>
                    <Title
                        level={2}
                        style={{
                            color: 'white',
                            margin: 0,
                            fontSize: 36,
                            fontWeight: 700,
                            lineHeight: 1.1,
                            letterSpacing: '-0.5px',
                        }}
                    >
                        {value.toLocaleString()}
                    </Title>
                    <Text
                        style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: 14,
                            fontWeight: 500,
                            marginTop: 4,
                            display: 'block',
                        }}
                    >
                        {label}
                    </Text>
                </div>
            </Flex>
        </Card>
    );
};

/**
 * Loading skeleton for stat card
 */
const StatCardSkeleton: React.FC = () => (
    <Card
        bordered={false}
        style={{
            borderRadius: 16,
            minHeight: 140,
            ...elevation[1],
        }}
        styles={{ body: { padding: '20px 24px' } }}
    >
        <Skeleton active paragraph={{ rows: 2 }} />
    </Card>
);

interface CompactStatsRowProps {
    stats: DashboardStats | undefined;
    realTimeStats: RealTimeStats | undefined;
    isLoading: boolean;
}

/**
 * CompactStatsRow Component
 * Displays 5 large, prominent statistic cards in a single row
 * Design matching the mockup with gradients, large numbers, and visual indicators
 */
export const CompactStatsRow: React.FC<CompactStatsRowProps> = ({
    stats,
    realTimeStats,
    isLoading,
}) => {
    const { t } = useTranslation();

    if (isLoading || !stats) {
        return (
            <Row gutter={[16, 16]}>
                {[0, 1, 2, 3, 4].map((i) => (
                    <Col key={i} xs={24} sm={12} md={12} lg={4} xl={4} xxl={4}>
                        <StatCardSkeleton />
                    </Col>
                ))}
            </Row>
        );
    }

    const statItems = [
        {
            icon: <FileTextOutlined />,
            value: stats.overview.total_assessments,
            label: t('dashboard.assessments'),
            color: STAT_CARD_COLORS.primary,
            trend: stats.trends?.assessments_change,
        },
        {
            icon: <QuestionCircleOutlined />,
            value: stats.overview.total_questions,
            label: t('dashboard.questions'),
            color: STAT_CARD_COLORS.success,
        },
        {
            icon: <BankOutlined />,
            value: stats.overview.total_question_banks,
            label: t('dashboard.banks'),
            color: STAT_CARD_COLORS.cyan,
        },
        {
            icon: <CheckCircleOutlined />,
            value: stats.overview.total_attempts,
            label: t('dashboard.attempts'),
            color: STAT_CARD_COLORS.warning,
            trend: stats.trends?.attempts_change,
        },
        {
            icon: <TeamOutlined />,
            value: stats.overview.active_users || realTimeStats?.active_attempts || 0,
            label: t('dashboard.activeUsers'),
            color: '#6c757d',
            isLive: true,
        },
    ];

    return (
        <>
            <Flex gap={16} wrap="wrap">
                {statItems.map((item) => (
                    <div
                        key={item.label}
                        style={{
                            flex: '1 1 200px',
                            minWidth: 180,
                            maxWidth: 'calc(20% - 13px)'
                        }}
                    >
                        <StatCard {...item} />
                    </div>
                ))}
            </Flex>
            {/* Pulse animation keyframes */}
            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.3); }
                    100% { opacity: 1; transform: scale(1); }
                }
                @media (max-width: 1200px) {
                    .stat-card-container > div {
                        max-width: calc(33.33% - 11px) !important;
                    }
                }
                @media (max-width: 768px) {
                    .stat-card-container > div {
                        max-width: calc(50% - 8px) !important;
                    }
                }
                @media (max-width: 480px) {
                    .stat-card-container > div {
                        max-width: 100% !important;
                    }
                }
            `}</style>
        </>
    );
};
