import React, { useRef, useEffect, useState } from 'react';
import { Alert, Badge, Card, Tag } from 'antd';
import { EyeOutlined, DragOutlined } from '@ant-design/icons';
import { useMediaPipeFaceDetection, ProctoringEvent } from '../../hooks/useProctoring';

interface ProctoringMonitorProps {
  onViolation?: (event: ProctoringEvent) => void;
  showLandmarks?: boolean;
  compact?: boolean;
  violationCount?: number;
}

export const ProctoringMonitor: React.FC<ProctoringMonitorProps> = ({
  onViolation,
  showLandmarks = false,
  compact = false,
  violationCount = 0
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('proctoring-position');
    return saved ? JSON.parse(saved) : { x: 20, y: 20 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.ant-card-head')) {
      setIsDragging(true);
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !cardRef.current) return;

      const cardRect = cardRef.current.getBoundingClientRect();
      let newX = e.clientX - dragOffset.current.x;
      let newY = e.clientY - dragOffset.current.y;

      // Keep card inside viewport
      newX = Math.max(0, Math.min(newX, window.innerWidth - cardRect.width));
      newY = Math.max(0, Math.min(newY, window.innerHeight - cardRect.height));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        localStorage.setItem('proctoring-position', JSON.stringify(position));
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position]);

  // Adjust position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (!cardRef.current) return;

      const cardRect = cardRef.current.getBoundingClientRect();
      let newX = position.x;
      let newY = position.y;

      // Adjust if card is outside viewport
      if (newX + cardRect.width > window.innerWidth) {
        newX = window.innerWidth - cardRect.width;
      }
      if (newY + cardRect.height > window.innerHeight) {
        newY = window.innerHeight - cardRect.height;
      }
      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;

      if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY });
        localStorage.setItem('proctoring-position', JSON.stringify({ x: newX, y: newY }));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on mount

    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  return (
    <div
      ref={cardRef}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      <Card
        title={
          <span style={{ cursor: 'grab', userSelect: 'none' }}>
            <DragOutlined /> Camera giám sát
          </span>
        }
        size="small"
        extra={
          violationCount > 0 && (
            <Tag color="error">Vi phạm: {violationCount}</Tag>
          )
        }
      >
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
              : lastViolation.type === 'multiple_faces'
              ? 'Phát hiện nhiều khuôn mặt'
              : lastViolation.type === 'mouth_open'
              ? 'Phát hiện mở miệng'
              : 'Đang nhìn ra ngoài màn hình'
          }
          showIcon
          style={{ marginTop: 12 }}
        />
      )}
      </Card>
    </div>
  );
};
