import { Alert, Input, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { QuestionRendererProps } from '../../types';

export const ShortAnswerQuestion: React.FC<QuestionRendererProps> = ({
	question,
	currentAnswer,
	onAnswerChange,
}) => {
	const { t } = useTranslation();
	const maxLength = question.content?.max_length || 200;
	const placeholderText =
		question.content?.placeholder_text || t('exam.questionTypes.shortAnswer.placeholder');
	const caseSensitive = question.content?.case_sensitive;

	return (
		<Space direction="vertical" style={{ width: '100%' }} size="middle">
			<Input
				placeholder={placeholderText}
				value={currentAnswer || ''}
				onChange={(e) => onAnswerChange(question.id, e.target.value)}
				maxLength={maxLength}
				showCount
				style={{ width: '100%' }}
			/>
			{caseSensitive && (
				<Alert
					message={t('exam.questionTypes.caseSensitiveWarning')}
					type="warning"
					showIcon={false}
					style={{ fontSize: '13px', padding: '4px 12px' }}
				/>
			)}
		</Space>
	);
};
