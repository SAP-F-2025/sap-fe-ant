import { API_CONFIG, API_ENDPOINTS } from "../config/api";
import apiService from "./api";
import {
	DashboardStats,
	ActivityTrend,
	RecentActivity,
	QuestionDistribution,
	SubjectPerformance,
} from "../types";
import { delay } from "./mockData";

// Mock data for development
const mockDashboardStats: DashboardStats = {
	overview: {
		total_assessments: 150,
		total_questions: 1080,
		total_question_banks: 12,
		total_attempts: 2340,
		active_users: 165,
	},
	metrics: {
		completion_rate: 85.5,
		average_score: 78.3,
		pass_rate: 72.8,
	},
	trends: {
		assessments_change: 12.5,
		attempts_change: 8.3,
		score_change: 2.1,
	},
};

const mockActivityTrends: ActivityTrend[] = [
	{ period: "T1", attempts: 45, users: 120, average_score: 75 },
	{ period: "T2", attempts: 52, users: 135, average_score: 78 },
	{ period: "T3", attempts: 48, users: 128, average_score: 76 },
	{ period: "T4", attempts: 61, users: 148, average_score: 80 },
	{ period: "T5", attempts: 55, users: 142, average_score: 79 },
	{ period: "T6", attempts: 67, users: 156, average_score: 82 },
	{ period: "T7", attempts: 72, users: 165, average_score: 84 },
	{ period: "T8", attempts: 68, users: 160, average_score: 83 },
];

const mockRecentActivities: RecentActivity[] = [
	{
		id: 1,
		user_id: "user1",
		user_name: "Nguyễn Văn A",
		action: "completed_assessment" as any,
		assessment_id: 1,
		assessment_title: "Toán học lớp 12",
		score: 85,
		created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
		time_ago: "5 phút trước",
	},
	{
		id: 2,
		user_id: "user2",
		user_name: "Trần Thị B",
		action: "created_question" as any,
		question_bank_name: "Ngân hàng Tiếng Anh",
		created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
		time_ago: "12 phút trước",
	},
	{
		id: 3,
		user_id: "user3",
		user_name: "Lê Văn C",
		action: "started_assessment" as any,
		assessment_id: 2,
		assessment_title: "Lịch sử Việt Nam",
		created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
		time_ago: "25 phút trước",
	},
	{
		id: 4,
		user_id: "user4",
		user_name: "Phạm Thị D",
		action: "published_assessment" as any,
		assessment_id: 3,
		assessment_title: "Địa lý tự nhiên",
		created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
		time_ago: "1 giờ trước",
	},
];

const mockQuestionDistribution: QuestionDistribution[] = [
	{
		type: "multiple_choice",
		name: "Trắc nghiệm",
		count: 450,
		percentage: 41.7,
	},
	{ type: "true_false", name: "Đúng/Sai", count: 280, percentage: 25.9 },
	{ type: "essay", name: "Tự luận", count: 150, percentage: 13.9 },
	{ type: "fill_blank", name: "Điền khuyết", count: 120, percentage: 11.1 },
	{ type: "others", name: "Khác", count: 80, percentage: 7.4 },
];

const mockSubjectPerformance: SubjectPerformance[] = [
	{ subject_id: 1, subject_name: "Toán học", average_score: 85 },
	{ subject_id: 2, subject_name: "Tiếng Anh", average_score: 78 },
	{ subject_id: 3, subject_name: "Lịch sử", average_score: 82 },
	{ subject_id: 4, subject_name: "Địa lý", average_score: 75 },
	{ subject_id: 5, subject_name: "Khoa học", average_score: 88 },
];

class DashboardService {
	async getDashboardStats(period: number = 30): Promise<DashboardStats> {
		if (API_CONFIG.USE_MOCK) {
			await delay();
			return mockDashboardStats;
		}

		return apiService.get<DashboardStats>(API_ENDPOINTS.DASHBOARD_STATS, {
			period,
		});
	}

	async getActivityTrends(
		period: "week" | "month" | "year" = "month",
	): Promise<ActivityTrend[]> {
		if (API_CONFIG.USE_MOCK) {
			await delay();
			return mockActivityTrends;
		}

		return apiService.get<ActivityTrend[]>(
			API_ENDPOINTS.DASHBOARD_ACTIVITY_TRENDS,
			{ period },
		);
	}

	async getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
		if (API_CONFIG.USE_MOCK) {
			await delay();
			return mockRecentActivities.slice(0, limit);
		}

		return apiService.get<RecentActivity[]>(
			API_ENDPOINTS.DASHBOARD_RECENT_ACTIVITIES,
			{ limit },
		);
	}

	async getQuestionDistribution(): Promise<QuestionDistribution[]> {
		if (API_CONFIG.USE_MOCK) {
			await delay();
			return mockQuestionDistribution;
		}

		return apiService.get<QuestionDistribution[]>(
			API_ENDPOINTS.DASHBOARD_QUESTION_DISTRIBUTION,
		);
	}

	async getPerformanceBySubject(
		limit: number = 5,
	): Promise<SubjectPerformance[]> {
		if (API_CONFIG.USE_MOCK) {
			await delay();
			return mockSubjectPerformance.slice(0, limit);
		}

		return apiService.get<SubjectPerformance[]>(
			API_ENDPOINTS.DASHBOARD_PERFORMANCE_BY_SUBJECT,
			{ limit },
		);
	}
}

export const dashboardService = new DashboardService();
export default dashboardService;
