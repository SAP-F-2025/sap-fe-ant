import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	ExclamationCircleOutlined,
	FileTextOutlined,
	HomeOutlined,
	HourglassOutlined,
	ReloadOutlined,
	TrophyOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
	Alert,
	Button,
	Card,
	Col,
	Collapse,
	Divider,
	Progress,
	Row,
	Space,
	Statistic,
	Table,
	Tag,
	theme,
	Tooltip,
	Typography,
} from 'antd';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import studentService from '../../services/studentService';
import violationService from '../../services/violationService';
import type { AttemptDetail, QuestionScore, StudentAnswer } from '../../types';

dayjs.extend(duration);

const { Title, Text, Paragraph } = Typography;

// Map violation type numbers to i18n keys and readable names
// Based on backend ViolationType constants (violationService.ts)
const VIOLATION_TYPE_NAMES: Record<number, string> = {
	0: 'faceNotDetected',     // ViolationFaceNotDetected
	1: 'multipleFaces',       // ViolationMultipleFaces
	2: 'lookingAway',         // ViolationLookingAway
	3: 'mouthOpen',           // ViolationMouthOpen
	4: 'handDetected',        // ViolationHandDetected
	5: 'headTurned',          // ViolationHeadTurnedAway
	6: 'copyPaste',           // ViolationCopyPaste
	7: 'tabSwitch',           // ViolationSwitchingTab
	8: 'fullscreenExit',      // ViolationFullScreen
	9: 'phoneDetected',       // ViolationPhoneDetect
	10: 'voice',              // ViolationVoice
	11: 'browserTamper',      // ViolationBrowserTamper
	12: 'voiceChat',          // ViolationVoiceChat
	13: 'faceMismatch',       // ViolationFaceMismatch
	14: 'eyesClosed',         // ViolationFailLivenessChallenge
};
const { Panel } = Collapse;

const AssessmentResults: React.FC = () => {
	const { attemptId } = useParams<{ attemptId: string }>();
	const navigate = useNavigate();
	const { user } = useAuth();
	const { token } = theme.useToken();
	const { t } = useTranslation();

	const { data: attempt, isLoading } = useQuery<AttemptDetail>({
		queryKey: ['attempt-detail', attemptId],
		queryFn: () => studentService.getAttemptDetails(Number(attemptId)),
		enabled: !!attemptId,
	});

	// Fetch violation summary for this attempt
	const { data: violationSummary, isLoading: isLoadingViolations } = useQuery({
		queryKey: ['violation-summary', attemptId],
		queryFn: () => violationService.getAttemptSummary(Number(attemptId)),
		enabled: !!attemptId,
		retry: false, // Don't retry if no violations found
	});

	// Fetch violation analytics for timeline
	const { data: violationAnalytics } = useQuery({
		queryKey: ['violation-analytics', attemptId],
		queryFn: () => violationService.getViolationAnalytics(Number(attemptId), '5m'),
		enabled: !!attemptId && !!violationSummary && violationSummary.total_violations > 0,
		retry: false,
	});

	if (isLoading) {
		return (
			<div style={{ padding: '24px' }}>
				<Card loading />
			</div>
		);
	}

	if (!attempt) {
		return (
			<div style={{ padding: '24px' }}>
				<Alert
					message={t('assessmentResults.notFound')}
					description={t('assessmentResults.notFoundDescription')}
					type="error"
					showIcon
				/>
			</div>
		);
	}

	// Check if user is teacher/admin (always see results)
	const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

	const score = attempt.score || 0;
	const percentage = attempt.percentage || 0;
	const maxScore = attempt.max_score || 100;
	const passed = attempt.passed || false;
	const totalQuestions = attempt.answers?.length || 0;
	const correctAnswers = attempt.answers?.filter((a: StudentAnswer) => a.is_correct).length || 0;
	const timeSpent =
		attempt.completed_at && attempt.started_at
			? dayjs(attempt.completed_at).diff(dayjs(attempt.started_at), 'second')
			: 0;

	// Check if score breakdown is available
	const hasScoreBreakdown = attempt.score_breakdown && attempt.score_breakdown.length > 0;

	// Check if there are any ungraded questions
	const isPendingGrading = attempt.is_pending_grade ?? false;

	// Count graded vs ungraded answers
	const gradedCount = attempt.answers?.filter((a: StudentAnswer) => a.is_graded).length || 0;
	const totalCount = attempt.answers?.length || 0;
	const ungradedCount = totalCount - gradedCount;

	const renderAnswerFeedback = (answer: StudentAnswer, questionNumber: number) => {
		// Use nested question from answer if available, otherwise try to find from attempt.questions
		const question =
			(answer as any).question ||
			attempt.questions?.find((q: any) => q.id === answer.question_id);

		if (!question) return null;

		// Check if this answer has been graded
		const isGraded = answer.is_graded ?? true; // Default to true for backward compatibility
		const hasCorrectStatus = answer.is_correct !== undefined && answer.is_correct !== null;
		const questionType = question.type;
		const questionContent = question.content;

		// Render student's answer based on question type
		const renderStudentAnswer = () => {
			if (!answer.answer)
				return <Text type="secondary">{t('assessmentResults.question.notAnswered')}</Text>;

			switch (questionType) {
				case 'multiple_choice':
					// Find the selected option(s)
					const selectedIds = Array.isArray(answer.answer)
						? answer.answer
						: [answer.answer];
					const selectedOptions =
						questionContent.options?.filter((opt: any) =>
							selectedIds.includes(opt.id)
						) || [];

					return (
						<Space direction="vertical" style={{ width: '100%' }}>
							{selectedOptions.map((opt: any) => (
								<div
									key={opt.id}
									style={{
										padding: '8px 12px',
										backgroundColor: token.colorInfoBg,
										border: `1px solid ${token.colorInfoBorder}`,
										borderRadius: '4px',
									}}
								>
									<Text strong>{opt.id}.</Text> {opt.text}
								</div>
							))}
						</Space>
					);

				case 'true_false':
					return (
						<Tag
							color={answer.answer === true ? 'blue' : 'orange'}
							style={{ fontSize: '14px', padding: '4px 12px' }}
						>
							{answer.answer === true
								? questionContent.true_label || t('assessmentResults.question.true')
								: questionContent.false_label ||
								t('assessmentResults.question.false')}
						</Tag>
					);

				case 'essay':
				case 'short_answer':
					return (
						<div
							style={{
								padding: '12px',
								backgroundColor: token.colorBgContainer,
								borderRadius: '4px',
								border: `1px solid ${token.colorBorder}`,
								whiteSpace: 'pre-wrap',
							}}
						>
							{answer.answer.toString()}
						</div>
					);

				case 'fill_blank':
					return (
						<div style={{ padding: '8px' }}>
							{typeof answer.answer === 'object'
								? Object.entries(answer.answer).map(
									([key, value]: [string, any]) => (
										<div key={key} style={{ marginBottom: '8px' }}>
											<Text strong>
												{t('assessmentResults.question.blank', { key })}
												:
											</Text>{' '}
											<Tag>{value}</Tag>
										</div>
									)
								)
								: answer.answer}
						</div>
					);

				default:
					return (
						<div
							style={{
								padding: '8px',
								backgroundColor: token.colorBgContainer,
								borderRadius: '4px',
								border: `1px solid ${token.colorBorder}`,
							}}
						>
							{typeof answer.answer === 'object'
								? JSON.stringify(answer.answer, null, 2)
								: answer.answer.toString()}
						</div>
					);
			}
		};

		// Render correct answer based on question type
		const renderCorrectAnswer = () => {
			switch (questionType) {
				case 'multiple_choice':
					const correctIds = questionContent.correct_answers || [];
					const correctOptions =
						questionContent.options?.filter((opt: any) =>
							correctIds.includes(opt.id)
						) || [];

					return (
						<Space direction="vertical" style={{ width: '100%' }}>
							{correctOptions.map((opt: any) => (
								<div
									key={opt.id}
									style={{
										padding: '8px 12px',
										backgroundColor: token.colorSuccessBg,
										border: `1px solid ${token.colorSuccessBorder}`,
										borderRadius: '4px',
									}}
								>
									<CheckCircleOutlined
										style={{
											color: token.colorSuccess,
											marginRight: '8px',
										}}
									/>
									<Text strong>{opt.id}.</Text> {opt.text}
								</div>
							))}
						</Space>
					);

				case 'true_false':
					const correctBool = questionContent.correct_answer;
					return (
						<Tag color="success" style={{ fontSize: '14px', padding: '4px 12px' }}>
							{correctBool === true
								? questionContent.true_label || t('assessmentResults.question.true')
								: questionContent.false_label ||
								t('assessmentResults.question.false')}
						</Tag>
					);

				case 'short_answer':
				case 'essay':
					if (
						questionContent.accepted_answers &&
						questionContent.accepted_answers.length > 0
					) {
						return (
							<div style={{ padding: '8px' }}>
								{questionContent.accepted_answers.map(
									(ans: string, idx: number) => (
										<Tag
											key={idx}
											color="success"
											style={{ marginBottom: '4px' }}
										>
											{ans}
										</Tag>
									)
								)}
							</div>
						);
					}
					return (
						<Text type="secondary">
							{t('assessmentResults.question.manualGrading')}
						</Text>
					);

				case 'fill_blank':
					if (questionContent.blanks) {
						return (
							<div style={{ padding: '8px' }}>
								{Object.entries(questionContent.blanks).map(
									([key, blank]: [string, any]) => (
										<div key={key} style={{ marginBottom: '8px' }}>
											<Text strong>
												{t('assessmentResults.question.blank', { key })}
											</Text>{' '}
											{blank.accepted_answers?.map(
												(ans: string, idx: number) => (
													<Tag key={idx} color="success">
														{ans}
													</Tag>
												)
											)}
										</div>
									)
								)}
							</div>
						);
					}
					return null;

				default:
					if (questionContent.correct_answers) {
						return <Text>{questionContent.correct_answers.join(', ')}</Text>;
					}
					return null;
			}
		};

		return (
			<Panel
				header={
					<Space>
						{hasCorrectStatus ? (
							<Tag color={answer.is_correct ? 'success' : 'error'}>
								{answer.is_correct ? (
									<CheckCircleOutlined />
								) : (
									<CloseCircleOutlined />
								)}
							</Tag>
						) : (
							<Tag color="warning">
								<HourglassOutlined />
							</Tag>
						)}
						<Text strong>
							{t('assessmentResults.questionN', {
								n: questionNumber,
							})}
						</Text>
						<Tag color="blue">
							{t(`assessmentResults.questionType.${questionType}`, {
								defaultValue: questionType,
							})}
						</Tag>
						{answer.score !== undefined && answer.max_score !== undefined && (
							<Text type="secondary">
								{t('assessmentResults.question.points', {
									score: answer.score,
									max: answer.max_score,
								})}
							</Text>
						)}
					</Space>
				}
				key={answer.id || answer.question_id}
			>
				<Space direction="vertical" style={{ width: '100%' }} size="middle">
					{/* Question Text */}
					<div>
						<Text strong style={{ fontSize: '16px' }}>
							{t('assessmentResults.question.text')}
						</Text>
						<Paragraph style={{ fontSize: '15px', marginTop: '8px' }}>
							{question.text}
						</Paragraph>
					</div>

					{/* Show all options for multiple choice */}
					{questionType === 'multiple_choice' && questionContent.options && (
						<div>
							<Text strong>{t('assessmentResults.question.options')}</Text>
							{!isGraded && (
								<Alert
									message={t('assessmentResults.question.pendingGrading')}
									type="warning"
									showIcon
									icon={<HourglassOutlined />}
									style={{
										marginTop: '8px',
										marginBottom: '8px',
									}}
									banner
								/>
							)}
							<Space direction="vertical" style={{ width: '100%', marginTop: '8px' }}>
								{questionContent.options.map((opt: any) => {
									const isStudentAnswer = Array.isArray(answer.answer)
										? answer.answer.includes(opt.id)
										: answer.answer === opt.id;
									const isCorrect = questionContent.correct_answers?.includes(
										opt.id
									);

									// If not graded, don't show correct answers
									const showCorrectness = isGraded;

									return (
										<div
											key={opt.id}
											style={{
												padding: '8px 12px',
												backgroundColor: isStudentAnswer
													? showCorrectness && isCorrect
														? token.colorSuccessBg
														: showCorrectness && !isCorrect
															? token.colorErrorBg
															: token.colorInfoBg
													: showCorrectness && isCorrect
														? token.colorSuccessBg
														: token.colorBgContainer,
												border: `1px solid ${isStudentAnswer
													? showCorrectness && isCorrect
														? token.colorSuccessBorder
														: showCorrectness && !isCorrect
															? token.colorErrorBorder
															: token.colorInfoBorder
													: showCorrectness && isCorrect
														? token.colorSuccessBorder
														: token.colorBorder
													}`,
												borderRadius: '4px',
											}}
										>
											<Space>
												{showCorrectness &&
													isStudentAnswer &&
													(isCorrect ? (
														<CheckCircleOutlined
															style={{
																color: '#52c41a',
															}}
														/>
													) : (
														<CloseCircleOutlined
															style={{
																color: '#ff4d4f',
															}}
														/>
													))}
												{showCorrectness &&
													!isStudentAnswer &&
													isCorrect && (
														<CheckCircleOutlined
															style={{
																color: '#52c41a',
															}}
														/>
													)}
												{!showCorrectness && isStudentAnswer && (
													<HourglassOutlined
														style={{
															color: '#1890ff',
														}}
													/>
												)}
												<Text strong>{opt.id}.</Text>
												<Text>{opt.text}</Text>
											</Space>
										</div>
									);
								})}
							</Space>
						</div>
					)}

					{/* Student Answer for non-multiple-choice */}
					{questionType !== 'multiple_choice' && (
						<div>
							<Text strong>{t('assessmentResults.question.yourAnswer')}</Text>
							{!isGraded && (
								<Alert
									message={t('assessmentResults.question.pendingGrading')}
									type="warning"
									showIcon
									icon={<HourglassOutlined />}
									style={{
										marginTop: '8px',
										marginBottom: '8px',
									}}
									banner
								/>
							)}
							<div style={{ marginTop: '8px' }}>{renderStudentAnswer()}</div>
						</div>
					)}

					{/* Correct Answer for non-multiple-choice - Only show if graded */}
					{questionType !== 'multiple_choice' && isGraded && renderCorrectAnswer() && (
						<div>
							<Text strong type="success">
								{t('assessmentResults.question.correctAnswer')}
							</Text>
							<div style={{ marginTop: '8px' }}>{renderCorrectAnswer()}</div>
						</div>
					)}

					{/* Explanation */}
					{question.explanation && (
						<div>
							<Text strong type="secondary">
								{t('assessmentResults.question.explanation')}
							</Text>
							<Paragraph type="secondary" style={{ marginTop: '8px' }}>
								{question.explanation}
							</Paragraph>
						</div>
					)}

					{/* Grader Feedback */}
					{answer.feedback && (
						<div>
							<Text strong>{t('assessmentResults.question.teacherFeedback')}</Text>
							<Alert
								message={answer.feedback}
								type={answer.is_correct ? 'success' : 'info'}
								showIcon
								style={{ marginTop: '8px' }}
							/>
						</div>
					)}
				</Space>
			</Panel>
		);
	};

	return (
		<div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
			{/* Header */}
			<Card>
				<Space direction="vertical" size="large" style={{ width: '100%' }}>
					<div style={{ textAlign: 'center' }}>
						{isPendingGrading ? (
							<HourglassOutlined
								style={{
									fontSize: '64px',
									color: '#faad14',
									marginBottom: '16px',
								}}
							/>
						) : passed ? (
							<CheckCircleOutlined
								style={{
									fontSize: '64px',
									color: '#52c41a',
									marginBottom: '16px',
								}}
							/>
						) : (
							<CloseCircleOutlined
								style={{
									fontSize: '64px',
									color: '#f5222d',
									marginBottom: '16px',
								}}
							/>
						)}
						<Title level={2} style={{ margin: 0 }}>
							{isPendingGrading
								? t('assessmentResults.pendingGrading')
								: passed
									? t('assessmentResults.congratulations')
									: t('assessmentResults.testCompleted')}
						</Title>
						<Text type="secondary" style={{ fontSize: '16px' }}>
							{attempt.assessment?.title}
						</Text>
					</div>

					<Divider />

					{/* Pending Grading Alert */}
					{isPendingGrading && ungradedCount > 0 && (
						<Alert
							message={t('assessmentResults.pendingGradingAlert', {
								ungraded: ungradedCount,
								total: totalCount,
							})}
							description={t('assessmentResults.pendingGradingDescription', {
								count: ungradedCount,
							})}
							type="warning"
							showIcon
							icon={<HourglassOutlined />}
							style={{ marginBottom: '16px' }}
						/>
					)}

					{/* Score Overview */}
					<Row gutter={[16, 16]}>
						<Col xs={24} sm={12} md={6}>
							<Card>
								<Statistic
									title={
										isPendingGrading
											? t('assessmentResults.scoreTempLabel')
											: t('assessmentResults.scoreLabel')
									}
									value={score}
									precision={1}
									suffix={`/ ${maxScore}`}
									prefix={
										isPendingGrading ? (
											<HourglassOutlined />
										) : (
											<TrophyOutlined />
										)
									}
									valueStyle={{
										color: isPendingGrading
											? '#faad14'
											: passed
												? '#52c41a'
												: '#f5222d',
										fontSize: '28px',
									}}
								/>
								<Progress
									percent={percentage}
									strokeColor={
										isPendingGrading
											? '#faad14'
											: passed
												? '#52c41a'
												: '#f5222d'
									}
									showInfo={true}
									format={(percent) => `${percent?.toFixed(1)}%`}
								/>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card>
								<Statistic
									title={t('assessmentResults.statusLabel')}
									value={
										isPendingGrading
											? t('assessmentResults.statusGrading')
											: passed
												? t('assessmentResults.statusPassed')
												: t('assessmentResults.statusFailed')
									}
									prefix={isPendingGrading ? <HourglassOutlined /> : undefined}
									valueStyle={{
										color: isPendingGrading
											? '#faad14'
											: passed
												? '#52c41a'
												: '#f5222d',
										fontSize: '24px',
									}}
								/>
								<Text type="secondary">
									{t('assessmentResults.passingScore', {
										score: attempt.assessment?.passing_score,
									})}
								</Text>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card>
								<Statistic
									title={t('assessmentResults.correctAnswers')}
									value={correctAnswers}
									suffix={`/ ${totalQuestions}`}
									prefix={<CheckCircleOutlined />}
									valueStyle={{ fontSize: '24px' }}
								/>
								<Text type="secondary">
									{t('assessmentResults.accuracy', {
										percent:
											totalQuestions > 0
												? ((correctAnswers / totalQuestions) * 100).toFixed(
													1
												)
												: 0,
									})}
								</Text>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card>
								<Statistic
									title={t('assessmentResults.timeSpent')}
									value={Math.floor(timeSpent / 60)}
									suffix={t('assessmentResults.minutes')}
									prefix={<ClockCircleOutlined />}
									valueStyle={{ fontSize: '24px' }}
								/>
								<Text type="secondary">
									{t('assessmentResults.timeLimit', {
										duration: attempt.assessment?.duration,
									})}
								</Text>
							</Card>
						</Col>
					</Row>

					{/* Status Alert - Only show if fully graded */}
					{!isPendingGrading && (
						<Alert
							message={
								passed
									? t('assessmentResults.passedAlert')
									: t('assessmentResults.failedAlert')
							}
							description={
								passed
									? t('assessmentResults.passedDescription', {
										percent: percentage.toFixed(1),
										passing: attempt.assessment?.passing_score,
									})
									: `${t('assessmentResults.failedDescription', { percent: percentage.toFixed(1), passing: attempt.assessment?.passing_score })} ${attempt.assessment?.max_attempts &&
										attempt.assessment.max_attempts > 1
										? t('assessmentResults.canRetake')
										: ''
									}`
							}
							type={passed ? 'success' : 'error'}
							showIcon
						/>
					)}
				</Space>
			</Card>

			{/* Violation Summary Card */}
			{violationSummary && violationSummary.total_violations > 0 && (
				<Card
					title={
						<Space>
							<WarningOutlined style={{ color: token.colorWarning }} />
							<Text strong>{t('assessmentResults.violations.title')}</Text>
						</Space>
					}
					style={{ marginTop: '24px' }}
				>
					<Space direction="vertical" style={{ width: '100%' }} size="large">
						{/* Summary Stats */}
						<Row gutter={[16, 16]}>
							<Col xs={24} sm={12} md={6}>
								<Card>
									<Statistic
										title={t('assessmentResults.violations.totalViolations')}
										value={violationSummary.total_violations}
										prefix={<ExclamationCircleOutlined />}
										valueStyle={{ color: token.colorWarning }}
									/>
								</Card>
							</Col>
							<Col xs={24} sm={12} md={6}>
								<Card>
									<Statistic
										title={t('assessmentResults.violations.severityLevel')}
										value={violationSummary.critical_count}
										suffix={`/ ${t('assessmentResults.violations.critical')}`}
										valueStyle={{ color: '#ff4d4f' }}
									/>
								</Card>
							</Col>
							<Col xs={24} sm={12} md={6}>
								<Card>
									<Statistic
										title={t('assessmentResults.violations.avgConfidence')}
										value={violationSummary.avg_confidence}
										precision={2}
										suffix="/ 1.00"
										valueStyle={{ fontSize: '24px' }}
									/>
								</Card>
							</Col>
							<Col xs={24} sm={12} md={6}>
								<Card>
									<Statistic
										title={t('assessmentResults.violations.prolongedViolations')}
										value={violationSummary.prolonged_violations_count}
										valueStyle={{ fontSize: '24px' }}
									/>
								</Card>
							</Col>
						</Row>

						{/* Severity Breakdown */}
						<div>
							<Text strong style={{ marginBottom: '8px', display: 'block' }}>
								{t('assessmentResults.violations.breakdownBySeverity')}
							</Text>
							<Row gutter={[8, 8]}>
								{violationSummary.critical_count > 0 && (
									<Col>
										<Tag color="error" style={{ fontSize: '14px', padding: '4px 12px' }}>
											{t('assessmentResults.violations.critical')}: {violationSummary.critical_count}
										</Tag>
									</Col>
								)}
								{violationSummary.high_count > 0 && (
									<Col>
										<Tag color="warning" style={{ fontSize: '14px', padding: '4px 12px' }}>
											{t('assessmentResults.violations.high')}: {violationSummary.high_count}
										</Tag>
									</Col>
								)}
								{violationSummary.medium_count > 0 && (
									<Col>
										<Tag color="default" style={{ fontSize: '14px', padding: '4px 12px' }}>
											{t('assessmentResults.violations.medium')}: {violationSummary.medium_count}
										</Tag>
									</Col>
								)}
								{violationSummary.low_count > 0 && (
									<Col>
										<Tag color="success" style={{ fontSize: '14px', padding: '4px 12px' }}>
											{t('assessmentResults.violations.low')}: {violationSummary.low_count}
										</Tag>
									</Col>
								)}
							</Row>
						</div>

						{/* Violation Type Breakdown */}
						{violationAnalytics && violationAnalytics.count_by_type && (
							<div>
								<Text strong style={{ marginBottom: '8px', display: 'block' }}>
									{t('assessmentResults.violations.breakdownByType')}
								</Text>
								<Row gutter={[8, 8]}>
									{Object.entries(violationAnalytics.count_by_type)
										.sort(([, a], [, b]) => (b as number) - (a as number))
										.map(([type, count]) => {
											// Parse type as number and get i18n key
											const typeNum = parseInt(type, 10);
											const typeKey = VIOLATION_TYPE_NAMES[typeNum] || 'default';
											const typeName = t(`proctoring.violations.${typeKey}`, { defaultValue: type.replace(/_/g, ' ') });
											return (
												<Col key={type}>
													<Tag color="blue" style={{ fontSize: '13px', padding: '3px 10px' }}>
														{typeName}: {count}
													</Tag>
												</Col>
											);
										})}
								</Row>
							</div>
						)}

						{/* Timeline Visualization */}
						{violationAnalytics && violationAnalytics.timeline && violationAnalytics.timeline.length > 0 && (
							<div>
								<Text strong style={{ marginBottom: '12px', display: 'block' }}>
									{t('assessmentResults.violations.timeline')}
								</Text>
								<div
									style={{
										background: token.colorBgContainer,
										border: `1px solid ${token.colorBorder}`,
										borderRadius: '8px',
										padding: '16px',
										maxHeight: '350px',
										overflowY: 'auto',
									}}
								>
									<Space direction="vertical" style={{ width: '100%' }} size="small">
										{violationAnalytics.timeline.map((point, idx) => {
											const maxCount = Math.max(
												...violationAnalytics.timeline.map((p) => p.violation_count)
											);
											const barWidth = Math.max((point.violation_count / maxCount) * 100, 5); // Min 5% for visibility

											// Color based on severity: red for high count, yellow for medium, green for low
											const getSeverityColor = () => {
												if (point.violation_count >= maxCount * 0.7) return { bg: '#ff4d4f', light: '#fff1f0' };
												if (point.violation_count >= maxCount * 0.4) return { bg: '#faad14', light: '#fffbe6' };
												return { bg: '#52c41a', light: '#f6ffed' };
											};
											const colors = getSeverityColor();

											// Determine severity level text
											const getSeverityLevel = () => {
												if (point.violation_count >= maxCount * 0.7) return t('assessmentResults.violations.critical');
												if (point.violation_count >= maxCount * 0.4) return t('assessmentResults.violations.high');
												if (point.violation_count >= maxCount * 0.2) return t('assessmentResults.violations.medium');
												return t('assessmentResults.violations.low');
											};

											// Format time range for this bucket
											const startTime = dayjs(point.bucket);
											const endTime = startTime.add(5, 'minute');
											const timeRange = `${startTime.format('HH:mm')} - ${endTime.format('HH:mm')}`;

											const tooltipContent = (
												<div style={{ minWidth: '200px' }}>
													<div style={{ fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '4px' }}>
														{timeRange}
													</div>
													<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
														<span>{t('assessmentResults.violations.totalViolations')}:</span>
														<span style={{ fontWeight: 'bold' }}>{point.violation_count}</span>
													</div>
													<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
														<span>{t('assessmentResults.violations.severityLevel')}:</span>
														<Tag color={colors.bg} style={{ margin: 0 }}>{getSeverityLevel()}</Tag>
													</div>
													<div style={{ display: 'flex', justifyContent: 'space-between' }}>
														<span>{t('assessmentResults.violations.critical')}:</span>
														<span>{point.critical_count}</span>
													</div>
												</div>
											);

											return (
												<Tooltip key={idx} title={tooltipContent} placement="right" color="rgba(0,0,0,0.85)">
													<div
														style={{
															padding: '8px 12px',
															borderRadius: '6px',
															background: colors.light,
															border: `1px solid ${colors.bg}20`,
															cursor: 'pointer',
															transition: 'all 0.2s ease',
														}}
														onMouseEnter={(e) => {
															e.currentTarget.style.transform = 'translateX(4px)';
															e.currentTarget.style.boxShadow = `0 2px 8px ${colors.bg}40`;
														}}
														onMouseLeave={(e) => {
															e.currentTarget.style.transform = 'translateX(0)';
															e.currentTarget.style.boxShadow = 'none';
														}}
													>
														<div
															style={{
																display: 'flex',
																alignItems: 'center',
																gap: '12px',
															}}
														>
															{/* Time label */}
															<Text
																style={{
																	minWidth: '100px',
																	fontSize: '12px',
																	fontFamily: 'monospace',
																	color: token.colorTextSecondary,
																}}
															>
																{timeRange}
															</Text>

															{/* Progress bar container */}
															<div style={{ flex: 1, position: 'relative', height: '24px' }}>
																{/* Background track */}
																<div
																	style={{
																		position: 'absolute',
																		width: '100%',
																		height: '100%',
																		backgroundColor: `${colors.bg}15`,
																		borderRadius: '4px',
																	}}
																/>
																{/* Filled bar */}
																<div
																	style={{
																		position: 'absolute',
																		width: `${barWidth}%`,
																		height: '100%',
																		background: `linear-gradient(90deg, ${colors.bg}80, ${colors.bg})`,
																		borderRadius: '4px',
																		transition: 'width 0.3s ease',
																		display: 'flex',
																		alignItems: 'center',
																		justifyContent: 'flex-end',
																		paddingRight: barWidth > 15 ? '8px' : '0',
																	}}
																>
																	{barWidth > 15 && (
																		<Text style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>
																			{point.violation_count}
																		</Text>
																	)}
																</div>
															</div>

															{/* Stats */}
															<div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '140px' }}>
																<Tag color={colors.bg} style={{ margin: 0, fontSize: '12px' }}>
																	{t('assessmentResults.violations.violationCount', { count: point.violation_count })}
																</Tag>
																{point.critical_count > 0 && (
																	<Tag color="error" style={{ margin: 0, fontSize: '11px' }}>
																		{t('assessmentResults.violations.critical')}: {point.critical_count}
																	</Tag>
																)}
															</div>
														</div>
													</div>
												</Tooltip>
											);
										})}
									</Space>
								</div>

								{/* Legend */}
								<div style={{ marginTop: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
									<Space size="small">
										<div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#ff4d4f' }} />
										<Text type="secondary" style={{ fontSize: '12px' }}>{t('assessmentResults.violations.critical')} (≥70%)</Text>
									</Space>
									<Space size="small">
										<div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#faad14' }} />
										<Text type="secondary" style={{ fontSize: '12px' }}>{t('assessmentResults.violations.high')} (40-70%)</Text>
									</Space>
									<Space size="small">
										<div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#52c41a' }} />
										<Text type="secondary" style={{ fontSize: '12px' }}>{t('assessmentResults.violations.low')} (&lt;40%)</Text>
									</Space>
								</div>
							</div>
						)}

						{/* Time Period */}
						{violationSummary.first_violation_at && (
							<div>
								<Text type="secondary">
									{t('assessmentResults.violations.timeRange', {
										start: dayjs(violationSummary.first_violation_at).format('HH:mm:ss'),
										end: dayjs(violationSummary.last_violation_at).format('HH:mm:ss'),
										duration: Math.floor(violationSummary.duration_seconds / 60)
									})}
								</Text>
							</div>
						)}
					</Space>
				</Card>
			)}

			{/* Score Breakdown */}
			{hasScoreBreakdown && (
				<Card
					title={
						<Space>
							<FileTextOutlined />
							<Text strong>{t('assessmentResults.scoreBreakdown')}</Text>
							{isPendingGrading && ungradedCount > 0 && (
								<Tag color="warning" icon={<HourglassOutlined />}>
									{t('assessmentResults.gradedProgress', {
										graded: gradedCount,
										total: totalCount,
									})}
								</Tag>
							)}
						</Space>
					}
					style={{ marginTop: '24px' }}
				>
					<Table<QuestionScore>
						dataSource={attempt.score_breakdown || []}
						rowKey="question_id"
						pagination={false}
						columns={[
							{
								title: t('assessmentResults.questionNumber'),
								key: 'question_number',
								render: (_, record, index) =>
									t('assessmentResults.questionN', {
										n: index + 1,
									}),
								width: 100,
							},
							{
								title: t('assessmentResults.score'),
								key: 'score',
								render: (_, record) => (
									<Space>
										<Text strong>
											{record.score.toFixed(1)} / {record.max_score}
										</Text>
										{record.partial_credit && (
											<Tag color="warning">
												{t('assessmentResults.partialCredit')}
											</Tag>
										)}
									</Space>
								),
								width: 200,
							},
							{
								title: t('assessmentResults.statusLabel'),
								key: 'status',
								align: 'center',
								render: (_, record) => {
									if (record.is_correct === true) {
										return (
											<Tag icon={<CheckCircleOutlined />} color="success">
												{t('assessmentResults.statusCorrect')}
											</Tag>
										);
									} else if (record.is_correct === false) {
										return (
											<Tag icon={<CloseCircleOutlined />} color="error">
												{t('assessmentResults.statusWrong')}
											</Tag>
										);
									} else {
										return (
											<Tag icon={<HourglassOutlined />} color="warning">
												{t('assessmentResults.statusPending')}
											</Tag>
										);
									}
								},
								width: 150,
							},
							{
								title: t('assessmentResults.progress'),
								key: 'progress',
								render: (_, record) => {
									const percent = (record.score / record.max_score) * 100;
									return (
										<Progress
											percent={percent}
											size="small"
											strokeColor={
												record.is_correct === true
													? '#52c41a'
													: record.is_correct === false
														? '#f5222d'
														: '#faad14'
											}
											format={(p) => `${p?.toFixed(0)}%`}
										/>
									);
								},
							},
						]}
					/>
				</Card>
			)}

			{/* Detailed Feedback */}
			{attempt.answers && attempt.answers.length > 0 && (
				<Card
					title={
						<Space>
							<FileTextOutlined />
							<Text strong>{t('assessmentResults.answerDetails')}</Text>
							{isPendingGrading && ungradedCount > 0 && (
								<Tag color="warning" icon={<HourglassOutlined />}>
									{t('assessmentResults.gradedProgress', {
										graded: gradedCount,
										total: totalCount,
									})}
								</Tag>
							)}
						</Space>
					}
					style={{ marginTop: '24px' }}
				>
					<Collapse accordion>
						{attempt.answers.map((answer, index) =>
							renderAnswerFeedback(answer, index + 1)
						)}
					</Collapse>
				</Card>
			)}

			{/* Actions */}
			<Card style={{ marginTop: '24px' }}>
				<Space size="middle" wrap>
					<Button
						type="primary"
						icon={<HomeOutlined />}
						onClick={() => navigate('/student/dashboard')}
					>
						{t('assessmentResults.goHome')}
					</Button>
					<Button
						icon={<FileTextOutlined />}
						onClick={() => navigate('/student/history')}
					>
						{t('assessmentResults.viewHistory')}
					</Button>
					{/* Show retake button if max_attempts > 1 (backend validates actual attempts left) */}
					{attempt.assessment?.max_attempts &&
						attempt.assessment.max_attempts > 1 &&
						!passed && (
							<Button
								icon={<ReloadOutlined />}
								onClick={() =>
									navigate(`/student/assessments/${attempt.assessment_id}`)
								}
							>
								{t('assessmentResults.retake')}
							</Button>
						)}
				</Space>
			</Card>

			{/* Additional Info */}
			<Card title={t('assessmentResults.assessmentInfo')} style={{ marginTop: '24px' }}>
				<Row gutter={[16, 16]}>
					<Col span={12}>
						<Text type="secondary">{t('assessmentResults.startedAt')}</Text>
						<div>
							<Text strong>
								{dayjs(attempt.started_at).format('DD/MM/YYYY HH:mm')}
							</Text>
						</div>
					</Col>
					<Col span={12}>
						<Text type="secondary">{t('assessmentResults.completedAt')}</Text>
						<div>
							<Text strong>
								{attempt.completed_at
									? dayjs(attempt.completed_at).format('DD/MM/YYYY HH:mm')
									: 'N/A'}
							</Text>
						</div>
					</Col>
				</Row>
			</Card>
		</div>
	);
};

export default AssessmentResults;
