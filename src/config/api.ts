export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888',
  TIMEOUT: 30000,
  USE_MOCK: false, // Default to mock for development
};

export const API_ENDPOINTS = {
  // Health
  HEALTH: '/health',

  // Assessments
  ASSESSMENTS: '/api/v1/assessments',
  ASSESSMENT_DETAIL: (id: number) => `/api/v1/assessments/${id}/details`,
  ASSESSMENT_PUBLISH: (id: number) => `/api/v1/assessments/${id}/publish`,
  ASSESSMENT_ARCHIVE: (id: number) => `/api/v1/assessments/${id}/archive`,
  ASSESSMENT_STATS: (id: number) => `/api/v1/assessments/${id}/stats`,
  ASSESSMENT_UPDATE: (id: number) => `/api/v1/assessments/${id}`,
  ASSESSMENT_QUESTIONS: (id: number) => `/api/v1/assessments/${id}/questions`,
  ASSESSMENT_ADD_QUESTION: (id: number, questionId: number) => `/api/v1/assessments/${id}/questions/${questionId}`,
  ASSESSMENT_REMOVE_QUESTION: (id: number, questionId: number) => `/api/v1/assessments/${id}/questions/${questionId}`,
  ASSESSMENT_UPDATE_QUESTION: (id: number, questionId: number) => `/api/v1/assessments/${id}/questions/${questionId}`,
  ASSESSMENT_BULK_ADD_QUESTIONS: (id: number) => `/api/v1/assessments/${id}/questions/batch`,
  ASSESSMENT_BULK_REMOVE_QUESTIONS: (id: number) => `/api/v1/assessments/${id}/questions/batch`,
  ASSESSMENT_BULK_UPDATE_QUESTIONS: (id: number) => `/api/v1/assessments/${id}/questions/batch`,
  ASSESSMENT_REORDER_QUESTIONS: (id: number) => `/api/v1/assessments/${id}/questions/reorder`,

  // Questions
  QUESTIONS: '/api/v1/questions',
  QUESTION_DETAIL: (id: number) => `/api/v1/questions/${id}`,
  QUESTIONS_BATCH: '/api/v1/questions/batch',
  QUESTIONS_RANDOM: '/api/v1/questions/random',

  // Question Banks
  QUESTION_BANKS: '/api/v1/question-banks',
  QUESTION_BANKS_PUBLIC: '/api/v1/question-banks/public',
  QUESTION_BANKS_SHARED: '/api/v1/question-banks/shared',
  QUESTION_BANKS_SEARCH: '/api/v1/question-banks/search',
  QUESTION_BANK_DETAIL: (id: number) => `/api/v1/question-banks/${id}`,
  QUESTION_BANK_STATS: (id: number) => `/api/v1/question-banks/${id}/stats`,
  QUESTION_BANK_SHARE: (id: number) => `/api/v1/question-banks/${id}/share`,
  QUESTION_BANK_SHARES: (id: number) => `/api/v1/question-banks/${id}/shares`,
  QUESTION_BANK_UNSHARE: (id: number, userId: string) => `/api/v1/question-banks/${id}/share/${userId}`,
  QUESTION_BANK_UPDATE_SHARE: (id: number, userId: string) => `/api/v1/question-banks/${id}/share/${userId}/permissions`,
  QUESTION_BANK_QUESTIONS: (id: number) => `/api/v1/question-banks/${id}/questions`,
  QUESTION_BANK_ADD_QUESTIONS: (id: number) => `/api/v1/question-banks/${id}/questions`,
  QUESTION_BANK_REMOVE_QUESTIONS: (id: number) => `/api/v1/question-banks/${id}/questions`,

  // Attempts
  ATTEMPTS: '/api/v1/attempts',
  ATTEMPT_START: '/api/v1/attempts/start',
  ATTEMPT_SUBMIT: '/api/v1/attempts/submit',
  ATTEMPT_DETAIL: (id: number) => `/api/v1/attempts/${id}`,

  // Grading
  GRADING_ANSWER: (answerId: number) => `/api/v1/grading/answers/${answerId}`,
  GRADING_ATTEMPT: (attemptId: number) => `/api/v1/grading/attempts/${attemptId}`,
  GRADING_AUTO: (attemptId: number) => `/api/v1/grading/attempts/${attemptId}/auto`,

  // Users
  USERS: '/api/v1/users',
  USERS_SEARCH: '/api/v1/users/search',
  USER_DETAIL: (id: string) => `/api/v1/users/${id}`,

  // Dashboard
  DASHBOARD_STATS: '/api/v1/dashboard/stats',
  DASHBOARD_ACTIVITY_TRENDS: '/api/v1/dashboard/activity-trends',
  DASHBOARD_RECENT_ACTIVITIES: '/api/v1/dashboard/recent-activities',
  DASHBOARD_QUESTION_DISTRIBUTION: '/api/v1/dashboard/question-distribution',
  DASHBOARD_PERFORMANCE_BY_SUBJECT: '/api/v1/dashboard/performance-by-subject',
};
