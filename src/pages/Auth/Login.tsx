import {
	BookOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	DashboardOutlined,
	EyeOutlined,
	GlobalOutlined,
	LineChartOutlined,
	LockOutlined,
	LoginOutlined,
	RocketOutlined,
	SafetyCertificateOutlined,
	SafetyOutlined,
	TeamOutlined,
	ThunderboltOutlined,
	TrophyOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Button, Col, Row, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text, Paragraph } = Typography;

// Statistics data
const stats = [
	{ value: '10K+', label: 'Active Users', icon: <UserOutlined /> },
	{ value: '50K+', label: 'Assessments Completed', icon: <BookOutlined /> },
	{ value: '99.9%', label: 'Uptime', icon: <CheckCircleOutlined /> },
	{ value: '24/7', label: 'Support', icon: <ClockCircleOutlined /> },
];

// Main features
const mainFeatures = [
	{
		icon: <SafetyCertificateOutlined style={{ fontSize: 40, color: '#00d4d4' }} />,
		title: 'Identity Verification',
		description:
			'Advanced face recognition technology ensures exam integrity with real-time identity verification during assessments.',
	},
	{
		icon: <EyeOutlined style={{ fontSize: 40, color: '#00d4d4' }} />,
		title: 'AI Proctoring',
		description:
			'Intelligent monitoring system detects suspicious behaviors automatically, maintaining a fair examination environment.',
	},
	{
		icon: <LineChartOutlined style={{ fontSize: 40, color: '#00d4d4' }} />,
		title: 'Analytics Dashboard',
		description:
			'Comprehensive analytics and reporting tools provide deep insights into student performance and assessment quality.',
	},
	{
		icon: <LockOutlined style={{ fontSize: 40, color: '#00d4d4' }} />,
		title: 'Secure Data',
		description:
			'Enterprise-grade security with end-to-end encryption protects all assessment data and student information.',
	},
	{
		icon: <GlobalOutlined style={{ fontSize: 40, color: '#00d4d4' }} />,
		title: 'Multi-language',
		description:
			'Full localization support allows students and educators to use the platform in their preferred language.',
	},
	{
		icon: <TeamOutlined style={{ fontSize: 40, color: '#00d4d4' }} />,
		title: 'Team Collaboration',
		description:
			'Create and manage groups, share question banks, and collaborate seamlessly with your teaching team.',
	},
];

// User types
const userTypes = [
	{
		icon: <UserOutlined style={{ fontSize: 36 }} />,
		title: 'Students',
		features: ['Take secure online exams', 'View grades and feedback', 'Track learning progress', 'Access anywhere, anytime'],
	},
	{
		icon: <BookOutlined style={{ fontSize: 36 }} />,
		title: 'Teachers',
		features: [
			'Create diverse question types',
			'Build question banks',
			'Auto-grading support',
			'Detailed analytics',
		],
	},
	{
		icon: <DashboardOutlined style={{ fontSize: 36 }} />,
		title: 'Administrators',
		features: [
			'Manage users & groups',
			'Monitor system activities',
			'Configure security policies',
			'Generate reports',
		],
	},
];

const Login: React.FC = () => {
	const { t } = useTranslation();
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [showWelcome, setShowWelcome] = useState(true);

	useEffect(() => {
		if (isAuthenticated) navigate('/dashboard');
	}, [isAuthenticated, navigate]);

	useEffect(() => {
		const timer = setTimeout(() => setShowWelcome(false), 2000);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (!canvasRef.current) return;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		const renderer = new THREE.WebGLRenderer({
			canvas: canvasRef.current,
			alpha: true,
			antialias: true,
		});

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0x00cccc, 1);
		camera.position.z = 5;

		// Gradient background
		const bgGeometry = new THREE.PlaneGeometry(50, 50);
		const bgMaterial = new THREE.ShaderMaterial({
			uniforms: { time: { value: 0 } },
			vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
			fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        void main() {
          vec3 color1 = vec3(0.0, 0.8, 0.8);
          vec3 color2 = vec3(0.0, 0.6, 0.9);
          vec3 color3 = vec3(0.1, 0.7, 0.85);
          vec3 color4 = vec3(0.0, 0.5, 0.75);
          
          float noise = sin(vUv.x * 3.0 + time * 0.3) * cos(vUv.y * 2.0 + time * 0.2) * 0.15;
          float diagonal = (vUv.x + vUv.y) * 0.5;
          
          vec3 color = mix(color1, color2, vUv.y + noise);
          color = mix(color, color3, diagonal);
          color = mix(color, color4, sin(time * 0.2) * 0.1 + 0.5);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
		});
		const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
		bgMesh.position.z = -10;
		scene.add(bgMesh);

		// Floating spheres
		const spheres: THREE.Mesh[] = [];
		const sphereGeometry = new THREE.SphereGeometry(0.12, 32, 32);
		for (let i = 0; i < 15; i++) {
			const material = new THREE.MeshBasicMaterial({
				color: new THREE.Color().setHSL(0.5 + Math.random() * 0.1, 0.6, 0.7),
				transparent: true,
				opacity: 0.25,
			});
			const sphere = new THREE.Mesh(sphereGeometry, material);
			sphere.position.set(
				(Math.random() - 0.5) * 10,
				(Math.random() - 0.5) * 10,
				(Math.random() - 0.5) * 5
			);
			sphere.userData.velocity = {
				x: (Math.random() - 0.5) * 0.008,
				y: (Math.random() - 0.5) * 0.008,
			};
			spheres.push(sphere);
			scene.add(sphere);
		}

		// Particles
		const particlesGeometry = new THREE.BufferGeometry();
		const positions = new Float32Array(600 * 3);
		for (let i = 0; i < 600 * 3; i++) positions[i] = (Math.random() - 0.5) * 15;
		particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		const particlesMaterial = new THREE.PointsMaterial({
			size: 0.015,
			color: 0xffffff,
			transparent: true,
			opacity: 0.4,
			blending: THREE.AdditiveBlending,
		});
		const particles = new THREE.Points(particlesGeometry, particlesMaterial);
		scene.add(particles);

		const animate = () => {
			requestAnimationFrame(animate);
			bgMaterial.uniforms.time.value += 0.01;
			particles.rotation.y += 0.0003;
			spheres.forEach((sphere) => {
				sphere.position.x += sphere.userData.velocity.x;
				sphere.position.y += sphere.userData.velocity.y;
				if (Math.abs(sphere.position.x) > 5) sphere.userData.velocity.x *= -1;
				if (Math.abs(sphere.position.y) > 5) sphere.userData.velocity.y *= -1;
				sphere.rotation.x += 0.008;
				sphere.rotation.y += 0.008;
			});
			renderer.render(scene, camera);
		};
		animate();

		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			bgGeometry.dispose();
			bgMaterial.dispose();
			sphereGeometry.dispose();
			particlesGeometry.dispose();
			particlesMaterial.dispose();
			spheres.forEach((s) => (s.material as THREE.Material).dispose());
			renderer.dispose();
		};
	}, []);

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<div
			style={{
				position: 'relative',
				minHeight: '100vh',
				overflowX: 'hidden',
			}}
		>
			<canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }} />

			{showWelcome && (
				<div
					style={{
						position: 'fixed',
						inset: 0,
						zIndex: 10,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						background:
							'linear-gradient(135deg, rgba(0, 204, 204, 0.95) 0%, rgba(0, 153, 230, 0.95) 100%)',
						animation: 'fadeOut 0.4s ease-out 1.6s forwards',
					}}
				>
					<div
						style={{
							textAlign: 'center',
							animation: 'scaleIn 0.6s ease-out',
						}}
					>
						<div style={{ fontSize: 72, marginBottom: 16 }}>🎓</div>
						<Title
							level={1}
							style={{
								color: 'white',
								fontSize: 48,
								margin: 0,
								fontWeight: 700,
							}}
						>
							{t('login.welcome')}
						</Title>
						<Text
							style={{
								color: 'rgba(255, 255, 255, 0.9)',
								fontSize: 20,
							}}
						>
							Secure Assessment Platform
						</Text>
					</div>
				</div>
			)}

			{/* Navigation Bar */}
			<nav
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					zIndex: 5,
					background: 'rgba(255, 255, 255, 0.1)',
					backdropFilter: 'blur(10px)',
					borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
					padding: '12px 40px',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					animation: 'slideDown 0.6s ease-out 2s both',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<span style={{ fontSize: 28 }}>🎓</span>
					<Text style={{ color: 'white', fontSize: 20, fontWeight: 600 }}>SAP</Text>
				</div>
				<div style={{ display: 'flex', gap: 24 }}>
					<Button
						type="text"
						style={{ color: 'rgba(255,255,255,0.9)' }}
						onClick={() => scrollToSection('features')}
					>
						Features
					</Button>
					<Button
						type="text"
						style={{ color: 'rgba(255,255,255,0.9)' }}
						onClick={() => scrollToSection('users')}
					>
						For Users
					</Button>
					<Button
						type="primary"
						icon={<LoginOutlined />}
						onClick={login}
						style={{
							background: 'white',
							color: '#00cccc',
							border: 'none',
							fontWeight: 600,
						}}
					>
						Get Started
					</Button>
				</div>
			</nav>

			{/* Hero Section */}
			<section
				id="hero"
				style={{
					position: 'relative',
					zIndex: 1,
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					padding: '100px 80px 60px',
				}}
			>
				<Row gutter={[60, 40]} align="middle" style={{ width: '100%' }}>
					<Col xs={24} lg={14} style={{ animation: 'slideLeft 0.8s ease-out 2s both' }}>
						<div style={{ marginBottom: 24 }}>
							<span
								style={{
									display: 'inline-block',
									padding: '8px 16px',
									borderRadius: 20,
									background: 'rgba(255,255,255,0.15)',
									backdropFilter: 'blur(10px)',
									color: 'white',
									fontSize: 14,
									fontWeight: 500,
									marginBottom: 24,
								}}
							>
								🚀 Next-Generation Online Assessment
							</span>
						</div>
						<Title
							level={1}
							style={{
								color: 'white',
								fontSize: 56,
								marginBottom: 24,
								fontWeight: 800,
								lineHeight: 1.2,
							}}
						>
							Secure Assessment Platform
						</Title>
						<Paragraph
							style={{
								color: 'rgba(255, 255, 255, 0.9)',
								fontSize: 20,
								marginBottom: 40,
								maxWidth: 600,
								lineHeight: 1.6,
							}}
						>
							{t('login.subtitle')}. Powered by AI proctoring and advanced face recognition
							technology for a secure, fair, and seamless assessment experience.
						</Paragraph>

						<div style={{ display: 'flex', gap: 16, marginBottom: 48 }}>
							<Button
								type="primary"
								size="large"
								icon={<LoginOutlined />}
								onClick={login}
								style={{
									height: 56,
									padding: '0 40px',
									fontSize: 17,
									fontWeight: 600,
									borderRadius: 12,
									background: 'white',
									color: '#00cccc',
									border: 'none',
									boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
								}}
							>
								{t('login.loginWithCasdoor')}
							</Button>
							<Button
								size="large"
								onClick={() => scrollToSection('features')}
								style={{
									height: 56,
									padding: '0 32px',
									fontSize: 17,
									fontWeight: 600,
									borderRadius: 12,
									background: 'rgba(255,255,255,0.15)',
									color: 'white',
									border: '1px solid rgba(255,255,255,0.3)',
								}}
							>
								Learn More
							</Button>
						</div>

						{/* Quick Features */}
						<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
							{[
								{ icon: <SafetyOutlined />, text: t('login.features.security') },
								{ icon: <ThunderboltOutlined />, text: t('login.features.performance') },
								{ icon: <RocketOutlined />, text: t('login.features.modern') },
							].map((item, idx) => (
								<div
									key={idx}
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 16,
									}}
								>
									<div
										style={{
											width: 44,
											height: 44,
											borderRadius: 12,
											background: 'rgba(255, 255, 255, 0.2)',
											backdropFilter: 'blur(10px)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: 18,
											color: 'white',
										}}
									>
										{item.icon}
									</div>
									<Text style={{ color: 'white', fontSize: 16 }}>{item.text}</Text>
								</div>
							))}
						</div>
					</Col>

					<Col xs={24} lg={10} style={{ animation: 'slideRight 0.8s ease-out 2s both' }}>
						<div
							style={{
								width: '100%',
								maxWidth: 420,
								margin: '0 auto',
								padding: 48,
								borderRadius: 24,
								background: 'rgba(255, 255, 255, 0.15)',
								backdropFilter: 'blur(30px)',
								border: '1px solid rgba(255, 255, 255, 0.25)',
								boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
							}}
						>
							<div style={{ textAlign: 'center', marginBottom: 32 }}>
								<div
									style={{
										width: 80,
										height: 80,
										borderRadius: 20,
										background: 'rgba(255,255,255,0.2)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										margin: '0 auto 20px',
										fontSize: 40,
									}}
								>
									🎓
								</div>
								<Title
									level={2}
									style={{
										color: 'white',
										marginBottom: 8,
										fontSize: 28,
									}}
								>
									{t('login.welcomeBack')}
								</Title>
								<Text
									style={{
										color: 'rgba(255, 255, 255, 0.85)',
										fontSize: 15,
									}}
								>
									{t('login.loginPrompt')}
								</Text>
							</div>

							<Button
								type="primary"
								size="large"
								icon={<LoginOutlined />}
								onClick={login}
								block
								style={{
									height: 56,
									fontSize: 16,
									fontWeight: 600,
									borderRadius: 12,
									background: 'white',
									color: '#00cccc',
									border: 'none',
									boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
									transition: 'all 0.3s',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'translateY(-2px)';
									e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.25)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translateY(0)';
									e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
								}}
							>
								{t('login.loginWithCasdoor')}
							</Button>

							<div
								style={{
									marginTop: 24,
									padding: 16,
									borderRadius: 12,
									background: 'rgba(255, 255, 255, 0.1)',
									border: '1px solid rgba(255, 255, 255, 0.15)',
									textAlign: 'center',
								}}
							>
								<Text
									style={{
										color: 'rgba(255, 255, 255, 0.85)',
										fontSize: 13,
									}}
								>
									{t('login.useCasdoorAccount')}
								</Text>
							</div>
						</div>
					</Col>
				</Row>
			</section>

			{/* Stats Section */}
			<section
				style={{
					position: 'relative',
					zIndex: 1,
					padding: '40px 80px',
				}}
			>
				<Row gutter={[32, 32]} justify="center">
					{stats.map((stat, idx) => (
						<Col key={idx} xs={12} sm={6}>
							<div
								style={{
									textAlign: 'center',
									padding: 24,
									borderRadius: 16,
									background: 'rgba(255,255,255,0.1)',
									backdropFilter: 'blur(10px)',
									border: '1px solid rgba(255,255,255,0.15)',
								}}
							>
								<div style={{ fontSize: 24, color: 'white', marginBottom: 8 }}>{stat.icon}</div>
								<div style={{ fontSize: 32, fontWeight: 700, color: 'white' }}>{stat.value}</div>
								<div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{stat.label}</div>
							</div>
						</Col>
					))}
				</Row>
			</section>

			{/* Features Section */}
			<section
				id="features"
				style={{
					position: 'relative',
					zIndex: 1,
					padding: '80px 80px',
				}}
			>
				<div style={{ textAlign: 'center', marginBottom: 60 }}>
					<Title level={2} style={{ color: 'white', fontSize: 40, marginBottom: 16 }}>
						Powerful Features
					</Title>
					<Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18 }}>
						Everything you need for secure and efficient online assessments
					</Text>
				</div>

				<Row gutter={[32, 32]}>
					{mainFeatures.map((feature, idx) => (
						<Col key={idx} xs={24} sm={12} lg={8}>
							<div
								style={{
									height: '100%',
									padding: 32,
									borderRadius: 20,
									background: 'rgba(255,255,255,0.1)',
									backdropFilter: 'blur(20px)',
									border: '1px solid rgba(255,255,255,0.15)',
									transition: 'all 0.3s ease',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'translateY(-8px)';
									e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translateY(0)';
									e.currentTarget.style.boxShadow = 'none';
								}}
							>
								<div
									style={{
										width: 70,
										height: 70,
										borderRadius: 16,
										background: 'rgba(255,255,255,0.15)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										marginBottom: 20,
									}}
								>
									{feature.icon}
								</div>
								<Title level={4} style={{ color: 'white', marginBottom: 12 }}>
									{feature.title}
								</Title>
								<Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, lineHeight: 1.6 }}>
									{feature.description}
								</Text>
							</div>
						</Col>
					))}
				</Row>
			</section>

			{/* User Types Section */}
			<section
				id="users"
				style={{
					position: 'relative',
					zIndex: 1,
					padding: '80px 80px',
				}}
			>
				<div style={{ textAlign: 'center', marginBottom: 60 }}>
					<Title level={2} style={{ color: 'white', fontSize: 40, marginBottom: 16 }}>
						Designed for Everyone
					</Title>
					<Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18 }}>
						Tailored experiences for students, teachers, and administrators
					</Text>
				</div>

				<Row gutter={[32, 32]} justify="center">
					{userTypes.map((user, idx) => (
						<Col key={idx} xs={24} md={8}>
							<div
								style={{
									height: '100%',
									padding: 40,
									borderRadius: 24,
									background: 'rgba(255,255,255,0.12)',
									backdropFilter: 'blur(20px)',
									border: '1px solid rgba(255,255,255,0.2)',
									textAlign: 'center',
								}}
							>
								<div
									style={{
										width: 80,
										height: 80,
										borderRadius: 20,
										background: 'linear-gradient(135deg, #00d4d4 0%, #0099e6 100%)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										margin: '0 auto 24px',
										color: 'white',
									}}
								>
									{user.icon}
								</div>
								<Title level={3} style={{ color: 'white', marginBottom: 24 }}>
									{user.title}
								</Title>
								<div style={{ textAlign: 'left' }}>
									{user.features.map((feat, fidx) => (
										<div
											key={fidx}
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: 12,
												marginBottom: 12,
											}}
										>
											<CheckCircleOutlined style={{ color: '#00d4d4', fontSize: 16 }} />
											<Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15 }}>
												{feat}
											</Text>
										</div>
									))}
								</div>
							</div>
						</Col>
					))}
				</Row>
			</section>

			{/* CTA Section */}
			<section
				style={{
					position: 'relative',
					zIndex: 1,
					padding: '80px 80px',
					textAlign: 'center',
				}}
			>
				<div
					style={{
						maxWidth: 700,
						margin: '0 auto',
						padding: 60,
						borderRadius: 32,
						background: 'rgba(255,255,255,0.15)',
						backdropFilter: 'blur(30px)',
						border: '1px solid rgba(255,255,255,0.2)',
					}}
				>
					<TrophyOutlined style={{ fontSize: 48, color: '#ffd700', marginBottom: 24 }} />
					<Title level={2} style={{ color: 'white', marginBottom: 16 }}>
						Ready to Transform Your Assessments?
					</Title>
					<Text
						style={{
							color: 'rgba(255,255,255,0.85)',
							fontSize: 18,
							display: 'block',
							marginBottom: 32,
						}}
					>
						Join thousands of educators and students using SAP for secure online exams.
					</Text>
					<Button
						type="primary"
						size="large"
						icon={<LoginOutlined />}
						onClick={login}
						style={{
							height: 60,
							padding: '0 48px',
							fontSize: 18,
							fontWeight: 600,
							borderRadius: 14,
							background: 'white',
							color: '#00cccc',
							border: 'none',
							boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
						}}
					>
						Get Started Now
					</Button>
				</div>
			</section>

			{/* Footer */}
			<footer
				style={{
					position: 'relative',
					zIndex: 1,
					padding: '40px 80px',
					borderTop: '1px solid rgba(255,255,255,0.1)',
					textAlign: 'center',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
					<span style={{ fontSize: 24 }}>🎓</span>
					<Text style={{ color: 'white', fontSize: 18, fontWeight: 600 }}>
						Secure Assessment Platform
					</Text>
				</div>
				<Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
					© 2025 SAP Team. All rights reserved.
				</Text>
			</footer>

			<style>{`
        @keyframes fadeOut {
          to { opacity: 0; pointer-events: none; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideLeft {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideRight {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @media (max-width: 768px) {
          section {
            padding: 60px 24px !important;
          }
          nav {
            padding: 12px 16px !important;
          }
        }
      `}</style>
		</div>
	);
};

export default Login;
