import {
	AlertOutlined,
	ExclamationCircleOutlined,
	EyeOutlined,
	FileTextOutlined,
	SafetyOutlined,
	UserOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import {
	Avatar,
	Badge,
	Button,
	Card,
	Col,
	Empty,
	List,
	Progress,
	Row,
	Space,
	Spin,
	Statistic,
	Table,
	Tag,
	Tooltip,
	Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gradingService, type AttemptListItem } from '../../services/gradingService';
import groupService from '../../services/groupService';
import proctoringDashboardService from '../../services/proctoringDashboardService';
import { cardColors } from '../../styles/cardColors';
import { elevation } from '../../styles/elevation';
import { useThemeToken } from '../../theme/ThemeProvider';
import {
	AttemptViolationSummary,
	getSeverityColor,
	getSeverityName,
	Severity,
} from '../../types/proctoring';

const { Text } = Typography;

interface GroupProctoringTabProps {
	groupId: number;
}

interface AssessmentViolationSummary {
	assessment_id: number;
	assessment_title: string;
	total_attempts: number;
	attempts_with_violations: number;
	total_violations: number;
	highest_severity: number;
	critical_count: number;
	high_count: number;
}

interface StudentViolationSummary {
	student_id: string;
	student_name: string;
	student_email: string;
	student_avatar?: string;
	total_attempts: number;
	total_violations: number;
	highest_severity: number;
}

const GroupProctoringTab: React.FC<GroupProctoringTabProps> = ({ groupId }) => {
	const { t } = useTranslation();
	const token = useThemeToken();
	const [loading, setLoading] = useState(true);
	const [attempts, setAttempts] = useState<AttemptListItem[]>([]);
	const [violationSummaries, setViolationSummaries] = useState<
		Record<string, AttemptViolationSummary>
	>({});

	useEffect(() => {
		fetchData();
	}, [groupId]);

	const fetchData = async () => {
		setLoading(true);
		try {
			// Step 1: Get assessments for this group
			const groupAssessments = await groupService.getGroupAssessments(groupId);
			const assessmentIds = (groupAssessments.assessments || []).map((a) => a.id);

			if (assessmentIds.length === 0) {
				setAttempts([]);
				setViolationSummaries({});
				setLoading(false);
				return;
			}

			// Step 2: Get attempts for all assessments in the group
			const allAttempts: AttemptListItem[] = [];
			for (const assessmentId of assessmentIds) {
				try {
					const response = await gradingService.getAttempts({
						page: 1,
						size: 500,
						assessment_id: assessmentId,
					});
					allAttempts.push(...(response.data || []));
				} catch {
					// Continue with other assessments
				}
			}

			setAttempts(allAttempts);

			// Step 3: Fetch violation summaries for all attempts
			if (allAttempts.length > 0) {
				const attemptIds = allAttempts.map((a) => a.id);
				console.log(
					'[GroupProctoringTab] Fetching violation summaries for attempt IDs:',
					attemptIds
				);
				try {
					const summariesResponse =
						await proctoringDashboardService.getAttemptSummaries(attemptIds);
					console.log(
						'[GroupProctoringTab] Violation summaries response:',
						summariesResponse
					);
					const summaryMap: Record<string, AttemptViolationSummary> = {};
					summariesResponse.data.forEach((s) => {
						summaryMap[s.attempt_id.toString()] = s;
					});
					console.log('[GroupProctoringTab] Violation summary map:', summaryMap);
					setViolationSummaries(summaryMap);
				} catch (error) {
					console.error(
						'[GroupProctoringTab] Failed to fetch violation summaries:',
						error
					);
					// Silently fail - proctoring data is supplementary
				}
			}
		} catch {
			// Handle error silently
			setAttempts([]);
		} finally {
			setLoading(false);
		}
	};

	// Aggregate violations by assessment
	const assessmentSummaries = useMemo<AssessmentViolationSummary[]>(() => {
		const assessmentMap = new Map<number, AssessmentViolationSummary>();

		attempts.forEach((attempt) => {
			const assessmentId = attempt.assessment_id;
			const summary = violationSummaries[attempt.id.toString()];

			if (!assessmentMap.has(assessmentId)) {
				assessmentMap.set(assessmentId, {
					assessment_id: assessmentId,
					assessment_title: attempt.assessment?.title || `Assessment #${assessmentId}`,
					total_attempts: 0,
					attempts_with_violations: 0,
					total_violations: 0,
					highest_severity: Severity.LOW,
					critical_count: 0,
					high_count: 0,
				});
			}

			const agg = assessmentMap.get(assessmentId)!;
			agg.total_attempts++;

			if (summary && summary.total_violations > 0) {
				agg.attempts_with_violations++;
				agg.total_violations += summary.total_violations;
				if (summary.max_severity_level > agg.highest_severity) {
					agg.highest_severity = summary.max_severity_level;
				}
				if (summary.max_severity_level >= Severity.CRITICAL) {
					agg.critical_count++;
				} else if (summary.max_severity_level >= Severity.HIGH) {
					agg.high_count++;
				}
			}
		});

		return Array.from(assessmentMap.values()).sort(
			(a, b) => b.total_violations - a.total_violations
		);
	}, [attempts, violationSummaries]);

	// Aggregate violations by student (high-risk students)
	const highRiskStudents = useMemo<StudentViolationSummary[]>(() => {
		const studentMap = new Map<string, StudentViolationSummary>();

		attempts.forEach((attempt) => {
			const studentId = attempt.student_id.toString();
			const summary = violationSummaries[attempt.id.toString()];

			if (!studentMap.has(studentId)) {
				studentMap.set(studentId, {
					student_id: studentId,
					student_name: attempt.student?.full_name || `Student #${studentId}`,
					student_email: attempt.student?.email || '',
					student_avatar: attempt.student?.avatar_url,
					total_attempts: 0,
					total_violations: 0,
					highest_severity: Severity.LOW,
				});
			}

			const agg = studentMap.get(studentId)!;
			agg.total_attempts++;

			if (summary && summary.total_violations > 0) {
				agg.total_violations += summary.total_violations;
				if (summary.max_severity_level > agg.highest_severity) {
					agg.highest_severity = summary.max_severity_level;
				}
			}
		});

		// Only show students with violations, sorted by severity then count
		return Array.from(studentMap.values())
			.filter((s) => s.total_violations > 0)
			.sort((a, b) => {
				if (b.highest_severity !== a.highest_severity) {
					return b.highest_severity - a.highest_severity;
				}
				return b.total_violations - a.total_violations;
			})
			.slice(0, 10); // Top 10 high-risk
	}, [attempts, violationSummaries]);

	// Overall statistics
	const overallStats = useMemo(() => {
		const totalAttempts = attempts.length;
		const attemptsWithViolations = Object.values(violationSummaries).filter(
			(s) => s.total_violations > 0
		).length;
		const totalViolations = Object.values(violationSummaries).reduce(
			(sum, s) => sum + s.total_violations,
			0
		);
		const criticalViolations = Object.values(violationSummaries).filter(
			(s) => s.max_severity_level >= Severity.CRITICAL
		).length;
		const cleanAttempts = totalAttempts - attemptsWithViolations;
		const cleanRate =
			totalAttempts > 0 ? Math.round((cleanAttempts / totalAttempts) * 100) : 100;

		return {
			totalAttempts,
			attemptsWithViolations,
			totalViolations,
			criticalViolations,
			cleanRate,
		};
	}, [attempts, violationSummaries]);

	const assessmentColumns: ColumnsType<AssessmentViolationSummary> = [
		{
			title: t('groupProctoring.assessment'),
			key: 'assessment',
			render: (_, record) => (
				<Space>
					<FileTextOutlined />
					<Text strong>{record.assessment_title}</Text>
				</Space>
			),
		},
		{
			title: t('groupProctoring.attempts'),
			key: 'attempts',
			width: 120,
			align: 'center',
			render: (_, record) => (
				<Tooltip
					title={`${record.attempts_with_violations}/${record.total_attempts} ${t('groupProctoring.withViolations')}`}
				>
					<Progress
						type="circle"
						size={50}
						percent={
							record.total_attempts > 0
								? Math.round(
										((record.total_attempts - record.attempts_with_violations) /
											record.total_attempts) *
											100
									)
								: 100
						}
						format={() =>
							`${record.total_attempts - record.attempts_with_violations}/${record.total_attempts}`
						}
						strokeColor={
							record.attempts_with_violations > 0
								? token.token.colorWarning
								: token.token.colorSuccess
						}
					/>
				</Tooltip>
			),
		},
		{
			title: t('groupProctoring.violations'),
			key: 'violations',
			width: 120,
			align: 'center',
			render: (_, record) => {
				if (record.total_violations === 0) {
					return <Tag color="success">{t('gradingList.clean')}</Tag>;
				}
				return (
					<Badge count={record.total_violations} overflowCount={999}>
						<Tag color={getSeverityColor(record.highest_severity)}>
							{t(
								`proctoring.severity.${getSeverityName(record.highest_severity).toLowerCase()}`
							)}
						</Tag>
					</Badge>
				);
			},
			sorter: (a, b) => a.total_violations - b.total_violations,
		},
		{
			title: t('groupProctoring.riskLevel'),
			key: 'risk',
			width: 150,
			align: 'center',
			render: (_, record) => {
				const riskScore =
					record.critical_count * 3 +
					record.high_count * 2 +
					record.total_violations * 0.1;
				let riskLabel = 'low';
				let riskColor = 'success';

				if (riskScore > 10) {
					riskLabel = 'critical';
					riskColor = 'error';
				} else if (riskScore > 5) {
					riskLabel = 'high';
					riskColor = 'warning';
				} else if (riskScore > 2) {
					riskLabel = 'medium';
					riskColor = 'orange';
				}

				return (
					<Tag
						color={riskColor}
						icon={riskScore > 5 ? <ExclamationCircleOutlined /> : <SafetyOutlined />}
					>
						{t(`groupProctoring.risk.${riskLabel}`)}
					</Tag>
				);
			},
		},
	];

	if (loading) {
		return (
			<div style={{ textAlign: 'center', padding: 48 }}>
				<Spin size="large" />
			</div>
		);
	}

	if (attempts.length === 0) {
		return (
			<Card style={{ ...elevation[0], borderRadius: 12 }}>
				<Empty
					description={t('groupProctoring.noAttempts')}
					image={Empty.PRESENTED_IMAGE_SIMPLE}
				/>
			</Card>
		);
	}

	return (
		<Space direction="vertical" size="large" style={{ width: '100%' }}>
			{/* Overall Statistics */}
			<Row gutter={[16, 16]}>
				<Col xs={12} sm={6}>
					<Card
						style={{ ...elevation[0], borderRadius: 12, background: cardColors.blue }}
					>
						<Statistic
							title={t('groupProctoring.totalAttempts')}
							value={overallStats.totalAttempts}
							prefix={<FileTextOutlined />}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={6}>
					<Card
						style={{ ...elevation[0], borderRadius: 12, background: cardColors.green }}
					>
						<Statistic
							title={t('groupProctoring.cleanRate')}
							value={overallStats.cleanRate}
							suffix="%"
							prefix={<SafetyOutlined />}
							valueStyle={{
								color:
									overallStats.cleanRate >= 80
										? token.token.colorSuccess
										: token.token.colorWarning,
							}}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={6}>
					<Card
						style={{ ...elevation[0], borderRadius: 12, background: cardColors.orange }}
					>
						<Statistic
							title={t('groupProctoring.totalViolations')}
							value={overallStats.totalViolations}
							prefix={<WarningOutlined />}
							valueStyle={{
								color:
									overallStats.totalViolations > 0
										? token.token.colorWarning
										: undefined,
							}}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={6}>
					<Card style={{ ...elevation[0], borderRadius: 12, background: cardColors.red }}>
						<Statistic
							title={t('groupProctoring.criticalAttempts')}
							value={overallStats.criticalViolations}
							prefix={<AlertOutlined />}
							valueStyle={{
								color:
									overallStats.criticalViolations > 0
										? token.token.colorError
										: undefined,
							}}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]}>
				{/* Assessment Breakdown */}
				<Col xs={24} lg={14}>
					<Card
						title={
							<Space>
								<FileTextOutlined />
								{t('groupProctoring.assessmentBreakdown')}
							</Space>
						}
						style={{ ...elevation[0], borderRadius: 12 }}
					>
						<Table
							columns={assessmentColumns}
							dataSource={assessmentSummaries}
							rowKey="assessment_id"
							pagination={false}
							size="middle"
						/>
					</Card>
				</Col>

				{/* High-Risk Students */}
				<Col xs={24} lg={10}>
					<Card
						title={
							<Space>
								<AlertOutlined style={{ color: token.token.colorError }} />
								{t('groupProctoring.highRiskStudents')}
							</Space>
						}
						style={{ ...elevation[0], borderRadius: 12 }}
					>
						{highRiskStudents.length === 0 ? (
							<Empty
								description={t('groupProctoring.noHighRiskStudents')}
								image={Empty.PRESENTED_IMAGE_SIMPLE}
							/>
						) : (
							<List
								dataSource={highRiskStudents}
								renderItem={(student) => (
									<List.Item
										actions={[
											<Tooltip
												key="view"
												title={t('groupProctoring.viewAttempts')}
											>
												<Button
													type="link"
													size="small"
													icon={<EyeOutlined />}
												/>
											</Tooltip>,
										]}
									>
										<List.Item.Meta
											avatar={
												<Badge
													count={student.total_violations}
													overflowCount={99}
													style={{
														backgroundColor: getSeverityColor(
															student.highest_severity
														),
													}}
												>
													<Avatar
														src={student.student_avatar}
														icon={<UserOutlined />}
													/>
												</Badge>
											}
											title={
												<Space>
													<Text strong>{student.student_name}</Text>
													<Tag
														color={getSeverityColor(
															student.highest_severity
														)}
														style={{ marginLeft: 8 }}
													>
														{t(
															`proctoring.severity.${getSeverityName(student.highest_severity).toLowerCase()}`
														)}
													</Tag>
												</Space>
											}
											description={
												<Text type="secondary" style={{ fontSize: 12 }}>
													{student.total_attempts}{' '}
													{t('groupProctoring.attemptsLabel')} •{' '}
													{student.total_violations}{' '}
													{t('groupProctoring.violationsLabel')}
												</Text>
											}
										/>
									</List.Item>
								)}
							/>
						)}
					</Card>
				</Col>
			</Row>
		</Space>
	);
};

export default GroupProctoringTab;
