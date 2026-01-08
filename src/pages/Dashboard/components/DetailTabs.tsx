import { AreaChartOutlined, OrderedListOutlined, SafetyOutlined } from '@ant-design/icons';
import { Card, Col, Row, Tabs, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';
import type { RecentActivity } from '../../../types';
import type { DashboardOverview } from '../../../types/proctoring';

// Import existing components for tab content
import { PerformanceChart } from './PerformanceChart';
import { QuestionPieChart } from './QuestionPieChart';
import { RecentActivities } from './RecentActivities';
import { ProctoringOverview } from './ProctoringOverview';

const { Text } = Typography;

// Match the actual interface from QuestionPieChart
interface QuestionChartData {
    name: string;
    value: number;
    color: string;
    [key: string]: string | number;
}

// Match the actual interface from PerformanceChart
interface PerformanceChartData {
    subject: string;
    score: number;
}

interface DetailTabsProps {
    questionChartData: QuestionChartData[];
    performanceChartData: PerformanceChartData[];
    recentActivities: RecentActivity[];
    proctoringOverview: DashboardOverview | undefined;
    isLoading: {
        question: boolean;
        performance: boolean;
        activities: boolean;
        proctoring: boolean;
    };
}

/**
 * DetailTabs Component
 * Provides tabbed navigation for detailed views below the fold
 * Contains: Charts, Activities, Proctoring tabs
 */
export const DetailTabs: React.FC<DetailTabsProps> = ({
    questionChartData,
    performanceChartData,
    recentActivities,
    proctoringOverview,
    isLoading,
}) => {
    const { t } = useTranslation();
    const { token } = useThemeToken();

    const items = [
        {
            key: 'charts',
            label: (
                <span>
                    <AreaChartOutlined style={{ marginRight: 6 }} />
                    {t('dashboard.chartsTab')}
                </span>
            ),
            children: (
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    <Col xs={24} md={12}>
                        <QuestionPieChart data={questionChartData} isLoading={isLoading.question} />
                    </Col>
                    <Col xs={24} md={12}>
                        <PerformanceChart data={performanceChartData} isLoading={isLoading.performance} />
                    </Col>
                </Row>
            ),
        },
        {
            key: 'activities',
            label: (
                <span>
                    <OrderedListOutlined style={{ marginRight: 6 }} />
                    {t('dashboard.activitiesTab')}
                </span>
            ),
            children: (
                <div style={{ marginTop: 16 }}>
                    <RecentActivities activities={recentActivities} isLoading={isLoading.activities} />
                </div>
            ),
        },
        {
            key: 'proctoring',
            label: (
                <span>
                    <SafetyOutlined style={{ marginRight: 6 }} />
                    {t('dashboard.proctoringTab')}
                </span>
            ),
            children: (
                <div style={{ marginTop: 16 }}>
                    <ProctoringOverview data={proctoringOverview} isLoading={isLoading.proctoring} />
                </div>
            ),
        },
    ];

    return (
        <Card
            bordered={false}
            style={{
                borderRadius: token.borderRadiusLG,
                ...elevation[1],
            }}
            styles={{ body: { padding: '16px 20px' } }}
        >
            <Tabs
                defaultActiveKey="charts"
                items={items}
                size="middle"
                tabBarStyle={{
                    marginBottom: 16,
                    position: 'relative',
                    zIndex: 10,
                }}
            />
        </Card>
    );
};
