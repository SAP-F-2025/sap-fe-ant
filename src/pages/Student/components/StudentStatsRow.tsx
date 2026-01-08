import {
    BookOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { Card, Flex, Skeleton, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { elevation } from '../../../styles/elevation';
import type { StudentDashboardStats } from '../../../types';
import { STUDENT_STAT_COLORS } from './constants';

const { Text, Title } = Typography;

interface StatCardProps {
    icon: React.ReactNode;
    value: number;
    label: string;
    color: string;
}

/**
 * Large gradient stat card - similar to Admin Dashboard design
 */
const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color }) => {
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
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default',
            }}
            styles={{ body: { padding: '20px 24px', height: '100%' } }}
            className="student-stat-card"
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
                {/* Top: Icon */}
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

interface StudentStatsRowProps {
    stats: StudentDashboardStats['overview'] | undefined;
    isLoading: boolean;
}

/**
 * StudentStatsRow Component
 * Displays 4 large, prominent statistic cards in a row
 * Shows: Available Assessments, Completed, In Progress, Total Attempts
 */
export const StudentStatsRow: React.FC<StudentStatsRowProps> = ({ stats, isLoading }) => {
    const { t } = useTranslation();

    if (isLoading || !stats) {
        return (
            <>
                <Flex gap={16} wrap="wrap">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            style={{
                                flex: '1 1 200px',
                                minWidth: 180,
                                maxWidth: 'calc(25% - 12px)',
                            }}
                        >
                            <StatCardSkeleton />
                        </div>
                    ))}
                </Flex>
            </>
        );
    }

    const statItems = [
        {
            icon: <BookOutlined />,
            value: stats.total_assessments_available,
            label: t('studentDashboard.stats.available'),
            color: STUDENT_STAT_COLORS.available,
        },
        {
            icon: <CheckCircleOutlined />,
            value: stats.total_assessments_completed,
            label: t('studentDashboard.stats.completed'),
            color: STUDENT_STAT_COLORS.completed,
        },
        {
            icon: <ClockCircleOutlined />,
            value: stats.total_assessments_in_progress,
            label: t('studentDashboard.stats.inProgress'),
            color: STUDENT_STAT_COLORS.inProgress,
        },
        {
            icon: <FileTextOutlined />,
            value: stats.total_attempts,
            label: t('studentDashboard.stats.totalAttempts'),
            color: STUDENT_STAT_COLORS.attempts,
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
                            maxWidth: 'calc(25% - 12px)',
                        }}
                    >
                        <StatCard {...item} />
                    </div>
                ))}
            </Flex>
            {/* Hover animation styles */}
            <style>{`
				.student-stat-card:hover {
					transform: translateY(-4px);
					box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
				}
				@media (max-width: 1200px) {
					.student-stat-card-container > div {
						max-width: calc(50% - 8px) !important;
					}
				}
				@media (max-width: 576px) {
					.student-stat-card-container > div {
						max-width: 100% !important;
					}
				}
			`}</style>
        </>
    );
};
