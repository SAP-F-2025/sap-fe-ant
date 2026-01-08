import apiService from './api';
import type {
	Assessment,
	AssessmentStats,
	Question,
	QuestionBank,
	PaginatedAssessmentResponse,
	PaginatedQuestionResponse,
	PaginatedQuestionBankResponse,
	DashboardStats,
	Attempt,
} from '../types';

interface TeacherStats {
	overview: {
		total_assessments: number;
		active_assessments: number;
		draft_assessments: number;
		total_questions: number;
		total_question_banks: number;
	};
	metrics: {
		total_students_attempts: number;
		average_score: number;
		pass_rate: number;
	};
	recent_activities: Array<{
		student_name: string;
		assessment_title: string;
		score: number;
		completed_at: string;
	}>;
}

interface CreatorStatsResponse {
	total_assessments: number;
	total_questions: number;
	total_question_banks: number;
	assessments_by_status: Record<string, number>;
}

interface QuestionUsageStats {
	total_usage: number;
	avg_score: number;
	total_questions: number;
}

interface StudentProgressItem {
	student_id: string;
	student_name: string;
	email: string;
	assessment_id: number;
	assessment_title: string;
	status: string;
	score?: number;
	started_at: string;
	completed_at?: string;
	attempt_count: number;
}

const teacherService = {
	/**
	 * Get dashboard stats for teacher
	 * Uses general dashboard API (filtered by role on backend)
	 */
	async getDashboardStats(): Promise<DashboardStats> {
		return await apiService.get<DashboardStats>('/api/v1/dashboard/stats');
	},

	/**
	 * Get teacher's own assessments
	 */
	async getMyAssessments(params?: {
		page?: number;
		size?: number;
		status?: string;
		search?: string;
	}): Promise<PaginatedAssessmentResponse<Assessment>> {
		return await apiService.get<PaginatedAssessmentResponse<Assessment>>(
			'/api/v1/assessments',
			params
		);
	},

	/**
	 * Get assessments created by specific creator (teacher)
	 */
	async getAssessmentsByCreator(
		creatorId: string | number,
		params?: { page?: number; size?: number }
	): Promise<PaginatedAssessmentResponse<Assessment>> {
		return await apiService.get<PaginatedAssessmentResponse<Assessment>>(
			`/api/v1/assessments/creator/${creatorId}`,
			params
		);
	},

	/**
	 * Get stats for teacher's assessments
	 */
	async getCreatorStats(creatorId: string | number): Promise<CreatorStatsResponse> {
		return await apiService.get<CreatorStatsResponse>(
			`/api/v1/assessments/creator/${creatorId}/stats`
		);
	},

	/**
	 * Get teacher's own questions
	 */
	async getMyQuestions(params?: {
		page?: number;
		size?: number;
		type?: string;
		difficulty?: string;
		search?: string;
	}): Promise<PaginatedQuestionResponse<Question>> {
		return await apiService.get<PaginatedQuestionResponse<Question>>(
			'/api/v1/questions',
			params
		);
	},

	/**
	 * Get questions created by specific creator (teacher)
	 */
	async getQuestionsByCreator(
		creatorId: string | number,
		params?: { page?: number; size?: number }
	): Promise<PaginatedQuestionResponse<Question>> {
		return await apiService.get<PaginatedQuestionResponse<Question>>(
			`/api/v1/questions/creator/${creatorId}`,
			params
		);
	},

	/**
	 * Get usage stats for teacher's questions
	 */
	async getQuestionUsageStats(creatorId: string | number): Promise<QuestionUsageStats> {
		return await apiService.get<QuestionUsageStats>(
			`/api/v1/questions/creator/${creatorId}/usage-stats`
		);
	},

	/**
	 * Get teacher's question banks
	 */
	async getMyQuestionBanks(params?: {
		page?: number;
		size?: number;
		search?: string;
	}): Promise<PaginatedQuestionBankResponse<QuestionBank>> {
		return await apiService.get<PaginatedQuestionBankResponse<QuestionBank>>(
			'/api/v1/question-banks',
			params
		);
	},

	/**
	 * Get question banks created by specific creator (teacher)
	 */
	async getQuestionBanksByCreator(
		creatorId: string | number,
		params?: { page?: number; size?: number }
	): Promise<PaginatedQuestionBankResponse<QuestionBank>> {
		return await apiService.get<PaginatedQuestionBankResponse<QuestionBank>>(
			`/api/v1/question-banks/creator/${creatorId}`,
			params
		);
	},

	/**
	 * Get attempts for a specific assessment (to see student progress)
	 */
	async getAssessmentAttempts(
		assessmentId: number,
		params?: { page?: number; size?: number }
	): Promise<{
		attempts: Attempt[];
		total: number;
		page: number;
		size: number;
	}> {
		return await apiService.get<{
			attempts: Attempt[];
			total: number;
			page: number;
			size: number;
		}>(`/api/v1/attempts/assessment/${assessmentId}`, params);
	},

	/**
	 * Get stats for a specific assessment
	 */
	async getAssessmentStats(assessmentId: number): Promise<AssessmentStats> {
		return await apiService.get<AssessmentStats>(`/api/v1/assessments/${assessmentId}/stats`);
	},

	/**
	 * Get attempts stats for a specific assessment
	 */
	async getAssessmentAttemptsStats(assessmentId: number): Promise<{
		total_attempts: number;
		completed_attempts: number;
		in_progress_attempts: number;
		average_score: number;
		pass_rate: number;
		score_distribution: Record<string, number>;
	}> {
		return await apiService.get<{
			total_attempts: number;
			completed_attempts: number;
			in_progress_attempts: number;
			average_score: number;
			pass_rate: number;
			score_distribution: Record<string, number>;
		}>(`/api/v1/attempts/stats/${assessmentId}`);
	},

	/**
	 * Get grading overview for an assessment
	 */
	async getGradingOverview(assessmentId: number): Promise<{
		total_attempts: number;
		graded_attempts: number;
		pending_attempts: number;
		auto_gradable: number;
		manual_required: number;
	}> {
		return await apiService.get<{
			total_attempts: number;
			graded_attempts: number;
			pending_attempts: number;
			auto_gradable: number;
			manual_required: number;
		}>(`/api/v1/grading/assessments/${assessmentId}/overview`);
	},
};

export default teacherService;
