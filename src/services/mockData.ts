import {
  Assessment,
  AssessmentStatus,
  Question,
  QuestionType,
  DifficultyLevel,
  QuestionBank,
  Attempt,
  AttemptStatus,
  PaginatedResponse,
  AssessmentStats,
} from '../types';

// Mock Assessments
export const mockAssessments: Assessment[] = [
  {
    id: 1,
    title: 'Bài kiểm tra Toán học lớp 12',
    description: 'Bài kiểm tra cuối kỳ môn Toán học',
    duration: 90,
    passing_score: 70,
    max_attempts: 3,
    time_warning: 300,
    status: AssessmentStatus.Active,
    due_date: '2025-10-30T23:59:59Z',
    creator_id: 1,
    created_at: '2025-09-01T10:00:00Z',
    updated_at: '2025-09-01T10:00:00Z',
    question_count: 25,
    total_points: 100,
    settings: {
      randomize_questions: true,
      randomize_options: true,
      show_results: true,
      show_correct_answers: false,
      time_limit_enforced: true,
      auto_submit_on_timeout: true,
    },
  },
  {
    id: 2,
    title: 'Kiểm tra Tiếng Anh - TOEIC',
    description: 'Bài test đánh giá trình độ Tiếng Anh theo chuẩn TOEIC',
    duration: 120,
    passing_score: 65,
    max_attempts: 2,
    status: AssessmentStatus.Active,
    creator_id: 1,
    created_at: '2025-09-05T10:00:00Z',
    updated_at: '2025-09-05T10:00:00Z',
    question_count: 100,
    total_points: 200,
  },
  {
    id: 3,
    title: 'Bài thi Lịch sử Việt Nam',
    description: 'Kiểm tra kiến thức lịch sử Việt Nam thế kỷ 20',
    duration: 60,
    passing_score: 60,
    max_attempts: 1,
    status: AssessmentStatus.Draft,
    creator_id: 1,
    created_at: '2025-09-10T10:00:00Z',
    updated_at: '2025-09-10T10:00:00Z',
    question_count: 30,
    total_points: 100,
  },
];

// Mock Questions
export const mockQuestions: Question[] = [
  {
    id: 1,
    type: QuestionType.MultipleChoice,
    text: 'Kết quả của phép tính 2 + 2 là?',
    points: 10,
    content: {
      options: [
        { id: 'a', text: '3', order: 1 },
        { id: 'b', text: '4', order: 2 },
        { id: 'c', text: '5', order: 3 },
        { id: 'd', text: '6', order: 4 },
      ],
      correct_answers: ['b'],
      multiple_correct: false,
    },
    difficulty: DifficultyLevel.Easy,
    tags: ['toán học', 'cơ bản'],
    explanation: 'Phép cộng cơ bản: 2 + 2 = 4',
    creator_id: 1,
    created_at: '2025-09-01T10:00:00Z',
    updated_at: '2025-09-01T10:00:00Z',
    usage_count: 5,
  },
  {
    id: 2,
    type: QuestionType.TrueFalse,
    text: 'Trái đất quay quanh mặt trời',
    points: 5,
    content: {
      correct_answers: ['true'],
    },
    difficulty: DifficultyLevel.Easy,
    tags: ['thiên văn'],
    creator_id: 1,
    created_at: '2025-09-01T10:00:00Z',
    updated_at: '2025-09-01T10:00:00Z',
    usage_count: 3,
  },
  {
    id: 3,
    type: QuestionType.Essay,
    text: 'Hãy phân tích vai trò của công nghệ thông tin trong giáo dục hiện đại',
    points: 20,
    content: {
      min_words: 100,
      max_words: 500,
    },
    difficulty: DifficultyLevel.Hard,
    tags: ['công nghệ', 'giáo dục'],
    creator_id: 1,
    created_at: '2025-09-01T10:00:00Z',
    updated_at: '2025-09-01T10:00:00Z',
    usage_count: 2,
  },
];

// Mock Question Banks
export const mockQuestionBanks: QuestionBank[] = [
  {
    id: 1,
    name: 'Ngân hàng câu hỏi Toán học',
    description: 'Tập hợp các câu hỏi toán học từ cơ bản đến nâng cao',
    is_public: true,
    tags: ['toán học', 'số học', 'hình học'],
    creator_id: 1,
    created_at: '2025-08-01T10:00:00Z',
    updated_at: '2025-09-01T10:00:00Z',
    question_count: 150,
  },
  {
    id: 2,
    name: 'Ngân hàng câu hỏi Tiếng Anh',
    description: 'Câu hỏi tiếng Anh theo các cấp độ A1-C2',
    is_public: true,
    tags: ['tiếng anh', 'ngữ pháp', 'từ vựng'],
    creator_id: 1,
    created_at: '2025-08-01T10:00:00Z',
    updated_at: '2025-09-01T10:00:00Z',
    question_count: 200,
  },
  {
    id: 3,
    name: 'Câu hỏi Lịch sử - Riêng tư',
    description: 'Bộ câu hỏi lịch sử cho lớp chuyên',
    is_public: false,
    tags: ['lịch sử'],
    creator_id: 1,
    created_at: '2025-08-15T10:00:00Z',
    updated_at: '2025-09-01T10:00:00Z',
    question_count: 80,
  },
];

// Mock Attempts
export const mockAttempts: Attempt[] = [
  {
    id: 1,
    assessment_id: 1,
    student_id: 101,
    status: AttemptStatus.Completed,
    started_at: '2025-09-20T14:00:00Z',
    completed_at: '2025-09-20T15:25:00Z',
    time_remaining: 300,
    score: 85,
    passed: true,
  },
  {
    id: 2,
    assessment_id: 1,
    student_id: 102,
    status: AttemptStatus.InProgress,
    started_at: '2025-09-20T15:00:00Z',
    time_remaining: 2400,
  },
  {
    id: 3,
    assessment_id: 2,
    student_id: 101,
    status: AttemptStatus.Completed,
    started_at: '2025-09-19T10:00:00Z',
    completed_at: '2025-09-19T11:45:00Z',
    score: 72,
    passed: true,
  },
];

// Mock Stats
export const mockAssessmentStats: Record<number, AssessmentStats> = {
  1: {
    total_attempts: 45,
    completed_attempts: 42,
    average_score: 78.5,
    pass_rate: 82.2,
    average_time: 75,
  },
  2: {
    total_attempts: 30,
    completed_attempts: 28,
    average_score: 71.3,
    pass_rate: 75.0,
    average_time: 105,
  },
};

// Helper functions for pagination
export function paginateData<T>(
  data: T[],
  page: number = 1,
  size: number = 10
): PaginatedResponse<T> {
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total: data.length,
    page,
    size,
    total_pages: Math.ceil(data.length / size),
  };
}

// Helper to simulate API delay
export function delay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
