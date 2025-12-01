import React, {useEffect, useState, useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Table,
    Button,
    Space,
    Input,
    Select,
    Tag,
    Typography,
    Popconfirm,
    message,
    Tooltip,
    Row,
    Col,
    Card,
    Flex,
    Avatar,
} from 'antd';
import {elevation} from '../../styles/elevation';
import {cardColors} from '../../styles/cardColors';
import type {ColumnsType} from 'antd/es/table';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    QuestionCircleOutlined,
    CopyOutlined,
    BulbOutlined,
    ThunderboltOutlined,
    FireOutlined,
} from '@ant-design/icons';
import {Question, QuestionType, DifficultyLevel} from '../../types';
import questionService from '../../services/questionService';
import {useThemeToken} from '../../theme/ThemeProvider';

const {Title, Text} = Typography;
const {Search} = Input;
import {showSuccess} from '../../utils/errorHandler';

const QuestionList: React.FC = () => {
    const navigate = useNavigate();
    const token = useThemeToken();
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [total, setTotal] = useState(0);
    const [allQuestionsStats, setAllQuestionsStats] = useState<Question[]>([]);
    const [filters, setFilters] = useState({
        page: 1,
        size: 10,
        type: undefined as string | undefined,
        difficulty: undefined as string | undefined,
        search: '',
    });

    // Calculate statistics from ALL questions, not just current page
    const stats = useMemo(() => {
        return {
            total: total, // Use total from API
            easy: allQuestionsStats?.filter((q) => q.difficulty === DifficultyLevel.Easy).length || 0,
            medium: allQuestionsStats?.filter((q) => q.difficulty === DifficultyLevel.Medium).length || 0,
            hard: allQuestionsStats?.filter((q) => q.difficulty === DifficultyLevel.Hard).length || 0,
        };
    }, [allQuestionsStats, total]);

    useEffect(() => {
        fetchQuestions();
    }, [filters]);

    // Fetch all questions for statistics (only once on mount)
    useEffect(() => {
        fetchAllQuestionsForStats();
    }, []);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await questionService.getQuestions(filters);
            setQuestions(response.questions || []);
            setTotal(response.total);
        } catch (error) {
            message.error('Không thể tải danh sách câu hỏi');
        } finally {
            setLoading(false);
        }
    };

    // Fetch all questions for statistics calculation
    const fetchAllQuestionsForStats = async () => {
        try {
            // Fetch all questions with a large page size to get accurate difficulty counts
            const response = await questionService.getQuestions({ page: 1, size: 10000 });
            setAllQuestionsStats(response.questions || []);
        } catch (error) {
            console.error('Failed to fetch question statistics:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await questionService.deleteQuestion(id);
            showSuccess('Xóa câu hỏi thành công');
            fetchQuestions();
        } catch (error) {
            // message.error('Không thể xóa câu hỏi');
        }
    };

    const handleDuplicate = async (id: number) => {
        try {
            const question = questions.find(q => q.id === id);
            if (!question) return;

            const {id: _, created_at, updated_at, usage_count, ...questionData} = question;
            await questionService.createQuestion({
                ...questionData,
                text: `${questionData.text} (Copy)`,
            });
            showSuccess('Sao chép câu hỏi thành công');
            fetchQuestions();
        } catch (error) {
            // message.error('Không thể sao chép câu hỏi');
        }
    };

    const getQuestionTypeLabel = (type: QuestionType) => {
        const typeConfig = {
            [QuestionType.MultipleChoice]: {color: 'blue', text: 'Trắc nghiệm'},
            [QuestionType.TrueFalse]: {color: 'green', text: 'Đúng/Sai'},
            [QuestionType.Essay]: {color: 'purple', text: 'Tự luận'},
            [QuestionType.FillBlank]: {color: 'orange', text: 'Điền khuyết'},
            [QuestionType.Matching]: {color: 'cyan', text: 'Ghép cặp'},
            [QuestionType.Ordering]: {color: 'magenta', text: 'Sắp xếp'},
            [QuestionType.ShortAnswer]: {color: 'geekblue', text: 'Trả lời ngắn'},
        };
        const config = typeConfig[type];
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const getDifficultyTag = (difficulty: DifficultyLevel) => {
        const difficultyConfig = {
            [DifficultyLevel.Easy]: {color: 'success', text: 'Dễ'},
            [DifficultyLevel.Medium]: {color: 'warning', text: 'Trung bình'},
            [DifficultyLevel.Hard]: {color: 'error', text: 'Khó'},
        };
        const config = difficultyConfig[difficulty];
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const columns: ColumnsType<Question> = [
        {
            title: 'Câu hỏi',
            dataIndex: 'text',
            key: 'text',
            width: 400,
            render: (text, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>
                        {text.length > 80 ? `${text.substring(0, 80)}...` : text}
                    </Text>
                    <Space size="small">
                        {record.tags?.slice(0, 3).map((tag) => (
                            <Tag key={tag} style={{fontSize: 11}}>
                                {tag}
                            </Tag>
                        ))}
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 130,
            render: (type) => getQuestionTypeLabel(type),
        },
        {
            title: 'Độ khó',
            dataIndex: 'difficulty',
            key: 'difficulty',
            width: 110,
            render: (difficulty) => getDifficultyTag(difficulty),
        },
        {
            title: 'Điểm',
            dataIndex: 'points',
            key: 'points',
            width: 80,
            align: 'center',
        },
        {
            title: 'Lượt sử dụng',
            dataIndex: 'usage_count',
            key: 'usage_count',
            width: 120,
            align: 'center',
            render: (count) => count || 0,
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined/>}
                            onClick={() => navigate(`/questions/edit/${record.id}`)}
                        />
                    </Tooltip>
                    <Tooltip title="Sao chép">
                        <Button
                            type="text"
                            icon={<CopyOutlined/>}
                            onClick={() => handleDuplicate(record.id)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xác nhận xóa"
                        description="Bạn có chắc chắn muốn xóa câu hỏi này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{danger: true}}
                    >
                        <Tooltip title="Xóa">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined/>}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{width: '100%'}}>
            <Flex justify="space-between" align="center">
                <Space direction="vertical" size={4}>
                    <Title level={2} style={{margin: 0, fontWeight: 600}}>
                        <QuestionCircleOutlined style={{marginRight: 8}}/> Quản lý câu hỏi
                    </Title>
                    <Text type="secondary" style={{fontSize: 14}}>
                        Tạo và quản lý ngân hàng câu hỏi
                    </Text>
                </Space>
                <Button
                    type="primary"
                    icon={<PlusOutlined/>}
                    size="large"
                    onClick={() => navigate('/questions/new')}
                    style={{fontWeight: 500, height: 44, borderRadius: 10, paddingLeft: 24, paddingRight: 24}}
                >
                    Tạo câu hỏi mới
                </Button>
            </Flex>


            <Card style={{...elevation[1], borderRadius: 16}}>
                <Space direction="vertical" size="middle" style={{width: '100%'}}>
                    <Row gutter={16}>
                        <Col flex="auto">
                            <Search
                                placeholder="Tìm kiếm câu hỏi..."
                                allowClear
                                enterButton={<SearchOutlined/>}
                                size="large"
                                onSearch={(value) =>
                                    setFilters({...filters, search: value, page: 1})
                                }
                            />
                        </Col>
                        <Col>
                            <Select
                                placeholder="Loại câu hỏi"
                                style={{width: 150}}
                                size="large"
                                allowClear
                                onChange={(value) =>
                                    setFilters({...filters, type: value, page: 1})
                                }
                                options={[
                                    {label: 'Trắc nghiệm', value: QuestionType.MultipleChoice},
                                    {label: 'Đúng/Sai', value: QuestionType.TrueFalse},
                                    {label: 'Tự luận', value: QuestionType.Essay},
                                    {label: 'Điền khuyết', value: QuestionType.FillBlank},
                                    {label: 'Ghép cặp', value: QuestionType.Matching},
                                    {label: 'Sắp xếp', value: QuestionType.Ordering},
                                    {label: 'Trả lời ngắn', value: QuestionType.ShortAnswer},
                                ]}
                            />
                        </Col>
                        <Col>
                            <Select
                                placeholder="Độ khó"
                                style={{width: 130}}
                                size="large"
                                allowClear
                                onChange={(value) =>
                                    setFilters({...filters, difficulty: value, page: 1})
                                }
                                options={[
                                    {label: 'Dễ', value: DifficultyLevel.Easy},
                                    {label: 'Trung bình', value: DifficultyLevel.Medium},
                                    {label: 'Khó', value: DifficultyLevel.Hard},
                                ]}
                            />
                        </Col>
                    </Row>

                    <Table
                        columns={columns}
                        dataSource={questions}
                        rowKey="id"
                        loading={loading}
                        scroll={{x: 1200}}
                        pagination={{
                            current: filters.page,
                            pageSize: filters.size,
                            total: total,
                            showSizeChanger: true,
                            showTotal: (total) => `Tổng ${total} câu hỏi`,
                            onChange: (page, size) =>
                                setFilters({...filters, page, size}),
                        }}
                    />
                </Space>
            </Card>

            {/* Statistics Summary - Moved to bottom */}
            <Card bordered={false} style={{...elevation[1], borderRadius: 16, background: '#f5f5f5'}}>
                <Space direction="vertical" size={8} style={{width: '100%'}}>
                    <Text type="secondary" style={{fontSize: 13, fontWeight: 500}}>Thống kê tổng quan</Text>
                    <Row gutter={[12, 12]}>
                        <Col xs={12} sm={6}>
                            <Flex align="center" gap={8}>
                                <Avatar size={36} icon={<QuestionCircleOutlined style={{fontSize: 16}}/>}
                                        style={{backgroundColor: cardColors.purple, flexShrink: 0}}/>
                                <Space direction="vertical" size={0}>
                                    <Text style={{fontSize: 20, fontWeight: 700, lineHeight: 1.2}}>{stats.total}</Text>
                                    <Text type="secondary" style={{fontSize: 12}}>Tổng câu hỏi</Text>
                                </Space>
                            </Flex>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Flex align="center" gap={8}>
                                <Avatar size={36} icon={<BulbOutlined style={{fontSize: 16}}/>}
                                        style={{backgroundColor: cardColors.green, flexShrink: 0}}/>
                                <Space direction="vertical" size={0}>
                                    <Text style={{fontSize: 20, fontWeight: 700, lineHeight: 1.2}}>{stats.easy}</Text>
                                    <Text type="secondary" style={{fontSize: 12}}>Dễ</Text>
                                </Space>
                            </Flex>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Flex align="center" gap={8}>
                                <Avatar size={36} icon={<ThunderboltOutlined style={{fontSize: 16}}/>}
                                        style={{backgroundColor: cardColors.orange, flexShrink: 0}}/>
                                <Space direction="vertical" size={0}>
                                    <Text style={{fontSize: 20, fontWeight: 700, lineHeight: 1.2}}>{stats.medium}</Text>
                                    <Text type="secondary" style={{fontSize: 12}}>Trung bình</Text>
                                </Space>
                            </Flex>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Flex align="center" gap={8}>
                                <Avatar size={36} icon={<FireOutlined style={{fontSize: 16}}/>}
                                        style={{backgroundColor: cardColors.red, flexShrink: 0}}/>
                                <Space direction="vertical" size={0}>
                                    <Text style={{fontSize: 20, fontWeight: 700, lineHeight: 1.2}}>{stats.hard}</Text>
                                    <Text type="secondary" style={{fontSize: 12}}>Khó</Text>
                                </Space>
                            </Flex>
                        </Col>
                    </Row>
                </Space>
            </Card>
        </Space>
    );
};

export default QuestionList;
