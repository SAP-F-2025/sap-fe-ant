import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import apiService from './api';
import {
  Assessment,
  AssessmentStatus,
  StudentAssessment,
  StudentAssessmentsResponse,
  StudentDashboardStats,
  StudentAttemptsResponse,
  StudentAssessmentDetailResponse,
  Attempt,
  AttemptWithAssessment,
  AttemptDetail,
  AttemptStartRequest,
  SubmitAnswerRequest,
  CompleteAttemptRequest,
  TimeRemainingResponse,
  CanStartAttemptResponse,
  PaginationParams,
  PaginatedResponse,
  AssessmentQuestion,
} from '../types';
import { delay } from './mockData';

class StudentService {
  /**
   * Get available assessments for student
   * Uses new GET /api/v1/students/me/assessments endpoint
   */
  async getAvailableAssessments(
    params?: PaginationParams & { search?: string; status?: string; sort_by?: string }
  ): Promise<PaginatedResponse<StudentAssessment>> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const mockAssessments: StudentAssessment[] = [
        {
          id: 1,
          title: 'Kiểm tra React cơ bản',
          description: 'Bài kiểm tra về các khái niệm cơ bản của React',
          duration: 30,
          questions_count: 3,
          passing_score: 70,
          max_attempts: 3,
          attempts_used: 0,
          best_score: null,
          can_start: true,
          has_active_attempt: false,
          due_date: '2025-12-31',
        },
        {
          id: 2,
          title: 'Kiểm tra TypeScript',
          description: 'Bài kiểm tra về TypeScript',
          duration: 45,
          questions_count: 5,
          passing_score: 75,
          max_attempts: 2,
          attempts_used: 0,
          best_score: null,
          can_start: true,
          has_active_attempt: false,
          due_date: '2025-12-25',
        },
      ];

      return {
        data: mockAssessments,
        total: mockAssessments.length,
        page: params?.page || 1,
        size: params?.size || 10,
        total_pages: 1,
      };
    }

    const response = await apiService.get<StudentAssessmentsResponse>(
      API_ENDPOINTS.STUDENT_ASSESSMENTS,
      params
    );

    return {
      data: response.assessments,
      total: response.total,
      page: response.page,
      size: response.size,
      total_pages: response.total_pages,
    };
  }

  /**
   * Get student dashboard stats
   * Uses new GET /api/v1/students/me/stats endpoint
   */
  async getDashboardStats(): Promise<StudentDashboardStats> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return {
        overview: {
          total_assessments_available: 5,
          total_assessments_completed: 15,
          total_assessments_in_progress: 2,
          total_attempts: 28,
        },
        performance: {
          average_score: 78.5,
          pass_rate: 85.0,
          highest_score: 98,
          lowest_score: 45,
        },
        recent_attempts: [],
        upcoming_assessments: [],
      };
    }

    return apiService.get<StudentDashboardStats>(API_ENDPOINTS.STUDENT_STATS);
  }

  /**
   * Get student's attempt history
   * Uses new GET /api/v1/students/me/attempts endpoint
   */
  async getAttemptHistory(
    params?: PaginationParams & { assessment_id?: number; status?: string; from_date?: string; to_date?: string }
  ): Promise<PaginatedResponse<AttemptWithAssessment>> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return {
        data: [],
        total: 0,
        page: params?.page || 1,
        size: params?.size || 10,
        total_pages: 0,
      };
    }

    const response = await apiService.get<StudentAttemptsResponse>(
      API_ENDPOINTS.STUDENT_ATTEMPTS,
      params
    );

    return {
      data: response.attempts,
      total: response.total,
      page: response.page,
      size: response.size,
      total_pages: response.total_pages,
    };
  }

  /**
   * Start a new attempt
   * Returns full attempt details including questions
   */
  async startAttempt(data: AttemptStartRequest): Promise<AttemptDetail> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return {
        id: 1,
        assessment_id: data.assessment_id,
        student_id: data.student_id,
        status: 'in_progress' as any,
        started_at: new Date().toISOString(),
        time_remaining: 3600,
        assessment: {
          id: data.assessment_id,
          title: 'Mock Assessment',
          description: 'Mock description',
          duration: 60,
          passing_score: 70,
        },
        answers: [],
        questions: [],
      };
    }

    return apiService.post<AttemptDetail>(API_ENDPOINTS.ATTEMPT_START, data);
  }

  /**
   * Get current attempt for assessment
   */
  async getCurrentAttempt(assessmentId: number): Promise<Attempt | null> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return null;
    }

    try {
      return await apiService.get<Attempt>(API_ENDPOINTS.ATTEMPT_CURRENT(assessmentId));
    } catch {
      return null;
    }
  }

  /**
   * Get attempt details with answers
   */
  async getAttemptDetails(attemptId: number): Promise<AttemptDetail> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return {
        id: attemptId,
        assessment_id: 1,
        student_id: 'student-1',
        status: 'in_progress',
        started_at: new Date().toISOString(),
        time_remaining: 1800,
        assessment: {
          id: 1,
          title: 'Kiểm tra React cơ bản',
          description: 'Bài kiểm tra về các khái niệm cơ bản của React',
          duration: 30,
          passing_score: 70,
        },
        answers: [],
      };
    }

    return apiService.get<AttemptDetail>(API_ENDPOINTS.ATTEMPT_DETAIL_FULL(attemptId));
  }

  /**
   * Submit answer for a question
   */
  async submitAnswer(attemptId: number, data: SubmitAnswerRequest): Promise<void> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return;
    }

    return apiService.post(API_ENDPOINTS.ATTEMPT_ANSWER(attemptId), data);
  }

  /**
   * Submit (complete) the attempt
   * Uses POST /api/v1/attempts/submit with CompleteAttemptRequest
   */
  async submitAttempt(data: CompleteAttemptRequest): Promise<Attempt> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return {
        id: data.attempt_id,
        assessment_id: 1,
        student_id: 1,
        status: 'completed' as any,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        score: 85,
        passed: true,
      };
    }

    return apiService.post<Attempt>(API_ENDPOINTS.ATTEMPT_SUBMIT, data);
  }

  /**
   * Get time remaining for attempt
   * Returns {message, data: seconds}
   */
  async getTimeRemaining(attemptId: number): Promise<TimeRemainingResponse> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return {
        message: 'Time remaining retrieved successfully',
        data: 1800,
      };
    }

    return apiService.get<TimeRemainingResponse>(API_ENDPOINTS.ATTEMPT_TIME_REMAINING(attemptId));
  }

  /**
   * Resume an in-progress attempt
   */
  async resumeAttempt(attemptId: number): Promise<Attempt> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return {
        id: attemptId,
        assessment_id: 1,
        student_id: 1,
        status: 'in_progress' as any,
        started_at: new Date().toISOString(),
        time_remaining: 1800,
      };
    }

    return apiService.post<Attempt>(API_ENDPOINTS.ATTEMPT_RESUME(attemptId));
  }

  /**
   * Get assessment questions for attempt
   */
  async getAssessmentQuestions(
    assessmentId: number,
    params?: PaginationParams
  ): Promise<PaginatedResponse<AssessmentQuestion>> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      // Return mock questions
      const mockQuestions: AssessmentQuestion[] = [
        {
          question_id: 1,
          order: 1,
          points: 10,
          question: {
            id: 1,
            text: 'React là gì?',
            type: 'multiple_choice',
            content: {
              options: [
                { id: 'a', text: 'Một thư viện JavaScript để xây dựng giao diện người dùng' },
                { id: 'b', text: 'Một framework backend' },
                { id: 'c', text: 'Một ngôn ngữ lập trình' },
                { id: 'd', text: 'Một cơ sở dữ liệu' },
              ],
            },
          },
        },
        {
          question_id: 2,
          order: 2,
          points: 10,
          question: {
            id: 2,
            text: 'TypeScript là ngôn ngữ lập trình có kiểu tĩnh?',
            type: 'true_false',
            content: {},
          },
        },
        {
          question_id: 3,
          order: 3,
          points: 15,
          question: {
            id: 3,
            text: 'Giải thích sự khác biệt giữa useState và useEffect trong React.',
            type: 'essay',
            content: {},
          },
        },
      ];

      return {
        data: mockQuestions,
        total: mockQuestions.length,
        page: 1,
        size: 10,
        total_pages: 1,
      };
    }

    const response = await apiService.get<any>(
      API_ENDPOINTS.ASSESSMENT_QUESTIONS(assessmentId),
      params
    );

    return {
      data: response.questions || [],
      total: response.total || 0,
      page: response.page || 1,
      size: response.size || 10,
      total_pages: response.total_pages || 0,
    };
  }

  /**
   * Check if student can start assessment
   * Returns {message, can_start}
   */
  async canStartAssessment(assessmentId: number): Promise<CanStartAttemptResponse> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return {
        message: 'Can start attempt check completed',
        can_start: true,
      };
    }

    return apiService.get<CanStartAttemptResponse>(API_ENDPOINTS.ATTEMPT_CAN_START(assessmentId));
  }
}

export const studentService = new StudentService();
export default studentService;
