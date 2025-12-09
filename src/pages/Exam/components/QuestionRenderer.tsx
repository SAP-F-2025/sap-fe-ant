import { Typography } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import type { DndQuestionProps } from "../types";
import {
	EssayQuestion,
	FillBlankQuestion,
	MatchingQuestion,
	MultipleChoiceQuestion,
	OrderingQuestion,
	ShortAnswerQuestion,
	TrueFalseQuestion,
} from "./QuestionTypes";

const { Text } = Typography;

export const QuestionRenderer: React.FC<DndQuestionProps> = (props) => {
	const { question } = props;
	const { t } = useTranslation();

	if (!question) return null;

	switch (question.type) {
		case "multiple_choice":
			return <MultipleChoiceQuestion {...props} />;

		case "true_false":
			return <TrueFalseQuestion {...props} />;

		case "essay":
			return <EssayQuestion {...props} />;

		case "short_answer":
			return <ShortAnswerQuestion {...props} />;

		case "fill_blank":
		case "fill_in_blank":
			return <FillBlankQuestion {...props} />;

		case "matching":
			return <MatchingQuestion {...props} />;

		case "ordering":
			return <OrderingQuestion {...props} />;

		default:
			return (
				<Text type="secondary">
					{t("exam.unsupportedQuestionType")}
				</Text>
			);
	}
};
