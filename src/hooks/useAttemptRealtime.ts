/**
 * useAttemptRealtime Hook
 * Provides realtime polling for attempt violations and progress monitoring
 */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { proctoringDashboardService } from '../services/proctoringDashboardService';
import studentService from '../services/studentService';
import type { AttemptViolationSummary, ViolationLog } from '../types/proctoring';
import type { AttemptDetail } from '../types';

// Polling interval in milliseconds
const POLL_INTERVAL = 5000; // 5 seconds

interface UseAttemptRealtimeOptions {
    attemptId: number;
    enabled?: boolean;
    onNewViolation?: (violation: ViolationLog) => void;
}

interface AttemptRealtimeData {
    // Violations
    violations: ViolationLog[];
    violationSummary: AttemptViolationSummary | null;

    // Attempt progress
    attemptDetails: AttemptDetail | null;

    // Metadata
    lastUpdated: Date | null;
    isRefreshing: boolean;
    justRefreshed: boolean; // True for 1 second after refresh

    // Status
    isLoading: boolean;
    isError: boolean;
    error: Error | null;

    // Computed
    isAttemptCompleted: boolean;
    newViolationsCount: number;

    // Actions
    refresh: () => void;
}

export function useAttemptRealtime({
    attemptId,
    enabled = true,
    onNewViolation,
}: UseAttemptRealtimeOptions): AttemptRealtimeData {
    const queryClient = useQueryClient();
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [justRefreshed, setJustRefreshed] = useState(false);
    const [previousViolationCount, setPreviousViolationCount] = useState(0);
    const [newViolationsCount, setNewViolationsCount] = useState(0);

    // Query for violations list
    const violationsQuery = useQuery({
        queryKey: ['live-violations', attemptId],
        queryFn: async () => {
            const response = await proctoringDashboardService.getViolationsByAttempt(attemptId, {
                pageSize: 100,
            });
            return response.data || [];
        },
        enabled: enabled && attemptId > 0,
        refetchInterval: POLL_INTERVAL,
        staleTime: POLL_INTERVAL - 1000,
    });

    // Query for violation summary
    const summaryQuery = useQuery({
        queryKey: ['live-violation-summary', attemptId],
        queryFn: () => proctoringDashboardService.getAttemptSummary(attemptId),
        enabled: enabled && attemptId > 0,
        refetchInterval: POLL_INTERVAL,
        staleTime: POLL_INTERVAL - 1000,
    });

    // Query for attempt details (progress)
    const attemptQuery = useQuery({
        queryKey: ['live-attempt-details', attemptId],
        queryFn: () => studentService.getAttemptDetails(attemptId),
        enabled: enabled && attemptId > 0,
        refetchInterval: POLL_INTERVAL,
        staleTime: POLL_INTERVAL - 1000,
    });

    // Check if attempt is completed to stop polling
    const isAttemptCompleted = useMemo(() => {
        if (!attemptQuery.data) return false;
        const status = attemptQuery.data.status;
        return status === 'completed' || status === 'timeout' || status === 'abandoned';
    }, [attemptQuery.data]);

    // Stop polling when attempt is completed
    useEffect(() => {
        if (isAttemptCompleted) {
            // Disable refetch when completed
            queryClient.setQueryDefaults(['live-violations', attemptId], {
                refetchInterval: false,
            });
            queryClient.setQueryDefaults(['live-violation-summary', attemptId], {
                refetchInterval: false,
            });
            queryClient.setQueryDefaults(['live-attempt-details', attemptId], {
                refetchInterval: false,
            });
        }
    }, [isAttemptCompleted, attemptId, queryClient]);

    // Track new violations
    useEffect(() => {
        const currentCount = violationsQuery.data?.length || 0;
        if (currentCount > previousViolationCount && previousViolationCount > 0) {
            const diff = currentCount - previousViolationCount;
            setNewViolationsCount((prev) => prev + diff);

            // Notify about new violations
            if (onNewViolation && violationsQuery.data) {
                const newViolations = violationsQuery.data.slice(0, diff);
                newViolations.forEach(onNewViolation);
            }
        }
        setPreviousViolationCount(currentCount);
    }, [violationsQuery.data, previousViolationCount, onNewViolation]);

    // Update lastUpdated timestamp and trigger refresh animation
    useEffect(() => {
        if (!violationsQuery.isFetching && !violationsQuery.isLoading) {
            setLastUpdated(new Date());
            setJustRefreshed(true);

            // Reset justRefreshed after 1 second
            const timer = setTimeout(() => {
                setJustRefreshed(false);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [violationsQuery.dataUpdatedAt]);

    // Manual refresh function
    const refresh = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['live-violations', attemptId] });
        queryClient.invalidateQueries({ queryKey: ['live-violation-summary', attemptId] });
        queryClient.invalidateQueries({ queryKey: ['live-attempt-details', attemptId] });
    }, [queryClient, attemptId]);

    const isRefreshing =
        violationsQuery.isFetching || summaryQuery.isFetching || attemptQuery.isFetching;

    const isLoading =
        violationsQuery.isLoading || summaryQuery.isLoading || attemptQuery.isLoading;

    const isError = violationsQuery.isError || summaryQuery.isError || attemptQuery.isError;

    const error = violationsQuery.error || summaryQuery.error || attemptQuery.error;

    return {
        violations: violationsQuery.data || [],
        violationSummary: summaryQuery.data ?? null,
        attemptDetails: attemptQuery.data ?? null,
        lastUpdated,
        isRefreshing,
        justRefreshed,
        isLoading,
        isError,
        error: error as Error | null,
        isAttemptCompleted,
        newViolationsCount,
        refresh,
    };
}

export default useAttemptRealtime;
