import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Typography,
  Space,
  Button,
  Dropdown,
  Switch,
  Grid,
  Avatar,
} from 'antd';
import { elevation } from '../../styles/elevation';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  BankOutlined,
  CheckCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BulbOutlined,
  MoonOutlined,
  SunOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useTheme, useThemeToken } from '../../theme/ThemeProvider';
import { gradients } from '../../theme/gradients';
import { useAuth } from '../../hooks/useAuth';

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
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useThemeToken();
  const { mode, toggleDark, setMode } = useTheme();
  const screens = useBreakpoint();
  const { user, logout } = useAuth();

  // Auto-collapse on mobile
  React.useEffect(() => {
    if (screens.xs && !collapsed) {
      setCollapsed(true);
    }
  }, [screens.xs]);

  // Menu items - filter based on user role
  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    // Only show Users menu for admin
    ...(user?.isAdmin ? [{
      key: '/users',
      icon: <TeamOutlined />,
      label: 'Người dùng',
    }] : []),
    {
      key: '/assessments',
      icon: <FileTextOutlined />,
      label: 'Quản lý bài thi',
    },
    {
      key: '/questions',
      icon: <QuestionCircleOutlined />,
      label: 'Quản lý câu hỏi',
    },
    {
      key: '/question-banks',
      icon: <BankOutlined />,
      label: 'Ngân hàng câu hỏi',
    },
    {
      key: '/grading',
      icon: <CheckCircleOutlined />,
      label: 'Chấm điểm',
    },
  ];

  // User dropdown menu handler
  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      logout();
    } else if (key === 'profile' || key === 'settings') {
      navigate(`/${key}`);
    }
  };

  // User dropdown menu
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Hồ sơ',
    },
    {
      key: 'settings',
      label: 'Cài đặt',
    },
    {
      type: 'divider',
    },
    {
      key: 'theme',
      label: (
        <Space>
          <span>Chế độ tối</span>
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
      label: 'Đăng xuất',
      danger: true,
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  // Get selected menu key based on current path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith('/users')) return '/users';
    if (path.startsWith('/assessments')) return '/assessments';
    if (path.startsWith('/questions')) return '/questions';
    if (path.startsWith('/question-banks')) return '/question-banks';
    if (path.startsWith('/grading')) return '/grading';
    return path;
  };

  // Calculate sider width based on collapsed state
  const siderWidth = collapsed ? 80 : 200;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={80}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          background: mode === 'dark' ? '#1a1a1a' : '#ffffff',
          borderRight: mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            color: mode === 'dark' ? '#ffffff' : token.colorPrimary,
            fontSize: collapsed ? 24 : 18,
            fontWeight: 700,
            padding: `0 ${token.paddingLG}px`,
            borderBottom: mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid rgba(0, 0, 0, 0.06)',
            letterSpacing: '-0.5px',
          }}
        >
          {collapsed ? '🎓' : (
            <Space size={12}>
              <span style={{ fontSize: 24 }}>🎓</span>
              <span>SAP Assessment</span>
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
        }}
      >
        {/* Header */}
        <Header
          style={{
            padding: `0 ${token.paddingLG}px`,
            background: mode === 'dark' ? '#1a1a1a' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid rgba(0, 0, 0, 0.06)',
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
                  e.currentTarget.style.background = mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)';
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
                    backgroundColor: '#1890ff',
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
            border: mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid rgba(0, 0, 0, 0.06)',
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
