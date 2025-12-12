import {
	BellOutlined,
	CheckOutlined,
	CloseOutlined,
	DeleteOutlined
} from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	Badge,
	Button,
	Dropdown,
	Empty,
	List,
	Modal,
	Skeleton,
	Space,
	Tooltip,
	Typography,
	theme
} from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotificationStream } from '../../hooks/useNotificationStream';
import notificationService from '../../services/notificationService';
import { UserNotification } from '../../types/notification';
import { useThemeToken } from '../../theme/ThemeProvider';
import './NotificationDropdown.css'; // Keep existing CSS if any

dayjs.extend(relativeTime);

const { Text, Title, Paragraph } = Typography;

export const NotificationDropdown: React.FC = () => {
	const { token } = useThemeToken();
	const { t, i18n } = useTranslation();
	const [open, setOpen] = useState(false);
	const [selectedNotification, setSelectedNotification] = useState<UserNotification | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const queryClient = useQueryClient();

	// Connect to SSE
	useNotificationStream();

	// Fetch Unread Count
	const { data: unreadCount } = useQuery({
		queryKey: ['unread_count'],
		queryFn: () => notificationService.getUnreadCount(),
		refetchInterval: 60000,
	});

	// Fetch Notifications (Simplified pagination for dropdown: just first page or hard limit for now, 
	// or implement load more. The existing component had infinite scroll. 
	// For simplicity in this step, I'll fetch top 20. Infinite scroll can be re-added if requested)
	const { data: history, isLoading } = useQuery({
		queryKey: ['notifications'],
		queryFn: () => notificationService.getHistory({ page: 0, size: 20 }),
		enabled: open,
	});

	// Mutations
	const markReadMutation = useMutation({
		mutationFn: (id: string) => notificationService.markAsRead(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
			queryClient.invalidateQueries({ queryKey: ['unread_count'] });
		},
	});

	const markAllReadMutation = useMutation({
		mutationFn: () => notificationService.markAllAsRead(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
			queryClient.invalidateQueries({ queryKey: ['unread_count'] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => notificationService.deleteNotification(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
		},
	});

	const handleNotificationClick = (notification: UserNotification) => {
		if (!notification.isRead) {
			markReadMutation.mutate(notification.id);
		}
		setSelectedNotification(notification);
		setModalOpen(true);
		setOpen(false);
	};

	const formatTime = (timestamp: number) => {
		// Backend sends epoch seconds (e.g. 1765300386.744872), dayjs expects milliseconds for unix(x) or seconds. 
		// If float seconds, unix() handles it? No, unix() takes integer seconds.
		// Let's safe handle:
		return dayjs.unix(Math.floor(timestamp)).fromNow();
	};

	const formatFullDate = (timestamp: number) => {
		const date = new Date(timestamp * 1000);
		return date.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};


	const dropdownContent = (
		<div style={{ width: 380, maxHeight: 500, display: 'flex', flexDirection: 'column', background: token.colorBgElevated, borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
			<div style={{
				padding: '12px 16px',
				borderBottom: `1px solid ${token.colorBorderSecondary}`,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center'
			}}>
				<Text strong>{t('notificationDropdown.title', 'Notifications')}</Text>
				<Button
					type="link"
					size="small"
					onClick={() => markAllReadMutation.mutate()}
					disabled={unreadCount === 0}
				>
					{t('notificationDropdown.markAllRead', 'Mark all read')}
				</Button>
			</div>

			<div style={{ flex: 1, overflowY: 'auto', maxHeight: 400 }}>
				{isLoading ? (
					<div style={{ padding: 16 }}>
						<Skeleton active paragraph={{ rows: 2 }} />
						<Skeleton active paragraph={{ rows: 2 }} />
					</div>
				) : history?.content && history.content.length > 0 ? (
					<List
						itemLayout="horizontal"
						dataSource={history.content}
						renderItem={(item: UserNotification) => (
							<div
								style={{
									padding: '12px 16px',
									borderBottom: `1px solid ${token.colorBorderSecondary}`,
									background: item.isRead ? 'transparent' : token.colorPrimaryBg,
									cursor: 'pointer',
									transition: 'background 0.3s',
									display: 'flex',
									gap: 12
								}}
								onClick={() => handleNotificationClick(item)}
								onMouseEnter={(e) => { e.currentTarget.style.background = token.colorFillTertiary; }}
								onMouseLeave={(e) => { e.currentTarget.style.background = item.isRead ? 'transparent' : token.colorPrimaryBg; }}
							>
								{!item.isRead && (
									<div style={{ width: 8, height: 8, borderRadius: '50%', background: token.colorPrimary, marginTop: 6, flexShrink: 0 }} />
								)}
								<div style={{ flex: 1, minWidth: 0 }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
										<Text strong={!item.isRead} ellipsis style={{ maxWidth: 200 }}>{item.subject}</Text>
										<Text type="secondary" style={{ fontSize: 11, whiteSpace: 'nowrap', marginLeft: 8 }}>
											{formatTime(item.createdAt)}
										</Text>
									</div>
									<Text type="secondary" ellipsis style={{ display: 'block', fontSize: 13 }}>
										{item.content.replace(/<[^>]*>?/gm, '')}
									</Text>
								</div>
								<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
									{!item.isRead && (
										<Tooltip title="Mark read">
											<Button type="text" size="small" icon={<CheckOutlined style={{ fontSize: 12 }} />} onClick={() => markReadMutation.mutate(item.id)} />
										</Tooltip>
									)}
									<Tooltip title="Delete">
										<Button type="text" size="small" danger icon={<DeleteOutlined style={{ fontSize: 12 }} />} onClick={() => deleteMutation.mutate(item.id)} />
									</Tooltip>
								</div>
							</div>
						)}
					/>
				) : (
					<div style={{ padding: 32 }}>
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('notificationDropdown.noNotifications', 'No notifications')} />
					</div>
				)}
			</div>
			{/* View History could link to a full page if we had one */}
		</div>
	);

	return (
		<>
			<Dropdown
				menu={{ items: [] }} // Dummy, we use dropdownRender
				dropdownRender={() => dropdownContent}
				trigger={['click']}
				placement="bottomRight"
				open={open}
				onOpenChange={setOpen}
			>
				<Badge count={unreadCount} overflowCount={99} size="small" offset={[-2, 2]}>
					<Button
						type="text"
						icon={<BellOutlined style={{ fontSize: 18 }} />}
						style={{
							width: 40,
							height: 40,
							borderRadius: token.borderRadius
						}}
					/>
				</Badge>
			</Dropdown>

			<Modal
				open={modalOpen}
				onCancel={() => setModalOpen(false)}
				footer={null}
				closable={false}
				centered
				width={600}
				styles={{
					content: { borderRadius: 12, overflow: 'hidden' },
					body: { padding: 0 }
				}}
			>
				{selectedNotification && (
					<div style={{ background: token.colorBgContainer }}>
						<div style={{ padding: '16px 24px', borderBottom: `1px solid ${token.colorBorderSecondary}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<Title level={4} style={{ margin: 0 }}>Notification Detail</Title>
							<Button type="text" icon={<CloseOutlined />} onClick={() => setModalOpen(false)} />
						</div>
						<div style={{ padding: 24 }}>
							<Space direction="vertical" style={{ width: '100%' }}>
								<Text type="secondary" style={{ fontSize: 12 }}>{formatFullDate(selectedNotification.createdAt)}</Text>
								<Title level={4} style={{ margin: 0 }}>{selectedNotification.subject}</Title>
								<Paragraph>
									<div dangerouslySetInnerHTML={{ __html: selectedNotification.content }} />
								</Paragraph>
							</Space>
						</div>
						<div style={{ padding: '16px 24px', borderTop: `1px solid ${token.colorBorderSecondary}`, textAlign: 'right' }}>
							<Button onClick={() => setModalOpen(false)}>Close</Button>
						</div>
					</div>
				)}
			</Modal>
		</>
	);
};
