import React, { useRef, useEffect, useState } from 'react';
import {
	Card,
	Button,
	Space,
	Typography,
	Alert,
	Spin,
	App,
	theme,
	Steps,
	Row,
	Col,
	Tag,
} from 'antd';
import {
	CameraOutlined,
	CheckCircleOutlined,
	PlayCircleOutlined,
	ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import studentService from '../../services/studentService';
import faceVerificationService from '../../services/faceVerificationService';

const { Title, Text } = Typography;
const { useToken } = theme;

const FaceVerification: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useAuth();
	const { modal, message } = App.useApp();
	const { token } = useToken();
	const { t } = useTranslation();
	const videoRef = useRef<HTMLVideoElement>(null);
	const [cameraReady, setCameraReady] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [permissionDenied, setPermissionDenied] = useState(false);
	const [isStarting, setIsStarting] = useState(false);
	const [verifying, setVerifying] = useState(false);
	const [registering, setRegistering] = useState(false);
	const [checkingStatus, setCheckingStatus] = useState(true);
	const [isRegistered, setIsRegistered] = useState(false);
	const streamRef = useRef<MediaStream | null>(null);

	const assessmentData = location.state?.assessment;

	useEffect(() => {
		if (!assessmentData) {
			navigate('/student/assessments');
			return;
		}
		checkRegistration();
	}, [assessmentData, navigate]);

	const checkRegistration = async () => {
		try {
			const status = await faceVerificationService.checkRegistrationStatus();
			setIsRegistered(status.registered);
		} catch (err) {
			console.error('Failed to check registration:', err);
			// Assume not registered or error, but let's try to proceed to camera to at least show something
		} finally {
			setCheckingStatus(false);
			startCamera();
		}
	};

	const startCamera = async () => {
		setError(null);
		setPermissionDenied(false);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { width: 640, height: 480 },
			});

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				streamRef.current = stream;
				setCameraReady(true);
			}
		} catch (err: any) {
			console.error('Camera error:', err);
			if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
				setPermissionDenied(true);
				setError(t('faceVerification.cameraPermissionError'));
			} else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
				setError(t('faceVerification.cameraNotFoundError'));
			} else {
				setError(err.message || t('faceVerification.cameraAccessError'));
			}
		}
	};

	useEffect(() => {
		return () => {
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

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
			canvas.toBlob(
				(blob) => {
					if (blob) {
						resolve(blob);
					} else {
						reject(new Error('Failed to capture image'));
					}
				},
				'image/jpeg',
				0.95
			);
		});
	};

	const handleRegister = async () => {
		setRegistering(true);
		setError(null);
		try {
			const imageBlob = await captureFrame();
			await faceVerificationService.registerFace(imageBlob);
			message.success(t('faceVerification.registerSuccess'));
			setIsRegistered(true);
		} catch (err: any) {
			console.error('Registration error:', err);
			setError(err.message || t('faceVerification.registerError'));
		} finally {
			setRegistering(false);
		}
	};

	const handleVerify = async () => {
		if (!user?.id || !assessmentData?.id) return;

		setVerifying(true);
		setError(null);

		try {
			const imageBlob = await captureFrame();
			const result = await faceVerificationService.verifyFace(imageBlob);

			if (!result.verified) {
				setVerifying(false);
				const similarity = (result.similarity * 100).toFixed(1);
				setError(
					t('faceVerification.verifyFailed', {
						similarity,
						reason: result.reason || t('faceVerification.verifyFailedHint'),
					})
				);
				return;
			}

			setVerifying(false);
			// Proceed to start
			startAssessment();
		} catch (err: any) {
			setVerifying(false);
			console.error('Verification error:', err);
			const errorMsg = err.message || t('faceVerification.verifyError');
			setError(errorMsg);
		}
	};

	const startAssessment = () => {
		modal.confirm({
			title: t('faceVerification.startExamTitle'),
			content: (
				<div>
					<p>
						<strong>{assessmentData.title}</strong>
					</p>
					<p>
						{t('faceVerification.duration')}: {assessmentData.duration}{' '}
						{t('common.minutes')}
					</p>
					<Alert
						message={t('faceVerification.goodLuck')}
						type="success"
						showIcon
						style={{ marginTop: 16 }}
					/>
				</div>
			),
			okText: t('faceVerification.startNow'),
			cancelText: t('common.cancel'),
			onOk: async () => {
				setIsStarting(true);
				try {
					const attempt = await studentService.startAttempt({
						assessment_id: assessmentData.id,
						student_id: user?.id || '',
					});

					if (streamRef.current) {
						streamRef.current.getTracks().forEach((track) => track.stop());
					}

					navigate(`/student/take/${attempt.id}`);
				} catch (error: any) {
					setIsStarting(false);
					modal.error({
						title: t('common.error'),
						content:
							error.response?.data?.message ||
							error.message ||
							t('faceVerification.startError'),
					});
				}
			},
		});
	};

	if (!assessmentData) return null;

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: 24,
				background: token.colorBgLayout,
			}}
		>
			<Card style={{ maxWidth: 900, width: '100%' }}>
				<Row gutter={[24, 24]}>
					{/* Left Side: Instructions & Status */}
					<Col xs={24} md={10}>
						<Space direction="vertical" size="large" style={{ width: '100%' }}>
							<div>
								<Title level={3} style={{ marginBottom: 0 }}>
									{assessmentData.title}
								</Title>
								<Text type="secondary">{t('faceVerification.preparingRoom')}</Text>
							</div>

							<Card size="small" style={{ background: token.colorFillAlter }}>
								<Space direction="vertical" size="small">
									<Space>
										<Text type="secondary">
											{t('faceVerification.duration')}:
										</Text>
										<Text strong>
											{assessmentData.duration} {t('common.minutes')}
										</Text>
									</Space>
									<Space>
										<Text type="secondary">
											{t('faceVerification.attemptsUsed')}:
										</Text>
										<Text strong>
											{assessmentData.attempts_used} /{' '}
											{assessmentData.max_attempts}
										</Text>
									</Space>
									<Space>
										<Text type="secondary">
											{t('faceVerification.passingScore')}:
										</Text>
										<Text strong>{assessmentData.passing_score}%</Text>
									</Space>
								</Space>
							</Card>

							<div style={{ padding: '0 12px' }}>
								<Steps
									direction="vertical"
									current={checkingStatus ? 0 : isRegistered ? 2 : 1}
									items={[
										{
											title: t('faceVerification.steps.deviceCheck'),
											description: t(
												'faceVerification.steps.deviceCheckDesc'
											),
											status: cameraReady ? 'finish' : 'process',
										},
										{
											title: t('faceVerification.steps.faceRegister'),
											description: t(
												'faceVerification.steps.faceRegisterDesc'
											),
											status: isRegistered
												? 'finish'
												: checkingStatus
													? 'wait'
													: 'process',
										},
										{
											title: t('faceVerification.steps.identityVerify'),
											description: t(
												'faceVerification.steps.identityVerifyDesc'
											),
											status: isRegistered ? 'process' : 'wait',
										},
									]}
								/>
							</div>

							<Button
								icon={<ArrowLeftOutlined />}
								onClick={() => navigate('/student/assessments')}
							>
								{t('faceVerification.backToList')}
							</Button>
						</Space>
					</Col>

					{/* Right Side: Camera & Actions */}
					<Col xs={24} md={14}>
						<Card
							title={
								isRegistered
									? t('faceVerification.identityVerificationTitle')
									: t('faceVerification.faceRegisterTitle')
							}
							extra={
								isRegistered ? (
									<Tag color="blue">{t('faceVerification.step3')}</Tag>
								) : (
									<Tag color="orange">{t('faceVerification.step2')}</Tag>
								)
							}
						>
							<div
								style={{
									position: 'relative',
									width: '100%',
									background: '#000',
									borderRadius: 8,
									overflow: 'hidden',
									aspectRatio: '4/3',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									marginBottom: 16,
								}}
							>
								{permissionDenied ? (
									<div
										style={{
											textAlign: 'center',
											padding: 20,
											color: '#fff',
										}}
									>
										<Title level={4} style={{ color: '#fff' }}>
											{t('faceVerification.permissionDenied')}
										</Title>
										<Text
											style={{
												color: 'rgba(255,255,255,0.8)',
											}}
										>
											{t('faceVerification.allowCameraAccess')}
										</Text>
										<Button
											type="primary"
											onClick={startCamera}
											style={{ marginTop: 16 }}
										>
											{t('faceVerification.retry')}
										</Button>
									</div>
								) : error && !cameraReady ? (
									<div
										style={{
											textAlign: 'center',
											padding: 20,
											color: '#fff',
										}}
									>
										<Title level={4} style={{ color: '#ff4d4f' }}>
											{t('faceVerification.cameraError')}
										</Title>
										<Text
											style={{
												color: 'rgba(255,255,255,0.8)',
											}}
										>
											{error}
										</Text>
										<Button
											type="primary"
											onClick={startCamera}
											style={{ marginTop: 16 }}
										>
											{t('faceVerification.retry')}
										</Button>
									</div>
								) : !cameraReady ? (
									<div style={{ textAlign: 'center' }}>
										<Spin size="large" />
										<div
											style={{
												marginTop: 16,
												color: '#fff',
											}}
										>
											{t('faceVerification.startingCamera')}
										</div>
									</div>
								) : null}

								<video
									ref={videoRef}
									autoPlay
									playsInline
									muted
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										transform: 'scaleX(-1)',
										display:
											cameraReady && !permissionDenied ? 'block' : 'none',
									}}
								/>
							</div>

							{error && cameraReady && (
								<Alert
									type="error"
									message={error}
									showIcon
									style={{ marginBottom: 16 }}
								/>
							)}

							<div style={{ textAlign: 'center' }}>
								{checkingStatus ? (
									<Spin tip={t('faceVerification.checkingStatus')} />
								) : isRegistered ? (
									<Button
										type="primary"
										size="large"
										icon={<CheckCircleOutlined />}
										onClick={handleVerify}
										disabled={!cameraReady || !!error}
										loading={verifying || isStarting}
										block
									>
										{verifying
											? t('faceVerification.verifying')
											: t('faceVerification.verifyAndStart')}
									</Button>
								) : (
									<Space direction="vertical" style={{ width: '100%' }}>
										<Alert
											type="info"
											message={t('faceVerification.noFaceData')}
											showIcon
											style={{ textAlign: 'left' }}
										/>
										<Button
											type="primary"
											size="large"
											icon={<CameraOutlined />}
											onClick={handleRegister}
											disabled={!cameraReady || !!error}
											loading={registering}
											block
										>
											{registering
												? t('faceVerification.registering')
												: t('faceVerification.captureToRegister')}
										</Button>
									</Space>
								)}
							</div>
						</Card>
					</Col>
				</Row>
			</Card>
		</div>
	);
};

export default FaceVerification;
