import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import apiService from './api';
import {
  QuestionBank,
  QuestionBankCreateRequest,
  PaginationParams,
  PaginatedQuestionBankResponse,
  Question,
  PaginatedQuestionResponse,
  AddQuestionsRequest,
  RemoveQuestionsRequest,
  ShareQuestionBankRequest,
  UpdateSharePermissionRequest,
  QuestionBankShare,
  QuestionBankStats,
} from '../types';
import { mockQuestionBanks, paginateData, delay } from './mockData';

class QuestionBankService {
  async getQuestionBanks(
    params?: PaginationParams & { search?: string; is_public?: boolean }
  ): Promise<PaginatedQuestionBankResponse<QuestionBank>> {
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

    return apiService.get<PaginatedQuestionBankResponse<QuestionBank>>(API_ENDPOINTS.QUESTION_BANKS, params);
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

  // Question Management
  async getQuestionBankQuestions(
    id: number,
    params?: PaginationParams
  ): Promise<PaginatedQuestionResponse<Question>> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      // Mock data - empty for now
      return {
        questions: [],
        total: 0,
        page: params?.page || 1,
        size: params?.size || 10,
        total_pages: 0,
      };
    }

    return apiService.get<PaginatedQuestionResponse<Question>>(
      API_ENDPOINTS.QUESTION_BANK_QUESTIONS(id),
      params
    );
  }

  async addQuestionsToBank(
    bankId: number,
    data: AddQuestionsRequest
  ): Promise<void> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return;
    }

    return apiService.post(
      API_ENDPOINTS.QUESTION_BANK_ADD_QUESTIONS(bankId),
      data
    );
  }

  async removeQuestionsFromBank(
    bankId: number,
    data: RemoveQuestionsRequest
  ): Promise<void> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return;
    }

    return apiService.delete(
      API_ENDPOINTS.QUESTION_BANK_REMOVE_QUESTIONS(bankId),
      data
    );
  }

  // Public & Shared Question Banks
  async getPublicQuestionBanks(
    params?: PaginationParams & { search?: string }
  ): Promise<PaginatedQuestionBankResponse<QuestionBank>> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const publicBanks = mockQuestionBanks.filter((qb) => qb.is_public);
      return paginateData(publicBanks, params?.page, params?.size);
    }

    return apiService.get<PaginatedQuestionBankResponse<QuestionBank>>(
      API_ENDPOINTS.QUESTION_BANKS_PUBLIC,
      params
    );
  }

  async getSharedQuestionBanks(
    params?: PaginationParams
  ): Promise<PaginatedQuestionBankResponse<QuestionBank>> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return paginateData([], params?.page, params?.size);
    }

    return apiService.get<PaginatedQuestionBankResponse<QuestionBank>>(
      API_ENDPOINTS.QUESTION_BANKS_SHARED,
      params
    );
  }

  // Sharing Management
  async shareQuestionBank(
    bankId: number,
    data: ShareQuestionBankRequest
  ): Promise<void> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return;
    }

    // API expects single user_id, so we need to call it for each user
    const promises = data.user_ids.map((userId) =>
      apiService.post(API_ENDPOINTS.QUESTION_BANK_SHARE(bankId), {
        user_id: userId,
        can_edit: data.permission === 'edit' || data.permission === 'delete',
        can_delete: data.permission === 'delete',
      })
    );

    await Promise.all(promises);
  }

  async getQuestionBankShares(bankId: number): Promise<QuestionBankShare[]> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return [];
    }

    const shares = await apiService.get<any[]>(
      API_ENDPOINTS.QUESTION_BANK_SHARES(bankId)
    );

    // Map can_edit/can_delete to permission enum
    return shares.map((share) => ({
      ...share,
      permission: share.can_delete
        ? 'delete'
        : share.can_edit
        ? 'edit'
        : 'view',
    }));
  }

  async unshareQuestionBank(bankId: number, userId: string): Promise<void> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return;
    }

    return apiService.delete(API_ENDPOINTS.QUESTION_BANK_UNSHARE(bankId, userId));
  }

  async updateSharePermission(
    bankId: number,
    userId: string,
    data: UpdateSharePermissionRequest
  ): Promise<void> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return;
    }

    return apiService.put(
      API_ENDPOINTS.QUESTION_BANK_UPDATE_SHARE(bankId, userId),
      {
        can_edit: data.permission === 'edit' || data.permission === 'delete',
        can_delete: data.permission === 'delete',
      }
    );
  }

  // Statistics
  async getQuestionBankStats(bankId: number): Promise<QuestionBankStats> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return {
        total_questions: 0,
        total_usage: 0,
        avg_difficulty: 0,
        question_types: {},
        difficulty_distribution: {},
      };
    }

    return apiService.get<QuestionBankStats>(
      API_ENDPOINTS.QUESTION_BANK_STATS(bankId)
    );
  }
}

export const questionBankService = new QuestionBankService();
export default questionBankService;
