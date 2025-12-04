import React from 'react';
import { Input, Space, Alert, Card, Tag, Typography } from 'antd';
import type { QuestionRendererProps } from '../../types';

const { TextArea } = Input;
const { Text } = Typography;

export const EssayQuestion: React.FC<QuestionRendererProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
}) => {
  const minWords = question.content?.min_words;
  const maxWords = question.content?.max_words;
  const suggestedLength = question.content?.suggested_length;
  const currentText = currentAnswer || '';
  const wordCount = currentText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <TextArea
        rows={12}
        placeholder="Nhập câu trả lời của bạn..."
        value={currentText}
        onChange={(e) => onAnswerChange(question.id, e.target.value)}
      />

      <Card size="small" style={{ backgroundColor: '#fafafa' }}>
        <Space split={<span>|</span>}>
          <Text>
            <strong>Số từ:</strong>{' '}
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
            <strong>Ký tự:</strong> <Tag color="blue">{currentText.length}</Tag>
          </Text>
          {minWords && (
            <Text type={wordCount < minWords ? 'danger' : 'secondary'}>
              Tối thiểu: {minWords} từ
            </Text>
          )}
          {maxWords && (
            <Text type={wordCount > maxWords ? 'danger' : 'secondary'}>
              Tối đa: {maxWords} từ
            </Text>
          )}
        </Space>
      </Card>
    </Space>
  );
};
