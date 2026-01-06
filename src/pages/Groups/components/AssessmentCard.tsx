import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { Avatar, Card, Flex, Progress, Space, Tag, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';

const { Text } = Typography;

export interface AssessmentGradingInfo {
    id: number;
    title: string;
    total_attempts: number;
    graded_attempts: number;
    pending_attempts: number;
    average_score?: number;
}

interface AssessmentCardProps {
    assessment: AssessmentGradingInfo;
    isSelected: boolean;
    onClick: () => void;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({
    assessment,
    isSelected,
    onClick,
}) => {
    const { t } = useTranslation();
    const token = useThemeToken();

    const gradingProgress =
        assessment.total_attempts > 0
            ? Math.round((assessment.graded_attempts / assessment.total_attempts) * 100)
            : 0;

    const isFullyGraded = assessment.pending_attempts === 0 && assessment.total_attempts > 0;
    const hasPending = assessment.pending_attempts > 0;

    const getProgressColor = () => {
        if (isFullyGraded) return token.token.colorSuccess;
        if (gradingProgress >= 50) return token.token.colorWarning;
        return token.token.colorPrimary;
    };

    return (
        <Card
            hoverable
            onClick={onClick}
            style={{
                ...elevation[isSelected ? 2 : 1],
                borderRadius: 12,
                marginBottom: 12,
                cursor: 'pointer',
                border: isSelected ? `2px solid ${token.token.colorPrimary}` : '2px solid transparent',
                background: isSelected ? token.token.colorPrimaryBg : token.token.colorBgContainer,
                transition: 'all 0.2s ease',
            }}
            styles={{
                body: { padding: 16 },
            }}
        >
            <Flex vertical gap={12}>
                {/* Header: Title + Status */}
                <Flex align="flex-start" gap={12}>
                    <Avatar
                        size={40}
                        icon={<FileTextOutlined />}
                        style={{
                            backgroundColor: isSelected ? token.token.colorPrimary : token.token.colorPrimaryBg,
                            color: isSelected ? '#fff' : token.token.colorPrimary,
                            flexShrink: 0,
                        }}
                    />
                    <Flex vertical style={{ flex: 1, minWidth: 0 }}>
                        <Text
                            strong
                            style={{
                                fontSize: 14,
                                lineHeight: 1.4,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                            }}
                        >
                            {assessment.title}
                        </Text>
                        <Space size={4} style={{ marginTop: 4 }}>
                            {isFullyGraded && (
                                <Tag color="success" icon={<CheckCircleOutlined />} style={{ margin: 0 }}>
                                    {t('groupGrading.allGraded', 'Đã chấm hết')}
                                </Tag>
                            )}
                            {hasPending && (
                                <Tag color="warning" icon={<ClockCircleOutlined />} style={{ margin: 0 }}>
                                    {t('groupGrading.pendingCount', { count: assessment.pending_attempts })}
                                </Tag>
                            )}
                        </Space>
                    </Flex>
                </Flex>

                {/* Progress Bar */}
                <Flex vertical gap={4}>
                    <Flex justify="space-between" align="center">
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {t('groupGrading.gradedOf', {
                                graded: assessment.graded_attempts,
                                total: assessment.total_attempts,
                                defaultValue: `${assessment.graded_attempts}/${assessment.total_attempts} đã chấm`,
                            })}
                        </Text>
                        {assessment.average_score !== undefined && assessment.graded_attempts > 0 && (
                            <Text strong style={{ fontSize: 12, color: token.token.colorPrimary }}>
                                TB: {assessment.average_score.toFixed(1)}%
                            </Text>
                        )}
                    </Flex>
                    <Progress
                        percent={gradingProgress}
                        size="small"
                        showInfo={false}
                        strokeColor={getProgressColor()}
                        trailColor={token.token.colorBgLayout}
                    />
                </Flex>
            </Flex>
        </Card>
    );
};

export default AssessmentCard;
