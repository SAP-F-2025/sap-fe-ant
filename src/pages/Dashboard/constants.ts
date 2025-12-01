/**
 * Dashboard constants - avoiding magic numbers
 */

// Query stale times in milliseconds
export const STALE_TIME = {
	SHORT: 10_000,      // 10 seconds - for real-time data
	MEDIUM: 30_000,     // 30 seconds - for stats
	LONG: 60_000,       // 1 minute - for trends
	VERY_LONG: 300_000, // 5 minutes - for static data
} as const;

// Refetch intervals
export const REFETCH_INTERVAL = {
	REALTIME: 30_000,   // 30 seconds
} as const;

// Chart dimensions
export const CHART_HEIGHT = 300;

// Theme colors - should match Ant Design theme
export const STAT_CARD_COLORS = {
	primary: '#1890ff',
	success: '#52c41a',
	cyan: '#13c2c2',
	warning: '#faad14',
} as const;

// Pie chart colors
export const PIE_COLORS = ['#1890ff', '#52c41a', '#faad14', '#eb2f96', '#722ed1'] as const;

// Action text mapping for activities
export const ACTION_TEXT_MAP: Record<string, string> = {
	completed_assessment: 'hoàn thành bài thi',
	started_assessment: 'bắt đầu bài thi',
	created_question: 'tạo câu hỏi mới',
	created_assessment: 'tạo bài thi mới',
	published_assessment: 'xuất bản bài thi',
};

export const getActionText = (action: string): string => {
	return ACTION_TEXT_MAP[action] || action;
};
