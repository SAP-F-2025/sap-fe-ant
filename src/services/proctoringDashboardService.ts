/**
 * Proctoring Dashboard Service
 * API client for protocring-service dashboard endpoints
 */
import axios, { AxiosInstance } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import type {
	AttemptViolationSummary,
	DailyViolationStats,
	DashboardOverview,
	HourlyViolationStats,
	RealTimeStats,
	UserViolationPattern,
	ViolationListResponse,
	ViolationLog,
} from '../types/proctoring';
import { TokenService } from './tokenService';

interface TimeRangeParams {
	start_time?: string;
	end_time?: string;
}

interface PaginationParams {
	page?: number;
	pageSize?: number;
}

class ProctoringDashboardService {
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

	// ============ Violation Retrieval ============

	/**
	 * Get violations for a specific attempt with pagination
	 */
	async getViolationsByAttempt(
		attemptId: number,
		params: PaginationParams = {}
	): Promise<ViolationListResponse> {
		const { data } = await this.instance.get(
			API_ENDPOINTS.PROCTORING_VIOLATIONS_BY_ATTEMPT(attemptId),
			{ params: { page: params.page || 1, pageSize: params.pageSize || 50 } }
		);
		return data;
	}

	/**
	 * Get the latest violation for an attempt
	 */
	async getLatestViolation(attemptId: number): Promise<ViolationLog | null> {
		try {
			const { data } = await this.instance.get(
				API_ENDPOINTS.PROCTORING_VIOLATIONS_LATEST(attemptId)
			);
			return data;
		} catch (error) {
			// 404 means no violations found
			if (axios.isAxiosError(error) && error.response?.status === 404) {
				return null;
			}
			throw error;
		}
	}

	/**
	 * Get violation analytics/timeline for an attempt
	 */
	async getViolationAnalytics(
		attemptId: number,
		bucketSize: string = '5m'
	): Promise<Record<string, unknown>> {
		const { data } = await this.instance.get(API_ENDPOINTS.PROCTORING_ANALYTICS(attemptId), {
			params: { bucket_size: bucketSize },
		});
		return data;
	}

	// ============ Attempt Summaries ============

	/**
	 * Get violation summary for a single attempt
	 */
	async getAttemptSummary(attemptId: number): Promise<AttemptViolationSummary | null> {
		try {
			const { data } = await this.instance.get(
				API_ENDPOINTS.PROCTORING_ATTEMPT_SUMMARY(attemptId)
			);
			return data;
		} catch (error) {
			// 404 means no violations found for this attempt
			if (axios.isAxiosError(error) && error.response?.status === 404) {
				return null;
			}
			throw error;
		}
	}

	/**
	 * Get violation summaries for multiple attempts (batch)
	 * Useful for showing violation badges in grading list
	 */
	async getAttemptSummaries(
		attemptIds: number[]
	): Promise<{ data: AttemptViolationSummary[]; count: number }> {
		if (attemptIds.length === 0) {
			return { data: [], count: 0 };
		}

		const { data } = await this.instance.get(API_ENDPOINTS.PROCTORING_ATTEMPT_SUMMARIES, {
			params: { attempt_ids: attemptIds.join(',') },
		});
		return data;
	}

	// ============ Dashboard Statistics ============

	/**
	 * Get hourly violation statistics
	 * Default: last 24 hours
	 */
	async getHourlyStats(
		params: TimeRangeParams = {}
	): Promise<{ data: HourlyViolationStats[]; count: number }> {
		const { data } = await this.instance.get(API_ENDPOINTS.PROCTORING_STATS_HOURLY, {
			params,
		});
		return data;
	}

	/**
	 * Get daily violation statistics
	 * Default: last 30 days
	 */
	async getDailyStats(
		params: TimeRangeParams = {}
	): Promise<{ data: DailyViolationStats[]; count: number }> {
		const { data } = await this.instance.get(API_ENDPOINTS.PROCTORING_STATS_DAILY, { params });
		return data;
	}

	/**
	 * Get high-level dashboard overview
	 */
	async getDashboardOverview(params: TimeRangeParams = {}): Promise<{ data: DashboardOverview }> {
		const { data } = await this.instance.get(API_ENDPOINTS.PROCTORING_OVERVIEW, { params });
		return data;
	}

	/**
	 * Get real-time statistics
	 * Returns active attempts and recent violations
	 */
	async getRealTimeStats(): Promise<RealTimeStats> {
		const { data } = await this.instance.get(API_ENDPOINTS.PROCTORING_REALTIME);
		return data;
	}

	// ============ User Patterns ============

	/**
	 * Get violation patterns for a specific user
	 * Useful for identifying repeat offenders
	 */
	async getUserPatterns(
		userId: string,
		params: TimeRangeParams = {}
	): Promise<{ data: UserViolationPattern[]; count: number }> {
		const { data } = await this.instance.get(API_ENDPOINTS.PROCTORING_USER_PATTERNS(userId), {
			params,
		});
		return data;
	}

	// ============ Helper Methods ============

	/**
	 * Check if an attempt has any violations
	 * Lightweight check using latest violation endpoint
	 */
	async hasViolations(attemptId: number): Promise<boolean> {
		const latest = await this.getLatestViolation(attemptId);
		return latest !== null;
	}

	/**
	 * Get severity badge info for an attempt
	 * Returns summary info suitable for displaying a badge
	 */
	async getAttemptBadgeInfo(
		attemptId: number
	): Promise<{ total: number; maxSeverity: number } | null> {
		const summary = await this.getAttemptSummary(attemptId);
		if (!summary) return null;

		return {
			total: summary.total_violations,
			maxSeverity: summary.max_severity_level,
		};
	}
}

export const proctoringDashboardService = new ProctoringDashboardService();
export default proctoringDashboardService;
