import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Space, Typography, Alert, Spin, App } from 'antd';
import { CameraOutlined, CheckCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import studentService from '../../services/studentService';

const { Title, Text } = Typography;

const FaceVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { modal } = App.useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
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

  const handleVerify = () => {
    if (!user?.id || !assessmentData?.id) return;
    
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
  };

  if (!assessmentData) return null;

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 24,
      background: '#f0f2f5'
    }}>
      <Card style={{ maxWidth: 800, width: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <CameraOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            <Title level={3}>Xác thực khuôn mặt</Title>
            <Text type="secondary">
              Vui lòng nhìn thẳng vào camera để xác thực danh tính
            </Text>
          </div>

          <Alert
            message="Đây là tính năng xác thực khuôn mặt (placeholder)"
            description="Tính năng này sẽ được triển khai đầy đủ trong tương lai"
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
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={handleVerify}
              disabled={!cameraReady || !!error}
              loading={isStarting}
            >
              {isStarting ? 'Đang bắt đầu...' : 'Xác nhận và bắt đầu'}
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default FaceVerification;
