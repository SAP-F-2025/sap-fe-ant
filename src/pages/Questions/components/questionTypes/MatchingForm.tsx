import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Form, Input, Row, Select, Space, Typography } from 'antd';
import React from 'react';
import { QuestionTypeFormProps } from './types';

export const MatchingForm: React.FC<QuestionTypeFormProps> = ({ t, handleMultiLinePaste }) => {
	return (
		<Card title={t('questionForm.matching.title')} type="inner">
			<Space direction="vertical" style={{ width: '100%' }} size="large">
				{/* Left Items */}
				<Card title={t('questionForm.matching.leftItems')} type="inner" size="small">
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
													message: t('questionForm.matching.enterId'),
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
													handleMultiLinePaste?.(
														e,
														name,
														add,
														'L',
														fields.length
													)
												}
											/>
										</Form.Item>
										<Form.Item {...restField} name={[name, 'image_url']}>
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
										onClick={() => add({ id: `L${fields.length + 1}` })}
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
				<Card title={t('questionForm.matching.rightItems')} type="inner" size="small">
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
													message: t('questionForm.matching.enterId'),
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
													handleMultiLinePaste?.(
														e,
														name,
														add,
														'R',
														fields.length
													)
												}
											/>
										</Form.Item>
										<Form.Item {...restField} name={[name, 'image_url']}>
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
										onClick={() => add({ id: `R${fields.length + 1}` })}
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
				<Card title={t('questionForm.matching.correctPairs')} type="inner" size="small">
					<Form.Item
						noStyle
						shouldUpdate={(prevValues, currentValues) =>
							prevValues.content?.left_items !== currentValues.content?.left_items ||
							prevValues.content?.right_items !== currentValues.content?.right_items
						}
					>
						{({ getFieldValue }) => {
							const leftItems = getFieldValue(['content', 'left_items']) || [];
							const rightItems = getFieldValue(['content', 'right_items']) || [];

							return (
								<Form.List name={['content', 'correct_pairs']}>
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
																.map((item: any) => ({
																	label: `${item?.id || ''} - ${item?.text || ''}`,
																	value: item?.id,
																}))
																.filter((opt: any) => opt.value)}
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
																.map((item: any) => ({
																	label: `${item?.id || ''} - ${item?.text || ''}`,
																	value: item?.id,
																}))
																.filter((opt: any) => opt.value)}
														/>
													</Form.Item>
													<DeleteOutlined onClick={() => remove(name)} />
												</Space>
											))}
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
													{t('questionForm.matching.addPairHint')}
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
				<Card title={t('questionForm.matching.settings')} type="inner" size="small">
					<Row gutter={16}>
						<Col span={8}>
							<Form.Item name={['content', 'randomize_left']} valuePropName="checked">
								<Checkbox>{t('questionForm.matching.randomizeLeft')}</Checkbox>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name={['content', 'randomize_right']}
								valuePropName="checked"
							>
								<Checkbox>{t('questionForm.matching.randomizeRight')}</Checkbox>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name={['content', 'partial_credit']} valuePropName="checked">
								<Checkbox>{t('questionForm.matching.partialCredit')}</Checkbox>
							</Form.Item>
						</Col>
					</Row>
				</Card>
			</Space>
		</Card>
	);
};
