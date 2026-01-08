import {
    BankOutlined,
    BookOutlined,
    QuestionCircleOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { Card, Col, Flex, Row, Skeleton, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';

const { Text, Title } = Typography;

// Gradient colors for stat cards
const STAT_COLORS = {
    assessments: {
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        iconColor: '#60a5fa',
    },
    questions: {
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        iconColor: '#34d399',
    },
    banks: {
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        iconColor: '#fbbf24',
    },
    attempts: {
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        iconColor: '#a78bfa',
    },
};

interface StatCardProps {
    icon: React.ReactNode;
    value: number;
    label: string;
    subtitle?: string;
    gradient: string;
    iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, subtitle, gradient, iconColor }) => {
    const { token } = useThemeToken();

    return (
        <Card
            bordered={false}
            style={{
                background: gradient,
                borderRadius: token.borderRadiusLG,
                ...elevation[2],
                cursor: 'default',
                transition: 'all 0.3s ease',
            }}
            styles={{
                body: { padding: '20px 24px' },
            }}
            className="creator-stat-card"
        >
            <Flex justify="space-between" align="flex-start">
                <div>
                    <Title
                        level={2}
                        style={{
                            margin: 0,
                            color: 'white',
                            fontSize: 36,
                            fontWeight: 700,
                            lineHeight: 1.2,
                        }}
                    >
                        {value.toLocaleString()}
                    </Title>
                    <Text
                        style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: 14,
                            fontWeight: 500,
                            display: 'block',
                            marginTop: 4,
                        }}
                    >
                        {label}
                    </Text>
                    {subtitle && (
                        <Text
                            style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: 12,
                                display: 'block',
                                marginTop: 2,
                            }}
                        >
                            {subtitle}
                        </Text>
                    )}
                </div>
                <div
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        color: iconColor,
                    }}
                >
                    {icon}
                </div>
            </Flex>
            <style>{`
				.creator-stat-card:hover {
					transform: translateY(-4px);
					box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
				}
			`}</style>
        </Card>
    );
};

interface CreatorStatsRowProps {
    stats: {
        total_assessments: number;
        total_questions: number;
        total_question_banks: number;
        total_attempts: number;
        active_assessments?: number;
        draft_assessments?: number;
    } | undefined;
    isLoading: boolean;
}

export const CreatorStatsRow: React.FC<CreatorStatsRowProps> = ({ stats, isLoading }) => {
    const { t } = useTranslation();
    const { token } = useThemeToken();

    if (isLoading) {
        return (
            <Row gutter={[16, 16]}>
                {[1, 2, 3, 4].map((i) => (
                    <Col xs={24} sm={12} lg={6} key={i}>
                        <Card bordered={false} style={{ borderRadius: token.borderRadiusLG, ...elevation[2] }}>
                            <Skeleton active paragraph={{ rows: 2 }} />
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    }

    const statCards = [
        {
            icon: <BookOutlined />,
            value: stats?.total_assessments ?? 0,
            label: t('creatorDashboard.stats.myAssessments'),
            subtitle: stats?.active_assessments
                ? `${stats.active_assessments} ${t('creatorDashboard.stats.active')}`
                : undefined,
            ...STAT_COLORS.assessments,
        },
        {
            icon: <QuestionCircleOutlined />,
            value: stats?.total_questions ?? 0,
            label: t('creatorDashboard.stats.myQuestions'),
            ...STAT_COLORS.questions,
        },
        {
            icon: <BankOutlined />,
            value: stats?.total_question_banks ?? 0,
            label: t('creatorDashboard.stats.questionBanks'),
            ...STAT_COLORS.banks,
        },
        {
            icon: <TeamOutlined />,
            value: stats?.total_attempts ?? 0,
            label: t('creatorDashboard.stats.attemptsOnContent'),
            ...STAT_COLORS.attempts,
        },
    ];

    return (
        <Row gutter={[16, 16]}>
            {statCards.map((card, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                    <StatCard {...card} />
                </Col>
            ))}
        </Row>
    );
};
