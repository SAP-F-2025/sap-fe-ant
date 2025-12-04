import React from 'react';
import { Typography } from 'antd';
import {
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  EssayQuestion,
  ShortAnswerQuestion,
  FillBlankQuestion,
  MatchingQuestion,
  OrderingQuestion,
} from './QuestionTypes';
import type { DndQuestionProps } from '../types';

const { Text } = Typography;

export const QuestionRenderer: React.FC<DndQuestionProps> = (props) => {
  const { question } = props;

  if (!question) return null;

  switch (question.type) {
    case 'multiple_choice':
      return <MultipleChoiceQuestion {...props} />;

    case 'true_false':
      return <TrueFalseQuestion {...props} />;

    case 'essay':
      return <EssayQuestion {...props} />;

    case 'short_answer':
      return <ShortAnswerQuestion {...props} />;

    case 'fill_blank':
    case 'fill_in_blank':
      return <FillBlankQuestion {...props} />;

    case 'matching':
      return <MatchingQuestion {...props} />;

    case 'ordering':
      return <OrderingQuestion {...props} />;

    default:
      return <Text type="secondary">Loại câu hỏi không được hỗ trợ</Text>;
  }
};
