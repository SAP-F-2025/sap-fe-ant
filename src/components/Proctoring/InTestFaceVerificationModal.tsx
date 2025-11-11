import React, { useRef, useState, useEffect } from 'react';
import { Modal, Button, Alert, Space, Typography, Spin } from 'antd';
import { CameraOutlined, CheckCircleOutlined } from '@ant-design/icons';
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
      setError('Không thể truy cập camera. Vui lòng cho phép quyền camera.');
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
        setError(`Xác thực thất bại. Độ tương đồng: ${similarity}%. ${result.reason || 'Vui lòng thử lại.'}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Lỗi xác thực khuôn mặt. Vui lòng thử lại.');
      console.error('Verification error:', err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Modal
      title="Xác thực khuôn mặt"
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
          Xác thực
        </Button>,
        error && (
          <Button
            key="retry"
            onClick={() => setError(null)}
          >
            Thử lại
          </Button>
        ),
      ].filter(Boolean)}
      width={600}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Alert
          message="Phát hiện thay đổi khuôn mặt"
          description="Hệ thống phát hiện có sự thay đổi về số lượng người. Vui lòng xác thực lại danh tính để tiếp tục."
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
                Đang khởi động camera...
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
