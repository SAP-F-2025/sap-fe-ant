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
							<Text strong>Vi phạm giám sát</Text>
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
										title="Tổng vi phạm"
										value={violationSummary.total_violations}
										prefix={<ExclamationCircleOutlined />}
										valueStyle={{ color: token.colorWarning }}
									/>
								</Card>
							</Col>
							<Col xs={24} sm={12} md={6}>
								<Card>
									<Statistic
										title="Mức nghiêm trọng"
										value={violationSummary.critical_count}
										suffix="/ Critical"
										valueStyle={{ color: '#ff4d4f' }}
									/>
								</Card>
							</Col>
							<Col xs={24} sm={12} md={6}>
								<Card>
									<Statistic
										title="Độ tin cậy TB"
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
										title="Vi phạm kéo dài"
										value={violationSummary.prolonged_violations_count}
										valueStyle={{ fontSize: '24px' }}
									/>
								</Card>
							</Col>
						</Row>

						{/* Severity Breakdown */}
						<div>
							<Text strong style={{ marginBottom: '8px', display: 'block' }}>
								Phân loại theo mức độ
							</Text>
							<Row gutter={[8, 8]}>
								{violationSummary.critical_count > 0 && (
									<Col>
										<Tag color="error" style={{ fontSize: '14px', padding: '4px 12px' }}>
											Nghiêm trọng: {violationSummary.critical_count}
										</Tag>
									</Col>
								)}
								{violationSummary.high_count > 0 && (
									<Col>
										<Tag color="warning" style={{ fontSize: '14px', padding: '4px 12px' }}>
											Cao: {violationSummary.high_count}
										</Tag>
									</Col>
								)}
								{violationSummary.medium_count > 0 && (
									<Col>
										<Tag color="default" style={{ fontSize: '14px', padding: '4px 12px' }}>
											Trung bình: {violationSummary.medium_count}
										</Tag>
									</Col>
								)}
								{violationSummary.low_count > 0 && (
									<Col>
										<Tag color="success" style={{ fontSize: '14px', padding: '4px 12px' }}>
											Thấp: {violationSummary.low_count}
										</Tag>
									</Col>
								)}
							</Row>
						</div>

						{/* Violation Type Breakdown */}
						{violationAnalytics && violationAnalytics.count_by_type && (
							<div>
								<Text strong style={{ marginBottom: '8px', display: 'block' }}>
									Phân loại theo loại vi phạm
								</Text>
								<Row gutter={[8, 8]}>
									{Object.entries(violationAnalytics.count_by_type)
										.sort(([, a], [, b]) => (b as number) - (a as number))
										.map(([type, count]) => (
											<Col key={type}>
												<Tag color="blue" style={{ fontSize: '13px', padding: '3px 10px' }}>
													{type.replace(/_/g, ' ')}: {count}
												</Tag>
											</Col>
										))}
								</Row>
							</div>
						)}

						{/* Timeline Visualization */}
						{violationAnalytics && violationAnalytics.timeline && violationAnalytics.timeline.length > 0 && (
							<div>
								<Text strong style={{ marginBottom: '12px', display: 'block' }}>
									Timeline vi phạm (theo khoảng 5 phút)
								</Text>
								<div
									style={{
										background: token.colorBgContainer,
										border: `1px solid ${token.colorBorder}`,
										borderRadius: '8px',
										padding: '16px',
										maxHeight: '300px',
										overflowY: 'auto',
									}}
								>
									<Space direction="vertical" style={{ width: '100%' }} size="small">
										{violationAnalytics.timeline.map((point, idx) => {
											const maxCount = Math.max(
												...violationAnalytics.timeline.map((p) => p.count)
											);
											const barWidth = (point.count / maxCount) * 100;
											const barColor =
												point.count >= maxCount * 0.7
													? '#ff4d4f'
													: point.count >= maxCount * 0.4
														? '#faad14'
														: '#52c41a';

											return (
												<div key={idx} style={{ marginBottom: '8px' }}>
													<div
														style={{
															display: 'flex',
															alignItems: 'center',
															gap: '12px',
														}}
													>
														<Text
															type="secondary"
															style={{
																minWidth: '80px',
																fontSize: '12px',
																fontFamily: 'monospace',
															}}
														>
															{dayjs(point.timestamp).format('HH:mm:ss')}
														</Text>
														<div
															style={{
																flex: 1,
																position: 'relative',
															}}
														>
															<div
																style={{
																	width: `${barWidth}%`,
																	height: '24px',
																	backgroundColor: barColor,
																	borderRadius: '4px',
																	transition: 'width 0.3s ease',
																}}
															/>
														</div>
														<div
															style={{
																display: 'flex',
																gap: '12px',
																alignItems: 'center',
															}}
														>
															<Tag color={barColor} style={{ margin: 0 }}>
																{point.count} vi phạm
															</Tag>
															<Text type="secondary" style={{ fontSize: '12px' }}>
																Độ tin cậy: {point.avg_confidence?.toFixed(2) ?? 'N/A'}
															</Text>
														</div>
													</div>
												</div>
											);
										})}
									</Space>
								</div>
							</div>
						)}

						{/* Time Period */}
						{violationSummary.first_violation_at && (
							<div>
								<Text type="secondary">
									Thời gian: {dayjs(violationSummary.first_violation_at).format('HH:mm:ss')}{' '}
									- {dayjs(violationSummary.last_violation_at).format('HH:mm:ss')}{' '}
									({Math.floor(violationSummary.duration_seconds / 60)} phút)
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
