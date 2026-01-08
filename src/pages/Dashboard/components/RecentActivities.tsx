import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Card, Empty, Flex, Skeleton, Space, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getStaggerDelay } from '../../../styles/animations';
import { elevation } from '../../../styles/elevation';
import { useThemeToken } from '../../../theme/ThemeProvider';
import type { RecentActivity } from '../../../types';
import { getActionTextKey } from '../constants';

const { Text } = Typography;

interface RecentActivitiesProps {
	activities: RecentActivity[];
	isLoading: boolean;
}

/**
 * Recent Activities Component
 * Displays a list of recent user activities
 */
export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, isLoading }) => {
	const { token } = useThemeToken();
	const { t } = useTranslation();

	return (
		<Card
			title={
				<Space>
					<ClockCircleOutlined style={{ fontSize: 18, color: token.colorInfo }} />
					<span style={{ fontWeight: 600 }}>{t('dashboard.recentActivities')}</span>
				</Space>
			}
			bordered={false}
			style={{
				borderRadius: token.borderRadiusLG,
				height: '100%',
				...elevation[2],
			}}
		>
			{isLoading ? (
				<Skeleton active paragraph={{ rows: 6 }} />
			) : activities.length === 0 ? (
				<Empty description={t('dashboard.noActivities')} style={{ padding: '40px 0' }} />
			) : (
				<Space direction="vertical" style={{ width: '100%' }} size="middle">
					{activities.map((activity, index) => (
						<ActivityItem
							key={activity.id}
							activity={activity}
							index={index}
							token={token}
						/>
					))}
				</Space>
			)}
		</Card>
	);
};

interface ActivityItemProps {
	activity: RecentActivity;
	index: number;
	token: ReturnType<typeof useThemeToken>['token'];
}

/**
 * Individual activity item
 */
const ActivityItem: React.FC<ActivityItemProps> = ({ activity, index, token }) => {
	const { t } = useTranslation();
	return (
		<Card
			size="small"
			bordered={false}
			style={{
				backgroundColor: token.colorBgLayout,
				...elevation[1],
				animation: 'fadeIn 400ms ease-in-out',
				animationDelay: getStaggerDelay(index, 100),
			}}
		>
			<Flex gap={token.marginMD} align="start">
				<Avatar
					icon={<UserOutlined />}
					style={{
						backgroundColor: token.colorPrimary,
						...elevation[1],
					}}
				/>
				<Flex vertical style={{ flex: 1 }} gap={4}>
					<Flex justify="space-between" align="start" wrap="wrap">
						<Text strong>{activity.user_name}</Text>
						<Text type="secondary" style={{ fontSize: 12 }}>
							{activity.time_ago}
						</Text>
					</Flex>
					<Text type="secondary" style={{ fontSize: 13 }}>
						{t(getActionTextKey(activity.action))}{' '}
						<Text strong>
							{activity.assessment_title || activity.question_bank_name || ''}
						</Text>
					</Text>
					{activity.score && (
						<Badge
							count={`${activity.score} ${t('dashboard.points')}`}
							style={{
								backgroundColor: '#52c41a',
								marginTop: 4,
							}}
						/>
					)}
				</Flex>
			</Flex>
		</Card>
	);
};
