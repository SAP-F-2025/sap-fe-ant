import { Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import React from 'react';
import { QuestionType } from '../../../types';
import { getDifficultyOptions, getQuestionTypeOptions } from '../utils/questionFormUtils';

const { TextArea } = Input;

interface BasicInfoCardProps {
	t: (key: string) => string;
	onQuestionTypeChange: (value: QuestionType) => void;
}

export const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ t, onQuestionTypeChange }) => {
	return (
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
							onChange={(value) => onQuestionTypeChange(value)}
							options={getQuestionTypeOptions(t)}
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
						<Select options={getDifficultyOptions(t)} />
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
				<TextArea rows={4} placeholder={t('questionForm.enterQuestionContent')} showCount />
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
	);
};
