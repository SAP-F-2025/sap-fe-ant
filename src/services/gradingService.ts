import type { ApiResponse, GradeAnswerRequest, PaginationParams } from '../types';
import { apiService } from './api';

// Extended types for grading
export interface StudentAnswerDetail {
	id: number;
	attempt_id: number;
	question_id: number;
	answer: any;
	score?: number;
	max_score: number;
	is_correct?: boolean;
	graded_by?: number;
	graded_at?: string;
	feedback?: string;
	time_spent?: number;
	first_answered_at?: string;
	last_modified_at?: string;
	flagged: boolean;
	is_graded: boolean;
	question?: {
		id: number;
		type: string;
		text: string;
		points: number;
		content: any;
		difficulty: string;
		explanation?: string;
	};
}

export interface ProctoringEvent {
	id: number;
	attempt_id: number;
	event_type: 'tab_switch' | 'window_blur' | 'copy_paste' | 'right_click' | 'suspicious_activity';
	timestamp: string;
	details?: any;
	severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface AttemptDetailResponse {
	id: number;
	assessment_id: number;
	student_id: number;
	status: string;
	started_at: string;
	completed_at?: string;
	time_remaining?: number;
	score?: number;
	max_score?: number;
	percentage?: number;
	passed?: boolean;
	is_pending_grade?: boolean;
	student?: {
		id: string;
		full_name: string;
		email: string;
		avatar_url?: string;
	};
	assessment?: {
		id: number;
		title: string;
		description?: string;
		duration: number;
		passing_score: number;
		total_points?: number;
	};
	answers: StudentAnswerDetail[];
	proctoring_events: ProctoringEvent[];
	time_spent?: number;
}

export interface GradingOverview {
	assessment_id?: number;
	total_attempts: number;
	graded_attempts: number;
	pending_attempts: number;
	average_score?: number; // Added to match API
	auto_gradable?: number;
	manual_required?: number;
	average_grading_time?: number;
	grading_progress?: {
		questions_graded: number;
		questions_pending: number;
		graders_assigned?: Array<{
			grader_id: number;
			grader_name: string;
			assigned_count: number;
			completed_count: number;
		}>;
	};
}

export interface AttemptListItem {
	id: number;
	assessment_id: number;
	student_id: number;
	status: string;
	started_at: string;
	completed_at?: string;
	time_remaining?: number;
	score?: number;
	passed?: boolean;
	is_pending_grade?: boolean;
	student?: {
		id: string;
		full_name: string;
		email: string;
		avatar_url?: string;
	};
	assessment?: {
		id: number;
		title: string;
		duration: number;
		passing_score: number;
	};
}

export interface PaginatedAttemptResponse {
	data: AttemptListItem[]; // Changed from 'attempts' to 'data' per OpenAPI spec
	total: number; // Changed from 'total_elements'
	page: number;
	size: number;
	total_pages: number;
	// Removed Spring Boot style fields: first, last, number_of_elements, empty
}

export interface GradeAttemptRequest {
	final_score?: number;
	feedback?: string;
}

export interface BatchGradeRequest {
	grades: Array<{
		answer_id: number;
		score: number;
		feedback?: string;
	}>;
}

export interface BatchGradeResponse {
	success_count: number;
	failure_count: number;
	errors?: Array<{
		answer_id: number;
		error: string;
	}>;
}

export interface AutoGradeAttemptResponse {
	total_score: number;
	percentage: number;
	passed: boolean;
	graded_answers: number;
	pending_manual_grading: number;
}

export interface AutoGradeAssessmentResponse {
	processed_attempts: number;
	auto_graded: number;
	manual_required: number;
}

export interface GenerateFeedbackRequest {
	attempt_id: number;
	feedback_type?: 'summary' | 'detailed' | 'improvement';
	include_suggestions?: boolean;
}

export interface GenerateFeedbackResponse {
	feedback: string;
	suggestions?: string[];
	strengths?: string[];
	weaknesses?: string[];
}

export interface CalculateScoreRequest {
	answers: Array<{
		question_id: number;
		score: number;
		max_score: number;
	}>;
	grading_method?: 'weighted' | 'simple' | 'curved';
}

export interface CalculateScoreResponse {
	total_score: number;
	max_score: number;
	percentage: number;
	grade_letter?: string;
}

class GradingService {
	/**
	 * Get list of attempts (for grading list page)
	 */
	async getAttempts(
		params?: PaginationParams & {
			assessment_id?: number;
			student_id?: number;
			status?: string;
			group_id?: number;
			date_from?: string;
			date_to?: string;
			sort_by?: string;
			sort_order?: 'asc' | 'desc';
		}
	): Promise<PaginatedAttemptResponse> {
		return apiService.get<PaginatedAttemptResponse>('/api/v1/attempts', params);
	}

	/**
	 * Get attempt detail with answers and proctoring events
	 */
	async getAttemptDetail(attemptId: number): Promise<AttemptDetailResponse> {
		return apiService.get<AttemptDetailResponse>(`/api/v1/attempts/${attemptId}/details`);
	}

	/**
	 * Grade a single answer
	 */
	async gradeAnswer(answerId: number, data: GradeAnswerRequest): Promise<ApiResponse<any>> {
		return apiService.post<ApiResponse<any>>(`/api/v1/grading/answers/${answerId}`, data);
	}

	/**
	 * Grade multiple answers at once
	 */
	async batchGradeAnswers(data: BatchGradeRequest): Promise<BatchGradeResponse> {
		return apiService.post<BatchGradeResponse>('/api/v1/grading/answers/batch', data);
	}

	/**
	 * Grade entire attempt (manual grading with optional final score and feedback)
	 */
	async gradeAttempt(attemptId: number, data?: GradeAttemptRequest): Promise<ApiResponse<any>> {
		return apiService.post<ApiResponse<any>>(`/api/v1/grading/attempts/${attemptId}`, data);
	}

	/**
	 * Auto-grade a single answer
	 */
	async autoGradeAnswer(answerId: number): Promise<{
		score: number;
		is_correct: boolean;
		feedback?: string;
	}> {
		return apiService.post<{
			score: number;
			is_correct: boolean;
			feedback?: string;
		}>(`/api/v1/grading/answers/${answerId}/auto`);
	}

	/**
	 * Auto-grade an entire attempt
	 */
	async autoGradeAttempt(attemptId: number): Promise<AutoGradeAttemptResponse> {
		return apiService.post<AutoGradeAttemptResponse>(
			`/api/v1/grading/attempts/${attemptId}/auto`
		);
	}

	/**
	 * Auto-grade all attempts for an assessment
	 */
	async autoGradeAssessment(assessmentId: number): Promise<AutoGradeAssessmentResponse> {
		return apiService.post<AutoGradeAssessmentResponse>(
			`/api/v1/grading/assessments/${assessmentId}/auto`
		);
	}

	/**
	 * Generate AI feedback for an attempt
	 */
	async generateFeedback(data: GenerateFeedbackRequest): Promise<GenerateFeedbackResponse> {
		return apiService.post<GenerateFeedbackResponse>('/api/v1/grading/generate-feedback', data);
	}

	/**
	 * Calculate score based on answers
	 */
	async calculateScore(data: CalculateScoreRequest): Promise<CalculateScoreResponse> {
		return apiService.post<CalculateScoreResponse>('/api/v1/grading/calculate-score', data);
	}

	/**
	 * Get grading overview for an assessment
	 * @param assessmentId - Assessment ID
	 * @param groupId - Optional group ID to filter attempts by group members
	 */
	async getGradingOverview(assessmentId: number, groupId?: number): Promise<GradingOverview> {
		const params = groupId ? { group_id: groupId } : undefined;
		return apiService.get<GradingOverview>(
			`/api/v1/grading/assessments/${assessmentId}/overview`,
			params
		);
	}

	/**
	 * Get grading stats overview for all assessments
	 * - Admin: sees all assessments
	 * - Teacher: sees only their own assessments
	 */
	async getGradingOverviewAll(): Promise<{
		total_assessments: number;
		total_attempts: number;
		graded_attempts: number;
		pending_attempts: number;
		average_score: number;
	}> {
		return apiService.get('/api/v1/grading/overview');
	}


	/**
	 * Regrade all answers for a specific question
	 */
	async regradeQuestion(
		questionId: number,
		data?: {
			reason?: string;
			new_correct_answer?: any;
			point_adjustment?: number;
		}
	): Promise<{
		affected_answers: number;
		score_changes: Array<{
			answer_id: number;
			old_score: number;
			new_score: number;
		}>;
	}> {
		return apiService.post(`/api/v1/grading/questions/${questionId}/regrade`, data);
	}

	/**
	 * Regrade all attempts for an assessment
	 */
	async regradeAssessment(
		assessmentId: number,
		data?: {
			reason?: string;
			question_adjustments?: Array<{
				question_id: number;
				point_adjustment: number;
			}>;
		}
	): Promise<{
		affected_attempts: number;
		total_score_changes: number;
	}> {
		return apiService.post(`/api/v1/grading/assessments/${assessmentId}/regrade`, data);
	}

	/**
	 * Get attempts by student
	 */
	async getAttemptsByStudent(
		studentId: string,
		params?: PaginationParams
	): Promise<PaginatedAttemptResponse> {
		return apiService.get<PaginatedAttemptResponse>(
			`/api/v1/attempts/student/${studentId}`,
			params
		);
	}

	/**
	 * Get attempts by assessment
	 */
	async getAttemptsByAssessment(
		assessmentId: number,
		params?: PaginationParams
	): Promise<PaginatedAttemptResponse> {
		return apiService.get<PaginatedAttemptResponse>(
			`/api/v1/attempts/assessment/${assessmentId}`,
			params
		);
	}
}

export const gradingService = new GradingService();
export default gradingService;
