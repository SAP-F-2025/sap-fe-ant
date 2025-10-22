import React, {useEffect, useState, useMemo} from 'react';
import {
    Card,
    Table,
    Button,
    Space,
    Modal,
    Tag,
    Popconfirm,
    InputNumber,
    Form,
    Select,
    Input,
    Row,
    Col,
    Typography,
    Tooltip,
    Alert,
    Divider,
    Radio,
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    DragOutlined,
    SearchOutlined,
    FilterOutlined,
    EditOutlined,
    CheckOutlined,
    CloseOutlined,
    LockOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import {
    Assessment,
    AssessmentQuestion,
    Question,
    QuestionType,
    DifficultyLevel,
    PaginationParams,
} from '../../types';
import assessmentService from '../../services/assessmentService';
import questionService from '../../services/questionService';
import {showSuccess, showError} from '../../utils/errorHandler';
import {
    canEditQuestions,
    getQuestionsLockReason,
    POINTS_VALIDATION,
    validateQuestionPoints,
    wouldExceedTotalPoints,
    getRemainingPoints,
} from '../../utils/assessmentHelpers';
import {DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

const {Text} = Typography;

interface Props {
    assessment: Assessment;
    questions?: AssessmentQuestion[];
    onQuestionsChange?: () => void;
}

const difficultyColors = {
    [DifficultyLevel.Easy]: 'success',
    [DifficultyLevel.Medium]: 'warning',
    [DifficultyLevel.Hard]: 'error',
};

const difficultyLabels = {
    [DifficultyLevel.Easy]: 'Dễ',
    [DifficultyLevel.Medium]: 'Trung bình',
    [DifficultyLevel.Hard]: 'Khó',
};

const typeLabels = {
    [QuestionType.MultipleChoice]: 'Trắc nghiệm',
    [QuestionType.TrueFalse]: 'Đúng/Sai',
    [QuestionType.Essay]: 'Tự luận',
    [QuestionType.FillBlank]: 'Điền khuyết',
    [QuestionType.Matching]: 'Nối cặp',
    [QuestionType.Ordering]: 'Sắp xếp',
    [QuestionType.ShortAnswer]: 'Trả lời ngắn',
};

// Drag handle component
const DragHandle = ({id}: {id: number}) => {
    const {attributes, listeners} = useSortable({id});
    return <DragOutlined {...attributes} {...listeners} style={{cursor: 'grab', color: '#999'}} />;
};

// Sortable row component
const SortableRow = (props: any) => {
    const {setNodeRef, transform, transition, isDragging} = useSortable({
        id: props['data-row-key'],
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        ...(isDragging ? {position: 'relative' as const, zIndex: 9999} : {}),
    };

    return <tr {...props} ref={setNodeRef} style={style} />;
};

const MAX_TOTAL_POINTS = POINTS_VALIDATION.TOTAL_MAX;

export const ManageAssessmentQuestions: React.FC<Props> = ({
                                                               assessment,
                                                               questions: initialQuestions,
                                                               onQuestionsChange,
                                                           }) => {
    const assessmentId = assessment.id;
    const isQuestionsLocked = !canEditQuestions(assessment);
    const lockReason = getQuestionsLockReason(assessment);

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
    const [pagination, setPagination] = useState({page: 1, size: 10, total: 0});
    // Add mode selection: 'manual' or 'auto-assign'
    const [addMode, setAddMode] = useState<'manual' | 'auto-assign'>('manual');

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
            const data = await questionService.getQuestions({
                page: params?.page || 1,
                size: params?.size || 10,
                search: searchText || undefined,
                type: filterType,
                difficulty: filterDifficulty,
            });

            // Filter out questions already in assessment
            const existingQuestionIds = new Set(questions.map(q => q.question_id));
            const filteredQuestions = data.questions.filter(q => !existingQuestionIds.has(q.id));

            setAvailableQuestions(filteredQuestions);
            setPagination({
                page: data.page > 0 ? data.page : 1,
                size: data.size,
                total: filteredQuestions.length // Update total to reflect filtered count
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
                showSuccess(`Đã tự động phân phối điểm cho ${selectedQuestions.length} câu hỏi`);
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
                            'Không thể thêm câu hỏi - ' +
                            (details.context?.has_attempts
                                ? 'Sinh viên đã bắt đầu làm bài'
                                : 'Assessment đã được lưu trữ')
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

        // Manual mode: validate and send with points
        // Validate that all selected questions have points
        const questionsToAdd: Array<{ question_id: number; order: number; points: number }> = [];
        const startOrder = questions.length + 1;

        for (let i = 0; i < selectedQuestions.length; i++) {
            const questionId = selectedQuestions[i];
            const points = questionPoints[questionId];

            if (!points || points < POINTS_VALIDATION.MIN || points > POINTS_VALIDATION.MAX) {
                showError(`Vui lòng nhập điểm hợp lệ (${POINTS_VALIDATION.MIN}-${POINTS_VALIDATION.MAX}) cho tất cả câu hỏi`);
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
                `Tổng điểm sẽ vượt quá ${MAX_TOTAL_POINTS}. ` +
                `Tổng hiện tại: ${totalPoints}, Thêm: ${questionsToAdd.reduce((sum, q) => sum + q.points, 0)}, ` +
                `Tổng mới: ${newTotal}`
            );
            return;
        }

        setAddLoading(true);
        try {
            await assessmentService.bulkAddQuestionsToAssessment(assessmentId, questionsToAdd);
            showSuccess(`Đã thêm ${selectedQuestions.length} câu hỏi`);
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
                        'Không thể thêm câu hỏi - ' +
                        (details.context?.has_attempts
                            ? 'Sinh viên đã bắt đầu làm bài'
                            : 'Assessment đã được lưu trữ')
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
            showSuccess('Xóa câu hỏi thành công');
            onQuestionsChange?.();
        } catch (error: any) {
            // Handle specific lock error
            if (error.response?.status === 422) {
                const details = error.response.data?.details;
                if (details?.rule === 'assessment_questions_locked') {
                    showError(
                        'Không thể xóa câu hỏi - ' +
                        (details.context?.has_attempts
                            ? 'Sinh viên đã bắt đầu làm bài'
                            : 'Assessment đã được lưu trữ')
                    );
                    onQuestionsChange?.();
                    return;
                }
            }
            // Error handled by interceptor for other cases
        }
    };

    const handleDragEnd = async (event: any) => {
        const {active, over} = event;

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
                showSuccess('Đã cập nhật thứ tự câu hỏi');
                onQuestionsChange?.();
            } catch (error: any) {
                // Handle specific lock error
                if (error.response?.status === 422) {
                    const details = error.response.data?.details;
                    if (details?.rule === 'assessment_questions_locked') {
                        showError(
                            'Không thể sắp xếp lại câu hỏi - ' +
                            (details.context?.has_attempts
                                ? 'Sinh viên đã bắt đầu làm bài'
                                : 'Assessment đã được lưu trữ')
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
            showError('Điểm phải lớn hơn hoặc bằng 0');
            return;
        }

        // Calculate new total
        const otherQuestionsPoints = questions
            .filter((q: any) => q.question_id !== questionId)
            .reduce((sum, q: any) => sum + ((q.points ?? q.question?.points) || 0), 0);

        const newTotal = otherQuestionsPoints + points;

        if (newTotal > MAX_TOTAL_POINTS) {
            showError(`Tổng điểm không được vượt quá ${MAX_TOTAL_POINTS}. Tổng hiện tại sẽ là: ${newTotal}`);
            return;
        }

        try {
            await assessmentService.updateQuestionSettings(assessmentId, questionId, {points});
            showSuccess('Cập nhật điểm thành công');
            onQuestionsChange?.();
        } catch (error: any) {
            // Handle specific lock error
            if (error.response?.status === 422) {
                const details = error.response.data?.details;
                if (details?.rule === 'assessment_questions_locked') {
                    showError(
                        'Không thể cập nhật điểm - ' +
                        (details.context?.has_attempts
                            ? 'Sinh viên đã bắt đầu làm bài'
                            : 'Assessment đã được lưu trữ')
                    );
                    onQuestionsChange?.();
                    return;
                }
            }
            // Error handled by interceptor for other cases
        }
    };

    /* DEPRECATED: time_limit is not used in timing logic. Assessment.Duration is used instead.
    const handleUpdateTimeLimit = async (questionId: number, timeLimit: number | null) => {
        if (timeLimit !== null && timeLimit < 0) {
            showError('Thời gian phải lớn hơn hoặc bằng 0');
            return;
        }

        try {
            await assessmentService.updateQuestionSettings(assessmentId, questionId, {
                time_limit: timeLimit === null ? undefined : timeLimit
            });
            showSuccess('Cập nhật thời gian thành công');
            onQuestionsChange?.();
        } catch (error) {
            // Error handled by interceptor
        }
    };
    */

    // Bulk actions handlers
    const handleBulkUpdate = () => {
        if (selectedRows.length === 0) {
            showError('Vui lòng chọn ít nhất một câu hỏi');
            return;
        }
        setBulkModalVisible(true);
    };

    const handleBulkUpdateSubmit = async () => {
        try {
            const values = await bulkForm.validateFields();
            setBulkLoading(true);

            const updates = selectedRows.map(questionId => ({
                question_id: questionId,
                ...(values.points !== undefined && {points: values.points}),
                // time_limit deprecated - not used in timing logic
                // ...(values.time_limit !== undefined && {time_limit: values.time_limit}),
            }));

            // Validate total points if updating points
            if (values.points !== undefined) {
                const unchangedQuestions = questions.filter((q: any) => !selectedRows.includes(q.question_id));
                const unchangedPoints = unchangedQuestions.reduce((sum, q: any) => sum + ((q.points ?? q.question?.points) || 0), 0);
                const newTotal = unchangedPoints + (values.points * selectedRows.length);

                if (newTotal > MAX_TOTAL_POINTS) {
                    showError(`Tổng điểm không được vượt quá ${MAX_TOTAL_POINTS}. Tổng mới sẽ là: ${newTotal}`);
                    setBulkLoading(false);
                    return;
                }
            }

            await assessmentService.bulkUpdateQuestionSettings(assessmentId, updates);
            showSuccess(`Đã cập nhật ${selectedRows.length} câu hỏi`);
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
                        'Không thể cập nhật câu hỏi - ' +
                        (details.context?.has_attempts
                            ? 'Sinh viên đã bắt đầu làm bài'
                            : 'Assessment đã được lưu trữ')
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
            render: (_, record) => isQuestionsLocked ? null : <DragHandle id={record.question_id} />,
        },
        {
            title: 'STT',
            dataIndex: 'order',
            width: 70,
            render: (order) => <Text strong>{order}</Text>,
        },
        {
            title: 'Câu hỏi',
            dataIndex: ['question', 'text'],
            ellipsis: true,
        },
        {
            title: 'Loại',
            width: 150,
            render: (_, record: any) => <Tag>{typeLabels[record.question?.type] || 'N/A'}</Tag>,
        },
        {
            title: 'Độ khó',
            width: 120,
            render: (_, record: any) => (
                <Tag
                    color={difficultyColors[record.question?.difficulty] || 'default'}>{difficultyLabels[record.question?.difficulty] || 'N/A'}</Tag>
            ),
        },
        {
            title: 'Điểm',
            dataIndex: 'points',
            width: 120,
            render: (points, record: any) => {
                const effectivePoints = points ?? record.question?.points;
                return (
                    <Tooltip title={isQuestionsLocked ? 'Không thể chỉnh sửa - Câu hỏi đã bị khóa' : 'Click để chỉnh sửa'}>
                        <InputNumber
                            size="small"
                            min={0}
                            max={MAX_TOTAL_POINTS}
                            defaultValue={effectivePoints}
                            style={{width: '100%'}}
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
        /* DEPRECATED: time_limit is not used in timing logic. Assessment.Duration is used instead.
        {
            title: 'Thời gian (giây)',
            dataIndex: 'time_limit',
            width: 140,
            render: (timeLimit, record: any) => {
                const effectiveTimeLimit = timeLimit ?? record.question?.time_limit;
                return (
                    <Tooltip title="Click để chỉnh sửa (để trống = không giới hạn)">
                        <InputNumber
                            size="small"
                            min={0}
                            placeholder="Không giới hạn"
                            defaultValue={effectiveTimeLimit}
                            style={{width: '100%'}}
                            onBlur={(e: any) => {
                                const value = e.target.value === '' ? null : parseFloat(e.target.value);
                                if (value !== effectiveTimeLimit) {
                                    handleUpdateTimeLimit(record.question_id, value);
                                }
                            }}
                            onPressEnter={(e: any) => {
                                const value = e.target.value === '' ? null : parseFloat(e.target.value);
                                if (value !== effectiveTimeLimit) {
                                    handleUpdateTimeLimit(record.question_id, value);
                                    e.target.blur();
                                }
                            }}
                        />
                    </Tooltip>
                );
            },
        },
        */
        {
            title: 'Thao tác',
            width: 100,
            render: (_, record) => (
                <Popconfirm
                    title="Xóa câu hỏi?"
                    description="Bạn có chắc muốn xóa câu hỏi này khỏi bài thi?"
                    onConfirm={() => handleRemoveQuestion(record.question_id)}
                    okText="Xóa"
                    cancelText="Hủy"
                    disabled={isQuestionsLocked}
                >
                    <Button type="text" danger icon={<DeleteOutlined/>} size="small" disabled={isQuestionsLocked}/>
                </Popconfirm>
            ),
        },
    ];

    const availableColumns: ColumnsType<Question> = [
        {
            title: 'Câu hỏi',
            dataIndex: 'text',
            ellipsis: true,
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            width: 150,
            render: (type: QuestionType) => <Tag>{typeLabels[type]}</Tag>,
        },
        {
            title: 'Độ khó',
            dataIndex: 'difficulty',
            width: 120,
            render: (difficulty: DifficultyLevel) => (
                <Tag color={difficultyColors[difficulty]}>{difficultyLabels[difficulty]}</Tag>
            ),
        },
        {
            title: 'Điểm',
            dataIndex: 'points',
            width: 120,
            render: (_, record) => {
                // In auto-assign mode, don't show point inputs
                if (addMode === 'auto-assign') {
                    return <Text type="secondary">Tự động</Text>;
                }

                const isSelected = selectedQuestions.includes(record.id);
                const currentValue = questionPoints[record.id] || record.points || 10;
                const remainingPoints = getRemainingPoints(totalPoints);

                return isSelected ? (
                    <InputNumber
                        size="small"
                        min={POINTS_VALIDATION.MIN}
                        max={Math.min(POINTS_VALIDATION.MAX, remainingPoints + (questionPoints[record.id] || 0))}
                        value={currentValue}
                        placeholder="Điểm"
                        style={{width: '100%'}}
                        onChange={(value) => {
                            if (value) {
                                setQuestionPoints(prev => ({...prev, [record.id]: value}));
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
                        <span>Câu hỏi ({questions.length})</span>
                        {isQuestionsLocked && (
                            <Tag icon={<LockOutlined />} color="warning">
                                Đã khóa
                            </Tag>
                        )}
                    </Space>
                }
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined/>}
                        onClick={() => {
                            setAddModalVisible(true);
                            fetchAvailableQuestions({page: 1, size: 10});
                        }}
                        disabled={isQuestionsLocked}
                        title={isQuestionsLocked ? lockReason || 'Không thể thêm câu hỏi' : 'Thêm câu hỏi'}
                    >
                        Thêm câu hỏi
                    </Button>
                }
            >
                {/* Lock warning */}
                {isQuestionsLocked && lockReason && (
                    <Alert
                        message="Câu hỏi đã bị khóa"
                        description={lockReason}
                        type="warning"
                        showIcon
                        icon={<LockOutlined />}
                        style={{marginBottom: 16}}
                    />
                )}

                {/* Total points indicator */}
                <Alert
                    message={
                        <Space>
                            <Text strong>Tổng điểm:</Text>
                            <Text style={{
                                color: totalPoints > MAX_TOTAL_POINTS ? '#ff4d4f' : totalPoints === MAX_TOTAL_POINTS ? '#52c41a' : '#1890ff',
                                fontSize: 16,
                                fontWeight: 'bold'
                            }}>
                                {totalPoints} / {MAX_TOTAL_POINTS}
                            </Text>
                        </Space>
                    }
                    type={totalPoints > MAX_TOTAL_POINTS ? 'error' : totalPoints === MAX_TOTAL_POINTS ? 'success' : 'info'}
                    showIcon
                    style={{marginBottom: 16}}
                    description={totalPoints > MAX_TOTAL_POINTS ? `Tổng điểm vượt quá giới hạn ${MAX_TOTAL_POINTS - totalPoints} điểm` : undefined}
                />

                {/* Bulk actions toolbar */}
                {selectedRows.length > 0 && (
                    <Space style={{marginBottom: 16}}>
                        <Tag color="blue">Đã chọn {selectedRows.length} câu hỏi</Tag>
                        <Button
                            icon={<EditOutlined/>}
                            onClick={handleBulkUpdate}
                            type="primary"
                            disabled={isQuestionsLocked}
                        >
                            Cập nhật hàng loạt
                        </Button>
                        <Button
                            onClick={() => setSelectedRows([])}
                        >
                            Bỏ chọn
                        </Button>
                    </Space>
                )}

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={questions.map((q) => q.question_id)} strategy={verticalListSortingStrategy}>
                        <Table
                            columns={columns}
                            dataSource={questions}
                            rowKey="question_id"
                            loading={loading}
                            pagination={false}
                            rowSelection={isQuestionsLocked ? undefined : {
                                selectedRowKeys: selectedRows,
                                onChange: (keys) => setSelectedRows(keys as number[]),
                            }}
                            components={{
                                body: {
                                    row: SortableRow,
                                },
                            }}
                            locale={{
                                emptyText: 'Chưa có câu hỏi nào',
                            }}
                        />
                    </SortableContext>
                </DndContext>
            </Card>

            <Modal
                title="Thêm câu hỏi vào bài thi"
                open={addModalVisible}
                onCancel={() => {
                    setAddModalVisible(false);
                    setSelectedQuestions([]);
                    setQuestionPoints({});
                    setAddMode('manual'); // Reset mode
                }}
                onOk={handleAddQuestions}
                okText="Thêm"
                cancelText="Hủy"
                width={900}
                confirmLoading={addLoading}
                okButtonProps={{disabled: selectedQuestions.length === 0}}
                styles={{
                    body: {
                        maxHeight: 'calc(100vh - 300px)',
                        overflowY: 'auto',
                        overflowX: 'hidden'
                    }
                }}
            >
                <Space direction="vertical" size="middle" style={{width: '100%', marginTop: 16}}>
                    {/* Mode selection */}
                    <Card size="small" style={{backgroundColor: '#f0f5ff'}}>
                        <Space direction="vertical" size="small" style={{width: '100%'}}>
                            <Text strong>Chọn phương thức thêm câu hỏi:</Text>
                            <Radio.Group
                                value={addMode}
                                onChange={(e) => setAddMode(e.target.value)}
                                style={{width: '100%'}}
                            >
                                <Space direction="vertical">
                                    <Radio value="manual">
                                        <Space direction="vertical" size={0}>
                                            <Text strong>Nhập điểm thủ công</Text>
                                            <Text type="secondary" style={{fontSize: 12}}>
                                                Bạn sẽ nhập điểm cho từng câu hỏi. Câu hỏi hiện có giữ nguyên điểm.
                                            </Text>
                                        </Space>
                                    </Radio>
                                    <Radio value="auto-assign">
                                        <Space direction="vertical" size={0}>
                                            <Text strong>Tự động phân phối điểm đều</Text>
                                            <Text type="secondary" style={{fontSize: 12}}>
                                                Hệ thống sẽ tự động phân phối 100 điểm đều cho TẤT CẢ câu hỏi (cả hiện có và mới).
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
                            message={`Danh sách đã lọc bỏ ${questions.length} câu hỏi đã có trong bài thi`}
                            type="info"
                            showIcon
                            closable
                        />
                    )}

                    {/* Auto-assign preview and warning */}
                    {addMode === 'auto-assign' && selectedQuestions.length > 0 && (
                        <>
                            <Alert
                                message="Xem trước phân phối điểm"
                                description={
                                    <Space direction="vertical" size="small">
                                        <Text>
                                            Tổng số câu hỏi: <Text strong>{questions.length + selectedQuestions.length}</Text> câu
                                            ({questions.length} hiện có + {selectedQuestions.length} mới)
                                        </Text>
                                        <Text>
                                            Điểm mỗi câu: <Text strong style={{color: '#1890ff'}}>
                                            {Math.floor(100 / (questions.length + selectedQuestions.length))} điểm
                                        </Text>
                                            {100 % (questions.length + selectedQuestions.length) > 0 && (
                                                <Text type="secondary" style={{fontSize: 12}}>
                                                    {' '}({100 % (questions.length + selectedQuestions.length)} câu đầu sẽ có thêm 1 điểm)
                                                </Text>
                                            )}
                                        </Text>
                                    </Space>
                                }
                                type="info"
                                showIcon
                            />
                            <Alert
                                message="Lưu ý quan trọng"
                                description={
                                    <ul style={{margin: 0, paddingLeft: 20}}>
                                        <li>Tất cả câu hỏi (cả hiện có) sẽ được phân phối lại điểm đều nhau</li>
                                        <li>Điểm của câu hỏi hiện có sẽ bị thay đổi</li>
                                        <li>Chỉ có thể sử dụng khi chưa có sinh viên nào bắt đầu làm bài</li>
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
                                    <Text>Điểm khả dụng:</Text>
                                    <Text strong style={{color: '#1890ff'}}>
                                        {getRemainingPoints(totalPoints)} / {MAX_TOTAL_POINTS}
                                    </Text>
                                </Space>
                            }
                            type="info"
                            showIcon
                            description="Nhập điểm cho từng câu hỏi sau khi chọn. Tổng điểm không được vượt quá 100."
                        />
                    )}

                    <Row gutter={[8, 8]}>
                        <Col span={12}>
                            <Input
                                placeholder="Tìm kiếm câu hỏi..."
                                prefix={<SearchOutlined/>}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onPressEnter={() => fetchAvailableQuestions({page: 1, size: 10})}
                                disabled={fetchingQuestions}
                            />
                        </Col>
                        <Col span={6}>
                            <Select
                                placeholder="Lọc theo loại"
                                allowClear
                                style={{width: '100%'}}
                                value={filterType}
                                onChange={(value) => setFilterType(value)}
                                disabled={fetchingQuestions}
                            >
                                {Object.entries(typeLabels).map(([key, label]) => (
                                    <Select.Option key={key} value={key}>
                                        {label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={6}>
                            <Select
                                placeholder="Lọc theo độ khó"
                                allowClear
                                style={{width: '100%'}}
                                value={filterDifficulty}
                                onChange={(value) => setFilterDifficulty(value)}
                                disabled={fetchingQuestions}
                            >
                                {Object.entries(difficultyLabels).map(([key, label]) => (
                                    <Select.Option key={key} value={key}>
                                        {label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>

                    <Space>
                        <Button
                            icon={<FilterOutlined/>}
                            onClick={() => fetchAvailableQuestions({page: 1, size: 10})}
                            loading={fetchingQuestions}
                            disabled={fetchingQuestions}
                        >
                            {fetchingQuestions ? 'Đang tìm...' : 'Lọc'}
                        </Button>
                        {!fetchingQuestions && availableQuestions.length > 0 && (
                            <Text type="secondary">
                                Tìm thấy {availableQuestions.length} câu hỏi
                            </Text>
                        )}
                        {fetchingQuestions && (
                            <Text type="secondary">
                                Đang tải danh sách câu hỏi...
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
                                const newPoints = {...questionPoints};
                                keys.forEach(key => {
                                    if (!newPoints[key as number]) {
                                        const q = availableQuestions.find(q => q.id === key);
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
                                fetchAvailableQuestions({page, size});
                            },
                        }}
                        locale={{
                            emptyText: (
                                <Space direction="vertical" size="middle" style={{ padding: '40px 0' }}>
                                    <FileTextOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                                    <Text type="secondary">
                                        {questions.length > 0
                                            ? 'Tất cả câu hỏi trong kho đã được thêm vào bài thi'
                                            : 'Không tìm thấy câu hỏi nào'
                                        }
                                    </Text>
                                    {questions.length === 0 && (
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            Thử thay đổi bộ lọc hoặc tìm kiếm
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
                title="Cập nhật hàng loạt"
                open={bulkModalVisible}
                onCancel={() => {
                    setBulkModalVisible(false);
                    bulkForm.resetFields();
                }}
                onOk={handleBulkUpdateSubmit}
                okText="Cập nhật"
                cancelText="Hủy"
                confirmLoading={bulkLoading}
            >
                <Alert
                    message={`Cập nhật cho ${selectedRows.length} câu hỏi đã chọn`}
                    type="info"
                    showIcon
                    style={{marginBottom: 16}}
                />

                <Form
                    form={bulkForm}
                    layout="vertical"
                >
                    <Form.Item
                        label="Điểm"
                        name="points"
                        help="Để trống nếu không muốn thay đổi"
                    >
                        <InputNumber
                            min={0}
                            max={MAX_TOTAL_POINTS}
                            style={{width: '100%'}}
                            placeholder="Nhập điểm cho tất cả câu hỏi đã chọn"
                        />
                    </Form.Item>

                    {/* DEPRECATED: time_limit is not used in timing logic. Assessment.Duration is used instead.
                    <Form.Item
                        label="Thời gian (giây)"
                        name="time_limit"
                        help="Để trống nếu không muốn thay đổi"
                    >
                        <InputNumber
                            min={0}
                            style={{width: '100%'}}
                            placeholder="Nhập thời gian cho tất cả câu hỏi đã chọn"
                        />
                    </Form.Item>
                    */}

                    <Alert
                        message="Lưu ý"
                        description={
                            <ul style={{margin: 0, paddingLeft: 20}}>
                                <li>Các trường để trống sẽ không được cập nhật</li>
                                <li>Tổng điểm của assessment không được vượt quá {MAX_TOTAL_POINTS}</li>
                                <li>Thay đổi sẽ áp dụng cho tất cả câu hỏi đã chọn</li>
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
