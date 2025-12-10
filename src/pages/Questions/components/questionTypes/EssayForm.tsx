import { Alert, Card, Checkbox, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import React from 'react';
import { QuestionTypeFormProps } from './types';

const { TextArea } = Input;

export const EssayForm: React.FC<QuestionTypeFormProps> = ({ t }) => {
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
							<InputNumber min={1} style={{ width: '100%' }} placeholder="1" />
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
					<Input placeholder={t('questionForm.essay.suggestedLengthPlaceholder')} />
				</Form.Item>

				{/* Rubric Criteria */}
				<Card title={t('questionForm.essay.rubricCriteria')} type="inner" size="small">
					<Form.Item
						label={t('questionForm.essay.rubricCriteriaLabel')}
						name={['content', 'rubric_criteria']}
						tooltip={t('questionForm.essay.rubricCriteriaTooltip')}
					>
						<Select
							mode="tags"
							placeholder={t('questionForm.essay.rubricCriteriaPlaceholder')}
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
				<Card title={t('questionForm.essay.autoGradeSettings')} type="inner" size="small">
					<Space direction="vertical" style={{ width: '100%' }} size="middle">
						<Form.Item name={['content', 'auto_grade']} valuePropName="checked">
							<Checkbox>{t('questionForm.essay.enableAutoGrade')}</Checkbox>
						</Form.Item>

						<Form.Item
							noStyle
							shouldUpdate={(prevValues, currentValues) =>
								prevValues.content?.auto_grade !== currentValues.content?.auto_grade
							}
						>
							{({ getFieldValue }) => {
								const autoGrade = getFieldValue(['content', 'auto_grade']);

								return autoGrade ? (
									<Form.Item
										label={t('questionForm.essay.keywords')}
										name={['content', 'key_words']}
										tooltip={t('questionForm.essay.keywordsTooltip')}
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
};
