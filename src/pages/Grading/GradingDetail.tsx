import {
	ArrowLeftOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	ExclamationCircleOutlined,
	EyeOutlined,
	FileTextOutlined,
	FlagOutlined,
	SaveOutlined,
	ThunderboltOutlined,
	TrophyOutlined,
	UserOutlined,
} from '@ant-design/icons';
import {
	Alert,
	App,
	Avatar,
	Badge,
	Button,
	Card,
	Col,
	Collapse,
	Descriptions,
	Divider,
	Empty,
	Flex,
	Input,
	InputNumber,
	message,
	Progress,
	Row,
	Space,
	Spin,
	Statistic,
	Tag,
	theme,
	Tooltip,
	Typography
} from 'antd';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { gradingService, type AttemptDetailResponse, type StudentAnswerDetail } from '../../services/gradingService';
import { elevation } from '../../styles/elevation';
import { QuestionType } from '../../types';

dayjs.extend(duration);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface AnswerGrade {
	score: number;
	feedback: string;
}

const GradingDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { modal } = App.useApp();
	const { token } = theme.useToken();
	const { t } = useTranslation();

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [autoGrading, setAutoGrading] = useState(false);
	const [generatingFeedback, setGeneratingFeedback] = useState(false);
	const [attempt, setAttempt] = useState<AttemptDetailResponse | null>(null);
	const [grades, setGrades] = useState<Map<number, AnswerGrade>>(new Map());
	const [expandedAnswers, setExpandedAnswers] = useState<string[]>([]);
	const [overallFeedback, setOverallFeedback] = useState('');
	const [finalScore, setFinalScore] = useState<number | undefined>(undefined);

	useEffect(() => {
		if (id) {
			fetchAttemptDetail(parseInt(id));
		}
	}, [id]);

	const fetchAttemptDetail = async (attemptId: number) => {
		try {
			setLoading(true);
			const data = await gradingService.getAttemptDetail(attemptId);
			setAttempt(data);

			// Initialize grades from existing scores
			const initialGrades = new Map<number, AnswerGrade>();
			data.answers.forEach(answer => {
				if (answer.is_graded) {
					initialGrades.set(answer.id, {
						score: answer.score || 0,
						feedback: answer.feedback || '',
					});
				}
			});
			setGrades(initialGrades);
		} catch (error) {
			message.error(t('gradingDetail.loadError'));
			navigate('/grading');
		} finally {
			setLoading(false);
		}
	};

	const handleGradeChange = (answerId: number, field: 'score' | 'feedback', value: number | string) => {
		const currentGrade = grades.get(answerId) || { score: 0, feedback: '' };
		setGrades(new Map(grades.set(answerId, {
			...currentGrade,
			[field]: value,
		})));
	};

	const handleSaveGrades = async () => {
		if (!attempt) return;

		const gradesToSubmit = Array.from(grades.entries()).map(([answerId, grade]) => ({
			answer_id: answerId,
			score: grade.score,
			feedback: grade.feedback,
		}));

		if (gradesToSubmit.length === 0) {
			message.warning(t('gradingDetail.gradeAtLeastOne'));
			return;
		}

		try {
			setSaving(true);
			await gradingService.batchGradeAnswers({ grades: gradesToSubmit });
			message.success(t('gradingDetail.saveGradesSuccess'));

			// Reload attempt to get updated data
			if (id) {
				await fetchAttemptDetail(parseInt(id));
			}
		} catch (error) {
			message.error(t('gradingDetail.saveGradesError'));
		} finally {
			setSaving(false);
		}
	};

	const handleAutoGrade = () => {
		if (!attempt) {
			message.error(t('gradingDetail.attemptNotFound'));
			return;
		}

		modal.confirm({
			title: t('gradingDetail.autoGradeTitle'),
			icon: <ThunderboltOutlined />,
			content: t('gradingDetail.autoGradeConfirm'),
			okText: t('gradingDetail.autoGradeBtn'),
			cancelText: t('common.cancel'),
			onOk: async () => {
				try {
					setAutoGrading(true);
					const result = await gradingService.autoGradeAttempt(attempt.id);
					message.success(
						t('gradingDetail.autoGradeSuccess', { graded: result.graded_answers, manual: result.pending_manual_grading })
					);

					// Reload attempt
					if (id) {
						await fetchAttemptDetail(parseInt(id));
					}
				} catch (error) {
					message.error(t('gradingDetail.autoGradeError'));
					console.error('Auto grade error:', error);
				} finally {
					setAutoGrading(false);
				}
			},
		});
	};

	const handleAutoGradeAnswer = async (answerId: number) => {
		try {
			const result = await gradingService.autoGradeAnswer(answerId);

			// Update grades map
			setGrades(new Map(grades.set(answerId, {
				score: result.score,
				feedback: result.feedback || '',
			})));

			message.success(t('gradingDetail.autoGradeAnswerSuccess', { score: result.score }));
		} catch (error) {
			message.error(t('gradingDetail.autoGradeAnswerError'));
		}
	};

	const handleGenerateFeedback = async () => {
		if (!attempt) return;

		try {
			setGeneratingFeedback(true);
			const result = await gradingService.generateFeedback({
				attempt_id: attempt.id,
				feedback_type: 'detailed',
				include_suggestions: true,
			});

			setOverallFeedback(result.feedback);

			modal.info({
				title: t('gradingDetail.aiFeedbackTitle'),
				width: 600,
				content: (
					<Space direction="vertical" style={{ width: '100%' }}>
						<div>
							<Text strong>{t('gradingDetail.aiFeedbackGeneral')}</Text>
							<Paragraph>{result.feedback}</Paragraph>
						</div>

						{result.strengths && result.strengths.length > 0 && (
							<div>
								<Text strong style={{ color: '#52c41a' }}>{t('gradingDetail.aiFeedbackStrengths')}</Text>
								<ul>
									{result.strengths.map((s, i) => <li key={i}>{s}</li>)}
								</ul>
							</div>
						)}

						{result.weaknesses && result.weaknesses.length > 0 && (
							<div>
								<Text strong style={{ color: '#ff4d4f' }}>{t('gradingDetail.aiFeedbackWeaknesses')}</Text>
								<ul>
									{result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
								</ul>
							</div>
						)}

						{result.suggestions && result.suggestions.length > 0 && (
							<div>
								<Text strong style={{ color: '#1890ff' }}>{t('gradingDetail.aiFeedbackSuggestions')}</Text>
								<ul>
									{result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
								</ul>
							</div>
						)}
					</Space>
				),
			});
		} catch (error) {
			message.error(t('gradingDetail.generateFeedbackError'));
		} finally {
			setGeneratingFeedback(false);
		}
	};

	const handleSaveOverallGrade = async () => {
		if (!attempt) return;

		try {
			setSaving(true);
			await gradingService.gradeAttempt(attempt.id, {
				final_score: finalScore,
				feedback: overallFeedback,
			});

			message.success(t('gradingDetail.saveOverallSuccess'));

			// Reload attempt
			if (id) {
				await fetchAttemptDetail(parseInt(id));
			}
		} catch (error) {
			message.error(t('gradingDetail.saveOverallError'));
		} finally {
			setSaving(false);
		}
	};

	const handleRegradeQuestion = async (questionId: number) => {
		modal.confirm({
			title: t('gradingDetail.regradeTitle'),
			icon: <ExclamationCircleOutlined />,
			content: t('gradingDetail.regradeConfirm'),
			okText: t('gradingDetail.regradeBtn'),
			cancelText: t('common.cancel'),
			onOk: async () => {
				try {
					setLoading(true);
					const result = await gradingService.regradeQuestion(questionId, {
						reason: t('gradingDetail.regradeReason'),
					});

					message.success(t('gradingDetail.regradeSuccess', { count: result.affected_answers }));

					// Reload attempt
					if (id) {
						await fetchAttemptDetail(parseInt(id));
					}
				} catch (error) {
					message.error(t('gradingDetail.regradeError'));
					console.error('Regrade error:', error);
				} finally {
					setLoading(false);
				}
			},
		});
	};

	const getStatusColor = (status: string) => {
		const statusMap: Record<string, string> = {
			completed: 'success',
			in_progress: 'processing',
			abandoned: 'default',
			timeout: 'error',
		};
		return statusMap[status] || 'default';
	};

	const getQuestionTypeLabel = (type: string) => {
		const typeMap: Record<string, string> = {
			multiple_choice: t('gradingDetail.questionType.multipleChoice'),
			true_false: t('gradingDetail.questionType.trueFalse'),
			essay: t('gradingDetail.questionType.essay'),
			fill_blank: t('gradingDetail.questionType.fillBlank'),
			matching: t('gradingDetail.questionType.matching'),
			ordering: t('gradingDetail.questionType.ordering'),
			short_answer: t('gradingDetail.questionType.shortAnswer'),
		};
		return typeMap[type] || type;
	};

	const calculateTotalScore = () => {
		if (!attempt) return 0;
		return attempt.answers.reduce((total, answer) => {
			const grade = grades.get(answer.id);
			return total + (grade?.score ?? answer.score ?? 0);
		}, 0);
	};

	const calculateMaxScore = () => {
		if (!attempt) return 0;
		return attempt.answers.reduce((total, answer) => total + answer.max_score, 0);
	};

	const calculateProgress = () => {
		if (!attempt || attempt.answers.length === 0) return 0;
		const gradedCount = attempt.answers.filter(a => a.is_graded || grades.has(a.id)).length;
		return (gradedCount / attempt.answers.length) * 100;
	};

	const renderAnswerContent = (answer: StudentAnswerDetail) => {
		const question = answer.question;
		if (!question) return <Text type="secondary">{t('gradingDetail.noQuestionData')}</Text>;

		// Render based on question type
		switch (question.type) {
			case QuestionType.MultipleChoice:
				const selectedOptions = Array.isArray(answer.answer) ? answer.answer : [answer.answer];
				return (
					<Space direction="vertical" style={{ width: '100%' }}>
						{question.content.options?.map((option: any) => {
							const isSelected = selectedOptions.includes(option.id);
							const isCorrect = question.content.correct_answers?.includes(option.id);
							return (
								<div key={option.id} style={{
									padding: '8px 12px',
									borderRadius: 8,
									border: `1px solid ${isSelected ? (isCorrect ? token.colorSuccessBorder : token.colorErrorBorder) : token.colorBorder}`,
									backgroundColor: isSelected ? (isCorrect ? token.colorSuccessBg : token.colorErrorBg) : 'transparent',
								}}>
									<Space>
										{isSelected && (isCorrect ?
											<CheckCircleOutlined style={{ color: token.colorSuccess }} /> :
											<CloseCircleOutlined style={{ color: token.colorError }} />
										)}
										{option.image_url && (
											<img
												src={option.image_url}
												alt={option.text}
												style={{ maxWidth: '150px', maxHeight: '100px', marginRight: '8px' }}
											/>
										)}
										<Text>{option.text}</Text>
									</Space>
								</div>
							);
						})}
					</Space>
				);

			case QuestionType.TrueFalse:
				const studentAnswer = answer.answer; // boolean
				const correctAnswer = question.content?.correct_answer; // boolean
				const trueLabel = question.content?.true_label || t('gradingDetail.trueFalse.defaultTrue');
				const falseLabel = question.content?.false_label || t('gradingDetail.trueFalse.defaultFalse');
				const isAnswerCorrect = studentAnswer === correctAnswer;

				return (
					<Space direction="vertical" style={{ width: '100%' }}>
						{/* True option */}
						<div style={{
							padding: '8px 12px',
							borderRadius: 8,
							border: `1px solid ${studentAnswer === true ? (correctAnswer === true ? token.colorSuccessBorder : token.colorErrorBorder) : token.colorBorder}`,
							backgroundColor: studentAnswer === true ? (correctAnswer === true ? token.colorSuccessBg : token.colorErrorBg) : 'transparent',
						}}>
							<Space>
								{studentAnswer === true && (correctAnswer === true ?
									<CheckCircleOutlined style={{ color: token.colorSuccess }} /> :
									<CloseCircleOutlined style={{ color: token.colorError }} />
								)}
								{correctAnswer === true && studentAnswer !== true && (
									<Tag color="success">{t('gradingDetail.trueFalse.correctAnswer')}</Tag>
								)}
								<Text>{trueLabel}</Text>
							</Space>
						</div>

						{/* False option */}
						<div style={{
							padding: '8px 12px',
							borderRadius: 8,
							border: `1px solid ${studentAnswer === false ? (correctAnswer === false ? token.colorSuccessBorder : token.colorErrorBorder) : token.colorBorder}`,
							backgroundColor: studentAnswer === false ? (correctAnswer === false ? token.colorSuccessBg : token.colorErrorBg) : 'transparent',
						}}>
							<Space>
								{studentAnswer === false && (correctAnswer === false ?
									<CheckCircleOutlined style={{ color: token.colorSuccess }} /> :
									<CloseCircleOutlined style={{ color: token.colorError }} />
								)}
								{correctAnswer === false && studentAnswer !== false && (
									<Tag color="success">{t('gradingDetail.trueFalse.correctAnswer')}</Tag>
								)}
								<Text>{falseLabel}</Text>
							</Space>
						</div>

						{/* Summary */}
						<Alert
							message={isAnswerCorrect ? t('gradingDetail.trueFalse.answerCorrect') : t('gradingDetail.trueFalse.answerIncorrect')}
							type={isAnswerCorrect ? 'success' : 'error'}
							showIcon
						/>
					</Space>
				);

			case QuestionType.Essay:
				const essayAnswer = answer.answer || '';
				const essayWordCount = essayAnswer.trim().split(/\s+/).filter(Boolean).length;
				const essayMinWords = question.content?.min_words;
				const essayMaxWords = question.content?.max_words;
				const rubricCriteria = question.content?.rubric_criteria || [];
				const sampleAnswer = question.content?.sample_answer;
				const keyWords = question.content?.key_words || [];
				const autoGrade = question.content?.auto_grade;

				// Check key words presence
				const foundKeyWords = keyWords.filter((keyword: string) =>
					essayAnswer.toLowerCase().includes(keyword.toLowerCase())
				);

				return (
					<Space direction="vertical" style={{ width: '100%' }} size="middle">
						{/* Student Answer */}
						<Card title={t('gradingDetail.essay.studentAnswer')} size="small">
							<Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
								{essayAnswer || <Text type="secondary">{t('gradingDetail.essay.noAnswer')}</Text>}
							</Paragraph>
						</Card>

						{/* Word Count Analysis */}
						<Card title={t('gradingDetail.essay.wordCountAnalysis')} size="small" style={{ backgroundColor: token.colorBgLayout }}>
							<Space split={<span>|</span>}>
								<Text>
									<strong>{t('gradingDetail.essay.wordCount')}:</strong>{' '}
									<Tag color={
										(essayMinWords && essayWordCount < essayMinWords) ||
											(essayMaxWords && essayWordCount > essayMaxWords)
											? 'warning'
											: 'success'
									}>
										{essayWordCount}
									</Tag>
								</Text>
								{essayMinWords && (
									<Text type={essayWordCount < essayMinWords ? 'danger' : 'secondary'}>
										{t('gradingDetail.essay.minRequired')}: {essayMinWords}
									</Text>
								)}
								{essayMaxWords && (
									<Text type={essayWordCount > essayMaxWords ? 'danger' : 'secondary'}>
										{t('gradingDetail.essay.maxRequired')}: {essayMaxWords}
									</Text>
								)}
							</Space>
						</Card>

						{/* Rubric Criteria */}
						{rubricCriteria.length > 0 && (
							<Card title={t('gradingDetail.essay.rubricCriteria')} size="small" style={{ backgroundColor: token.colorBgLayout }}>
								<Space direction="vertical" style={{ width: '100%' }}>
									{rubricCriteria.map((criterion: string, idx: number) => (
										<div key={idx} style={{ padding: '8px', borderLeft: `3px solid ${token.colorPrimary}`, paddingLeft: '12px' }}>
											<Text>• {criterion}</Text>
										</div>
									))}
								</Space>
							</Card>
						)}

						{/* Auto Grade Analysis */}
						{autoGrade && keyWords.length > 0 && (
							<Card
								title={t('gradingDetail.essay.autoGradeAnalysis')}
								size="small"
								style={{ backgroundColor: token.colorWarningBg, border: `1px solid ${token.colorWarningBorder}` }}
							>
								<Space direction="vertical" style={{ width: '100%' }}>
									<div>
										<Text strong>{t('gradingDetail.essay.keywordsFound')}: </Text>
										<Tag color="success">{foundKeyWords.length}/{keyWords.length}</Tag>
									</div>
									<div>
										<Space wrap>
											{keyWords.map((keyword: string, idx: number) => {
												const found = foundKeyWords.includes(keyword);
												return (
													<Tag key={idx} color={found ? 'success' : 'default'}>
														{found && <CheckCircleOutlined style={{ marginRight: '4px' }} />}
														{keyword}
													</Tag>
												);
											})}
										</Space>
									</div>
									<Alert
										message={t('gradingDetail.essay.note')}
										description={t('gradingDetail.essay.autoGradeNote')}
										type="warning"
										showIcon
									/>
								</Space>
							</Card>
						)}

						{/* Sample Answer */}
						{sampleAnswer && (
							<Card
								title={t('gradingDetail.essay.sampleAnswer')}
								size="small"
								style={{ backgroundColor: token.colorSuccessBg, border: `1px solid ${token.colorSuccessBorder}` }}
							>
								<Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
									{sampleAnswer}
								</Paragraph>
							</Card>
						)}
					</Space>
				);

			case QuestionType.ShortAnswer:
				if (question.content?.accepted_answers) {
					const { accepted_answers, case_sensitive, exact_match, fuzzy_matching } = question.content;
					const studentAnswer = answer.answer || '';

					// Check if answer is correct
					const isCorrect = accepted_answers.some((acceptedAns: string) => {
						if (case_sensitive) {
							return acceptedAns === studentAnswer;
						}
						return acceptedAns.toLowerCase() === studentAnswer.toLowerCase();
					});

					return (
						<Space direction="vertical" style={{ width: '100%' }} size="middle">
							{/* Student Answer */}
							<Card
								size="small"
								style={{
									backgroundColor: isCorrect ? token.colorSuccessBg : token.colorErrorBg,
									border: `2px solid ${isCorrect ? token.colorSuccessBorder : token.colorErrorBorder}`
								}}
							>
								<Space direction="vertical" style={{ width: '100%' }}>
									<div>
										<Text strong>{t('gradingDetail.shortAnswer.studentAnswer')}: </Text>
										{isCorrect ? (
											<CheckCircleOutlined style={{ color: token.colorSuccess, marginLeft: '8px' }} />
										) : (
											<CloseCircleOutlined style={{ color: token.colorError, marginLeft: '8px' }} />
										)}
									</div>
									<Tag color={isCorrect ? 'success' : 'error'} style={{ fontSize: '14px', padding: '4px 12px' }}>
										{studentAnswer || t('gradingDetail.shortAnswer.noAnswer')}
									</Tag>
								</Space>
							</Card>

							{/* Accepted Answers */}
							<Card size="small" title={t('gradingDetail.shortAnswer.acceptedAnswers')} style={{ backgroundColor: token.colorBgLayout }}>
								<Space wrap>
									{accepted_answers.map((ans: string, idx: number) => (
										<Tag key={idx} color="green">
											{ans}
										</Tag>
									))}
								</Space>
							</Card>

							{/* Matching Settings Info */}
							<Card size="small" title={t('gradingDetail.shortAnswer.matchingSettings')} style={{ backgroundColor: token.colorBgLayout }}>
								<Space direction="vertical">
									<Text>
										<strong>{t('gradingDetail.shortAnswer.caseSensitive')}:</strong> {case_sensitive ? t('common.yes') : t('common.no')}
									</Text>
									<Text>
										<strong>{t('gradingDetail.shortAnswer.exactMatch')}:</strong> {exact_match ? t('common.yes') : t('common.no')}
									</Text>
									<Text>
										<strong>{t('gradingDetail.shortAnswer.fuzzyMatching')}:</strong> {fuzzy_matching ? t('common.yes') : t('common.no')}
									</Text>
								</Space>
							</Card>
						</Space>
					);
				}

				// Fallback
				return (
					<Card size="small" style={{ backgroundColor: token.colorBgLayout }}>
						<Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
							{answer.answer || <Text type="secondary">{t('gradingDetail.shortAnswer.noAnswerFallback')}</Text>}
						</Paragraph>
					</Card>
				);

			case QuestionType.FillBlank:
				// Check if using new fill_blank structure (fields directly in content)
				if (question.content?.template && question.content?.blanks) {
					const { template, blanks } = question.content;
					const parts = template.split(/(\{blank\d+\})/);
					const studentAnswers = answer.answer || {};

					return (
						<Space direction="vertical" style={{ width: '100%' }} size="middle">
							<div style={{ fontSize: '16px', lineHeight: '2', padding: '12px', backgroundColor: token.colorBgLayout, borderRadius: '8px' }}>
								{parts.map((part, index) => {
									const blankMatch = part.match(/\{(blank\d+)\}/);
									if (blankMatch) {
										const blankId = blankMatch[1];
										const blankDef = blanks[blankId];
										const studentAnswer = studentAnswers[blankId] || '';
										const acceptedAnswers = blankDef?.accepted_answers || [];
										const isCorrect = acceptedAnswers.some(ans =>
											ans.toLowerCase() === studentAnswer.toLowerCase()
										);

										return (
											<Tag
												key={index}
												color={isCorrect ? 'success' : 'error'}
												style={{ fontSize: '14px', padding: '4px 12px', margin: '0 4px' }}
											>
												{studentAnswer || t('gradingDetail.fillBlank.empty')}
											</Tag>
										);
									}
									return <span key={index}>{part}</span>;
								})}
							</div>

							{/* Show detailed comparison */}
							<div>
								{Object.entries(blanks).map(([blankId, blankDef]: [string, any]) => {
									const studentAnswer = studentAnswers[blankId] || '';
									const acceptedAnswers = blankDef.accepted_answers || [];
									const isCorrect = acceptedAnswers.some((ans: string) =>
										ans.toLowerCase() === studentAnswer.toLowerCase()
									);

									return (
										<div key={blankId} style={{ marginBottom: '8px' }}>
											<Text strong>{blankId}: </Text>
											<Tag color={isCorrect ? 'success' : 'error'}>
												{studentAnswer || t('gradingDetail.fillBlank.noAnswer')}
											</Tag>
											{!isCorrect && acceptedAnswers.length > 0 && (
												<span style={{ marginLeft: '8px' }}>
													<Text type="secondary">{t('gradingDetail.fillBlank.correctAnswer')}: </Text>
													{acceptedAnswers.map((ans: string, idx: number) => (
														<Tag key={idx} color="green" style={{ marginLeft: '4px' }}>
															{ans}
														</Tag>
													))}
												</span>
											)}
											<Text type="secondary" style={{ marginLeft: '8px' }}>
												({blankDef.points} {t('gradingDetail.fillBlank.points')})
											</Text>
										</div>
									);
								})}
							</div>
						</Space>
					);
				}

				// Fallback for old structure
				return (
					<Space direction="vertical" style={{ width: '100%' }}>
						{Object.entries(answer.answer || {}).map(([key, value]) => (
							<div key={key}>
								<Text strong>{t('gradingDetail.fillBlank.blankNumber')} {key}: </Text>
								<Tag color="blue">{String(value)}</Tag>
							</div>
						))}
					</Space>
				);

			case QuestionType.Matching:
				if (question.content?.left_items && question.content?.right_items && question.content?.correct_pairs) {
					const { left_items, right_items, correct_pairs } = question.content;
					const studentMatches = answer.answer || {};

					// Create a map of correct pairs for easy lookup
					const correctPairsMap: Record<string, string> = {};
					correct_pairs.forEach((pair: any) => {
						correctPairsMap[pair.left_id] = pair.right_id;
					});

					return (
						<Space direction="vertical" style={{ width: '100%' }} size="middle">
							{left_items.map((leftItem: any) => {
								const studentRightId = studentMatches[leftItem.id];
								const correctRightId = correctPairsMap[leftItem.id];
								const isCorrect = studentRightId === correctRightId;

								const studentRightItem = right_items.find((item: any) => item.id === studentRightId);
								const correctRightItem = right_items.find((item: any) => item.id === correctRightId);

								return (
									<div key={leftItem.id} style={{
										padding: '12px',
										borderRadius: '8px',
										border: `2px solid ${isCorrect ? token.colorSuccessBorder : token.colorErrorBorder}`,
										backgroundColor: isCorrect ? token.colorSuccessBg : token.colorErrorBg
									}}>
										<Row gutter={16} align="middle">
											<Col span={10}>
												<Space direction="vertical">
													<Text strong>{t('gradingDetail.matching.leftSide')}:</Text>
													{leftItem.image_url && (
														<img
															src={leftItem.image_url}
															alt={leftItem.text}
															style={{ maxWidth: '100px', maxHeight: '60px' }}
														/>
													)}
													<Text>{leftItem.text}</Text>
												</Space>
											</Col>
											<Col span={2} style={{ textAlign: 'center' }}>
												{isCorrect ?
													<CheckCircleOutlined style={{ color: token.colorSuccess, fontSize: '24px' }} /> :
													<CloseCircleOutlined style={{ color: token.colorError, fontSize: '24px' }} />
												}
											</Col>
											<Col span={12}>
												<Space direction="vertical">
													<div>
														<Text strong>{t('gradingDetail.matching.studentChoice')}: </Text>
														{studentRightItem ? (
															<>
																{studentRightItem.image_url && (
																	<img
																		src={studentRightItem.image_url}
																		alt={studentRightItem.text}
																		style={{ maxWidth: '100px', maxHeight: '60px', marginLeft: '8px' }}
																	/>
																)}
																<Tag color={isCorrect ? 'success' : 'error'}>
																	{studentRightItem.text}
																</Tag>
															</>
														) : (
															<Tag color="default">{t('gradingDetail.matching.noAnswer')}</Tag>
														)}
													</div>
													{!isCorrect && correctRightItem && (
														<div>
															<Text type="secondary">{t('gradingDetail.matching.correctAnswer')}: </Text>
															{correctRightItem.image_url && (
																<img
																	src={correctRightItem.image_url}
																	alt={correctRightItem.text}
																	style={{ maxWidth: '100px', maxHeight: '60px', marginLeft: '8px' }}
																/>
															)}
															<Tag color="green">{correctRightItem.text}</Tag>
														</div>
													)}
												</Space>
											</Col>
										</Row>
									</div>
								);
							})}
						</Space>
					);
				}
				return (
					<Card size="small" style={{ backgroundColor: token.colorBgLayout }}>
						<pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
							{JSON.stringify(answer.answer, null, 2)}
						</pre>
					</Card>
				);

			case QuestionType.Ordering:
				if (question.content?.items && question.content?.correct_order) {
					const { items, correct_order } = question.content;
					const studentOrder = answer.answer || [];

					return (
						<Space direction="vertical" style={{ width: '100%' }} size="large">
							{/* Student's Order */}
							<Card title={t('gradingDetail.ordering.studentOrder')} type="inner" size="small">
								{studentOrder.length > 0 ? (
									<Space direction="vertical" style={{ width: '100%' }}>
										{studentOrder.map((itemId: string, index: number) => {
											const item = items.find((i: any) => i.id === itemId);
											const isCorrectPosition = correct_order[index] === itemId;

											return (
												<div
													key={itemId}
													style={{
														padding: '8px',
														borderRadius: '4px',
														border: `2px solid ${isCorrectPosition ? token.colorSuccessBorder : token.colorErrorBorder}`,
														backgroundColor: isCorrectPosition ? token.colorSuccessBg : token.colorErrorBg,
													}}
												>
													<Space>
														<Tag color={isCorrectPosition ? 'success' : 'error'}>
															{index + 1}
														</Tag>
														{isCorrectPosition ? (
															<CheckCircleOutlined style={{ color: token.colorSuccess }} />
														) : (
															<CloseCircleOutlined style={{ color: token.colorError }} />
														)}
														{item?.image_url && (
															<img
																src={item.image_url}
																alt={item.text}
																style={{ maxWidth: '80px', maxHeight: '50px' }}
															/>
														)}
														<Text strong>{item?.text || itemId}</Text>
														{!isCorrectPosition && (
															<Text type="secondary">
																({t('gradingDetail.ordering.correctPosition')}: {correct_order.indexOf(itemId) + 1})
															</Text>
														)}
													</Space>
												</div>
											);
										})}
									</Space>
								) : (
									<Text type="secondary">{t('gradingDetail.ordering.noAnswer')}</Text>
								)}
							</Card>

							{/* Correct Order */}
							<Card title={t('gradingDetail.ordering.correctOrder')} type="inner" size="small">
								<Space direction="vertical" style={{ width: '100%' }}>
									{correct_order.map((itemId: string, index: number) => {
										const item = items.find((i: any) => i.id === itemId);

										return (
											<div
												key={itemId}
												style={{
													padding: '8px',
													borderRadius: '4px',
													border: `1px solid ${token.colorSuccessBorder}`,
													backgroundColor: token.colorSuccessBg,
												}}
											>
												<Space>
													<Tag color="success">{index + 1}</Tag>
													{item?.image_url && (
														<img
															src={item.image_url}
															alt={item.text}
															style={{ maxWidth: '80px', maxHeight: '50px' }}
														/>
													)}
													<Text>{item?.text || itemId}</Text>
												</Space>
											</div>
										);
									})}
								</Space>
							</Card>
						</Space>
					);
				}
				return (
					<Card size="small" style={{ backgroundColor: token.colorBgLayout }}>
						<pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
							{JSON.stringify(answer.answer, null, 2)}
						</pre>
					</Card>
				);

			default:
				return (
					<Card size="small" style={{ backgroundColor: token.colorBgLayout }}>
						<pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
							{JSON.stringify(answer.answer, null, 2)}
						</pre>
					</Card>
				);
		}
	};

	if (loading) {
		return (
			<div style={{ textAlign: 'center', padding: '100px 0' }}>
				<Spin size="large" tip={t('common.loading')} />
			</div>
		);
	}

	if (!attempt) {
		return (
			<Empty description={t('gradingDetail.notFound')} />
		);
	}

	const totalScore = calculateTotalScore();
	const maxScore = calculateMaxScore();
	const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
	const passed = percentage >= (attempt.assessment?.passing_score || 0);
	const progress = calculateProgress();

	return (
		<Space direction="vertical" size="large" style={{ width: '100%' }}>
			{/* Header */}
			<Flex justify="space-between" align="center">
				<Space>
					<Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/grading')}>
						{t('common.back')}
					</Button>
					<Title level={2} style={{ margin: 0 }}>
						{t('gradingDetail.title')}
					</Title>
				</Space>
				<Space>
					<Button
						icon={<ThunderboltOutlined />}
						onClick={handleAutoGrade}
						loading={autoGrading}
					>
						{t('gradingDetail.autoGradeAll')}
					</Button>
					<Button
						icon={<FileTextOutlined />}
						onClick={handleGenerateFeedback}
						loading={generatingFeedback}
					>
						{t('gradingDetail.generateAIFeedback')}
					</Button>
					<Button
						type="primary"
						icon={<SaveOutlined />}
						onClick={handleSaveGrades}
						loading={saving}
						disabled={grades.size === 0}
					>
						{t('gradingDetail.saveGrades')}
					</Button>
				</Space>
			</Flex>

			{/* Progress */}
			<Card
				className="grading-progress-card"
				style={{
					...elevation[1],
					borderRadius: 16,
					background: token.colorBgContainer,
					border: `1px solid ${token.colorBorder}`,
				}}
			>
				<Space direction="vertical" style={{ width: '100%' }} size="middle">
					<Flex justify="space-between" align="center">
						<Space>
							<div style={{
								width: 36,
								height: 36,
								borderRadius: 10,
								background: token.colorPrimary,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: `0 4px 12px ${token.colorPrimaryBg}`,
							}}>
								<CheckCircleOutlined style={{ fontSize: 18, color: '#fff' }} />
							</div>
							<div>
								<Text strong style={{ fontSize: 15 }}>{t('gradingDetail.progress')}</Text>
								<br />
								<Text type="secondary" style={{ fontSize: 12 }}>
									{t('gradingDetail.gradedCount', { graded: attempt.answers.filter(a => a.is_graded || grades.has(a.id)).length, total: attempt.answers.length })}
								</Text>
							</div>
						</Space>
						<div style={{
							padding: '6px 16px',
							borderRadius: 20,
							background: progress === 100 ? token.colorSuccessBg : token.colorPrimaryBg,
							border: `1px solid ${progress === 100 ? token.colorSuccessBorder : token.colorPrimaryBorder}`,
						}}>
							<Text
								strong
								style={{
									fontSize: 18,
									color: progress === 100 ? token.colorSuccess : token.colorPrimary,
								}}
							>
								{Math.round(progress)}%
							</Text>
						</div>
					</Flex>
					<Progress
						percent={progress}
						strokeWidth={12}
						strokeColor={progress === 100 ? token.colorSuccess : token.colorPrimary}
						trailColor={token.colorBgLayout}
						showInfo={false}
						strokeLinecap="round"
						className="animated-progress"
					/>
				</Space>
			</Card>

			{/* Overall Grade & Feedback */}
			<Card
				title={
					<Space>
						<FileTextOutlined />
						<Text strong>{t('gradingDetail.overallGradeAndFeedback')}</Text>
					</Space>
				}
				style={{ ...elevation[1], borderRadius: 16 }}
				extra={
					<Button
						type="primary"
						icon={<SaveOutlined />}
						onClick={handleSaveOverallGrade}
						loading={saving}
					>
						{t('gradingDetail.saveOverallGrade')}
					</Button>
				}
			>
				<Row gutter={16}>
					<Col xs={24} md={8}>
						<Space direction="vertical" style={{ width: '100%' }}>
							<Text strong>{t('gradingDetail.finalScoreLabel')}:</Text>
							<InputNumber
								min={0}
								max={100}
								step={0.5}
								value={finalScore}
								onChange={(value) => setFinalScore(value || undefined)}
								style={{ width: '100%' }}
								size="large"
								placeholder={t('gradingDetail.finalScorePlaceholder')}
							/>
							<Text type="secondary" style={{ fontSize: 12 }}>
								{t('gradingDetail.finalScoreHint')}
							</Text>
						</Space>
					</Col>
					<Col xs={24} md={16}>
						<Space direction="vertical" style={{ width: '100%' }}>
							<Flex justify="space-between">
								<Text strong>{t('gradingDetail.overallFeedbackLabel')}:</Text>
								{overallFeedback && (
									<Button
										size="small"
										type="link"
										onClick={() => setOverallFeedback('')}
									>
										{t('common.delete')}
									</Button>
								)}
							</Flex>
							<TextArea
								rows={4}
								value={overallFeedback}
								onChange={(e) => setOverallFeedback(e.target.value)}
								placeholder={t('gradingDetail.overallFeedbackPlaceholder')}
							/>
						</Space>
					</Col>
				</Row>
			</Card>

			{/* Attempt Info */}
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={16}>
					<Card
						title={
							<Space>
								<FileTextOutlined />
								<Text strong>{t('gradingDetail.attemptInfo')}</Text>
							</Space>
						}
						style={{ ...elevation[1], borderRadius: 16 }}
					>
						<Descriptions column={{ xs: 1, sm: 2 }} bordered>
							<Descriptions.Item label={t('gradingDetail.assessment')}>
								{attempt.assessment?.title}
							</Descriptions.Item>
							<Descriptions.Item label={t('gradingDetail.status')}>
								<Tag color={getStatusColor(attempt.status)}>
									{attempt.status}
								</Tag>
							</Descriptions.Item>
							<Descriptions.Item label={t('gradingDetail.student')}>
								<Space>
									<Avatar size="small" icon={<UserOutlined />} src={attempt.student?.avatar_url} />
									<Text>{attempt.student?.full_name || `Student #${attempt.student_id}`}</Text>
								</Space>
							</Descriptions.Item>
							<Descriptions.Item label={t('gradingDetail.email')}>
								{attempt.student?.email || '-'}
							</Descriptions.Item>
							<Descriptions.Item label={t('gradingDetail.startedAt')}>
								{dayjs(attempt.started_at).format('DD/MM/YYYY HH:mm')}
							</Descriptions.Item>
							<Descriptions.Item label={t('gradingDetail.completedAt')}>
								{attempt.completed_at ? dayjs(attempt.completed_at).format('DD/MM/YYYY HH:mm') : '-'}
							</Descriptions.Item>
							<Descriptions.Item label={t('gradingDetail.timeSpent')}>
								<Space>
									<ClockCircleOutlined />
									{attempt.time_spent
										? dayjs.duration(attempt.time_spent, 'seconds').format('HH:mm:ss')
										: '-'
									}
								</Space>
							</Descriptions.Item>
							<Descriptions.Item label={t('gradingDetail.questionCount')}>
								{attempt.answers.length}
							</Descriptions.Item>
						</Descriptions>
					</Card>
				</Col>

				<Col xs={24} lg={8}>
					<Card
						className="premium-score-card"
						style={{
							...elevation[2],
							borderRadius: 16,
							background: token.colorBgContainer,
							border: `2px solid ${passed ? token.colorSuccessBorder : token.colorErrorBorder}`,
						}}
					>
						<Space direction="vertical" size="large" style={{ width: '100%' }}>
							{/* Header with icon and title */}
							<Flex justify="space-between" align="center">
								<Space>
									<div style={{
										width: 40,
										height: 40,
										borderRadius: 12,
										background: passed ? token.colorSuccess : token.colorError,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										boxShadow: `0 4px 12px ${passed ? token.colorSuccessBg : token.colorErrorBg}`,
									}}>
										<TrophyOutlined style={{ fontSize: 20, color: '#fff' }} />
									</div>
									<div>
										<Text strong style={{ fontSize: 16 }}>{t('gradingDetail.score')}</Text>
										<br />
										<Text type="secondary" style={{ fontSize: 12 }}>
											{t('gradingDetail.overallResult')}
										</Text>
									</div>
								</Space>
								<Badge
									status={passed ? 'success' : 'error'}
									text={passed ? t('gradingDetail.passed') : t('gradingDetail.failed')}
									style={{ fontWeight: 500 }}
									className="status-badge"
								/>
							</Flex>

							<Divider style={{ margin: '12px 0' }} />

							{/* Main score display */}
							<div style={{ textAlign: 'center' }}>
								<Progress
									type="circle"
									percent={Math.round(percentage)}
									strokeWidth={10}
									size={200}
									strokeColor={passed ? token.colorSuccess : token.colorError}
									trailColor={token.colorBgLayout}
									format={() => (
										<div>
											<Statistic
												value={Math.round(percentage)}
												suffix="%"
												valueStyle={{
													fontSize: 48,
													fontWeight: 700,
													color: passed ? token.colorSuccess : token.colorError,
													lineHeight: 1,
												}}
											/>
											<Text type="secondary" style={{ fontSize: 14, fontWeight: 500, display: 'block', marginTop: 8 }}>
												{t('gradingDetail.scoreDisplay', { score: totalScore.toFixed(1), max: maxScore })}
											</Text>
										</div>
									)}
								/>

								<Divider style={{ margin: '24px 0' }} />

								{/* Score breakdown */}
								<Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
									<Col span={12}>
										<Card
											size="small"
											style={{
												borderRadius: 12,
												background: token.colorSuccessBg,
												border: `1px solid ${token.colorSuccessBorder}`,
												textAlign: 'center',
											}}
										>
											<Statistic
												title={<Text type="secondary" style={{ fontSize: 12 }}>{t('gradingDetail.correctAnswers')}</Text>}
												value={attempt.answers.filter(a => {
													const grade = grades.get(a.id);
													const score = grade?.score ?? a.score ?? 0;
													return score >= a.max_score;
												}).length}
												suffix={`/ ${attempt.answers.length}`}
												valueStyle={{ fontSize: 20, color: token.colorSuccess }}
											/>
										</Card>
									</Col>
									<Col span={12}>
										<Card
											size="small"
											style={{
												borderRadius: 12,
												background: token.colorErrorBg,
												border: `1px solid ${token.colorErrorBorder}`,
												textAlign: 'center',
											}}
										>
											<Statistic
												title={<Text type="secondary" style={{ fontSize: 12 }}>{t('gradingDetail.incorrectAnswers')}</Text>}
												value={attempt.answers.filter(a => {
													const grade = grades.get(a.id);
													const score = grade?.score ?? a.score ?? 0;
													return score < a.max_score;
												}).length}
												suffix={`/ ${attempt.answers.length}`}
												valueStyle={{ fontSize: 20, color: token.colorError }}
											/>
										</Card>
									</Col>
								</Row>

								{/* Passing score indicator */}
								<Alert
									message={
										<Flex justify="space-between" align="center" style={{ width: '100%' }}>
											<Space>
												{passed ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
												<Text strong>{passed ? t('gradingDetail.passedRequirement') : t('gradingDetail.failedRequirement')}</Text>
											</Space>
											<Text type="secondary">
												{t('gradingDetail.passingScore')}: {attempt.assessment?.passing_score || 0}%
											</Text>
										</Flex>
									}
									type={passed ? 'success' : 'error'}
									showIcon={false}
									style={{ borderRadius: 12 }}
								/>
							</div>
						</Space>
					</Card>
				</Col>
			</Row>

			{/* Proctoring Events */}
			{attempt.proctoring_events && attempt.proctoring_events.length > 0 && (
				<Card
					title={
						<Space>
							<ExclamationCircleOutlined style={{ color: '#faad14' }} />
							<Text strong>{t('gradingDetail.proctoringWarnings')}</Text>
							<Badge count={attempt.proctoring_events.length} />
						</Space>
					}
					style={{ ...elevation[1], borderRadius: 16 }}
				>
					<Collapse ghost>
						{attempt.proctoring_events.map((event, index) => (
							<Collapse.Panel
								key={event.id}
								header={
									<Space>
										<Tag color={
											event.severity === 'critical' ? 'red' :
												event.severity === 'high' ? 'orange' :
													event.severity === 'medium' ? 'gold' : 'default'
										}>
											{event.severity}
										</Tag>
										<Text>{event.event_type}</Text>
										<Text type="secondary">
											{dayjs(event.timestamp).format('HH:mm:ss')}
										</Text>
									</Space>
								}
							>
								<pre>{JSON.stringify(event.details, null, 2)}</pre>
							</Collapse.Panel>
						))}
					</Collapse>
				</Card>
			)}

			{/* Answers */}
			<Card
				title={
					<Space>
						<FileTextOutlined />
						<Text strong>{t('gradingDetail.answers')} ({attempt.answers.length})</Text>
					</Space>
				}
				style={{ ...elevation[1], borderRadius: 16 }}
			>
				<Space direction="vertical" size="middle" style={{ width: '100%' }}>
					{attempt.answers.map((answer, index) => {
						const currentGrade = grades.get(answer.id);
						const displayScore = currentGrade?.score ?? answer.score ?? 0;
						const displayFeedback = currentGrade?.feedback ?? answer.feedback ?? '';

						return (
							<Card
								key={answer.id}
								type="inner"
								title={
									<Flex justify="space-between" align="center">
										<Space>
											<Badge count={index + 1} style={{ backgroundColor: '#1890ff' }} />
											<Text strong>{t('gradingDetail.questionNumber', { number: index + 1 })}</Text>
											<Tag>{getQuestionTypeLabel(answer.question?.type || '')}</Tag>
											{answer.flagged && (
												<Tooltip title={t('gradingDetail.flaggedQuestion')}>
													<FlagOutlined style={{ color: '#ff4d4f' }} />
												</Tooltip>
											)}
										</Space>
										<Space>
											{answer.is_graded && (
												<Tag color="success" icon={<CheckCircleOutlined />}>
													{t('gradingDetail.graded')}
												</Tag>
											)}
											<Text strong>
												{t('gradingDetail.scoreOutOf', { score: displayScore, max: answer.max_score })}
											</Text>
										</Space>
									</Flex>
								}
								style={{ borderRadius: 12 }}
							>
								<Space direction="vertical" size="middle" style={{ width: '100%' }}>
									{/* Question Text */}
									<div>
										<Text strong>{t('gradingDetail.question')}:</Text>
										<Paragraph style={{ marginTop: 8 }}>
											{answer.question?.text}
										</Paragraph>
									</div>

									<Divider style={{ margin: '8px 0' }} />

									{/* Student Answer */}
									<div>
										<Text strong>{t('gradingDetail.studentAnswerLabel')}:</Text>
										<div style={{ marginTop: 8 }}>
											{renderAnswerContent(answer)}
										</div>
									</div>

									{/* Explanation */}
									{answer.question?.explanation && (
										<>
											<Divider style={{ margin: '8px 0' }} />
											<Alert
												message={t('gradingDetail.explanation')}
												description={answer.question.explanation}
												type="info"
												showIcon
												icon={<EyeOutlined />}
											/>
										</>
									)}

									<Divider style={{ margin: '8px 0' }} />

									{/* Grading Section */}
									<Row gutter={16}>
										<Col xs={24} sm={8}>
											<Space direction="vertical" style={{ width: '100%' }}>
												<Text strong>{t('gradingDetail.scoreLabel')}:</Text>
												<InputNumber
													min={0}
													max={answer.max_score}
													step={0.5}
													value={displayScore}
													onChange={(value) => handleGradeChange(answer.id, 'score', value || 0)}
													style={{ width: '100%' }}
													size="large"
												/>
											</Space>
										</Col>
										<Col xs={24} sm={16}>
											<Space direction="vertical" style={{ width: '100%' }}>
												<Text strong>{t('gradingDetail.feedbackLabel')}:</Text>
												<TextArea
													rows={3}
													value={displayFeedback}
													onChange={(e) => handleGradeChange(answer.id, 'feedback', e.target.value)}
													placeholder={t('gradingDetail.feedbackPlaceholder')}
												/>
											</Space>
										</Col>
									</Row>

									{/* Grading Info */}
									{answer.is_graded && answer.graded_at && (
										<Alert
											message={
												<Text type="secondary" style={{ fontSize: 12 }}>
													{t('gradingDetail.gradedAtBy', {
														time: dayjs(answer.graded_at).format('DD/MM/YYYY HH:mm'),
														teacher: answer.graded_by ? `#${answer.graded_by}` : ''
													})}
												</Text>
											}
											type="info"
											showIcon={false}
											style={{ padding: '4px 12px' }}
										/>
									)}
								</Space>
							</Card>
						);
					})}
				</Space>
			</Card>
		</Space>
	);
};

export default GradingDetail;
