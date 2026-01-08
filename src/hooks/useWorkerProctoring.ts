// Hook to use Web Worker for face detection
// Offloads ML processing from main thread for better UI performance
// Uses OffscreenCanvas and ImageBitmap for efficient frame transfer

import { useEffect, useRef, useState, useCallback } from 'react';

// Worker message types (defined inline since we use a public JS worker)
interface WorkerMessage {
	type: 'init' | 'detect' | 'stop';
	frame?: ImageBitmap;
	timestamp?: number;
}

interface WorkerResponse {
	type: 'ready' | 'result' | 'error';
	faceCount?: number;
	isLookingAway?: boolean;
	isMouthOpen?: boolean;
	isHeadTurned?: boolean;
	areEyesClosed?: boolean;
	landmarks?: any[];
	timestamp?: number;
	error?: string;
	delegate?: 'GPU' | 'CPU';
}

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
		| 'copy_paste'
		| 'browser_tamper';
	startTime: number;
	endTime: number;
	duration: number;
	metadata?: {
		action?: 'copy' | 'paste' | 'cut';
		hidden?: boolean;
	};
}

export const useWorkerProctoring = (
	videoElement: HTMLVideoElement | null,
	canvasElement: HTMLCanvasElement | null,
	enabled: boolean,
	showLandmarks: boolean,
	onViolation?: (event: ProctoringEvent) => void
) => {
	const [events, setEvents] = useState<ProctoringEvent[]>([]);
	const [isProcessing, setIsProcessing] = useState(false);
	const [faceCount, setFaceCount] = useState(0);
	const [delegate, setDelegate] = useState<'GPU' | 'CPU' | null>(null);

	const workerRef = useRef<Worker | null>(null);
	const animationFrameRef = useRef<number>();
	const offscreenCanvasRef = useRef<OffscreenCanvas | null>(null);
	const offscreenCtxRef = useRef<OffscreenCanvasRenderingContext2D | null>(null);
	const lastDetectionTimeRef = useRef<number>(0);
	const workerReadyRef = useRef<boolean>(false);

	// Violation tracking refs
	const noFaceViolationRef = useRef<{ startTime: number } | null>(null);
	const multipleFacesViolationRef = useRef<{ startTime: number } | null>(null);
	const lookingAwayViolationRef = useRef<{ startTime: number } | null>(null);
	const mouthOpenViolationRef = useRef<{ startTime: number } | null>(null);
	const headTurnedViolationRef = useRef<{ startTime: number } | null>(null);
	const eyesClosedViolationRef = useRef<{ startTime: number } | null>(null);

	const DETECTION_INTERVAL = 50; // 20fps - reduced for performance
	const MAX_EVENTS = 50;

	const addEvent = useCallback((event: ProctoringEvent) => {
		setEvents((prev) => {
			const newEvents = [...prev, event];
			return newEvents.length > MAX_EVENTS ? newEvents.slice(-MAX_EVENTS) : newEvents;
		});
	}, []);

	const clearViolation = useCallback(
		(
			ref: React.MutableRefObject<{ startTime: number } | null>,
			type: ProctoringEvent['type']
		) => {
			if (ref.current) {
				const endTime = Date.now();
				const event: ProctoringEvent = {
					type,
					startTime: ref.current.startTime,
					endTime,
					duration: endTime - ref.current.startTime,
				};
				onViolation?.(event);
				ref.current = null;
			}
		},
		[onViolation]
	);

	const handleViolation = useCallback(
		(
			isActive: boolean,
			ref: React.MutableRefObject<{ startTime: number } | null>,
			type: ProctoringEvent['type']
		) => {
			if (isActive) {
				if (!ref.current) {
					ref.current = { startTime: Date.now() };
					const event: ProctoringEvent = {
						type,
						startTime: ref.current.startTime,
						endTime: 0,
						duration: 0,
					};
					addEvent(event);
					onViolation?.(event);
				}
			} else {
				clearViolation(ref, type);
			}
		},
		[addEvent, onViolation, clearViolation]
	);

	// Process violations based on detection results
	const processViolations = useCallback(
		(
			detectionCount: number,
			isLookingAway: boolean,
			isMouthOpen: boolean,
			isHeadTurned: boolean,
			areEyesClosed: boolean
		) => {
			if (detectionCount === 0) {
				// No face detected
				if (!noFaceViolationRef.current) {
					noFaceViolationRef.current = { startTime: Date.now() };
					const event: ProctoringEvent = {
						type: 'face_not_detected',
						startTime: noFaceViolationRef.current.startTime,
						endTime: 0,
						duration: 0,
					};
					addEvent(event);
					onViolation?.(event);
				}
				clearViolation(multipleFacesViolationRef, 'multiple_faces');
				clearViolation(lookingAwayViolationRef, 'looking_away');
				clearViolation(mouthOpenViolationRef, 'mouth_open');
				clearViolation(headTurnedViolationRef, 'head_turned');
				clearViolation(eyesClosedViolationRef, 'eyes_closed');
			} else if (detectionCount > 1) {
				// Multiple faces
				if (!multipleFacesViolationRef.current) {
					multipleFacesViolationRef.current = { startTime: Date.now() };
					const event: ProctoringEvent = {
						type: 'multiple_faces',
						startTime: multipleFacesViolationRef.current.startTime,
						endTime: 0,
						duration: 0,
					};
					addEvent(event);
					onViolation?.(event);
				}
				clearViolation(noFaceViolationRef, 'face_not_detected');
				clearViolation(lookingAwayViolationRef, 'looking_away');
				clearViolation(mouthOpenViolationRef, 'mouth_open');
				clearViolation(headTurnedViolationRef, 'head_turned');
				clearViolation(eyesClosedViolationRef, 'eyes_closed');
			} else {
				// Single face - check other violations
				clearViolation(noFaceViolationRef, 'face_not_detected');
				clearViolation(multipleFacesViolationRef, 'multiple_faces');
				handleViolation(isLookingAway, lookingAwayViolationRef, 'looking_away');
				handleViolation(isMouthOpen, mouthOpenViolationRef, 'mouth_open');
				handleViolation(isHeadTurned, headTurnedViolationRef, 'head_turned');
				handleViolation(areEyesClosed, eyesClosedViolationRef, 'eyes_closed');
			}
		},
		[addEvent, onViolation, clearViolation, handleViolation]
	);

	// Handle worker messages
	const handleWorkerMessage = useCallback(
		(e: MessageEvent<WorkerResponse>) => {
			const {
				type,
				faceCount: detectionCount,
				isLookingAway,
				isMouthOpen,
				isHeadTurned,
				areEyesClosed,
				landmarks,
				delegate: workerDelegate,
				error,
			} = e.data;

			if (type === 'ready') {
				setIsProcessing(true);
				workerReadyRef.current = true;
				if (workerDelegate) {
					setDelegate(workerDelegate);
					console.log(`Face detection worker ready: Using ${workerDelegate}`);
				}
				return;
			}

			if (type === 'error') {
				console.error('Worker error:', error);
				return;
			}

			if (type === 'result' && detectionCount !== undefined) {
				setFaceCount(detectionCount);

				// Draw landmarks if enabled
				if (showLandmarks && canvasElement && landmarks && landmarks.length > 0) {
					const ctx = canvasElement.getContext('2d');
					if (ctx) {
						ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
						landmarks.forEach((faceLandmarks: any[]) => {
							ctx.fillStyle = detectionCount > 1 ? '#ff4d4f' : '#52c41a';
							faceLandmarks.forEach((landmark: any) => {
								const x = landmark.x * canvasElement.width;
								const y = landmark.y * canvasElement.height;
								ctx.beginPath();
								ctx.arc(x, y, 1, 0, 2 * Math.PI);
								ctx.fill();
							});
						});
					}
				}

				processViolations(
					detectionCount,
					isLookingAway || false,
					isMouthOpen || false,
					isHeadTurned || false,
					areEyesClosed || false
				);
			}
		},
		[showLandmarks, canvasElement, processViolations]
	);

	// Store callback in ref to avoid stale closures
	const handleWorkerMessageRef = useRef(handleWorkerMessage);
	handleWorkerMessageRef.current = handleWorkerMessage;

	useEffect(() => {
		if (!enabled || !videoElement) return;

		// Prevent multiple workers
		if (workerRef.current) {
			return;
		}

		let mounted = true;

		// Create OffscreenCanvas for efficient frame capture
		// Reduced resolution for performance
		offscreenCanvasRef.current = new OffscreenCanvas(320, 240);
		offscreenCtxRef.current = offscreenCanvasRef.current.getContext('2d', {
			willReadFrequently: true,
		});

		// Detection loop - captures frames and sends to worker as ImageBitmap
		const detectLoop = () => {
			if (!mounted || !workerRef.current || !videoElement || !workerReadyRef.current) {
				if (mounted) {
					animationFrameRef.current = requestAnimationFrame(detectLoop);
				}
				return;
			}

			if (videoElement.readyState >= 3) {
				const now = performance.now();
				if (now - lastDetectionTimeRef.current >= DETECTION_INTERVAL) {
					lastDetectionTimeRef.current = now;

					const offscreen = offscreenCanvasRef.current;
					const ctx = offscreenCtxRef.current;

					if (offscreen && ctx) {
						// Draw video frame to offscreen canvas
						ctx.drawImage(videoElement, 0, 0, offscreen.width, offscreen.height);

						// Transfer as ImageBitmap (efficient, zero-copy transfer)
						const imageBitmap = offscreen.transferToImageBitmap();

						// Send to worker with transfer (ownership moves to worker)
						workerRef.current?.postMessage(
							{
								type: 'detect',
								frame: imageBitmap,
								timestamp: now,
							} as WorkerMessage,
							[imageBitmap] // Transfer list - ownership moves to worker
						);
					}
				}
			}

			if (mounted) {
				animationFrameRef.current = requestAnimationFrame(detectLoop);
			}
		};

		// Create classic worker from public folder (not module)
		// Classic worker uses importScripts which MediaPipe requires
		console.log('Creating classic worker...');
		workerRef.current = new Worker('/faceDetectionWorker.js');
		console.log('Worker created:', workerRef.current);

		// Handle worker messages
		workerRef.current.onmessage = (e: MessageEvent<WorkerResponse>) => {
			console.log('Worker message received:', e.data.type);
			handleWorkerMessageRef.current(e);

			// Start detection loop when worker is ready
			if (e.data.type === 'ready' && !animationFrameRef.current) {
				console.log('Worker ready, starting detection loop');
				detectLoop();
			}
		};

		workerRef.current.onerror = (e) => {
			console.error('Worker error event:', e);
		};

		// Initialize worker
		console.log('Sending init message to worker...');
		workerRef.current.postMessage({ type: 'init' } as WorkerMessage);

		return () => {
			mounted = false;
			workerReadyRef.current = false;
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = undefined;
			}
			if (workerRef.current) {
				workerRef.current.postMessage({ type: 'stop' } as WorkerMessage);
				workerRef.current.terminate();
				workerRef.current = null;
			}
			setIsProcessing(false);
		};
	}, [enabled, videoElement]);

	return {
		events,
		isProcessing,
		faceCount,
		delegate,
	};
};
