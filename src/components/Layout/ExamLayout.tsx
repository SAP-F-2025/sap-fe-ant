import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Button, Layout, Tooltip } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { useTheme, useThemeToken } from '../../theme/ThemeProvider';

const { Content } = Layout;

/**
 * Exam Layout Component
 * Minimal layout for exam-taking mode:
 * - No sidebar navigation
 * - No header menu
 * - Only theme toggle available
 * - Full screen experience
 */
const ExamLayout: React.FC = () => {
	const { t } = useTranslation();
	const { token } = useThemeToken();
	const { mode, toggleDark } = useTheme();

	return (
		<Layout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
			{/* Minimal floating theme toggle */}
			<div
				style={{
					position: 'fixed',
					top: 16,
					right: 16,
					zIndex: 1001,
				}}
			>
				<Tooltip
					title={mode === 'dark' ? t('layout.lightMode') : t('layout.darkMode')}
					placement="left"
				>
					<Button
						type="default"
						shape="circle"
						size="large"
						icon={mode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
						onClick={toggleDark}
						style={{
							background: token.colorBgContainer,
							borderColor: token.colorBorder,
							boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
						}}
					/>
				</Tooltip>
			</div>

			{/* Full-width content */}
			<Content
				style={{
					padding: token.paddingMD,
					minHeight: '100vh',
					background: token.colorBgLayout,
				}}
			>
				<Outlet />
			</Content>
		</Layout>
	);
};

export default ExamLayout;
