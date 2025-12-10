import { Card, Col, Form, Input, Radio, Row, Space } from 'antd';
import React from 'react';
import { QuestionTypeFormProps } from './types';

export const TrueFalseForm: React.FC<QuestionTypeFormProps> = ({ t }) => {
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
				<Card title={t('questionForm.trueFalse.customLabels')} type="inner" size="small">
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								label={t('questionForm.trueFalse.trueLabel')}
								name={['content', 'true_label']}
								tooltip={t('questionForm.trueFalse.trueLabelTooltip')}
							>
								<Input
									placeholder={t('questionForm.trueFalse.trueLabelPlaceholder')}
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
									placeholder={t('questionForm.trueFalse.falseLabelPlaceholder')}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Card>
			</Space>
		</Card>
	);
};
