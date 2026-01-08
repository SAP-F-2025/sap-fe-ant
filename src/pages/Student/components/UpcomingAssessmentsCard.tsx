import {
    CalendarOutlined,
    ClockCircleOutlined,
    PlayCircleOutlined,
    RightOutlined,
} from '@ant-design/icons';
import { Button, Card, Empty, Flex, Skeleton, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';
import type { StudentDashboardStats } from '../../../types';
import { DUE_DATE_THRESHOLDS } from './constants';

const { Text } = Typography;

interface UpcomingAssessment {
    id: number;
    title: string;
    due_date: string;
    days_remaining: number;
}

interface AssessmentItemProps {
    assessment: UpcomingAssessment;
    onStart: (id: number) => void;
}

const AssessmentItem: React.FC<AssessmentItemProps> = ({ assessment, onStart }) => {
    const { t } = useTranslation();
    const { token } = useThemeToken();

    const getDueDateColor = (days: number): string => {
        if (days <= DUE_DATE_THRESHOLDS.urgent) return 'red';
        if (days <= DUE_DATE_THRESHOLDS.warning) return 'orange';
        return 'blue';
    };

    const getDueDateText = (days: number): string => {
        if (days === 0) return t('studentDashboard.upcoming.dueToday');
        return t('studentDashboard.upcoming.dueIn', { days });
    };

    return (
        <Flex
            justify="space-between"
            align="center"
            style={{
                padding: '16px',
                borderRadius: token.borderRadius,
                background: token.colorBgTextHover,
                marginBottom: 12,
                transition: 'all 0.2s ease',
            }}
            className="upcoming-assessment-item"
        >
            <Flex vertical gap={4} style={{ flex: 1 }}>
                <Text strong style={{ fontSize: 15 }}>
                    {assessment.title}
                </Text>
                <Flex gap={12} align="center">
                    <Tag color={getDueDateColor(assessment.days_remaining)} style={{ margin: 0 }}>
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        {getDueDateText(assessment.days_remaining)}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        <CalendarOutlined style={{ marginRight: 4 }} />
                        {dayjs(assessment.due_date).format('DD/MM/YYYY')}
                    </Text>
                </Flex>
            </Flex>
            <Button
                type="primary"
                size="small"
                icon={<PlayCircleOutlined />}
                onClick={() => onStart(assessment.id)}
            >
                {t('studentDashboard.upcoming.startNow')}
            </Button>
        </Flex>
    );
};

interface UpcomingAssessmentsCardProps {
    data: StudentDashboardStats['upcoming_assessments'] | undefined;
    isLoading: boolean;
}

/**
 * UpcomingAssessmentsCard Component
 * Displays upcoming assessments as cards with due date tags
 */
export const UpcomingAssessmentsCard: React.FC<UpcomingAssessmentsCardProps> = ({
    data,
    isLoading,
}) => {
    const { t } = useTranslation();
    const { token } = useThemeToken();
    const navigate = useNavigate();

    const handleStart = (assessmentId: number) => {
        navigate(`/student/assessments/${assessmentId}`);
    };

    const handleViewAll = () => {
        navigate('/student/assessments');
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

    return (
        <Card
            title={
                <Flex align="center" gap={8}>
                    <CalendarOutlined style={{ fontSize: 18, color: token.colorPrimary }} />
                    <span style={{ fontWeight: 600 }}>{t('studentDashboard.upcoming.title')}</span>
                </Flex>
            }
            extra={
                <Button type="link" size="small" onClick={handleViewAll}>
                    {t('studentDashboard.upcoming.viewAll')} <RightOutlined />
                </Button>
            }
            bordered={false}
            style={{ borderRadius: token.borderRadiusLG, ...elevation[2], height: '100%' }}
        >
            {!data || data.length === 0 ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={t('studentDashboard.upcoming.noUpcoming')}
                    style={{ padding: '20px 0' }}
                />
            ) : (
                <div>
                    {data.slice(0, 4).map((assessment) => (
                        <AssessmentItem
                            key={assessment.id}
                            assessment={assessment}
                            onStart={handleStart}
                        />
                    ))}
                </div>
            )}
            {/* Hover styles */}
            <style>{`
				.upcoming-assessment-item:hover {
					background: ${token.colorBgTextActive} !important;
					transform: translateX(4px);
				}
			`}</style>
        </Card>
    );
};
