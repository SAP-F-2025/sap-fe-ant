import { Alert, Card, Checkbox, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import React from 'react';
import { QuestionTypeFormProps } from './types';

export const ShortAnswerForm: React.FC<QuestionTypeFormProps> = ({ t }) => {
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
							message: t('questionForm.shortAnswer.acceptedAnswersRequired'),
						},
					]}
					tooltip={t('questionForm.shortAnswer.acceptedAnswersTooltip')}
				>
					<Select
						mode="tags"
						placeholder={t('questionForm.shortAnswer.acceptedAnswersPlaceholder')}
						style={{ width: '100%' }}
					/>
				</Form.Item>
				{/* Placeholder Text */}
				<Form.Item
					label={t('questionForm.shortAnswer.placeholderText')}
					name={['content', 'placeholder_text']}
				>
					<Input placeholder={t('questionForm.shortAnswer.placeholderTextPlaceholder')} />
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
							<Form.Item name={['content', 'case_sensitive']} valuePropName="checked">
								<Checkbox>{t('questionForm.shortAnswer.caseSensitive')}</Checkbox>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name={['content', 'exact_match']} valuePropName="checked">
								<Checkbox>{t('questionForm.shortAnswer.exactMatch')}</Checkbox>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name={['content', 'fuzzy_matching']}
								valuePropName="checked"
								tooltip={t('questionForm.shortAnswer.fuzzyMatchingTooltip')}
							>
								<Checkbox>{t('questionForm.shortAnswer.fuzzyMatching')}</Checkbox>
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
};
