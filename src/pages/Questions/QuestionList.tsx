import {
	BulbOutlined,
	CopyOutlined,
	DeleteOutlined,
	EditOutlined,
	FireOutlined,
	PlusOutlined,
	QuestionCircleOutlined,
	SearchOutlined,
	ThunderboltOutlined,
} from '@ant-design/icons';
import {
	Avatar,
	Button,
	Card,
	Col,
	Flex,
	Input,
	message,
	Popconfirm,
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
import { useLocation, useNavigate } from 'react-router-dom';
import questionService from '../../services/questionService';
import { cardColors } from '../../styles/cardColors';
import { elevation } from '../../styles/elevation';
import { useThemeToken } from '../../theme/ThemeProvider';
import { DifficultyLevel, Question, QuestionType } from '../../types';
import { showSuccess } from '../../utils/errorHandler';

const { Title, Text } = Typography;
const { Search } = Input;

const QuestionList: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
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

	// Detect if we're in student context
	const isStudentContext = location.pathname.startsWith('/student');
	const basePath = isStudentContext ? '/student/questions' : '/questions';

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
			message.error(t('questionList.loadError'));
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
			showSuccess(t('questionList.deleteSuccess'));
			fetchQuestions();
		} catch (error) {
			// message.error('Failed to delete question');
		}
	};

	const handleDuplicate = async (id: number) => {
		try {
			const question = questions.find(q => q.id === id);
			if (!question) return;

			const { id: _, created_at, updated_at, usage_count, ...questionData } = question;
			await questionService.createQuestion({
				...questionData,
				text: `${questionData.text} (Copy)`,
			});
			showSuccess(t('questionList.duplicateSuccess'));
			fetchQuestions();
		} catch (error) {
			// message.error('Failed to duplicate question');
		}
	};

	const getQuestionTypeLabel = (type: QuestionType) => {
		const typeConfig = {
			[QuestionType.MultipleChoice]: { color: 'blue', text: t('question.type.multipleChoice') },
			[QuestionType.TrueFalse]: { color: 'green', text: t('question.type.trueFalse') },
			[QuestionType.Essay]: { color: 'purple', text: t('question.type.essay') },
			[QuestionType.FillBlank]: { color: 'orange', text: t('question.type.fillBlank') },
			[QuestionType.Matching]: { color: 'cyan', text: t('question.type.matching') },
			[QuestionType.Ordering]: { color: 'magenta', text: t('question.type.ordering') },
			[QuestionType.ShortAnswer]: { color: 'geekblue', text: t('question.type.shortAnswer') },
		};
		const config = typeConfig[type];
		return <Tag color={config.color}>{config.text}</Tag>;
	};

	const getDifficultyTag = (difficulty: DifficultyLevel) => {
		const difficultyConfig = {
			[DifficultyLevel.Easy]: { color: 'success', text: t('questionList.easy') },
			[DifficultyLevel.Medium]: { color: 'warning', text: t('questionList.medium') },
			[DifficultyLevel.Hard]: { color: 'error', text: t('questionList.hard') },
		};
		const config = difficultyConfig[difficulty];
		return <Tag color={config.color}>{config.text}</Tag>;
	};

	const columns: ColumnsType<Question> = [
		{
			title: t('questionList.columnQuestion'),
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
							<Tag key={tag} style={{ fontSize: 11 }}>
								{tag}
							</Tag>
						))}
					</Space>
				</Space>
			),
		},
		{
			title: t('questionList.columnType'),
			dataIndex: 'type',
			key: 'type',
			width: 130,
			render: (type) => getQuestionTypeLabel(type),
		},
		{
			title: t('questionList.columnDifficulty'),
			dataIndex: 'difficulty',
			key: 'difficulty',
			width: 110,
			render: (difficulty) => getDifficultyTag(difficulty),
		},
		{
			title: t('questionList.columnPoints'),
			dataIndex: 'points',
			key: 'points',
			width: 80,
			align: 'center',
		},
		{
			title: t('questionList.columnUsage'),
			dataIndex: 'usage_count',
			key: 'usage_count',
			width: 120,
			align: 'center',
			render: (count) => count || 0,
		},
		{
			title: t('questionList.columnActions'),
			key: 'action',
			fixed: 'right',
			width: 150,
			render: (_, record) => (
				<Space size="small">
					<Tooltip title={t('questionList.edit')}>
						<Button
							type="text"
							icon={<EditOutlined />}
							onClick={() => navigate(`${basePath}/edit/${record.id}`)}
						/>
					</Tooltip>
					<Tooltip title={t('questionList.duplicate')}>
						<Button
							type="text"
							icon={<CopyOutlined />}
							onClick={() => handleDuplicate(record.id)}
						/>
					</Tooltip>
					<Popconfirm
						title={t('questionList.confirmDelete')}
						description={t('questionList.confirmDeleteDesc')}
						onConfirm={() => handleDelete(record.id)}
						okText={t('common.delete')}
						cancelText={t('common.cancel')}
						okButtonProps={{ danger: true }}
					>
						<Tooltip title={t('questionList.delete')}>
							<Button
								type="text"
								danger
								icon={<DeleteOutlined />}
							/>
						</Tooltip>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Space direction="vertical" size="large" style={{ width: '100%' }}>
			<Flex justify="space-between" align="center">
				<Space direction="vertical" size={4}>
					<Title level={2} style={{ margin: 0, fontWeight: 600 }}>
						<QuestionCircleOutlined style={{ marginRight: 8 }} /> {t('questionList.title')}
					</Title>
					<Text type="secondary" style={{ fontSize: 14 }}>
						{t('questionList.subtitle')}
					</Text>
				</Space>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					size="large"
					onClick={() => navigate(`${basePath}/new`)}
					style={{ fontWeight: 500, height: 44, borderRadius: 10, paddingLeft: 24, paddingRight: 24 }}
				>
					{t('questionList.createNew')}
				</Button>
			</Flex>


			<Card style={{ ...elevation[1], borderRadius: 16 }}>
				<Space direction="vertical" size="middle" style={{ width: '100%' }}>
					<Row gutter={16}>
						<Col flex="auto">
							<Search
								placeholder={t('questionList.searchPlaceholder')}
								allowClear
								enterButton={<SearchOutlined />}
								size="large"
								onSearch={(value) =>
									setFilters({ ...filters, search: value, page: 1 })
								}
							/>
						</Col>
						<Col>
							<Select
								placeholder={t('questionList.typeFilter')}
								style={{ width: 150 }}
								size="large"
								allowClear
								onChange={(value) =>
									setFilters({ ...filters, type: value, page: 1 })
								}
								options={[
									{ label: t('question.type.multipleChoice'), value: QuestionType.MultipleChoice },
									{ label: t('question.type.trueFalse'), value: QuestionType.TrueFalse },
									{ label: t('question.type.essay'), value: QuestionType.Essay },
									{ label: t('question.type.fillBlank'), value: QuestionType.FillBlank },
									{ label: t('question.type.matching'), value: QuestionType.Matching },
									{ label: t('question.type.ordering'), value: QuestionType.Ordering },
									{ label: t('question.type.shortAnswer'), value: QuestionType.ShortAnswer },
								]}
							/>
						</Col>
						<Col>
							<Select
								placeholder={t('questionList.difficultyFilter')}
								style={{ width: 130 }}
								size="large"
								allowClear
								onChange={(value) =>
									setFilters({ ...filters, difficulty: value, page: 1 })
								}
								options={[
									{ label: t('questionList.easy'), value: DifficultyLevel.Easy },
									{ label: t('questionList.medium'), value: DifficultyLevel.Medium },
									{ label: t('questionList.hard'), value: DifficultyLevel.Hard },
								]}
							/>
						</Col>
					</Row>

					<Table
						columns={columns}
						dataSource={questions}
						rowKey="id"
						loading={loading}
						scroll={{ x: 1200 }}
						pagination={{
							current: filters.page,
							pageSize: filters.size,
							total: total,
							showSizeChanger: true,
							showTotal: (total) => t('questionList.totalItems', { count: total }),
							onChange: (page, size) =>
								setFilters({ ...filters, page, size }),
						}}
					/>
				</Space>
			</Card>

			{/* Statistics Summary - Moved to bottom */}
			<Card bordered={false} style={{ ...elevation[1], borderRadius: 16, background: '#f5f5f5' }}>
				<Space direction="vertical" size={8} style={{ width: '100%' }}>
					<Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>{t('questionList.statsTitle')}</Text>
					<Row gutter={[12, 12]}>
						<Col xs={12} sm={6}>
							<Flex align="center" gap={8}>
								<Avatar size={36} icon={<QuestionCircleOutlined style={{ fontSize: 16 }} />}
									style={{ backgroundColor: cardColors.purple, flexShrink: 0 }} />
								<Space direction="vertical" size={0}>
									<Text style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{stats.total}</Text>
									<Text type="secondary" style={{ fontSize: 12 }}>{t('questionList.totalQuestions')}</Text>
								</Space>
							</Flex>
						</Col>
						<Col xs={12} sm={6}>
							<Flex align="center" gap={8}>
								<Avatar size={36} icon={<BulbOutlined style={{ fontSize: 16 }} />}
									style={{ backgroundColor: cardColors.green, flexShrink: 0 }} />
								<Space direction="vertical" size={0}>
									<Text style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{stats.easy}</Text>
									<Text type="secondary" style={{ fontSize: 12 }}>{t('questionList.easy')}</Text>
								</Space>
							</Flex>
						</Col>
						<Col xs={12} sm={6}>
							<Flex align="center" gap={8}>
								<Avatar size={36} icon={<ThunderboltOutlined style={{ fontSize: 16 }} />}
									style={{ backgroundColor: cardColors.orange, flexShrink: 0 }} />
								<Space direction="vertical" size={0}>
									<Text style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{stats.medium}</Text>
									<Text type="secondary" style={{ fontSize: 12 }}>{t('questionList.medium')}</Text>
								</Space>
							</Flex>
						</Col>
						<Col xs={12} sm={6}>
							<Flex align="center" gap={8}>
								<Avatar size={36} icon={<FireOutlined style={{ fontSize: 16 }} />}
									style={{ backgroundColor: cardColors.red, flexShrink: 0 }} />
								<Space direction="vertical" size={0}>
									<Text style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{stats.hard}</Text>
									<Text type="secondary" style={{ fontSize: 12 }}>{t('questionList.hard')}</Text>
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
