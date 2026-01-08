import { BarChartOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Col, Flex, Row, Segmented, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import dashboardService from '../../services/dashboardService';
import gradingService from '../../services/gradingService';
import teacherService from '../../services/teacherService';
import {
    CreatorActivityTimeline,
    CreatorPendingActions,
    CreatorPerformanceChart,
    CreatorQuickActions,
    CreatorQuickMetrics,
    CreatorStatsRow,
} from './components';

const { Title, Text } = Typography;

/**
 * Creator Dashboard Page
 * Shows statistics about content the user has created (assessments, questions, banks)
 */
const CreatorDashboard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'year'>('month');

    // Determine if current language is Vietnamese
    const isVietnamese = useMemo(() => {
        const lang = i18n.language?.toLowerCase() || '';
        return lang.startsWith('vi');
    }, [i18n.language]);

    // Format date based on locale
    const formattedDate = useMemo(() => {
        if (isVietnamese) {
            const dateStr = dayjs().locale('vi').format('dddd, [ngày] D [tháng] M [năm] YYYY');
            return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
        }
        return dayjs().locale('en').format('dddd, MMMM D, YYYY');
    }, [isVietnamese]);

    // Fetch dashboard stats
    const { data: dashboardStats, isLoading: isLoadingStats } = useQuery({
        queryKey: ['creator-dashboard-stats'],
        queryFn: () => teacherService.getDashboardStats(),
    });

    // Fetch creator stats
    const { data: creatorStats, isLoading: isLoadingCreator } = useQuery({
        queryKey: ['creator-stats', user?.id],
        queryFn: () => teacherService.getCreatorStats(user?.id || ''),
        enabled: !!user?.id,
    });

    // Fetch activity trends
    const { data: activityTrends, isLoading: isLoadingTrends } = useQuery({
        queryKey: ['creator-activity-trends', timePeriod],
        queryFn: () => dashboardService.getActivityTrends(timePeriod),
    });

    // Fetch recent activities
    const { data: recentActivitiesData, isLoading: isLoadingActivities } = useQuery({
        queryKey: ['creator-recent-activities'],
        queryFn: () => dashboardService.getRecentActivities(5),
    });

    // Fetch grading overview stats
    const { data: gradingOverview } = useQuery({
        queryKey: ['grading-overview'],
        queryFn: () => gradingService.getGradingOverviewAll(),
    });

    // Transform data for components
    const statsData = useMemo(() => ({
        total_assessments: creatorStats?.total_assessments ?? 0,
        total_questions: creatorStats?.total_questions ?? 0,
        total_question_banks: creatorStats?.total_question_banks ?? 0,
        total_attempts: dashboardStats?.overview?.total_attempts ?? 0,
    }), [creatorStats, dashboardStats]);

    const metricsData = useMemo(() => ({
        average_score: dashboardStats?.metrics?.average_score ?? 0,
        pass_rate: dashboardStats?.metrics?.pass_rate ?? 0,
        completion_rate: dashboardStats?.metrics?.completion_rate ?? 0,
    }), [dashboardStats]);

    const chartData = useMemo(() => {
        return (activityTrends || []).map((item) => ({
            period: item.period,
            attempts: item.attempts,
            average_score: item.average_score,
        }));
    }, [activityTrends]);

    const recentActivities = recentActivitiesData || [];

    // Get pending counts from APIs
    const pendingGrading = gradingOverview?.pending_attempts ?? 0;
    const draftAssessments = creatorStats?.assessments_by_status?.draft ?? 0;

    const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

    const timePeriodOptions = [
        { label: t('dashboard.thisWeek'), value: 'week' },
        { label: t('dashboard.thisMonth'), value: 'month' },
        { label: t('dashboard.thisYear'), value: 'year' },
    ];

    return (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* Header */}
            <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
                <div>
                    <Flex align="center" gap={12}>
                        <BarChartOutlined style={{ fontSize: 28, color: '#3b82f6' }} />
                        <Title level={2} style={{ margin: 0 }}>
                            {t('creatorDashboard.title')}
                        </Title>
                    </Flex>
                    <Text type="secondary" style={{ fontSize: 14, marginTop: 4, display: 'block' }}>
                        {t('creatorDashboard.header.todayIs', { date: formattedDate })}
                    </Text>
                </div>
                <Segmented
                    options={timePeriodOptions}
                    value={timePeriod}
                    onChange={(value) => setTimePeriod(value as 'week' | 'month' | 'year')}
                />
            </Flex>

            {/* Row 1: Stats Cards */}
            <CreatorStatsRow stats={statsData} isLoading={isLoadingCreator || isLoadingStats} />

            {/* Row 2: Chart + Metrics */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={15}>
                    <CreatorPerformanceChart data={chartData} isLoading={isLoadingTrends} />
                </Col>
                <Col xs={24} lg={9}>
                    <CreatorQuickMetrics metrics={metricsData} isLoading={isLoadingStats} />
                </Col>
            </Row>

            {/* Row 3: Activity + Pending */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={15}>
                    <CreatorActivityTimeline
                        activities={recentActivities}
                        isLoading={isLoadingStats}
                    />
                </Col>
                <Col xs={24} lg={9}>
                    <CreatorPendingActions
                        pendingGrading={pendingGrading}
                        draftAssessments={draftAssessments}
                    />
                </Col>
            </Row>

            {/* Floating Quick Actions */}
            <CreatorQuickActions />
        </Space>
    );
};

export default CreatorDashboard;
