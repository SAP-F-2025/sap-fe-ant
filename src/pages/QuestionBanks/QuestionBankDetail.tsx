import {
	EditOutlined,
	FileTextOutlined,
	GlobalOutlined,
	LockOutlined,
	RollbackOutlined,
} from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	Descriptions,
	Row,
	Space,
	Spin,
	Tag,
	Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ManageQuestionBankQuestions } from '../../components/QuestionBank/ManageQuestionBankQuestions';
import questionBankService from '../../services/questionBankService';
import { QuestionBank } from '../../types';

const { Title, Text } = Typography;

const QuestionBankDetail: React.FC = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const [questionBank, setQuestionBank] = useState<QuestionBank | null>(null);

	useEffect(() => {
		if (id) {
			fetchQuestionBank(parseInt(id));
		}
	}, [id]);

	const fetchQuestionBank = async (bankId: number) => {
		setLoading(true);
		try {
			const data = await questionBankService.getQuestionBank(bankId);
			setQuestionBank(data);
		} catch (error) {
			// Error handled by interceptor
			navigate('/question-banks');
		} finally {
			setLoading(false);
		}
	};

	if (loading || !questionBank) {
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
					<Space>
						<Button
							icon={<RollbackOutlined />}
							onClick={() => navigate('/question-banks')}
						>
							{t('questionBankDetail.back')}
						</Button>
					</Space>
				</Col>
				<Col>
					<Space>
						<Button
							type="primary"
							icon={<EditOutlined />}
							onClick={() => navigate(`/question-banks/edit/${id}`)}
						>
							{t('questionBankDetail.edit')}
						</Button>
					</Space>
				</Col>
			</Row>

			<Card>
				<Space direction="vertical" size="middle" style={{ width: '100%' }}>
					<div>
						<Title level={2} style={{ marginBottom: 8 }}>
							{questionBank.name}
						</Title>
						<Space>
							{questionBank.is_public ? (
								<Tag icon={<GlobalOutlined />} color="success">
									{t('questionBankDetail.public')}
								</Tag>
							) : (
								<Tag icon={<LockOutlined />}>{t('questionBankDetail.private')}</Tag>
							)}
						</Space>
					</div>

					{questionBank.description && (
						<Typography.Paragraph>{questionBank.description}</Typography.Paragraph>
					)}
				</Space>
			</Card>

			<Card title={t('questionBankDetail.detailInfo')}>
				<Descriptions column={{ xs: 1, sm: 2, lg: 3 }} bordered>
					<Descriptions.Item label={t('questionBankDetail.questionCount')}>
						<FileTextOutlined /> {questionBank.question_count || 0} {t('questionBankDetail.questions')}
					</Descriptions.Item>
					<Descriptions.Item label={t('questionBankDetail.status')}>
						{questionBank.is_public ? (
							<Tag icon={<GlobalOutlined />} color="success">
								{t('questionBankDetail.public')}
							</Tag>
						) : (
							<Tag icon={<LockOutlined />}>{t('questionBankDetail.private')}</Tag>
						)}
					</Descriptions.Item>
					<Descriptions.Item label={t('questionBankDetail.createdAt')}>
						{dayjs(questionBank.created_at).format('DD/MM/YYYY HH:mm')}
					</Descriptions.Item>
					{questionBank.tags && questionBank.tags.length > 0 && (
						<Descriptions.Item label={t('questionBankDetail.tags')} span={3}>
							<Space wrap>
								{questionBank.tags.map((tag, index) => (
									<Tag key={index}>{tag}</Tag>
								))}
							</Space>
						</Descriptions.Item>
					)}
				</Descriptions>
			</Card>

			<ManageQuestionBankQuestions
				bankId={parseInt(id!)}
				onQuestionsChange={() => {
					fetchQuestionBank(parseInt(id!));
				}}
			/>
		</Space>
	);
};

export default QuestionBankDetail;
