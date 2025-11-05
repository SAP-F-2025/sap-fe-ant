import { useEffect, useRef, useState } from 'react';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

export interface ProctoringEvent {
  type: 'face_not_detected' | 'multiple_faces';
  timestamp: number;
  confidence?: number;
}

export const useMediaPipeFaceDetection = (
  videoElement: HTMLVideoElement | null,
  canvasElement: HTMLCanvasElement | null,
  enabled: boolean,
  showLandmarks: boolean,
  onViolation?: (event: ProctoringEvent) => void
) => {
  const [events, setEvents] = useState<ProctoringEvent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [faceCount, setFaceCount] = useState(0);
  const faceDetectorRef = useRef<FaceDetector | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!enabled || !videoElement) return;

    let mounted = true;

    const initFaceDetection = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const faceDetector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          minDetectionConfidence: 0.5
        });

        faceDetectorRef.current = faceDetector;

        const detectFaces = async () => {
          if (!faceDetectorRef.current || !videoElement || !mounted) return;
          
          if (videoElement.readyState >= 3) {
            const startTimeMs = performance.now();
            const results = faceDetectorRef.current.detectForVideo(videoElement, startTimeMs);
            
            const detectionCount = results.detections.length;
            setFaceCount(detectionCount);

            // Draw on canvas if enabled
            if (showLandmarks && canvasElement && results.detections.length > 0) {
              const ctx = canvasElement.getContext('2d');
              if (ctx) {
                ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
                
                results.detections.forEach((detection) => {
                  const box = detection.boundingBox;
                  if (box) {
                    ctx.strokeStyle = detectionCount > 1 ? '#ff4d4f' : '#52c41a';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(box.originX, box.originY, box.width, box.height);
                    
                    ctx.fillStyle = detectionCount > 1 ? '#ff4d4f' : '#52c41a';
                    ctx.font = '16px Arial';
                    const confidence = (detection.categories[0].score * 100).toFixed(0);
                    ctx.fillText(`${confidence}%`, box.originX, box.originY - 5);
                  }
                });
              }
            }

            if (detectionCount === 0) {
              const event: ProctoringEvent = {
                type: 'face_not_detected',
                timestamp: Date.now(),
              };
              setEvents(prev => [...prev.slice(-49), event]);
              onViolation?.(event);
            } else if (detectionCount > 1) {
              const event: ProctoringEvent = {
                type: 'multiple_faces',
                timestamp: Date.now(),
                confidence: results.detections[0].categories[0].score,
              };
              setEvents(prev => [...prev.slice(-49), event]);
              onViolation?.(event);
            }
          }

          if (mounted) {
            animationFrameRef.current = requestAnimationFrame(detectFaces);
          }
        };

        if (mounted) {
          setIsProcessing(true);
          detectFaces();
        }
      } catch (err) {
        console.error('Failed to initialize face detection:', err);
        if (mounted) {
          setIsProcessing(false);
        }
      }
    };

    initFaceDetection();

    return () => {
      mounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      faceDetectorRef.current?.close();
      faceDetectorRef.current = null;
      setIsProcessing(false);
    };
  }, [enabled, videoElement, canvasElement, showLandmarks, onViolation]);

  return {
    events,
    isProcessing,
    faceCount
  };
};
