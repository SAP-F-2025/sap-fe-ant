// Face Detection Classic Worker
// Uses importScripts to load patched MediaPipe bundle
// This worker runs in classic mode (not module) for MediaPipe compatibility

importScripts('/mediapipe-vision.js');

// Access MediaPipe through the global $mediapipe object
const { FaceLandmarker, FilesetResolver } = self.$mediapipe;

let faceLandmarker = null;
let isReady = false;

// Initialize MediaPipe
async function initFaceDetection() {
	try {
		console.log('Worker: Step 1 - Starting initialization...');
		console.log('Worker: FilesetResolver:', FilesetResolver);
		console.log('Worker: FaceLandmarker:', FaceLandmarker);
		
		console.log('Worker: Step 2 - Calling FilesetResolver.forVisionTasks...');
		const vision = await FilesetResolver.forVisionTasks(
			'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
		);
		
		console.log('Worker: Step 3 - FilesetResolver complete:', vision);

		const modelPath =
			'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

		// Try GPU first, fallback to CPU
		let delegate = 'CPU';
		try {
			faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
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
			console.log('Worker: Using GPU acceleration');
		} catch (gpuError) {
			console.warn('Worker: GPU not available, using CPU:', gpuError);
			faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
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
		self.postMessage({ type: 'ready', delegate: delegate });
		console.log('Worker: Face detection initialized successfully');
	} catch (error) {
		console.error('Worker init error:', error);
		self.postMessage({
			type: 'error',
			error: error.message || 'Failed to initialize face detection',
		});
	}
}

// Process a single frame (ImageBitmap)
function detectFaces(frame, timestamp) {
	if (!faceLandmarker || !isReady) {
		frame.close();
		return;
	}

	try {
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
				const leftIrisPosX = leftEyeWidth !== 0 ? (leftIris.x - leftEyeOuter.x) / leftEyeWidth : 0.5;
				const rightEyeWidth = rightEyeInner.x - rightEyeOuter.x;
				const rightIrisPosX = rightEyeWidth !== 0 ? (rightIris.x - rightEyeOuter.x) / rightEyeWidth : 0.5;

				// Vertical gaze
				const leftEyeHeight = leftEyeBottom.y - leftEyeTop.y;
				const leftIrisPosY = leftEyeHeight !== 0 ? (leftIris.y - leftEyeTop.y) / leftEyeHeight : 0.5;
				const rightEyeHeight = rightEyeBottom.y - rightEyeTop.y;
				const rightIrisPosY = rightEyeHeight !== 0 ? (rightIris.y - rightEyeTop.y) / rightEyeHeight : 0.5;

				// Looking away check
				const lookingLeftRight = leftIrisPosX < 0.3 || leftIrisPosX > 0.7 || rightIrisPosX < 0.3 || rightIrisPosX > 0.7;
				const lookingUpDown = leftIrisPosY < 0.35 || leftIrisPosY > 0.65 || rightIrisPosY < 0.35 || rightIrisPosY > 0.65;
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
			isLookingAway: isLookingAway,
			isMouthOpen: isMouthOpen,
			isHeadTurned: isHeadTurned,
			areEyesClosed: areEyesClosed,
			landmarks: results.faceLandmarks,
			timestamp: timestamp,
		});
	} catch (error) {
		self.postMessage({
			type: 'error',
			error: error.message || 'Detection failed',
			timestamp: timestamp,
		});
	} finally {
		frame.close();
	}
}

// Handle messages from main thread
self.onmessage = function(event) {
	const { type, frame, timestamp } = event.data;

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
