/**
 * AttemptLiveMonitor - Realtime Attempt Monitoring Dashboard
 *
 * Features:
 * - Live violation feed with timeline
 * - Progress tracking with countdown timer
 * - Refresh animation indicator
 * - Auto-stop polling when attempt completes
 * - Bilingual support (EN/VI)
 */
import {
    AlertOutlined,
    ArrowLeftOutlined,
    BookOutlined,
    CameraOutlined,
    CheckCircleOutlined,
    ChromeOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
    PlayCircleOutlined,
    ReloadOutlined,
    SyncOutlined,
    UserOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import {
    Alert,
    Avatar,
    Badge,
    Breadcrumb,
    Button,
    Card,
    Col,
    Descriptions,
    Empty,
    Flex,
    Image,
    Progress,
    Row,
    Space,
    Spin,
    Statistic,
    Tag,
    theme,
    Timeline,
    Tooltip,
    Typography,
} from 'antd';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAttemptRealtime } from '../../hooks/useAttemptRealtime';
import { elevation } from '../../styles/elevation';
import type { ViolationLog } from '../../types/proctoring';
import {
    formatDuration,
    formatTimeOffset,
    getSeverityColor,
    getSeverityName,
    getViolationCategory,
    getViolationTypeName,
    Severity,
} from '../../types/proctoring';
import './AttemptLiveMonitor.css';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const { Title, Text } = Typography;

const AttemptLiveMonitor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const attemptId = parseInt(id || '0', 10);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { token } = theme.useToken();

    // Countdown timer state
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

    // Realtime data hook
    const {
        violations,
        violationSummary,
        attemptDetails,
        lastUpdated,
        isRefreshing,
        justRefreshed,
        isLoading,
        isError,
        isAttemptCompleted,
        refresh,
    } = useAttemptRealtime({
        attemptId,
        enabled: attemptId > 0,
    });

    // Update time remaining from attempt details
    useEffect(() => {
        if (attemptDetails?.time_remaining !== undefined) {
            setTimeRemaining(attemptDetails.time_remaining);
        }
    }, [attemptDetails?.time_remaining]);

    // Countdown timer
    useEffect(() => {
        if (timeRemaining === null || timeRemaining <= 0 || isAttemptCompleted) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev === null || prev <= 0) return prev;
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, isAttemptCompleted]);

    // Format time remaining display
    const formatTimeRemaining = (seconds: number): string => {
        if (seconds <= 0) return '00:00';
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Get time remaining status class
    const getTimeRemainingClass = (): string => {
        if (isAttemptCompleted) return 'completed';
        if (timeRemaining === null) return '';
        if (timeRemaining <= 60) return 'danger';
        if (timeRemaining <= 300) return 'warning';
        return '';
    };

    // Calculate time taken for completed attempts
    const timeTaken = useMemo(() => {
        if (!attemptDetails?.started_at) return null;
        const startTime = dayjs(attemptDetails.started_at);
        // Use completed_at first, fallback to ended_at (cast due to type mismatch)
        const endTime = attemptDetails.completed_at
            ? dayjs(attemptDetails.completed_at)
            : ((attemptDetails as any).ended_at ? dayjs((attemptDetails as any).ended_at) : null);
        if (!endTime) return null;
        return endTime.diff(startTime, 'second');
    }, [attemptDetails]);
    // Category icon helper
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'camera':
                return <CameraOutlined />;
            case 'browser':
                return <ChromeOutlined />;
            case 'audio':
                return <PlayCircleOutlined />;
            case 'identity':
                return <EyeOutlined />;
            default:
                return <AlertOutlined />;
        }
    };

    // Severity tag color helper
    const getSeverityTagColor = (severity: number): string => {
        switch (severity) {
            case Severity.CRITICAL:
                return 'red';
            case Severity.HIGH:
                return 'orange';
            case Severity.MEDIUM:
                return 'gold';
            case Severity.LOW:
                return 'green';
            default:
                return 'default';
        }
    };

    // Calculate time offset from attempt start
    const calculateTimeOffset = (createdAt: string): number => {
        if (!attemptDetails?.started_at) return 0;
        const start = dayjs(attemptDetails.started_at);
        const violation = dayjs(createdAt);
        return violation.diff(start, 'second');
    };

    // Calculate progress percentage
    const progressPercent = useMemo(() => {
        if (!attemptDetails) return 0;
        const answered = attemptDetails.answers?.filter((a) => a.answer !== null && a.answer !== undefined).length || 0;
        // Use answers array length since questions are nested inside answers
        const total = attemptDetails.answers?.length || 0;
        if (total === 0) return 0;
        return Math.round((answered / total) * 100);
    }, [attemptDetails]);

    const answeredCount = useMemo(() => {
        return attemptDetails?.answers?.filter((a) => a.answer !== null && a.answer !== undefined).length || 0;
    }, [attemptDetails]);

    // Use answers.length since questions are nested inside each answer
    const totalQuestions = attemptDetails?.answers?.length || 0;

    // Severity breakdown for progress bar
    const severityBreakdown = useMemo(() => {
        if (!violationSummary) return { critical: 0, high: 0, medium: 0, low: 0 };
        const total = violationSummary.total_violations || 1;
        return {
            critical: (violationSummary.critical_count / total) * 100,
            high: (violationSummary.high_count / total) * 100,
            medium: (violationSummary.medium_count / total) * 100,
            low: (violationSummary.low_count / total) * 100,
        };
    }, [violationSummary]);

    // Timeline data sorted by time
    const timelineData = useMemo(() => {
        return [...violations]
            .sort((a, b) => dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf())
            .slice(0, 20);
    }, [violations]);

    if (!attemptId) {
        return (
            <Empty
                description={t('liveMonitor.invalidAttempt')}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
                <Button type="primary" onClick={() => navigate('/grading')}>
                    {t('common.back')}
                </Button>
            </Empty>
        );
    }

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Spin size="large" tip={t('liveMonitor.loading')} />
            </div>
        );
    }

    if (isError) {
        return (
            <Alert
                type="error"
                message={t('liveMonitor.errorTitle')}
                description={t('liveMonitor.errorDescription')}
                showIcon
                action={
                    <Button onClick={refresh}>{t('common.refresh')}</Button>
                }
            />
        );
    }

    return (
        <div className="live-monitor-container">
            {/* Header */}
            <Flex justify="space-between" align="center" wrap="wrap" gap={16} style={{ marginBottom: 24 }}>
                <Space direction="vertical" size={4}>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/grading">{t('layout.grading')}</Link> },
                            { title: <Link to={`/grading/${attemptId}`}>{t('liveMonitor.attemptDetails')}</Link> },
                            { title: t('liveMonitor.title') },
                        ]}
                    />
                    <Flex align="center" gap={12}>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(`/grading/${attemptId}`)}
                        >
                            {t('common.back')}
                        </Button>
                        <Title level={3} style={{ margin: 0 }}>
                            {t('liveMonitor.title')}
                        </Title>
                        <div className={`live-badge ${isAttemptCompleted ? 'completed' : 'active'}`}>
                            {isAttemptCompleted ? (
                                <>
                                    <CheckCircleOutlined />
                                    {t('liveMonitor.completed')}
                                </>
                            ) : (
                                <>
                                    <span className="live-badge-dot" />
                                    {t('liveMonitor.live')}
                                </>
                            )}
                        </div>
                    </Flex>
                </Space>

                <div className="header-actions">
                    {/* Refresh indicator */}
                    <div className={`refresh-indicator ${justRefreshed ? 'just-refreshed' : 'idle'}`}>
                        {justRefreshed ? (
                            <>
                                <CheckCircleOutlined />
                                {t('liveMonitor.justUpdated')}
                            </>
                        ) : (
                            <>
                                <ClockCircleOutlined />
                                {lastUpdated
                                    ? t('liveMonitor.lastUpdated', {
                                        time: dayjs(lastUpdated).format('HH:mm:ss'),
                                    })
                                    : t('liveMonitor.neverUpdated')}
                            </>
                        )}
                    </div>

                    <Tooltip title={t('liveMonitor.refreshNow')}>
                        <Button
                            icon={isRefreshing ? <SyncOutlined spin /> : <ReloadOutlined />}
                            onClick={refresh}
                            disabled={isRefreshing}
                        >
                            {t('common.refresh')}
                        </Button>
                    </Tooltip>
                </div>
            </Flex>

            {/* Assessment & Student Info Card */}
            <Card
                style={{ ...elevation[1], borderRadius: 16, marginBottom: 24 }}
                bodyStyle={{ padding: '16px 24px' }}
            >
                <Row gutter={[24, 16]} align="middle">
                    {/* Student Info */}
                    <Col xs={24} md={8}>
                        <Flex align="center" gap={12}>
                            <Avatar
                                size={48}
                                src={(attemptDetails as any)?.student?.avatar_url}
                                icon={<UserOutlined />}
                                style={{ flexShrink: 0 }}
                            />
                            <Space direction="vertical" size={0}>
                                <Text strong style={{ fontSize: 16 }}>
                                    {(attemptDetails as any)?.student?.full_name || t('common.unknown')}
                                </Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {(attemptDetails as any)?.student?.email || ''}
                                </Text>
                            </Space>
                        </Flex>
                    </Col>

                    {/* Assessment Title */}
                    <Col xs={24} md={10}>
                        <Flex align="center" gap={12}>
                            <BookOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
                            <Space direction="vertical" size={0}>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {t('liveMonitor.assessment')}
                                </Text>
                                <Text strong style={{ fontSize: 16 }}>
                                    {attemptDetails?.assessment?.title || t('common.unknown')}
                                </Text>
                            </Space>
                        </Flex>
                    </Col>

                    {/* Quick Stats */}
                    <Col xs={24} md={6}>
                        <Flex gap={16} justify="flex-end" wrap="wrap">
                            <Tooltip title={t('liveMonitor.duration')}>
                                <Tag icon={<ClockCircleOutlined />} color="blue">
                                    {attemptDetails?.assessment?.duration || 0} {t('common.minutes')}
                                </Tag>
                            </Tooltip>
                            <Tooltip title={t('liveMonitor.passingScore')}>
                                <Tag icon={<CheckCircleOutlined />} color="green">
                                    {t('liveMonitor.passAt')} {attemptDetails?.assessment?.passing_score || 0}%
                                </Tag>
                            </Tooltip>
                        </Flex>
                    </Col>
                </Row>
            </Card>

            {/* Main Content */}
            <Row gutter={[24, 24]}>
                {/* Left Column: Progress & Stats */}
                <Col xs={24} lg={8}>
                    <Space direction="vertical" size={16} style={{ width: '100%' }}>
                        {/* Time Card - shows Time Taken when completed, Time Remaining when in progress */}
                        <Card
                            className="progress-card"
                            style={{ ...elevation[2], borderRadius: 16 }}
                        >
                            <Flex vertical align="center" gap={12}>
                                {isAttemptCompleted ? (
                                    <>
                                        <Text type="secondary">{t('liveMonitor.timeTaken')}</Text>
                                        <div className={`time-remaining completed`}>
                                            {timeTaken !== null
                                                ? formatTimeRemaining(timeTaken)
                                                : '--:--'}
                                        </div>
                                        <Tag color="success" icon={<CheckCircleOutlined />}>
                                            {t('liveMonitor.examEnded')}
                                        </Tag>
                                        {attemptDetails?.completed_at && (
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {t('liveMonitor.completedAt')}: {dayjs(attemptDetails.completed_at).format('HH:mm:ss DD/MM/YYYY')}
                                            </Text>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Text type="secondary">{t('liveMonitor.timeRemaining')}</Text>
                                        <div className={`time-remaining ${getTimeRemainingClass()}`}>
                                            {timeRemaining !== null
                                                ? formatTimeRemaining(timeRemaining)
                                                : '--:--'}
                                        </div>
                                        {timeRemaining !== null && timeRemaining <= 300 && timeRemaining > 0 && (
                                            <Tag color="warning" icon={<WarningOutlined />}>
                                                {t('liveMonitor.timeWarning')}
                                            </Tag>
                                        )}
                                    </>
                                )}
                            </Flex>
                        </Card>

                        {/* Progress Card with Answer Grid */}
                        <Card
                            title={
                                <Flex justify="space-between" align="center">
                                    <Space>
                                        <ClockCircleOutlined />
                                        <Text strong>{t('liveMonitor.progress')}</Text>
                                    </Space>
                                    <Badge
                                        count={`${answeredCount}/${totalQuestions}`}
                                        style={{
                                            backgroundColor: progressPercent === 100 ? token.colorSuccess : token.colorPrimary,
                                        }}
                                    />
                                </Flex>
                            }
                            className="progress-card"
                            style={{ ...elevation[1], borderRadius: 16 }}
                        >
                            <Space direction="vertical" style={{ width: '100%' }} size={16}>
                                {/* Progress bar */}
                                <Progress
                                    percent={progressPercent}
                                    strokeColor={{
                                        '0%': token.colorPrimary,
                                        '100%': token.colorSuccess,
                                    }}
                                    strokeLinecap="round"
                                    format={(percent) => `${percent}%`}
                                />

                                {/* Answer Grid */}
                                <div className="answer-grid">
                                    {/* Extract questions from answers since API nests question inside each answer */}
                                    {attemptDetails?.answers
                                        ?.slice() // Create a copy to avoid mutating original
                                        .sort((a, b) => {
                                            // Sort by question.order if available, otherwise by question_id
                                            // Note: order field comes from API but not in TypeScript Question type
                                            const orderA = (a.question as any)?.order ?? 0;
                                            const orderB = (b.question as any)?.order ?? 0;
                                            if (orderA !== orderB) return orderA - orderB;
                                            return (a.question_id ?? 0) - (b.question_id ?? 0);
                                        })
                                        .map((answer, idx) => {
                                            const question = answer.question;
                                            const hasAnswer = answer.answer !== null && answer.answer !== undefined;
                                            const isGraded = answer.is_graded;
                                            const isCorrect = answer.is_correct;
                                            const score = answer.score ?? 0;
                                            const maxScore = answer.max_score ?? question?.points ?? 0;
                                            const isPartial = isGraded && score > 0 && score < maxScore;

                                            // Determine status class
                                            let statusClass = 'unanswered';
                                            if (hasAnswer) {
                                                if (isGraded) {
                                                    if (isCorrect === true) {
                                                        statusClass = 'correct';
                                                    } else if (isCorrect === false) {
                                                        statusClass = isPartial ? 'partial' : 'incorrect';
                                                    } else if (isPartial) {
                                                        statusClass = 'partial';
                                                    } else {
                                                        statusClass = 'answered';
                                                    }
                                                } else {
                                                    statusClass = 'answered';
                                                }
                                            }

                                            return (
                                                <Tooltip
                                                    key={answer.question_id ?? idx}
                                                    title={
                                                        <Space direction="vertical" size={2}>
                                                            <Text style={{ color: 'white' }}>
                                                                {t('liveMonitor.questionNumber', { number: idx + 1 })}
                                                            </Text>
                                                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                                                                {!hasAnswer
                                                                    ? t('liveMonitor.statusUnanswered')
                                                                    : isGraded
                                                                        ? isCorrect
                                                                            ? t('liveMonitor.statusCorrect')
                                                                            : isPartial
                                                                                ? `${t('liveMonitor.statusPartial')} (${score}/${maxScore})`
                                                                                : t('liveMonitor.statusIncorrect')
                                                                        : t('liveMonitor.statusAnswered')}
                                                            </Text>
                                                        </Space>
                                                    }
                                                >
                                                    <div className={`answer-grid-item ${statusClass}`}>
                                                        {idx + 1}
                                                    </div>
                                                </Tooltip>
                                            );
                                        })}
                                </div>

                                {/* Legend */}
                                <div className="answer-grid-legend">
                                    <div className="legend-item">
                                        <div className="legend-dot unanswered" />
                                        <span>{t('liveMonitor.legendUnanswered')}</span>
                                    </div>
                                    <div className="legend-item">
                                        <div className="legend-dot answered" />
                                        <span>{t('liveMonitor.legendAnswered')}</span>
                                    </div>
                                    {isAttemptCompleted && (
                                        <>
                                            <div className="legend-item">
                                                <div className="legend-dot correct" />
                                                <span>{t('liveMonitor.legendCorrect')}</span>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-dot incorrect" />
                                                <span>{t('liveMonitor.legendIncorrect')}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Space>
                        </Card>

                        {/* Violation Summary Card */}
                        <Card
                            title={
                                <Space>
                                    <AlertOutlined />
                                    <Text strong>{t('liveMonitor.violationSummary')}</Text>
                                </Space>
                            }
                            className="progress-card"
                            style={{ ...elevation[1], borderRadius: 16 }}
                        >
                            <Space direction="vertical" style={{ width: '100%' }} size={16}>
                                <Statistic
                                    title={t('liveMonitor.totalViolations')}
                                    value={violationSummary?.total_violations || 0}
                                    prefix={<AlertOutlined style={{ color: token.colorError }} />}
                                    valueStyle={{
                                        color:
                                            (violationSummary?.total_violations || 0) > 0
                                                ? token.colorError
                                                : token.colorSuccess,
                                    }}
                                />

                                {/* Severity breakdown bar */}
                                {(violationSummary?.total_violations || 0) > 0 && (
                                    <>
                                        <div className="severity-bar">
                                            <div
                                                className="severity-bar-segment critical"
                                                style={{ width: `${severityBreakdown.critical}%` }}
                                            />
                                            <div
                                                className="severity-bar-segment high"
                                                style={{ width: `${severityBreakdown.high}%` }}
                                            />
                                            <div
                                                className="severity-bar-segment medium"
                                                style={{ width: `${severityBreakdown.medium}%` }}
                                            />
                                            <div
                                                className="severity-bar-segment low"
                                                style={{ width: `${severityBreakdown.low}%` }}
                                            />
                                        </div>

                                        <Row gutter={[8, 8]}>
                                            <Col span={12}>
                                                <Flex align="center" gap={4}>
                                                    <Badge color="#f5222d" />
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {t('proctoring.severityCritical')}:{' '}
                                                        {violationSummary?.critical_count || 0}
                                                    </Text>
                                                </Flex>
                                            </Col>
                                            <Col span={12}>
                                                <Flex align="center" gap={4}>
                                                    <Badge color="#fa8c16" />
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {t('proctoring.severityHigh')}:{' '}
                                                        {violationSummary?.high_count || 0}
                                                    </Text>
                                                </Flex>
                                            </Col>
                                            <Col span={12}>
                                                <Flex align="center" gap={4}>
                                                    <Badge color="#faad14" />
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {t('proctoring.severityMedium')}:{' '}
                                                        {violationSummary?.medium_count || 0}
                                                    </Text>
                                                </Flex>
                                            </Col>
                                            <Col span={12}>
                                                <Flex align="center" gap={4}>
                                                    <Badge color="#52c41a" />
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {t('proctoring.severityLow')}:{' '}
                                                        {violationSummary?.low_count || 0}
                                                    </Text>
                                                </Flex>
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </Space>
                        </Card>

                        {/* Alert if high severity violations */}
                        {violationSummary &&
                            (violationSummary.critical_count > 0 ||
                                violationSummary.high_count > 0) && (
                                <Alert
                                    message={
                                        violationSummary.critical_count > 0
                                            ? t('liveMonitor.criticalAlert')
                                            : t('liveMonitor.highAlert')
                                    }
                                    description={t('liveMonitor.alertDescription', {
                                        critical: violationSummary.critical_count,
                                        high: violationSummary.high_count,
                                    })}
                                    type={violationSummary.critical_count > 0 ? 'error' : 'warning'}
                                    showIcon
                                    icon={<ExclamationCircleOutlined />}
                                    style={{ borderRadius: 12 }}
                                />
                            )}
                    </Space>
                </Col >

                {/* Right Column: Timeline */}
                < Col xs={24} lg={16} >
                    <Card
                        title={
                            <Flex justify="space-between" align="center">
                                <Space>
                                    <ClockCircleOutlined />
                                    <Text strong>{t('liveMonitor.violationTimeline')}</Text>
                                </Space>
                                <Badge
                                    count={violations.length}
                                    showZero
                                    style={{ backgroundColor: token.colorPrimary }}
                                />
                            </Flex>
                        }
                        style={{ ...elevation[1], borderRadius: 16 }}
                    >
                        {violations.length === 0 ? (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <Space direction="vertical">
                                        <Text>{t('liveMonitor.noViolations')}</Text>
                                        <Text type="secondary">
                                            {t('liveMonitor.noViolationsDesc')}
                                        </Text>
                                    </Space>
                                }
                            />
                        ) : (
                            <div className="violation-timeline-container">
                                {timelineData.map((v: ViolationLog, index: number) => (
                                    <div
                                        key={v.id || index}
                                        className={`violation-card ${index === 0 && justRefreshed ? 'violation-card-new' : ''} severity-${getSeverityTagColor(v.severity)}`}
                                    >
                                        {/* Left: Time indicator */}
                                        <div className="violation-card-time">
                                            <Text code className="time-badge">
                                                {formatTimeOffset(calculateTimeOffset(v.created_at))}
                                            </Text>
                                            <div className={`severity-dot severity-${getSeverityTagColor(v.severity)}`} />
                                        </div>

                                        {/* Center: Violation details */}
                                        <div className="violation-card-content">
                                            <Flex align="center" gap={8} wrap="wrap">
                                                <span className="violation-icon">
                                                    {getCategoryIcon(getViolationCategory(v.violation_type))}
                                                </span>
                                                <Text strong style={{ fontSize: 14 }}>
                                                    {getViolationTypeName(v.violation_type)}
                                                </Text>
                                                <Tag color={getSeverityTagColor(v.severity)} style={{ margin: 0 }}>
                                                    {getSeverityName(v.severity)}
                                                </Tag>
                                                {v.is_prolonged && (
                                                    <Tag color="warning" style={{ margin: 0 }}>
                                                        {t('proctoring.prolonged')}
                                                    </Tag>
                                                )}
                                            </Flex>
                                            <Flex align="center" gap={16} style={{ marginTop: 6 }}>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                                                    {formatDuration(
                                                        dayjs(v.ended_at).diff(
                                                            dayjs(v.created_at),
                                                            'millisecond'
                                                        ) / 1000
                                                    )}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    <EyeOutlined style={{ marginRight: 4 }} />
                                                    {t('proctoring.confidence')}: {Math.round(v.confidence_score * 100)}%
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {dayjs(v.created_at).format('HH:mm:ss')}
                                                </Text>
                                            </Flex>
                                        </div>

                                        {/* Right: Snapshot */}
                                        {v.snapshot_url && (
                                            <div className="violation-card-snapshot">
                                                <Image
                                                    src={v.snapshot_url}
                                                    width={100}
                                                    height={75}
                                                    style={{
                                                        objectFit: 'cover',
                                                        borderRadius: 8,
                                                    }}
                                                    preview={{
                                                        mask: (
                                                            <Space>
                                                                <EyeOutlined />
                                                                {t('common.view')}
                                                            </Space>
                                                        ),
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </Col >
            </Row >
        </div >
    );
};

export default AttemptLiveMonitor;
