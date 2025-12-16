import {
	DeleteOutlined,
	DragOutlined,
	EditOutlined,
	FileTextOutlined,
	FilterOutlined,
	LockOutlined,
	PlusOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
	Alert,
	Button,
	Card,
	Col,
	Divider,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Radio,
	Row,
	Select,
	Space,
	Table,
	Tag,
	Tooltip,
	Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import assessmentService from '../../services/assessmentService';
import questionService from '../../services/questionService';
import questionBankService from '../../services/questionBankService';
import {
	Assessment,
	AssessmentQuestion,
	AssessmentStatus,
	DifficultyLevel,
	PaginationParams,
	Question,
	QuestionBank,
	QuestionType,
} from '../../types';
import { getRemainingPoints, POINTS_VALIDATION } from '../../utils/assessmentHelpers';
import { showError, showSuccess } from '../../utils/errorHandler';

const { Text } = Typography;

interface Props {
	assessment: Assessment;
	questions?: AssessmentQuestion[];
	hasAttempts?: boolean;
	onQuestionsChange?: () => void;
}

const difficultyColors = {
	[DifficultyLevel.Easy]: 'success',
	[DifficultyLevel.Medium]: 'warning',
	[DifficultyLevel.Hard]: 'error',
};

const MAX_TOTAL_POINTS = POINTS_VALIDATION.TOTAL_MAX;

export const ManageAssessmentQuestions: React.FC<Props> = ({
	assessment,
	questions: initialQuestions,
	hasAttempts = false,
	onQuestionsChange,
}) => {
	const { t } = useTranslation();
	const assessmentId = assessment.id;
	// Use hasAttempts prop instead of assessment.has_attempts
	const isQuestionsLocked =
		assessment.status === AssessmentStatus.Archived ||
		(hasAttempts &&
			(assessment.status === AssessmentStatus.Active ||
				assessment.status === AssessmentStatus.Expired));

	const lockReason = isQuestionsLocked
		? assessment.status === AssessmentStatus.Archived
			? t('assessment.lockReason.archived')
			: t('assessment.lockReason.hasAttempts')
		: null;

	// Helper functions for translated labels
	const getDifficultyLabel = (difficulty: DifficultyLevel) => {
		const labels: Record<DifficultyLevel, string> = {
			[DifficultyLevel.Easy]: t('manageAssessmentQuestions.difficulty.easy'),
			[DifficultyLevel.Medium]: t('manageAssessmentQuestions.difficulty.medium'),
			[DifficultyLevel.Hard]: t('manageAssessmentQuestions.difficulty.hard'),
		};
		return labels[difficulty];
	};

	const getTypeLabel = (type: QuestionType) => {
		const labels: Record<QuestionType, string> = {
			[QuestionType.MultipleChoice]: t(
				'manageAssessmentQuestions.questionType.multipleChoice'
			),
			[QuestionType.TrueFalse]: t('manageAssessmentQuestions.questionType.trueFalse'),
			[QuestionType.Essay]: t('manageAssessmentQuestions.questionType.essay'),
			[QuestionType.FillBlank]: t('manageAssessmentQuestions.questionType.fillBlank'),
			[QuestionType.Matching]: t('manageAssessmentQuestions.questionType.matching'),
			[QuestionType.Ordering]: t('manageAssessmentQuestions.questionType.ordering'),
			[QuestionType.ShortAnswer]: t('manageAssessmentQuestions.questionType.shortAnswer'),
		};
		return labels[type];
	};

	// Drag handle component
	const DragHandle = ({ id }: { id: number }) => {
		const { attributes, listeners } = useSortable({ id });
		return (
			<DragOutlined
				{...attributes}
				{...listeners}
				style={{ cursor: 'grab', color: '#999' }}
			/>
		);
	};

	// Sortable row component
	const SortableRow = (props: any) => {
		const { setNodeRef, transform, transition, isDragging } = useSortable({
			id: props['data-row-key'],
		});

		const style = {
			transform: CSS.Transform.toString(transform),
			transition,
			...(isDragging ? { position: 'relative' as const, zIndex: 9999 } : {}),
		};

		return <tr {...props} ref={setNodeRef} style={style} />;
	};

	const [questions, setQuestions] = useState<AssessmentQuestion[]>(initialQuestions || []);
	const [loading, setLoading] = useState(false);
	const [addModalVisible, setAddModalVisible] = useState(false);
	const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
	const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
	// Track points for each selected question
	const [questionPoints, setQuestionPoints] = useState<Record<number, number>>({});
	const [addLoading, setAddLoading] = useState(false);
	const [fetchingQuestions, setFetchingQuestions] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [filterType, setFilterType] = useState<string | undefined>();
	const [filterDifficulty, setFilterDifficulty] = useState<string | undefined>();
	const [filterBank, setFilterBank] = useState<number | undefined>();
	const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
	const [pagination, setPagination] = useState({
		page: 1,
		size: 10,
		total: 0,
	});
	// Add mode selection: 'manual', 'auto-assign', or 'auto-scale'
	const [addMode, setAddMode] = useState<'manual' | 'auto-assign' | 'auto-scale'>('manual');

	// Bulk actions states
	const [selectedRows, setSelectedRows] = useState<number[]>([]);
	const [bulkModalVisible, setBulkModalVisible] = useState(false);
	const [bulkForm] = Form.useForm();
	const [bulkLoading, setBulkLoading] = useState(false);

	// Calculate total points
	const totalPoints = useMemo(() => {
		return questions.reduce((sum, q) => {
			const points = q.points ?? q.question?.points;
			return sum + (points || 0);
		}, 0);
	}, [questions]);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	useEffect(() => {
		if (initialQuestions) {
			setQuestions(initialQuestions);
		} else {
			fetchQuestions();
		}
	}, [assessmentId, initialQuestions]);

	const fetchQuestions = async () => {
		if (initialQuestions) return;
		setLoading(true);
		try {
			const data = await assessmentService.getAssessmentQuestions(assessmentId);
			setQuestions(data.questions);
		} catch (error) {
			// Error handled by interceptor
		} finally {
			setLoading(false);
		}
	};

	const fetchAvailableQuestions = async (params?: PaginationParams) => {
		setFetchingQuestions(true);
		try {
			// Get existing question IDs for server-side exclusion
			const existingQuestionIds = questions.map((q) => q.question_id);

			// Use GET /questions with all filter parameters
			const data = await questionService.getQuestions({
				page: params?.page || 1,
				size: params?.size || 10,
				search: searchText || undefined,
				type: filterType || undefined,
				difficulty: filterDifficulty || undefined,
				bank_id: filterBank || undefined,
				exclude_ids: existingQuestionIds.length > 0 ? existingQuestionIds : undefined,
			});

			setAvailableQuestions(data.questions || []);
			setPagination({
				page: data.page > 0 ? data.page : 1,
				size: data.size,
				total: data.total,
			});
		} catch (error) {
			// Error handled by interceptor
		} finally {
			setFetchingQuestions(false);
		}
	};

	const handleAddQuestions = async () => {
		if (addMode === 'auto-assign') {
			// Auto-assign mode: just send question IDs
			setAddLoading(true);
			try {
				await assessmentService.autoAssignQuestions(assessmentId, selectedQuestions);
				showSuccess(
					t('manageAssessmentQuestions.autoAssignSuccess', {
						count: selectedQuestions.length,
					})
				);
				setAddModalVisible(false);
				setSelectedQuestions([]);
				setQuestionPoints({});
				setAddMode('manual'); // Reset to manual mode
				onQuestionsChange?.();
			} catch (error: any) {
				// Handle specific lock error
				if (error.response?.status === 422) {
					const details = error.response.data?.details;
					if (details?.rule === 'assessment_questions_locked') {
						showError(
							t('manageAssessmentQuestions.cannotAddQuestions') +
								' - ' +
								(details.context?.has_attempts
									? t('manageAssessmentQuestions.studentsStarted')
									: t('manageAssessmentQuestions.assessmentArchived'))
						);
						// Refresh to update UI state
						onQuestionsChange?.();
						return;
					}
				}
				if (error.response?.status === 400) {
					const message = error.response.data?.message;
					if (message?.includes('exceeding maximum')) {
						showError(message);
						return;
					}
				}
				// Error handled by interceptor for other cases
			} finally {
				setAddLoading(false);
			}
			return;
		}

		// Auto-scale mode: scale proportionally based on question default points
		if (addMode === 'auto-scale') {
			const questionsToAdd: Array<{
				question_id: number;
				order: number;
				points: number;
			}> = [];
			const startOrder = questions.length + 1;

			// Get all questions with their default points
			const allQuestions = [
				...questions.map((q) => ({
					id: q.question_id,
					defaultPoints: q.points ?? q.question?.points ?? 10,
				})),
				...selectedQuestions.map((id) => {
					const question = availableQuestions.find((q) => q.id === id);
					return {
						id,
						defaultPoints: question?.points ?? 10,
					};
				}),
			];

			// Calculate total default points
			const totalDefaultPoints = allQuestions.reduce((sum, q) => sum + q.defaultPoints, 0);

			// Scale each question proportionally
			const scaleFactor = 100 / totalDefaultPoints;
			const scaledPoints = allQuestions.map((q) => ({
				id: q.id,
				scaledPoints: Math.round(q.defaultPoints * scaleFactor),
			}));

			// Adjust for rounding errors to ensure total is exactly 100
			let currentTotal = scaledPoints.reduce((sum, q) => sum + q.scaledPoints, 0);
			let diff = 100 - currentTotal;

			// Distribute the difference to largest questions first
			if (diff !== 0) {
				const sorted = [...scaledPoints].sort((a, b) => b.scaledPoints - a.scaledPoints);
				let idx = 0;
				while (diff !== 0) {
					if (diff > 0) {
						sorted[idx].scaledPoints++;
						diff--;
					} else {
						if (sorted[idx].scaledPoints > 1) {
							sorted[idx].scaledPoints--;
							diff++;
						}
					}
					idx = (idx + 1) % scaledPoints.length;
				}
			}

			// Add new questions with scaled points
			for (let i = 0; i < selectedQuestions.length; i++) {
				const questionId = selectedQuestions[i];
				const scaledPointsForQuestion =
					scaledPoints.find((p) => p.id === questionId)?.scaledPoints ?? 10;

				questionsToAdd.push({
					question_id: questionId,
					order: startOrder + i,
					points: scaledPointsForQuestion,
				});
			}

			// Update existing questions' points
			const existingUpdates = questions.map((q) => {
				const scaledPointsForQuestion =
					scaledPoints.find((p) => p.id === q.question_id)?.scaledPoints ?? 10;
				return {
					question_id: q.question_id,
					points: scaledPointsForQuestion,
				};
			});

			// Update existing questions first if needed
			if (existingUpdates.length > 0) {
				try {
					await assessmentService.bulkUpdateQuestionSettings(
						assessmentId,
						existingUpdates
					);
				} catch (error) {
					showError(t('manageAssessmentQuestions.failedToScalePoints'));
					setAddLoading(false);
					return;
				}
			}

			// Then add new questions
			setAddLoading(true);
			try {
				await assessmentService.bulkAddQuestionsToAssessment(assessmentId, questionsToAdd);
				showSuccess(
					t('manageAssessmentQuestions.autoScaleSuccess', {
						count: selectedQuestions.length,
					})
				);
				setAddModalVisible(false);
				setSelectedQuestions([]);
				setQuestionPoints({});
				setAddMode('manual');
				onQuestionsChange?.();
			} catch (error: any) {
				// Handle specific lock error
				if (error.response?.status === 422) {
					const details = error.response.data?.details;
					if (details?.rule === 'assessment_questions_locked') {
						showError(
							t('manageAssessmentQuestions.cannotAddQuestions') +
								' - ' +
								(details.context?.has_attempts
									? t('manageAssessmentQuestions.studentsStarted')
									: t('manageAssessmentQuestions.assessmentArchived'))
						);
						onQuestionsChange?.();
						return;
					}
				}
				// Error handled by interceptor for other cases
			} finally {
				setAddLoading(false);
			}
			return;
		}

		// Manual mode: validate and send with points
		// Validate that all selected questions have points
		const questionsToAdd: Array<{
			question_id: number;
			order: number;
			points: number;
		}> = [];
		const startOrder = questions.length + 1;

		for (let i = 0; i < selectedQuestions.length; i++) {
			const questionId = selectedQuestions[i];
			const points = questionPoints[questionId];

			if (!points || points < POINTS_VALIDATION.MIN || points > POINTS_VALIDATION.MAX) {
				showError(
					t('manageAssessmentQuestions.invalidPoints', {
						min: POINTS_VALIDATION.MIN,
						max: POINTS_VALIDATION.MAX,
					})
				);
				return;
			}

			questionsToAdd.push({
				question_id: questionId,
				order: startOrder + i,
				points: points,
			});
		}

		// Validate total points
		const newTotal = totalPoints + questionsToAdd.reduce((sum, q) => sum + q.points, 0);
		if (newTotal > MAX_TOTAL_POINTS) {
			showError(
				t('manageAssessmentQuestions.totalPointsExceeded', {
					max: MAX_TOTAL_POINTS,
					current: totalPoints,
					add: questionsToAdd.reduce((sum, q) => sum + q.points, 0),
					new: newTotal,
				})
			);
			return;
		}

		setAddLoading(true);
		try {
			await assessmentService.bulkAddQuestionsToAssessment(assessmentId, questionsToAdd);
			showSuccess(
				t('manageAssessmentQuestions.addedQuestions', {
					count: selectedQuestions.length,
				})
			);
			setAddModalVisible(false);
			setSelectedQuestions([]);
			setQuestionPoints({});
			onQuestionsChange?.();
		} catch (error: any) {
			// Handle specific lock error
			if (error.response?.status === 422) {
				const details = error.response.data?.details;
				if (details?.rule === 'assessment_questions_locked') {
					showError(
						t('manageAssessmentQuestions.cannotAddQuestion') +
							' - ' +
							(details.context?.has_attempts
								? t('manageAssessmentQuestions.studentsStarted')
								: t('manageAssessmentQuestions.assessmentArchived'))
					);
					// Refresh to update UI state
					onQuestionsChange?.();
					return;
				}
			}
			// Error handled by interceptor for other cases
		} finally {
			setAddLoading(false);
		}
	};

	const handleRemoveQuestion = async (questionId: number) => {
		try {
			await assessmentService.removeQuestionFromAssessment(assessmentId, questionId);
			showSuccess(t('manageAssessmentQuestions.removeSuccess'));
			onQuestionsChange?.();
		} catch (error: any) {
			// Handle specific lock error
			if (error.response?.status === 422) {
				const details = error.response.data?.details;
				if (details?.rule === 'assessment_questions_locked') {
					showError(
						t('manageAssessmentQuestions.cannotRemoveQuestion') +
							' - ' +
							(details.context?.has_attempts
								? t('manageAssessmentQuestions.studentsStarted')
								: t('manageAssessmentQuestions.assessmentArchived'))
					);
					onQuestionsChange?.();
					return;
				}
			}
			// Error handled by interceptor for other cases
		}
	};

	const handleDragEnd = async (event: any) => {
		const { active, over } = event;

		if (active.id !== over.id) {
			const oldIndex = questions.findIndex((q) => q.question_id === active.id);
			const newIndex = questions.findIndex((q) => q.question_id === over.id);

			const newQuestions = arrayMove(questions, oldIndex, newIndex);
			setQuestions(newQuestions);

			// Update order on server
			try {
				const question_orders = newQuestions.map((q, index) => ({
					question_id: q.question_id,
					order: index + 1,
				}));
				await assessmentService.reorderAssessmentQuestions(assessmentId, {
					question_orders,
				});
				showSuccess(t('manageAssessmentQuestions.reorderSuccess'));
				// Don't call onQuestionsChange - local state is already updated optimistically
			} catch (error: any) {
				// Handle specific lock error
				if (error.response?.status === 422) {
					const details = error.response.data?.details;
					if (details?.rule === 'assessment_questions_locked') {
						showError(
							t('manageAssessmentQuestions.cannotReorder') +
								' - ' +
								(details.context?.has_attempts
									? t('manageAssessmentQuestions.studentsStarted')
									: t('manageAssessmentQuestions.assessmentArchived'))
						);
					}
				}
				// Revert on error
				setQuestions(questions);
				onQuestionsChange?.();
			}
		}
	};

	// Inline editing handlers
	const handleUpdatePoints = async (questionId: number, points: number | null) => {
		if (points === null || points < 0) {
			showError(t('manageAssessmentQuestions.pointsMustBePositive'));
			return;
		}

		// Calculate new total
		const otherQuestionsPoints = questions
			.filter((q: any) => q.question_id !== questionId)
			.reduce((sum, q: any) => sum + ((q.points ?? q.question?.points) || 0), 0);

		const newTotal = otherQuestionsPoints + points;

		if (newTotal > MAX_TOTAL_POINTS) {
			showError(
				t('manageAssessmentQuestions.totalPointsMaxExceeded', {
					max: MAX_TOTAL_POINTS,
					total: newTotal,
				})
			);
			return;
		}

		try {
			await assessmentService.updateQuestionSettings(assessmentId, questionId, { points });
			// Update local state optimistically instead of triggering full refetch
			setQuestions((prev) =>
				prev.map((q) => (q.question_id === questionId ? { ...q, points } : q))
			);
			showSuccess(t('manageAssessmentQuestions.updatePointsSuccess'));
		} catch (error: any) {
			// Handle specific lock error
			if (error.response?.status === 422) {
				const details = error.response.data?.details;
				if (details?.rule === 'assessment_questions_locked') {
					showError(
						t('manageAssessmentQuestions.cannotUpdatePoints') +
							' - ' +
							(details.context?.has_attempts
								? t('manageAssessmentQuestions.studentsStarted')
								: t('manageAssessmentQuestions.assessmentArchived'))
					);
					onQuestionsChange?.();
					return;
				}
			}
			// Error handled by interceptor for other cases
		}
	};

	// Bulk actions handlers
	const handleBulkUpdate = () => {
		if (selectedRows.length === 0) {
			showError(t('manageAssessmentQuestions.selectAtLeastOne'));
			return;
		}
		setBulkModalVisible(true);
	};

	const handleBulkUpdateSubmit = async () => {
		try {
			const values = await bulkForm.validateFields();
			setBulkLoading(true);

			const updates = selectedRows.map((questionId) => ({
				question_id: questionId,
				...(values.points !== undefined && { points: values.points }),
				// time_limit deprecated - not used in timing logic
				// ...(values.time_limit !== undefined && {time_limit: values.time_limit}),
			}));

			// Validate total points if updating points
			if (values.points !== undefined) {
				const unchangedQuestions = questions.filter(
					(q: any) => !selectedRows.includes(q.question_id)
				);
				const unchangedPoints = unchangedQuestions.reduce(
					(sum, q: any) => sum + ((q.points ?? q.question?.points) || 0),
					0
				);
				const newTotal = unchangedPoints + values.points * selectedRows.length;

				if (newTotal > MAX_TOTAL_POINTS) {
					showError(
						t('manageAssessmentQuestions.totalPointsMaxExceeded', {
							max: MAX_TOTAL_POINTS,
							total: newTotal,
						})
					);
					setBulkLoading(false);
					return;
				}
			}

			await assessmentService.bulkUpdateQuestionSettings(assessmentId, updates);
			showSuccess(
				t('manageAssessmentQuestions.bulkUpdateSuccess', {
					count: selectedRows.length,
				})
			);
			setBulkModalVisible(false);
			setSelectedRows([]);
			bulkForm.resetFields();
			onQuestionsChange?.();
		} catch (error: any) {
			// Handle specific lock error
			if (error.response?.status === 422) {
				const details = error.response.data?.details;
				if (details?.rule === 'assessment_questions_locked') {
					showError(
						t('manageAssessmentQuestions.cannotBulkUpdate') +
							' - ' +
							(details.context?.has_attempts
								? t('manageAssessmentQuestions.studentsStarted')
								: t('manageAssessmentQuestions.assessmentArchived'))
					);
					onQuestionsChange?.();
					setBulkLoading(false);
					return;
				}
			}
			// Error handled by interceptor or form validation
		} finally {
			setBulkLoading(false);
		}
	};

	const columns: ColumnsType<AssessmentQuestion> = [
		{
			title: '',
			dataIndex: 'drag',
			width: 50,
			render: (_, record) =>
				isQuestionsLocked ? null : <DragHandle id={record.question_id} />,
		},
		{
			title: t('manageAssessmentQuestions.columnOrder'),
			dataIndex: 'order',
			width: 70,
			render: (order) => <Text strong>{order}</Text>,
		},
		{
			title: t('manageAssessmentQuestions.columnQuestion'),
			dataIndex: ['question', 'text'],
			ellipsis: true,
		},
		{
			title: t('manageAssessmentQuestions.columnType'),
			width: 150,
			render: (_, record: any) => <Tag>{getTypeLabel(record.question?.type) || 'N/A'}</Tag>,
		},
		{
			title: t('manageAssessmentQuestions.columnDifficulty'),
			width: 120,
			render: (_, record: any) => (
				<Tag color={difficultyColors[record.question?.difficulty] || 'default'}>
					{getDifficultyLabel(record.question?.difficulty) || 'N/A'}
				</Tag>
			),
		},
		{
			title: t('manageAssessmentQuestions.columnPoints'),
			dataIndex: 'points',
			width: 120,
			render: (points, record: any) => {
				const effectivePoints = points ?? record.question?.points;
				return (
					<Tooltip
						title={
							isQuestionsLocked
								? t('manageAssessmentQuestions.questionsLocked')
								: undefined
						}
					>
						<InputNumber
							size="small"
							min={0}
							max={MAX_TOTAL_POINTS}
							defaultValue={effectivePoints}
							style={{ width: '100%' }}
							disabled={isQuestionsLocked}
							onBlur={(e: any) => {
								const value = parseFloat(e.target.value);
								if (!isNaN(value) && value !== effectivePoints) {
									handleUpdatePoints(record.question_id, value);
								}
							}}
							onPressEnter={(e: any) => {
								const value = parseFloat(e.target.value);
								if (!isNaN(value) && value !== effectivePoints) {
									handleUpdatePoints(record.question_id, value);
									e.target.blur();
								}
							}}
						/>
					</Tooltip>
				);
			},
		},

		{
			title: t('manageAssessmentQuestions.columnActions'),
			width: 100,
			render: (_, record) => (
				<Popconfirm
					title={t('manageAssessmentQuestions.confirmDelete')}
					description={t('manageAssessmentQuestions.confirmDeleteDesc')}
					onConfirm={() => handleRemoveQuestion(record.question_id)}
					okText={t('manageAssessmentQuestions.delete')}
					cancelText={t('manageAssessmentQuestions.cancel')}
					disabled={isQuestionsLocked}
				>
					<Button
						type="text"
						danger
						icon={<DeleteOutlined />}
						size="small"
						disabled={isQuestionsLocked}
					/>
				</Popconfirm>
			),
		},
	];

	const availableColumns: ColumnsType<Question> = [
		{
			title: t('manageAssessmentQuestions.columnQuestion'),
			dataIndex: 'text',
			ellipsis: true,
		},
		{
			title: t('manageAssessmentQuestions.columnType'),
			dataIndex: 'type',
			width: 150,
			render: (type: QuestionType) => <Tag>{getTypeLabel(type)}</Tag>,
		},
		{
			title: t('manageAssessmentQuestions.columnDifficulty'),
			dataIndex: 'difficulty',
			width: 120,
			render: (difficulty: DifficultyLevel) => (
				<Tag color={difficultyColors[difficulty]}>{getDifficultyLabel(difficulty)}</Tag>
			),
		},
		{
			title: t('manageAssessmentQuestions.columnPoints'),
			dataIndex: 'points',
			width: 120,
			render: (_, record) => {
				// In auto-assign mode, don't show point inputs
				if (addMode === 'auto-assign') {
					return (
						<Text type="secondary">{t('manageAssessmentQuestions.autoPoints')}</Text>
					);
				}

				const isSelected = selectedQuestions.includes(record.id);
				const currentValue = questionPoints[record.id] || record.points || 10;
				const remainingPoints = getRemainingPoints(totalPoints);

				return isSelected ? (
					<InputNumber
						size="small"
						min={POINTS_VALIDATION.MIN}
						max={Math.min(
							POINTS_VALIDATION.MAX,
							remainingPoints + (questionPoints[record.id] || 0)
						)}
						value={currentValue}
						placeholder={t('manageAssessmentQuestions.pointsLabel')}
						style={{ width: '100%' }}
						onChange={(value) => {
							if (value) {
								setQuestionPoints((prev) => ({
									...prev,
									[record.id]: value,
								}));
							}
						}}
					/>
				) : (
					<Text type="secondary">{record.points || 10}</Text>
				);
			},
		},
	];

	return (
		<>
			<Card
				title={
					<Space>
						<span>
							{t('manageAssessmentQuestions.cardTitle')} ({questions.length})
						</span>
						{isQuestionsLocked && (
							<Tag icon={<LockOutlined />} color="warning">
								{t('manageAssessmentQuestions.locked')}
							</Tag>
						)}
					</Space>
				}
				extra={
					!isQuestionsLocked && (
						<Button
							type="primary"
							icon={<PlusOutlined />}
							onClick={() => {
								setAddModalVisible(true);
								fetchAvailableQuestions({ page: 1, size: 10 });
								// Fetch question banks for the filter dropdown
								questionBankService
									.getQuestionBanks({ page: 1, size: 100 })
									.then((res) => {
										setQuestionBanks(res.banks || []);
									})
									.catch(() => {});
							}}
							title={t('manageAssessmentQuestions.addQuestion')}
						>
							{t('manageAssessmentQuestions.addQuestion')}
						</Button>
					)
				}
			>
				{/* Lock warning */}
				{isQuestionsLocked && lockReason && (
					<Alert
						message={t('manageAssessmentQuestions.questionsLocked')}
						description={lockReason}
						type="warning"
						showIcon
						icon={<LockOutlined />}
						style={{ marginBottom: 16 }}
					/>
				)}

				{/* Total points indicator */}
				<Alert
					message={
						<Space>
							<Text strong>{t('manageAssessmentQuestions.totalPoints')}:</Text>
							<Text
								style={{
									color:
										totalPoints > MAX_TOTAL_POINTS
											? '#ff4d4f'
											: totalPoints === MAX_TOTAL_POINTS
												? '#52c41a'
												: '#1890ff',
									fontSize: 16,
									fontWeight: 'bold',
								}}
							>
								{totalPoints} / {MAX_TOTAL_POINTS}
							</Text>
						</Space>
					}
					type={
						totalPoints > MAX_TOTAL_POINTS
							? 'error'
							: totalPoints === MAX_TOTAL_POINTS
								? 'success'
								: 'info'
					}
					showIcon
					style={{ marginBottom: 16 }}
					description={
						totalPoints > MAX_TOTAL_POINTS
							? t('manageAssessmentQuestions.exceededBy', {
									points: Math.abs(MAX_TOTAL_POINTS - totalPoints),
								})
							: undefined
					}
				/>

				{/* Bulk actions toolbar */}
				{selectedRows.length > 0 && (
					<Space style={{ marginBottom: 16 }}>
						<Tag color="blue">
							{t('manageAssessmentQuestions.selectedQuestions', {
								count: selectedRows.length,
							})}
						</Tag>
						<Button
							icon={<EditOutlined />}
							onClick={handleBulkUpdate}
							type="primary"
							disabled={isQuestionsLocked}
						>
							{t('manageAssessmentQuestions.bulkUpdate')}
						</Button>
						<Button onClick={() => setSelectedRows([])}>
							{t('manageAssessmentQuestions.deselect')}
						</Button>
					</Space>
				)}

				{questions.length > 0 ? (
					<div
						style={{
							opacity: isQuestionsLocked ? 0.6 : 1,
							pointerEvents: isQuestionsLocked ? 'none' : 'auto',
						}}
					>
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={questions.map((q) => q.question_id)}
								strategy={verticalListSortingStrategy}
							>
								<Table
									columns={columns}
									dataSource={questions}
									rowKey="question_id"
									loading={loading}
									pagination={false}
									rowSelection={
										isQuestionsLocked
											? undefined
											: {
													selectedRowKeys: selectedRows,
													onChange: (keys) =>
														setSelectedRows(keys as number[]),
												}
									}
									components={{
										body: {
											row: SortableRow,
										},
									}}
									locale={{
										emptyText: t('manageAssessmentQuestions.noQuestions'),
									}}
								/>
							</SortableContext>
						</DndContext>
					</div>
				) : (
					<Table
						columns={columns}
						dataSource={[]}
						rowKey="question_id"
						loading={loading}
						pagination={false}
						locale={{
							emptyText: t('manageAssessmentQuestions.noQuestions'),
						}}
					/>
				)}
			</Card>

			<Modal
				title={t('manageAssessmentQuestions.addToAssessmentModal')}
				open={addModalVisible}
				onCancel={() => {
					setAddModalVisible(false);
					setSelectedQuestions([]);
					setQuestionPoints({});
					setAddMode('manual'); // Reset mode
					setFilterBank(undefined); // Reset bank filter
				}}
				onOk={handleAddQuestions}
				okText={t('manageAssessmentQuestions.add')}
				cancelText={t('manageAssessmentQuestions.cancel')}
				width={900}
				confirmLoading={addLoading}
				okButtonProps={{ disabled: selectedQuestions.length === 0 }}
				styles={{
					body: {
						maxHeight: 'calc(100vh - 300px)',
						overflowY: 'auto',
						overflowX: 'hidden',
					},
				}}
			>
				<Space direction="vertical" size="middle" style={{ width: '100%', marginTop: 16 }}>
					{/* Mode selection */}
					<Card size="small" style={{ backgroundColor: '#f0f5ff' }}>
						<Space direction="vertical" size="small" style={{ width: '100%' }}>
							<Text strong>{t('manageAssessmentQuestions.selectAddMethod')}</Text>
							<Radio.Group
								value={addMode}
								onChange={(e) => setAddMode(e.target.value)}
								style={{ width: '100%' }}
							>
								<Space direction="vertical">
									<Radio value="manual">
										<Space direction="vertical" size={0}>
											<Text strong>
												{t('manageAssessmentQuestions.manualPoints')}
											</Text>
											<Text type="secondary" style={{ fontSize: 12 }}>
												{t('manageAssessmentQuestions.manualPointsDesc')}
											</Text>
										</Space>
									</Radio>
									<Radio value="auto-assign">
										<Space direction="vertical" size={0}>
											<Text strong>
												{t('manageAssessmentQuestions.autoAssign')}
											</Text>
											<Text type="secondary" style={{ fontSize: 12 }}>
												{t('manageAssessmentQuestions.autoAssignDesc')}
											</Text>
										</Space>
									</Radio>
									<Radio value="auto-scale">
										<Space direction="vertical" size={0}>
											<Text strong>
												{t('manageAssessmentQuestions.autoScale')}
											</Text>
											<Text type="secondary" style={{ fontSize: 12 }}>
												{t('manageAssessmentQuestions.autoScaleDesc')}
											</Text>
										</Space>
									</Radio>
								</Space>
							</Radio.Group>
						</Space>
					</Card>

					{/* Filter info */}
					{questions.length > 0 && (
						<Alert
							message={t('manageAssessmentQuestions.filteredInfo', {
								count: questions.length,
							})}
							type="info"
							showIcon
							closable
						/>
					)}

					{/* Auto-assign preview and warning */}
					{addMode === 'auto-assign' && selectedQuestions.length > 0 && (
						<>
							<Alert
								message={t('manageAssessmentQuestions.previewDistribution')}
								description={
									<Space direction="vertical" size="small">
										<Text>
											{t('manageAssessmentQuestions.totalQuestionsLabel')}:{' '}
											<Text strong>
												{questions.length + selectedQuestions.length}
											</Text>{' '}
											{t('manageAssessmentQuestions.questionsUnit')}(
											{questions.length}{' '}
											{t('manageAssessmentQuestions.existingQuestions')} +{' '}
											{selectedQuestions.length}{' '}
											{t('manageAssessmentQuestions.newQuestions')})
										</Text>
										<Text>
											{t('manageAssessmentQuestions.pointsPerQuestion')}:{' '}
											<Text strong style={{ color: '#1890ff' }}>
												{Math.floor(
													100 /
														(questions.length +
															selectedQuestions.length)
												)}{' '}
												{t('gradingDetail.pointsUnit')}
											</Text>
											{100 % (questions.length + selectedQuestions.length) >
												0 && (
												<Text type="secondary" style={{ fontSize: 12 }}>
													{' '}
													(
													{t('manageAssessmentQuestions.extraPointNote', {
														count:
															100 %
															(questions.length +
																selectedQuestions.length),
													})}
													)
												</Text>
											)}
										</Text>
									</Space>
								}
								type="info"
								showIcon
							/>
							<Alert
								message={t('manageAssessmentQuestions.importantNote')}
								description={
									<ul
										style={{
											margin: 0,
											paddingLeft: 20,
										}}
									>
										<li>{t('manageAssessmentQuestions.autoAssignWarning1')}</li>
										<li>{t('manageAssessmentQuestions.autoAssignWarning2')}</li>
										<li>{t('manageAssessmentQuestions.autoAssignWarning3')}</li>
									</ul>
								}
								type="warning"
								showIcon
							/>
						</>
					)}

					{/* Points info for manual mode */}
					{addMode === 'manual' && (
						<Alert
							message={
								<Space>
									<Text>{t('manageAssessmentQuestions.availablePoints')}:</Text>
									<Text strong style={{ color: '#1890ff' }}>
										{getRemainingPoints(totalPoints)} / {MAX_TOTAL_POINTS}
									</Text>
								</Space>
							}
							type="info"
							showIcon
							description={t('manageAssessmentQuestions.manualPointsHint')}
						/>
					)}

					<Row gutter={[8, 8]}>
						<Col span={12}>
							<Input
								placeholder={t('manageAssessmentQuestions.searchPlaceholder')}
								prefix={<SearchOutlined />}
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								onPressEnter={() =>
									fetchAvailableQuestions({
										page: 1,
										size: 10,
									})
								}
								disabled={fetchingQuestions}
							/>
						</Col>
						<Col span={12}>
							<Select
								placeholder={t('manageAssessmentQuestions.filterByBank')}
								allowClear
								style={{ width: '100%' }}
								value={filterBank}
								onChange={(value) => {
									setFilterBank(value);
									// Auto-fetch when bank changes
									setTimeout(
										() => fetchAvailableQuestions({ page: 1, size: 10 }),
										0
									);
								}}
								disabled={fetchingQuestions}
								showSearch
								optionFilterProp="children"
							>
								{questionBanks.map((bank) => (
									<Select.Option key={bank.id} value={bank.id}>
										{bank.name} ({bank.question_count || 0})
									</Select.Option>
								))}
							</Select>
						</Col>
						<Col span={12}>
							<Select
								placeholder={t('manageAssessmentQuestions.filterByType')}
								allowClear
								style={{ width: '100%' }}
								value={filterType}
								onChange={(value) => setFilterType(value)}
								disabled={fetchingQuestions}
							>
								{Object.values(QuestionType).map((type) => (
									<Select.Option key={type} value={type}>
										{getTypeLabel(type)}
									</Select.Option>
								))}
							</Select>
						</Col>
						<Col span={12}>
							<Select
								placeholder={t('manageAssessmentQuestions.filterByDifficulty')}
								allowClear
								style={{ width: '100%' }}
								value={filterDifficulty}
								onChange={(value) => setFilterDifficulty(value)}
								disabled={fetchingQuestions}
							>
								{Object.values(DifficultyLevel).map((level) => (
									<Select.Option key={level} value={level}>
										{getDifficultyLabel(level)}
									</Select.Option>
								))}
							</Select>
						</Col>
					</Row>

					<Space>
						<Button
							icon={<FilterOutlined />}
							onClick={() => fetchAvailableQuestions({ page: 1, size: 10 })}
							loading={fetchingQuestions}
							disabled={fetchingQuestions}
						>
							{fetchingQuestions
								? t('manageAssessmentQuestions.searching')
								: t('manageAssessmentQuestions.filter')}
						</Button>
						{!fetchingQuestions && availableQuestions.length > 0 && (
							<Text type="secondary">
								{t('manageAssessmentQuestions.foundQuestions', {
									count: availableQuestions.length,
								})}
							</Text>
						)}
						{fetchingQuestions && (
							<Text type="secondary">
								{t('manageAssessmentQuestions.loadingQuestions')}
							</Text>
						)}
					</Space>

					<Divider style={{ margin: '12px 0' }} />

					<Table
						size="small"
						columns={availableColumns}
						dataSource={availableQuestions}
						rowKey="id"
						loading={fetchingQuestions}
						rowSelection={{
							selectedRowKeys: selectedQuestions,
							onChange: (keys) => {
								setSelectedQuestions(keys as number[]);
								// Initialize points for newly selected questions
								const newPoints = { ...questionPoints };
								keys.forEach((key) => {
									if (!newPoints[key as number]) {
										const q = availableQuestions.find((q) => q.id === key);
										newPoints[key as number] = q?.points || 10;
									}
								});
								setQuestionPoints(newPoints);
							},
						}}
						pagination={{
							current: pagination.page,
							pageSize: pagination.size,
							total: pagination.total,
							onChange: (page, size) => {
								fetchAvailableQuestions({ page, size });
							},
						}}
						locale={{
							emptyText: (
								<Space
									direction="vertical"
									size="middle"
									style={{ padding: '40px 0' }}
								>
									<FileTextOutlined
										style={{
											fontSize: 48,
											color: '#bfbfbf',
										}}
									/>
									<Text type="secondary">
										{questions.length > 0
											? t('manageAssessmentQuestions.allQuestionsAdded')
											: t('manageAssessmentQuestions.noQuestionsFound')}
									</Text>
									{questions.length === 0 && (
										<Text type="secondary" style={{ fontSize: 12 }}>
											{t('manageAssessmentQuestions.tryChangeFilter')}
										</Text>
									)}
								</Space>
							),
						}}
					/>
				</Space>
			</Modal>

			{/* Bulk update modal */}
			<Modal
				title={t('manageAssessmentQuestions.bulkUpdateModal')}
				open={bulkModalVisible}
				onCancel={() => {
					setBulkModalVisible(false);
					bulkForm.resetFields();
				}}
				onOk={handleBulkUpdateSubmit}
				okText={t('manageAssessmentQuestions.update')}
				cancelText={t('manageAssessmentQuestions.cancel')}
				confirmLoading={bulkLoading}
			>
				<Alert
					message={t('manageAssessmentQuestions.bulkUpdateInfo', {
						count: selectedRows.length,
					})}
					type="info"
					showIcon
					style={{ marginBottom: 16 }}
				/>

				<Form form={bulkForm} layout="vertical">
					<Form.Item
						label={t('manageAssessmentQuestions.points')}
						name="points"
						help={t('manageAssessmentQuestions.leaveEmptyHint')}
					>
						<InputNumber
							min={0}
							max={MAX_TOTAL_POINTS}
							style={{ width: '100%' }}
							placeholder={t('manageAssessmentQuestions.pointsPlaceholder')}
						/>
					</Form.Item>

					<Alert
						message={t('manageAssessmentQuestions.note')}
						description={
							<ul style={{ margin: 0, paddingLeft: 20 }}>
								<li>{t('manageAssessmentQuestions.bulkUpdateNote1')}</li>
								<li>
									{t('manageAssessmentQuestions.bulkUpdateNote2', {
										max: MAX_TOTAL_POINTS,
									})}
								</li>
								<li>{t('manageAssessmentQuestions.bulkUpdateNote3')}</li>
							</ul>
						}
						type="warning"
						showIcon
					/>
				</Form>
			</Modal>
		</>
	);
};

export default ManageAssessmentQuestions;
