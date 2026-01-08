import { BellOutlined, CloseOutlined } from '@ant-design/icons';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge, Button, Dropdown, Empty, Modal, Skeleton, Space, Typography } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeToken } from '../../theme/ThemeProvider';
import { notificationService } from '../../services/notificationService';
import type { Notification, NotificationPage } from '../../types/notification';
import './NotificationDropdown.css';

const { Text, Title, Paragraph } = Typography;

// Adapter interface for display - maps backend DTO to display format
interface DisplayNotification {
	id: string;
	title: string;
	content: string;
	createdAt: string;
	read: boolean;
}

// Convert backend notification to display format
const toDisplayNotification = (n: Notification): DisplayNotification => ({
	id: n.id,
	title: n.subject, // Backend uses 'subject', UI calls it 'title'
	content: n.content,
	createdAt: new Date(n.createdAt * 1000).toISOString(), // Convert Unix timestamp (seconds) to ISO string
	read: n.read,
});

// Fetch notifications using real API
const fetchNotifications = async (page: number = 0): Promise<{
	notifications: DisplayNotification[];
	nextPage?: number;
	hasMore: boolean;
}> => {
	const response: NotificationPage = await notificationService.getNotifications(page, 20);

	return {
		notifications: response.content.map(toDisplayNotification),
		nextPage: response.last ? undefined : page + 1,
		hasMore: !response.last,
	};
};

// Notification Item Component
interface NotificationItemProps {
	notification: DisplayNotification;
	onClick: () => void;
	t: (key: string, options?: Record<string, unknown>) => string;
	i18n: { language: string };
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick, t, i18n }) => {
	const { token } = useThemeToken();

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return t('notificationDropdown.justNow');
		if (diffMins < 60) return t('notificationDropdown.minutesAgo', { count: diffMins });
		if (diffHours < 24) return t('notificationDropdown.hoursAgo', { count: diffHours });
		if (diffDays < 7) return t('notificationDropdown.daysAgo', { count: diffDays });
		return date.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US');
	};

	return (
		<div
			className="notification-item"
			onClick={onClick}
			style={{
				padding: '12px 16px',
				cursor: 'pointer',
				borderBottom: `1px solid ${token.colorBorderSecondary}`,
				background: notification.read ? 'transparent' : token.colorPrimaryBg,
				transition: 'background 0.2s',
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.background = token.colorFillTertiary;
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.background = notification.read
					? 'transparent'
					: token.colorPrimaryBg;
			}}
		>
			<div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
				{!notification.read && (
					<div
						style={{
							width: 8,
							height: 8,
							borderRadius: '50%',
							background: token.colorPrimary,
							marginTop: 6,
							flexShrink: 0,
						}}
					/>
				)}
				<div style={{ flex: 1, minWidth: 0 }}>
					<Text
						strong
						style={{
							display: 'block',
							marginBottom: 4,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						}}
					>
						{notification.title}
					</Text>
					<Text
						type="secondary"
						style={{
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
							fontSize: 13,
							lineHeight: '1.4',
						}}
					>
						{notification.content}
					</Text>
					<Text
						type="secondary"
						style={{
							fontSize: 12,
							marginTop: 4,
							display: 'block',
						}}
					>
						{formatTime(notification.createdAt)}
					</Text>
				</div>
			</div>
		</div>
	);
};

// Main Component
export const NotificationDropdown: React.FC = () => {
	const { token } = useThemeToken();
	const { t, i18n } = useTranslation();
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);
	const [selectedNotification, setSelectedNotification] = useState<DisplayNotification | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const listRef = useRef<HTMLDivElement>(null);

	// Fetch notifications with infinite query
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
		queryKey: ['notifications'],
		queryFn: ({ pageParam = 0 }) => fetchNotifications(pageParam),
		getNextPageParam: (lastPage) => lastPage.nextPage,
		initialPageParam: 0,
	});

	// Mark as read mutation
	const markAsReadMutation = useMutation({
		mutationFn: (id: string) => notificationService.markAsRead(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
		},
	});

	// Mark all as read mutation
	const markAllAsReadMutation = useMutation({
		mutationFn: () => notificationService.markAllAsRead(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
		},
	});

	const notifications = data?.pages.flatMap((page) => page.notifications) ?? [];
	const unreadCount = notifications.filter((n) => !n.read).length;

	// Infinite scroll handler
	const handleScroll = useCallback(() => {
		if (!listRef.current) return;

		const { scrollTop, scrollHeight, clientHeight } = listRef.current;
		if (scrollHeight - scrollTop - clientHeight < 100 && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	useEffect(() => {
		const listElement = listRef.current;
		if (listElement) {
			listElement.addEventListener('scroll', handleScroll);
			return () => listElement.removeEventListener('scroll', handleScroll);
		}
	}, [handleScroll, open]);

	const handleNotificationClick = (notification: DisplayNotification) => {
		// Mark as read if unread
		if (!notification.read) {
			markAsReadMutation.mutate(notification.id);
		}

		setSelectedNotification(notification);
		setModalOpen(true);
		setOpen(false);
	};

	const handleMarkAllAsRead = () => {
		markAllAsReadMutation.mutate();
	};

	const formatFullDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	// Dropdown content
	const dropdownContent = (
		<div
			style={{
				width: 380,
				maxHeight: 480,
				background: token.colorBgElevated,
				borderRadius: 12,
				boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
				overflow: 'hidden',
			}}
		>
			{/* Header */}
			<div
				style={{
					padding: '16px',
					borderBottom: `1px solid ${token.colorBorderSecondary}`,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Title level={5} style={{ margin: 0 }}>
					{t('notificationDropdown.title')}
				</Title>
				{unreadCount > 0 && (
					<Button
						type="link"
						size="small"
						style={{ padding: 0 }}
						onClick={handleMarkAllAsRead}
						loading={markAllAsReadMutation.isPending}
					>
						{t('notificationDropdown.markAllRead')}
					</Button>
				)}
			</div>

			{/* Notification List */}
			<div
				ref={listRef}
				style={{
					maxHeight: 400,
					overflowY: 'auto',
				}}
			>
				{isLoading ? (
					<div style={{ padding: 16 }}>
						{[1, 2, 3].map((i) => (
							<div key={i} style={{ marginBottom: 16 }}>
								<Skeleton active paragraph={{ rows: 2 }} />
							</div>
						))}
					</div>
				) : notifications.length === 0 ? (
					<Empty
						description={t('notificationDropdown.noNotifications')}
						style={{ padding: '40px 16px' }}
					/>
				) : (
					<>
						{notifications.map((notification) => (
							<NotificationItem
								key={notification.id}
								notification={notification}
								onClick={() => handleNotificationClick(notification)}
								t={t}
								i18n={i18n}
							/>
						))}
						{isFetchingNextPage && (
							<div style={{ padding: 16, textAlign: 'center' }}>
								<Skeleton active paragraph={{ rows: 1 }} />
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);

	return (
		<>
			<Dropdown
				open={open}
				onOpenChange={setOpen}
				dropdownRender={() => dropdownContent}
				placement="bottomRight"
				trigger={['click']}
			>
				<Badge count={unreadCount} size="small" offset={[-2, 2]}>
					<Button
						type="text"
						icon={<BellOutlined />}
						style={{
							fontSize: 18,
							width: 40,
							height: 40,
							borderRadius: token.borderRadius,
						}}
					/>
				</Badge>
			</Dropdown>

			{/* Notification Detail Modal */}
			<Modal
				open={modalOpen}
				onCancel={() => setModalOpen(false)}
				footer={null}
				closable={false}
				width={600}
				centered
				styles={{
					body: {
						padding: 0,
					},
					content: {
						borderRadius: 12,
						overflow: 'hidden',
						boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
					},
					mask: {
						background: 'rgba(0, 0, 0, 0.75)',
						backdropFilter: 'blur(4px)',
					},
				}}
				rootClassName="notification-modal-root"
			>
				{selectedNotification && (
					<div style={{ background: token.colorBgContainer }}>
						{/* Modal Header */}
						<div
							style={{
								padding: '16px 24px',
								borderBottom: `1px solid ${token.colorBorderSecondary}`,
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<Title level={4} style={{ margin: 0 }}>
								{t('notificationDropdown.detailTitle')}
							</Title>
							<Button
								type="text"
								icon={<CloseOutlined />}
								onClick={() => setModalOpen(false)}
								style={{ fontSize: 18 }}
							/>
						</div>

						{/* Modal Content */}
						<div style={{ padding: '24px' }}>
							<Space direction="vertical" size="middle" style={{ width: '100%' }}>
								<div>
									<Text type="secondary" style={{ fontSize: 12 }}>
										{formatFullDate(selectedNotification.createdAt)}
									</Text>
								</div>
								<Title level={4} style={{ margin: 0 }}>
									{selectedNotification.title}
								</Title>
								<Paragraph
									style={{
										margin: 0,
										whiteSpace: 'pre-wrap',
									}}
								>
									{selectedNotification.content}
								</Paragraph>
							</Space>
						</div>

						{/* Modal Footer */}
						<div
							style={{
								padding: '16px 24px',
								borderTop: `1px solid ${token.colorBorderSecondary}`,
								display: 'flex',
								justifyContent: 'flex-end',
							}}
						>
							<Button onClick={() => setModalOpen(false)}>{t('common.close')}</Button>
						</div>
					</div>
				)}
			</Modal>
		</>
	);
};

export default NotificationDropdown;
