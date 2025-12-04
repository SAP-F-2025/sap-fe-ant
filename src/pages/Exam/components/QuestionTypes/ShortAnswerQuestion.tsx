import React from 'react';
import { Input, Space, Alert } from 'antd';
import type { QuestionRendererProps } from '../../types';

export const ShortAnswerQuestion: React.FC<QuestionRendererProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
}) => {
  const maxLength = question.content?.max_length || 200;
  const placeholderText = question.content?.placeholder_text || 'Nhập câu trả lời ngắn...';
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
          message="Lưu ý: Câu trả lời có phân biệt chữ hoa chữ thường"
          type="info"
          showIcon
        />
      )}
    </Space>
  );
};
