import React from 'react';
import { Radio, Space } from 'antd';
import { OptionCard } from '../Shared/OptionCard';
import type { QuestionRendererProps } from '../../types';

export const TrueFalseQuestion: React.FC<QuestionRendererProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
}) => {
  const trueLabel = question.content?.true_label || 'Đúng';
  const falseLabel = question.content?.false_label || 'Sai';

  return (
    <Radio.Group
      value={currentAnswer}
      onChange={(e) => onAnswerChange(question.id, e.target.value)}
      style={{ width: '100%' }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <OptionCard
          isSelected={currentAnswer === true}
          onClick={() => onAnswerChange(question.id, true)}
        >
          <Radio value={true} style={{ width: '100%' }}>
            <span style={{ fontSize: '15px', marginLeft: '8px' }}>{trueLabel}</span>
          </Radio>
        </OptionCard>

        <OptionCard
          isSelected={currentAnswer === false}
          onClick={() => onAnswerChange(question.id, false)}
        >
          <Radio value={false} style={{ width: '100%' }}>
            <span style={{ fontSize: '15px', marginLeft: '8px' }}>{falseLabel}</span>
          </Radio>
        </OptionCard>
      </Space>
    </Radio.Group>
  );
};
