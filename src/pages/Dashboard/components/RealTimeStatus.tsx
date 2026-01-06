import {
    AlertOutlined,
    TeamOutlined,
    EditOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { Card, Flex, Skeleton, Space, Statistic, Typography, Badge } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';
import type { RealTimeStats, DashboardOverview } from '../../../types/proctoring';
import type { DashboardStats } from '../../../types';
import { SEVERITY_COLORS, STAT_CARD_COLORS } from '../constants';

const { Text } = Typography;

interface RealTimeStatusProps {
    stats: DashboardStats | undefined;
    realTimeStats: RealTimeStats | undefined;
    proctoringOverview: DashboardOverview | undefined;
    isLoading: boolean;
}

interface StatusItemProps {
    icon: React.ReactNode;
    value: number | string;
    label: string;
    color: string;
    pulse?: boolean;
    badge?: number;
}

const StatusItem: React.FC<StatusItemProps> = ({ icon, value, label, color, pulse, badge }) => {
    const { token } = useThemeToken();

    return (
        <Flex align="center" gap={12} style={{ minWidth: 120 }}>
            <div
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    backgroundColor: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color,
                    fontSize: 18,
                    position: 'relative',
                }}
            >
                {pulse && (
                    <div
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            borderRadius: 8,
                            backgroundColor: color,
                            opacity: 0.3,
                            animation: 'pulse 2s infinite',
                        }}
                    />
                )}
                {icon}
            </div>
            <Flex vertical gap={0}>
                <Flex align="center" gap={4}>
                    <Text strong style={{ fontSize: 18, lineHeight: 1.2 }}>
                        {value}
                    </Text>
                    {badge !== undefined && badge > 0 && (
                        <Badge count={badge} size="small" color={SEVERITY_COLORS.critical} />
                    )}
                </Flex>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {label}
                </Text>
            </Flex>
        </Flex>
    );
};

/**
 * RealTimeStatus Component
 * Displays live status indicators at the top of dashboard
 * Clean Corporate style with subtle animations
 */
export const RealTimeStatus: React.FC<RealTimeStatusProps> = ({
    stats,
    realTimeStats,
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
                    ...elevation[1],
                }}
                styles={{ body: { padding: '16px 24px' } }}
            >
                <Skeleton active paragraph={false} />
            </Card>
        );
    }

    const activeUsers = stats.overview.active_users || 0;
    const activeAttempts = realTimeStats?.active_attempts || 0;
    const recentViolations = realTimeStats?.violations_last_5min || 0;
    const criticalViolations = realTimeStats?.critical_violations || 0;

    return (
        <Card
            bordered={false}
            style={{
                borderRadius: token.borderRadiusLG,
                ...elevation[1],
            }}
            styles={{ body: { padding: '16px 24px' } }}
        >
            <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
                <Flex gap={32} wrap="wrap">
                    <StatusItem
                        icon={<TeamOutlined />}
                        value={activeUsers}
                        label={t('dashboard.activeUsers')}
                        color={STAT_CARD_COLORS.primary}
                        pulse={activeUsers > 0}
                    />
                    <StatusItem
                        icon={<EditOutlined />}
                        value={activeAttempts}
                        label={t('dashboard.activeExams')}
                        color={STAT_CARD_COLORS.success}
                        pulse={activeAttempts > 0}
                    />
                    <StatusItem
                        icon={<AlertOutlined />}
                        value={recentViolations}
                        label={t('dashboard.recentViolations')}
                        color={recentViolations > 0 ? SEVERITY_COLORS.high : STAT_CARD_COLORS.cyan}
                        badge={criticalViolations}
                    />
                </Flex>

                <Flex align="center" gap={8}>
                    <SyncOutlined spin={isLoading} style={{ color: token.colorTextSecondary }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {t('dashboard.liveUpdates')}
                    </Text>
                </Flex>
            </Flex>

            {/* Pulse animation keyframes */}
            <style>{`
				@keyframes pulse {
					0% { transform: scale(1); opacity: 0.3; }
					50% { transform: scale(1.1); opacity: 0.1; }
					100% { transform: scale(1); opacity: 0.3; }
				}
			`}</style>
        </Card>
    );
};
