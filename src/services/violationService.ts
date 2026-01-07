import axios, { AxiosInstance } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { TokenService } from './tokenService';
import type { ProctoringEvent } from '../hooks/useProctoring';
import type { BrowserProctoringEvent } from '../hooks/useBrowserProctoring';

// Violation type mapping (string → number)
// Based on backend ViolationType constants
const VIOLATION_TYPE_MAP: Record<string, number> = {
	// Camera violations (MediaPipe)
	face_not_detected: 0, // ViolationFaceNotDetected
	multiple_faces: 1, // ViolationMultipleFaces
	looking_away: 2, // ViolationLookingAway
	mouth_open: 3, // ViolationMouthOpen
	head_turned: 5, // ViolationHeadTurnedAway
	eyes_closed: 14, // ViolationFailLivenessChallenge (closest match)

	// Browser violations
	copy_paste: 6, // ViolationCopyPaste
	tab_switch: 7, // ViolationSwitchingTab
	fullscreen_exit: 8, // ViolationFullScreen
	browser_tamper: 11, // ViolationBrowserTamper

	// Not yet implemented (for future use)
	hand_detected: 4, // ViolationHandDetected
	phone_detected: 9, // ViolationPhoneDetect
	voice: 10, // ViolationVoice
	voice_chat: 12, // ViolationVoiceChat
	face_mismatch: 13, // ViolationFaceMismatch
};

// Severity mapping (0=Low, 1=Medium, 2=High, 3=Critical)
// Based on backend Severity constants
const SEVERITY_MAP: Record<string, number> = {
	// Camera violations
	face_not_detected: 3, // Critical - no face visible
	multiple_faces: 3, // Critical - cheating attempt
	looking_away: 2, // High - suspicious
	mouth_open: 0, // Low - could be talking to self
	head_turned: 2, // High - not looking at screen
	eyes_closed: 0, // Low - could be thinking

	// Browser violations
	copy_paste: 2, // High - direct cheating
	tab_switch: 3, // Critical - accessing other resources
	fullscreen_exit: 1, // Medium - could be accidental
	browser_tamper: 3, // Critical - trying to cheat

	// Not yet implemented
	hand_detected: 1, // Medium
	phone_detected: 3, // Critical
	voice: 1, // Medium
	voice_chat: 3, // Critical
	face_mismatch: 3, // Critical
};

interface ViolationPayload {
	user_id: string;
	attempt_id: number;
	assessment_id: number;
	violation_type: number;
	severity: number;
	created_at: string; // ISO 8601 (TODO: Backend should rename to started_at)
	ended_at: string; // ISO 8601
	is_prolonged: boolean; // true if duration > 0, false if instant
	confidence_score: number;
	snapshot_url?: string;
	browser_info: {
		user_agent: string;
		platform: string;
		language: string;
		screen_resolution: string;
		timezone: string;
	};
	device_fingerprint: string;
}

// Response interfaces for violation queries
interface ViolationLog {
	id: number;
	attempt_id: number;
	user_id: string;
	assessment_id: number;
	violation_type: number;
	severity: number;
	confidence_score: number;
	snapshot_url?: string;
	browser_info: {
		user_agent: string;
		platform: string;
		language: string;
		screen_resolution: string;
		timezone: string;
	};
	device_fingerprint: string;
	created_at: string;
	ended_at: string;
	is_prolonged: boolean;
}

interface ViolationAnalytics {
	total_count: number;
	count_by_type: Record<string, number>;
	severity_distribution: Record<string, number>;
	timeline: Array<{
		bucket: string;
		violation_count: number;
		critical_count: number;
		high_count: number;
		medium_count: number;
		low_count: number;
	}>;
	latest_violation?: {
		id: number;
		attempt_id: number;
		user_id: string;
		assessment_id: number;
		violation_type: number;
		severity: number;
		confidence_score: number;
		snapshot_url?: string;
		browser_info: {
			user_agent: string;
			platform: string;
			language: string;
			screen_resolution: string;
			timezone: string;
		};
		device_fingerprint: string;
		created_at: string;
		ended_at: string;
		is_prolonged: boolean;
	};
}

interface AttemptSummary {
	attempt_id: number;
	user_id: string;
	assessment_id: number;
	first_violation_at: string;
	last_violation_at: string;
	duration_seconds: number;
	total_violations: number;
	unique_violation_types: number;
	prolonged_violations_count: number;
	critical_count: number;
	high_count: number;
	medium_count: number;
	low_count: number;
	max_severity_level: number;
	violation_types: number[];
	avg_confidence: number;
	max_confidence: number;
	min_confidence: number;
}

class ViolationService {
	private instance: AxiosInstance;

	constructor() {
		this.instance = axios.create({
			baseURL: API_CONFIG.PROCTORING_BASE_URL,
			timeout: API_CONFIG.TIMEOUT,
		});

		this.instance.interceptors.request.use(async (config) => {
			const token = await TokenService.getValidAccessToken();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});
	}

	/**
	 * Generate device fingerprint
	 */
	private generateDeviceFingerprint(): string {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.textBaseline = 'top';
			ctx.font = '14px Arial';
			ctx.fillText('fingerprint', 2, 2);
		}
		const canvasData = canvas.toDataURL();

		const fingerprint = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}-${canvasData.slice(0, 50)}`;

		// Simple hash
		let hash = 0;
		for (let i = 0; i < fingerprint.length; i++) {
			const char = fingerprint.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash;
		}
		return Math.abs(hash).toString(16);
	}

	/**
	 * Get browser info
	 */
	private getBrowserInfo() {
		return {
			user_agent: navigator.userAgent,
			platform: navigator.platform,
			language: navigator.language,
			screen_resolution: `${screen.width}x${screen.height}`,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		};
	}

	/**
	 * Submit camera violation (MediaPipe)
	 * For prolonged violations: Only submit when violation ends (duration > 0)
	 * For instant violations: Submit immediately with same start/end time
	 */
	async submitCameraViolation(
		event: ProctoringEvent,
		userId: string,
		attemptId: number,
		assessmentId: number,
		snapshotUrl?: string
	): Promise<void> {
		const isInstant = event.duration === 0 && event.endTime === 0;
		const isProlongedEnded = event.duration > 0 && event.endTime > 0;

		if (!isInstant && !isProlongedEnded) {
			return;
		}

		const payload = this.buildViolationPayload(
			event,
			userId,
			attemptId,
			assessmentId,
			0.95,
			snapshotUrl
		);

		await this.instance.post(API_ENDPOINTS.PROCTORING_VIOLATIONS, payload);
	}

	/**
	 * Submit browser violation
	 * For prolonged violations: Only submit when violation ends (duration > 0)
	 * For instant violations: Submit immediately with same start/end time
	 */
	async submitBrowserViolation(
		event: BrowserProctoringEvent,
		userId: string,
		attemptId: number,
		assessmentId: number
	): Promise<void> {
		const isInstant = event.duration === 0 && event.endTime === 0;
		const isProlongedEnded = event.duration > 0 && event.endTime > 0;

		if (!isInstant && !isProlongedEnded) {
			return;
		}

		const payload = this.buildViolationPayload(event, userId, attemptId, assessmentId, 1.0);

		await this.instance.post(API_ENDPOINTS.PROCTORING_VIOLATIONS, payload);
	}

	/**
	 * Build violation payload from event
	 */
	private buildViolationPayload(
		event: ProctoringEvent | BrowserProctoringEvent,
		userId: string,
		attemptId: number,
		assessmentId: number,
		confidenceScore: number,
		snapshotUrl?: string
	): ViolationPayload {
		return {
			user_id: userId,
			attempt_id: attemptId,
			assessment_id: assessmentId,
			violation_type: VIOLATION_TYPE_MAP[event.type] || 0,
			severity: SEVERITY_MAP[event.type] || 2,
			created_at: new Date(event.startTime).toISOString(),
			ended_at: new Date(event.endTime || event.startTime).toISOString(),
			is_prolonged: event.duration > 0,
			confidence_score: confidenceScore,
			snapshot_url: snapshotUrl,
			browser_info: this.getBrowserInfo(),
			device_fingerprint: this.generateDeviceFingerprint(),
		};
	}

	/**
	 * Batch submit violations using /api/v1/violations/batch endpoint
	 * Called when test ends or time up
	 */
	async submitViolationsBatch(
		violations: Array<{
			event: ProctoringEvent | BrowserProctoringEvent;
			type: 'camera' | 'browser';
			snapshotUrl?: string;
		}>,
		userId: string,
		attemptId: number,
		assessmentId: number
	): Promise<void> {
		if (violations.length === 0) return;

		const payloads: ViolationPayload[] = violations.map((violation) => {
			// Force end time to now if violation is still ongoing
			const event = { ...violation.event };
			if (event.endTime === 0) {
				event.endTime = Date.now();
				event.duration = event.endTime - event.startTime;
			}

			const confidenceScore = violation.type === 'camera' ? 0.95 : 1.0;
			return this.buildViolationPayload(
				event,
				userId,
				attemptId,
				assessmentId,
				confidenceScore,
				violation.snapshotUrl
			);
		});

		await this.instance.post(API_ENDPOINTS.PROCTORING_VIOLATIONS_BATCH, {
			violations: payloads,
		});
	}

	/**
	 * Get violations for an attempt
	 */
	async getViolationsByAttempt(
		attemptId: number,
		page: number = 1,
		pageSize: number = 10
	): Promise<{ data: ViolationLog[]; count: number }> {
		const response = await this.instance.get(
			API_ENDPOINTS.PROCTORING_VIOLATIONS_BY_ATTEMPT(attemptId),
			{
				params: { page, pageSize },
			}
		);
		return response.data;
	}

	/**
	 * Get violation analytics for an attempt
	 */
	async getViolationAnalytics(
		attemptId: number,
		bucketSize: string = '5m'
	): Promise<ViolationAnalytics> {
		const response = await this.instance.get(
			API_ENDPOINTS.PROCTORING_ANALYTICS(attemptId),
			{
				params: { bucket_size: bucketSize },
			}
		);
		return response.data;
	}

	/**
	 * Get attempt summary from dashboard
	 */
	async getAttemptSummary(attemptId: number): Promise<AttemptSummary | null> {
		try {
			const response = await this.instance.get(
				API_ENDPOINTS.PROCTORING_ATTEMPT_SUMMARY(attemptId)
			);
			return response.data;
		} catch (error: any) {
			// Return null if not found (404) instead of throwing
			if (error?.response?.status === 404) {
				return null;
			}
			throw error;
		}
	}

	/**
	 * Get presigned URL for uploading violation snapshot to S3
	 */
	async getPresignedUploadURL(
		attemptId: number,
		violationType: number,
		contentType: string = 'image/jpeg'
	): Promise<{
		upload_url: string;
		object_key: string;
		public_url: string;
		expires_at: string;
		content_type: string;
	}> {
		const response = await this.instance.get(API_ENDPOINTS.PROCTORING_PRESIGNED_URL, {
			params: {
				attempt_id: attemptId,
				violation_type: violationType,
				content_type: contentType,
			},
		});
		return response.data;
	}

	/**
	 * Upload image blob directly to S3 using presigned URL
	 */
	async uploadToS3(presignedUrl: string, blob: Blob, contentType: string): Promise<void> {
		await fetch(presignedUrl, {
			method: 'PUT',
			body: blob,
			headers: {
				'Content-Type': contentType,
				'x-amz-acl': 'public-read',
			},
		});
	}

	/**
	 * Capture frame from video element and upload to S3
	 * Returns the object key if successful, undefined otherwise
	 */
	async captureAndUploadSnapshot(
		videoElement: HTMLVideoElement | null,
		attemptId: number,
		violationType: number
	): Promise<string | undefined> {
		if (!videoElement) return undefined;

		try {
			// Capture frame from video
			const canvas = document.createElement('canvas');
			canvas.width = videoElement.videoWidth || 640;
			canvas.height = videoElement.videoHeight || 480;
			const ctx = canvas.getContext('2d');
			if (!ctx) return undefined;

			// Mirror horizontally (webcam is mirrored)
			ctx.scale(-1, 1);
			ctx.drawImage(videoElement, -canvas.width, 0);

			// Convert to blob
			const blob = await new Promise<Blob | null>((resolve) => {
				canvas.toBlob(resolve, 'image/jpeg', 0.85);
			});
			if (!blob) return undefined;

			// Get presigned URL
			const { upload_url, object_key } = await this.getPresignedUploadURL(
				attemptId,
				violationType,
				'image/jpeg'
			);

			// Upload to S3
			await this.uploadToS3(upload_url, blob, 'image/jpeg');

			return object_key;
		} catch (error) {
			console.error('Failed to capture and upload snapshot:', error);
			return undefined;
		}
	}
}

export const violationService = new ViolationService();
export default violationService;

/**
 * Submission Logic:
 *
 * 1. Instant Violations (copy/paste, fullscreen_exit):
 *    - Submit immediately when detected
 *    - created_at = ended_at (same time)
 *    - is_prolonged = false
 *    - duration = 0
 *
 * 2. Prolonged Violations (tab_switch, browser_tamper, face_not_detected, etc.):
 *    - Do NOT submit when violation starts (duration = 0, endTime = 0)
 *    - Submit when violation ends (duration > 0, endTime > 0)
 *    - created_at = start time, ended_at = end time
 *    - is_prolonged = true
 *
 * 3. On Test Submit/Timeout:
 *    - Force end all ongoing violations (set endTime = now)
 *    - Submit all violations via batch
 *    - This ensures no violations are lost
 */
