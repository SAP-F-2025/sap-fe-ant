import { Card, Input, Space, Tag, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { QuestionRendererProps } from '../../types';

const { TextArea } = Input;
const { Text } = Typography;

export const EssayQuestion: React.FC<QuestionRendererProps> = ({
	question,
	currentAnswer,
	onAnswerChange,
}) => {
	const { t } = useTranslation();
	const minWords = question.content?.min_words;
	const maxWords = question.content?.max_words;
	const suggestedLength = question.content?.suggested_length;
	const currentText = currentAnswer || '';
	const wordCount = currentText.trim().split(/\s+/).filter(Boolean).length;

	return (
		<Space direction="vertical" style={{ width: '100%' }} size="middle">
			<TextArea
				rows={12}
				placeholder={t('exam.questionTypes.essay.placeholder')}
				value={currentText}
				onChange={(e) => onAnswerChange(question.id, e.target.value)}
			/>

			<Card size="small" style={{ backgroundColor: '#fafafa' }}>
				<Space split={<span>|</span>}>
					<Text>
						<strong>{t('exam.questionTypes.essay.wordCount')}:</strong>{' '}
						<Tag
							color={
								(minWords && wordCount < minWords) || (maxWords && wordCount > maxWords)
									? 'warning'
									: 'success'
							}
						>
							{wordCount}
						</Tag>
					</Text>
					<Text>
						<strong>{t('exam.questionTypes.essay.characters')}:</strong> <Tag color="blue">{currentText.length}</Tag>
					</Text>
					{minWords && (
						<Text type={wordCount < minWords ? 'danger' : 'secondary'}>
							{t('exam.questionTypes.essay.minWords', { count: minWords })}
						</Text>
					)}
					{maxWords && (
						<Text type={wordCount > maxWords ? 'danger' : 'secondary'}>
							{t('exam.questionTypes.essay.maxWords', { count: maxWords })}
						</Text>
					)}
				</Space>
			</Card>
		</Space>
	);
};
