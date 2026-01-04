import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    HistoryOutlined,
    PlayCircleOutlined,
} from '@ant-design/icons';
import { Card, Empty, Flex, Skeleton, Tag, Timeline, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';

dayjs.extend(relativeTime);

const { Text } = Typography;

interface ActivityItem {
    id: number;
    user_name: string;
    action: string;
    assessment_title?: string;
    score?: number;
    created_at: string;
}

interface CreatorActivityTimelineProps {
    activities: ActivityItem[];
    isLoading: boolean;
}

export const CreatorActivityTimeline: React.FC<CreatorActivityTimelineProps> = ({
    activities,
    isLoading,
}) => {
    const { t, i18n } = useTranslation();
    const { token } = useThemeToken();

    const dayjsLocale = useMemo(() => {
        const lang = i18n.language?.toLowerCase() || '';
        return lang.startsWith('vi') ? 'vi' : 'en';
    }, [i18n.language]);

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

    const getActionInfo = (action: string) => {
        switch (action) {
            case 'completed_assessment':
                return {
                    color: 'green',
                    icon: <CheckCircleOutlined />,
                    text: t('creatorDashboard.activity.completed'),
                };
            case 'started_assessment':
                return {
                    color: 'blue',
                    icon: <PlayCircleOutlined />,
                    text: t('creatorDashboard.activity.started'),
                };
            default:
                return {
                    color: 'gray',
                    icon: <ClockCircleOutlined />,
                    text: action,
                };
        }
    };

    const timelineItems = activities.slice(0, 5).map((activity) => {
        const actionInfo = getActionInfo(activity.action);
        return {
            color: actionInfo.color,
            children: (
                <Flex vertical gap={4}>
                    <Flex align="center" gap={8} wrap="wrap">
                        <Text strong>{activity.user_name}</Text>
                        <Tag color={actionInfo.color} icon={actionInfo.icon} style={{ margin: 0 }}>
                            {actionInfo.text}
                        </Tag>
                    </Flex>
                    <Flex align="center" gap={8}>
                        <Text>{activity.assessment_title}</Text>
                        {activity.score !== undefined && (
                            <Tag color={activity.score >= 70 ? 'success' : 'error'}>
                                {activity.score.toFixed(1)}%
                            </Tag>
                        )}
                    </Flex>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {dayjs(activity.created_at).locale(dayjsLocale).fromNow()}
                    </Text>
                </Flex>
            ),
        };
    });

    return (
        <Card
            title={
                <Flex align="center" gap={8}>
                    <HistoryOutlined style={{ fontSize: 18, color: token.colorSuccess }} />
                    <span style={{ fontWeight: 600 }}>{t('creatorDashboard.activity.title')}</span>
                </Flex>
            }
            bordered={false}
            style={{ borderRadius: token.borderRadiusLG, ...elevation[2], height: '100%' }}
        >
            {activities.length === 0 ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={t('creatorDashboard.activity.noActivity')}
                    style={{ padding: '20px 0' }}
                />
            ) : (
                <Timeline style={{ marginTop: 16 }} items={timelineItems} />
            )}
        </Card>
    );
};
