import React from 'react';
import { Input, Space, Alert } from 'antd';
import type { QuestionRendererProps } from '../../types';

export const FillBlankQuestion: React.FC<QuestionRendererProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
}) => {
  if (question.content?.template && question.content?.blanks) {
    const { template, blanks, case_sensitive } = question.content;
    const parts = template.split(/(\{blank\d+\})/);

    return (
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div style={{ fontSize: '16px', lineHeight: '2' }}>
          {parts.map((part: string, index: number) => {
            const blankMatch = part.match(/\{(blank\d+)\}/);
            if (blankMatch) {
              const blankId = blankMatch[1];
              const blankDef = blanks[blankId];
              const currentValue = currentAnswer?.[blankId] || '';

              return (
                <Input
                  key={index}
                  placeholder={blankDef?.placeholder_text || 'Điền vào chỗ trống...'}
                  value={currentValue}
                  onChange={(e) => {
                    const newAnswer = { ...currentAnswer, [blankId]: e.target.value };
                    onAnswerChange(question.id, newAnswer);
                  }}
                  style={{
                    width: '200px',
                    margin: '0 4px',
                    display: 'inline-block',
                  }}
                />
              );
            }
            return <span key={index}>{part}</span>;
          })}
        </div>
        {case_sensitive && (
          <Alert
            message="Lưu ý: Câu trả lời có phân biệt chữ hoa chữ thường"
            type="warning"
            showIcon={false}
            style={{ fontSize: '13px', padding: '4px 12px' }}
          />
        )}
      </Space>
    );
  }

  return (
    <Input
      placeholder="Điền vào chỗ trống..."
      value={currentAnswer || ''}
      onChange={(e) => onAnswerChange(question.id, e.target.value)}
    />
  );
};
