export interface QuestionOption {
	id: string | number;
	text: string;
	image_url?: string;
}

export interface QuestionContent {
	options?: QuestionOption[];
	multiple_correct?: boolean;
	true_label?: string;
	false_label?: string;
	min_words?: number;
	max_words?: number;
	suggested_length?: string;
	max_length?: number;
	placeholder_text?: string;
	case_sensitive?: boolean;
	template?: string;
	blanks?: Record<string, { placeholder_text?: string; accepted_answers?: string[] }>;
	left_items?: QuestionOption[];
	right_items?: QuestionOption[];
	items?: QuestionOption[];
}

export interface Question {
	id: number;
	type:
		| 'multiple_choice'
		| 'true_false'
		| 'essay'
		| 'short_answer'
		| 'fill_blank'
		| 'fill_in_blank'
		| 'matching'
		| 'ordering';
	text: string;
	points: number;
	content?: QuestionContent;
}

export interface QuestionRendererProps {
	question: Question;
	currentAnswer: any;
	onAnswerChange: (questionId: number, value: any) => void;
}

export interface DndQuestionProps extends QuestionRendererProps {
	dndSensors: any;
	activeMatchingId: string | null;
	setActiveMatchingId: (id: string | null) => void;
	customGrabbedId: string | null;
	setCustomGrabbedId: (id: string | null) => void;
	focusedItemId: string | null;
	setFocusedItemId: (id: string | null) => void;
}
