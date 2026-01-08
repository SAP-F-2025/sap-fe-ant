import {
	Card,
	Checkbox,
	Col,
	Divider,
	Form,
	Input,
	InputNumber,
	Row,
	Select,
	Space,
	Typography,
} from 'antd';
import React from 'react';
import { QuestionTypeFormProps } from './types';

const { TextArea } = Input;

export const FillBlankForm: React.FC<QuestionTypeFormProps> = ({ t }) => {
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
						<Checkbox>{t('questionForm.fillBlank.caseSensitiveLabel')}</Checkbox>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label={t('questionForm.fillBlank.trimSpaces')}
						name={['content', 'trim_spaces']}
						valuePropName="checked"
					>
						<Checkbox>{t('questionForm.fillBlank.trimSpacesLabel')}</Checkbox>
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
					const uniqueBlanks = Array.from(new Set(blankMatches)).sort() as string[];

					return (
						<>
							{uniqueBlanks.length > 0 ? (
								<Space direction="vertical" style={{ width: '100%' }} size="large">
									{uniqueBlanks.map((blankPlaceholder: string) => {
										const blankId = blankPlaceholder.replace(/[{}]/g, '');
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
};
