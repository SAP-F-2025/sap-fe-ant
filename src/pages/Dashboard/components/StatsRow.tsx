import {
	BankOutlined,
	CheckCircleOutlined,
	FileTextOutlined,
	QuestionCircleOutlined,
} from '@ant-design/icons';
import { Avatar, Card, Col, Flex, Row, Skeleton, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getStaggerDelay } from '../../../styles/animations';
import { elevation } from '../../../styles/elevation';
import type { DashboardStats } from '../../../types';
import { STAT_CARD_COLORS } from '../constants';

const { Title, Text } = Typography;

interface StatCardItemProps {
	icon: React.ReactNode;
	value: number;
	label: string;
	color: string;
	delay: number;
}

/**
 * Individual stat card - compact horizontal layout
 */
const StatCardItem: React.FC<StatCardItemProps> = ({ icon, value, label, color, delay }) => (
	<Col xs={12} sm={6} lg={6} style={{ animationDelay: getStaggerDelay(delay) }}>
		<Card
			bordered={false}
			style={{
				background: color,
				borderRadius: 12,
				border: 'none',
				...elevation[1],
			}}
			styles={{ body: { padding: '12px 16px' } }}
		>
			<Flex align="center" gap={10}>
				<Avatar
					size={32}
					icon={icon}
					style={{
						backgroundColor: 'rgba(255,255,255,0.2)',
						border: 'none',
						flexShrink: 0,
					}}
				/>
				<Flex vertical gap={0}>
					<Title
						level={4}
						style={{
							color: 'white',
							margin: 0,
							fontSize: 20,
							fontWeight: 700,
							lineHeight: 1.2,
						}}
					>
						{value}
					</Title>
					<Text
						style={{
							color: 'rgba(255, 255, 255, 0.85)',
							fontSize: 11,
							fontWeight: 500,
						}}
					>
						{label}
					</Text>
				</Flex>
			</Flex>
		</Card>
	</Col>
);

/**
 * Loading skeleton for stat card
 */
const StatCardSkeleton: React.FC<{ delay: number }> = ({ delay }) => (
	<Col xs={12} sm={6} lg={6} style={{ animationDelay: getStaggerDelay(delay) }}>
		<Card
			bordered={false}
			style={{
				borderRadius: 12,
				...elevation[1],
			}}
			styles={{ body: { padding: '12px 16px' } }}
		>
			<Skeleton.Button active size="small" style={{ width: 80, height: 50 }} block />
		</Card>
	</Col>
);

interface StatsRowProps {
	stats: DashboardStats | undefined;
}

/**
 * Stats Row Component
 * Displays 4 compact statistic cards
 */
export const StatsRow: React.FC<StatsRowProps> = ({ stats }) => {
	const { t } = useTranslation();

	if (!stats) {
		return (
			<Row gutter={[12, 12]}>
				{[0, 1, 2, 3].map((i) => (
					<StatCardSkeleton key={i} delay={i} />
				))}
			</Row>
		);
	}

	const statItems = [
		{
			icon: <FileTextOutlined style={{ fontSize: 16 }} />,
			value: stats.overview.total_assessments,
			label: t('dashboard.assessments'),
			color: STAT_CARD_COLORS.primary,
		},
		{
			icon: <QuestionCircleOutlined style={{ fontSize: 16 }} />,
			value: stats.overview.total_questions,
			label: t('dashboard.questions'),
			color: STAT_CARD_COLORS.success,
		},
		{
			icon: <BankOutlined style={{ fontSize: 16 }} />,
			value: stats.overview.total_question_banks,
			label: t('dashboard.banks'),
			color: STAT_CARD_COLORS.cyan,
		},
		{
			icon: <CheckCircleOutlined style={{ fontSize: 16 }} />,
			value: stats.overview.total_attempts,
			label: t('dashboard.attempts'),
			color: STAT_CARD_COLORS.warning,
		},
	];

	return (
		<Row gutter={[12, 12]}>
			{statItems.map((item, index) => (
				<StatCardItem key={item.label} {...item} delay={index} />
			))}
		</Row>
	);
};
