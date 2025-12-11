import { RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Space, Spin, Switch, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import questionBankService from '../../services/questionBankService';
import { QuestionBankCreateRequest } from '../../types';
import { showSuccess } from '../../utils/errorHandler';

const { Title } = Typography;
const { TextArea } = Input;

const QuestionBankForm: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();

	// Determine base path for navigation (student vs admin/teacher)
	const basePath = location.pathname.startsWith('/student') 
		? '/student/question-banks' 
		: '/question-banks';

	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const isEdit = Boolean(id);

	useEffect(() => {
		if (isEdit && id) {
			fetchQuestionBank(parseInt(id));
		}
	}, [id]);

	const fetchQuestionBank = async (bankId: number) => {
		setLoading(true);
		try {
			const bank = await questionBankService.getQuestionBank(bankId);
			form.setFieldsValue({
				...bank,
				tags: bank.tags?.join(', '),
			});
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
			const data: QuestionBankCreateRequest = {
				...values,
				tags: values.tags ? values.tags.split(',').map((tag: string) => tag.trim()) : [],
			};

			if (isEdit && id) {
				await questionBankService.updateQuestionBank(parseInt(id), data);
				showSuccess(t('questionBankForm.updateSuccess'));
			} else {
				await questionBankService.createQuestionBank(data);
				showSuccess(t('questionBankForm.createSuccess'));
			}

			navigate(basePath);
		} catch (error) {
			// Error will be handled by axios interceptor with notification
		} finally {
			setSubmitting(false);
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
						{isEdit
							? t('questionBankForm.editTitle')
							: t('questionBankForm.createTitle')}
					</Title>
				</Col>
				<Col>
					<Button icon={<RollbackOutlined />} onClick={() => navigate('/question-banks')}>
						{t('questionBankForm.back')}
					</Button>
				</Col>
			</Row>

			<Form
				form={form}
				layout="vertical"
				onFinish={onFinish}
				initialValues={{
					is_public: false,
				}}
			>
				<Card>
					<Form.Item
						label={t('questionBankForm.name')}
						name="name"
						rules={[
							{
								required: true,
								message: t('questionBankForm.nameRequired'),
							},
							{
								max: 200,
								message: t('questionBankForm.nameMaxLength'),
							},
						]}
					>
						<Input placeholder={t('questionBankForm.namePlaceholder')} size="large" />
					</Form.Item>

					<Form.Item
						label={t('questionBankForm.description')}
						name="description"
						rules={[
							{
								max: 1000,
								message: t('questionBankForm.descriptionMaxLength'),
							},
						]}
					>
						<TextArea
							rows={4}
							placeholder={t('questionBankForm.descriptionPlaceholder')}
							showCount
							maxLength={1000}
						/>
					</Form.Item>

					<Form.Item label={t('questionBankForm.tags')} name="tags">
						<Input placeholder={t('questionBankForm.tagsPlaceholder')} />
					</Form.Item>

					<Form.Item
						label={t('questionBankForm.isPublic')}
						name="is_public"
						valuePropName="checked"
						tooltip={t('questionBankForm.isPublicTooltip')}
					>
						<Switch />
					</Form.Item>
				</Card>

				<Form.Item>
					<Space>
						<Button
							type="primary"
							htmlType="submit"
							icon={<SaveOutlined />}
							loading={submitting}
							size="large"
						>
							{isEdit
								? t('questionBankForm.updateBtn')
								: t('questionBankForm.createBtn')}
						</Button>
						<Button onClick={() => navigate(basePath)} size="large">
							{t('questionBankForm.cancelBtn')}
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Space>
	);
};

export default QuestionBankForm;
