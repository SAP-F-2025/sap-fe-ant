import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import React from 'react';
import { QuestionTypeFormProps } from './types';

export const MultipleChoiceForm: React.FC<QuestionTypeFormProps> = ({
	t,
	handleMultiLinePaste,
}) => {
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
												message: t('questionForm.multipleChoice.enterId'),
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
												handleMultiLinePaste?.(
													e,
													name,
													add,
													'MC',
													fields.length
												)
											}
										/>
									</Form.Item>
									<Form.Item {...restField} name={[name, 'image_url']}>
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
				<Card title={t('questionForm.multipleChoice.settings')} type="inner" size="small">
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
							<Form.Item name={['content', 'partial_credit']} valuePropName="checked">
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
};
