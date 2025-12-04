import React from 'react';
import { Radio, Checkbox, Space } from 'antd';
import { OptionCard } from '../Shared/OptionCard';
import type { QuestionRendererProps } from '../../types';

export const MultipleChoiceQuestion: React.FC<QuestionRendererProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
}) => {
  const isMultiple = question.content?.multiple_correct;
  const options = question.content?.options || [];

  if (isMultiple) {
    const selectedValues = (currentAnswer as (string | number)[]) || [];

    return (
      <Checkbox.Group
        value={selectedValues}
        onChange={(values) => onAnswerChange(question.id, values)}
        style={{ width: '100%' }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.id);

            return (
              <OptionCard
                key={option.id}
                isSelected={isSelected}
                onClick={() => {
                  const newValues = isSelected
                    ? selectedValues.filter((v) => v !== option.id)
                    : [...selectedValues, option.id];
                  onAnswerChange(question.id, newValues);
                }}
              >
                <Checkbox value={option.id} style={{ width: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%', marginLeft: '8px' }}>
                    {option.image_url && (
                      <img
                        src={option.image_url}
                        alt={option.text}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          borderRadius: '4px',
                          marginTop: '8px',
                        }}
                      />
                    )}
                    <span style={{ fontSize: '15px' }}>{option.text}</span>
                  </Space>
                </Checkbox>
              </OptionCard>
            );
          })}
        </Space>
      </Checkbox.Group>
    );
  }

  return (
    <Radio.Group
      value={currentAnswer}
      onChange={(e) => onAnswerChange(question.id, e.target.value)}
      style={{ width: '100%' }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {options.map((option) => (
          <OptionCard
            key={option.id}
            isSelected={currentAnswer === option.id}
            onClick={() => onAnswerChange(question.id, option.id)}
          >
            <Radio value={option.id} style={{ width: '100%' }}>
              <Space direction="vertical" style={{ width: '100%', marginLeft: '8px' }}>
                {option.image_url && (
                  <img
                    src={option.image_url}
                    alt={option.text}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '4px',
                      marginTop: '8px',
                    }}
                  />
                )}
                <span style={{ fontSize: '15px' }}>{option.text}</span>
              </Space>
            </Radio>
          </OptionCard>
        ))}
      </Space>
    </Radio.Group>
  );
};
