import {
	BellOutlined,
	BgColorsOutlined,
	CameraOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseOutlined,
	DeleteOutlined,
	EyeOutlined,
	GlobalOutlined,
	InfoCircleOutlined,
	MoonOutlined,
	SafetyOutlined,
	SunOutlined,
	UserOutlined
} from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { MenuProps } from 'antd';
import {
	Alert,
	App,
	Avatar,
	Button,
	Descriptions,
	Input,
	Menu,
	Modal,
	Space,
	Spin,
	Switch,
	Tag,
	Typography
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { CasdoorConfig } from '../../config/casdoor';
import { useAuth } from '../../hooks/useAuth';
import faceVerificationService from '../../services/faceVerificationService';
import { useTheme, useThemeToken } from '../../theme/ThemeProvider';
import type { ThemeMode } from '../../theme/tokens';
import { getUserRole } from '../../utils/roleChecker';
import { ShortcutsModal } from '../ShortcutsModal';
import './SettingsModal.css';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

// Settings section types
export type SettingsSection =
	| 'my-account'
	| 'profile'
	| 'security'
	| 'notifications'
	| 'appearance'
	| 'accessibility'
	| 'language'
	| 'about';

interface SettingsModalProps {
	open: boolean;
	onClose: () => void;
	defaultSection?: SettingsSection;
}

interface SettingItemProps {
	title: string;
	description?: string;
	children: React.ReactNode;
	noBorder?: boolean;
}

/**
 * Individual setting item with title and optional description
 */
const SettingItem: React.FC<SettingItemProps> = ({ title, description, children, noBorder }) => {
	const { token } = useThemeToken();

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				padding: '12px 0',
				borderBottom: noBorder ? 'none' : `1px solid ${token.colorBorderSecondary}`,
			}}
		>
			<div style={{ flex: 1, marginRight: 16 }}>
				<Text strong style={{ display: 'block', marginBottom: 4 }}>
					{title}
				</Text>
				{description && (
					<Text type="secondary" style={{ fontSize: 13 }}>
						{description}
					</Text>
				)}
			</div>
			<div>{children}</div>
		</div>
	);
};

/**
 * Discord-style Settings Modal
 * Full-screen overlay with sidebar navigation and content sections
 */
export const SettingsModal: React.FC<SettingsModalProps> = ({
	open,
	onClose,
	defaultSection = 'my-account',
}) => {
	const { token } = useThemeToken();
	const { mode, setMode, toggleDark } = useTheme();
	const { user, logout } = useAuth();
	const [activeSection, setActiveSection] = useState<SettingsSection>(defaultSection);
	const [searchQuery, setSearchQuery] = useState('');
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [blinkRed, setBlinkRed] = useState(false);
	const [shortcutContext, setShortcutContext] = useState<string | undefined>();

	// Reset to default section when modal opens
	useEffect(() => {
		if (open) {
			setActiveSection(defaultSection);
			setSearchQuery('');
		}
	}, [open, defaultSection]);

	// Handle ESC key to close
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && open) {
				onClose();
			}
		};
		window.addEventListener('keydown', handleEsc);
		return () => window.removeEventListener('keydown', handleEsc);
	}, [open, onClose]);

	// Menu items for sidebar
	const menuItems: MenuProps['items'] = [
		{
			key: 'user-settings',
			type: 'group',
			label: <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Cài đặt người dùng</Text>,
			children: [
				{
					key: 'my-account',
					icon: <UserOutlined />,
					label: 'Tài khoản',
				},
				{
					key: 'profile',
					icon: <UserOutlined />,
					label: 'Hồ sơ',
				},
				{
					key: 'security',
					icon: <SafetyOutlined />,
					label: 'Bảo mật & Xác thực',
				},
			],
		},
		{
			key: 'app-settings',
			type: 'group',
			label: <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Cài đặt ứng dụng</Text>,
			children: [
				{
					key: 'notifications',
					icon: <BellOutlined />,
					label: 'Thông báo',
				},
				{
					key: 'appearance',
					icon: <BgColorsOutlined />,
					label: 'Giao diện',
				},
				{
					key: 'accessibility',
					icon: <EyeOutlined />,
					label: 'Trợ năng',
				},
				{
					key: 'language',
					icon: <GlobalOutlined />,
					label: 'Ngôn ngữ',
				},
			],
		},
		{
			type: 'divider',
		},
		{
			key: 'about',
			icon: <InfoCircleOutlined />,
			label: 'Thông tin',
		},
		{
			type: 'divider',
		},
		{
			key: 'logout',
			icon: <CloseOutlined />,
			label: <Text type="danger">Đăng xuất</Text>,
			danger: true,
		},
	];

	const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
		if (key === 'logout') {
			logout();
			onClose();
		} else {
			setActiveSection(key as SettingsSection);
		}
	};

	// Get Casdoor account URL for editing profile
	const getCasdoorAccountUrl = () => {
		const { serverUrl, appName, organizationName } = CasdoorConfig;
		return `${serverUrl}/account?app=${appName}&organization=${organizationName}`;
	};

	useEffect(() => {
		if (activeSection === 'notifications' && hasUnsavedChanges) {
			setShortcutContext('settings-notifications');
		} else {
			setShortcutContext(undefined);
		}
	}, [activeSection, hasUnsavedChanges]);

	// Render content based on active section
	const renderContent = () => {
		switch (activeSection) {
			case 'my-account':
				return <MyAccountSection user={user} onEditProfile={() => window.location.href = getCasdoorAccountUrl()} />;
			case 'profile':
				return <ProfileSection user={user} />;
			case 'security':
				return <SecuritySection user={user} onEditProfile={() => window.location.href = getCasdoorAccountUrl()} />;
			case 'notifications':
				return <NotificationsSection />;
			case 'appearance':
				return <AppearanceSection mode={mode} setMode={setMode} toggleDark={toggleDark} />;
			case 'accessibility':
				return <AccessibilitySection />;
			case 'language':
				return <LanguageSection />;
			case 'about':
				return <AboutSection />;
			default:
				return <MyAccountSection user={user} onEditProfile={() => window.location.href = getCasdoorAccountUrl()} />;
		}
	};

	const sectionTitles: Record<SettingsSection, string> = {
		'my-account': 'Tài khoản của tôi',
		'profile': 'Hồ sơ',
		'security': 'Bảo mật & Xác thực',
		'notifications': 'Thông báo',
		'appearance': 'Giao diện',
		'accessibility': 'Trợ năng',
		'language': 'Ngôn ngữ',
		'about': 'Thông tin',
	};

	return (
		<Modal
			open={open}
			onCancel={onClose}
			footer={null}
			closable={false}
			width="90%"
			centered
			style={{
				padding: 0,
				maxWidth: 1100,
			}}
			styles={{
				body: {
					padding: 0,
					border: 'none',
				},
				content: {
					borderRadius: 12,
					height: '85vh',
					overflow: 'hidden',
					boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
					border: 'none',
					padding: 0,
				},
				header: {
					display: 'none',
				},
				mask: { background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)' },
			}}
			maskClosable={true}
			rootClassName="settings-modal-root"
		>
			<div
				style={{
					display: 'flex',
					height: '85vh',
					background: token.colorBgContainer,
					borderRadius: 12,
					overflow: 'hidden',
				}}
			>
				{/* Left Sidebar */}
				<div
					style={{
						width: 220,
						background: token.colorBgLayout,
						borderRight: `1px solid ${token.colorBorderSecondary}`,
						display: 'flex',
						flexDirection: 'column',
						flexShrink: 0,
					}}
				>
					{/* Search */}
					<div style={{ padding: '16px 12px 8px' }}>
						<Search
							placeholder="Tìm kiếm..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							style={{ width: '100%' }}
							size="small"
						/>
					</div>

					{/* Navigation Menu */}
					<div style={{ flex: 1, overflow: 'auto', padding: '0 8px' }}>
						<Menu
							mode="inline"
							selectedKeys={[activeSection]}
							onClick={handleMenuClick}
							items={menuItems}
							style={{
								border: 'none',
								background: 'transparent',
							}}
						/>
					</div>
				</div>

				{/* Right Content Area */}
				<div
					style={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						overflow: 'hidden',
					}}
				>
					{/* Header */}
					<div
						style={{
							padding: '16px 24px',
							borderBottom: `1px solid ${token.colorBorderSecondary}`,
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							background: token.colorBgContainer,
						}}
					>
						<Title level={4} style={{ margin: 0 }}>
							{sectionTitles[activeSection]}
						</Title>
						<Button
							type="text"
							icon={<CloseOutlined />}
							onClick={onClose}
							style={{ fontSize: 18 }}
						/>
					</div>

					{/* Content */}
					<div
						style={{
							flex: 1,
							overflow: 'auto',
							padding: '24px 48px',
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<div style={{ width: '100%', maxWidth: 660 }}>
							{renderContent()}
						</div>
					</div>
				</div>
			</div>
			<ShortcutsModal activeContext={shortcutContext} />
		</Modal>
	);
};

// ============================================
// SECTION COMPONENTS
// ============================================

interface MyAccountSectionProps {
	user: any;
	onEditProfile: () => void;
}

const MyAccountSection: React.FC<MyAccountSectionProps> = ({ user, onEditProfile }) => {
	const { token } = useThemeToken();

	return (
		<div>
			{/* User Card */}
			<div
				style={{
					borderRadius: 8,
					overflow: 'hidden',
					marginBottom: 24,
				}}
			>
				{/* Banner */}
				<div style={{ height: 100, background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryActive} 100%)` }} />

				{/* User Info */}
				<div
					style={{
						padding: '0 16px 16px',
						background: token.colorBgElevated,
						position: 'relative',
					}}
				>
					<Avatar
						size={80}
						src={user?.avatar}
						icon={<UserOutlined />}
						style={{
							border: `4px solid ${token.colorBgElevated}`,
							marginTop: -40,
							background: token.colorPrimary,
						}}
					/>
					<div style={{ marginTop: 8 }}>
						<Space>
							<Text strong style={{ fontSize: 20 }}>{user?.displayName || user?.name || 'User'}</Text>
							<Text type="secondary">#{user?.id?.slice(-4) || '0000'}</Text>
						</Space>
					</div>
					<Button
						type="primary"
						style={{ position: 'absolute', top: 16, right: 16 }}
						onClick={onEditProfile}
					>
						Chỉnh sửa hồ sơ
					</Button>
				</div>
			</div>

			{/* Account Info */}
			<div
				style={{
					background: token.colorBgElevated,
					borderRadius: 8,
					padding: 16,
				}}
			>
				<SettingItem title="Tên hiển thị" description={user?.displayName || user?.name || '-'}>
					<Button size="small" onClick={onEditProfile}>Sửa</Button>
				</SettingItem>
				<SettingItem title="Tên người dùng" description={user?.name || '-'}>
					<Button size="small" onClick={onEditProfile}>Sửa</Button>
				</SettingItem>
				<SettingItem title="Email" description={user?.email || '-'}>
					<Button size="small" onClick={onEditProfile}>Sửa</Button>
				</SettingItem>
				<SettingItem title="Số điện thoại" description={user?.phone || 'Chưa thêm'}>
					<Button size="small" onClick={onEditProfile}>Sửa</Button>
				</SettingItem>
			</div>
		</div>
	);
};

interface ProfileSectionProps {
	user: any;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => {
	const { token } = useThemeToken();

	const formatDate = (dateString?: string) => {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return date.toLocaleDateString('vi-VN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const userRole = getUserRole(user);

	return (
		<div>
			<Paragraph type="secondary" style={{ marginBottom: 24 }}>
				Thông tin hồ sơ công khai của bạn.
			</Paragraph>

			{/* Basic Info */}
			<div
				style={{
					background: token.colorBgElevated,
					borderRadius: 8,
					padding: 16,
					marginBottom: 24,
				}}
			>
				<SettingItem title="Avatar" description="Ảnh đại diện của bạn">
					<Avatar size={64} src={user?.avatar} icon={<UserOutlined />} />
				</SettingItem>
				<SettingItem title="Vai trò">
					<Space>
						{userRole === 'admin' && (
							<Tag color="red" icon={<SafetyOutlined />}>Admin</Tag>
						)}
						{userRole === 'teacher' && (
							<Tag color="blue">Giáo viên</Tag>
						)}
						{userRole === 'student' && (
							<Tag color="green">Học sinh</Tag>
						)}
					</Space>
				</SettingItem>
			</div>

			{/* Detailed Info */}
			<Title level={5} style={{ marginBottom: 16 }}>Thông tin chi tiết</Title>
			<div
				style={{
					background: token.colorBgElevated,
					borderRadius: 8,
					padding: 16,
					marginBottom: 24,
				}}
			>
				<Descriptions column={1} size="small" labelStyle={{ width: 140 }}>
					{user?.id && (
						<Descriptions.Item label="ID">{user.id}</Descriptions.Item>
					)}
					{(user as any)?.education && (
						<Descriptions.Item label="Trường">{(user as any).education}</Descriptions.Item>
					)}
					{user?.owner && (
						<Descriptions.Item label="Tổ chức">{user.owner}</Descriptions.Item>
					)}
					{user?.createdTime && (
						<Descriptions.Item label={<><ClockCircleOutlined /> Ngày tạo</>}>
							{formatDate(user.createdTime)}
						</Descriptions.Item>
					)}
				</Descriptions>
			</div>

			{/* Roles & Permissions */}
			{(user?.roles?.length > 0 || user?.permissions?.length > 0) && (
				<>
					<Title level={5} style={{ marginBottom: 16 }}>Vai trò & Quyền hạn</Title>
					<div
						style={{
							background: token.colorBgElevated,
							borderRadius: 8,
							padding: 16,
						}}
					>
						{user?.roles?.length > 0 && (
							<div style={{ marginBottom: user?.permissions?.length ? 16 : 0 }}>
								<Text strong style={{ display: 'block', marginBottom: 8 }}>Vai trò:</Text>
								<Space size={[0, 8]} wrap>
									{user.roles.map((role: any, index: number) => (
										<Tag key={index} color="blue">
											{role.displayName || role.name || role}
										</Tag>
									))}
								</Space>
							</div>
						)}
						{user?.permissions?.length > 0 && (
							<div>
								<Text strong style={{ display: 'block', marginBottom: 8 }}>Quyền hạn:</Text>
								<Space size={[0, 8]} wrap>
									{user.permissions.map((permission: any, index: number) => (
										<Tag key={index} color="green">
											{permission.displayName || permission.name || permission}
										</Tag>
									))}
								</Space>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
};

interface SecuritySectionProps {
	user: any;
	onEditProfile: () => void;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({ user, onEditProfile }) => {
	const { token } = useThemeToken();
	const { message, modal } = App.useApp();
	const queryClient = useQueryClient();

	// Face registration state
	const [registerModalOpen, setRegisterModalOpen] = useState(false);
	const [cameraReady, setCameraReady] = useState(false);
	const [registering, setRegistering] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const streamRef = useRef<MediaStream | null>(null);

	// Face registration status query
	const { data: registrationStatus, isLoading: statusLoading } = useQuery({
		queryKey: ['face-registration-status'],
		queryFn: () => faceVerificationService.checkRegistrationStatus(),
	});

	const deleteFaceMutation = useMutation({
		mutationFn: () => faceVerificationService.deleteFace(),
		onSuccess: () => {
			message.success('Đã xóa dữ liệu khuôn mặt');
			queryClient.invalidateQueries({ queryKey: ['face-registration-status'] });
		},
		onError: (error: any) => {
			message.error(error.response?.data?.detail || 'Lỗi khi xóa dữ liệu khuôn mặt');
		},
	});

	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { width: 640, height: 480 },
			});
			streamRef.current = stream;
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
			setCameraReady(true);
		} catch (err) {
			message.error('Không thể truy cập camera');
		}
	};

	const stopCamera = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach(track => track.stop());
			streamRef.current = null;
		}
		setCameraReady(false);
	};

	const captureFrame = (): Promise<Blob> => {
		return new Promise((resolve, reject) => {
			if (!videoRef.current) {
				reject(new Error('Video not ready'));
				return;
			}
			const canvas = document.createElement('canvas');
			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				reject(new Error('Canvas context not available'));
				return;
			}
			ctx.scale(-1, 1);
			ctx.drawImage(videoRef.current, -canvas.width, 0);
			canvas.toBlob((blob) => {
				if (blob) resolve(blob);
				else reject(new Error('Failed to capture image'));
			}, 'image/jpeg', 0.95);
		});
	};

	const handleRegisterFace = async () => {
		setRegistering(true);
		try {
			const imageBlob = await captureFrame();
			await faceVerificationService.registerFace(imageBlob);
			message.success('Đăng ký khuôn mặt thành công');
			setRegisterModalOpen(false);
			stopCamera();
			queryClient.invalidateQueries({ queryKey: ['face-registration-status'] });
		} catch (err: any) {
			message.error(err.response?.data?.detail || 'Lỗi đăng ký khuôn mặt');
		} finally {
			setRegistering(false);
		}
	};

	const handleDeleteFace = () => {
		modal.confirm({
			title: 'Xóa dữ liệu khuôn mặt?',
			content: 'Bạn sẽ cần đăng ký lại để sử dụng tính năng xác thực khuôn mặt.',
			okText: 'Xóa',
			okType: 'danger',
			cancelText: 'Hủy',
			onOk: () => deleteFaceMutation.mutate(),
		});
	};

	return (
		<div>
			<Paragraph type="secondary" style={{ marginBottom: 24 }}>
				Quản lý bảo mật tài khoản và các phương thức xác thực.
			</Paragraph>

			{/* Password Section */}
			<Title level={5} style={{ marginBottom: 16 }}>Mật khẩu</Title>
			<div
				style={{
					background: token.colorBgElevated,
					borderRadius: 8,
					padding: 16,
					marginBottom: 24,
				}}
			>
				<SettingItem title="Đổi mật khẩu" description="Cập nhật mật khẩu của bạn để bảo vệ tài khoản">
					<Button type="primary" ghost onClick={onEditProfile}>
						Đổi mật khẩu
					</Button>
				</SettingItem>
			</div>

			{/* Face Registration */}
			<Title level={5} style={{ marginBottom: 16 }}>Xác thực khuôn mặt</Title>
			<div
				style={{
					background: token.colorBgElevated,
					borderRadius: 8,
					padding: 16,
				}}
			>
				<Paragraph type="secondary" style={{ marginBottom: 16 }}>
					Sử dụng khuôn mặt để xác thực danh tính khi làm bài kiểm tra.
				</Paragraph>
				{statusLoading ? (
					<div style={{ textAlign: 'center', padding: 16 }}>
						<Spin />
					</div>
				) : registrationStatus?.registered ? (
					<Space direction="vertical" style={{ width: '100%' }}>
						<Alert
							message="Đã đăng ký khuôn mặt"
							description="Bạn có thể sử dụng tính năng xác thực khuôn mặt cho các bài kiểm tra."
							type="success"
							showIcon
							icon={<CheckCircleOutlined />}
						/>
						<Button
							danger
							icon={<DeleteOutlined />}
							onClick={handleDeleteFace}
							loading={deleteFaceMutation.isPending}
						>
							Xóa dữ liệu khuôn mặt
						</Button>
					</Space>
				) : (
					<Space direction="vertical" style={{ width: '100%' }}>
						<Alert
							message="Chưa đăng ký khuôn mặt"
							description="Đăng ký khuôn mặt để sử dụng tính năng xác thực trong các bài kiểm tra."
							type="info"
							showIcon
						/>
						<Button
							type="primary"
							icon={<CameraOutlined />}
							onClick={() => {
								setRegisterModalOpen(true);
								setTimeout(startCamera, 100);
							}}
						>
							Đăng ký khuôn mặt
						</Button>
					</Space>
				)}
			</div>

			{/* Face Registration Modal */}
			<Modal
				title="Đăng ký khuôn mặt"
				open={registerModalOpen}
				onCancel={() => {
					setRegisterModalOpen(false);
					stopCamera();
				}}
				footer={[
					<Button key="cancel" onClick={() => {
						setRegisterModalOpen(false);
						stopCamera();
					}}>
						Hủy
					</Button>,
					<Button
						key="register"
						type="primary"
						icon={<CameraOutlined />}
						onClick={handleRegisterFace}
						loading={registering}
						disabled={!cameraReady}
					>
						Đăng ký
					</Button>,
				]}
				width={600}
				maskClosable={false}
			>
				<Space direction="vertical" style={{ width: '100%' }} size="large">
					<Alert
						message="Hướng dẫn"
						description="Đặt khuôn mặt vào khung hình, đảm bảo ánh sáng tốt và nhìn thẳng vào camera."
						type="info"
						showIcon
					/>
					<div style={{ textAlign: 'center' }}>
						<video
							ref={videoRef}
							autoPlay
							playsInline
							muted
							style={{
								width: '100%',
								maxWidth: '480px',
								borderRadius: '8px',
								border: '2px solid #d9d9d9',
								transform: 'scaleX(-1)',
							}}
						/>
						{!cameraReady && (
							<div style={{ marginTop: 16 }}>
								<Spin />
								<div style={{ marginTop: 8 }}>
									<Text type="secondary">Đang khởi động camera...</Text>
								</div>
							</div>
						)}
					</div>
				</Space>
			</Modal>
		</div>
	);
};

const NotificationsSection: React.FC = () => {
	const { token } = useThemeToken();
	const [settings, setSettings] = useState({
		enableNotifications: true,
		emailNotifications: true,
		pushNotifications: true,
		assessmentReminders: true,
		gradeNotifications: true,
		systemUpdates: false,
	});

	return (
		<div>
			<Paragraph type="secondary" style={{ marginBottom: 24 }}>
				Chọn loại thông báo bạn muốn nhận.
			</Paragraph>

			<Title level={5}>Thông báo chung</Title>
			<div
				style={{
					background: token.colorBgElevated,
					borderRadius: 8,
					padding: 16,
					marginBottom: 24,
				}}
			>
				<SettingItem
					title="Bật thông báo"
					description="Nhận tất cả thông báo từ ứng dụng"
				>
					<Switch
						checked={settings.enableNotifications}
						onChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
					/>
				</SettingItem>
				<SettingItem
					title="Thông báo qua Email"
					description="Nhận thông báo qua email"
				>
					<Switch
						checked={settings.emailNotifications}
						onChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
					/>
				</SettingItem>
				<SettingItem
					title="Thông báo đẩy"
					description="Nhận thông báo đẩy trên trình duyệt"
				>
					<Switch
						checked={settings.pushNotifications}
						onChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
					/>
				</SettingItem>
			</div>

			<Title level={5}>Loại thông báo</Title>
			<div
				style={{
					background: token.colorBgElevated,
					borderRadius: 8,
					padding: 16,
				}}
			>
				<SettingItem
					title="Nhắc nhở bài kiểm tra"
					description="Thông báo khi có bài kiểm tra sắp diễn ra"
				>
					<Switch
						checked={settings.assessmentReminders}
						onChange={(checked) => setSettings({ ...settings, assessmentReminders: checked })}
					/>
				</SettingItem>
				<SettingItem
					title="Thông báo điểm số"
					description="Thông báo khi có điểm mới"
				>
					<Switch
						checked={settings.gradeNotifications}
						onChange={(checked) => setSettings({ ...settings, gradeNotifications: checked })}
					/>
				</SettingItem>
				<SettingItem
					title="Cập nhật hệ thống"
					description="Thông báo về các cập nhật và bảo trì"
				>
					<Switch
						checked={settings.systemUpdates}
						onChange={(checked) => setSettings({ ...settings, systemUpdates: checked })}
					/>
				</SettingItem>
			</div>
		</div>
	);
};

interface AppearanceSectionProps {
	mode: ThemeMode;
	setMode: (mode: ThemeMode) => void;
	toggleDark: () => void;
}

const AppearanceSection: React.FC<AppearanceSectionProps> = ({ mode, setMode, toggleDark }) => {
	const { token } = useThemeToken();

	const themes: Array<{ key: ThemeMode; icon: React.ReactNode; label: string; bg: string; color: string }> = [
		{ key: 'light', icon: <SunOutlined />, label: 'Sáng', bg: '#ffffff', color: '#333333' },
		{ key: 'dark', icon: <MoonOutlined />, label: 'Tối', bg: '#1a1a1a', color: '#ffffff' },
		{ key: 'highContrast', icon: <EyeOutlined />, label: 'Tương phản cao', bg: '#000000', color: '#ffff00' },
	];

	return (
		<div>
			<Paragraph type="secondary" style={{ marginBottom: 24 }}>
				Tùy chỉnh giao diện ứng dụng theo sở thích của bạn.
			</Paragraph>

			<Title level={5}>Chủ đề</Title>
			<div
				style={{
					display: 'flex',
					gap: 16,
					marginBottom: 24,
				}}
			>
				{themes.map((theme) => (
					<div
						key={theme.key}
						onClick={() => setMode(theme.key)}
						style={{
							flex: 1,
							padding: 16,
							borderRadius: 8,
							border: `2px solid ${mode === theme.key ? token.colorPrimary : token.colorBorder}`,
							background: theme.bg,
							cursor: 'pointer',
							textAlign: 'center',
							transition: 'all 0.2s',
						}}
					>
						<div
							style={{
								fontSize: 32,
								marginBottom: 8,
								color: theme.color,
							}}
						>
							{theme.icon}
						</div>
						<Text style={{ color: theme.color }}>
							{theme.label}
						</Text>
					</div>
				))}
			</div>

			<div
				style={{
					background: token.colorBgElevated,
					borderRadius: 8,
					padding: 16,
				}}
			>
				<SettingItem
					title="Chế độ tối"
					description="Bật hoặc tắt chế độ tối"
				>
					<Switch
						checked={mode === 'dark'}
						onChange={toggleDark}
						checkedChildren={<MoonOutlined />}
						unCheckedChildren={<SunOutlined />}
					/>
				</SettingItem>
			</div>
		</div>
	);
};

const AccessibilitySection: React.FC = () => {
	const { token } = useThemeToken();
	const [settings, setSettings] = useState({
		reduceMotion: false,
		highContrast: false,
		largeText: false,
	});

	return (
		<div>
			<Paragraph type="secondary" style={{ marginBottom: 24 }}>
				Tùy chọn trợ năng để cải thiện trải nghiệm sử dụng.
			</Paragraph>

			<div
				style={{
					background: token.colorBgElevated,
					borderRadius: 8,
					padding: 16,
				}}
			>
				<SettingItem
					title="Giảm chuyển động"
					description="Giảm hiệu ứng animation trong ứng dụng"
				>
					<Switch
						checked={settings.reduceMotion}
						onChange={(checked) => setSettings({ ...settings, reduceMotion: checked })}
					/>
				</SettingItem>
				<SettingItem
					title="Độ tương phản cao"
					description="Tăng độ tương phản cho các phần tử"
				>
					<Switch
						checked={settings.highContrast}
						onChange={(checked) => setSettings({ ...settings, highContrast: checked })}
					/>
				</SettingItem>
				<SettingItem
					title="Chữ lớn hơn"
					description="Tăng kích thước văn bản"
				>
					<Switch
						checked={settings.largeText}
						onChange={(checked) => setSettings({ ...settings, largeText: checked })}
					/>
				</SettingItem>
			</div>
		</div>
	);
};

const LanguageSection: React.FC = () => {
	const { token } = useThemeToken();

	const languages = [
		{ key: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
		{ key: 'en', label: 'English', flag: '🇺🇸' },
	];

	const [selectedLang, setSelectedLang] = useState('vi');

	return (
		<div>
			<Paragraph type="secondary" style={{ marginBottom: 24 }}>
				Chọn ngôn ngữ hiển thị cho ứng dụng.
			</Paragraph>

			<div
				style={{
					background: token.colorBgElevated,
					borderRadius: 8,
					overflow: 'hidden',
				}}
			>
				{languages.map((lang) => (
					<div
						key={lang.key}
						onClick={() => setSelectedLang(lang.key)}
						style={{
							padding: '16px',
							display: 'flex',
							alignItems: 'center',
							gap: 12,
							cursor: 'pointer',
							borderBottom: `1px solid ${token.colorBorderSecondary}`,
							background: selectedLang === lang.key ? token.colorPrimaryBg : 'transparent',
						}}
					>
						<span style={{ fontSize: 24 }}>{lang.flag}</span>
						<Text strong={selectedLang === lang.key}>{lang.label}</Text>
						{selectedLang === lang.key && (
							<Text type="success" style={{ marginLeft: 'auto' }}>
								✓
							</Text>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

const AboutSection: React.FC = () => {
	const { token } = useThemeToken();

	return (
		<div>
			<div
				style={{
					textAlign: 'center',
					marginBottom: 32,
				}}
			>
				<div style={{ fontSize: 64, marginBottom: 16 }}>🎓</div>
				<Title level={3} style={{ margin: 0 }}>
					SAP - Secure Assessment Platform
				</Title>
				<Text type="secondary">Phiên bản 1.0.0</Text>
			</div>

			<div
				style={{
					background: token.colorBgElevated,
					borderRadius: 8,
					padding: 16,
				}}
			>
				<SettingItem title="Phiên bản" description="1.0.0">
					<Button size="small">Kiểm tra cập nhật</Button>
				</SettingItem>
				<SettingItem title="Điều khoản dịch vụ" description="Xem điều khoản sử dụng">
					<Button size="small" type="link">
						Xem
					</Button>
				</SettingItem>
				<SettingItem title="Chính sách bảo mật" description="Xem chính sách bảo mật">
					<Button size="small" type="link">
						Xem
					</Button>
				</SettingItem>
			</div>

			<div style={{ textAlign: 'center', marginTop: 32 }}>
				<Text type="secondary">© 2025 SAP Team. All rights reserved.</Text>
			</div>
		</div>
	);
};

export default SettingsModal;
