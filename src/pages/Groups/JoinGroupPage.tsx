import { LoadingOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Card, Result, Space, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import groupService from '../../services/groupService';
import { GroupResponse } from '../../types';
import { showError, showSuccess } from '../../utils/errorHandler';

const { Title, Text } = Typography;

const JoinGroupPage: React.FC = () => {
	const { t } = useTranslation();
	const { token } = useParams<{ token: string }>();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [joining, setJoining] = useState(false);
	const [group, setGroup] = useState<GroupResponse | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (token) {
			handleJoin();
		}
	}, [token]);

	const handleJoin = async () => {
		if (!token) return;

		setLoading(false);
		setJoining(true);
		setError(null);

		try {
			const response = await groupService.joinViaLink(token);
			setGroup(response);
			showSuccess(t('groups.join.success'));
			// Redirect to the group after a short delay
			setTimeout(() => {
				navigate(`/groups/${response.id}`);
			}, 1500);
		} catch (err: any) {
			const errorMessage = err?.response?.data?.message || '';
			if (errorMessage.includes('expired')) {
				setError(t('groups.join.expired'));
			} else if (errorMessage.includes('exhausted') || errorMessage.includes('maximum')) {
				setError(t('groups.join.exhausted'));
			} else if (errorMessage.includes('not found')) {
				setError(t('groups.join.notFound'));
			} else if (errorMessage.includes('already a member')) {
				setError(t('groups.join.alreadyMember'));
			} else {
				setError(t('groups.join.error'));
			}
		} finally {
			setJoining(false);
		}
	};

	if (loading || joining) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '60vh',
				}}
			>
				<Card style={{ textAlign: 'center', padding: 40 }}>
					<Space direction="vertical" size="large">
						<Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
						<Title level={4}>{t('groups.join.joining')}</Title>
						<Text type="secondary">{t('groups.join.title')}</Text>
					</Space>
				</Card>
			</div>
		);
	}

	if (error) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '60vh',
				}}
			>
				<Result
					status="error"
					title={t('groups.join.error')}
					subTitle={error}
					extra={
						<Button type="primary" onClick={() => navigate('/groups')}>
							{t('groups.detail.backToList')}
						</Button>
					}
				/>
			</div>
		);
	}

	if (group) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '60vh',
				}}
			>
				<Result
					status="success"
					icon={<TeamOutlined style={{ color: '#52c41a' }} />}
					title={t('groups.join.success')}
					subTitle={group.display_name || group.name}
					extra={
						<Button type="primary" onClick={() => navigate(`/groups/${group.id}`)}>
							{t('common.viewDetails')}
						</Button>
					}
				/>
			</div>
		);
	}

	return null;
};

export default JoinGroupPage;
