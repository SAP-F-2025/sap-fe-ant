import { CheckCircleOutlined, ClockCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Card, Col, Progress, Row, Space, Statistic, Tag, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

interface ExamHeaderProps {
	title: string;
	currentQuestionIndex: number;
	totalQuestions: number;
	timeRemaining: string;
	timeColor: string;
	answeredCount: number;
	autoSaving: boolean;
	lastSavedTime: number | null;
	progress: number;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
	title,
	currentQuestionIndex,
	totalQuestions,
	timeRemaining,
	timeColor,
	answeredCount,
	autoSaving,
	lastSavedTime,
	progress,
}) => {
	const { t } = useTranslation();

	return (
		<Card style={{ marginBottom: '16px' }}>
			<Row gutter={16} align="middle">
				<Col flex="auto">
					<Title level={3} style={{ margin: 0 }}>
						{title}
					</Title>
					<div style={{ marginTop: '4px' }}>
						<Space size="small">
							<Text type="secondary">
								{t('exam.questionN', { n: currentQuestionIndex + 1 })} / {totalQuestions}
							</Text>
							{autoSaving && (
								<Tag color="processing" icon={<SaveOutlined />} style={{ fontSize: '11px' }}>
									{t('exam.autoSaving')}
								</Tag>
							)}
							{!autoSaving && lastSavedTime && (
								<Text type="success" style={{ fontSize: '12px' }}>
									<CheckCircleOutlined /> {t('exam.saved')}
								</Text>
							)}
						</Space>
					</div>
				</Col>
				<Col>
					<Statistic
						title={t('exam.timeRemaining')}
						value={timeRemaining}
						prefix={<ClockCircleOutlined />}
						valueStyle={{ color: timeColor, fontSize: '24px' }}
					/>
				</Col>
				<Col>
					<Statistic
						title={t('exam.answered')}
						value={answeredCount}
						suffix={`/ ${totalQuestions}`}
						valueStyle={{ fontSize: '24px' }}
					/>
				</Col>
			</Row>
			<Progress
				percent={progress}
				showInfo={false}
				strokeColor="#1890ff"
				style={{ marginTop: '16px' }}
			/>
		</Card>
	);
};
