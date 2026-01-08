import { LoginOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Space, theme, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../theme/ThemeProvider';

const { Title, Text } = Typography;

/**
 * Premium Login Page with Cinematic Reveal Animation
 *
 * Features:
 * - Animated gradient background
 * - Floating light orbs
 * - 3-stage cinematic reveal (logo → card → content)
 * - Breathing glow effect on card
 * - Interactive button hover effects
 * - Full light/dark mode support
 */
const Login: React.FC = () => {
	const { t } = useTranslation();
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const { token } = theme.useToken();
	const { mode } = useTheme();
	const [animationStage, setAnimationStage] = useState(0);

	useEffect(() => {
		if (isAuthenticated) navigate('/dashboard');
	}, [isAuthenticated, navigate]);

	// Trigger animation stages
	useEffect(() => {
		const timers = [
			setTimeout(() => setAnimationStage(1), 100), // Logo appears
			setTimeout(() => setAnimationStage(2), 500), // Card reveals
			setTimeout(() => setAnimationStage(3), 900), // Content fades in
		];
		return () => timers.forEach(clearTimeout);
	}, []);

	const isDark = mode === 'dark';

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				padding: 24,
				position: 'relative',
				overflow: 'hidden',
				background: isDark
					? `linear-gradient(-45deg, #0a0a0a, #0d1520, #0a0a0a, #0f1525)`
					: `linear-gradient(-45deg, #f8fafc, #e8f4fd, #f0f9ff, #e6f2ff)`,
				backgroundSize: '400% 400%',
				animation: 'gradientShift 15s ease infinite',
			}}
		>
			{/* Floating Orbs */}
			<div
				style={{
					position: 'absolute',
					width: 300,
					height: 300,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${isDark ? 'rgba(24, 144, 255, 0.15)' : 'rgba(24, 144, 255, 0.12)'} 0%, transparent 70%)`,
					top: '10%',
					left: '5%',
					animation: 'float1 20s ease-in-out infinite',
					filter: 'blur(40px)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					width: 250,
					height: 250,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${isDark ? 'rgba(24, 144, 255, 0.12)' : 'rgba(24, 144, 255, 0.1)'} 0%, transparent 70%)`,
					bottom: '15%',
					right: '10%',
					animation: 'float2 25s ease-in-out infinite',
					filter: 'blur(50px)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					width: 200,
					height: 200,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(96, 165, 250, 0.08)'} 0%, transparent 70%)`,
					top: '50%',
					right: '5%',
					animation: 'float3 18s ease-in-out infinite',
					filter: 'blur(35px)',
				}}
			/>

			{/* Main Card */}
			<Card
				style={{
					width: '100%',
					maxWidth: 420,
					borderRadius: 20,
					background: isDark ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.95)',
					backdropFilter: 'blur(20px)',
					border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(24, 144, 255, 0.1)'}`,
					boxShadow: isDark
						? `0 0 60px rgba(24, 144, 255, ${animationStage >= 2 ? 0.15 : 0}), 
						   0 0 120px rgba(24, 144, 255, ${animationStage >= 2 ? 0.08 : 0}),
						   0 25px 50px rgba(0, 0, 0, 0.5)`
						: `0 0 60px rgba(24, 144, 255, ${animationStage >= 2 ? 0.1 : 0}), 
						   0 0 100px rgba(24, 144, 255, ${animationStage >= 2 ? 0.05 : 0}),
						   0 25px 50px rgba(0, 0, 0, 0.1)`,
					transform: animationStage >= 2 ? 'scale(1)' : 'scale(0.9)',
					opacity: animationStage >= 2 ? 1 : 0,
					transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
					animation: animationStage >= 2 ? 'breathe 4s ease-in-out infinite 1s' : 'none',
					zIndex: 10,
				}}
				styles={{
					body: {
						padding: 48,
					},
				}}
			>
				{/* Logo with float animation */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						marginBottom: 24,
						opacity: animationStage >= 1 ? 1 : 0,
						transform: animationStage >= 1 ? 'translateY(0)' : 'translateY(-20px)',
						transition: 'all 0.5s ease-out',
					}}
				>
					<div
						style={{
							width: 80,
							height: 80,
							borderRadius: 20,
							background: isDark
								? 'linear-gradient(135deg, rgba(24, 144, 255, 0.2) 0%, rgba(96, 165, 250, 0.15) 100%)'
								: 'linear-gradient(135deg, rgba(24, 144, 255, 0.15) 0%, rgba(96, 165, 250, 0.1) 100%)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 40,
							marginBottom: 16,
							boxShadow: isDark
								? '0 0 30px rgba(24, 144, 255, 0.3)'
								: '0 0 20px rgba(24, 144, 255, 0.2)',
							animation: animationStage >= 1 ? 'logoFloat 3s ease-in-out infinite' : 'none',
						}}
					>
						🎓
					</div>
					<Title
						level={2}
						style={{
							margin: 0,
							color: token.colorPrimary,
							fontWeight: 700,
							letterSpacing: 2,
						}}
					>
						SAP
					</Title>
					<Text
						type="secondary"
						style={{
							fontSize: 13,
							letterSpacing: 0.5,
						}}
					>
						Secure Assessment Platform
					</Text>
				</div>

				<Divider
					style={{
						margin: '16px 0 28px',
						opacity: animationStage >= 3 ? 1 : 0,
						transition: 'opacity 0.4s ease-out 0.1s',
					}}
				/>

				{/* Welcome Message */}
				<Space
					direction="vertical"
					align="center"
					style={{
						width: '100%',
						marginBottom: 32,
						opacity: animationStage >= 3 ? 1 : 0,
						transform: animationStage >= 3 ? 'translateY(0)' : 'translateY(15px)',
						transition: 'all 0.5s ease-out 0.1s',
					}}
				>
					<Title
						level={4}
						style={{
							margin: 0,
							fontWeight: 600,
						}}
					>
						{t('login.welcomeBack')}
					</Title>
					<Text type="secondary" style={{ textAlign: 'center' }}>
						{t('login.loginPrompt')}
					</Text>
				</Space>

				{/* Login Button */}
				<div
					style={{
						opacity: animationStage >= 3 ? 1 : 0,
						transform: animationStage >= 3 ? 'translateY(0)' : 'translateY(15px)',
						transition: 'all 0.5s ease-out 0.2s',
					}}
				>
					<Button
						type="primary"
						size="large"
						icon={<LoginOutlined />}
						onClick={login}
						block
						style={{
							height: 52,
							fontSize: 16,
							fontWeight: 600,
							borderRadius: 12,
							boxShadow: '0 4px 15px rgba(24, 144, 255, 0.4)',
							transition: 'all 0.3s ease',
						}}
						className="login-button"
					>
						{t('login.loginWithCasdoor')}
					</Button>
				</div>

				{/* Helper Text */}
				<Text
					type="secondary"
					style={{
						display: 'block',
						textAlign: 'center',
						marginTop: 20,
						fontSize: 13,
						opacity: animationStage >= 3 ? 1 : 0,
						transition: 'opacity 0.5s ease-out 0.3s',
					}}
				>
					{t('login.useCasdoorAccount')}
				</Text>
			</Card>

			{/* Footer */}
			<Text
				type="secondary"
				style={{
					marginTop: 40,
					fontSize: 12,
					opacity: animationStage >= 3 ? 0.7 : 0,
					transition: 'opacity 0.5s ease-out 0.4s',
					zIndex: 10,
				}}
			>
				© 2025 SAP Team. All rights reserved.
			</Text>

			{/* CSS Animations */}
			<style>{`
				@keyframes gradientShift {
					0% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
					100% { background-position: 0% 50%; }
				}

				@keyframes float1 {
					0%, 100% { transform: translate(0, 0) scale(1); }
					25% { transform: translate(30px, -30px) scale(1.05); }
					50% { transform: translate(-20px, 20px) scale(0.95); }
					75% { transform: translate(40px, 10px) scale(1.02); }
				}

				@keyframes float2 {
					0%, 100% { transform: translate(0, 0) scale(1); }
					33% { transform: translate(-40px, 20px) scale(1.08); }
					66% { transform: translate(30px, -40px) scale(0.92); }
				}

				@keyframes float3 {
					0%, 100% { transform: translate(0, 0) scale(1); }
					50% { transform: translate(-30px, -20px) scale(1.1); }
				}

				@keyframes logoFloat {
					0%, 100% { transform: translateY(0); }
					50% { transform: translateY(-6px); }
				}

				@keyframes breathe {
					0%, 100% { 
						box-shadow: ${isDark
					? '0 0 60px rgba(24, 144, 255, 0.15), 0 0 120px rgba(24, 144, 255, 0.08), 0 25px 50px rgba(0, 0, 0, 0.5)'
					: '0 0 60px rgba(24, 144, 255, 0.1), 0 0 100px rgba(24, 144, 255, 0.05), 0 25px 50px rgba(0, 0, 0, 0.1)'};
					}
					50% { 
						box-shadow: ${isDark
					? '0 0 80px rgba(24, 144, 255, 0.25), 0 0 150px rgba(24, 144, 255, 0.12), 0 25px 50px rgba(0, 0, 0, 0.5)'
					: '0 0 80px rgba(24, 144, 255, 0.18), 0 0 120px rgba(24, 144, 255, 0.08), 0 25px 50px rgba(0, 0, 0, 0.1)'};
					}
				}

				.login-button:hover {
					transform: translateY(-2px) !important;
					box-shadow: 0 8px 25px rgba(24, 144, 255, 0.5) !important;
				}

				.login-button:active {
					transform: translateY(0) scale(0.98) !important;
				}

				@media (prefers-reduced-motion: reduce) {
					*, *::before, *::after {
						animation-duration: 0.01ms !important;
						animation-iteration-count: 1 !important;
						transition-duration: 0.01ms !important;
					}
				}
			`}</style>
		</div>
	);
};

export default Login;
