import { useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

// Grace period - only count violation if it lasts > 2 seconds
const GRACE_PERIOD_MS = 2000;

// Detection thresholds (relaxed to reduce false positives)
const LOOKING_AWAY_THRESHOLD = { min: 0.2, max: 0.8 }; // Previous: 0.3-0.7
const LOOKING_UPDOWN_THRESHOLD = { min: 0.3, max: 0.7 }; // Previous: 0.35-0.65
const HEAD_TURNED_THRESHOLD = 0.25; // Previous: 0.15
const EYES_CLOSED_THRESHOLD = 0.12; // Previous: 0.18

export interface ProctoringEvent {
	type:
	| 'face_not_detected'
	| 'multiple_faces'
	| 'looking_away'
	| 'mouth_open'
	| 'head_turned'
	| 'eyes_closed'
	| 'tab_switch'
	| 'fullscreen_exit'
	| 'copy_paste';
	startTime: number;
	endTime: number;
	duration: number;
	snapshotUrl?: string; // Captured when violation starts
	metadata?: {
		action?: 'copy' | 'paste' | 'cut';
		hidden?: boolean;
	};
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
	// Violation refs now store both startTime and snapshotUrl captured at violation start
	const noFaceViolationRef = useRef<{ startTime: number; snapshotUrl?: string } | null>(null);
	const multipleFacesViolationRef = useRef<{ startTime: number; snapshotUrl?: string } | null>(null);
	const lookingAwayViolationRef = useRef<{ startTime: number; snapshotUrl?: string } | null>(null);
	const mouthOpenViolationRef = useRef<{ startTime: number; snapshotUrl?: string } | null>(null);
	const headTurnedViolationRef = useRef<{ startTime: number; snapshotUrl?: string } | null>(null);
	const eyesClosedViolationRef = useRef<{ startTime: number; snapshotUrl?: string } | null>(null);
	// Track if we've notified start of violation (for snapshot capture)
	const notifiedStartRef = useRef<Set<string>>(new Set());

	/**
	 * Capture a snapshot from the video element at violation start
	 * Returns a base64 data URL of the current video frame
	 */
	const captureSnapshot = (): string | undefined => {
		if (!videoElement || videoElement.readyState < 3) {
			return undefined;
		}
		try {
			const canvas = document.createElement('canvas');
			canvas.width = videoElement.videoWidth;
			canvas.height = videoElement.videoHeight;
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
				return canvas.toDataURL('image/jpeg', 0.8);
			}
		} catch (err) {
			console.error('Failed to capture snapshot:', err);
		}
		return undefined;
	};
	const lastDetectionTimeRef = useRef<number>(0);
	const DETECTION_INTERVAL = 250; // Run detection every 250ms (4fps) - reduced for performance
	const MAX_EVENTS = 50; // Cap events to prevent memory leak

	// Helper to add event with cap
	const addEvent = (event: ProctoringEvent) => {
		setEvents((prev) => {
			const newEvents = [...prev, event];
			// Keep only last MAX_EVENTS to prevent memory leak
			return newEvents.length > MAX_EVENTS ? newEvents.slice(-MAX_EVENTS) : newEvents;
		});
	};

	/**
	 * Handle violation end with grace period check
	 * Only notify if violation lasted >= GRACE_PERIOD_MS
	 * This eliminates false positives from brief glances or movements
	 */
	const handleViolationEnd = (
		type: ProctoringEvent['type'],
		startTime: number,
		snapshotUrl?: string,
		skipGracePeriod: boolean = false
	) => {
		const endTime = Date.now();
		const duration = endTime - startTime;

		// Skip if duration is less than grace period (unless bypassed for critical violations)
		if (!skipGracePeriod && duration < GRACE_PERIOD_MS) {
			console.log(`Violation ignored (grace period): ${type} (${duration}ms < ${GRACE_PERIOD_MS}ms)`);
			return;
		}

		const event: ProctoringEvent = {
			type,
			startTime,
			endTime,
			duration,
			snapshotUrl, // Attach snapshot captured at violation start
		};

		console.log(`Violation ended: ${type} (${duration}ms)`);
		addEvent(event);
		onViolation?.(event);
	};

	useEffect(() => {
		if (!enabled || !videoElement) return;

		let mounted = true;

		const initFaceDetection = async () => {
			try {
				const vision = await FilesetResolver.forVisionTasks(
					'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
				);

				// Detect WebGL2 support for GPU acceleration
				const hasWebGL2 = (() => {
					try {
						const canvas = document.createElement('canvas');
						return !!canvas.getContext('webgl2');
					} catch {
						return false;
					}
				})();

				// Try GPU first, fallback to CPU if not available
				let faceLandmarker: FaceLandmarker;
				const modelPath =
					'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

				try {
					if (hasWebGL2) {
						faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
							baseOptions: {
								modelAssetPath: modelPath,
								delegate: 'GPU',
							},
							runningMode: 'VIDEO',
							numFaces: 2,
							minFaceDetectionConfidence: 0.5,
							minFacePresenceConfidence: 0.5,
							minTrackingConfidence: 0.5,
							outputFaceBlendshapes: true,
							outputFacialTransformationMatrixes: false,
						});
						console.log('Face detection: Using GPU acceleration');
					} else {
						throw new Error('WebGL2 not available');
					}
				} catch (gpuError) {
					// Fallback to CPU
					console.warn('GPU acceleration not available, falling back to CPU:', gpuError);
					faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
						baseOptions: {
							modelAssetPath: modelPath,
							delegate: 'CPU',
						},
						runningMode: 'VIDEO',
						numFaces: 2,
						minFaceDetectionConfidence: 0.5,
						minFacePresenceConfidence: 0.5,
						minTrackingConfidence: 0.5,
						outputFaceBlendshapes: true,
						outputFacialTransformationMatrixes: false,
					});
					console.log('Face detection: Using CPU (may be slower)');
				}

				faceLandmarkerRef.current = faceLandmarker;

				const detectFaces = async () => {
					if (!faceLandmarkerRef.current || !videoElement || !mounted) return;

					if (videoElement.readyState >= 3) {
						const now = performance.now();
						// Throttle detection
						if (now - lastDetectionTimeRef.current >= DETECTION_INTERVAL) {
							lastDetectionTimeRef.current = now;
							const startTimeMs = now;
							const results = faceLandmarkerRef.current.detectForVideo(
								videoElement,
								startTimeMs
							);

							const detectionCount = results.faceLandmarks.length;
							setFaceCount(detectionCount);

							// Check violations using landmarks
							let isLookingAway = false;
							let isMouthOpen = false;
							let isHeadTurned = false;
							let areEyesClosed = false;
							if (detectionCount === 1 && results.faceLandmarks[0]) {
								const landmarks = results.faceLandmarks[0];

								// Eye corners and iris positions
								const leftEyeOuter = landmarks[33];
								const leftEyeInner = landmarks[133];
								const leftIris = landmarks[468];

								const rightEyeOuter = landmarks[263];
								const rightEyeInner = landmarks[362];
								const rightIris = landmarks[473];

								// Eye dimensions for gaze and closed eye detection
								const leftEyeTop = landmarks[159];
								const leftEyeBottom = landmarks[145];
								const rightEyeTop = landmarks[386];
								const rightEyeBottom = landmarks[374];

								if (leftIris && rightIris) {
									// Horizontal: Check left/right gaze
									const leftEyeWidth = leftEyeInner.x - leftEyeOuter.x;
									const leftIrisPosX =
										leftEyeWidth !== 0
											? (leftIris.x - leftEyeOuter.x) / leftEyeWidth
											: 0.5;

									const rightEyeWidth = rightEyeInner.x - rightEyeOuter.x;
									const rightIrisPosX =
										rightEyeWidth !== 0
											? (rightIris.x - rightEyeOuter.x) / rightEyeWidth
											: 0.5;

									// Vertical: Check up/down gaze
									const leftEyeHeight = leftEyeBottom.y - leftEyeTop.y;
									const leftIrisPosY =
										leftEyeHeight !== 0
											? (leftIris.y - leftEyeTop.y) / leftEyeHeight
											: 0.5;

									const rightEyeHeight = rightEyeBottom.y - rightEyeTop.y;
									const rightIrisPosY =
										rightEyeHeight !== 0
											? (rightIris.y - rightEyeTop.y) / rightEyeHeight
											: 0.5;

									// Looking away if eyes are not centered (using relaxed thresholds)
									const lookingLeftRight =
										leftIrisPosX < LOOKING_AWAY_THRESHOLD.min ||
										leftIrisPosX > LOOKING_AWAY_THRESHOLD.max ||
										rightIrisPosX < LOOKING_AWAY_THRESHOLD.min ||
										rightIrisPosX > LOOKING_AWAY_THRESHOLD.max;
									const lookingUpDown =
										leftIrisPosY < LOOKING_UPDOWN_THRESHOLD.min ||
										leftIrisPosY > LOOKING_UPDOWN_THRESHOLD.max ||
										rightIrisPosY < LOOKING_UPDOWN_THRESHOLD.min ||
										rightIrisPosY > LOOKING_UPDOWN_THRESHOLD.max;

									isLookingAway = lookingLeftRight || lookingUpDown;

									// Check eyes closed (using eye aspect ratio)
									const leftEyeOpenRatio =
										Math.abs(leftEyeHeight) / Math.abs(leftEyeWidth);
									const rightEyeOpenRatio =
										Math.abs(rightEyeHeight) / Math.abs(rightEyeWidth);
									const avgEyeOpenRatio =
										(leftEyeOpenRatio + rightEyeOpenRatio) / 2;
									areEyesClosed = avgEyeOpenRatio < EYES_CLOSED_THRESHOLD;
								}

								// Check mouth open (upper lip to lower lip distance)
								const upperLip = landmarks[13];
								const lowerLip = landmarks[14];
								const mouthDistance = Math.abs(lowerLip.y - upperLip.y);
								isMouthOpen = mouthDistance > 0.03; // Threshold for open mouth

								// Check head turned (using nose and face width)
								const nose = landmarks[1];
								const leftCheek = landmarks[234];
								const rightCheek = landmarks[454];
								const faceWidth = Math.abs(rightCheek.x - leftCheek.x);
								const noseToCenterX = Math.abs(
									nose.x - (leftCheek.x + rightCheek.x) / 2
								);
								const headTurnRatio = faceWidth > 0 ? noseToCenterX / faceWidth : 0;
								isHeadTurned = headTurnRatio > HEAD_TURNED_THRESHOLD;
							}

							// Draw on canvas (only when showLandmarks is enabled)
							if (showLandmarks && canvasElement) {
								const ctx = canvasElement.getContext('2d');
								if (ctx) {
									ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

									if (results.faceLandmarks.length > 0) {
										results.faceLandmarks.forEach((landmarks) => {
											ctx.fillStyle =
												detectionCount > 1 ? '#ff4d4f' : '#52c41a';
											ctx.strokeStyle =
												detectionCount > 1 ? '#ff4d4f' : '#52c41a';
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
											[468, 473].forEach((idx) => {
												if (landmarks[idx]) {
													const x =
														landmarks[idx].x * canvasElement.width;
													const y =
														landmarks[idx].y * canvasElement.height;
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

							// Track violations - only notify on END (not on start)
							if (detectionCount === 0) {
								if (!noFaceViolationRef.current) {
									noFaceViolationRef.current = {
										startTime: Date.now(),
										snapshotUrl: captureSnapshot(), // Capture snapshot at violation start
									};
									// Don't notify on start - only track. Will notify on end with grace period check.
								}
								// Clear other violations when no face
								if (multipleFacesViolationRef.current) {
									handleViolationEnd('multiple_faces', multipleFacesViolationRef.current.startTime, multipleFacesViolationRef.current.snapshotUrl, true); // skip grace for critical
									multipleFacesViolationRef.current = null;
								}
								if (lookingAwayViolationRef.current) {
									handleViolationEnd('looking_away', lookingAwayViolationRef.current.startTime, lookingAwayViolationRef.current.snapshotUrl);
									lookingAwayViolationRef.current = null;
								}
								if (mouthOpenViolationRef.current) {
									handleViolationEnd('mouth_open', mouthOpenViolationRef.current.startTime, mouthOpenViolationRef.current.snapshotUrl);
									mouthOpenViolationRef.current = null;
								}
								if (headTurnedViolationRef.current) {
									handleViolationEnd('head_turned', headTurnedViolationRef.current.startTime, headTurnedViolationRef.current.snapshotUrl);
									headTurnedViolationRef.current = null;
								}
								if (eyesClosedViolationRef.current) {
									handleViolationEnd('eyes_closed', eyesClosedViolationRef.current.startTime, eyesClosedViolationRef.current.snapshotUrl);
									eyesClosedViolationRef.current = null;
								}
							} else if (detectionCount > 1) {
								if (!multipleFacesViolationRef.current) {
									multipleFacesViolationRef.current = {
										startTime: Date.now(),
										snapshotUrl: captureSnapshot(), // Capture snapshot at violation start
									};
									// Don't notify on start - only track
								}
								// Clear other violations when multiple faces
								if (noFaceViolationRef.current) {
									handleViolationEnd('face_not_detected', noFaceViolationRef.current.startTime, noFaceViolationRef.current.snapshotUrl, true); // critical
									noFaceViolationRef.current = null;
								}
								if (lookingAwayViolationRef.current) {
									handleViolationEnd('looking_away', lookingAwayViolationRef.current.startTime, lookingAwayViolationRef.current.snapshotUrl);
									lookingAwayViolationRef.current = null;
								}
								if (mouthOpenViolationRef.current) {
									handleViolationEnd('mouth_open', mouthOpenViolationRef.current.startTime, mouthOpenViolationRef.current.snapshotUrl);
									mouthOpenViolationRef.current = null;
								}
								if (headTurnedViolationRef.current) {
									handleViolationEnd('head_turned', headTurnedViolationRef.current.startTime, headTurnedViolationRef.current.snapshotUrl);
									headTurnedViolationRef.current = null;
								}
								if (eyesClosedViolationRef.current) {
									handleViolationEnd('eyes_closed', eyesClosedViolationRef.current.startTime, eyesClosedViolationRef.current.snapshotUrl);
									eyesClosedViolationRef.current = null;
								}
							} else {
								// detectionCount === 1 (single face detected)
								if (noFaceViolationRef.current) {
									handleViolationEnd('face_not_detected', noFaceViolationRef.current.startTime, noFaceViolationRef.current.snapshotUrl, true); // critical
									noFaceViolationRef.current = null;
								}
								if (multipleFacesViolationRef.current) {
									handleViolationEnd('multiple_faces', multipleFacesViolationRef.current.startTime, multipleFacesViolationRef.current.snapshotUrl, true); // critical
									multipleFacesViolationRef.current = null;
								}

								// Check looking away for single face
								if (isLookingAway) {
									if (!lookingAwayViolationRef.current) {
										lookingAwayViolationRef.current = { startTime: Date.now(), snapshotUrl: captureSnapshot() };
										// Don't notify on start - only track
									}
								} else {
									if (lookingAwayViolationRef.current) {
										handleViolationEnd('looking_away', lookingAwayViolationRef.current.startTime, lookingAwayViolationRef.current.snapshotUrl);
										lookingAwayViolationRef.current = null;
									}
								}

								// Check mouth open
								if (isMouthOpen) {
									if (!mouthOpenViolationRef.current) {
										mouthOpenViolationRef.current = { startTime: Date.now(), snapshotUrl: captureSnapshot() };
										// Don't notify on start - only track
									}
								} else {
									if (mouthOpenViolationRef.current) {
										handleViolationEnd('mouth_open', mouthOpenViolationRef.current.startTime, mouthOpenViolationRef.current.snapshotUrl);
										mouthOpenViolationRef.current = null;
									}
								}

								// Check head turned
								if (isHeadTurned) {
									if (!headTurnedViolationRef.current) {
										headTurnedViolationRef.current = { startTime: Date.now(), snapshotUrl: captureSnapshot() };
										// Don't notify on start - only track
									}
								} else {
									if (headTurnedViolationRef.current) {
										handleViolationEnd('head_turned', headTurnedViolationRef.current.startTime, headTurnedViolationRef.current.snapshotUrl);
										headTurnedViolationRef.current = null;
									}
								}

								// Check eyes closed
								if (areEyesClosed) {
									if (!eyesClosedViolationRef.current) {
										eyesClosedViolationRef.current = { startTime: Date.now(), snapshotUrl: captureSnapshot() };
										// Don't notify on start - only track
									}
								} else {
									if (eyesClosedViolationRef.current) {
										handleViolationEnd('eyes_closed', eyesClosedViolationRef.current.startTime, eyesClosedViolationRef.current.snapshotUrl);
										eyesClosedViolationRef.current = null;
									}
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
		faceCount,
	};
};
