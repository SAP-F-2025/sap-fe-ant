import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import apiService from './api';
import {
  Assessment,
  AssessmentCreateRequest,
  PaginatedResponse,
  PaginationParams,
  AssessmentStats,
} from '../types';
import { mockAssessments, mockAssessmentStats, paginateData, delay } from './mockData';

class AssessmentService {
  async getAssessments(
    params?: PaginationParams & { status?: string; search?: string }
  ): Promise<PaginatedResponse<Assessment>> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      let filtered = [...mockAssessments];

      if (params?.status) {
        filtered = filtered.filter((a) => a.status === params.status);
      }

      if (params?.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.title.toLowerCase().includes(search) ||
            a.description?.toLowerCase().includes(search)
        );
      }

      return paginateData(filtered, params?.page, params?.size);
    }

    return apiService.get<PaginatedResponse<Assessment>>(API_ENDPOINTS.ASSESSMENTS, params);
  }

  async getAssessment(id: number): Promise<Assessment> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const assessment = mockAssessments.find((a) => a.id === id);
      if (!assessment) throw new Error('Assessment not found');
      return assessment;
    }

    return apiService.get<Assessment>(API_ENDPOINTS.ASSESSMENT_DETAIL(id));
  }

  async createAssessment(data: AssessmentCreateRequest): Promise<Assessment> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const newAssessment: Assessment = {
        id: mockAssessments.length + 1,
        ...data,
        status: 'Draft' as any,
        creator_id: 1,
        max_attempts: data.max_attempts || 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        question_count: 0,
        total_points: 0,
      };
      mockAssessments.unshift(newAssessment);
      return newAssessment;
    }

    return apiService.post<Assessment>(API_ENDPOINTS.ASSESSMENTS, data);
  }

  async updateAssessment(id: number, data: Partial<AssessmentCreateRequest>): Promise<Assessment> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const index = mockAssessments.findIndex((a) => a.id === id);
      if (index === -1) throw new Error('Assessment not found');

      mockAssessments[index] = {
        ...mockAssessments[index],
        ...data,
        updated_at: new Date().toISOString(),
      };
      return mockAssessments[index];
    }

    return apiService.put<Assessment>(API_ENDPOINTS.ASSESSMENT_DETAIL(id), data);
  }

  async deleteAssessment(id: number): Promise<void> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const index = mockAssessments.findIndex((a) => a.id === id);
      if (index !== -1) {
        mockAssessments.splice(index, 1);
      }
      return;
    }

    return apiService.delete(API_ENDPOINTS.ASSESSMENT_DETAIL(id));
  }

  async publishAssessment(id: number): Promise<Assessment> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const index = mockAssessments.findIndex((a) => a.id === id);
      if (index === -1) throw new Error('Assessment not found');

      mockAssessments[index].status = 'Active' as any;
      return mockAssessments[index];
    }

    return apiService.post<Assessment>(API_ENDPOINTS.ASSESSMENT_PUBLISH(id));
  }

  async archiveAssessment(id: number): Promise<Assessment> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const index = mockAssessments.findIndex((a) => a.id === id);
      if (index === -1) throw new Error('Assessment not found');

      mockAssessments[index].status = 'Archived' as any;
      return mockAssessments[index];
    }

    return apiService.post<Assessment>(API_ENDPOINTS.ASSESSMENT_ARCHIVE(id));
  }

  async getAssessmentStats(id: number): Promise<AssessmentStats> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return (
        mockAssessmentStats[id] || {
          total_attempts: 0,
          completed_attempts: 0,
          average_score: 0,
          pass_rate: 0,
          average_time: 0,
        }
      );
    }

    return apiService.get<AssessmentStats>(API_ENDPOINTS.ASSESSMENT_STATS(id));
  }
}

export const assessmentService = new AssessmentService();
export default assessmentService;
