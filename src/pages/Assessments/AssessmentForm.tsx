import { RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	DatePicker,
	Divider,
	Form,
	Input,
	InputNumber,
	Row,
	Space,
	Spin,
	Switch,
	Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import assessmentService from '../../services/assessmentService';
import { AssessmentCreateRequest } from '../../types';
import { showSuccess } from '../../utils/errorHandler';

const { Title, Text } = Typography;
const { TextArea } = Input;

const AssessmentForm: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams<{ id: string }>();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const isEdit = Boolean(id);

	// Detect if we're in student context
	const isStudentContext = location.pathname.startsWith('/student');
	const basePath = isStudentContext ? '/student/manage-assessments' : '/assessments';

	useEffect(() => {
		if (isEdit && id) {
			fetchAssessment(parseInt(id));
		}
	}, [id]);

	const fetchAssessment = async (assessmentId: number) => {
		setLoading(true);
		try {
			const assessment = await assessmentService.getAssessment(assessmentId);
			form.setFieldsValue({
				...assessment,
				due_date: assessment.due_date ? dayjs(assessment.due_date) : null,
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
			const data: AssessmentCreateRequest = {
				...values,
				due_date: values.due_date ? values.due_date.toISOString() : undefined,
			};

			if (isEdit && id) {
				await assessmentService.updateAssessment(parseInt(id), data);
				showSuccess(t('assessmentForm.updateSuccess'));
			} else {
				await assessmentService.createAssessment(data);
				showSuccess(t('assessmentForm.createSuccess'));
			}

			navigate(basePath);
		} catch (error) {
			// Error will be handled by axios interceptor with notification
			// No need to show message here
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
						{isEdit ? t('assessmentForm.editTitle') : t('assessmentForm.createTitle')}
					</Title>
				</Col>
				<Col>
					<Button icon={<RollbackOutlined />} onClick={() => navigate(basePath)}>
						{t('common.back')}
					</Button>
				</Col>
			</Row>

			<Form
				form={form}
				layout="vertical"
				onFinish={onFinish}
				initialValues={{
					duration: 60,
					passing_score: 70,
					max_attempts: 1,
					time_warning: 300,
					settings: {
						randomize_questions: false,
						randomize_options: false,
						questions_per_page: 1,
						show_progress_bar: true,
						time_limit_enforced: true,
						auto_submit_on_timeout: true,
						require_webcam: false,
						prevent_tab_switching: false,
						prevent_right_click: false,
						prevent_copy_paste: false,
						require_identity_verification: false,
						require_full_screen: false,
						allow_screen_reader: true,
						font_size_adjustment: 0,
						high_contrast_mode: false,
					},
				}}
			>
				<Card title={t('assessmentForm.basicInfo.title')} style={{ marginBottom: 16 }}>
					<Row gutter={16}>
						<Col xs={24}>
							<Form.Item
								label={t('assessmentForm.basicInfo.assessmentTitle')}
								name="title"
								rules={[
									{
										required: true,
										message: t('assessmentForm.basicInfo.titleRequired'),
									},
									{
										max: 200,
										message: t('assessmentForm.basicInfo.titleMaxLength'),
									},
								]}
							>
								<Input
									placeholder={t('assessmentForm.basicInfo.titlePlaceholder')}
									size="large"
								/>
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item
								label={t('assessmentForm.basicInfo.description')}
								name="description"
								rules={[
									{
										max: 1000,
										message: t('assessmentForm.basicInfo.descriptionMaxLength'),
									},
								]}
							>
								<TextArea
									rows={4}
									placeholder={t(
										'assessmentForm.basicInfo.descriptionPlaceholder'
									)}
									showCount
									maxLength={1000}
								/>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col xs={24} sm={12} lg={6}>
							<Form.Item
								label={t('assessmentForm.basicInfo.duration')}
								name="duration"
								rules={[
									{
										required: true,
										message: t('assessmentForm.basicInfo.durationRequired'),
									},
								]}
							>
								<InputNumber
									min={5}
									max={300}
									style={{ width: '100%' }}
									placeholder="60"
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={6}>
							<Form.Item
								label={t('assessmentForm.basicInfo.passingScore')}
								name="passing_score"
								rules={[
									{
										required: true,
										message: t('assessmentForm.basicInfo.passingScoreRequired'),
									},
								]}
							>
								<InputNumber
									min={0}
									max={100}
									style={{ width: '100%' }}
									placeholder="70"
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={6}>
							<Form.Item
								label={t('assessmentForm.basicInfo.maxAttempts')}
								name="max_attempts"
								tooltip={t('assessmentForm.basicInfo.maxAttemptsTooltip')}
							>
								<InputNumber
									min={1}
									max={10}
									style={{ width: '100%' }}
									placeholder="1"
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={6}>
							<Form.Item
								label={t('assessmentForm.basicInfo.timeWarning')}
								name="time_warning"
								tooltip={t('assessmentForm.basicInfo.timeWarningTooltip')}
							>
								<InputNumber
									min={60}
									max={3600}
									style={{ width: '100%' }}
									placeholder="300"
								/>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col xs={24} sm={12}>
							<Form.Item
								label={t('assessmentForm.basicInfo.dueDate')}
								name="due_date"
							>
								<DatePicker
									showTime
									format="DD/MM/YYYY HH:mm"
									style={{ width: '100%' }}
									placeholder={t('assessmentForm.basicInfo.dueDatePlaceholder')}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Card>
				<Card
					title={t('assessmentForm.displaySettings.title')}
					style={{ marginBottom: 16 }}
				>
					<Row gutter={[16, 16]}>
						<Col xs={24} sm={12} lg={8}>
							<Form.Item
								label={t('assessmentForm.displaySettings.randomizeQuestions')}
								name={['settings', 'randomize_questions']}
								valuePropName="checked"
							>
								<Switch />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={8}>
							<Form.Item
								label={t('assessmentForm.displaySettings.randomizeOptions')}
								name={['settings', 'randomize_options']}
								valuePropName="checked"
							>
								<Switch />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={8}>
							<Form.Item
								label={t('assessmentForm.displaySettings.showProgressBar')}
								name={['settings', 'show_progress_bar']}
								valuePropName="checked"
							>
								<Switch />
							</Form.Item>
						</Col>
					</Row>

					<Divider />

					<Row gutter={[16, 16]}>
						<Col xs={24} sm={12} lg={8}>
							<Form.Item
								label={t('assessmentForm.displaySettings.timeLimitEnforced')}
								name={['settings', 'time_limit_enforced']}
								valuePropName="checked"
							>
								<Switch />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={8}>
							<Form.Item
								label={t('assessmentForm.displaySettings.autoSubmitOnTimeout')}
								name={['settings', 'auto_submit_on_timeout']}
								valuePropName="checked"
							>
								<Switch />
							</Form.Item>
						</Col>
					</Row>
				</Card>
				<Card title={t('assessmentForm.proctoring.title')} style={{ marginBottom: 16 }}>
					<Row gutter={[16, 16]}>
						<Col xs={24} sm={12} lg={8}>
							<Form.Item
								label={t('assessmentForm.proctoring.requireWebcam')}
								name={['settings', 'require_webcam']}
								valuePropName="checked"
							>
								<Switch />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={8}>
							<Form.Item
								label={t('assessmentForm.proctoring.preventTabSwitching')}
								name={['settings', 'prevent_tab_switching']}
								valuePropName="checked"
							>
								<Switch />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={8}>
							<Form.Item
								label={t('assessmentForm.proctoring.preventRightClick')}
								name={['settings', 'prevent_right_click']}
								valuePropName="checked"
							>
								<Switch />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={8}>
							<Form.Item
								label={t('assessmentForm.proctoring.preventCopyPaste')}
								name={['settings', 'prevent_copy_paste']}
								valuePropName="checked"
							>
								<Switch />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={8}>
							<Form.Item
								label={t('assessmentForm.proctoring.requireFullScreen')}
								name={['settings', 'require_full_screen']}
								valuePropName="checked"
							>
								<Switch />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={8}>
							<Form.Item
								label={t('assessmentForm.proctoring.requireIdentityVerification')}
								name={['settings', 'require_identity_verification']}
								valuePropName="checked"
							>
								<Switch />
							</Form.Item>
						</Col>
					</Row>
				</Card>{' '}
				<Card title={t('assessmentForm.accessibility.title')} style={{ marginBottom: 16 }}>
					<Row gutter={[16, 16]}>
						<Col xs={24} sm={12} lg={8}>
							<Form.Item
								label={t('assessmentForm.accessibility.allowScreenReader')}
								name={['settings', 'allow_screen_reader']}
								valuePropName="checked"
							>
								<Switch />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={8}>
							<Form.Item
								label={t('assessmentForm.accessibility.highContrastMode')}
								name={['settings', 'high_contrast_mode']}
								valuePropName="checked"
							>
								<Switch />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={8}>
							<Form.Item
								label={t('assessmentForm.accessibility.fontSizeAdjustment')}
								name={['settings', 'font_size_adjustment']}
								tooltip={t('assessmentForm.accessibility.fontSizeTooltip')}
							>
								<InputNumber min={-2} max={2} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
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
								? t('assessmentForm.updateButton')
								: t('assessmentForm.createButton')}
						</Button>
						<Button onClick={() => navigate(basePath)} size="large">
							{t('common.cancel')}
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Space>
	);
};

export default AssessmentForm;
