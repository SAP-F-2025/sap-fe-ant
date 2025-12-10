import { DifficultyLevel, QuestionType } from '../../../types';

export const getInitialFormValues = () => ({
	type: QuestionType.MultipleChoice,
	points: 10,
	difficulty: DifficultyLevel.Medium,
	content: {
		// Multiple Choice fields
		options: [
			{ id: 'A', text: '', order: 1, image_url: '' },
			{ id: 'B', text: '', order: 2, image_url: '' },
		],
		correct_answers: [],
		multiple_correct: false,
		randomize_options: false,
		partial_credit: false,
		// True False fields
		correct_answer: true,
		true_label: '',
		false_label: '',
		// Fill blank fields
		template: '',
		blanks: {},
		case_sensitive: false,
		trim_spaces: true,
		// Matching fields
		left_items: [],
		right_items: [],
		correct_pairs: [],
		randomize_left: false,
		randomize_right: false,
		// Ordering fields
		items: [],
		correct_order: [],
		randomize_initial: false,
		// Short Answer fields
		accepted_answers: [],
		exact_match: false,
		max_length: undefined,
		placeholder_text: '',
		fuzzy_matching: false,
		// Essay fields
		min_words: undefined,
		max_words: undefined,
		suggested_length: '',
		rubric_criteria: [],
		sample_answer: '',
		auto_grade: false,
		key_words: [],
	},
});

export const getQuestionTypeOptions = (t: (key: string) => string) => [
	{
		label: t('question.type.multipleChoice'),
		value: QuestionType.MultipleChoice,
	},
	{
		label: t('question.type.trueFalse'),
		value: QuestionType.TrueFalse,
	},
	{
		label: t('question.type.essay'),
		value: QuestionType.Essay,
	},
	{
		label: t('question.type.fillBlank'),
		value: QuestionType.FillBlank,
	},
	{
		label: t('question.type.matching'),
		value: QuestionType.Matching,
	},
	{
		label: t('question.type.ordering'),
		value: QuestionType.Ordering,
	},
	{
		label: t('question.type.shortAnswer'),
		value: QuestionType.ShortAnswer,
	},
];

export const getDifficultyOptions = (t: (key: string) => string) => [
	{
		label: t('questionList.easy'),
		value: DifficultyLevel.Easy,
	},
	{
		label: t('questionList.medium'),
		value: DifficultyLevel.Medium,
	},
	{
		label: t('questionList.hard'),
		value: DifficultyLevel.Hard,
	},
];
