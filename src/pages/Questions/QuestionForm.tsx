import { RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Space, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import questionService from '../../services/questionService';
import { QuestionCreateRequest, QuestionType } from '../../types';
import { showSuccess } from '../../utils/errorHandler';
import {
	BasicInfoCard,
	EssayForm,
	FillBlankForm,
	MatchingForm,
	MultipleChoiceForm,
	OrderingForm,
	ShortAnswerForm,
	TrueFalseForm,
} from './components';
import { useMultiLinePaste } from './hooks';
import { getInitialFormValues } from './utils';

const { Title } = Typography;

const QuestionForm: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.MultipleChoice);
	const isEdit = Boolean(id);

	// Detect if we're in student context
	const isStudentContext = location.pathname.startsWith('/student');
	const basePath = isStudentContext ? '/student/questions' : '/questions';

	const { handleMultiLinePaste } = useMultiLinePaste(form);

	useEffect(() => {
		if (isEdit && id) {
			fetchQuestion(parseInt(id));
		}
	}, [id]);

	const fetchQuestion = async (questionId: number) => {
		setLoading(true);
		try {
			const question = await questionService.getQuestion(questionId);
			// Convert tags array to comma-separated string for display in Input field
			const formData = {
				...question,
				tags: Array.isArray(question.tags) ? question.tags.join(', ') : question.tags,
			};
			form.setFieldsValue(formData);
			setQuestionType(question.type);
		} catch (error) {
			// Error will be handled by axios interceptor
			navigate(basePath);
		} finally {
			setLoading(false);
		}
	};

	const onFinish = async (values: any) => {
		setSubmitting(true);
		try {
			const data: QuestionCreateRequest = {
				...values,
				tags: values.tags
					? Array.isArray(values.tags)
						? values.tags
						: values.tags.split(',').map((tag: string) => tag.trim())
					: [],
			};

			// Auto-generate correct_order for Ordering questions
			if (data.type === QuestionType.Ordering && data.content?.items) {
				data.content.correct_order = data.content.items
					.map((item: any) => item?.id)
					.filter(Boolean);
			}

			// Set default max_length for ShortAnswer questions if not provided
			if (data.type === QuestionType.ShortAnswer && !data.content?.max_length) {
				data.content = {
					...data.content,
					max_length: 100,
				};
			}

			if (isEdit && id) {
				await questionService.updateQuestion(parseInt(id), data);
				showSuccess(t('questionForm.updateSuccess'));
			} else {
				await questionService.createQuestion(data);
				showSuccess(t('questionForm.createSuccess'));
			}
			navigate(basePath);
		} catch (error) {
			// Error will be handled by axios interceptor with notification
		} finally {
			setSubmitting(false);
		}
	};

	const renderQuestionTypeContent = () => {
		const commonProps = {
			form,
			t,
			handleMultiLinePaste,
		};

		switch (questionType) {
			case QuestionType.MultipleChoice:
				return <MultipleChoiceForm {...commonProps} />;
			case QuestionType.TrueFalse:
				return <TrueFalseForm {...commonProps} />;
			case QuestionType.Essay:
				return <EssayForm {...commonProps} />;
			case QuestionType.FillBlank:
				return <FillBlankForm {...commonProps} />;
			case QuestionType.Matching:
				return <MatchingForm {...commonProps} />;
			case QuestionType.Ordering:
				return <OrderingForm {...commonProps} />;
			case QuestionType.ShortAnswer:
				return <ShortAnswerForm {...commonProps} />;
			default:
				return null;
		}
	};

	if (loading) {
		return (
			<div style={{ textAlign: 'center', padding: '100px 0' }}>
				<Spin size="large" />
			</div>
		);
	}

	return (
		<Space direction="vertical" size="large" style={{ width: '100%' }}>
			<Row justify="space-between" align="middle">
				<Col>
					<Title level={2}>
						{isEdit ? t('questionForm.editTitle') : t('questionForm.createTitle')}
					</Title>
				</Col>
				<Col>
					<Button icon={<RollbackOutlined />} onClick={() => navigate('/questions')}>
						{t('questionForm.back')}
					</Button>
				</Col>
			</Row>

			<Form
				form={form}
				layout="vertical"
				onFinish={onFinish}
				initialValues={getInitialFormValues()}
			>
				<BasicInfoCard t={t} onQuestionTypeChange={setQuestionType} />

				{renderQuestionTypeContent()}

				<Form.Item>
					<Space>
						<Button
							type="primary"
							htmlType="submit"
							icon={<SaveOutlined />}
							loading={submitting}
							size="large"
						>
							{isEdit ? t('questionForm.updateBtn') : t('questionForm.createBtn')}
						</Button>
						<Button onClick={() => navigate('/questions')} size="large">
							{t('questionForm.cancelBtn')}
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Space>
	);
};

export default QuestionForm;
