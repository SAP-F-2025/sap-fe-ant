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
import { useTranslation } from 'react-i18next';
import { CasdoorConfig } from '../../config/casdoor';
import { useAuth } from '../../hooks/useAuth';
import { changeLanguage, getCurrentLanguage, supportedLanguages, type SupportedLanguage } from '../../i18n';
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
	const { t } = useTranslation();
	const [activeSection, setActiveSection] = useState<SettingsSection>(defaultSection);
	const [searchQuery, setSearchQuery] = useState('');
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [blinkRed, setBlinkRed] = useState(false);
	const [shortcutContext, setShortcutContext] = useState<string | undefined>();

	const sections: SettingsSection[] = ['my-account', 'profile', 'security', 'notifications', 'appearance', 'accessibility', 'language', 'about'];

	// Reset to default section when modal opens
	useEffect(() => {
		if (open) {
			setActiveSection(defaultSection);
			setSearchQuery('');
		}
	}, [open, defaultSection]);

	// Handle ESC and Ctrl+, to close
	useEffect(() => {
		const handleClose = (e: KeyboardEvent) => {
			if (!open) return;
			if (e.key === 'Escape' || (e.ctrlKey && e.key === ',')) {
				if (hasUnsavedChanges) {
					setBlinkRed(true);
					setTimeout(() => setBlinkRed(false), 300);
					return;
				}
				e.preventDefault();
				onClose();
			}
		};
		window.addEventListener('keydown', handleClose);
		return () => window.removeEventListener('keydown', handleClose);
	}, [open, onClose, hasUnsavedChanges]);

	// Menu items for sidebar
	const menuItems: MenuProps['items'] = [
		{
			key: 'user-settings',
			type: 'group',
			label: <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{t('settings.userSettings')}</Text>,
			children: [
				{
					key: 'my-account',
					icon: <UserOutlined />,
					label: t('settings.account'),
				},
				{
					key: 'profile',
					icon: <UserOutlined />,
					label: t('settings.profile'),
				},
				{
					key: 'security',
					icon: <SafetyOutlined />,
					label: t('settings.securityAuth'),
				},
			],
		},
		{
			key: 'app-settings',
			type: 'group',
			label: <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{t('settings.appSettings')}</Text>,
			children: [
				{
					key: 'notifications',
					icon: <BellOutlined />,
					label: t('settings.notifications'),
				},
				{
					key: 'appearance',
					icon: <BgColorsOutlined />,
					label: t('settings.appearance'),
				},
				{
					key: 'accessibility',
					icon: <EyeOutlined />,
					label: t('settings.accessibility'),
				},
				{
					key: 'language',
					icon: <GlobalOutlined />,
					label: t('settings.language'),
				},
			],
		},
		{
			type: 'divider',
		},
		{
			key: 'about',
			icon: <InfoCircleOutlined />,
			label: t('settings.about'),
		},
		{
			type: 'divider',
		},
		{
			key: 'logout',
			icon: <CloseOutlined />,
			label: <Text type="danger">{t('auth.logout')}</Text>,
			danger: true,
		},
	];

	const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
		if (hasUnsavedChanges) {
			setBlinkRed(true);
			setTimeout(() => setBlinkRed(false), 300);
			return;
		}
		if (key === 'logout') {
			logout();
			onClose();
		} else {
			setActiveSection(key as SettingsSection);
		}
	};

	const handleClose = () => {
		if (hasUnsavedChanges) {
			setBlinkRed(true);
			setTimeout(() => setBlinkRed(false), 300);
			return;
		}
		onClose();
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

	useEffect(() => {
		if (!open) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			// Allow Ctrl+Backspace and Ctrl+Enter to pass through for notifications section
			if (e.ctrlKey && (e.key === 'Backspace' || e.key === 'Enter')) return;

			if (hasUnsavedChanges && (e.altKey || e.shiftKey)) return;

			// Alt+Arrow: Navigate between tabs
			if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
				e.preventDefault();
				const currentIndex = sections.indexOf(activeSection);
				const nextIndex = e.key === 'ArrowDown'
					? (currentIndex + 1) % sections.length
					: (currentIndex - 1 + sections.length) % sections.length;
				setActiveSection(sections[nextIndex]);
			}

			// Shift+Arrow: Navigate within tab
			if (e.shiftKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
				e.preventDefault();
				const contentArea = document.querySelector('.settings-content-area');
				if (!contentArea) return;
				const focusableElements = contentArea.querySelectorAll(
					'button:not([disabled]), [role="switch"]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
				);
				const elements = Array.from(focusableElements).filter(el => {
					const rect = el.getBoundingClientRect();
					return rect.width > 0 && rect.height > 0;
				});
				if (elements.length === 0) return;
				const currentIndex = elements.indexOf(document.activeElement as Element);
				const nextIndex = e.key === 'ArrowDown'
					? currentIndex === -1 ? 0 : (currentIndex + 1) % elements.length
					: currentIndex === -1 ? elements.length - 1 : (currentIndex - 1 + elements.length) % elements.length;
				(elements[nextIndex] as HTMLElement).focus();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [open, activeSection, sections, hasUnsavedChanges]);

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
				return <NotificationsSection onChangesStateChange={setHasUnsavedChanges} blinkRed={blinkRed} />;
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
		'my-account': t('settings.myAccount'),
		'profile': t('settings.profile'),
		'security': t('settings.securityAuth'),
		'notifications': t('settings.notifications'),
		'appearance': t('settings.appearance'),
		'accessibility': t('settings.accessibility'),
		'language': t('settings.language'),
		'about': t('settings.about'),
	};

	return (
		<Modal
			open={open}
			onCancel={handleClose}
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
							placeholder={t('settings.search')}
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
							onClick={handleClose}
							style={{ fontSize: 18 }}
						/>
					</div>

					{/* Content */}
					<div
						className="settings-content-area"
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
						<style>{`
							.settings-content-area *:focus {
								outline: 2px solid ${token.colorPrimary} !important;
								outline-offset: 2px !important;
								box-shadow: 0 0 0 4px ${token.colorPrimary}20 !important;
							}
						`}</style>
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
	const { t } = useTranslation();

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
						{t('settings.editProfile')}
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
				<SettingItem title={t('settings.displayName')} description={user?.displayName || user?.name || '-'}>
					<Button size="small" onClick={onEditProfile}>{t('common.edit')}</Button>
				</SettingItem>
				<SettingItem title={t('settings.username')} description={user?.name || '-'}>
					<Button size="small" onClick={onEditProfile}>{t('common.edit')}</Button>
				</SettingItem>
				<SettingItem title={t('settings.email')} description={user?.email || '-'}>
					<Button size="small" onClick={onEditProfile}>{t('common.edit')}</Button>
				</SettingItem>
				<SettingItem title={t('settings.phone')} description={user?.phone || t('settings.notAdded')} noBorder>
					<Button size="small" onClick={onEditProfile}>{t('common.edit')}</Button>
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
	const { t } = useTranslation();

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
				{t('settings.publicProfileInfo')}
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
				<SettingItem title={t('settings.avatar')} description={t('settings.yourAvatar')}>
					<Avatar size={64} src={user?.avatar} icon={<UserOutlined />} />
				</SettingItem>
				<SettingItem title={t('settings.role')} noBorder>
					<Space>
						{userRole === 'admin' && (
							<Tag color="red" icon={<SafetyOutlined />}>Admin</Tag>
						)}
						{userRole === 'teacher' && (
							<Tag color="blue">{t('user.role.teacher')}</Tag>
						)}
						{userRole === 'student' && (
							<Tag color="green">{t('user.role.student')}</Tag>
						)}
					</Space>
				</SettingItem>
			</div>

			{/* Detailed Info */}
			<Title level={5} style={{ marginBottom: 16 }}>{t('settings.detailedInfo')}</Title>
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
						<Descriptions.Item label={t('settings.school')}>{(user as any).education}</Descriptions.Item>
					)}
					{user?.owner && (
						<Descriptions.Item label={t('settings.organization')}>{user.owner}</Descriptions.Item>
					)}
					{user?.createdTime && (
						<Descriptions.Item label={<><ClockCircleOutlined /> {t('settings.createdDate')}</>}>
							{formatDate(user.createdTime)}
						</Descriptions.Item>
					)}
				</Descriptions>
			</div>

			{/* Roles & Permissions */}
			{(user?.roles?.length > 0 || user?.permissions?.length > 0) && (
				<>
					<Title level={5} style={{ marginBottom: 16 }}>{t('settings.rolesPermissions')}</Title>
					<div
						style={{
							background: token.colorBgElevated,
							borderRadius: 8,
							padding: 16,
						}}
					>
						{user?.roles?.length > 0 && (
							<div style={{ marginBottom: user?.permissions?.length ? 16 : 0 }}>
								<Text strong style={{ display: 'block', marginBottom: 8 }}>{t('settings.roles')}:</Text>
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
								<Text strong style={{ display: 'block', marginBottom: 8 }}>{t('settings.permissions')}:</Text>
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
	const { t } = useTranslation();

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
			message.success(t('settings.faceDeleted'));
			queryClient.invalidateQueries({ queryKey: ['face-registration-status'] });
		},
		onError: (error: any) => {
			message.error(error.response?.data?.detail || t('settings.faceDeleteError'));
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
			message.error(t('settings.cameraAccessError'));
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
			message.success(t('settings.faceRegisteredSuccess'));
			setRegisterModalOpen(false);
			stopCamera();
			queryClient.invalidateQueries({ queryKey: ['face-registration-status'] });
		} catch (err: any) {
			message.error(err.response?.data?.detail || t('settings.faceRegisterError'));
		} finally {
			setRegistering(false);
		}
	};

	const handleDeleteFace = () => {
		modal.confirm({
			title: t('settings.deleteFaceConfirm'),
			content: t('settings.deleteFaceConfirmDesc'),
			okText: t('common.delete'),
			okType: 'danger',
			cancelText: t('common.cancel'),
			onOk: () => deleteFaceMutation.mutate(),
		});
	};

	return (
		<div>
			<Paragraph type="secondary" style={{ marginBottom: 24 }}>
				{t('settings.manageSecurityAuth')}
			</Paragraph>

			{/* Password Section */}
			<Title level={5} style={{ marginBottom: 16 }}>{t('settings.password')}</Title>
			<div
				style={{
					background: token.colorBgElevated,
					borderRadius: 8,
					padding: 16,
					marginBottom: 24,
				}}
			>
				<SettingItem title={t('settings.changePassword')} description={t('settings.updatePasswordDesc')} noBorder>
					<Button type="primary" ghost onClick={onEditProfile}>
						{t('settings.changePassword')}
					</Button>
				</SettingItem>
			</div>

			{/* Face Registration */}
			<Title level={5} style={{ marginBottom: 16 }}>{t('settings.faceAuth')}</Title>
			<div
				style={{
					background: token.colorBgElevated,
					borderRadius: 8,
					padding: 16,
				}}
			>
				<Paragraph type="secondary" style={{ marginBottom: 16 }}>
					{t('settings.useFaceAuthDesc')}
				</Paragraph>
				{statusLoading ? (
					<div style={{ textAlign: 'center', padding: 16 }}>
						<Spin />
					</div>
				) : registrationStatus?.registered ? (
					<Space direction="vertical" style={{ width: '100%' }}>
						<Alert
							message={t('settings.faceRegistered')}
							description={t('settings.faceRegisteredDesc')}
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
							{t('settings.deleteFaceData')}
						</Button>
					</Space>
				) : (
					<Space direction="vertical" style={{ width: '100%' }}>
						<Alert
							message={t('settings.faceNotRegistered')}
							description={t('settings.faceNotRegisteredDesc')}
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
							{t('settings.registerFace')}
						</Button>
					</Space>
				)}
			</div>

			{/* Face Registration Modal */}
			<Modal
				title={t('settings.registerFaceTitle')}
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
						{t('common.cancel')}
					</Button>,
					<Button
						key="register"
						type="primary"
						icon={<CameraOutlined />}
						onClick={handleRegisterFace}
						loading={registering}
						disabled={!cameraReady}
					>
						{t('settings.register')}
					</Button>,
				]}
				width={600}
				maskClosable={false}
			>
				<Space direction="vertical" style={{ width: '100%' }} size="large">
					<Alert
						message={t('settings.instructions')}
						description={t('settings.faceInstructions')}
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
									<Text type="secondary">{t('settings.startingCamera')}</Text>
								</div>
							</div>
						)}
					</div>
				</Space>
			</Modal>
		</div>
	);
};

interface NotificationsSectionProps {
	onChangesStateChange: (hasChanges: boolean) => void;
	blinkRed: boolean;
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({ onChangesStateChange, blinkRed }) => {
	const { token } = useThemeToken();
	const { t } = useTranslation();
	const [enableNotifications, setEnableNotifications] = useState(true);
	const [settings, setSettings] = useState({
		assessmentAssigned: { enabled: true, email: true, push: true },
		assessmentReminders: { enabled: true, email: true, push: true },
		gradeNotifications: { enabled: true, email: true, push: true },
		comments: { enabled: true, email: false, push: true },
		systemUpdates: { enabled: false, email: false, push: false },
	});
	const [originalSettings, setOriginalSettings] = useState({ enableNotifications, settings });
	const [hasChanges, setHasChanges] = useState(false);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const changed = JSON.stringify({ enableNotifications, settings }) !== JSON.stringify(originalSettings);
		setHasChanges(changed);
		onChangesStateChange(changed);
	}, [enableNotifications, settings, originalSettings, onChangesStateChange]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!hasChanges) return;
			if (e.ctrlKey && e.key === 'Enter') {
				e.preventDefault();
				handleSave();
			} else if (e.ctrlKey && e.key === 'Backspace') {
				e.preventDefault();
				handleReset();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [hasChanges]);

	const handleSave = async () => {
		setSaving(true);
		try {
			// TODO: API call to save notification settings
			// await notificationService.updateSettings({ enableNotifications, ...settings });
			await new Promise(resolve => setTimeout(resolve, 500));
			setOriginalSettings({ enableNotifications, settings });
			setHasChanges(false);
		} finally {
			setSaving(false);
		}
	};

	const handleReset = () => {
		setEnableNotifications(originalSettings.enableNotifications);
		setSettings(originalSettings.settings);
		setHasChanges(false);
	};

	return (
		<div>
			<Paragraph type="secondary" style={{ marginBottom: 24 }}>
				{t('settings.chooseNotifications')}
			</Paragraph>

			<Title level={5}>{t('settings.generalNotifications')}</Title>
			<div
				style={{
					background: token.colorBgElevated,
					borderRadius: 8,
					padding: 16,
					marginBottom: 24,
				}}
			>
				<SettingItem
					title={t('notification.enableNotifications')}
					description={t('notification.enableNotificationsDesc')}
					noBorder
				>
					<Switch
						checked={enableNotifications}
						onChange={setEnableNotifications}
					/>
				</SettingItem>
			</div>

			<div
				style={{
					maxHeight: enableNotifications ? '1000px' : '0',
					opacity: enableNotifications ? 1 : 0,
					overflow: 'hidden',
					transition: 'max-height 0.3s ease, opacity 0.3s ease',
				}}
			>
				<Title level={5}>{t('settings.notificationTypes')}</Title>
				<div
					style={{
						background: token.colorBgElevated,
						borderRadius: 8,
						padding: 16,
					}}
				>
					{/* Assessment Assigned */}
					<div style={{ paddingBottom: 12, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
							<div style={{ flex: 1 }}>
								<Text strong style={{ display: 'block', marginBottom: 4 }}>{t('notification.assessmentAssigned')}</Text>
								<Text type="secondary" style={{ fontSize: 13 }}>
									{t('notification.assessmentAssignedDesc')}
								</Text>
							</div>
							<Switch
								checked={settings.assessmentAssigned.enabled}
								onChange={(checked) => setSettings({ ...settings, assessmentAssigned: { ...settings.assessmentAssigned, enabled: checked } })}
								disabled={!enableNotifications}
							/>
						</div>
						<div style={{ maxHeight: settings.assessmentAssigned.enabled ? '100px' : '0', opacity: settings.assessmentAssigned.enabled ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease, opacity 0.3s ease' }}>
							<Space size="middle" style={{ marginTop: 8 }}>
								<Space size="small">
									<Text>Email</Text>
									<Switch size="small" checked={settings.assessmentAssigned.email} onChange={(checked) => setSettings({ ...settings, assessmentAssigned: { ...settings.assessmentAssigned, email: checked } })} disabled={!enableNotifications || !settings.assessmentAssigned.enabled} />
								</Space>
								<Space size="small">
									<Text>Push</Text>
									<Switch size="small" checked={settings.assessmentAssigned.push} onChange={(checked) => setSettings({ ...settings, assessmentAssigned: { ...settings.assessmentAssigned, push: checked } })} disabled={!enableNotifications || !settings.assessmentAssigned.enabled} />
								</Space>
							</Space>
						</div>
					</div>

					{/* Assessment Reminders */}
					<div style={{ paddingTop: 12, paddingBottom: 12, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
							<div style={{ flex: 1 }}>
								<Text strong style={{ display: 'block', marginBottom: 4 }}>{t('notification.assessmentReminders')}</Text>
								<Text type="secondary" style={{ fontSize: 13 }}>
									{t('notification.assessmentRemindersDesc')}
								</Text>
							</div>
							<Switch
								checked={settings.assessmentReminders.enabled}
								onChange={(checked) => setSettings({ ...settings, assessmentReminders: { ...settings.assessmentReminders, enabled: checked } })}
								disabled={!enableNotifications}
							/>
						</div>
						<div style={{ maxHeight: settings.assessmentReminders.enabled ? '100px' : '0', opacity: settings.assessmentReminders.enabled ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease, opacity 0.3s ease' }}>
							<Space size="middle" style={{ marginTop: 8 }}>
								<Space size="small">
									<Text>Email</Text>
									<Switch size="small" checked={settings.assessmentReminders.email} onChange={(checked) => setSettings({ ...settings, assessmentReminders: { ...settings.assessmentReminders, email: checked } })} disabled={!enableNotifications || !settings.assessmentReminders.enabled} />
								</Space>
								<Space size="small">
									<Text>Push</Text>
									<Switch size="small" checked={settings.assessmentReminders.push} onChange={(checked) => setSettings({ ...settings, assessmentReminders: { ...settings.assessmentReminders, push: checked } })} disabled={!enableNotifications || !settings.assessmentReminders.enabled} />
								</Space>
							</Space>
						</div>
					</div>

					{/* Grade Notifications */}
					<div style={{ paddingTop: 12, paddingBottom: 12, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
							<div style={{ flex: 1 }}>
								<Text strong style={{ display: 'block', marginBottom: 4 }}>{t('notification.gradeNotifications')}</Text>
								<Text type="secondary" style={{ fontSize: 13 }}>
									{t('notification.gradeNotificationsDesc')}
								</Text>
							</div>
							<Switch
								checked={settings.gradeNotifications.enabled}
								onChange={(checked) => setSettings({ ...settings, gradeNotifications: { ...settings.gradeNotifications, enabled: checked } })}
								disabled={!enableNotifications}
							/>
						</div>
						<div style={{ maxHeight: settings.gradeNotifications.enabled ? '100px' : '0', opacity: settings.gradeNotifications.enabled ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease, opacity 0.3s ease' }}>
							<Space size="middle" style={{ marginTop: 8 }}>
								<Space size="small">
									<Text>Email</Text>
									<Switch size="small" checked={settings.gradeNotifications.email} onChange={(checked) => setSettings({ ...settings, gradeNotifications: { ...settings.gradeNotifications, email: checked } })} disabled={!enableNotifications || !settings.gradeNotifications.enabled} />
								</Space>
								<Space size="small">
									<Text>Push</Text>
									<Switch size="small" checked={settings.gradeNotifications.push} onChange={(checked) => setSettings({ ...settings, gradeNotifications: { ...settings.gradeNotifications, push: checked } })} disabled={!enableNotifications || !settings.gradeNotifications.enabled} />
								</Space>
							</Space>
						</div>
					</div>

					{/* Comments */}
					<div style={{ paddingTop: 12, paddingBottom: 12, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
							<div style={{ flex: 1 }}>
								<Text strong style={{ display: 'block', marginBottom: 4 }}>{t('notification.comments')}</Text>
								<Text type="secondary" style={{ fontSize: 13 }}>
									{t('notification.commentsDesc')}
								</Text>
							</div>
							<Switch
								checked={settings.comments.enabled}
								onChange={(checked) => setSettings({ ...settings, comments: { ...settings.comments, enabled: checked } })}
								disabled={!enableNotifications}
							/>
						</div>
						<div style={{ maxHeight: settings.comments.enabled ? '100px' : '0', opacity: settings.comments.enabled ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease, opacity 0.3s ease' }}>
							<Space size="middle" style={{ marginTop: 8 }}>
								<Space size="small">
									<Text>Email</Text>
									<Switch size="small" checked={settings.comments.email} onChange={(checked) => setSettings({ ...settings, comments: { ...settings.comments, email: checked } })} disabled={!enableNotifications || !settings.comments.enabled} />
								</Space>
								<Space size="small">
									<Text>Push</Text>
									<Switch size="small" checked={settings.comments.push} onChange={(checked) => setSettings({ ...settings, comments: { ...settings.comments, push: checked } })} disabled={!enableNotifications || !settings.comments.enabled} />
								</Space>
							</Space>
						</div>
					</div>

					{/* System Updates */}
					<div style={{ paddingTop: 12 }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
							<div style={{ flex: 1 }}>
								<Text strong style={{ display: 'block', marginBottom: 4 }}>{t('notification.systemUpdates')}</Text>
								<Text type="secondary" style={{ fontSize: 13 }}>
									{t('notification.systemUpdatesDesc')}
								</Text>
							</div>
							<Switch
								checked={settings.systemUpdates.enabled}
								onChange={(checked) => setSettings({ ...settings, systemUpdates: { ...settings.systemUpdates, enabled: checked } })}
								disabled={!enableNotifications}
							/>
						</div>
						<div style={{ maxHeight: settings.systemUpdates.enabled ? '100px' : '0', opacity: settings.systemUpdates.enabled ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease, opacity 0.3s ease' }}>
							<Space size="middle" style={{ marginTop: 8 }}>
								<Space size="small">
									<Text>Email</Text>
									<Switch size="small" checked={settings.systemUpdates.email} onChange={(checked) => setSettings({ ...settings, systemUpdates: { ...settings.systemUpdates, email: checked } })} disabled={!enableNotifications || !settings.systemUpdates.enabled} />
								</Space>
								<Space size="small">
									<Text>Push</Text>
									<Switch size="small" checked={settings.systemUpdates.push} onChange={(checked) => setSettings({ ...settings, systemUpdates: { ...settings.systemUpdates, push: checked } })} disabled={!enableNotifications || !settings.systemUpdates.enabled} />
								</Space>
							</Space>
						</div>
					</div>
				</div>
			</div>

			{hasChanges && (
				<div
					style={{
						position: 'fixed',
						bottom: 24,
						left: '50%',
						transform: 'translateX(-50%)',
						background: blinkRed ? 'rgba(255, 77, 79, 0.95)' : token.colorBgElevated,
						border: `1px solid ${blinkRed ? '#ff4d4f' : token.colorBorder}`,
						borderRadius: 8,
						padding: '14px 20px',
						boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
						zIndex: 1000,
						display: 'flex',
						alignItems: 'center',
						gap: 16,
						animation: blinkRed ? 'shake 0.3s ease' : 'none',
						transition: 'all 0.3s ease',
					}}
				>
					<Text style={{ color: blinkRed ? '#fff' : undefined, fontSize: 14 }}>{t('notification.unsavedChanges')}</Text>
					<Space size="middle">
						<Button onClick={handleReset}>{t('common.cancel')}</Button>
						<Button type="primary" onClick={handleSave} loading={saving}>
							{t('notification.saveChanges')}
						</Button>
					</Space>
				</div>
			)}
			<style>{`
				@keyframes shake {
					0%, 100% { transform: translateX(-50%) translateY(0); }
					10%, 30%, 50%, 70%, 90% { transform: translateX(-50%) translateY(-4px) scale(1.05); }
					20%, 40%, 60%, 80% { transform: translateX(-50%) translateY(4px) scale(1.05); }
				}
			`}</style>
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
	const { t } = useTranslation();

	const themes: Array<{ key: ThemeMode; icon: React.ReactNode; label: string; bg: string; color: string }> = [
		{ key: 'light', icon: <SunOutlined />, label: t('settings.light'), bg: '#ffffff', color: '#333333' },
		{ key: 'dark', icon: <MoonOutlined />, label: t('settings.dark'), bg: '#1a1a1a', color: '#ffffff' },
		{ key: 'highContrast', icon: <EyeOutlined />, label: t('settings.highContrast'), bg: '#000000', color: '#ffff00' },
	];

	return (
		<div>
			<Paragraph type="secondary" style={{ marginBottom: 24 }}>
				{t('settings.customizeAppearance')}
			</Paragraph>

			<Title level={5}>{t('settings.theme')}</Title>
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
						onKeyDown={(e) => e.key === 'Enter' && setMode(theme.key)}
						tabIndex={0}
						role="button"
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
					title={t('settings.darkMode')}
					description={t('settings.darkModeDescription')}
					noBorder
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
	const { t } = useTranslation();
	const [settings, setSettings] = useState({
		reduceMotion: false,
		highContrast: false,
		largeText: false,
	});

	return (
		<div>
			<Paragraph type="secondary" style={{ marginBottom: 24 }}>
				{t('settings.accessibilityOptions')}
			</Paragraph>

			<div
				style={{
					background: token.colorBgElevated,
					borderRadius: 8,
					padding: 16,
				}}
			>
				<SettingItem
					title={t('settings.reduceMotion')}
					description={t('settings.reduceMotionDesc')}
				>
					<Switch
						checked={settings.reduceMotion}
						onChange={(checked) => setSettings({ ...settings, reduceMotion: checked })}
					/>
				</SettingItem>
				<SettingItem
					title={t('settings.highContrastMode')}
					description={t('settings.highContrastDesc')}
				>
					<Switch
						checked={settings.highContrast}
						onChange={(checked) => setSettings({ ...settings, highContrast: checked })}
					/>
				</SettingItem>
				<SettingItem
					title={t('settings.largerText')}
					description={t('settings.largerTextDesc')}
					noBorder
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
	const { t } = useTranslation();
	const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(getCurrentLanguage());

	const handleLanguageChange = (langCode: SupportedLanguage) => {
		setSelectedLang(langCode);
		changeLanguage(langCode);
	};

	return (
		<div>
			<Paragraph type="secondary" style={{ marginBottom: 24 }}>
				{t('settings.languageDescription')}
			</Paragraph>

			<div
				style={{
					background: token.colorBgElevated,
					borderRadius: 8,
					overflow: 'hidden',
				}}
			>
				{supportedLanguages.map((lang, index) => (
					<div
						key={lang.code}
						onClick={() => handleLanguageChange(lang.code)}
						onKeyDown={(e) => e.key === 'Enter' && handleLanguageChange(lang.code)}
						tabIndex={0}
						role="button"
						style={{
							padding: '16px',
							display: 'flex',
							alignItems: 'center',
							gap: 12,
							cursor: 'pointer',
							borderBottom: index < supportedLanguages.length - 1 ? `1px solid ${token.colorBorderSecondary}` : 'none',
							background: selectedLang === lang.code ? token.colorPrimaryBg : 'transparent',
						}}
					>
						<span style={{ fontSize: 24 }}>{lang.flag}</span>
						<Text strong={selectedLang === lang.code}>{lang.label}</Text>
						{selectedLang === lang.code && (
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
	const { t } = useTranslation();

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
					{t('settings.appName')}
				</Title>
				<Text type="secondary">{t('settings.version')} 1.0.0</Text>
			</div>

			<div
				style={{
					background: token.colorBgElevated,
					borderRadius: 8,
					padding: 16,
				}}
			>
				<SettingItem title={t('settings.version')} description="1.0.0">
					<Button size="small">{t('settings.checkUpdates')}</Button>
				</SettingItem>
				<SettingItem title={t('settings.termsOfService')} description={t('settings.viewTerms')}>
					<Button size="small" type="link">
						{t('common.view')}
					</Button>
				</SettingItem>
				<SettingItem title={t('settings.privacyPolicy')} description={t('settings.viewPrivacy')} noBorder>
					<Button size="small" type="link">
						{t('common.view')}
					</Button>
				</SettingItem>
			</div>

			<div style={{ textAlign: 'center', marginTop: 32 }}>
				<Text type="secondary">{t('settings.copyright')}</Text>
			</div>
		</div>
	);
};

export default SettingsModal;
