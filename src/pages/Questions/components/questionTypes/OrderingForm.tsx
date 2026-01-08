import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Form, Input, Row, Space, Tag, Typography } from 'antd';
import React from 'react';
import { QuestionTypeFormProps } from './types';

export const OrderingForm: React.FC<QuestionTypeFormProps> = ({ t, handleMultiLinePaste }) => {
	return (
		<Card title={t('questionForm.ordering.title')} type="inner">
			<Space direction="vertical" style={{ width: '100%' }} size="large">
				{/* Items List */}
				<Card title={t('questionForm.ordering.itemsList')} type="inner" size="small">
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
													message: t('questionForm.ordering.enterId'),
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
													handleMultiLinePaste?.(
														e,
														name,
														add,
														'O',
														fields.length
													)
												}
											/>
										</Form.Item>
										<Form.Item {...restField} name={[name, 'image_url']}>
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
										onClick={() => add({ id: `O${fields.length + 1}` })}
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
				<Card title={t('questionForm.ordering.correctOrder')} type="inner" size="small">
					<Form.Item
						noStyle
						shouldUpdate={(prevValues, currentValues) =>
							prevValues.content?.items !== currentValues.content?.items
						}
					>
						{({ getFieldValue }) => {
							const items = getFieldValue(['content', 'items']) || [];

							// Auto-generate correct_order from items order
							const correctOrder = items.map((item: any) => item?.id).filter(Boolean);

							return (
								<>
									{correctOrder.length > 0 ? (
										<Space wrap>
											{correctOrder.map((id: string, index: number) => (
												<Tag key={id} color="blue">
													{index + 1}. {id}
												</Tag>
											))}
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
				<Card title={t('questionForm.ordering.settings')} type="inner" size="small">
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name={['content', 'randomize_initial']}
								valuePropName="checked"
							>
								<Checkbox>{t('questionForm.ordering.randomizeInitial')}</Checkbox>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name={['content', 'partial_credit']} valuePropName="checked">
								<Checkbox>{t('questionForm.ordering.partialCredit')}</Checkbox>
							</Form.Item>
						</Col>
					</Row>
				</Card>
			</Space>
		</Card>
	);
};
