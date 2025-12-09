import {
	LoginOutlined,
	RocketOutlined,
	SafetyOutlined,
	ThunderboltOutlined,
} from "@ant-design/icons";
import { Button, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { useAuth } from "../../hooks/useAuth";

const { Title, Text } = Typography;

const Login: React.FC = () => {
	const { t } = useTranslation();
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [showWelcome, setShowWelcome] = useState(true);

	useEffect(() => {
		if (isAuthenticated) navigate("/dashboard");
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
			1000,
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
				color: new THREE.Color().setHSL(
					0.5 + Math.random() * 0.1,
					0.6,
					0.7,
				),
				transparent: true,
				opacity: 0.25,
			});
			const sphere = new THREE.Mesh(sphereGeometry, material);
			sphere.position.set(
				(Math.random() - 0.5) * 10,
				(Math.random() - 0.5) * 10,
				(Math.random() - 0.5) * 5,
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
		for (let i = 0; i < 600 * 3; i++)
			positions[i] = (Math.random() - 0.5) * 15;
		particlesGeometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3),
		);
		const particlesMaterial = new THREE.PointsMaterial({
			size: 0.015,
			color: 0xffffff,
			transparent: true,
			opacity: 0.4,
			blending: THREE.AdditiveBlending,
		});
		const particles = new THREE.Points(
			particlesGeometry,
			particlesMaterial,
		);
		scene.add(particles);

		const animate = () => {
			requestAnimationFrame(animate);
			bgMaterial.uniforms.time.value += 0.01;
			particles.rotation.y += 0.0003;
			spheres.forEach((sphere) => {
				sphere.position.x += sphere.userData.velocity.x;
				sphere.position.y += sphere.userData.velocity.y;
				if (Math.abs(sphere.position.x) > 5)
					sphere.userData.velocity.x *= -1;
				if (Math.abs(sphere.position.y) > 5)
					sphere.userData.velocity.y *= -1;
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
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			bgGeometry.dispose();
			bgMaterial.dispose();
			sphereGeometry.dispose();
			particlesGeometry.dispose();
			particlesMaterial.dispose();
			spheres.forEach((s) => s.material.dispose());
			renderer.dispose();
		};
	}, []);

	return (
		<div
			style={{
				position: "relative",
				minHeight: "100vh",
				overflow: "hidden",
			}}
		>
			<canvas
				ref={canvasRef}
				style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
			/>

			{showWelcome && (
				<div
					style={{
						position: "fixed",
						inset: 0,
						zIndex: 10,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						background:
							"linear-gradient(135deg, rgba(0, 204, 204, 0.95) 0%, rgba(0, 153, 230, 0.95) 100%)",
						animation: "fadeOut 0.4s ease-out 1.6s forwards",
					}}
				>
					<div
						style={{
							textAlign: "center",
							animation: "scaleIn 0.6s ease-out",
						}}
					>
						<div style={{ fontSize: 72, marginBottom: 16 }}>🎓</div>
						<Title
							level={1}
							style={{
								color: "white",
								fontSize: 48,
								margin: 0,
								fontWeight: 700,
							}}
						>
							{t("login.welcome")}
						</Title>
						<Text
							style={{
								color: "rgba(255, 255, 255, 0.9)",
								fontSize: 20,
							}}
						>
							Secure Assessment Platform
						</Text>
					</div>
				</div>
			)}

			<div
				style={{
					position: "relative",
					zIndex: 1,
					display: "flex",
					minHeight: "100vh",
				}}
			>
				{/* Left side */}
				<div
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						padding: "0 80px",
						color: "white",
						animation: "slideLeft 0.8s ease-out 2s both",
					}}
				>
					<div style={{ fontSize: 48, marginBottom: 24 }}>🎓</div>
					<Title
						level={1}
						style={{
							color: "white",
							fontSize: 48,
							marginBottom: 16,
							fontWeight: 700,
						}}
					>
						Secure Assessment Platform
					</Title>
					<Text
						style={{
							color: "rgba(255, 255, 255, 0.9)",
							fontSize: 18,
							marginBottom: 48,
						}}
					>
						{t("login.subtitle")}
					</Text>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 24,
						}}
					>
						{[
							{
								icon: <SafetyOutlined />,
								text: t("login.features.security"),
							},
							{
								icon: <ThunderboltOutlined />,
								text: t("login.features.performance"),
							},
							{
								icon: <RocketOutlined />,
								text: t("login.features.modern"),
							},
						].map((item, idx) => (
							<div
								key={idx}
								style={{
									display: "flex",
									alignItems: "center",
									gap: 16,
								}}
							>
								<div
									style={{
										width: 48,
										height: 48,
										borderRadius: 12,
										background: "rgba(255, 255, 255, 0.2)",
										backdropFilter: "blur(10px)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontSize: 20,
									}}
								>
									{item.icon}
								</div>
								<Text style={{ color: "white", fontSize: 16 }}>
									{item.text}
								</Text>
							</div>
						))}
					</div>
				</div>

				{/* Right side */}
				<div
					style={{
						width: 500,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						padding: 40,
						animation: "slideRight 0.8s ease-out 2s both",
					}}
				>
					<div
						style={{
							width: "100%",
							maxWidth: 400,
							padding: 48,
							borderRadius: 24,
							background: "rgba(255, 255, 255, 0.15)",
							backdropFilter: "blur(30px)",
							border: "1px solid rgba(255, 255, 255, 0.25)",
							boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
						}}
					>
						<div style={{ textAlign: "center", marginBottom: 40 }}>
							<Title
								level={2}
								style={{
									color: "white",
									marginBottom: 8,
									fontSize: 32,
								}}
							>
								{t("login.welcomeBack")}
							</Title>
							<Text
								style={{
									color: "rgba(255, 255, 255, 0.85)",
									fontSize: 15,
								}}
							>
								{t("login.loginPrompt")}
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
								background: "white",
								color: "#00cccc",
								border: "none",
								boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
								transition: "all 0.3s",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform =
									"translateY(-2px)";
								e.currentTarget.style.boxShadow =
									"0 12px 32px rgba(0, 0, 0, 0.25)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform =
									"translateY(0)";
								e.currentTarget.style.boxShadow =
									"0 8px 24px rgba(0, 0, 0, 0.2)";
							}}
						>
							{t("login.loginWithCasdoor")}
						</Button>

						<div
							style={{
								marginTop: 32,
								padding: 20,
								borderRadius: 12,
								background: "rgba(255, 255, 255, 0.1)",
								border: "1px solid rgba(255, 255, 255, 0.15)",
								textAlign: "center",
							}}
						>
							<Text
								style={{
									color: "rgba(255, 255, 255, 0.85)",
									fontSize: 13,
								}}
							>
								{t("login.useCasdoorAccount")}
							</Text>
						</div>
					</div>
				</div>
			</div>

			<style>{`
        @keyframes fadeOut {
          to { opacity: 0; pointer-events: none; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slideLeft {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideRight {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
		</div>
	);
};

export default Login;
