import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import apiService from './api';
import { QuestionBank, QuestionBankCreateRequest, PaginatedResponse, PaginationParams } from '../types';
import { mockQuestionBanks, paginateData, delay } from './mockData';

class QuestionBankService {
  async getQuestionBanks(
    params?: PaginationParams & { search?: string; is_public?: boolean }
  ): Promise<PaginatedResponse<QuestionBank>> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      let filtered = [...mockQuestionBanks];

      if (params?.is_public !== undefined) {
        filtered = filtered.filter((qb) => qb.is_public === params.is_public);
      }

      if (params?.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(
          (qb) =>
            qb.name.toLowerCase().includes(search) ||
            qb.description?.toLowerCase().includes(search)
        );
      }

      return paginateData(filtered, params?.page, params?.size);
    }

    return apiService.get<PaginatedResponse<QuestionBank>>(API_ENDPOINTS.QUESTION_BANKS, params);
  }

  async getQuestionBank(id: number): Promise<QuestionBank> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const bank = mockQuestionBanks.find((qb) => qb.id === id);
      if (!bank) throw new Error('Question bank not found');
      return bank;
    }

    return apiService.get<QuestionBank>(API_ENDPOINTS.QUESTION_BANK_DETAIL(id));
  }

  async createQuestionBank(data: QuestionBankCreateRequest): Promise<QuestionBank> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const newBank: QuestionBank = {
        id: mockQuestionBanks.length + 1,
        ...data,
        is_public: data.is_public || false,
        creator_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        question_count: 0,
      };
      mockQuestionBanks.unshift(newBank);
      return newBank;
    }

    return apiService.post<QuestionBank>(API_ENDPOINTS.QUESTION_BANKS, data);
  }

  async updateQuestionBank(id: number, data: Partial<QuestionBankCreateRequest>): Promise<QuestionBank> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const index = mockQuestionBanks.findIndex((qb) => qb.id === id);
      if (index === -1) throw new Error('Question bank not found');

      mockQuestionBanks[index] = {
        ...mockQuestionBanks[index],
        ...data,
        updated_at: new Date().toISOString(),
      };
      return mockQuestionBanks[index];
    }

    return apiService.put<QuestionBank>(API_ENDPOINTS.QUESTION_BANK_DETAIL(id), data);
  }

  async deleteQuestionBank(id: number): Promise<void> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const index = mockQuestionBanks.findIndex((qb) => qb.id === id);
      if (index !== -1) {
        mockQuestionBanks.splice(index, 1);
      }
      return;
    }

    return apiService.delete(API_ENDPOINTS.QUESTION_BANK_DETAIL(id));
  }
}

export const questionBankService = new QuestionBankService();
export default questionBankService;
