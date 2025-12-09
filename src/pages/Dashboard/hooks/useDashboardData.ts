import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import dashboardService from "../../../services/dashboardService";
import { PIE_COLORS, REFETCH_INTERVAL, STALE_TIME } from "../constants";

// Map API question types to translation keys
const questionTypeToTranslationKey: Record<string, string> = {
	multiple_choice: "question.type.multipleChoice",
	true_false: "question.type.trueFalse",
	essay: "question.type.essay",
	fill_blank: "question.type.fillBlank",
	matching: "question.type.matching",
	ordering: "question.type.ordering",
	short_answer: "question.type.shortAnswer",
	others: "question.type.others",
};

/**
 * Custom hook for all dashboard data fetching
 * Centralizes React Query logic and data transformations
 */
export const useDashboardData = (timePeriod: "week" | "month" | "year") => {
	const { t } = useTranslation();
	// Dashboard stats
	const statsQuery = useQuery({
		queryKey: ["dashboard-stats"],
		queryFn: () => dashboardService.getDashboardStats(),
		staleTime: STALE_TIME.MEDIUM,
	});

	// Activity trends - depends on time period
	const activityQuery = useQuery({
		queryKey: ["activity-trends", timePeriod],
		queryFn: () => dashboardService.getActivityTrends(timePeriod),
		staleTime: STALE_TIME.LONG,
	});

	// Question distribution
	const questionQuery = useQuery({
		queryKey: ["question-distribution"],
		queryFn: () => dashboardService.getQuestionDistribution(),
		staleTime: STALE_TIME.VERY_LONG,
	});

	// Performance by subject
	const performanceQuery = useQuery({
		queryKey: ["performance-by-subject"],
		queryFn: () => dashboardService.getPerformanceBySubject(5),
		staleTime: STALE_TIME.LONG,
	});

	// Recent activities - real-time updates
	const activitiesQuery = useQuery({
		queryKey: ["recent-activities"],
		queryFn: () => dashboardService.getRecentActivities(4),
		staleTime: STALE_TIME.SHORT,
		refetchInterval: REFETCH_INTERVAL.REALTIME,
	});

	// Memoized chart data transformations
	const questionChartData = useMemo(() => {
		return (questionQuery.data || []).map((item, index) => ({
			name: questionTypeToTranslationKey[item.type]
				? t(questionTypeToTranslationKey[item.type])
				: item.name,
			value: item.count,
			color: PIE_COLORS[index % PIE_COLORS.length],
		}));
	}, [questionQuery.data, t]);

	const performanceChartData = useMemo(() => {
		return (performanceQuery.data || []).map((item) => ({
			subject: item.subject_name,
			score: item.average_score,
		}));
	}, [performanceQuery.data]);

	const activityChartData = useMemo(() => {
		return (activityQuery.data || []).map((item) => ({
			month: item.period,
			attempts: item.attempts,
			users: item.users,
			score: item.average_score,
		}));
	}, [activityQuery.data]);

	return {
		// Raw data
		stats: statsQuery.data,
		activityData: activityQuery.data || [],
		questionTypeData: questionQuery.data || [],
		performanceData: performanceQuery.data || [],
		recentActivities: activitiesQuery.data || [],

		// Loading states
		isLoading: {
			stats: statsQuery.isLoading,
			activity: activityQuery.isLoading,
			question: questionQuery.isLoading,
			performance: performanceQuery.isLoading,
			activities: activitiesQuery.isLoading,
		},

		// Error states
		isError: {
			stats: statsQuery.isError,
			activity: activityQuery.isError,
			question: questionQuery.isError,
			performance: performanceQuery.isError,
			activities: activitiesQuery.isError,
		},

		errors: {
			stats: statsQuery.error,
			activity: activityQuery.error,
			question: questionQuery.error,
			performance: performanceQuery.error,
			activities: activitiesQuery.error,
		},

		// Transformed chart data
		chartData: {
			question: questionChartData,
			performance: performanceChartData,
			activity: activityChartData,
		},
	};
};

export type DashboardData = ReturnType<typeof useDashboardData>;
