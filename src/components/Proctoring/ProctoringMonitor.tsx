import React, { useRef, useEffect, useState } from 'react';
import { Alert, Badge } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useMediaPipeFaceDetection, ProctoringEvent } from '../../hooks/useMediaPipeFaceDetection';

interface ProctoringMonitorProps {
  onViolation?: (event: ProctoringEvent) => void;
  showLandmarks?: boolean;
  compact?: boolean;
}

export const ProctoringMonitor: React.FC<ProctoringMonitorProps> = ({
  onViolation,
  showLandmarks = false,
  compact = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [lastViolation, setLastViolation] = useState<ProctoringEvent | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const violationTimeoutRef = useRef<NodeJS.Timeout>();

  const { isProcessing, faceCount } = useMediaPipeFaceDetection(
    videoRef.current,
    canvasRef.current,
    videoReady,
    showLandmarks,
    (event) => {
      setLastViolation(event);
      
      // Only count violation on start (duration === 0)
      if (event.duration === 0) {
        onViolation?.(event);
      }
      
      if (violationTimeoutRef.current) {
        clearTimeout(violationTimeoutRef.current);
      }
      
      // Only set timeout if violation ended (has duration)
      if (event.duration > 0) {
        violationTimeoutRef.current = setTimeout(() => {
          setLastViolation(null);
        }, 5000);
      }
    }
  );

  useEffect(() => {
    if (!videoRef.current) return;

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
      if (violationTimeoutRef.current) {
        clearTimeout(violationTimeoutRef.current);
      }
    };
  }, []);

  const size = compact ? { width: 320, height: 240 } : { width: 640, height: 480 };

  return (
    <div>
      {error && (
        <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />
      )}

      <div style={{ position: 'relative', width: size.width, height: size.height }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            borderRadius: 8,
            transform: 'scaleX(-1)'
          }}
        />
        <canvas
          ref={canvasRef}
          width={size.width}
          height={size.height}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'scaleX(-1)'
          }}
        />
        
        <div style={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 8
        }}>
          <Badge
            count={faceCount}
            showZero
            style={{ backgroundColor: faceCount === 1 ? '#52c41a' : '#ff4d4f' }}
          >
            <div style={{
              background: 'rgba(0,0,0,0.6)',
              padding: '4px 8px',
              borderRadius: 4,
              color: 'white',
              fontSize: 12
            }}>
              <EyeOutlined /> Faces
            </div>
          </Badge>
          
          {isProcessing && (
            <div style={{
              background: 'rgba(82, 196, 26, 0.8)',
              padding: '4px 8px',
              borderRadius: 4,
              color: 'white',
              fontSize: 12
            }}>
              Monitoring
            </div>
          )}
        </div>
      </div>

      {lastViolation && (
        <Alert
          type={lastViolation.duration === 0 ? 'error' : 'warning'}
          message={
            lastViolation.type === 'face_not_detected'
              ? 'Không phát hiện khuôn mặt'
              : 'Phát hiện nhiều khuôn mặt'
          }
          showIcon
          style={{ marginTop: 12 }}
        />
      )}
    </div>
  );
};
