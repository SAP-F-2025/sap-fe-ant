import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Avatar, Badge, Tooltip, Divider } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  BankOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useThemeToken } from '../../theme/ThemeProvider';
import { useAuth } from '../../hooks/useAuth';

interface ModernSidebarProps {
  collapsed: boolean;
  mode: 'light' | 'dark' | 'highContrast';
}

const ModernSidebar: React.FC<ModernSidebarProps> = ({ collapsed, mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useThemeToken();
  const { user, logout } = useAuth();

  const menuItems: MenuProps['items'] = [
    {
      key: 'main',
      type: 'group',
      label: !collapsed && 'QUẢN LÝ CHÍNH',
      children: [
        {
          key: '/dashboard',
          icon: <DashboardOutlined />,
          label: 'Tổng quan',
        },
        ...(user?.isAdmin ? [{
          key: '/users',
          icon: <Badge count={5} size="small" offset={[10, 0]}><TeamOutlined /></Badge>,
          label: 'Người dùng',
        }] : []),
      ],
    },
    {
      type: 'divider',
    },
    {
      key: 'content',
      type: 'group',
      label: !collapsed && 'NỘI DUNG',
      children: [
        {
          key: '/assessments',
          icon: <Badge dot offset={[10, 0]}><FileTextOutlined /></Badge>,
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
      ],
    },
    {
      type: 'divider',
    },
    {
      key: 'tools',
      type: 'group',
      label: !collapsed && 'CÔNG CỤ',
      children: [
        {
          key: '/grading',
          icon: <Badge count={12} size="small" offset={[10, 0]}><CheckCircleOutlined /></Badge>,
          label: 'Chấm điểm',
        },
      ],
    },
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith('/users')) return '/users';
    if (path.startsWith('/assessments')) return '/assessments';
    if (path.startsWith('/questions')) return '/questions';
    if (path.startsWith('/question-banks')) return '/question-banks';
    if (path.startsWith('/grading')) return '/grading';
    return path;
  };

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Logo */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 0 : `0 ${token.paddingLG}px`,
          borderBottom: mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(0, 0, 0, 0.06)',
          background: mode === 'dark' 
            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(114, 46, 209, 0.05) 100%)',
        }}
      >
        {collapsed ? (
          <div style={{ 
            fontSize: 28,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          }}>
            🎓
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            fontWeight: 700,
            fontSize: 16,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            <span style={{ fontSize: 28 }}>🎓</span>
            <span>SAP Assessment</span>
          </div>
        )}
      </div>

      {/* Menu */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            border: 0,
            background: 'transparent',
          }}
        />
      </div>

      {/* Profile Card */}
      <div
        style={{
          padding: collapsed ? '12px 8px' : token.paddingLG,
          borderTop: mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(0, 0, 0, 0.06)',
          background: mode === 'dark'
            ? 'rgba(255, 255, 255, 0.02)'
            : 'rgba(0, 0, 0, 0.02)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {collapsed ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <Tooltip title="Hồ sơ" placement="right">
              <Avatar 
                size={40}
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  cursor: 'pointer',
                  border: '2px solid rgba(255,255,255,0.2)',
                }}
              >
                {user?.name?.[0] || 'U'}
              </Avatar>
            </Tooltip>
            <Tooltip title="Đăng xuất" placement="right">
              <LogoutOutlined 
                onClick={logout}
                style={{ 
                  fontSize: 18, 
                  cursor: 'pointer',
                  color: mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ff4d4f'}
                onMouseLeave={(e) => e.currentTarget.style.color = mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'}
              />
            </Tooltip>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Avatar 
                size={48}
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  flexShrink: 0,
                }}
              >
                {user?.name?.[0] || 'U'}
              </Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontWeight: 600, 
                  fontSize: 14,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {user?.name || 'User'}
                </div>
                <div style={{ 
                  fontSize: 12, 
                  color: mode === 'dark' ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {user?.email || 'user@example.com'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div
                onClick={() => navigate('/settings')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: token.borderRadius,
                  background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontSize: 13,
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
                }}
              >
                <SettingOutlined />
                Cài đặt
              </div>
              <div
                onClick={logout}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: token.borderRadius,
                  background: mode === 'dark' ? 'rgba(255,77,79,0.1)' : 'rgba(255,77,79,0.08)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontSize: 13,
                  color: '#ff4d4f',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = mode === 'dark' ? 'rgba(255,77,79,0.2)' : 'rgba(255,77,79,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = mode === 'dark' ? 'rgba(255,77,79,0.1)' : 'rgba(255,77,79,0.08)';
                }}
              >
                <LogoutOutlined />
                Thoát
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernSidebar;
