import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export interface ProctoringEvent {
	type:
		| "face_not_detected"
		| "multiple_faces"
		| "looking_away"
		| "mouth_open"
		| "head_turned"
		| "eyes_closed"
		| "tab_switch"
		| "fullscreen_exit"
		| "copy_paste";
	startTime: number;
	endTime: number;
	duration: number;
	metadata?: {
		action?: "copy" | "paste" | "cut";
		hidden?: boolean;
	};
}

export const useMediaPipeFaceDetection = (
	videoElement: HTMLVideoElement | null,
	canvasElement: HTMLCanvasElement | null,
	enabled: boolean,
	showLandmarks: boolean,
	onViolation?: (event: ProctoringEvent) => void,
) => {
	const [events, setEvents] = useState<ProctoringEvent[]>([]);
	const [isProcessing, setIsProcessing] = useState(false);
	const [faceCount, setFaceCount] = useState(0);
	const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
	const animationFrameRef = useRef<number>();
	const noFaceViolationRef = useRef<{ startTime: number } | null>(null);
	const multipleFacesViolationRef = useRef<{ startTime: number } | null>(
		null,
	);
	const lookingAwayViolationRef = useRef<{ startTime: number } | null>(null);
	const mouthOpenViolationRef = useRef<{ startTime: number } | null>(null);
	const headTurnedViolationRef = useRef<{ startTime: number } | null>(null);
	const eyesClosedViolationRef = useRef<{ startTime: number } | null>(null);
	const lastDetectionTimeRef = useRef<number>(0);
	const DETECTION_INTERVAL = 100; // Run detection every 100ms (10fps)

	useEffect(() => {
		if (!enabled || !videoElement) return;

		let mounted = true;

		const initFaceDetection = async () => {
			try {
				const vision = await FilesetResolver.forVisionTasks(
					"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
				);

				const faceLandmarker = await FaceLandmarker.createFromOptions(
					vision,
					{
						baseOptions: {
							modelAssetPath:
								"https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
							delegate: "GPU",
						},
						runningMode: "VIDEO",
						numFaces: 2,
						minFaceDetectionConfidence: 0.5,
						minFacePresenceConfidence: 0.5,
						minTrackingConfidence: 0.5,
						outputFaceBlendshapes: true,
						outputFacialTransformationMatrixes: false,
					},
				);

				faceLandmarkerRef.current = faceLandmarker;

				const detectFaces = async () => {
					if (!faceLandmarkerRef.current || !videoElement || !mounted)
						return;

					if (videoElement.readyState >= 3) {
						const now = performance.now();
						// Throttle detection
						if (
							now - lastDetectionTimeRef.current >=
							DETECTION_INTERVAL
						) {
							lastDetectionTimeRef.current = now;
							const startTimeMs = now;
							const results =
								faceLandmarkerRef.current.detectForVideo(
									videoElement,
									startTimeMs,
								);

							const detectionCount = results.faceLandmarks.length;
							setFaceCount(detectionCount);

							// Check violations using landmarks
							let isLookingAway = false;
							let isMouthOpen = false;
							let isHeadTurned = false;
							let areEyesClosed = false;
							if (
								detectionCount === 1 &&
								results.faceLandmarks[0]
							) {
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
									const leftEyeWidth =
										leftEyeInner.x - leftEyeOuter.x;
									const leftIrisPosX =
										leftEyeWidth !== 0
											? (leftIris.x - leftEyeOuter.x) /
												leftEyeWidth
											: 0.5;

									const rightEyeWidth =
										rightEyeInner.x - rightEyeOuter.x;
									const rightIrisPosX =
										rightEyeWidth !== 0
											? (rightIris.x - rightEyeOuter.x) /
												rightEyeWidth
											: 0.5;

									// Vertical: Check up/down gaze
									const leftEyeHeight =
										leftEyeBottom.y - leftEyeTop.y;
									const leftIrisPosY =
										leftEyeHeight !== 0
											? (leftIris.y - leftEyeTop.y) /
												leftEyeHeight
											: 0.5;

									const rightEyeHeight =
										rightEyeBottom.y - rightEyeTop.y;
									const rightIrisPosY =
										rightEyeHeight !== 0
											? (rightIris.y - rightEyeTop.y) /
												rightEyeHeight
											: 0.5;

									// Looking away if eyes are not centered (horizontal: 0.3-0.7, vertical: 0.35-0.65)
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

									isLookingAway =
										lookingLeftRight || lookingUpDown;

									// Check eyes closed (using eye aspect ratio)
									const leftEyeOpenRatio =
										Math.abs(leftEyeHeight) /
										Math.abs(leftEyeWidth);
									const rightEyeOpenRatio =
										Math.abs(rightEyeHeight) /
										Math.abs(rightEyeWidth);
									const avgEyeOpenRatio =
										(leftEyeOpenRatio + rightEyeOpenRatio) /
										2;
									areEyesClosed = avgEyeOpenRatio < 0.18; // Threshold for closed eyes
								}

								// Check mouth open (upper lip to lower lip distance)
								const upperLip = landmarks[13];
								const lowerLip = landmarks[14];
								const mouthDistance = Math.abs(
									lowerLip.y - upperLip.y,
								);
								isMouthOpen = mouthDistance > 0.03; // Threshold for open mouth

								// Check head turned (using nose and face width)
								const nose = landmarks[1];
								const leftCheek = landmarks[234];
								const rightCheek = landmarks[454];
								const faceWidth = Math.abs(
									rightCheek.x - leftCheek.x,
								);
								const noseToCenterX = Math.abs(
									nose.x - (leftCheek.x + rightCheek.x) / 2,
								);
								const headTurnRatio =
									faceWidth > 0
										? noseToCenterX / faceWidth
										: 0;
								isHeadTurned = headTurnRatio > 0.15; // Threshold for head turned
							}

							// Draw on canvas
							if (canvasElement) {
								const ctx = canvasElement.getContext("2d");
								if (ctx) {
									ctx.clearRect(
										0,
										0,
										canvasElement.width,
										canvasElement.height,
									);

									if (
										showLandmarks &&
										results.faceLandmarks.length > 0
									) {
										results.faceLandmarks.forEach(
											(landmarks) => {
												ctx.fillStyle =
													detectionCount > 1
														? "#ff4d4f"
														: "#52c41a";
												ctx.strokeStyle =
													detectionCount > 1
														? "#ff4d4f"
														: "#52c41a";
												ctx.lineWidth = 1;

												// Draw all landmarks
												landmarks.forEach(
													(landmark, idx) => {
														const x =
															landmark.x *
															canvasElement.width;
														const y =
															landmark.y *
															canvasElement.height;
														ctx.beginPath();
														ctx.arc(
															x,
															y,
															1,
															0,
															2 * Math.PI,
														);
														ctx.fill();
													},
												);

												// Highlight iris landmarks (468 = left, 473 = right)
												[468, 473].forEach((idx) => {
													if (landmarks[idx]) {
														const x =
															landmarks[idx].x *
															canvasElement.width;
														const y =
															landmarks[idx].y *
															canvasElement.height;
														ctx.fillStyle =
															"#1890ff";
														ctx.beginPath();
														ctx.arc(
															x,
															y,
															4,
															0,
															2 * Math.PI,
														);
														ctx.fill();
													}
												});
											},
										);
									}
								}
							}

							// Track violations - notify on start and end
							if (detectionCount === 0) {
								if (!noFaceViolationRef.current) {
									noFaceViolationRef.current = {
										startTime: Date.now(),
									};
									const event: ProctoringEvent = {
										type: "face_not_detected",
										startTime:
											noFaceViolationRef.current
												.startTime,
										endTime: 0,
										duration: 0,
									};
									setEvents((prev) => [...prev, event]);
									onViolation?.(event);
								}
								// Clear other violations when no face
								if (multipleFacesViolationRef.current) {
									const endTime = Date.now();
									const duration =
										endTime -
										multipleFacesViolationRef.current
											.startTime;
									const event: ProctoringEvent = {
										type: "multiple_faces",
										startTime:
											multipleFacesViolationRef.current
												.startTime,
										endTime,
										duration,
									};
									console.log(
										`Violation ended: multiple_faces (${duration}ms)`,
									);
									onViolation?.(event);
									multipleFacesViolationRef.current = null;
								}
								if (lookingAwayViolationRef.current) {
									const endTime = Date.now();
									const duration =
										endTime -
										lookingAwayViolationRef.current
											.startTime;
									const event: ProctoringEvent = {
										type: "looking_away",
										startTime:
											lookingAwayViolationRef.current
												.startTime,
										endTime,
										duration,
									};
									console.log(
										`Violation ended: looking_away (${duration}ms)`,
									);
									onViolation?.(event);
									lookingAwayViolationRef.current = null;
								}
								if (mouthOpenViolationRef.current) {
									const endTime = Date.now();
									const duration =
										endTime -
										mouthOpenViolationRef.current.startTime;
									const event: ProctoringEvent = {
										type: "mouth_open",
										startTime:
											mouthOpenViolationRef.current
												.startTime,
										endTime,
										duration,
									};
									console.log(
										`Violation ended: mouth_open (${duration}ms)`,
									);
									onViolation?.(event);
									mouthOpenViolationRef.current = null;
								}
								if (headTurnedViolationRef.current) {
									const endTime = Date.now();
									const duration =
										endTime -
										headTurnedViolationRef.current
											.startTime;
									const event: ProctoringEvent = {
										type: "head_turned",
										startTime:
											headTurnedViolationRef.current
												.startTime,
										endTime,
										duration,
									};
									console.log(
										`Violation ended: head_turned (${duration}ms)`,
									);
									onViolation?.(event);
									headTurnedViolationRef.current = null;
								}
								if (eyesClosedViolationRef.current) {
									const endTime = Date.now();
									const duration =
										endTime -
										eyesClosedViolationRef.current
											.startTime;
									const event: ProctoringEvent = {
										type: "eyes_closed",
										startTime:
											eyesClosedViolationRef.current
												.startTime,
										endTime,
										duration,
									};
									console.log(
										`Violation ended: eyes_closed (${duration}ms)`,
									);
									onViolation?.(event);
									eyesClosedViolationRef.current = null;
								}
							} else if (detectionCount > 1) {
								if (!multipleFacesViolationRef.current) {
									multipleFacesViolationRef.current = {
										startTime: Date.now(),
									};
									const event: ProctoringEvent = {
										type: "multiple_faces",
										startTime:
											multipleFacesViolationRef.current
												.startTime,
										endTime: 0,
										duration: 0,
									};
									setEvents((prev) => [...prev, event]);
									onViolation?.(event);
								}
								// Clear other violations when multiple faces
								if (noFaceViolationRef.current) {
									const endTime = Date.now();
									const duration =
										endTime -
										noFaceViolationRef.current.startTime;
									const event: ProctoringEvent = {
										type: "face_not_detected",
										startTime:
											noFaceViolationRef.current
												.startTime,
										endTime,
										duration,
									};
									console.log(
										`Violation ended: face_not_detected (${duration}ms)`,
									);
									onViolation?.(event);
									noFaceViolationRef.current = null;
								}
								if (lookingAwayViolationRef.current) {
									const endTime = Date.now();
									const duration =
										endTime -
										lookingAwayViolationRef.current
											.startTime;
									const event: ProctoringEvent = {
										type: "looking_away",
										startTime:
											lookingAwayViolationRef.current
												.startTime,
										endTime,
										duration,
									};
									console.log(
										`Violation ended: looking_away (${duration}ms)`,
									);
									onViolation?.(event);
									lookingAwayViolationRef.current = null;
								}
								if (mouthOpenViolationRef.current) {
									const endTime = Date.now();
									const duration =
										endTime -
										mouthOpenViolationRef.current.startTime;
									const event: ProctoringEvent = {
										type: "mouth_open",
										startTime:
											mouthOpenViolationRef.current
												.startTime,
										endTime,
										duration,
									};
									console.log(
										`Violation ended: mouth_open (${duration}ms)`,
									);
									onViolation?.(event);
									mouthOpenViolationRef.current = null;
								}
								if (headTurnedViolationRef.current) {
									const endTime = Date.now();
									const duration =
										endTime -
										headTurnedViolationRef.current
											.startTime;
									const event: ProctoringEvent = {
										type: "head_turned",
										startTime:
											headTurnedViolationRef.current
												.startTime,
										endTime,
										duration,
									};
									console.log(
										`Violation ended: head_turned (${duration}ms)`,
									);
									onViolation?.(event);
									headTurnedViolationRef.current = null;
								}
								if (eyesClosedViolationRef.current) {
									const endTime = Date.now();
									const duration =
										endTime -
										eyesClosedViolationRef.current
											.startTime;
									const event: ProctoringEvent = {
										type: "eyes_closed",
										startTime:
											eyesClosedViolationRef.current
												.startTime,
										endTime,
										duration,
									};
									console.log(
										`Violation ended: eyes_closed (${duration}ms)`,
									);
									onViolation?.(event);
									eyesClosedViolationRef.current = null;
								}
							} else {
								if (noFaceViolationRef.current) {
									const endTime = Date.now();
									const duration =
										endTime -
										noFaceViolationRef.current.startTime;
									const event: ProctoringEvent = {
										type: "face_not_detected",
										startTime:
											noFaceViolationRef.current
												.startTime,
										endTime,
										duration,
									};
									console.log(
										`Violation ended: face_not_detected (${duration}ms)`,
									);
									onViolation?.(event);
									noFaceViolationRef.current = null;
								}
								if (multipleFacesViolationRef.current) {
									const endTime = Date.now();
									const duration =
										endTime -
										multipleFacesViolationRef.current
											.startTime;
									const event: ProctoringEvent = {
										type: "multiple_faces",
										startTime:
											multipleFacesViolationRef.current
												.startTime,
										endTime,
										duration,
									};
									console.log(
										`Violation ended: multiple_faces (${duration}ms)`,
									);
									onViolation?.(event);
									multipleFacesViolationRef.current = null;
								}

								// Check looking away for single face
								if (isLookingAway) {
									if (!lookingAwayViolationRef.current) {
										lookingAwayViolationRef.current = {
											startTime: Date.now(),
										};
										const event: ProctoringEvent = {
											type: "looking_away",
											startTime:
												lookingAwayViolationRef.current
													.startTime,
											endTime: 0,
											duration: 0,
										};
										setEvents((prev) => [...prev, event]);
										onViolation?.(event);
									}
								} else {
									if (lookingAwayViolationRef.current) {
										const endTime = Date.now();
										const duration =
											endTime -
											lookingAwayViolationRef.current
												.startTime;
										const event: ProctoringEvent = {
											type: "looking_away",
											startTime:
												lookingAwayViolationRef.current
													.startTime,
											endTime,
											duration,
										};
										console.log(
											`Violation ended: looking_away (${duration}ms)`,
										);
										onViolation?.(event);
										lookingAwayViolationRef.current = null;
									}
								}

								// Check mouth open
								if (isMouthOpen) {
									if (!mouthOpenViolationRef.current) {
										mouthOpenViolationRef.current = {
											startTime: Date.now(),
										};
										const event: ProctoringEvent = {
											type: "mouth_open",
											startTime:
												mouthOpenViolationRef.current
													.startTime,
											endTime: 0,
											duration: 0,
										};
										setEvents((prev) => [...prev, event]);
										onViolation?.(event);
									}
								} else {
									if (mouthOpenViolationRef.current) {
										const endTime = Date.now();
										const duration =
											endTime -
											mouthOpenViolationRef.current
												.startTime;
										const event: ProctoringEvent = {
											type: "mouth_open",
											startTime:
												mouthOpenViolationRef.current
													.startTime,
											endTime,
											duration,
										};
										console.log(
											`Violation ended: mouth_open (${duration}ms)`,
										);
										onViolation?.(event);
										mouthOpenViolationRef.current = null;
									}
								}

								// Check head turned
								if (isHeadTurned) {
									if (!headTurnedViolationRef.current) {
										headTurnedViolationRef.current = {
											startTime: Date.now(),
										};
										const event: ProctoringEvent = {
											type: "head_turned",
											startTime:
												headTurnedViolationRef.current
													.startTime,
											endTime: 0,
											duration: 0,
										};
										setEvents((prev) => [...prev, event]);
										onViolation?.(event);
									}
								} else {
									if (headTurnedViolationRef.current) {
										const endTime = Date.now();
										const duration =
											endTime -
											headTurnedViolationRef.current
												.startTime;
										const event: ProctoringEvent = {
											type: "head_turned",
											startTime:
												headTurnedViolationRef.current
													.startTime,
											endTime,
											duration,
										};
										console.log(
											`Violation ended: head_turned (${duration}ms)`,
										);
										onViolation?.(event);
										headTurnedViolationRef.current = null;
									}
								}

								// Check eyes closed
								if (areEyesClosed) {
									if (!eyesClosedViolationRef.current) {
										eyesClosedViolationRef.current = {
											startTime: Date.now(),
										};
										const event: ProctoringEvent = {
											type: "eyes_closed",
											startTime:
												eyesClosedViolationRef.current
													.startTime,
											endTime: 0,
											duration: 0,
										};
										setEvents((prev) => [...prev, event]);
										onViolation?.(event);
									}
								} else {
									if (eyesClosedViolationRef.current) {
										const endTime = Date.now();
										const duration =
											endTime -
											eyesClosedViolationRef.current
												.startTime;
										const event: ProctoringEvent = {
											type: "eyes_closed",
											startTime:
												eyesClosedViolationRef.current
													.startTime,
											endTime,
											duration,
										};
										onViolation?.(event);
										eyesClosedViolationRef.current = null;
									}
								}
							}
						}
					}

					if (mounted) {
						animationFrameRef.current =
							requestAnimationFrame(detectFaces);
					}
				};

				if (mounted) {
					setIsProcessing(true);
					detectFaces();
				}
			} catch (err) {
				console.error("Failed to initialize face detection:", err);
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
