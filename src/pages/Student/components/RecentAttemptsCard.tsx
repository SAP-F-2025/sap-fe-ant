import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    HistoryOutlined,
    HourglassOutlined,
    RightOutlined,
} from '@ant-design/icons';
import { Button, Card, Empty, Flex, Skeleton, Tag, Timeline, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';
import type { StudentDashboardStats } from '../../../types';
import { getScoreColor } from './constants';

dayjs.extend(relativeTime);

const { Text } = Typography;

interface RecentAttempt {
    id: number;
    assessment_id: number;
    assessment_title: string;
    score: number;
    passed: boolean;
    completed_at: string;
    time_spent: number;
    is_graded: boolean;
}

interface AttemptItemProps {
    attempt: RecentAttempt;
    onView: (id: number) => void;
    locale: string;
}

const AttemptItem: React.FC<AttemptItemProps> = ({ attempt, onView, locale }) => {
    const { t } = useTranslation();

    const scoreColor = getScoreColor(attempt.score);

    // Format relative time with locale
    const relativeTimeText = useMemo(() => {
        return dayjs(attempt.completed_at).locale(locale).fromNow();
    }, [attempt.completed_at, locale]);

    return (
        <Flex justify="space-between" align="center" style={{ width: '100%' }}>
            <Flex vertical gap={4} style={{ flex: 1 }}>
                <Text strong style={{ fontSize: 14 }}>
                    {attempt.assessment_title}
                </Text>
                <Flex gap={8} align="center">
                    {!attempt.is_graded ? (
                        <Tag icon={<HourglassOutlined />} color="warning" style={{ margin: 0 }}>
                            {t('studentDashboard.recent.pending')}
                        </Tag>
                    ) : (
                        <>
                            <Tag
                                style={{
                                    margin: 0,
                                    background: scoreColor,
                                    color: 'white',
                                    border: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                {attempt.score.toFixed(1)}%
                            </Tag>
                            <Tag
                                color={attempt.passed ? 'success' : 'error'}
                                icon={attempt.passed ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                                style={{ margin: 0 }}
                            >
                                {attempt.passed
                                    ? t('studentDashboard.recentAttempts.passed')
                                    : t('studentDashboard.recentAttempts.failed')}
                            </Tag>
                        </>
                    )}
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {relativeTimeText}
                    </Text>
                </Flex>
            </Flex>
            <Button
                type="link"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => onView(attempt.id)}
            >
                {t('studentDashboard.recent.viewDetails')}
            </Button>
        </Flex>
    );
};

interface RecentAttemptsCardProps {
    data: StudentDashboardStats['recent_attempts'] | undefined;
    isLoading: boolean;
}

/**
 * RecentAttemptsCard Component
 * Displays recent attempts in a timeline format
 */
export const RecentAttemptsCard: React.FC<RecentAttemptsCardProps> = ({ data, isLoading }) => {
    const { t, i18n } = useTranslation();
    const { token } = useThemeToken();
    const navigate = useNavigate();

    // Determine dayjs locale from current language
    const dayjsLocale = useMemo(() => {
        const lang = i18n.language?.toLowerCase() || '';
        return lang.startsWith('vi') ? 'vi' : 'en';
    }, [i18n.language]);

    const handleView = (attemptId: number) => {
        navigate(`/student/results/${attemptId}`);
    };

    const handleViewAll = () => {
        navigate('/student/history');
    };

    if (isLoading) {
        return (
            <Card
                bordered={false}
                style={{ borderRadius: token.borderRadiusLG, ...elevation[2], height: '100%' }}
            >
                <Skeleton active paragraph={{ rows: 5 }} />
            </Card>
        );
    }

    const getTimelineColor = (attempt: RecentAttempt): string => {
        if (!attempt.is_graded) return 'orange';
        return attempt.passed ? 'green' : 'red';
    };

    return (
        <Card
            title={
                <Flex align="center" gap={8}>
                    <HistoryOutlined style={{ fontSize: 18, color: token.colorSuccess }} />
                    <span style={{ fontWeight: 600 }}>{t('studentDashboard.recent.title')}</span>
                </Flex>
            }
            extra={
                <Button type="link" size="small" onClick={handleViewAll}>
                    {t('studentDashboard.recent.viewAll')} <RightOutlined />
                </Button>
            }
            bordered={false}
            style={{ borderRadius: token.borderRadiusLG, ...elevation[2], height: '100%' }}
        >
            {!data || data.length === 0 ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={t('studentDashboard.recent.noRecent')}
                    style={{ padding: '20px 0' }}
                />
            ) : (
                <Timeline
                    style={{ marginTop: 16 }}
                    items={data.slice(0, 5).map((attempt) => ({
                        color: getTimelineColor(attempt),
                        children: <AttemptItem attempt={attempt} onView={handleView} locale={dayjsLocale} />,
                    }))}
                />
            )}
        </Card>
    );
};
