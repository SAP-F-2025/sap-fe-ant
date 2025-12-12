export const API_CONFIG = {
	BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888',
	VERIFICATION_BASE_URL:
		import.meta.env.VITE_VERIFICATION_API_BASE_URL || 'http://localhost:8000',
	PROCTORING_BASE_URL: import.meta.env.VITE_PROCTORING_API_BASE_URL || 'http://localhost:8889',
	TIMEOUT: 30000,
	USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true', // Read from environment variable
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
	ASSESSMENT_ADD_QUESTION: (id: number, questionId: number) =>
		`/api/v1/assessments/${id}/questions/${questionId}`,
	ASSESSMENT_REMOVE_QUESTION: (id: number, questionId: number) =>
		`/api/v1/assessments/${id}/questions/${questionId}`,
	ASSESSMENT_UPDATE_QUESTION: (id: number, questionId: number) =>
		`/api/v1/assessments/${id}/questions/${questionId}`,
	ASSESSMENT_BULK_ADD_QUESTIONS: (id: number) => `/api/v1/assessments/${id}/questions/batch`,
	ASSESSMENT_BULK_REMOVE_QUESTIONS: (id: number) => `/api/v1/assessments/${id}/questions/batch`,
	ASSESSMENT_BULK_UPDATE_QUESTIONS: (id: number) => `/api/v1/assessments/${id}/questions/batch`,
	ASSESSMENT_REORDER_QUESTIONS: (id: number) => `/api/v1/assessments/${id}/questions/reorder`,
	ASSESSMENT_AUTO_ASSIGN_QUESTIONS: (id: number) =>
		`/api/v1/assessments/${id}/questions/auto-assign`,
	ASSESSMENT_RESULTS_EXPORT: (id: number) => `/api/v1/assessments/${id}/results/export`,

	// Questions
	QUESTIONS: '/api/v1/questions',
	QUESTION_DETAIL: (id: number) => `/api/v1/questions/${id}`,
	QUESTIONS_BATCH: '/api/v1/questions/batch',
	QUESTIONS_RANDOM: '/api/v1/questions/random',
	QUESTIONS_IMPORT: '/api/v1/questions/import',
	QUESTIONS_EXPORT: '/api/v1/questions/export',
	QUESTIONS_TEMPLATE: '/api/v1/questions/template',

	// Question Banks
	QUESTION_BANKS: '/api/v1/question-banks',
	QUESTION_BANKS_PUBLIC: '/api/v1/question-banks/public',
	QUESTION_BANKS_SHARED: '/api/v1/question-banks/shared',
	QUESTION_BANKS_SEARCH: '/api/v1/question-banks/search',
	QUESTION_BANK_DETAIL: (id: number) => `/api/v1/question-banks/${id}`,
	QUESTION_BANK_STATS: (id: number) => `/api/v1/question-banks/${id}/stats`,
	QUESTION_BANK_SHARE: (id: number) => `/api/v1/question-banks/${id}/share`,
	QUESTION_BANK_SHARES: (id: number) => `/api/v1/question-banks/${id}/shares`,
	QUESTION_BANK_UNSHARE: (id: number, userId: string) =>
		`/api/v1/question-banks/${id}/share/${userId}`,
	QUESTION_BANK_UPDATE_SHARE: (id: number, userId: string) =>
		`/api/v1/question-banks/${id}/share/${userId}/permissions`,
	QUESTION_BANK_QUESTIONS: (id: number) => `/api/v1/question-banks/${id}/questions`,
	QUESTION_BANK_ADD_QUESTIONS: (id: number) => `/api/v1/question-banks/${id}/questions`,
	QUESTION_BANK_REMOVE_QUESTIONS: (id: number) => `/api/v1/question-banks/${id}/questions`,

	// Attempts
	ATTEMPTS: '/api/v1/attempts',
	ATTEMPT_START: '/api/v1/attempts/start',
	ATTEMPT_SUBMIT: '/api/v1/attempts/submit',
	ATTEMPT_DETAIL: (id: number) => `/api/v1/attempts/${id}`,
	ATTEMPT_DETAIL_FULL: (id: number) => `/api/v1/attempts/${id}/details`,
	ATTEMPT_RESUME: (id: number) => `/api/v1/attempts/${id}/resume`,
	ATTEMPT_ANSWER: (id: number) => `/api/v1/attempts/${id}/answer`,
	ATTEMPT_TIME_REMAINING: (id: number) => `/api/v1/attempts/${id}/time-remaining`,
	ATTEMPT_CAN_START: (assessmentId: number) => `/api/v1/attempts/can-start/${assessmentId}`,
	ATTEMPT_CURRENT: (assessmentId: number) => `/api/v1/attempts/current/${assessmentId}`,
	ATTEMPT_COUNT: (assessmentId: number) => `/api/v1/attempts/count/${assessmentId}`,
	ATTEMPT_BY_STUDENT: (studentId: string | number) => `/api/v1/attempts/student/${studentId}`,
	ATTEMPT_BY_ASSESSMENT: (assessmentId: number) => `/api/v1/attempts/assessment/${assessmentId}`,

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

	// Student Panel
	STUDENT_STATS: '/api/v1/students/me/stats',
	STUDENT_ASSESSMENTS: '/api/v1/students/me/assessments',
	STUDENT_ASSESSMENT_DETAIL: (id: number) => `/api/v1/students/me/assessments/${id}`,
	STUDENT_ATTEMPTS: '/api/v1/students/me/attempts',

	// Violations (uses PROCTORING_BASE_URL)
	VIOLATIONS: '/api/v1/violations',
	VIOLATIONS_BATCH: '/api/v1/violations/batch',

	// Face Verification (uses VERIFICATION_BASE_URL)
	FACE_REGISTRATION_STATUS: '/api/v1/face/registration-status',
	FACE_REGISTER: '/api/v1/face/register',
	FACE_VERIFY: '/api/v1/face/verify',
	FACE_DELETE: '/api/v1/face/user',

	// Proctoring (uses PROCTORING_BASE_URL)
	PROCTORING_VIOLATIONS: '/api/v1/violations',
	PROCTORING_VIOLATIONS_BATCH: '/api/v1/violations/batch',
	PROCTORING_VIOLATIONS_BY_ATTEMPT: (attemptId: number) =>
		`/api/v1/violations/attempt/${attemptId}`,
	PROCTORING_VIOLATIONS_LATEST: (attemptId: number) =>
		`/api/v1/violations/attempt/${attemptId}/latest`,
	PROCTORING_ANALYTICS: (attemptId: number) => `/api/v1/violations/analytics/${attemptId}`,

	// Proctoring Dashboard (uses PROCTORING_BASE_URL)
	PROCTORING_ATTEMPT_SUMMARY: (attemptId: number) =>
		`/api/v1/dashboard/attempts/${attemptId}/summary`,
	PROCTORING_ATTEMPT_SUMMARIES: '/api/v1/dashboard/attempts/summaries',
	PROCTORING_STATS_HOURLY: '/api/v1/dashboard/stats/hourly',
	PROCTORING_STATS_DAILY: '/api/v1/dashboard/stats/daily',
	PROCTORING_USER_PATTERNS: (userId: string) => `/api/v1/dashboard/users/${userId}/patterns`,
	PROCTORING_OVERVIEW: '/api/v1/dashboard/overview',
	PROCTORING_REALTIME: '/api/v1/dashboard/realtime',

	// Groups
	GROUPS: '/api/v1/groups',
	GROUPS_MY: '/api/v1/groups/my',
	GROUPS_MEMBERSHIPS: '/api/v1/groups/memberships',
	GROUP_DETAIL: (id: number) => `/api/v1/groups/${id}`,
	GROUP_MEMBERS: (id: number) => `/api/v1/groups/${id}/members`,
	GROUP_MEMBER: (id: number, userId: string) => `/api/v1/groups/${id}/members/${userId}`,
	GROUP_MEMBER_ROLE: (id: number, userId: string) =>
		`/api/v1/groups/${id}/members/${userId}/role`,

	// Group Assessments
	GROUP_ASSESSMENTS: (id: number) => `/api/v1/groups/${id}/assessments`,
	GROUP_ASSESSMENT: (groupId: number, assessmentId: number) =>
		`/api/v1/groups/${groupId}/assessments/${assessmentId}`,
	ASSESSMENT_GROUPS: (assessmentId: number) => `/api/v1/assessments/${assessmentId}/groups`,

	// Group Invites
	GROUP_INVITES: (id: number) => `/api/v1/groups/${id}/invites`,
	GROUP_INVITE_LINK: (id: number) => `/api/v1/groups/${id}/invites/link`,
	GROUP_INVITE_CODE: (id: number) => `/api/v1/groups/${id}/invites/code`,
	GROUP_INVITE_DELETE: (id: number, inviteId: number) =>
		`/api/v1/groups/${id}/invites/${inviteId}`,
	GROUP_INVITE_REGENERATE: (id: number, inviteId: number) =>
		`/api/v1/groups/${id}/invites/${inviteId}/regenerate`,
	GROUP_LEAVE: (id: number) => `/api/v1/groups/${id}/leave`,
	GROUP_JOIN_LINK: (token: string) => `/api/v1/groups/join/link/${token}`,
	GROUP_JOIN_CODE: '/api/v1/groups/join/code',
};
