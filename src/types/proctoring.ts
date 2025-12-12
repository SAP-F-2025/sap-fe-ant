/**
 * Proctoring Types
 * Aligned with protocring-service API (TimescaleDB backend)
 */

// ============ Browser Info ============

export interface BrowserInfo {
	user_agent: string;
	platform: string;
	language: string;
	screen_resolution: string;
	timezone: string;
}

// ============ Request Types ============

export interface CreateViolationRequest {
	attempt_id: number;
	user_id: string;
	assessment_id: number;
	violation_type: number; // 0-14 (see ViolationType enum)
	severity: number; // 0-3 (Low/Medium/High/Critical)
	confidence_score: number; // 0.0-1.0
	snapshot_url?: string;
	browser_info: BrowserInfo;
	device_fingerprint: string;
	created_at: string; // ISO 8601 - violation start
	ended_at: string; // ISO 8601 - violation end
	is_prolonged: boolean;
}

export interface BatchViolationRequest {
	violations: CreateViolationRequest[];
}

// ============ Response Types ============

export interface ViolationLog {
	id: number;
	attempt_id: number;
	user_id: string;
	assessment_id: number;
	violation_type: number;
	severity: number;
	confidence_score: number;
	snapshot_url?: string;
	browser_info: BrowserInfo;
	device_fingerprint: string;
	created_at: string;
	ended_at: string;
	is_prolonged: boolean;
}

export interface ViolationResponse {
	id: number;
	attempt_id: number;
	user_id: string;
	assessment_id: number;
	violation_type: number;
	violation_name: string; // Human-readable name
	severity: number;
	severity_name: string; // Human-readable severity
	confidence_score: number;
	created_at: string;
	status: 'processed' | 'failed';
}

export interface BatchViolationResponse {
	success: boolean;
	count: number;
	data: ViolationResponse[];
}

export interface ViolationListResponse {
	data: ViolationLog[];
	count: number;
	limit: number;
	offset: number;
}

// ============ Dashboard Types ============

export interface AttemptViolationSummary {
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

export interface HourlyViolationStats {
	bucket: string;
	total_violations: number;
	unique_attempts: number;
	unique_users: number;
	critical_count: number;
	high_count: number;
	medium_count: number;
	low_count: number;
	face_not_detected_count: number;
	multiple_faces_count: number;
	looking_away_count: number;
	hand_detected_count: number;
	switching_tab_count: number;
	fullscreen_count: number;
	prolonged_count: number;
	avg_confidence: number;
}

export interface DailyViolationStats extends HourlyViolationStats {
	unique_assessments: number;
	mouth_open_count: number;
	copy_paste_count: number;
	phone_detect_count: number;
	avg_duration_seconds: number;
}

export interface UserViolationPattern {
	bucket: string;
	user_id: string;
	total_violations: number;
	attempts_count: number;
	assessments_count: number;
	critical_count: number;
	high_count: number;
	prolonged_count: number;
	most_common_violation: number;
	unique_violation_types: number;
	has_multiple_faces: boolean;
	has_hand_detected: boolean;
	has_switching_tab: boolean;
	has_fullscreen_exit: boolean;
	avg_confidence: number;
}

export interface ViolationTypeCount {
	violation_type: number;
	type_name: string;
	count: number;
	percentage: number;
}

export interface DashboardOverview {
	total_violations: number;
	total_attempts: number;
	total_users: number;
	total_assessments: number;
	critical_count: number;
	high_count: number;
	medium_count: number;
	low_count: number;
	violations_change: number; // % change from previous period
	attempts_change: number;
	users_change: number;
	top_violation_types: ViolationTypeCount[];
}

export interface RealTimeStats {
	last_updated: string;
	active_attempts: number;
	violations_last_5min: number;
	violations_last_hour: number;
	critical_violations: number;
	recent_violations: ViolationLog[];
}

// ============ Enums & Constants ============

export const ViolationType = {
	FACE_NOT_DETECTED: 0,
	MULTIPLE_FACES: 1,
	LOOKING_AWAY: 2,
	MOUTH_OPEN: 3,
	HAND_DETECTED: 4,
	HEAD_TURNED_AWAY: 5,
	COPY_PASTE: 6,
	SWITCHING_TAB: 7,
	FULL_SCREEN: 8,
	PHONE_DETECT: 9,
	VOICE: 10,
	BROWSER_TAMPER: 11,
	VOICE_CHAT: 12,
	FACE_MISMATCH: 13,
	FAIL_LIVENESS_CHALLENGE: 14,
} as const;

export type ViolationTypeValue = (typeof ViolationType)[keyof typeof ViolationType];

export const ViolationTypeName: Record<number, string> = {
	0: 'Face Not Detected',
	1: 'Multiple Faces',
	2: 'Looking Away',
	3: 'Mouth Open',
	4: 'Hand Detected',
	5: 'Head Turned Away',
	6: 'Copy/Paste',
	7: 'Tab Switch',
	8: 'Fullscreen Exit',
	9: 'Phone Detected',
	10: 'Voice Detected',
	11: 'Browser Tampered',
	12: 'Voice Chat',
	13: 'Face Mismatch',
	14: 'Failed Liveness',
};

export const ViolationTypeCategory: Record<number, 'camera' | 'browser' | 'audio' | 'identity'> = {
	0: 'camera',
	1: 'camera',
	2: 'camera',
	3: 'camera',
	4: 'camera',
	5: 'camera',
	6: 'browser',
	7: 'browser',
	8: 'browser',
	9: 'camera',
	10: 'audio',
	11: 'browser',
	12: 'audio',
	13: 'identity',
	14: 'identity',
};

export const Severity = {
	LOW: 0,
	MEDIUM: 1,
	HIGH: 2,
	CRITICAL: 3,
} as const;

export type SeverityValue = (typeof Severity)[keyof typeof Severity];

export const SeverityName: Record<number, string> = {
	0: 'Low',
	1: 'Medium',
	2: 'High',
	3: 'Critical',
};

export const SeverityColor: Record<number, string> = {
	0: '#52c41a', // green
	1: '#faad14', // gold
	2: '#fa8c16', // orange
	3: '#f5222d', // red
};

export const SeverityBgColor: Record<number, string> = {
	0: '#f6ffed', // light green
	1: '#fffbe6', // light gold
	2: '#fff7e6', // light orange
	3: '#fff2f0', // light red
};

// ============ Helper Functions ============

export function getViolationTypeName(type: number): string {
	return ViolationTypeName[type] || `Unknown (${type})`;
}

export function getSeverityName(severity: number): string {
	return SeverityName[severity] || `Unknown (${severity})`;
}

export function getSeverityColor(severity: number): string {
	return SeverityColor[severity] || '#d9d9d9';
}

export function getViolationCategory(type: number): string {
	return ViolationTypeCategory[type] || 'unknown';
}

/**
 * Calculate duration in human-readable format
 */
export function formatDuration(seconds: number): string {
	if (seconds < 1) return '< 1s';
	if (seconds < 60) return `${Math.round(seconds)}s`;
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.round(seconds % 60);
	if (remainingSeconds === 0) return `${minutes}m`;
	return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Format violation time offset as MM:SS or HH:MM:SS
 */
export function formatTimeOffset(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	if (hours > 0) {
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}
	return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
