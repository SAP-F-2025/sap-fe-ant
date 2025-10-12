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
} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import {
    AssessmentQuestion,
    Question,
    QuestionType,
    DifficultyLevel,
    PaginationParams,
} from '../../types';
import assessmentService from '../../services/assessmentService';
import questionService from '../../services/questionService';
import {showSuccess, showError} from '../../utils/errorHandler';
import {DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

const {Text} = Typography;

interface Props {
    assessmentId: number;
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

const MAX_TOTAL_POINTS = 100;

export const ManageAssessmentQuestions: React.FC<Props> = ({
                                                               assessmentId,
                                                               questions: initialQuestions,
                                                               onQuestionsChange,
                                                           }) => {
    const [questions, setQuestions] = useState<AssessmentQuestion[]>(initialQuestions || []);
    const [loading, setLoading] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
    const [addLoading, setAddLoading] = useState(false);
    const [fetchingQuestions, setFetchingQuestions] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState<string | undefined>();
    const [filterDifficulty, setFilterDifficulty] = useState<string | undefined>();
    const [pagination, setPagination] = useState({page: 1, size: 10, total: 0});

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
            setAvailableQuestions(data.questions);
            setPagination({
                page: data.page > 0 ? data.page : 1,
                size: data.size,
                total: data.total
            });
        } catch (error) {
            // Error handled by interceptor
        } finally {
            setFetchingQuestions(false);
        }
    };

    const handleAddQuestions = async () => {
        setAddLoading(true);
        try {
            await assessmentService.bulkAddQuestionsToAssessment(assessmentId, selectedQuestions);
            showSuccess(`Đã thêm ${selectedQuestions.length} câu hỏi`);
            setAddModalVisible(false);
            setSelectedQuestions([]);
            onQuestionsChange?.();
        } catch (error) {
            // Error handled by interceptor
        } finally {
            setAddLoading(false);
        }
    };

    const handleRemoveQuestion = async (questionId: number) => {
        try {
            await assessmentService.removeQuestionFromAssessment(assessmentId, questionId);
            showSuccess('Xóa câu hỏi thành công');
            onQuestionsChange?.();
        } catch (error) {
            // Error handled by interceptor
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
            } catch (error) {
                // Error handled by interceptor
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
        } catch (error) {
            // Error handled by interceptor
        }
    };

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
                ...(values.time_limit !== undefined && {time_limit: values.time_limit}),
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
        } catch (error) {
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
            render: (_, record) => <DragHandle id={record.question_id} />,
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
                    <Tooltip title="Click để chỉnh sửa">
                        <InputNumber
                            size="small"
                            min={0}
                            max={MAX_TOTAL_POINTS}
                            defaultValue={effectivePoints}
                            style={{width: '100%'}}
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
                >
                    <Button type="text" danger icon={<DeleteOutlined/>} size="small"/>
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
            width: 80,
        },
    ];

    return (
        <>
            <Card
                title={`Câu hỏi (${questions.length})`}
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined/>}
                        onClick={() => {
                            setAddModalVisible(true);
                            fetchAvailableQuestions({page: 1, size: 10});
                        }}
                    >
                        Thêm câu hỏi
                    </Button>
                }
            >
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
                            rowSelection={{
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
                }}
                onOk={handleAddQuestions}
                okText="Thêm"
                cancelText="Hủy"
                width={900}
                confirmLoading={addLoading}
                okButtonProps={{disabled: selectedQuestions.length === 0}}
            >
                <Space direction="vertical" size="middle" style={{width: '100%', marginTop: 16}}>
                    <Row gutter={[8, 8]}>
                        <Col span={12}>
                            <Input
                                placeholder="Tìm kiếm câu hỏi..."
                                prefix={<SearchOutlined/>}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onPressEnter={() => fetchAvailableQuestions({page: 1, size: 10})}
                            />
                        </Col>
                        <Col span={6}>
                            <Select
                                placeholder="Lọc theo loại"
                                allowClear
                                style={{width: '100%'}}
                                value={filterType}
                                onChange={(value) => setFilterType(value)}
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
                            >
                                {Object.entries(difficultyLabels).map(([key, label]) => (
                                    <Select.Option key={key} value={key}>
                                        {label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>

                    <Button
                        icon={<FilterOutlined/>}
                        onClick={() => fetchAvailableQuestions({page: 1, size: 10})}
                    >
                        Lọc
                    </Button>

                    <Table
                        columns={availableColumns}
                        dataSource={availableQuestions}
                        rowKey="id"
                        loading={fetchingQuestions}
                        rowSelection={{
                            selectedRowKeys: selectedQuestions,
                            onChange: (keys) => setSelectedQuestions(keys as number[]),
                        }}
                        pagination={{
                            current: pagination.page,
                            pageSize: pagination.size,
                            total: pagination.total,
                            onChange: (page, size) => {
                                fetchAvailableQuestions({page, size});
                            },
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
