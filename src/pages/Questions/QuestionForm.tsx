import { DeleteOutlined, PlusOutlined, RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import {
	Alert,
	Button,
	Card,
	Checkbox,
	Col,
	Divider,
	Form,
	Input,
	InputNumber,
	Radio,
	Row,
	Select,
	Space,
	Spin,
	Tag,
	Typography,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import questionService from '../../services/questionService';
import { DifficultyLevel, QuestionCreateRequest, QuestionType } from '../../types';
import { showSuccess } from '../../utils/errorHandler';

const { Title } = Typography;
const { TextArea } = Input;

const QuestionForm: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.MultipleChoice);
	const isEdit = Boolean(id);

	// Detect if we're in student context
	const isStudentContext = location.pathname.startsWith('/student');
	const basePath = isStudentContext ? '/student/questions' : '/questions';

	useEffect(() => {
		if (isEdit && id) {
			fetchQuestion(parseInt(id));
		}
	}, [id]);

	const fetchQuestion = async (questionId: number) => {
		setLoading(true);
		try {
			const question = await questionService.getQuestion(questionId);
			// Convert tags array to comma-separated string for display in Input field
			const formData = {
				...question,
				tags: Array.isArray(question.tags) ? question.tags.join(', ') : question.tags,
			};
			form.setFieldsValue(formData);
			setQuestionType(question.type);
		} catch (error) {
			// Error will be handled by axios interceptor
			navigate(basePath);
		} finally {
			setLoading(false);
		}
	};

	const onFinish = async (values: any) => {
		setSubmitting(true);
		try {
			const data: QuestionCreateRequest = {
				...values,
				tags: values.tags
					? Array.isArray(values.tags)
						? values.tags
						: values.tags.split(',').map((tag: string) => tag.trim())
					: [],
			};

			// Auto-generate correct_order for Ordering questions
			if (data.type === QuestionType.Ordering && data.content?.items) {
				data.content.correct_order = data.content.items
					.map((item: any) => item?.id)
					.filter(Boolean);
			}

			// Set default max_length for ShortAnswer questions if not provided
			if (data.type === QuestionType.ShortAnswer && !data.content?.max_length) {
				data.content = {
					...data.content,
					max_length: 100,
				};
			}

			if (isEdit && id) {
				await questionService.updateQuestion(parseInt(id), data);
				showSuccess(t('questionForm.updateSuccess'));
			} else {
				await questionService.createQuestion(data);
				showSuccess(t('questionForm.createSuccess'));
			}
			navigate(basePath);
		} catch (error) {
			// Error will be handled by axios interceptor with notification
		} finally {
			setSubmitting(false);
		}
	};

	// Helper function to handle multi-line paste for Form.List items
	const handleMultiLinePaste = useCallback(
		(
			e: React.ClipboardEvent<HTMLInputElement>,
			currentIndex: number,
			add: (defaultValue?: object, insertIndex?: number) => void,
			idPrefix: string,
			currentFieldsLength: number
		) => {
			const pastedText = e.clipboardData.getData('text');
			const lines = pastedText.split(/\r?\n/).filter((line) => line.trim() !== '');

			// Only handle multi-line paste
			if (lines.length > 1) {
				e.preventDefault();

				// Set the first line to the current input
				const currentOptions = form.getFieldValue(['content', 'options']) || [];
				const currentLeftItems = form.getFieldValue(['content', 'left_items']) || [];
				const currentRightItems = form.getFieldValue(['content', 'right_items']) || [];
				const currentItems = form.getFieldValue(['content', 'items']) || [];

				// Determine which list we're working with based on idPrefix
				let fieldPath: string[];
				let currentList: any[];

				if (idPrefix === 'L') {
					fieldPath = ['content', 'left_items'];
					currentList = [...currentLeftItems];
				} else if (idPrefix === 'R') {
					fieldPath = ['content', 'right_items'];
					currentList = [...currentRightItems];
				} else if (idPrefix === 'O') {
					fieldPath = ['content', 'items'];
					currentList = [...currentItems];
				} else {
					fieldPath = ['content', 'options'];
					currentList = [...currentOptions];
				}

				// Update current item with first line
				if (currentList[currentIndex]) {
					currentList[currentIndex] = {
						...currentList[currentIndex],
						text: lines[0].trim(),
					};
				}

				// Add remaining lines - first fill empty items below, then create new ones
				let lineIndex = 1;
				let nextItemIndex = currentIndex + 1;

				// First, fill empty items below the current one
				while (lineIndex < lines.length && nextItemIndex < currentList.length) {
					const item = currentList[nextItemIndex];
					// Check if this item is empty (no text or empty text)
					if (!item?.text || item.text.trim() === '') {
						currentList[nextItemIndex] = {
							...item,
							text: lines[lineIndex].trim(),
						};
						lineIndex++;
					}
					nextItemIndex++;
				}

				// Then, create new items for remaining lines
				for (let i = lineIndex; i < lines.length; i++) {
					const newIndex = currentList.length;
					let newItem: object;

					if (idPrefix === 'L' || idPrefix === 'R') {
						newItem = {
							id: `${idPrefix}${newIndex + 1}`,
							text: lines[i].trim(),
						};
					} else if (idPrefix === 'O') {
						newItem = {
							id: `${idPrefix}${newIndex + 1}`,
							text: lines[i].trim(),
						};
					} else {
						// Multiple choice
						newItem = {
							id: String.fromCharCode(65 + newIndex),
							text: lines[i].trim(),
							order: newIndex + 1,
						};
					}
					currentList.push(newItem);
				}

				form.setFieldValue(fieldPath, currentList);
			}
		},
		[form]
	);

	const renderQuestionTypeContent = () => {
		switch (questionType) {
			case QuestionType.MultipleChoice:
				return (
					<Card title={t('questionForm.multipleChoice.title')} type="inner">
						<Space direction="vertical" style={{ width: '100%' }} size="large">
							{/* Options List */}
							<Form.List name={['content', 'options']}>
								{(fields, { add, remove }) => (
									<>
										{fields.map(({ key, name, ...restField }) => (
											<Space
												key={key}
												style={{
													display: 'flex',
													marginBottom: 8,
													flexWrap: 'wrap',
												}}
												align="baseline"
											>
												<Form.Item
													{...restField}
													name={[name, 'id']}
													initialValue={String.fromCharCode(65 + name)}
													rules={[
														{
															required: true,
															message: t(
																'questionForm.multipleChoice.enterId'
															),
														},
													]}
												>
													<Input
														placeholder={t(
															'questionForm.multipleChoice.idPlaceholder'
														)}
														style={{
															width: 80,
														}}
													/>
												</Form.Item>
												<Form.Item
													{...restField}
													name={[name, 'text']}
													rules={[
														{
															required: true,
															message: t(
																'questionForm.multipleChoice.enterContent'
															),
														},
													]}
												>
													<Input
														placeholder={t(
															'questionForm.multipleChoice.contentPlaceholder'
														)}
														style={{
															width: 300,
														}}
														onPaste={(e) =>
															handleMultiLinePaste(
																e,
																name,
																add,
																'MC',
																fields.length
															)
														}
													/>
												</Form.Item>
												<Form.Item
													{...restField}
													name={[name, 'image_url']}
												>
													<Input
														placeholder={t(
															'questionForm.multipleChoice.imageUrlPlaceholder'
														)}
														style={{
															width: 200,
														}}
													/>
												</Form.Item>
												<Form.Item
													{...restField}
													name={[name, 'order']}
													initialValue={name + 1}
													rules={[
														{
															required: true,
															message: t(
																'questionForm.multipleChoice.enterOrder'
															),
														},
													]}
												>
													<InputNumber
														placeholder={t(
															'questionForm.multipleChoice.orderPlaceholder'
														)}
														min={1}
														style={{
															width: 80,
														}}
													/>
												</Form.Item>
												<DeleteOutlined onClick={() => remove(name)} />
											</Space>
										))}
										<Form.Item>
											<Button
												type="dashed"
												onClick={() =>
													add({
														id: String.fromCharCode(65 + fields.length),
														order: fields.length + 1,
													})
												}
												block
												icon={<PlusOutlined />}
											>
												{t('questionForm.multipleChoice.addOption')}
											</Button>
										</Form.Item>
									</>
								)}
							</Form.List>

							{/* Correct Answers */}
							<Form.Item
								noStyle
								shouldUpdate={(prevValues, currentValues) =>
									prevValues.content?.options !== currentValues.content?.options
								}
							>
								{({ getFieldValue }) => {
									const options = getFieldValue(['content', 'options']) || [];
									return (
										<Form.Item
											label={t('questionForm.multipleChoice.correctAnswer')}
											name={['content', 'correct_answers']}
											rules={[
												{
													required: true,
													message: t(
														'questionForm.multipleChoice.selectCorrectAnswer'
													),
												},
											]}
										>
											<Select
												mode="multiple"
												placeholder={t(
													'questionForm.multipleChoice.selectCorrectAnswer'
												)}
												style={{ width: '100%' }}
												options={options
													.map((opt: any) => ({
														label: `${opt?.id || ''} - ${opt?.text || ''}`,
														value: opt?.id,
													}))
													.filter((opt: any) => opt.value)}
											/>
										</Form.Item>
									);
								}}
							</Form.Item>

							{/* Settings */}
							<Card
								title={t('questionForm.multipleChoice.settings')}
								type="inner"
								size="small"
							>
								<Row gutter={[16, 16]}>
									<Col span={8}>
										<Form.Item
											name={['content', 'multiple_correct']}
											valuePropName="checked"
										>
											<Checkbox>
												{t('questionForm.multipleChoice.allowMultiple')}
											</Checkbox>
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item
											name={['content', 'randomize_options']}
											valuePropName="checked"
										>
											<Checkbox>
												{t('questionForm.multipleChoice.randomizeOptions')}
											</Checkbox>
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item
											name={['content', 'partial_credit']}
											valuePropName="checked"
										>
											<Checkbox>
												{t('questionForm.multipleChoice.partialCredit')}
											</Checkbox>
										</Form.Item>
									</Col>
								</Row>
							</Card>
						</Space>
					</Card>
				);
			case QuestionType.TrueFalse:
				return (
					<Card title={t('questionForm.trueFalse.title')} type="inner">
						<Space direction="vertical" style={{ width: '100%' }} size="large">
							{/* Correct Answer */}
							<Form.Item
								label={t('questionForm.trueFalse.correctAnswer')}
								name={['content', 'correct_answer']}
								rules={[
									{
										required: true,
										message: t('questionForm.trueFalse.selectCorrectAnswer'),
									},
								]}
							>
								<Radio.Group>
									<Radio value={true}>{t('questionForm.trueFalse.true')}</Radio>
									<Radio value={false}>{t('questionForm.trueFalse.false')}</Radio>
								</Radio.Group>
							</Form.Item>

							{/* Custom Labels */}
							<Card
								title={t('questionForm.trueFalse.customLabels')}
								type="inner"
								size="small"
							>
								<Row gutter={16}>
									<Col span={12}>
										<Form.Item
											label={t('questionForm.trueFalse.trueLabel')}
											name={['content', 'true_label']}
											tooltip={t('questionForm.trueFalse.trueLabelTooltip')}
										>
											<Input
												placeholder={t(
													'questionForm.trueFalse.trueLabelPlaceholder'
												)}
											/>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item
											label={t('questionForm.trueFalse.falseLabel')}
											name={['content', 'false_label']}
											tooltip={t('questionForm.trueFalse.falseLabelTooltip')}
										>
											<Input
												placeholder={t(
													'questionForm.trueFalse.falseLabelPlaceholder'
												)}
											/>
										</Form.Item>
									</Col>
								</Row>
							</Card>
						</Space>
					</Card>
				);

			case QuestionType.Essay:
				return (
					<Card title={t('questionForm.essay.title')} type="inner">
						<Space direction="vertical" style={{ width: '100%' }} size="large">
							{/* Word Limits */}
							<Row gutter={16}>
								<Col span={12}>
									<Form.Item
										label={t('questionForm.essay.minWords')}
										name={['content', 'min_words']}
										initialValue={1}
									>
										<InputNumber
											min={1}
											style={{ width: '100%' }}
											placeholder="1"
										/>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										label={t('questionForm.essay.maxWords')}
										name={['content', 'max_words']}
										tooltip={t('questionForm.essay.maxWordsTooltip')}
									>
										<InputNumber
											min={1}
											style={{ width: '100%' }}
											placeholder={t('questionForm.essay.unlimited')}
										/>
									</Form.Item>
								</Col>
							</Row>

							{/* Suggested Length */}
							<Form.Item
								label={t('questionForm.essay.suggestedLength')}
								name={['content', 'suggested_length']}
								tooltip={t('questionForm.essay.suggestedLengthTooltip')}
							>
								<Input
									placeholder={t('questionForm.essay.suggestedLengthPlaceholder')}
								/>
							</Form.Item>

							{/* Rubric Criteria */}
							<Card
								title={t('questionForm.essay.rubricCriteria')}
								type="inner"
								size="small"
							>
								<Form.Item
									label={t('questionForm.essay.rubricCriteriaLabel')}
									name={['content', 'rubric_criteria']}
									tooltip={t('questionForm.essay.rubricCriteriaTooltip')}
								>
									<Select
										mode="tags"
										placeholder={t(
											'questionForm.essay.rubricCriteriaPlaceholder'
										)}
										style={{ width: '100%' }}
									/>
								</Form.Item>
							</Card>

							{/* Sample Answer */}
							<Form.Item
								label={t('questionForm.essay.sampleAnswer')}
								name={['content', 'sample_answer']}
								tooltip={t('questionForm.essay.sampleAnswerTooltip')}
							>
								<TextArea
									rows={6}
									placeholder={t('questionForm.essay.sampleAnswerPlaceholder')}
								/>
							</Form.Item>

							{/* Auto Grading Settings */}
							<Card
								title={t('questionForm.essay.autoGradeSettings')}
								type="inner"
								size="small"
							>
								<Space direction="vertical" style={{ width: '100%' }} size="middle">
									<Form.Item
										name={['content', 'auto_grade']}
										valuePropName="checked"
									>
										<Checkbox>
											{t('questionForm.essay.enableAutoGrade')}
										</Checkbox>
									</Form.Item>

									<Form.Item
										noStyle
										shouldUpdate={(prevValues, currentValues) =>
											prevValues.content?.auto_grade !==
											currentValues.content?.auto_grade
										}
									>
										{({ getFieldValue }) => {
											const autoGrade = getFieldValue([
												'content',
												'auto_grade',
											]);

											return autoGrade ? (
												<Form.Item
													label={t('questionForm.essay.keywords')}
													name={['content', 'key_words']}
													tooltip={t(
														'questionForm.essay.keywordsTooltip'
													)}
												>
													<Select
														mode="tags"
														placeholder={t(
															'questionForm.essay.keywordsPlaceholder'
														)}
														style={{
															width: '100%',
														}}
													/>
												</Form.Item>
											) : null;
										}}
									</Form.Item>
								</Space>
							</Card>

							<Alert
								message={t('questionForm.essay.autoGradeNote')}
								description={t('questionForm.essay.autoGradeNoteDesc')}
								type="warning"
								showIcon
							/>
						</Space>
					</Card>
				);

			case QuestionType.FillBlank:
				return (
					<Card title={t('questionForm.fillBlank.title')} type="inner">
						<Form.Item
							label={t('questionForm.fillBlank.template')}
							name={['content', 'template']}
							rules={[
								{
									required: true,
									message: t('questionForm.fillBlank.templateRequired'),
								},
							]}
							tooltip={t('questionForm.fillBlank.templateTooltip')}
						>
							<TextArea
								rows={3}
								placeholder={t('questionForm.fillBlank.templatePlaceholder')}
								showCount
							/>
						</Form.Item>

						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									label={t('questionForm.fillBlank.caseSensitive')}
									name={['content', 'case_sensitive']}
									valuePropName="checked"
								>
									<Checkbox>
										{t('questionForm.fillBlank.caseSensitiveLabel')}
									</Checkbox>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label={t('questionForm.fillBlank.trimSpaces')}
									name={['content', 'trim_spaces']}
									valuePropName="checked"
								>
									<Checkbox>
										{t('questionForm.fillBlank.trimSpacesLabel')}
									</Checkbox>
								</Form.Item>
							</Col>
						</Row>

						<Divider>{t('questionForm.fillBlank.blankConfig')}</Divider>

						<Form.Item
							noStyle
							shouldUpdate={(prevValues, currentValues) =>
								prevValues.content?.template !== currentValues.content?.template
							}
						>
							{({ getFieldValue }) => {
								const template = getFieldValue(['content', 'template']) || '';
								const blankMatches = template.match(/\{blank\d+\}/g) || [];
								const uniqueBlanks = Array.from(
									new Set(blankMatches)
								).sort() as string[];

								return (
									<>
										{uniqueBlanks.length > 0 ? (
											<Space
												direction="vertical"
												style={{ width: '100%' }}
												size="large"
											>
												{uniqueBlanks.map((blankPlaceholder: string) => {
													const blankId = blankPlaceholder.replace(
														/[{}]/g,
														''
													);
													return (
														<Card
															key={blankId}
															type="inner"
															size="small"
															title={`${t('questionForm.fillBlank.blankTitle')}: ${blankPlaceholder}`}
														>
															<Form.Item
																label={t(
																	'questionForm.fillBlank.acceptedAnswers'
																)}
																name={[
																	'content',
																	'blanks',
																	blankId,
																	'accepted_answers',
																]}
																rules={[
																	{
																		required: true,
																		message: t(
																			'questionForm.fillBlank.acceptedAnswersRequired'
																		),
																	},
																]}
															>
																<Select
																	mode="tags"
																	placeholder={t(
																		'questionForm.fillBlank.acceptedAnswersPlaceholder'
																	)}
																	style={{
																		width: '100%',
																	}}
																/>
															</Form.Item>

															<Row gutter={16}>
																<Col span={12}>
																	<Form.Item
																		label={t(
																			'questionForm.fillBlank.blankPoints'
																		)}
																		name={[
																			'content',
																			'blanks',
																			blankId,
																			'points',
																		]}
																		rules={[
																			{
																				required: true,
																				message: t(
																					'questionForm.fillBlank.blankPointsRequired'
																				),
																			},
																		]}
																	>
																		<InputNumber
																			min={1}
																			max={100}
																			style={{
																				width: '100%',
																			}}
																			placeholder={t(
																				'questionForm.fillBlank.blankPointsPlaceholder'
																			)}
																		/>
																	</Form.Item>
																</Col>
																<Col span={12}>
																	<Form.Item
																		label={t(
																			'questionForm.fillBlank.placeholderText'
																		)}
																		name={[
																			'content',
																			'blanks',
																			blankId,
																			'placeholder_text',
																		]}
																	>
																		<Input
																			placeholder={t(
																				'questionForm.fillBlank.placeholderTextPlaceholder'
																			)}
																		/>
																	</Form.Item>
																</Col>
															</Row>
														</Card>
													);
												})}
											</Space>
										) : (
											<Typography.Text type="secondary">
												{t('questionForm.fillBlank.templateHint')}
											</Typography.Text>
										)}
									</>
								);
							}}
						</Form.Item>
					</Card>
				);

			case QuestionType.Matching:
				return (
					<Card title={t('questionForm.matching.title')} type="inner">
						<Space direction="vertical" style={{ width: '100%' }} size="large">
							{/* Left Items */}
							<Card
								title={t('questionForm.matching.leftItems')}
								type="inner"
								size="small"
							>
								<Form.List name={['content', 'left_items']}>
									{(fields, { add, remove }) => (
										<>
											{fields.map(({ key, name, ...restField }) => (
												<Space
													key={key}
													style={{
														display: 'flex',
														marginBottom: 8,
													}}
													align="baseline"
												>
													<Form.Item
														{...restField}
														name={[name, 'id']}
														initialValue={`L${name + 1}`}
														rules={[
															{
																required: true,
																message: t(
																	'questionForm.matching.enterId'
																),
															},
														]}
													>
														<Input
															placeholder={t(
																'questionForm.matching.leftIdPlaceholder'
															)}
															style={{
																width: 100,
															}}
														/>
													</Form.Item>
													<Form.Item
														{...restField}
														name={[name, 'text']}
														rules={[
															{
																required: true,
																message: t(
																	'questionForm.matching.enterContent'
																),
															},
														]}
													>
														<Input
															placeholder={t(
																'questionForm.matching.contentPlaceholder'
															)}
															style={{
																width: 300,
															}}
															onPaste={(e) =>
																handleMultiLinePaste(
																	e,
																	name,
																	add,
																	'L',
																	fields.length
																)
															}
														/>
													</Form.Item>
													<Form.Item
														{...restField}
														name={[name, 'image_url']}
													>
														<Input
															placeholder={t(
																'questionForm.matching.imageUrlPlaceholder'
															)}
															style={{
																width: 200,
															}}
														/>
													</Form.Item>
													<DeleteOutlined onClick={() => remove(name)} />
												</Space>
											))}
											<Form.Item>
												<Button
													type="dashed"
													onClick={() =>
														add({ id: `L${fields.length + 1}` })
													}
													block
													icon={<PlusOutlined />}
												>
													{t('questionForm.matching.addLeftItem')}
												</Button>
											</Form.Item>
										</>
									)}
								</Form.List>
							</Card>

							{/* Right Items */}
							<Card
								title={t('questionForm.matching.rightItems')}
								type="inner"
								size="small"
							>
								<Form.List name={['content', 'right_items']}>
									{(fields, { add, remove }) => (
										<>
											{fields.map(({ key, name, ...restField }) => (
												<Space
													key={key}
													style={{
														display: 'flex',
														marginBottom: 8,
													}}
													align="baseline"
												>
													<Form.Item
														{...restField}
														name={[name, 'id']}
														initialValue={`R${name + 1}`}
														rules={[
															{
																required: true,
																message: t(
																	'questionForm.matching.enterId'
																),
															},
														]}
													>
														<Input
															placeholder={t(
																'questionForm.matching.rightIdPlaceholder'
															)}
															style={{
																width: 100,
															}}
														/>
													</Form.Item>
													<Form.Item
														{...restField}
														name={[name, 'text']}
														rules={[
															{
																required: true,
																message: t(
																	'questionForm.matching.enterContent'
																),
															},
														]}
													>
														<Input
															placeholder={t(
																'questionForm.matching.contentPlaceholder'
															)}
															style={{
																width: 300,
															}}
															onPaste={(e) =>
																handleMultiLinePaste(
																	e,
																	name,
																	add,
																	'R',
																	fields.length
																)
															}
														/>
													</Form.Item>
													<Form.Item
														{...restField}
														name={[name, 'image_url']}
													>
														<Input
															placeholder={t(
																'questionForm.matching.imageUrlPlaceholder'
															)}
															style={{
																width: 200,
															}}
														/>
													</Form.Item>
													<DeleteOutlined onClick={() => remove(name)} />
												</Space>
											))}
											<Form.Item>
												<Button
													type="dashed"
													onClick={() =>
														add({ id: `R${fields.length + 1}` })
													}
													block
													icon={<PlusOutlined />}
												>
													{t('questionForm.matching.addRightItem')}
												</Button>
											</Form.Item>
										</>
									)}
								</Form.List>
							</Card>

							{/* Correct Pairs */}
							<Card
								title={t('questionForm.matching.correctPairs')}
								type="inner"
								size="small"
							>
								<Form.Item
									noStyle
									shouldUpdate={(prevValues, currentValues) =>
										prevValues.content?.left_items !==
											currentValues.content?.left_items ||
										prevValues.content?.right_items !==
											currentValues.content?.right_items
									}
								>
									{({ getFieldValue }) => {
										const leftItems =
											getFieldValue(['content', 'left_items']) || [];
										const rightItems =
											getFieldValue(['content', 'right_items']) || [];

										return (
											<Form.List name={['content', 'correct_pairs']}>
												{(fields, { add, remove }) => (
													<>
														{fields.map(
															({ key, name, ...restField }) => (
																<Space
																	key={key}
																	style={{
																		display: 'flex',
																		marginBottom: 8,
																	}}
																	align="baseline"
																>
																	<Form.Item
																		{...restField}
																		name={[name, 'left_id']}
																		rules={[
																			{
																				required: true,
																				message: t(
																					'questionForm.matching.selectLeft'
																				),
																			},
																		]}
																	>
																		<Select
																			placeholder={t(
																				'questionForm.matching.selectLeftPlaceholder'
																			)}
																			style={{
																				width: 250,
																			}}
																			options={leftItems
																				.map(
																					(
																						item: any
																					) => ({
																						label: `${item?.id || ''} - ${item?.text || ''}`,
																						value: item?.id,
																					})
																				)
																				.filter(
																					(opt: any) =>
																						opt.value
																				)}
																		/>
																	</Form.Item>
																	<span>⟷</span>
																	<Form.Item
																		{...restField}
																		name={[name, 'right_id']}
																		rules={[
																			{
																				required: true,
																				message: t(
																					'questionForm.matching.selectRight'
																				),
																			},
																		]}
																	>
																		<Select
																			placeholder={t(
																				'questionForm.matching.selectRightPlaceholder'
																			)}
																			style={{
																				width: 250,
																			}}
																			options={rightItems
																				.map(
																					(
																						item: any
																					) => ({
																						label: `${item?.id || ''} - ${item?.text || ''}`,
																						value: item?.id,
																					})
																				)
																				.filter(
																					(opt: any) =>
																						opt.value
																				)}
																		/>
																	</Form.Item>
																	<DeleteOutlined
																		onClick={() => remove(name)}
																	/>
																</Space>
															)
														)}
														<Form.Item>
															<Button
																type="dashed"
																onClick={() => add()}
																block
																icon={<PlusOutlined />}
																disabled={
																	leftItems.length === 0 ||
																	rightItems.length === 0
																}
															>
																{t('questionForm.matching.addPair')}
															</Button>
														</Form.Item>
														{(leftItems.length === 0 ||
															rightItems.length === 0) && (
															<Typography.Text type="secondary">
																{t(
																	'questionForm.matching.addPairHint'
																)}
															</Typography.Text>
														)}
													</>
												)}
											</Form.List>
										);
									}}
								</Form.Item>
							</Card>

							{/* Settings */}
							<Card
								title={t('questionForm.matching.settings')}
								type="inner"
								size="small"
							>
								<Row gutter={16}>
									<Col span={8}>
										<Form.Item
											name={['content', 'randomize_left']}
											valuePropName="checked"
										>
											<Checkbox>
												{t('questionForm.matching.randomizeLeft')}
											</Checkbox>
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item
											name={['content', 'randomize_right']}
											valuePropName="checked"
										>
											<Checkbox>
												{t('questionForm.matching.randomizeRight')}
											</Checkbox>
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item
											name={['content', 'partial_credit']}
											valuePropName="checked"
										>
											<Checkbox>
												{t('questionForm.matching.partialCredit')}
											</Checkbox>
										</Form.Item>
									</Col>
								</Row>
							</Card>
						</Space>
					</Card>
				);

			case QuestionType.Ordering:
				return (
					<Card title={t('questionForm.ordering.title')} type="inner">
						<Space direction="vertical" style={{ width: '100%' }} size="large">
							{/* Items List */}
							<Card
								title={t('questionForm.ordering.itemsList')}
								type="inner"
								size="small"
							>
								<Form.List name={['content', 'items']}>
									{(fields, { add, remove }) => (
										<>
											{fields.map(({ key, name, ...restField }) => (
												<Space
													key={key}
													style={{
														display: 'flex',
														marginBottom: 8,
													}}
													align="baseline"
												>
													<Typography.Text
														style={{
															minWidth: '30px',
														}}
													>
														{name + 1}.
													</Typography.Text>
													<Form.Item
														{...restField}
														name={[name, 'id']}
														initialValue={`O${name + 1}`}
														rules={[
															{
																required: true,
																message: t(
																	'questionForm.ordering.enterId'
																),
															},
														]}
													>
														<Input
															placeholder={t(
																'questionForm.ordering.idPlaceholder'
															)}
															style={{
																width: 100,
															}}
														/>
													</Form.Item>
													<Form.Item
														{...restField}
														name={[name, 'text']}
														rules={[
															{
																required: true,
																message: t(
																	'questionForm.ordering.enterContent'
																),
															},
														]}
													>
														<Input
															placeholder={t(
																'questionForm.ordering.contentPlaceholder'
															)}
															style={{
																width: 350,
															}}
															onPaste={(e) =>
																handleMultiLinePaste(
																	e,
																	name,
																	add,
																	'O',
																	fields.length
																)
															}
														/>
													</Form.Item>
													<Form.Item
														{...restField}
														name={[name, 'image_url']}
													>
														<Input
															placeholder={t(
																'questionForm.ordering.imageUrlPlaceholder'
															)}
															style={{
																width: 200,
															}}
														/>
													</Form.Item>
													<DeleteOutlined onClick={() => remove(name)} />
												</Space>
											))}
											<Form.Item>
												<Button
													type="dashed"
													onClick={() =>
														add({ id: `O${fields.length + 1}` })
													}
													block
													icon={<PlusOutlined />}
												>
													{t('questionForm.ordering.addItem')}
												</Button>
											</Form.Item>
										</>
									)}
								</Form.List>
								<Typography.Text type="secondary">
									{t('questionForm.ordering.orderNote')}
								</Typography.Text>
							</Card>

							{/* Correct Order (Auto-generated preview) */}
							<Card
								title={t('questionForm.ordering.correctOrder')}
								type="inner"
								size="small"
							>
								<Form.Item
									noStyle
									shouldUpdate={(prevValues, currentValues) =>
										prevValues.content?.items !== currentValues.content?.items
									}
								>
									{({ getFieldValue }) => {
										const items = getFieldValue(['content', 'items']) || [];

										// Auto-generate correct_order from items order
										const correctOrder = items
											.map((item: any) => item?.id)
											.filter(Boolean);

										return (
											<>
												{correctOrder.length > 0 ? (
													<Space wrap>
														{correctOrder.map(
															(id: string, index: number) => (
																<Tag key={id} color="blue">
																	{index + 1}. {id}
																</Tag>
															)
														)}
													</Space>
												) : (
													<Typography.Text type="secondary">
														{t('questionForm.ordering.noItems')}
													</Typography.Text>
												)}
												{/* Hidden field to store correct_order */}
												<Form.Item
													name={['content', 'correct_order']}
													hidden
													initialValue={correctOrder}
												>
													<Input />
												</Form.Item>
											</>
										);
									}}
								</Form.Item>
							</Card>

							{/* Settings */}
							<Card
								title={t('questionForm.ordering.settings')}
								type="inner"
								size="small"
							>
								<Row gutter={16}>
									<Col span={12}>
										<Form.Item
											name={['content', 'randomize_initial']}
											valuePropName="checked"
										>
											<Checkbox>
												{t('questionForm.ordering.randomizeInitial')}
											</Checkbox>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item
											name={['content', 'partial_credit']}
											valuePropName="checked"
										>
											<Checkbox>
												{t('questionForm.ordering.partialCredit')}
											</Checkbox>
										</Form.Item>
									</Col>
								</Row>
							</Card>
						</Space>
					</Card>
				);

			case QuestionType.ShortAnswer:
				return (
					<Card title={t('questionForm.shortAnswer.title')} type="inner">
						<Space direction="vertical" style={{ width: '100%' }} size="large">
							{/* Accepted Answers */}
							<Form.Item
								label={t('questionForm.shortAnswer.acceptedAnswers')}
								name={['content', 'accepted_answers']}
								rules={[
									{
										required: true,
										message: t(
											'questionForm.shortAnswer.acceptedAnswersRequired'
										),
									},
								]}
								tooltip={t('questionForm.shortAnswer.acceptedAnswersTooltip')}
							>
								<Select
									mode="tags"
									placeholder={t(
										'questionForm.shortAnswer.acceptedAnswersPlaceholder'
									)}
									style={{ width: '100%' }}
								/>
							</Form.Item>
							{/* Placeholder Text */}
							<Form.Item
								label={t('questionForm.shortAnswer.placeholderText')}
								name={['content', 'placeholder_text']}
							>
								<Input
									placeholder={t(
										'questionForm.shortAnswer.placeholderTextPlaceholder'
									)}
								/>
							</Form.Item>
							{/* Max Length */}
							<Form.Item
								label={t('questionForm.shortAnswer.maxLength')}
								name={['content', 'max_length']}
								rules={[
									{
										type: 'number',
										min: 1,
										max: 500,
										message: t('questionForm.shortAnswer.maxLengthRange'),
									},
								]}
							>
								<InputNumber
									min={1}
									max={500}
									style={{ width: '100%' }}
									placeholder={t('questionForm.shortAnswer.maxLengthPlaceholder')}
								/>
							</Form.Item>{' '}
							{/* Matching Settings */}
							<Card
								title={t('questionForm.shortAnswer.matchingSettings')}
								type="inner"
								size="small"
							>
								<Row gutter={[16, 16]}>
									<Col span={8}>
										<Form.Item
											name={['content', 'case_sensitive']}
											valuePropName="checked"
										>
											<Checkbox>
												{t('questionForm.shortAnswer.caseSensitive')}
											</Checkbox>
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item
											name={['content', 'exact_match']}
											valuePropName="checked"
										>
											<Checkbox>
												{t('questionForm.shortAnswer.exactMatch')}
											</Checkbox>
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item
											name={['content', 'fuzzy_matching']}
											valuePropName="checked"
											tooltip={t(
												'questionForm.shortAnswer.fuzzyMatchingTooltip'
											)}
										>
											<Checkbox>
												{t('questionForm.shortAnswer.fuzzyMatching')}
											</Checkbox>
										</Form.Item>
									</Col>
								</Row>
							</Card>
							<Alert
								message={t('questionForm.shortAnswer.matchingNote')}
								description={
									<ul
										style={{
											marginBottom: 0,
											paddingLeft: '20px',
										}}
									>
										<li>{t('questionForm.shortAnswer.matchingNoteDesc1')}</li>
										<li>{t('questionForm.shortAnswer.matchingNoteDesc2')}</li>
										<li>{t('questionForm.shortAnswer.matchingNoteDesc3')}</li>
									</ul>
								}
								type="info"
								showIcon
							/>
						</Space>
					</Card>
				);

			default:
				return null;
		}
	};

	if (loading) {
		return (
			<div style={{ textAlign: 'center', padding: '100px 0' }}>
				<Spin size="large" />
			</div>
		);
	}

	return (
		<Space direction="vertical" size="large" style={{ width: '100%' }}>
			<Row justify="space-between" align="middle">
				<Col>
					<Title level={2}>
						{isEdit ? t('questionForm.editTitle') : t('questionForm.createTitle')}
					</Title>
				</Col>
				<Col>
					<Button icon={<RollbackOutlined />} onClick={() => navigate('/questions')}>
						{t('questionForm.back')}
					</Button>
				</Col>
			</Row>

			<Form
				form={form}
				layout="vertical"
				onFinish={onFinish}
				initialValues={{
					type: QuestionType.MultipleChoice,
					points: 10,
					difficulty: DifficultyLevel.Medium,
					content: {
						// Multiple Choice fields
						options: [
							{ id: 'A', text: '', order: 1, image_url: '' },
							{ id: 'B', text: '', order: 2, image_url: '' },
						],
						correct_answers: [],
						multiple_correct: false,
						randomize_options: false,
						partial_credit: false,
						// True False fields
						correct_answer: true,
						true_label: '',
						false_label: '',
						// Fill blank fields
						template: '',
						blanks: {},
						case_sensitive: false,
						trim_spaces: true,
						// Matching fields
						left_items: [],
						right_items: [],
						correct_pairs: [],
						randomize_left: false,
						randomize_right: false,
						// Ordering fields
						items: [],
						correct_order: [],
						randomize_initial: false,
						// Short Answer fields
						accepted_answers: [],
						exact_match: false,
						max_length: undefined,
						placeholder_text: '',
						fuzzy_matching: false,
						// Essay fields
						min_words: undefined,
						max_words: undefined,
						suggested_length: '',
						rubric_criteria: [],
						sample_answer: '',
						auto_grade: false,
						key_words: [],
					},
				}}
			>
				<Card title={t('questionForm.basicInfo')}>
					<Row gutter={16}>
						<Col xs={24} sm={12}>
							<Form.Item
								label={t('questionForm.questionType')}
								name="type"
								rules={[
									{
										required: true,
										message: t('questionForm.selectQuestionType'),
									},
								]}
							>
								<Select
									onChange={(value) => setQuestionType(value)}
									options={[
										{
											label: t('question.type.multipleChoice'),
											value: QuestionType.MultipleChoice,
										},
										{
											label: t('question.type.trueFalse'),
											value: QuestionType.TrueFalse,
										},
										{
											label: t('question.type.essay'),
											value: QuestionType.Essay,
										},
										{
											label: t('question.type.fillBlank'),
											value: QuestionType.FillBlank,
										},
										{
											label: t('question.type.matching'),
											value: QuestionType.Matching,
										},
										{
											label: t('question.type.ordering'),
											value: QuestionType.Ordering,
										},
										{
											label: t('question.type.shortAnswer'),
											value: QuestionType.ShortAnswer,
										},
									]}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={12}>
							<Form.Item
								label={t('questionForm.difficulty')}
								name="difficulty"
								rules={[
									{
										required: true,
										message: t('questionForm.selectDifficulty'),
									},
								]}
							>
								<Select
									options={[
										{
											label: t('questionList.easy'),
											value: DifficultyLevel.Easy,
										},
										{
											label: t('questionList.medium'),
											value: DifficultyLevel.Medium,
										},
										{
											label: t('questionList.hard'),
											value: DifficultyLevel.Hard,
										},
									]}
								/>
							</Form.Item>
						</Col>
					</Row>

					<Form.Item
						label={t('questionForm.questionContent')}
						name="text"
						rules={[
							{
								required: true,
								message: t('questionForm.enterQuestionContent'),
							},
						]}
					>
						<TextArea
							rows={4}
							placeholder={t('questionForm.enterQuestionContent')}
							showCount
						/>
					</Form.Item>

					<Row gutter={16}>
						<Col xs={24} sm={12}>
							<Form.Item
								label={t('questionForm.points')}
								name="points"
								rules={[
									{
										required: true,
										message: t('questionForm.enterPoints'),
									},
								]}
							>
								<InputNumber min={1} max={100} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item label={t('questionForm.tags')} name="tags">
						<Input placeholder={t('questionForm.tagsPlaceholder')} />
					</Form.Item>

					<Form.Item label={t('questionForm.explanation')} name="explanation">
						<TextArea
							rows={3}
							placeholder={t('questionForm.explanationPlaceholder')}
							showCount
						/>
					</Form.Item>
				</Card>

				{renderQuestionTypeContent()}

				<Form.Item>
					<Space>
						<Button
							type="primary"
							htmlType="submit"
							icon={<SaveOutlined />}
							loading={submitting}
							size="large"
						>
							{isEdit ? t('questionForm.updateBtn') : t('questionForm.createBtn')}
						</Button>
						<Button onClick={() => navigate('/questions')} size="large">
							{t('questionForm.cancelBtn')}
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Space>
	);
};

export default QuestionForm;
