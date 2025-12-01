import { BellOutlined, CloseOutlined } from '@ant-design/icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
	Badge,
	Button,
	Dropdown,
	Empty,
	Modal,
	Skeleton,
	Space,
	Typography
} from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useThemeToken } from '../../theme/ThemeProvider';
import './NotificationDropdown.css';

const { Text, Title, Paragraph } = Typography;

// Types
export interface Notification {
	id: string;
	title: string;
	content: string;
	createdAt: string;
	read: boolean;
}

interface NotificationPage {
	notifications: Notification[];
	nextCursor?: string;
	hasMore: boolean;
}

// Mock API function - replace with actual API call
const fetchNotifications = async (cursor?: string): Promise<NotificationPage> => {
	// Simulate API delay
	await new Promise(resolve => setTimeout(resolve, 500));

	// Mock data - replace with actual API call
	const mockNotifications: Notification[] = Array.from({ length: 10 }, (_, i) => {
		const index = cursor ? parseInt(cursor) + i : i;
		return {
			id: `notification-${index}`,
			title: `Thông báo ${index + 1}`,
			content: index % 3 === 0
				? `Đây là nội dung thông báo số ${index + 1}. Nội dung này rất dài và cần được cắt bớt khi hiển thị trong danh sách để đảm bảo giao diện đẹp mắt và dễ đọc cho người dùng.`
				: `Nội dung thông báo ngắn gọn số ${index + 1}.`,
			createdAt: new Date(Date.now() - index * 3600000).toISOString(),
			read: index > 2,
		};
	});

	const nextCursor = cursor ? String(parseInt(cursor) + 10) : '10';

	return {
		notifications: mockNotifications,
		nextCursor: parseInt(nextCursor) < 50 ? nextCursor : undefined,
		hasMore: parseInt(nextCursor) < 50,
	};
};

// Notification Item Component
interface NotificationItemProps {
	notification: Notification;
	onClick: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
	const { token } = useThemeToken();

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Vừa xong';
		if (diffMins < 60) return `${diffMins} phút trước`;
		if (diffHours < 24) return `${diffHours} giờ trước`;
		if (diffDays < 7) return `${diffDays} ngày trước`;
		return date.toLocaleDateString('vi-VN');
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
				e.currentTarget.style.background = notification.read ? 'transparent' : token.colorPrimaryBg;
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
	const [open, setOpen] = useState(false);
	const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const listRef = useRef<HTMLDivElement>(null);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
	} = useInfiniteQuery({
		queryKey: ['notifications'],
		queryFn: ({ pageParam }) => fetchNotifications(pageParam),
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		initialPageParam: undefined as string | undefined,
	});

	const notifications = data?.pages.flatMap(page => page.notifications) ?? [];
	const unreadCount = notifications.filter(n => !n.read).length;

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

	const handleNotificationClick = (notification: Notification) => {
		setSelectedNotification(notification);
		setModalOpen(true);
		setOpen(false);
	};

	const formatFullDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('vi-VN', {
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
				<Title level={5} style={{ margin: 0 }}>Thông báo</Title>
				{unreadCount > 0 && (
					<Button type="link" size="small" style={{ padding: 0 }}>
						Đánh dấu đã đọc
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
						{[1, 2, 3].map(i => (
							<div key={i} style={{ marginBottom: 16 }}>
								<Skeleton active paragraph={{ rows: 2 }} />
							</div>
						))}
					</div>
				) : notifications.length === 0 ? (
					<Empty
						description="Không có thông báo"
						style={{ padding: '40px 16px' }}
					/>
				) : (
					<>
						{notifications.map(notification => (
							<NotificationItem
								key={notification.id}
								notification={notification}
								onClick={() => handleNotificationClick(notification)}
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
					mask: { background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)' },
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
							<Title level={4} style={{ margin: 0 }}>Chi tiết thông báo</Title>
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
								<Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
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
							<Button onClick={() => setModalOpen(false)}>
								Đóng
							</Button>
						</div>
					</div>
				)}
			</Modal>
		</>
	);
};

export default NotificationDropdown;
