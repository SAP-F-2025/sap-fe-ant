import React from 'react';
import { Card, Space, Button } from 'antd';

interface QuestionNavigationProps {
  questions: any[];
  currentQuestionId: number | null;
  answers: Record<number, any>;
  onQuestionSelect: (questionId: number) => void;
}

export const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  currentQuestionId,
  answers,
  onQuestionSelect,
}) => {
  return (
    <Card title="Điều hướng câu hỏi" style={{ marginTop: '16px' }}>
      <Space wrap>
        {questions.map((q, index) => {
          const isAnswered = !!answers[q.id];
          const isCurrent = q.id === currentQuestionId;
          return (
            <Button
              key={q.id}
              type={isCurrent ? 'primary' : isAnswered ? 'default' : 'dashed'}
              onClick={() => onQuestionSelect(q.id)}
              style={{
                width: '40px',
                backgroundColor: isAnswered && !isCurrent ? '#52c41a' : undefined,
                borderColor: isAnswered && !isCurrent ? '#52c41a' : undefined,
                color: isAnswered && !isCurrent ? '#fff' : undefined,
              }}
            >
              {index + 1}
            </Button>
          );
        })}
      </Space>
    </Card>
  );
};
