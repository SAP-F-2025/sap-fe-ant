import {
	BankOutlined,
	BookOutlined,
	CheckCircleOutlined,
	DashboardOutlined,
	FileTextOutlined,
	HistoryOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	MoonOutlined,
	QuestionCircleOutlined,
	SettingOutlined,
	SunOutlined,
	TeamOutlined,
	UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {
	Avatar,
	Button,
	Dropdown,
	Grid,
	Layout,
	Menu,
	Space,
	Switch
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { elevation } from '../../styles/elevation';
import { useTheme, useThemeToken } from '../../theme/ThemeProvider';
import { NotificationDropdown } from '../NotificationDropdown';
import { useSettingsModal } from '../SettingsModal';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

/**
 * Main Layout Component
 * Features:
 * - Responsive sidebar (collapsible)
 * - Dark mode toggle
 * - Active menu highlighting
 * - Breakpoint-aware behavior
 * - Token-based styling
 */

const MainLayout: React.FC = () => {
	const { t } = useTranslation();
	const [collapsed, setCollapsed] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const { token } = useThemeToken();
	const { mode, toggleDark, setMode } = useTheme();
	const screens = useBreakpoint();
	const { user, logout } = useAuth();
	const { openSettings } = useSettingsModal();

	// Auto-collapse on mobile
	React.useEffect(() => {
		if (screens.xs && !collapsed) {
			setCollapsed(true);
		}
	}, [screens.xs]);

	// Menu items - filter based on user role
	// Default to student if no role specified
	const isStudent = !user?.role && !user?.roles?.length
		? true
		: user?.role === 'student' || user?.roles?.includes('student');

	const menuItems: MenuProps['items'] = isStudent ? [
		// Student menu items
		{
			key: '/student/dashboard',
			icon: <DashboardOutlined />,
			label: t('layout.studentDashboard'),
		},
		{
			key: '/student/assessments',
			icon: <BookOutlined />,
			label: t('layout.assessments'),
		},
		{
			key: '/student/history',
			icon: <HistoryOutlined />,
			label: t('layout.history'),
		},
	] : [
		// Admin/Teacher menu items
		{
			key: '/dashboard',
			icon: <DashboardOutlined />,
			label: t('layout.overview'),
		},
		// Only show Users menu for admin
		...(user?.isAdmin ? [{
			key: '/users',
			icon: <TeamOutlined />,
			label: t('layout.users'),
		}] : []),
		{
			key: '/assessments',
			icon: <FileTextOutlined />,
			label: t('layout.manageAssessments'),
		},
		{
			key: '/questions',
			icon: <QuestionCircleOutlined />,
			label: t('layout.manageQuestions'),
		},
		{
			key: '/question-banks',
			icon: <BankOutlined />,
			label: t('layout.questionBanks'),
		},
		{
			key: '/grading',
			icon: <CheckCircleOutlined />,
			label: t('layout.grading'),
		},
	];

	// User dropdown menu handler
	const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
		if (key === 'logout') {
			logout();
		} else if (key === 'settings') {
			openSettings('my-account');
		} else if (key === 'profile') {
			openSettings('profile');
		} else if (key === 'notifications') {
			openSettings('notifications');
		}
	};

	// User dropdown menu
	const userMenuItems: MenuProps['items'] = [
		{
			key: 'profile',
			icon: <UserOutlined />,
			label: t('layout.profile'),
		},
		{
			key: 'settings',
			icon: <SettingOutlined />,
			label: t('layout.settings'),
		},
		{
			type: 'divider',
		},
		{
			key: 'theme',
			label: (
				<Space>
					<span>{t('layout.darkMode')}</span>
					<Switch
						checked={mode === 'dark'}
						onChange={toggleDark}
						checkedChildren={<MoonOutlined />}
						unCheckedChildren={<SunOutlined />}
					/>
				</Space>
			),
		},
		{
			type: 'divider',
		},
		{
			key: 'logout',
			label: t('layout.logout'),
			danger: true,
		},
	];

	const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
		navigate(key);
	};

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Ctrl+B: Toggle sidebar
			if (e.ctrlKey && e.key === 'b') {
				e.preventDefault();
				setCollapsed(prev => !prev);
			}

			// Alt+Arrow: Navigate menu items
			if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
				e.preventDefault();
				const flatMenuItems = menuItems.flatMap(item => {
					if (!item || typeof item !== 'object') return [];
					const menuItem = item as any;
					return menuItem.children ? menuItem.children.map((child: any) => child.key) : [menuItem.key];
				}).filter(key => key && key !== 'logout');
				const currentKey = getSelectedKey();
				const currentIndex = flatMenuItems.indexOf(currentKey);
				if (currentIndex === -1) return;
				const nextIndex = e.key === 'ArrowDown'
					? (currentIndex + 1) % flatMenuItems.length
					: (currentIndex - 1 + flatMenuItems.length) % flatMenuItems.length;
				navigate(flatMenuItems[nextIndex] as string);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [location.pathname, menuItems, navigate]);

	// Get selected menu key based on current path
	const getSelectedKey = () => {
		const path = location.pathname;
		// Student paths
		if (path.startsWith('/student/dashboard')) return '/student/dashboard';
		if (path.startsWith('/student/assessments')) return '/student/assessments';
		if (path.startsWith('/student/history')) return '/student/history';
		if (path.startsWith('/student/take')) return '/student/assessments';
		if (path.startsWith('/student/results')) return '/student/history';
		// Admin/Teacher paths
		if (path.startsWith('/users')) return '/users';
		if (path.startsWith('/assessments')) return '/assessments';
		if (path.startsWith('/questions')) return '/questions';
		if (path.startsWith('/question-banks')) return '/question-banks';
		if (path.startsWith('/grading')) return '/grading';
		return path;
	};

	// Calculate sider width based on collapsed state
	const siderWidth = collapsed ? 80 : 240;

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider
				trigger={null}
				collapsible
				collapsed={collapsed}
				breakpoint="lg"
				width={240}
				collapsedWidth={80}
				style={{
					overflow: 'auto',
					height: '100vh',
					position: 'fixed',
					left: 0,
					top: 0,
					bottom: 0,
					zIndex: 1000,
					background: token.colorBgContainer,
					borderRight: `1px solid ${token.colorBorderSecondary}`,
				}}
			>
				{/* Logo */}
				<div
					style={{
						height: 64,
						display: 'flex',
						alignItems: 'center',
						justifyContent: collapsed ? 'center' : 'flex-start',
						color: token.colorPrimary,
						fontSize: collapsed ? 24 : 18,
						fontWeight: 700,
						padding: `0 ${token.paddingLG}px`,
						borderBottom: `1px solid ${token.colorBorderSecondary}`,
						letterSpacing: '-0.5px',
					}}
				>
					{collapsed ? '🎓' : (
						<Space size={12}>
							<span style={{ fontSize: 24 }}>🎓</span>
							<span>SAP</span>
						</Space>
					)}
				</div>

				{/* Menu */}
				<Menu
					mode="inline"
					selectedKeys={[getSelectedKey()]}
					items={menuItems}
					onClick={handleMenuClick}
					style={{
						borderRight: 0,
						background: 'transparent',
						fontSize: 14,
						padding: '8px',
					}}
				/>
			</Sider>

			<Layout
				style={{
					marginLeft: siderWidth,
					transition: 'margin-left 0.2s',
					background: token.colorBgLayout,
				}}
			>
				{/* Header */}
				<Header
					style={{
						padding: `0 ${token.paddingLG}px`,
						background: token.colorBgContainer,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						borderBottom: `1px solid ${token.colorBorderSecondary}`,
						position: 'sticky',
						top: 0,
						zIndex: 999,
					}}
				>
					<Button
						type="text"
						icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
						onClick={() => setCollapsed(!collapsed)}
						style={{
							fontSize: 18,
							width: 48,
							height: 48,
						}}
					/>

					<Space size="middle">
						{/* Theme toggle */}
						<Button
							type="text"
							icon={mode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
							onClick={toggleDark}
							style={{
								fontSize: 18,
								width: 40,
								height: 40,
								borderRadius: token.borderRadius,
							}}
						/>

						{/* Notifications */}
						<NotificationDropdown />

						{/* User dropdown */}
						<Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 12,
									cursor: 'pointer',
									padding: '4px 12px',
									borderRadius: token.borderRadius,
									transition: 'background 0.2s',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = token.colorFillTertiary;
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = 'transparent';
								}}
							>
								<Avatar
									size={32}
									icon={<UserOutlined />}
									src={user?.avatar}
									style={{
										backgroundColor: token.colorPrimary,
										flexShrink: 0,
									}}
								/>
								{!screens.xs && (
									<span style={{ fontWeight: 500, fontSize: 14 }}>
										{user?.name || 'User'}
									</span>
								)}
							</div>
						</Dropdown>
					</Space>
				</Header>

				{/* Content */}
				<Content
					style={{
						margin: token.marginLG,
						padding: token.paddingXL,
						minHeight: 280,
						background: token.colorBgContainer,
						borderRadius: 20,
						border: `1px solid ${token.colorBorderSecondary}`,
						...elevation[0],
					}}
				>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	);
};

export default MainLayout;
