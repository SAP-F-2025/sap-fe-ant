import {
    CheckCircleOutlined,
    EditOutlined,
    FileTextOutlined,
    RightOutlined,
} from '@ant-design/icons';
import { Badge, Button, Card, Flex, Space, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';

const { Text } = Typography;

interface PendingItem {
    icon: React.ReactNode;
    label: string;
    count: number;
    color: string;
    path: string;
    buttonText: string;
}

interface CreatorPendingActionsProps {
    pendingGrading: number;
    draftAssessments: number;
}

export const CreatorPendingActions: React.FC<CreatorPendingActionsProps> = ({
    pendingGrading,
    draftAssessments,
}) => {
    const { t } = useTranslation();
    const { token } = useThemeToken();
    const navigate = useNavigate();

    const pendingItems: PendingItem[] = [
        {
            icon: <CheckCircleOutlined />,
            label: t('creatorDashboard.pending.grading', { count: pendingGrading }),
            count: pendingGrading,
            color: '#f59e0b',
            path: '/grading',
            buttonText: t('creatorDashboard.pending.viewGrading'),
        },
        {
            icon: <FileTextOutlined />,
            label: t('creatorDashboard.pending.drafts', { count: draftAssessments }),
            count: draftAssessments,
            color: '#3b82f6',
            path: '/student/manage-assessments?status=draft',
            buttonText: t('creatorDashboard.pending.viewDrafts'),
        },
    ];

    return (
        <Card
            title={
                <Flex align="center" gap={8}>
                    <EditOutlined style={{ fontSize: 18, color: token.colorWarning }} />
                    <span style={{ fontWeight: 600 }}>{t('creatorDashboard.pending.title')}</span>
                </Flex>
            }
            bordered={false}
            style={{ borderRadius: token.borderRadiusLG, ...elevation[2], height: '100%' }}
        >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {pendingItems.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '16px',
                            borderRadius: token.borderRadius,
                            background: token.colorBgTextHover,
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <Flex justify="space-between" align="center">
                            <Flex align="center" gap={12}>
                                <Badge count={item.count} color={item.color} showZero>
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 10,
                                            background: `${item.color}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: item.color,
                                            fontSize: 18,
                                        }}
                                    >
                                        {item.icon}
                                    </div>
                                </Badge>
                                <Text style={{ fontWeight: 500 }}>{item.label}</Text>
                            </Flex>
                            <Button
                                type="link"
                                size="small"
                                onClick={() => navigate(item.path)}
                                icon={<RightOutlined />}
                                iconPosition="end"
                            >
                                {item.buttonText}
                            </Button>
                        </Flex>
                    </div>
                ))}
            </Space>
        </Card>
    );
};
