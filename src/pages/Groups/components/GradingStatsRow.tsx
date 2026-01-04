import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    PercentageOutlined,
    TrophyOutlined,
} from '@ant-design/icons';
import { Card, Col, Flex, Row, Skeleton, Space, Statistic, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gradingService } from '../../../services/gradingService';
import { cardColors } from '../../../styles/cardColors';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';

const { Text, Title } = Typography;

interface GradingStatsRowProps {
    assessmentId: number;
    groupId?: number;
    assessmentTitle?: string;
}

interface GradingStats {
    total_attempts: number;
    graded_attempts: number;
    pending_attempts: number;
    average_score?: number;
}

const GradingStatsRow: React.FC<GradingStatsRowProps> = ({ assessmentId, groupId, assessmentTitle }) => {
    const { t } = useTranslation();
    const token = useThemeToken();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<GradingStats | null>(null);

    useEffect(() => {
        if (assessmentId) {
            fetchStats();
        }
    }, [assessmentId, groupId]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await gradingService.getGradingOverview(assessmentId, groupId);
            setStats({
                total_attempts: response.total_attempts || 0,
                graded_attempts: response.graded_attempts || 0,
                pending_attempts: response.pending_attempts || 0,
                average_score: response.average_score,
            });
        } catch (error) {
            console.error('Failed to fetch grading stats:', error);
            setStats(null);
        } finally {
            setLoading(false);
        }
    };

    const passRate =
        stats && stats.graded_attempts > 0
            ? Math.round((stats.graded_attempts / stats.total_attempts) * 100)
            : 0;

    if (loading) {
        return (
            <Card style={{ ...elevation[1], borderRadius: 16, marginBottom: 16 }}>
                <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <Card
            style={{
                ...elevation[1],
                borderRadius: 16,
                marginBottom: 16,
                background: `linear-gradient(135deg, ${token.token.colorBgContainer} 0%, ${token.token.colorBgLayout} 100%)`,
            }}
            styles={{ body: { padding: '20px 24px' } }}
        >
            <Flex vertical gap={16}>
                {/* Header */}
                {assessmentTitle && (
                    <Space direction="vertical" size={0}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {t('groupGrading.gradingFor', 'Chấm điểm cho')}
                        </Text>
                        <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                            {assessmentTitle}
                        </Title>
                    </Space>
                )}

                {/* Stats Grid */}
                <Row gutter={[16, 16]}>
                    <Col xs={12} sm={6}>
                        <Card
                            style={{
                                ...elevation[0],
                                borderRadius: 12,
                                background: cardColors.blue,
                                border: 'none',
                            }}
                            styles={{ body: { padding: '12px 16px' } }}
                        >
                            <Statistic
                                title={
                                    <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.85)' }}>
                                        {t('groupGrading.totalSubmissions', 'Tổng nộp bài')}
                                    </Text>
                                }
                                value={stats.total_attempts}
                                prefix={<TrophyOutlined style={{ marginRight: 4, color: 'white' }} />}
                                valueStyle={{ fontSize: 24, fontWeight: 600, color: 'white' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card
                            style={{
                                ...elevation[0],
                                borderRadius: 12,
                                background: cardColors.green,
                                border: 'none',
                            }}
                            styles={{ body: { padding: '12px 16px' } }}
                        >
                            <Statistic
                                title={
                                    <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.85)' }}>
                                        {t('groupGrading.graded', 'Đã chấm')}
                                    </Text>
                                }
                                value={stats.graded_attempts}
                                prefix={<CheckCircleOutlined style={{ marginRight: 4, color: 'white' }} />}
                                valueStyle={{ fontSize: 24, fontWeight: 600, color: 'white' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card
                            style={{
                                ...elevation[0],
                                borderRadius: 12,
                                background: cardColors.orange,
                                border: 'none',
                            }}
                            styles={{ body: { padding: '12px 16px' } }}
                        >
                            <Statistic
                                title={
                                    <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.85)' }}>
                                        {t('groupGrading.pending', 'Chờ chấm')}
                                    </Text>
                                }
                                value={stats.pending_attempts}
                                prefix={<ClockCircleOutlined style={{ marginRight: 4, color: 'white' }} />}
                                valueStyle={{
                                    fontSize: 24,
                                    fontWeight: 600,
                                    color: 'white',
                                }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card
                            style={{
                                ...elevation[0],
                                borderRadius: 12,
                                background: cardColors.purple,
                                border: 'none',
                            }}
                            styles={{ body: { padding: '12px 16px' } }}
                        >
                            <Statistic
                                title={
                                    <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.85)' }}>
                                        {t('groupGrading.avgScore', 'Điểm TB')}
                                    </Text>
                                }
                                value={stats.average_score?.toFixed(1) ?? '-'}
                                suffix={<span style={{ color: 'white' }}>{stats.average_score !== undefined ? '%' : ''}</span>}
                                prefix={<PercentageOutlined style={{ marginRight: 4, color: 'white' }} />}
                                valueStyle={{ fontSize: 24, fontWeight: 600, color: 'white' }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Flex>
        </Card>
    );
};

export default GradingStatsRow;
