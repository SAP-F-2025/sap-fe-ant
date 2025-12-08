import {
	DeleteOutlined,
	FileTextOutlined,
	FilterOutlined,
	PlusOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import {
	Alert,
	Button,
	Card,
	Col,
	Divider,
	Input,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Table,
	Tag,
	Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import questionBankService from '../../services/questionBankService';
import questionService from '../../services/questionService';
import {
	DifficultyLevel,
	PaginationParams,
	Question,
	QuestionType,
} from '../../types';
import { showSuccess } from '../../utils/errorHandler';

const { Text } = Typography;

interface Props {
	bankId: number;
	onQuestionsChange?: () => void;
}

const difficultyColors = {
	[DifficultyLevel.Easy]: 'success',
	[DifficultyLevel.Medium]: 'warning',
	[DifficultyLevel.Hard]: 'error',
};

export const ManageQuestionBankQuestions: React.FC<Props> = ({
	bankId,
	onQuestionsChange,
}) => {
	const { t } = useTranslation();

	const difficultyLabels = {
		[DifficultyLevel.Easy]: t('manageQuestionBankQuestions.difficulty.easy'),
		[DifficultyLevel.Medium]: t('manageQuestionBankQuestions.difficulty.medium'),
		[DifficultyLevel.Hard]: t('manageQuestionBankQuestions.difficulty.hard'),
	};

	const typeLabels = {
		[QuestionType.MultipleChoice]: t('manageQuestionBankQuestions.type.multipleChoice'),
		[QuestionType.TrueFalse]: t('manageQuestionBankQuestions.type.trueFalse'),
		[QuestionType.Essay]: t('manageQuestionBankQuestions.type.essay'),
		[QuestionType.FillBlank]: t('manageQuestionBankQuestions.type.fillBlank'),
		[QuestionType.Matching]: t('manageQuestionBankQuestions.type.matching'),
		[QuestionType.Ordering]: t('manageQuestionBankQuestions.type.ordering'),
		[QuestionType.ShortAnswer]: t('manageQuestionBankQuestions.type.shortAnswer'),
	};

	const [questions, setQuestions] = useState<Question[]>([]);
	const [loading, setLoading] = useState(false);
	const [addModalVisible, setAddModalVisible] = useState(false);
	const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
	const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [addLoading, setAddLoading] = useState(false);
	const [fetchingQuestions, setFetchingQuestions] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [filterType, setFilterType] = useState<string | undefined>();
	const [filterDifficulty, setFilterDifficulty] = useState<string | undefined>();
	const [bankPagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
	const [availablePagination, setAvailablePagination] = useState({ page: 1, size: 10, total: 0 });

	useEffect(() => {
		fetchQuestions();
	}, [bankId, bankPagination.page, bankPagination.size]);

	const fetchQuestions = async () => {
		setLoading(true);
		try {
			const data = await questionBankService.getQuestionBankQuestions(bankId, {
				page: bankPagination.page,
				size: bankPagination.size,
			});
			setQuestions(data.questions);
			setPagination({
				page: bankPagination.page,
				size: data.size,
				total: data.total,
			});
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

			// Filter out questions already in bank
			const existingQuestionIds = new Set(questions.map(q => q.id));
			const filteredQuestions = data.questions.filter(q => !existingQuestionIds.has(q.id));

			setAvailableQuestions(filteredQuestions);
			setAvailablePagination({
				page: params?.page || 1,
				size: data.size,
				total: filteredQuestions.length, // Update total to reflect filtered count
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
			await questionBankService.addQuestionsToBank(bankId, {
				question_ids: selectedQuestions,
			});
			showSuccess(t('manageQuestionBankQuestions.addSuccess'));
			setAddModalVisible(false);
			setSelectedQuestions([]);
			fetchQuestions();
			onQuestionsChange?.();
		} catch (error) {
			// Error handled by interceptor
		} finally {
			setAddLoading(false);
		}
	};

	const handleRemoveQuestions = async () => {
		if (selectedRowKeys.length === 0) return;

		try {
			await questionBankService.removeQuestionsFromBank(bankId, {
				question_ids: selectedRowKeys as number[],
			});
			showSuccess(t('manageQuestionBankQuestions.removeSuccess'));
			setSelectedRowKeys([]);
			fetchQuestions();
			onQuestionsChange?.();
		} catch (error) {
			// Error handled by interceptor
		}
	};

	const columns: ColumnsType<Question> = [
		{
			title: 'ID',
			dataIndex: 'id',
			width: 80,
		},
		{
			title: t('manageQuestionBankQuestions.columnQuestion'),
			dataIndex: 'text',
			ellipsis: true,
		},
		{
			title: t('manageQuestionBankQuestions.columnType'),
			dataIndex: 'type',
			width: 150,
			render: (type: QuestionType) => <Tag>{typeLabels[type]}</Tag>,
		},
		{
			title: t('manageQuestionBankQuestions.columnDifficulty'),
			dataIndex: 'difficulty',
			width: 120,
			render: (difficulty: DifficultyLevel) => (
				<Tag color={difficultyColors[difficulty]}>{difficultyLabels[difficulty]}</Tag>
			),
		},
		{
			title: t('manageQuestionBankQuestions.columnPoints'),
			dataIndex: 'points',
			width: 80,
		},
	];

	const availableColumns: ColumnsType<Question> = [
		{
			title: t('manageQuestionBankQuestions.columnQuestion'),
			dataIndex: 'text',
			ellipsis: true,
		},
		{
			title: t('manageQuestionBankQuestions.columnType'),
			dataIndex: 'type',
			width: 150,
			render: (type: QuestionType) => <Tag>{typeLabels[type]}</Tag>,
		},
		{
			title: t('manageQuestionBankQuestions.columnDifficulty'),
			dataIndex: 'difficulty',
			width: 120,
			render: (difficulty: DifficultyLevel) => (
				<Tag color={difficultyColors[difficulty]}>{difficultyLabels[difficulty]}</Tag>
			),
		},
		{
			title: t('manageQuestionBankQuestions.columnPoints'),
			dataIndex: 'points',
			width: 80,
		},
	];

	const rowSelection = {
		selectedRowKeys,
		onChange: (selectedKeys: React.Key[]) => {
			setSelectedRowKeys(selectedKeys);
		},
	};

	return (
		<>
			<Card
				title={t('manageQuestionBankQuestions.title', { count: bankPagination.total })}
				extra={
					<Space>
						{selectedRowKeys.length > 0 && (
							<Popconfirm
								title={t('manageQuestionBankQuestions.removeConfirm.title')}
								description={t('manageQuestionBankQuestions.removeConfirm.description', { count: selectedRowKeys.length })}
								onConfirm={handleRemoveQuestions}
								okText={t('manageQuestionBankQuestions.removeConfirm.ok')}
								cancelText={t('manageQuestionBankQuestions.removeConfirm.cancel')}
							>
								<Button danger icon={<DeleteOutlined />}>
									{t('manageQuestionBankQuestions.removeBtn', { count: selectedRowKeys.length })}
								</Button>
							</Popconfirm>
						)}
						<Button
							type="primary"
							icon={<PlusOutlined />}
							onClick={() => {
								setAddModalVisible(true);
								fetchAvailableQuestions();
							}}
						>
							{t('manageQuestionBankQuestions.addBtn')}
						</Button>
					</Space>
				}
			>
				<Table
					columns={columns}
					dataSource={questions}
					rowKey="id"
					loading={loading}
					rowSelection={rowSelection}
					pagination={{
						current: bankPagination.page,
						pageSize: bankPagination.size,
						total: bankPagination.total,
						onChange: (page, size) => {
							setPagination({ ...bankPagination, page, size });
						},
					}}
					locale={{
						emptyText: t('manageQuestionBankQuestions.noQuestions'),
					}}
				/>
			</Card>

			<Modal
				title={t('manageQuestionBankQuestions.addModal.title')}
				open={addModalVisible}
				onCancel={() => {
					setAddModalVisible(false);
					setSelectedQuestions([]);
				}}
				onOk={handleAddQuestions}
				okText={t('manageQuestionBankQuestions.addModal.ok')}
				cancelText={t('manageQuestionBankQuestions.addModal.cancel')}
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
					{/* Filter info */}
					{questions.length > 0 && (
						<Alert
							message={t('manageQuestionBankQuestions.filterInfo', { count: questions.length })}
							type="info"
							showIcon
							closable
						/>
					)}

					<Row gutter={[8, 8]}>
						<Col span={12}>
							<Input
								placeholder={t('manageQuestionBankQuestions.searchPlaceholder')}
								prefix={<SearchOutlined />}
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								onPressEnter={() => fetchAvailableQuestions({ page: 1, size: 10 })}
								disabled={fetchingQuestions}
							/>
						</Col>
						<Col span={6}>
							<Select
								placeholder={t('manageQuestionBankQuestions.filterByType')}
								allowClear
								style={{ width: '100%' }}
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
								placeholder={t('manageQuestionBankQuestions.filterByDifficulty')}
								allowClear
								style={{ width: '100%' }}
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
							icon={<FilterOutlined />}
							onClick={() => fetchAvailableQuestions({ page: 1, size: 10 })}
							loading={fetchingQuestions}
							disabled={fetchingQuestions}
						>
							{fetchingQuestions ? t('manageQuestionBankQuestions.searching') : t('manageQuestionBankQuestions.filter')}
						</Button>
						{!fetchingQuestions && availableQuestions.length > 0 && (
							<Text type="secondary">
								{t('manageQuestionBankQuestions.found', { count: availableQuestions.length })}
							</Text>
						)}
						{fetchingQuestions && (
							<Text type="secondary">
								{t('manageQuestionBankQuestions.loading')}
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
							onChange: (keys) => setSelectedQuestions(keys as number[]),
						}}
						pagination={{
							current: availablePagination.page,
							pageSize: availablePagination.size,
							total: availablePagination.total,
							onChange: (page, size) => {
								fetchAvailableQuestions({ page, size });
							},
						}}
						locale={{
							emptyText: (
								<Space direction="vertical" size="middle" style={{ padding: '40px 0' }}>
									<FileTextOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
									<Text type="secondary">
										{questions.length > 0
											? t('manageQuestionBankQuestions.allQuestionsAdded')
											: t('manageQuestionBankQuestions.noQuestionsFound')}
									</Text>
									{questions.length === 0 && (
										<Text type="secondary" style={{ fontSize: 12 }}>
											{t('manageQuestionBankQuestions.tryChangeFilter')}
										</Text>
									)}
								</Space>
							),
						}}
					/>
				</Space>
			</Modal>
		</>
	);
};

export default ManageQuestionBankQuestions;
