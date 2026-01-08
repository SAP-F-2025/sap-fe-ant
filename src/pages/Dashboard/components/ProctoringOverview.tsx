import {
    AlertOutlined,
    ExclamationCircleOutlined,
    WarningOutlined,
    InfoCircleOutlined,
    RightOutlined,
} from '@ant-design/icons';
import { Card, Col, Empty, Flex, Progress, Row, Skeleton, Space, Tag, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';
import type { DashboardOverview } from '../../../types/proctoring';
import { SEVERITY_COLORS } from '../constants';

const { Text, Title } = Typography;

interface ProctoringOverviewProps {
    data: DashboardOverview | undefined;
    isLoading: boolean;
}

interface SeverityBarProps {
    label: string;
    count: number;
    total: number;
    color: string;
    icon: React.ReactNode;
}

const SeverityBar: React.FC<SeverityBarProps> = ({ label, count, total, color, icon }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
        <Flex
            align="center"
            gap={12}
            style={{
                marginBottom: 16,
                padding: '8px 0',
            }}
        >
            <span style={{ color, fontSize: 16, width: 20, flexShrink: 0 }}>{icon}</span>
            <Text style={{ width: 80, fontSize: 13, flexShrink: 0 }}>{label}</Text>
            <div style={{ flex: 1, minWidth: 100 }}>
                <Progress
                    percent={percentage}
                    size="small"
                    strokeColor={color}
                    trailColor="#f0f0f0"
                    showInfo={false}
                    style={{ margin: 0 }}
                />
            </div>
            <Text strong style={{ width: 40, textAlign: 'right', fontSize: 13, flexShrink: 0 }}>
                {count}
            </Text>
        </Flex>
    );
};

/**
 * ProctoringOverview Component
 * Displays violation severity breakdown and top violation types
 * Clean Corporate style with clear data hierarchy
 */
export const ProctoringOverview: React.FC<ProctoringOverviewProps> = ({ data, isLoading }) => {
    const { t } = useTranslation();
    const { token } = useThemeToken();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <Card
                bordered={false}
                style={{
                    borderRadius: token.borderRadiusLG,
                    height: '100%',
                    ...elevation[1],
                }}
            >
                <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
        );
    }

    if (!data) {
        return (
            <Card
                bordered={false}
                style={{
                    borderRadius: token.borderRadiusLG,
                    height: '100%',
                    ...elevation[1],
                }}
            >
                <Flex vertical align="center" justify="center" style={{ height: 200 }}>
                    <Empty
                        description={t('dashboard.noProctoringData')}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                </Flex>
            </Card>
        );
    }

    const totalBySeverity =
        data.critical_count + data.high_count + data.medium_count + data.low_count;

    const severityData = [
        {
            label: t('dashboard.critical'),
            count: data.critical_count,
            color: SEVERITY_COLORS.critical,
            icon: <ExclamationCircleOutlined />,
        },
        {
            label: t('dashboard.high'),
            count: data.high_count,
            color: SEVERITY_COLORS.high,
            icon: <WarningOutlined />,
        },
        {
            label: t('dashboard.medium'),
            count: data.medium_count,
            color: SEVERITY_COLORS.medium,
            icon: <AlertOutlined />,
        },
        {
            label: t('dashboard.low'),
            count: data.low_count,
            color: SEVERITY_COLORS.low,
            icon: <InfoCircleOutlined />,
        },
    ];

    return (
        <Card
            bordered={false}
            style={{
                borderRadius: token.borderRadiusLG,
                height: '100%',
                ...elevation[1],
            }}
        >
            <Flex vertical gap={16}>
                {/* Header */}
                <Flex justify="space-between" align="center">
                    <Text strong style={{ fontSize: 14 }}>
                        {t('dashboard.proctoringOverview')}
                    </Text>
                    <Tag color="blue">{data.total_violations} {t('dashboard.totalViolations')}</Tag>
                </Flex>

                {/* Severity Breakdown */}
                <div>
                    {severityData.map((item) => (
                        <SeverityBar
                            key={item.label}
                            label={item.label}
                            count={item.count}
                            total={totalBySeverity}
                            color={item.color}
                            icon={item.icon}
                        />
                    ))}
                </div>

                {/* Top Violation Types */}
                {data.top_violation_types && data.top_violation_types.length > 0 && (
                    <div>
                        <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
                            {t('dashboard.topViolationTypes')}
                        </Text>
                        <Flex wrap="wrap" gap={4}>
                            {data.top_violation_types.slice(0, 3).map((type) => (
                                <Tag key={type.violation_type} style={{ fontSize: 11 }}>
                                    {type.type_name} ({type.count})
                                </Tag>
                            ))}
                        </Flex>
                    </div>
                )}

                {/* View Details Link */}
                <Flex
                    align="center"
                    gap={4}
                    style={{
                        cursor: 'pointer',
                        color: token.colorPrimary,
                        fontSize: 12,
                        marginTop: 'auto',
                    }}
                    onClick={() => navigate('/grading')}
                >
                    <Text style={{ color: 'inherit' }}>{t('dashboard.viewDetails')}</Text>
                    <RightOutlined style={{ fontSize: 10 }} />
                </Flex>
            </Flex>
        </Card>
    );
};
