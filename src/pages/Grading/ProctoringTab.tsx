import {
	AlertOutlined,
	CameraOutlined,
	ChromeOutlined,
	ClockCircleOutlined,
	ExclamationCircleOutlined,
	EyeOutlined,
	InfoCircleOutlined,
	PlayCircleOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import {
	Alert,
	Badge,
	Card,
	Col,
	Empty,
	Flex,
	Image,
	Progress,
	Row,
	Space,
	Spin,
	Statistic,
	Table,
	Tag,
	theme,
	Timeline,
	Tooltip,
	Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { proctoringDashboardService } from '../../services/proctoringDashboardService';
import { elevation } from '../../styles/elevation';
import type { AttemptViolationSummary, ViolationLog } from '../../types/proctoring';
import {
	formatDuration,
	formatTimeOffset,
	getSeverityColor,
	getSeverityName,
	getViolationCategory,
	getViolationTypeName,
	Severity,
} from '../../types/proctoring';

dayjs.extend(duration);

const { Text } = Typography;

interface ProctoringTabProps {
	attemptId: number;
	attemptStartTime?: string;
	onViolationCountChange?: (count: number) => void;
}

const ProctoringTab: React.FC<ProctoringTabProps> = ({
	attemptId,
	attemptStartTime,
	onViolationCountChange,
}) => {
	const { t } = useTranslation();
	const { token } = theme.useToken();

	const [loading, setLoading] = useState(true);
	const [violations, setViolations] = useState<ViolationLog[]>([]);
	const [summary, setSummary] = useState<AttemptViolationSummary | null>(null);

	useEffect(() => {
		fetchProctoringData();
	}, [attemptId]);

	const fetchProctoringData = async () => {
		try {
			setLoading(true);
			const [violationsRes, summaryRes] = await Promise.all([
				proctoringDashboardService.getViolationsByAttempt(attemptId, { pageSize: 100 }),
				proctoringDashboardService.getAttemptSummary(attemptId),
			]);
			setViolations(violationsRes.data || []);
			setSummary(summaryRes);

			// Notify parent of violation count
			if (onViolationCountChange) {
				onViolationCountChange(violationsRes.data?.length || 0);
			}
		} catch {
			// Don't show error - just show empty state
			setViolations([]);
			setSummary(null);
			if (onViolationCountChange) {
				onViolationCountChange(0);
			}
		} finally {
			setLoading(false);
		}
	};

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

	const calculateTimeOffset = (createdAt: string): number => {
		if (!attemptStartTime) return 0;
		const start = dayjs(attemptStartTime);
		const violation = dayjs(createdAt);
		return violation.diff(start, 'second');
	};

	const columns: ColumnsType<ViolationLog> = [
		{
			title: t('proctoring.time'),
			dataIndex: 'created_at',
			key: 'time',
			width: 100,
			render: (_, record) => {
				const offset = calculateTimeOffset(record.created_at);
				return (
					<Tooltip title={dayjs(record.created_at).format('HH:mm:ss')}>
						<Text code>{formatTimeOffset(offset)}</Text>
					</Tooltip>
				);
			},
		},
		{
			title: t('proctoring.type'),
			dataIndex: 'violation_type',
			key: 'type',
			width: 200,
			render: (type: number) => {
				const category = getViolationCategory(type);
				return (
					<Space>
						{getCategoryIcon(category)}
						<Text>{getViolationTypeName(type)}</Text>
					</Space>
				);
			},
		},
		{
			title: t('proctoring.severity'),
			dataIndex: 'severity',
			key: 'severity',
			width: 100,
			render: (severity: number) => (
				<Tag color={getSeverityTagColor(severity)}>{getSeverityName(severity)}</Tag>
			),
			filters: [
				{ text: t('proctoring.severityCritical'), value: Severity.CRITICAL },
				{ text: t('proctoring.severityHigh'), value: Severity.HIGH },
				{ text: t('proctoring.severityMedium'), value: Severity.MEDIUM },
				{ text: t('proctoring.severityLow'), value: Severity.LOW },
			],
			onFilter: (value, record) => record.severity === value,
		},
		{
			title: t('proctoring.duration'),
			key: 'duration',
			width: 100,
			render: (_, record) => {
				const durationMs = dayjs(record.ended_at).diff(
					dayjs(record.created_at),
					'millisecond'
				);
				const durationSec = durationMs / 1000;
				return (
					<Space>
						{record.is_prolonged && (
							<Tooltip title={t('proctoring.prolongedViolation')}>
								<WarningOutlined style={{ color: token.colorWarning }} />
							</Tooltip>
						)}
						<Text>{formatDuration(durationSec)}</Text>
					</Space>
				);
			},
		},
		{
			title: t('proctoring.confidence'),
			dataIndex: 'confidence_score',
			key: 'confidence',
			width: 100,
			render: (score: number) => (
				<Progress
					percent={Math.round(score * 100)}
					size="small"
					strokeColor={
						score >= 0.9
							? token.colorError
							: score >= 0.7
								? token.colorWarning
								: token.colorSuccess
					}
					format={(percent) => `${percent}%`}
				/>
			),
		},
		{
			title: t('proctoring.evidence'),
			key: 'evidence',
			width: 80,
			render: (_, record) =>
				record.snapshot_url ? (
					<Image
						src={record.snapshot_url}
						width={50}
						height={35}
						style={{ objectFit: 'cover', borderRadius: 4 }}
						preview={{
							mask: <EyeOutlined />,
						}}
					/>
				) : (
					<Text type="secondary">-</Text>
				),
		},
	];

	// Group violations by category for summary
	const categoryCounts = violations.reduce(
		(acc, v) => {
			const cat = getViolationCategory(v.violation_type);
			acc[cat] = (acc[cat] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>
	);

	// Calculate timeline data
	const timelineData = violations
		.sort((a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf())
		.slice(0, 10); // Show latest 10 in timeline

	if (loading) {
		return (
			<div style={{ textAlign: 'center', padding: '60px 0' }}>
				<Spin size="large" tip={t('proctoring.loading')} />
			</div>
		);
	}

	if (violations.length === 0 && !summary) {
		return (
			<Empty
				image={Empty.PRESENTED_IMAGE_SIMPLE}
				description={
					<Space direction="vertical">
						<Text>{t('proctoring.noViolations')}</Text>
						<Text type="secondary">{t('proctoring.noViolationsDesc')}</Text>
					</Space>
				}
			/>
		);
	}

	return (
		<Space direction="vertical" size="large" style={{ width: '100%' }}>
			{/* Summary Stats */}
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} md={6}>
					<Card style={{ ...elevation[1], borderRadius: 12 }}>
						<Statistic
							title={t('proctoring.totalViolations')}
							value={summary?.total_violations || violations.length}
							prefix={<AlertOutlined style={{ color: token.colorError }} />}
							valueStyle={{ color: token.colorError }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card style={{ ...elevation[1], borderRadius: 12 }}>
						<Statistic
							title={t('proctoring.criticalCount')}
							value={summary?.critical_count || 0}
							prefix={<ExclamationCircleOutlined style={{ color: '#f5222d' }} />}
							valueStyle={{ color: '#f5222d' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card style={{ ...elevation[1], borderRadius: 12 }}>
						<Statistic
							title={t('proctoring.highCount')}
							value={summary?.high_count || 0}
							prefix={<WarningOutlined style={{ color: '#fa8c16' }} />}
							valueStyle={{ color: '#fa8c16' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card style={{ ...elevation[1], borderRadius: 12 }}>
						<Statistic
							title={t('proctoring.avgConfidence')}
							value={Math.round((summary?.avg_confidence || 0) * 100)}
							suffix="%"
							prefix={<InfoCircleOutlined style={{ color: token.colorPrimary }} />}
						/>
					</Card>
				</Col>
			</Row>

			{/* Category Breakdown */}
			<Card
				title={
					<Space>
						<AlertOutlined />
						<Text strong>{t('proctoring.categoryBreakdown')}</Text>
					</Space>
				}
				style={{ ...elevation[1], borderRadius: 12 }}
			>
				<Row gutter={[16, 16]}>
					{Object.entries(categoryCounts).map(([category, count]) => (
						<Col xs={12} sm={8} md={6} key={category}>
							<Card
								size="small"
								style={{
									borderRadius: 8,
									background: token.colorBgLayout,
								}}
							>
								<Flex align="center" gap={12}>
									<div
										style={{
											width: 40,
											height: 40,
											borderRadius: 8,
											background:
												category === 'camera'
													? token.colorWarningBg
													: category === 'browser'
														? token.colorErrorBg
														: token.colorInfoBg,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										{getCategoryIcon(category)}
									</div>
									<div>
										<Text type="secondary" style={{ fontSize: 12 }}>
											{t(`proctoring.category.${category}`)}
										</Text>
										<br />
										<Text strong style={{ fontSize: 18 }}>
											{count}
										</Text>
									</div>
								</Flex>
							</Card>
						</Col>
					))}
				</Row>
			</Card>

			{/* Timeline */}
			{timelineData.length > 0 && (
				<Card
					title={
						<Space>
							<ClockCircleOutlined />
							<Text strong>{t('proctoring.timeline')}</Text>
						</Space>
					}
					style={{ ...elevation[1], borderRadius: 12 }}
				>
					<Timeline
						mode="left"
						items={timelineData.map((v) => ({
							color: getSeverityColor(v.severity),
							label: formatTimeOffset(calculateTimeOffset(v.created_at)),
							children: (
								<Space direction="vertical" size={0}>
									<Space>
										{getCategoryIcon(getViolationCategory(v.violation_type))}
										<Text strong>{getViolationTypeName(v.violation_type)}</Text>
										<Tag color={getSeverityTagColor(v.severity)}>
											{getSeverityName(v.severity)}
										</Tag>
									</Space>
									<Text type="secondary" style={{ fontSize: 12 }}>
										{t('proctoring.durationLabel')}:{' '}
										{formatDuration(
											dayjs(v.ended_at).diff(
												dayjs(v.created_at),
												'millisecond'
											) / 1000
										)}
										{v.is_prolonged && (
											<Tag color="warning" style={{ marginLeft: 8 }}>
												{t('proctoring.prolonged')}
											</Tag>
										)}
									</Text>
								</Space>
							),
						}))}
					/>
				</Card>
			)}

			{/* Severity Alert */}
			{summary && summary.max_severity_level >= Severity.HIGH && (
				<Alert
					message={
						summary.max_severity_level === Severity.CRITICAL
							? t('proctoring.criticalAlert')
							: t('proctoring.highAlert')
					}
					description={t('proctoring.alertDescription', {
						total: summary.total_violations,
						critical: summary.critical_count,
						high: summary.high_count,
					})}
					type={summary.max_severity_level === Severity.CRITICAL ? 'error' : 'warning'}
					showIcon
					icon={<ExclamationCircleOutlined />}
					style={{ borderRadius: 12 }}
				/>
			)}

			{/* Violations Table */}
			<Card
				title={
					<Space>
						<AlertOutlined />
						<Text strong>{t('proctoring.violationsList')}</Text>
						<Badge count={violations.length} style={{ marginLeft: 8 }} />
					</Space>
				}
				style={{ ...elevation[1], borderRadius: 12 }}
			>
				<Table<ViolationLog>
					columns={columns}
					dataSource={violations}
					rowKey="id"
					pagination={{
						pageSize: 10,
						showSizeChanger: true,
						showTotal: (total, range) =>
							t('common.paginationTotal', { start: range[0], end: range[1], total }),
					}}
					scroll={{ x: 800 }}
					rowClassName={(record) => {
						if (record.severity === Severity.CRITICAL) return 'violation-row-critical';
						if (record.severity === Severity.HIGH) return 'violation-row-high';
						return '';
					}}
				/>
			</Card>
		</Space>
	);
};

export default ProctoringTab;
