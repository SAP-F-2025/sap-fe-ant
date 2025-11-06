import { useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export interface ProctoringEvent {
  type: 'face_not_detected' | 'multiple_faces';
  startTime: number;
  endTime: number;
  duration: number;
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
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const animationFrameRef = useRef<number>();
  const noFaceViolationRef = useRef<{ startTime: number } | null>(null);
  const multipleFacesViolationRef = useRef<{ startTime: number } | null>(null);

  useEffect(() => {
    if (!enabled || !videoElement) return;

    let mounted = true;

    const initFaceDetection = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numFaces: 2,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false
        });

        faceLandmarkerRef.current = faceLandmarker;

        const detectFaces = async () => {
          if (!faceLandmarkerRef.current || !videoElement || !mounted) return;
          
          if (videoElement.readyState >= 3) {
            const startTimeMs = performance.now();
            const results = faceLandmarkerRef.current.detectForVideo(videoElement, startTimeMs);
            
            const detectionCount = results.faceLandmarks.length;
            setFaceCount(detectionCount);

            // Draw on canvas
            if (canvasElement) {
              const ctx = canvasElement.getContext('2d');
              if (ctx) {
                ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
                
                if (showLandmarks && results.faceLandmarks.length > 0) {
                  results.faceLandmarks.forEach((landmarks) => {
                    ctx.fillStyle = detectionCount > 1 ? '#ff4d4f' : '#52c41a';
                    ctx.strokeStyle = detectionCount > 1 ? '#ff4d4f' : '#52c41a';
                    ctx.lineWidth = 1;
                    
                    // Draw landmarks
                    landmarks.forEach((landmark) => {
                      const x = landmark.x * canvasElement.width;
                      const y = landmark.y * canvasElement.height;
                      ctx.beginPath();
                      ctx.arc(x, y, 1, 0, 2 * Math.PI);
                      ctx.fill();
                    });
                  });
                }
              }
            }

            // Track violations - notify on start and end
            if (detectionCount === 0) {
              if (!noFaceViolationRef.current) {
                noFaceViolationRef.current = { startTime: Date.now() };
                const event: ProctoringEvent = {
                  type: 'face_not_detected',
                  startTime: noFaceViolationRef.current.startTime,
                  endTime: 0,
                  duration: 0,
                };
                setEvents(prev => [...prev, event]);
                onViolation?.(event);
              }
              if (multipleFacesViolationRef.current) {
                const endTime = Date.now();
                const event: ProctoringEvent = {
                  type: 'multiple_faces',
                  startTime: multipleFacesViolationRef.current.startTime,
                  endTime,
                  duration: endTime - multipleFacesViolationRef.current.startTime,
                };
                onViolation?.(event);
                multipleFacesViolationRef.current = null;
              }
            } else if (detectionCount > 1) {
              if (!multipleFacesViolationRef.current) {
                multipleFacesViolationRef.current = { startTime: Date.now() };
                const event: ProctoringEvent = {
                  type: 'multiple_faces',
                  startTime: multipleFacesViolationRef.current.startTime,
                  endTime: 0,
                  duration: 0,
                };
                setEvents(prev => [...prev, event]);
                onViolation?.(event);
              }
              if (noFaceViolationRef.current) {
                const endTime = Date.now();
                const event: ProctoringEvent = {
                  type: 'face_not_detected',
                  startTime: noFaceViolationRef.current.startTime,
                  endTime,
                  duration: endTime - noFaceViolationRef.current.startTime,
                };
                onViolation?.(event);
                noFaceViolationRef.current = null;
              }
            } else {
              if (noFaceViolationRef.current) {
                const endTime = Date.now();
                const event: ProctoringEvent = {
                  type: 'face_not_detected',
                  startTime: noFaceViolationRef.current.startTime,
                  endTime,
                  duration: endTime - noFaceViolationRef.current.startTime,
                };
                onViolation?.(event);
                noFaceViolationRef.current = null;
              }
              if (multipleFacesViolationRef.current) {
                const endTime = Date.now();
                const event: ProctoringEvent = {
                  type: 'multiple_faces',
                  startTime: multipleFacesViolationRef.current.startTime,
                  endTime,
                  duration: endTime - multipleFacesViolationRef.current.startTime,
                };
                onViolation?.(event);
                multipleFacesViolationRef.current = null;
              }
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
      faceLandmarkerRef.current?.close();
      faceLandmarkerRef.current = null;
      setIsProcessing(false);
    };
  }, [enabled, videoElement, canvasElement, showLandmarks, onViolation]);

  return {
    events,
    isProcessing,
    faceCount
  };
};
