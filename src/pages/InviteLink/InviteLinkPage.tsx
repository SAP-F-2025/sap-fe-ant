import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	LoadingOutlined,
	TeamOutlined,
} from '@ant-design/icons';
import { Button, Card, Flex, Result, Space, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import inviteLinkService from '../../services/inviteLinkService';
import { elevation } from '../../styles/elevation';
import { GroupResponse } from '../../types';

const { Title, Text } = Typography;

type InviteStatus = 'loading' | 'valid' | 'invalid' | 'joining' | 'success' | 'already_member';

interface InviteError {
	type: 'expired' | 'limit_reached' | 'not_found' | 'inactive' | 'unknown';
	message: string;
}

const InviteLinkPage: React.FC = () => {
	const { t } = useTranslation();
	const { token } = useParams<{ token: string }>();
	const navigate = useNavigate();

	const [status, setStatus] = useState<InviteStatus>('loading');
	const [group, setGroup] = useState<GroupResponse | null>(null);
	const [error, setError] = useState<InviteError | null>(null);

	useEffect(() => {
		if (token) {
			validateLink();
		} else {
			setStatus('invalid');
			setError({
				type: 'not_found',
				message: t('inviteLink.errors.invalidLink'),
			});
		}
	}, [token]);

	const validateLink = async () => {
		setStatus('loading');
		try {
			const response = await inviteLinkService.validateInviteLink(token!);

			if (response.valid && response.group) {
				setGroup(response.group);

				if (response.is_member) {
					setStatus('already_member');
				} else {
					setStatus('valid');
				}
			} else {
				setStatus('invalid');
				setError({
					type: (response.error as InviteError['type']) || 'unknown',
					message: getErrorMessage(response.error),
				});
			}
		} catch {
			setStatus('invalid');
			setError({
				type: 'unknown',
				message: t('inviteLink.errors.validationFailed'),
			});
		}
	};

	const getErrorMessage = (errorType?: string): string => {
		switch (errorType) {
			case 'expired':
				return t('inviteLink.errors.expired');
			case 'limit_reached':
				return t('inviteLink.errors.limitReached');
			case 'not_found':
				return t('inviteLink.errors.notFound');
			case 'inactive':
				return t('inviteLink.errors.inactive');
			default:
				return t('inviteLink.errors.unknown');
		}
	};

	const handleJoinGroup = async () => {
		setStatus('joining');
		try {
			const response = await inviteLinkService.useInviteLink(token!);

			if (response.success) {
				setStatus('success');
			} else {
				setStatus('invalid');
				setError({
					type: 'unknown',
					message: response.message || t('inviteLink.errors.joinFailed'),
				});
			}
		} catch {
			setStatus('invalid');
			setError({
				type: 'unknown',
				message: t('inviteLink.errors.joinFailed'),
			});
		}
	};

	const handleGoToGroup = () => {
		if (group) {
			navigate(`/student/groups/${group.id}`);
		} else {
			navigate('/student/groups');
		}
	};

	const handleGoHome = () => {
		navigate('/');
	};

	const renderContent = () => {
		switch (status) {
			case 'loading':
				return (
					<Result
						icon={
							<Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
						}
						title={t('inviteLink.validating')}
						subTitle={t('inviteLink.pleaseWait')}
					/>
				);

			case 'valid':
				return (
					<Result
						icon={<TeamOutlined style={{ fontSize: 72, color: '#1890ff' }} />}
						title={t('inviteLink.joinGroupTitle')}
						subTitle={t('inviteLink.joinGroupSubtitle')}
						extra={
							<Space direction="vertical" size="large" style={{ width: '100%' }}>
								{group && (
									<Card
										size="small"
										style={{
											...elevation[1],
											borderRadius: 12,
											textAlign: 'left',
										}}
									>
										<Flex vertical gap={8}>
											<Flex justify="space-between" align="center">
												<Text type="secondary">
													{t('inviteLink.groupName')}:
												</Text>
												<Text strong>
													{group.display_name || group.name}
												</Text>
											</Flex>
											{group.description && (
												<Flex justify="space-between" align="flex-start">
													<Text type="secondary">
														{t('inviteLink.description')}:
													</Text>
													<Text
														style={{
															textAlign: 'right',
															maxWidth: 200,
														}}
													>
														{group.description}
													</Text>
												</Flex>
											)}
											<Flex justify="space-between" align="center">
												<Text type="secondary">
													{t('inviteLink.members')}:
												</Text>
												<Text>{group.member_count || 0}</Text>
											</Flex>
										</Flex>
									</Card>
								)}

								<Button
									type="primary"
									size="large"
									icon={<TeamOutlined />}
									onClick={handleJoinGroup}
									block
								>
									{t('inviteLink.joinNow')}
								</Button>
								<Button onClick={handleGoHome}>{t('inviteLink.backToHome')}</Button>
							</Space>
						}
					/>
				);

			case 'joining':
				return (
					<Result
						icon={
							<Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
						}
						title={t('inviteLink.joining')}
						subTitle={t('inviteLink.pleaseWait')}
					/>
				);

			case 'success':
				return (
					<Result
						status="success"
						icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
						title={t('inviteLink.joinSuccess')}
						subTitle={t('inviteLink.joinSuccessSubtitle', {
							name: group?.display_name || group?.name || '',
						})}
						extra={[
							<Button type="primary" key="view" onClick={handleGoToGroup}>
								{t('inviteLink.viewGroup')}
							</Button>,
							<Button key="home" onClick={handleGoHome}>
								{t('inviteLink.backToHome')}
							</Button>,
						]}
					/>
				);

			case 'already_member':
				return (
					<Result
						status="info"
						title={t('inviteLink.alreadyMember')}
						subTitle={t('inviteLink.alreadyMemberSubtitle', {
							name: group?.display_name || group?.name || '',
						})}
						extra={[
							<Button type="primary" key="view" onClick={handleGoToGroup}>
								{t('inviteLink.viewGroup')}
							</Button>,
							<Button key="home" onClick={handleGoHome}>
								{t('inviteLink.backToHome')}
							</Button>,
						]}
					/>
				);

			case 'invalid':
				return (
					<Result
						status="error"
						icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
						title={t('inviteLink.invalidTitle')}
						subTitle={error?.message || t('inviteLink.errors.unknown')}
						extra={[
							<Button type="primary" key="home" onClick={handleGoHome}>
								{t('inviteLink.backToHome')}
							</Button>,
						]}
					/>
				);

			default:
				return null;
		}
	};

	return (
		<Flex
			justify="center"
			align="center"
			style={{
				minHeight: '100vh',
				background: 'var(--ant-color-bg-layout)',
				padding: 24,
			}}
		>
			<Card
				style={{
					maxWidth: 500,
					width: '100%',
					...elevation[2],
					borderRadius: 16,
				}}
			>
				<Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
					<TeamOutlined style={{ marginRight: 8 }} />
					{t('inviteLink.pageTitle')}
				</Title>
				{renderContent()}
			</Card>
		</Flex>
	);
};

export default InviteLinkPage;
