/// <reference lib="webworker" />

// Face Detection Web Worker with fetch/eval workaround for MediaPipe
// Uses ImageBitmap for efficient frame transfer from main thread
// Based on community workarounds from GitHub issue #5257

declare const self: DedicatedWorkerGlobalScope;

// Message types
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

let FaceLandmarker: any = null;
let faceLandmarker: any = null;
let isReady = false;

// Initialize MediaPipe using fetch/eval workaround for WASM loader
async function initFaceDetection() {
	try {
		// Dynamic import of MediaPipe
		const mediapipe = await import('@mediapipe/tasks-vision');
		FaceLandmarker = mediapipe.FaceLandmarker;
		const FilesetResolver = mediapipe.FilesetResolver;

		// Get the vision file paths - with timeout to detect hangs
		// Get the vision file paths - with timeout to detect hangs
		const timeoutPromise = new Promise((_, reject) =>
			setTimeout(
				() => reject(new Error('FilesetResolver.forVisionTasks timed out after 30s')),
				30000
			)
		);
		const visionFilesPromise = FilesetResolver.forVisionTasks(
			'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
		);

		let visionFiles: any;
		try {
			visionFiles = await Promise.race([visionFilesPromise, timeoutPromise]);
		} catch (raceError: any) {
			console.error('Worker: FilesetResolver failed or timed out:', raceError);
			throw raceError;
		}

		// Workaround: fetch and eval the wasmLoaderPath to set globalThis.ModuleFactory
		// This prevents the importScripts error in module workers
		if (visionFiles.wasmLoaderPath) {
			try {
				const response = await fetch(visionFiles.wasmLoaderPath);
				const loaderScript = await response.text();
				// Eval sets globalThis.ModuleFactory which MediaPipe needs
				(0, eval)(loaderScript);
				// Remove the path so MediaPipe doesn't try to importScripts it again
				delete visionFiles.wasmLoaderPath;
			} catch (wasmError) {
				console.warn('Worker: WASM loader fetch failed:', wasmError);
			}
		}

		const modelPath =
			'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

		// Try GPU first, fallback to CPU
		let delegate: 'GPU' | 'CPU' = 'CPU';
		try {
			faceLandmarker = await FaceLandmarker.createFromOptions(visionFiles, {
				baseOptions: {
					modelAssetPath: modelPath,
					delegate: 'GPU',
				},
				runningMode: 'IMAGE',
				numFaces: 2,
				minFaceDetectionConfidence: 0.5,
				minFacePresenceConfidence: 0.5,
				minTrackingConfidence: 0.5,
				outputFaceBlendshapes: true,
				outputFacialTransformationMatrixes: false,
			});
			delegate = 'GPU';
		} catch (gpuError) {
			console.warn('Worker: GPU not available, using CPU:', gpuError);
			faceLandmarker = await FaceLandmarker.createFromOptions(visionFiles, {
				baseOptions: {
					modelAssetPath: modelPath,
					delegate: 'CPU',
				},
				runningMode: 'IMAGE',
				numFaces: 2,
				minFaceDetectionConfidence: 0.5,
				minFacePresenceConfidence: 0.5,
				minTrackingConfidence: 0.5,
				outputFaceBlendshapes: true,
				outputFacialTransformationMatrixes: false,
			});
		}

		isReady = true;
		self.postMessage({ type: 'ready', delegate } as WorkerResponse);
	} catch (error: any) {
		console.error('Worker init error:', error);
		self.postMessage({
			type: 'error',
			error: error.message || 'Failed to initialize face detection',
		} as WorkerResponse);
	}
}

// Process a single frame (ImageBitmap)
function detectFaces(frame: ImageBitmap, timestamp: number) {
	if (!faceLandmarker || !isReady) {
		// Close the frame to free memory
		frame.close();
		return;
	}

	try {
		// Detect faces using the ImageBitmap directly
		const results = faceLandmarker.detect(frame);
		const detectionCount = results.faceLandmarks.length;

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

			// Eye dimensions
			const leftEyeTop = landmarks[159];
			const leftEyeBottom = landmarks[145];
			const rightEyeTop = landmarks[386];
			const rightEyeBottom = landmarks[374];

			if (leftIris && rightIris) {
				// Horizontal gaze
				const leftEyeWidth = leftEyeInner.x - leftEyeOuter.x;
				const leftIrisPosX =
					leftEyeWidth !== 0 ? (leftIris.x - leftEyeOuter.x) / leftEyeWidth : 0.5;
				const rightEyeWidth = rightEyeInner.x - rightEyeOuter.x;
				const rightIrisPosX =
					rightEyeWidth !== 0 ? (rightIris.x - rightEyeOuter.x) / rightEyeWidth : 0.5;

				// Vertical gaze
				const leftEyeHeight = leftEyeBottom.y - leftEyeTop.y;
				const leftIrisPosY =
					leftEyeHeight !== 0 ? (leftIris.y - leftEyeTop.y) / leftEyeHeight : 0.5;
				const rightEyeHeight = rightEyeBottom.y - rightEyeTop.y;
				const rightIrisPosY =
					rightEyeHeight !== 0 ? (rightIris.y - rightEyeTop.y) / rightEyeHeight : 0.5;

				// Looking away check
				const lookingLeftRight =
					leftIrisPosX < 0.3 ||
					leftIrisPosX > 0.7 ||
					rightIrisPosX < 0.3 ||
					rightIrisPosX > 0.7;
				const lookingUpDown =
					leftIrisPosY < 0.35 ||
					leftIrisPosY > 0.65 ||
					rightIrisPosY < 0.35 ||
					rightIrisPosY > 0.65;
				isLookingAway = lookingLeftRight || lookingUpDown;

				// Eyes closed check
				const leftEyeOpenRatio = Math.abs(leftEyeHeight) / Math.abs(leftEyeWidth);
				const rightEyeOpenRatio = Math.abs(rightEyeHeight) / Math.abs(rightEyeWidth);
				const avgEyeOpenRatio = (leftEyeOpenRatio + rightEyeOpenRatio) / 2;
				areEyesClosed = avgEyeOpenRatio < 0.18;
			}

			// Mouth open check
			const upperLip = landmarks[13];
			const lowerLip = landmarks[14];
			const mouthDistance = Math.abs(lowerLip.y - upperLip.y);
			isMouthOpen = mouthDistance > 0.03;

			// Head turned check
			const nose = landmarks[1];
			const leftCheek = landmarks[234];
			const rightCheek = landmarks[454];
			const faceWidth = Math.abs(rightCheek.x - leftCheek.x);
			const noseToCenterX = Math.abs(nose.x - (leftCheek.x + rightCheek.x) / 2);
			const headTurnRatio = faceWidth > 0 ? noseToCenterX / faceWidth : 0;
			isHeadTurned = headTurnRatio > 0.15;
		}

		self.postMessage({
			type: 'result',
			faceCount: detectionCount,
			isLookingAway,
			isMouthOpen,
			isHeadTurned,
			areEyesClosed,
			landmarks: results.faceLandmarks,
			timestamp,
		} as WorkerResponse);
	} catch (error: any) {
		self.postMessage({
			type: 'error',
			error: error.message || 'Detection failed',
			timestamp,
		} as WorkerResponse);
	} finally {
		// Important: close the ImageBitmap to free memory
		frame.close();
	}
}

// Handle messages from main thread
self.onmessage = (e: MessageEvent<WorkerMessage>) => {
	const { type, frame, timestamp } = e.data;

	switch (type) {
		case 'init':
			initFaceDetection();
			break;
		case 'detect':
			if (frame && timestamp !== undefined) {
				detectFaces(frame, timestamp);
			}
			break;
		case 'stop':
			if (faceLandmarker) {
				faceLandmarker.close();
				faceLandmarker = null;
			}
			isReady = false;
			break;
	}
};

// Export types for the hook
export type { WorkerMessage, WorkerResponse };
