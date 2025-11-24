import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Space, Typography, Alert, Spin, App, theme } from 'antd';
import { CameraOutlined, CheckCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import studentService from '../../services/studentService';
import faceVerificationService from '../../services/faceVerificationService';

const { Title, Text } = Typography;
const { useToken } = theme;

const FaceVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { modal } = App.useApp();
  const { token } = useToken();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const assessmentData = location.state?.assessment;

  useEffect(() => {
    if (!assessmentData) {
      navigate('/student/assessments');
      return;
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setCameraReady(true);
        }
      } catch (err: any) {
        setError(err.message || 'Không thể truy cập camera');
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [assessmentData, navigate]);

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
    if (!user?.id || !assessmentData?.id) return;
    
    setVerifying(true);
    setError(null);

    try {
      const imageBlob = await captureFrame();
      const result = await faceVerificationService.verifyFace(imageBlob);
      
      // console.log('Verification result:', result);

      if (!result.verified) {
        setVerifying(false);
        const similarity = (result.similarity * 100).toFixed(1);
        setError(`Xác thực khuôn mặt thất bại. Độ tương đồng: ${similarity}%. ${result.reason || 'Vui lòng thử lại.'}`);
        return;
      }

      setVerifying(false);
      modal.confirm({
      title: 'Bắt đầu làm bài',
      content: (
        <div>
          <p><strong>{assessmentData.title}</strong></p>
          <p>Thời gian: {assessmentData.duration} phút</p>
          <p>Số lần làm: {assessmentData.attempts_used} / {assessmentData.max_attempts}</p>
          <p>Điểm đạt: {assessmentData.passing_score}%</p>
          <Alert
            message="Khi bạn bắt đầu, đồng hồ sẽ bắt đầu đếm. Hãy đảm bảo kết nối internet ổn định."
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        </div>
      ),
      okText: 'Bắt đầu ngay',
      cancelText: 'Hủy',
      onOk: async () => {
        setVerifying(false);
        setIsStarting(true);
        try {
          const attempt = await studentService.startAttempt({
            assessment_id: assessmentData.id,
            student_id: user.id,
          });
          
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
          
          navigate(`/student/take/${attempt.id}`);
        } catch (error: any) {
          setIsStarting(false);
          modal.error({
            title: 'Lỗi',
            content: error.response?.data?.message || error.message || 'Không thể bắt đầu bài kiểm tra',
          });
        }
      },
    });
    } catch (err: any) {
      setVerifying(false);
      console.error('Verification error:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || err.message || 'Lỗi xác thực khuôn mặt. Vui lòng thử lại.';
      setError(errorMsg);
    }
  };

  if (!assessmentData) return null;

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 24,
      background: token.colorBgLayout
    }}>
      <Card style={{ maxWidth: 800, width: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <CameraOutlined style={{ fontSize: 48, color: token.colorPrimary }} />
            <Title level={3}>Xác thực khuôn mặt</Title>
            <Text type="secondary">
              Vui lòng nhìn thẳng vào camera để xác thực danh tính
            </Text>
          </div>

          <Alert
            message="Xác thực khuôn mặt"
            description="Hệ thống sẽ so sánh khuôn mặt của bạn với ảnh đã đăng ký để xác thực danh tính."
            type="info"
            showIcon
          />

          <div style={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth: 640,
            margin: '0 auto',
            background: '#000',
            borderRadius: 8,
            overflow: 'hidden'
          }}>
            {error ? (
              <Alert type="error" message={error} />
            ) : !cameraReady ? (
              <div style={{ 
                height: 480, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Spin size="large" />
              </div>
            ) : null}
            
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: 'auto',
                transform: 'scaleX(-1)',
                display: cameraReady && !error ? 'block' : 'none'
              }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button
                type="primary"
                size="large"
                icon={<CheckCircleOutlined />}
                onClick={handleVerify}
                disabled={!cameraReady || !!error}
                loading={verifying || isStarting}
              >
                {verifying ? 'Đang xác thực...' : isStarting ? 'Đang bắt đầu...' : 'Xác thực và bắt đầu'}
              </Button>
              {error && (
                <Button
                  size="large"
                  onClick={() => setError(null)}
                >
                  Thử lại
                </Button>
              )}
            </Space>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default FaceVerification;
