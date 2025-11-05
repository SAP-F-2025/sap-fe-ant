import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Space, Typography, Alert, Switch, Statistic } from 'antd';
import { CameraOutlined, StopOutlined } from '@ant-design/icons';
import { useMediaPipeFaceDetection } from '../../hooks/useMediaPipeFaceDetection';

const { Text } = Typography;

export const MediaPipeCameraTest: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [violations, setViolations] = useState<Array<{ type: string; timestamp: number }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { 
    isProcessing, 
    faceCount
  } = useMediaPipeFaceDetection(
    videoRef.current,
    canvasRef.current,
    enabled && videoReady,
    showLandmarks,
    (event) => {
      setViolations(prev => [...prev, event]);
    }
  );

  useEffect(() => {
    if (!enabled || !videoRef.current) return;

    let mounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });

        if (mounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setError(null);
          
          videoRef.current.onloadedmetadata = () => {
            setVideoReady(true);
          };
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to access camera');
        }
      }
    };

    startCamera();

    return () => {
      mounted = false;
      setVideoReady(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [enabled]);



  const handleStart = () => {
    setEnabled(true);
  };

  const handleStop = () => {
    setEnabled(false);
    setViolations([]);
  };

  return (
    <Card title="MediaPipe Face Detection Test">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {error && (
          <Alert 
            type="error" 
            message={error} 
            showIcon 
          />
        )}

        <Space>
          <Button 
            type="primary" 
            icon={<CameraOutlined />}
            onClick={handleStart}
            disabled={enabled}
          >
            Start Camera
          </Button>
          <Button 
            danger
            icon={<StopOutlined />}
            onClick={handleStop}
            disabled={!enabled}
          >
            Stop Camera
          </Button>
          <Switch 
            checked={showLandmarks}
            onChange={setShowLandmarks}
            checkedChildren="Landmarks ON"
            unCheckedChildren="Landmarks OFF"
          />
        </Space>

        <div style={{ position: 'relative', width: 640, height: 480 }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: '100%', height: '100%', backgroundColor: '#000', transform: 'scaleX(-1)' }}
          />
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            style={{ position: 'absolute', top: 0, left: 0, transform: 'scaleX(-1)' }}
          />
        </div>

        <Space size="large">
          <Statistic title="Faces Detected" value={faceCount} />
          <Statistic title="Violations" value={violations.length} />
          <Text type={isProcessing ? 'success' : 'secondary'}>
            Status: {isProcessing ? 'Processing' : 'Idle'}
          </Text>
        </Space>

        {violations.length > 0 && (
          <div>
            <Text strong>Recent Violations:</Text>
            <ul>
              {violations.slice(-5).reverse().map((v, i) => (
                <li key={i}>
                  {v.type} at {new Date(v.timestamp).toLocaleTimeString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Space>
    </Card>
  );
};
