import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import apiService from './api';
import {
    Question,
    QuestionCreateRequest,
    PaginatedResponse,
    PaginationParams,
    PaginatedQuestionResponse
} from '../types';
import { mockQuestions, paginateData, delay } from './mockData';

class QuestionService {
  async getQuestions(
    params?: PaginationParams & { type?: string; difficulty?: string; search?: string }
  ): Promise<PaginatedQuestionResponse<Question>> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      let filtered = [...mockQuestions];

      if (params?.type) {
        filtered = filtered.filter((q) => q.type === params.type);
      }

      if (params?.difficulty) {
        filtered = filtered.filter((q) => q.difficulty === params.difficulty);
      }

      if (params?.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter((q) => q.text.toLowerCase().includes(search));
      }

      return paginateData(filtered, params?.page, params?.size);
    }

    return apiService.get<PaginatedResponse<Question>>(API_ENDPOINTS.QUESTIONS, params);
  }

  async getQuestion(id: number): Promise<Question> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const question = mockQuestions.find((q) => q.id === id);
      if (!question) throw new Error('Question not found');
      return question;
    }

    return apiService.get<Question>(API_ENDPOINTS.QUESTION_DETAIL(id));
  }

  async createQuestion(data: QuestionCreateRequest): Promise<Question> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const newQuestion: Question = {
        id: mockQuestions.length + 1,
        ...data,
        creator_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        usage_count: 0,
      };
      mockQuestions.unshift(newQuestion);
      return newQuestion;
    }

    return apiService.post<Question>(API_ENDPOINTS.QUESTIONS, data);
  }

  async updateQuestion(id: number, data: Partial<QuestionCreateRequest>): Promise<Question> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const index = mockQuestions.findIndex((q) => q.id === id);
      if (index === -1) throw new Error('Question not found');

      mockQuestions[index] = {
        ...mockQuestions[index],
        ...data,
        updated_at: new Date().toISOString(),
      };
      return mockQuestions[index];
    }

    return apiService.put<Question>(API_ENDPOINTS.QUESTION_DETAIL(id), data);
  }

  async deleteQuestion(id: number): Promise<void> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const index = mockQuestions.findIndex((q) => q.id === id);
      if (index !== -1) {
        mockQuestions.splice(index, 1);
      }
      return;
    }

    return apiService.delete(API_ENDPOINTS.QUESTION_DETAIL(id));
  }

  async batchCreateQuestions(questions: QuestionCreateRequest[]): Promise<Question[]> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const newQuestions = questions.map((data, index) => ({
        id: mockQuestions.length + index + 1,
        ...data,
        creator_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        usage_count: 0,
      }));
      mockQuestions.unshift(...newQuestions);
      return newQuestions;
    }

    return apiService.post<Question[]>(API_ENDPOINTS.QUESTIONS_BATCH, { questions });
  }
}

export const questionService = new QuestionService();
export default questionService;
