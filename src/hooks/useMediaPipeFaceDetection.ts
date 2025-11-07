import { useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export interface ProctoringEvent {
  type: 'face_not_detected' | 'multiple_faces' | 'looking_away';
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
  const lookingAwayViolationRef = useRef<{ startTime: number } | null>(null);

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
          outputFaceBlendshapes: true,
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

            // Check if looking away using iris position (more accurate)
            let isLookingAway = false;
            if (detectionCount === 1 && results.faceLandmarks[0]) {
              const landmarks = results.faceLandmarks[0];
              
              // Eye corners and iris positions
              const leftEyeOuter = landmarks[33];
              const leftEyeInner = landmarks[133];
              const leftIris = landmarks[468];
              
              const rightEyeOuter = landmarks[263];
              const rightEyeInner = landmarks[362];
              const rightIris = landmarks[473];
              
              if (leftIris && rightIris) {
                // Calculate normalized iris positions
                const leftEyeWidth = leftEyeInner.x - leftEyeOuter.x;
                const leftIrisPos = leftEyeWidth !== 0 ? (leftIris.x - leftEyeOuter.x) / leftEyeWidth : 0.5;
                
                const rightEyeWidth = rightEyeInner.x - rightEyeOuter.x;
                const rightIrisPos = rightEyeWidth !== 0 ? (rightIris.x - rightEyeOuter.x) / rightEyeWidth : 0.5;
                
                console.log('Left eye:', leftIrisPos.toFixed(2), '| Right eye:', rightIrisPos.toFixed(2));
                
                // Looking away if EITHER eye is not centered (threshold: 0.3-0.7)
                isLookingAway = leftIrisPos < 0.3 || leftIrisPos > 0.7 || rightIrisPos < 0.3 || rightIrisPos > 0.7;
              }
            }

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
                    
                    // Draw all landmarks
                    landmarks.forEach((landmark, idx) => {
                      const x = landmark.x * canvasElement.width;
                      const y = landmark.y * canvasElement.height;
                      ctx.beginPath();
                      ctx.arc(x, y, 1, 0, 2 * Math.PI);
                      ctx.fill();
                    });
                    
                    // Highlight iris landmarks (468 = left, 473 = right)
                    [468, 473].forEach(idx => {
                      if (landmarks[idx]) {
                        const x = landmarks[idx].x * canvasElement.width;
                        const y = landmarks[idx].y * canvasElement.height;
                        ctx.fillStyle = '#1890ff';
                        ctx.beginPath();
                        ctx.arc(x, y, 4, 0, 2 * Math.PI);
                        ctx.fill();
                      }
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

              // Check looking away for single face
              if (isLookingAway) {
                if (!lookingAwayViolationRef.current) {
                  lookingAwayViolationRef.current = { startTime: Date.now() };
                  const event: ProctoringEvent = {
                    type: 'looking_away',
                    startTime: lookingAwayViolationRef.current.startTime,
                    endTime: 0,
                    duration: 0,
                  };
                  setEvents(prev => [...prev, event]);
                  onViolation?.(event);
                }
              } else {
                if (lookingAwayViolationRef.current) {
                  const endTime = Date.now();
                  const event: ProctoringEvent = {
                    type: 'looking_away',
                    startTime: lookingAwayViolationRef.current.startTime,
                    endTime,
                    duration: endTime - lookingAwayViolationRef.current.startTime,
                  };
                  onViolation?.(event);
                  lookingAwayViolationRef.current = null;
                }
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
