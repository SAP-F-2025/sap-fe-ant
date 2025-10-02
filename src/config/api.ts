export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888',
  TIMEOUT: 30000,
  USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true' || true, // Default to mock for development
};

export const API_ENDPOINTS = {
  // Health
  HEALTH: '/health',

  // Assessments
  ASSESSMENTS: '/api/v1/assessments',
  ASSESSMENT_DETAIL: (id: number) => `/api/v1/assessments/${id}`,
  ASSESSMENT_PUBLISH: (id: number) => `/api/v1/assessments/${id}/publish`,
  ASSESSMENT_ARCHIVE: (id: number) => `/api/v1/assessments/${id}/archive`,
  ASSESSMENT_STATS: (id: number) => `/api/v1/assessments/${id}/stats`,

  // Questions
  QUESTIONS: '/api/v1/questions',
  QUESTION_DETAIL: (id: number) => `/api/v1/questions/${id}`,
  QUESTIONS_BATCH: '/api/v1/questions/batch',
  QUESTIONS_RANDOM: '/api/v1/questions/random',

  // Question Banks
  QUESTION_BANKS: '/api/v1/question-banks',
  QUESTION_BANK_DETAIL: (id: number) => `/api/v1/question-banks/${id}`,
  QUESTION_BANK_SHARE: (id: number) => `/api/v1/question-banks/${id}/share`,

  // Attempts
  ATTEMPTS: '/api/v1/attempts',
  ATTEMPT_START: '/api/v1/attempts/start',
  ATTEMPT_SUBMIT: '/api/v1/attempts/submit',
  ATTEMPT_DETAIL: (id: number) => `/api/v1/attempts/${id}`,

  // Grading
  GRADING_ANSWER: (answerId: number) => `/api/v1/grading/answers/${answerId}`,
  GRADING_ATTEMPT: (attemptId: number) => `/api/v1/grading/attempts/${attemptId}`,
  GRADING_AUTO: (attemptId: number) => `/api/v1/grading/attempts/${attemptId}/auto`,
};
