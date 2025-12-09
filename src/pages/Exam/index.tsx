import {
	CheckOutlined,
	ExclamationCircleOutlined,
	LeftOutlined,
	RightOutlined,
} from '@ant-design/icons';
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, App, Button, Card, Col, Input, Row, Space, Spin, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { InTestFaceVerificationModal } from '../../components/Proctoring/InTestFaceVerificationModal';
import { ProctoringMonitor } from '../../components/Proctoring/ProctoringMonitor';
import { useAuth } from '../../hooks/useAuth';
import {
	useBrowserProctoring,
	type BrowserProctoringEvent,
} from '../../hooks/useBrowserProctoring';
import { useDevToolsBlocker } from '../../hooks/useDevToolsBlocker';
import type { ProctoringEvent } from '../../hooks/useProctoring';
import studentService from '../../services/studentService';
import violationService from '../../services/violationService';
import { useThemeToken } from '../../theme/ThemeProvider';
import type { AttemptDetail, CompleteAttemptRequest } from '../../types';

import { ExamHeader } from './components/ExamHeader';
import { QuestionNavigation } from './components/QuestionNavigation';
import { QuestionRenderer } from './components/QuestionRenderer';
import { useAutoSave } from './hooks/useAutoSave';
import { useExamTimer } from './hooks/useExamTimer';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const TakeAssessment: React.FC = () => {
	const { attemptId } = useParams<{ attemptId: string }>();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { modal } = App.useApp();
	const { user } = useAuth();
	const { token } = useThemeToken(); // Move to top level to follow Rules of Hooks
	const { t } = useTranslation();

	const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
	const [answers, setAnswers] = useState<Record<number, any>>({});

	const handleTimeUpCallback = async () => {
		// Stop timer to prevent 409 errors
		stopTimer();

		// Flush any pending saves before submitting
		await flushPendingSaves();

		modal.warning({
			title: t('exam.timeUp'),
			content: t('exam.timeUpMessage'),
			onOk: () => submitAttemptMutation.mutate(buildCompleteAttemptRequest('timeout')),
		});
	};

	const { timeRemaining, formatTime, stopTimer } = useExamTimer(
		Number(attemptId),
		handleTimeUpCallback
	);
	const { saveAnswer, flushPendingSaves, isAutoSaving } = useAutoSave(
		Number(attemptId),
		timeRemaining
	);
	const [proctoringEvents, setProctoringEvents] = useState<ProctoringEvent[]>([]);
	const [browserViolations, setBrowserViolations] = useState<Map<string, BrowserProctoringEvent>>(
		new Map()
	);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showFaceVerifyModal, setShowFaceVerifyModal] = useState(false);
	const [prevFaceCount, setPrevFaceCount] = useState<number | null>(null);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);
	const [activeMatchingId, setActiveMatchingId] = useState<string | null>(null); // For matching drag overlay
	const [lastSavedTime, setLastSavedTime] = useState<number | null>(null); // Track last successful save
	const [customGrabbedId, setCustomGrabbedId] = useState<string | null>(null); // For custom keyboard ordering
	const [focusedItemId, setFocusedItemId] = useState<string | null>(null); // Track focused item for visual feedback

	// Setup sensors for drag-and-drop at top level (for ordering questions)
	// Removed KeyboardSensor to use custom keyboard logic
	const dndSensors = useSensors(useSensor(PointerSensor));

	const { data: attempt, isLoading } = useQuery<AttemptDetail>({
		queryKey: ['attempt-detail', attemptId],
		queryFn: () => studentService.getAttemptDetails(Number(attemptId)),
		enabled: !!attemptId,
	});

	// Questions are included in attempt details
	const questions = attempt?.questions || [];

	// Mark initial load complete after 3 seconds
	useEffect(() => {
		const timer = setTimeout(() => setInitialLoadComplete(true), 3000);
		return () => clearTimeout(timer);
	}, []);

	// Initialize currentQuestionId when questions load
	useEffect(() => {
		if (questions.length > 0 && currentQuestionId === null) {
			setCurrentQuestionId(questions[0].id);
		}
	}, [questions, currentQuestionId]);

	// Get current question by ID (not index)
	const currentQuestion = currentQuestionId
		? questions.find((q) => q.id === currentQuestionId)
		: null;

	// Get current index for display purposes
	const currentQuestionIndex = currentQuestion
		? questions.findIndex((q) => q.id === currentQuestion.id)
		: 0;

	// Load existing answers from attempt
	useEffect(() => {
		if (attempt?.answers) {
			const existingAnswers: Record<number, any> = {};
			attempt.answers.forEach((ans) => {
				if (ans.answer !== null && ans.answer !== undefined) {
					existingAnswers[ans.question_id] = ans.answer;
				}
			});
			setAnswers(existingAnswers);
		}
	}, [attempt]);

	// Submit attempt mutation
	const submitAttemptMutation = useMutation({
		mutationFn: async (data: CompleteAttemptRequest) => {
			setIsSubmitting(true);

			// Submit all violations before submitting attempt
			if (user && attempt) {
				const allViolations = [
					...proctoringEvents.map((event) => ({
						event,
						type: 'camera' as const,
					})),
					...Array.from(browserViolations.values()).map((event) => ({
						event,
						type: 'browser' as const,
					})),
				];

				if (allViolations.length > 0) {
					try {
						await violationService.submitViolationsBatch(
							allViolations,
							user.id,
							attempt.id,
							attempt.assessment_id
						);
					} catch (error) {
						console.error('Failed to submit violations batch:', error);
					}
				}
			}

			return studentService.submitAttempt(data);
		},
		onSuccess: (data) => {
			// Exit fullscreen after submission
			if (document.fullscreenElement) {
				document
					.exitFullscreen()
					.catch((err) => console.error('Failed to exit fullscreen:', err));
			}

			modal.success({
				title: t('exam.submitted'),
				content: t('exam.submittedMessage'),
				onOk: () => {
					queryClient.invalidateQueries({
						queryKey: ['attempt-detail', attemptId],
					});
					navigate(`/student/results/${attemptId}`);
				},
			});
		},
		onError: (error: any) => {
			modal.error({
				title: t('exam.submitFailed'),
				content: error.message || t('exam.submitFailedMessage'),
			});
		},
	});

	const buildCompleteAttemptRequest = (endReason?: string): CompleteAttemptRequest => {
		// Answers already saved via auto-save, just mark as completed
		return {
			attempt_id: Number(attemptId),
			// answers: [], // Dont sent data
			end_reason: endReason,
		};
	};

	const handleAnswerChange = (questionId: number, answer: any) => {
		setAnswers((prev) => ({ ...prev, [questionId]: answer }));
		saveAnswer(questionId, answer, () => setLastSavedTime(Date.now()));
	};

	const handlePreviousQuestion = () => {
		const currentIndex = questions.findIndex((q) => q.id === currentQuestionId);
		if (currentIndex > 0) {
			setCurrentQuestionId(questions[currentIndex - 1].id);
		} else {
			// Wrap to last question
			setCurrentQuestionId(questions[questions.length - 1].id);
		}
	};

	const handleNextQuestion = () => {
		const currentIndex = questions.findIndex((q) => q.id === currentQuestionId);
		if (currentIndex < questions.length - 1) {
			setCurrentQuestionId(questions[currentIndex + 1].id);
		} else {
			// Wrap to first question
			setCurrentQuestionId(questions[0].id);
		}
	};

	const goToQuestion = (questionId: number) => {
		setCurrentQuestionId(questionId);
	};

	const handleSubmit = async () => {
		// Stop timer to prevent 409 errors
		stopTimer();

		// Flush any pending saves before submitting
		await flushPendingSaves();

		const answeredCount = Object.keys(answers).length;
		const totalQuestions = questions.length;

		modal.confirm({
			title: t('exam.submitConfirm'),
			icon: <ExclamationCircleOutlined />,
			content: (
				<div>
					<p>
						{t('exam.answeredCount', {
							answered: answeredCount,
							total: totalQuestions,
						})}
					</p>
					{answeredCount < totalQuestions && (
						<p style={{ color: '#ff4d4f' }}>
							{t('exam.unansweredWarning', {
								count: totalQuestions - answeredCount,
							})}
						</p>
					)}
					<p>{t('exam.submitConfirmMessage')}</p>
				</div>
			),
			okText: t('exam.submitButton'),
			okType: 'primary',
			cancelText: t('exam.cancelButton'),
			onOk: () => {
				submitAttemptMutation.mutate(buildCompleteAttemptRequest('submitted'));
			},
		});
	};

	const getTimeColor = () => {
		const totalTime = (attempt?.assessment?.duration || 60) * 60;
		const percentage = (timeRemaining / totalTime) * 100;
		if (percentage > 50) return '#52c41a';
		if (percentage > 20) return '#faad14';
		return '#f5222d';
	};

	const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
	const answeredCount = Object.keys(answers).length;
	const settings = attempt?.assessment?.settings;
	const requireWebcam = settings?.require_webcam;

	useEffect(() => {
		if (settings) {
			console.log('Assessment proctoring settings:', {
				require_webcam: settings.require_webcam,
				require_full_screen: settings.require_full_screen,
				prevent_tab_switching: settings.prevent_tab_switching,
				prevent_copy_paste: settings.prevent_copy_paste,
			});
		}
	}, [settings]);

	const handleProctoringViolation = async (event: ProctoringEvent) => {
		setProctoringEvents((prev) => [...prev, event]);
		console.log('Proctoring violation:', event);

		// Submit to backend if violation ended
		if (user && attempt && event.duration > 0 && event.endTime > 0) {
			try {
				await violationService.submitCameraViolation(
					event,
					user.id,
					attempt.id,
					attempt.assessment_id
				);
			} catch (error) {
				console.error('Failed to submit camera violation:', error);
			}
		}
	};

	const handleBrowserViolation = async (event: BrowserProctoringEvent) => {
		const key = event.type;
		if (event.duration === 0) {
			setBrowserViolations((prev) => new Map(prev).set(key, event));
		} else {
			setBrowserViolations((prev) => new Map(prev).set(key, event));
			setTimeout(() => {
				setBrowserViolations((prev) => {
					const next = new Map(prev);
					next.delete(key);
					return next;
				});
			}, 3000);
		}
		console.log('Browser violation:', event);

		// Submit to backend
		if (user && attempt) {
			try {
				await violationService.submitBrowserViolation(
					event,
					user.id,
					attempt.id,
					attempt.assessment_id
				);
			} catch (error) {
				console.error('Failed to submit browser violation:', error);
			}
		}
	};

	// Browser proctoring for ALL tests (not just webcam tests)
	useBrowserProctoring({
		enabled: true,
		requireFullscreen: settings?.require_full_screen,
		preventTabSwitching: settings?.prevent_tab_switching,
		preventCopyPaste: settings?.prevent_copy_paste,
		detectTampering: true,
		onViolation: handleBrowserViolation,
	});

	// Block DevTools shortcuts (F12, right-click, etc.) - bypassed in dev mode
	useDevToolsBlocker(true);

	// Auto-enter fullscreen when test loads (if required)
	useEffect(() => {
		if (!attempt || !settings) return;

		const enterFullscreen = async () => {
			if (settings.require_full_screen && !document.fullscreenElement) {
				try {
					await document.documentElement.requestFullscreen();
					console.log('Entered fullscreen mode');
				} catch (err) {
					console.error('Failed to enter fullscreen:', err);
					modal.warning({
						title: t('exam.fullscreenRequired'),
						content: t('exam.fullscreenMessage'),
					});
				}
			}
		};

		enterFullscreen();
	}, [attempt, settings]);

	// Prevent exiting fullscreen during test
	useEffect(() => {
		if (!settings?.require_full_screen) return;

		const handleFullscreenChange = () => {
			// Don't show warning if test is being submitted
			if (isSubmitting) return;

			if (!document.fullscreenElement) {
				// User exited fullscreen - try to re-enter
				modal.warning({
					title: t('exam.fullscreenRequired'),
					content: t('exam.fullscreenExitWarning'),
					onOk: async () => {
						try {
							await document.documentElement.requestFullscreen();
						} catch (err) {
							console.error('Failed to re-enter fullscreen:', err);
						}
					},
				});
			}
		};

		document.addEventListener('fullscreenchange', handleFullscreenChange);
		return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
	}, [settings, isSubmitting]);

	// Keyboard shortcuts for exam navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement;

			// Shift+Enter to unfocus text fields (allows navigation again)
			if (
				e.shiftKey &&
				e.key === 'Enter' &&
				(target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')
			) {
				e.preventDefault();
				(target as HTMLElement).blur();
				return;
			}

			// Auto-focus text fields for text-based question types when typing
			// @ts-ignore - Runtime object structure differs from type definition
			const questionType = currentQuestion?.type;
			const isTextQuestion =
				questionType === 'essay' ||
				questionType === 'fill_blank' ||
				questionType === 'short_answer';

			if (isTextQuestion && target.tagName !== 'TEXTAREA' && target.tagName !== 'INPUT') {
				// Check if user pressed a printable character (letters, numbers, symbols, space)
				if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
					e.preventDefault(); // Prevent default behavior

					let inputField: HTMLTextAreaElement | HTMLInputElement | null = null;

					// Find the appropriate input field
					if (questionType === 'essay') {
						inputField = document.querySelector('textarea') as HTMLTextAreaElement;
					} else {
						// For fill_in_blank and short_answer, find the text input
						// Be more specific with the selector to ensure we find the right input
						inputField = document.querySelector(
							'input[type="text"]'
						) as HTMLInputElement;

						// If not found, try looking for any input in the question content
						if (!inputField) {
							const questionCard = document.querySelector('.ant-card');
							inputField = questionCard?.querySelector('input') as HTMLInputElement;
						}
					}

					if (inputField) {
						// Focus the field first
						inputField.focus();

						// Update the value using React-compatible approach
						const currentValue = inputField.value || '';
						const newValue = currentValue + e.key;

						// Use the native setter to properly trigger React's onChange
						const isTextarea = inputField instanceof HTMLTextAreaElement;
						const prototype = isTextarea
							? HTMLTextAreaElement.prototype
							: HTMLInputElement.prototype;
						const nativeSetter = Object.getOwnPropertyDescriptor(
							prototype,
							'value'
						)?.set;

						if (nativeSetter) {
							nativeSetter.call(inputField, newValue);

							// Dispatch input event that React will detect
							const inputEvent = new Event('input', {
								bubbles: true,
							});
							inputField.dispatchEvent(inputEvent);

							// Also dispatch change event
							const changeEvent = new Event('change', {
								bubbles: true,
							});
							inputField.dispatchEvent(changeEvent);

							// Set cursor to the end
							setTimeout(() => {
								const length = newValue.length;
								if (inputField && inputField.setSelectionRange) {
									inputField.setSelectionRange(length, length);
								}
							}, 0);
						}

						return;
					}
				}
			}

			// Don't trigger navigation shortcuts if user is typing in textarea or input
			if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
				return;
			}

			// Ordering Question Shortcuts
			// @ts-ignore
			if (currentQuestion?.type === 'ordering') {
				// @ts-ignore
				const items = currentQuestion?.content?.items || [];
				const currentOrder =
					(answers[currentQuestion!.id] as string[]) || items.map((i: any) => i.id);

				// Helper to focus item
				const focusItem = (index: number) => {
					const itemId = currentOrder[index];
					setFocusedItemId(itemId); // Update internal focus state

					// Use setTimeout to allow render to happen if order changed
					setTimeout(() => {
						const el = document.querySelector(
							`[data-sortable-id="${itemId}"]`
						) as HTMLElement;
						if (el) el.focus();
					}, 0);
				};

				// Space or Enter to Toggle Grab
				if (e.key === ' ' || e.key === 'Enter') {
					// Only if an item is focused
					const activeEl = document.activeElement as HTMLElement;
					const sortableId = activeEl?.getAttribute('data-sortable-id');

					if (sortableId) {
						e.preventDefault();
						setFocusedItemId(sortableId); // Ensure focus state matches

						if (customGrabbedId === sortableId) {
							setCustomGrabbedId(null); // Drop (focus stays on this item)
						} else {
							setCustomGrabbedId(sortableId); // Grab (focus already on this item)
						}
						return;
					}
				}

				// Alt + Arrow Up/Down
				if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
					e.preventDefault();
					const activeEl = document.activeElement as HTMLElement;
					const sortableId = activeEl?.getAttribute('data-sortable-id');

					// If nothing focused via DOM, try using internal state or default to first
					const targetId = sortableId || focusedItemId || currentOrder[0];

					if (targetId) {
						const currentIndex = currentOrder.indexOf(targetId);
						if (currentIndex === -1) return;

						const direction = e.key === 'ArrowUp' ? -1 : 1;
						let newIndex = currentIndex + direction;

						// Wrap around
						if (newIndex < 0) newIndex = currentOrder.length - 1;
						if (newIndex >= currentOrder.length) newIndex = 0;

						if (customGrabbedId === targetId) {
							// Swap (Move Item)
							const newOrder = [...currentOrder];
							// Remove from old
							newOrder.splice(currentIndex, 1);
							// Insert at new
							newOrder.splice(newIndex, 0, targetId);

							handleAnswerChange(currentQuestion!.id, newOrder);

							// Update focus state to follow the moved item
							setFocusedItemId(targetId); // targetId is the grabbed item

							// Focus the DOM element
							setTimeout(() => {
								const el = document.querySelector(
									`[data-sortable-id="${targetId}"]`
								) as HTMLElement;
								if (el) el.focus();
							}, 0);
						} else {
							// Navigation (Move Focus)
							focusItem(newIndex);
						}
						return;
					}
				}

				// Number Keys (1-9)
				if (/^[1-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
					const targetIndex = parseInt(e.key) - 1;
					if (targetIndex >= 0 && targetIndex < currentOrder.length) {
						e.preventDefault();

						if (customGrabbedId) {
							// Move grabbed item to target index
							const grabbedIndex = currentOrder.indexOf(customGrabbedId);
							if (grabbedIndex !== -1 && grabbedIndex !== targetIndex) {
								const newOrder = [...currentOrder];
								newOrder.splice(grabbedIndex, 1);
								newOrder.splice(targetIndex, 0, customGrabbedId);
								handleAnswerChange(currentQuestion!.id, newOrder);
							}
							setCustomGrabbedId(null); // Drop after move

							// Update focus state to follow the moved item
							setFocusedItemId(customGrabbedId); // customGrabbedId is the moved item

							// Focus the DOM element
							setTimeout(() => {
								const el = document.querySelector(
									`[data-sortable-id="${customGrabbedId}"]`
								) as HTMLElement;
								if (el) el.focus();
							}, 0);
						} else {
							// Select and Grab
							const targetId = currentOrder[targetIndex];
							setCustomGrabbedId(targetId);
							setFocusedItemId(targetId); // Sync focus with grab
							focusItem(targetIndex);
						}
						return;
					}
				}
			}

			// Number keys for Multiple Choice and True/False
			if (/^[1-9]$/.test(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
				const index = parseInt(e.key) - 1;
				// @ts-ignore - Runtime object structure differs from type definition
				const qType = currentQuestion?.type;

				if (qType === 'multiple_choice') {
					// @ts-ignore - Runtime object structure differs from type definition
					const options = currentQuestion?.content?.options || [];
					if (index >= 0 && index < options.length) {
						e.preventDefault();
						const option = options[index];
						// @ts-ignore - Runtime object structure differs from type definition
						const isMultiple = currentQuestion?.content?.allow_multiple_answers;

						if (isMultiple) {
							// Toggle selection for multiple choice
							// Cast to any[] to handle both number[] and string[] IDs
							const currentSelected = (answers[currentQuestion!.id] as any[]) || [];
							const newSelected = currentSelected.includes(option.id)
								? currentSelected.filter((id: any) => id !== option.id)
								: [...currentSelected, option.id];
							handleAnswerChange(currentQuestion!.id, newSelected);
						} else {
							// Select for single choice
							handleAnswerChange(currentQuestion!.id, option.id);
						}
					}
				} else if (qType === 'true_false') {
					if (index === 0) {
						// 1 -> True
						e.preventDefault();
						handleAnswerChange(currentQuestion!.id, true);
					} else if (index === 1) {
						// 2 -> False
						e.preventDefault();
						handleAnswerChange(currentQuestion!.id, false);
					}
				}
			}

			// Left Arrow - Previous question (wrap around)
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				handlePreviousQuestion();
			}

			// Right Arrow - Next question (wrap around)
			if (e.key === 'ArrowRight') {
				e.preventDefault();
				handleNextQuestion();
			}

			// Ctrl + Enter - Open submit dialog
			if (e.ctrlKey && e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				handleSubmit();
			}

			// Ctrl + Shift + Enter - Direct confirm submit (if modal is open and delay passed)
			if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
				e.preventDefault();
				const okButton = document.querySelector(
					'.ant-modal-confirm-btns .ant-btn-primary'
				) as HTMLButtonElement;
				if (okButton && !okButton.disabled) {
					okButton.click();
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [currentQuestionId, currentQuestion, questions, answers, customGrabbedId, focusedItemId]);

	if (isLoading) {
		return (
			<div style={{ padding: '24px', textAlign: 'center' }}>
				<Spin size="large" />
				<div style={{ marginTop: 16 }}>
					<Text>{t('exam.loading')}</Text>
				</div>
			</div>
		);
	}

	if (!attempt) {
		return (
			<div style={{ padding: '24px' }}>
				<Alert
					message={t('exam.notFound')}
					description={t('exam.notFoundDescription')}
					type="error"
					showIcon
				/>
			</div>
		);
	}

	if (questions.length === 0) {
		return (
			<div style={{ padding: '24px' }}>
				<Alert
					message={t('exam.noQuestions')}
					description={t('exam.noQuestionsDescription')}
					type="warning"
					showIcon
				/>
			</div>
		);
	}

	if (!currentQuestion) {
		return (
			<div style={{ padding: '24px' }}>
				<Alert
					message={t('exam.questionLoadError')}
					description={t('exam.questionLoadErrorDescription')}
					type="error"
					showIcon
				/>
			</div>
		);
	}

	return (
		<div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
			<ExamHeader
				title={attempt.assessment?.title || ''}
				currentQuestionIndex={currentQuestionIndex}
				totalQuestions={questions.length}
				timeRemaining={formatTime(timeRemaining)}
				timeColor={getTimeColor()}
				answeredCount={answeredCount}
				autoSaving={isAutoSaving}
				lastSavedTime={lastSavedTime}
				progress={progress}
			/>

			{/* Question Card */}
			<Card>
				<Space direction="vertical" size="large" style={{ width: '100%' }}>
					{/* Question Header */}
					<div>
						<Space>
							<Tag color="blue">
								{t('exam.questionN', {
									n: currentQuestionIndex + 1,
								})}
							</Tag>
							<Tag>
								{t('exam.points', {
									points: currentQuestion.points,
								})}
							</Tag>
							{/* DEPRECATED: time_limit per question not used. Only Assessment.Duration is enforced.
              {currentQuestion.time_limit && (
                <Tag icon={<ClockCircleOutlined />}>
                  {currentQuestion.time_limit} seconds
                </Tag>
              )}
              */}
						</Space>
					</div>

					{/* Question Text */}
					<div>
						<Paragraph strong style={{ fontSize: '16px' }}>
							{/* @ts-ignore */}
							{currentQuestion.text}
						</Paragraph>
					</div>

					{/* Answer Input */}
					<div>
						<QuestionRenderer
							question={currentQuestion}
							currentAnswer={answers[currentQuestion.id]}
							onAnswerChange={handleAnswerChange}
							dndSensors={dndSensors}
							activeMatchingId={activeMatchingId}
							setActiveMatchingId={setActiveMatchingId}
							customGrabbedId={customGrabbedId}
							setCustomGrabbedId={setCustomGrabbedId}
							focusedItemId={focusedItemId}
							setFocusedItemId={setFocusedItemId}
						/>
					</div>

					{/* Navigation */}
					<Row justify="space-between" align="middle">
						<Col>
							<Button
								icon={<LeftOutlined />}
								onClick={handlePreviousQuestion}
								disabled={currentQuestionIndex === 0}
							>
								{t('exam.previous')}
							</Button>
						</Col>
						<Col>
							<Space>
								<Text type="secondary">
									{t('exam.answeredProgress', {
										answered: answeredCount,
										total: questions.length,
									})}
								</Text>
							</Space>
						</Col>
						<Col>
							<Space>
								{currentQuestionIndex === questions.length - 1 ? (
									<Button
										type="primary"
										icon={<CheckOutlined />}
										onClick={handleSubmit}
										loading={submitAttemptMutation.isPending}
									>
										{t('exam.submitButton')}
									</Button>
								) : (
									<Button
										type="primary"
										icon={<RightOutlined />}
										onClick={handleNextQuestion}
									>
										{t('exam.next')}
									</Button>
								)}
							</Space>
						</Col>
					</Row>
				</Space>
			</Card>

			<QuestionNavigation
				questions={questions}
				currentQuestionId={currentQuestionId}
				answers={answers}
				onQuestionSelect={goToQuestion}
			/>

			{/* Proctoring Monitor - Floating */}
			{requireWebcam && (
				<>
					<ProctoringMonitor
						onViolation={handleProctoringViolation}
						onFaceCountChange={(count) => {
							// Trigger verification if:
							// 1. Face count returns to 1 from 0 or 2+ (normal case)
							// 2. First face detected after initial load period (prevents cheating)
							if (
								prevFaceCount !== null &&
								(prevFaceCount === 0 || prevFaceCount >= 2) &&
								count === 1
							) {
								setShowFaceVerifyModal(true);
							} else if (
								prevFaceCount === null &&
								count === 1 &&
								initialLoadComplete
							) {
								// First face detected after initial load - could be cheating
								setShowFaceVerifyModal(true);
							}
							setPrevFaceCount(count);
						}}
						showLandmarks={false}
						compact
						violationCount={proctoringEvents.length}
						requireFullscreen={settings?.require_full_screen}
						preventTabSwitching={settings?.prevent_tab_switching}
						preventCopyPaste={settings?.prevent_copy_paste}
						detectTampering={true}
					/>
					<InTestFaceVerificationModal
						open={showFaceVerifyModal}
						onSuccess={() => {
							setShowFaceVerifyModal(false);
							setPrevFaceCount(1);
						}}
						onFail={() => {
							setShowFaceVerifyModal(false);
						}}
					/>
				</>
			)}

			{/* Browser Violations (for non-webcam tests) */}
			{!requireWebcam && browserViolations.size > 0 && (
				<Card title={t('exam.violationWarning')} style={{ marginTop: '16px' }}>
					{Array.from(browserViolations.values()).map((violation) => {
						const getMessage = (type: string, metadata?: any) => {
							switch (type) {
								case 'tab_switch':
									return metadata?.hidden
										? t('exam.violations.tabSwitch')
										: t('exam.violations.tabReturn');
								case 'fullscreen_exit':
									return t('exam.violations.fullscreenExit');
								case 'copy_paste':
									return metadata?.action === 'copy'
										? t('exam.violations.copy')
										: metadata?.action === 'paste'
											? t('exam.violations.paste')
											: t('exam.violations.cut');
								case 'browser_tamper':
									return t('exam.violations.devtools');
								default:
									return t('exam.violations.violation');
							}
						};
						return (
							<Alert
								key={violation.type}
								type={violation.duration === 0 ? 'error' : 'warning'}
								message={getMessage(violation.type, violation.metadata)}
								showIcon
								style={{ marginBottom: 8 }}
							/>
						);
					})}
				</Card>
			)}

			{/* Warning: Leave page */}
			<Alert
				message={t('exam.warning')}
				description={t('exam.warningMessage')}
				type="warning"
				showIcon
				style={{ marginTop: '16px' }}
			/>
		</div>
	);
};

export default TakeAssessment;
