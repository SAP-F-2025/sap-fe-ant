import { CheckCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Modal, Space, Spin, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import faceVerificationService from '../../services/faceVerificationService';

const { Text } = Typography;

interface InTestFaceVerificationModalProps {
	open: boolean;
	onSuccess: () => void;
	onFail: () => void;
}

export const InTestFaceVerificationModal: React.FC<InTestFaceVerificationModalProps> = ({
	open,
	onSuccess,
	onFail,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const [verifying, setVerifying] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [cameraReady, setCameraReady] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		if (open) {
			startCamera();
		} else {
			stopCamera();
		}
		return () => stopCamera();
	}, [open]);

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
			setError(null);
		} catch (err) {
			setError(t('proctoring.inTestFaceVerification.cameraError'));
			console.error('Camera error:', err);
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
				if (blob) {
					resolve(blob);
				} else {
					reject(new Error('Failed to capture image'));
				}
			}, 'image/jpeg', 0.95);
		});
	};

	const handleVerify = async () => {
		setVerifying(true);
		setError(null);

		try {
			const imageBlob = await captureFrame();
			const result = await faceVerificationService.verifyFace(imageBlob);

			if (result.verified) {
				onSuccess();
			} else {
				const similarity = (result.similarity * 100).toFixed(1);
				setError(t('proctoring.inTestFaceVerification.verificationFailed', { similarity, reason: result.reason || t('proctoring.inTestFaceVerification.pleaseTryAgain') }));
			}
		} catch (err: any) {
			setError(err.response?.data?.detail || t('proctoring.inTestFaceVerification.verificationError'));
			console.error('Verification error:', err);
		} finally {
			setVerifying(false);
		}
	};

	return (
		<Modal
			title={t('proctoring.inTestFaceVerification.title')}
			open={open}
			closable={false}
			maskClosable={false}
			footer={[
				<Button
					key="verify"
					type="primary"
					icon={<CheckCircleOutlined />}
					onClick={handleVerify}
					loading={verifying}
					disabled={!cameraReady || !!error}
				>
					{t('proctoring.inTestFaceVerification.verify')}
				</Button>,
				error && (
					<Button
						key="retry"
						onClick={() => setError(null)}
					>
						{t('proctoring.inTestFaceVerification.retry')}
					</Button>
				),
			].filter(Boolean)}
			width={600}
		>
			<Space direction="vertical" style={{ width: '100%' }} size="large">
				<Alert
					message={t('proctoring.inTestFaceVerification.faceChangeDetected')}
					description={t('proctoring.inTestFaceVerification.faceChangeDescription')}
					type="warning"
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
							<Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
								{t('proctoring.inTestFaceVerification.startingCamera')}
							</Text>
						</div>
					)}
				</div>

				{error && (
					<Alert message={error} type="error" showIcon />
				)}
			</Space>
		</Modal>
	);
};
