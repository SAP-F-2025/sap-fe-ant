import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import studentService from '../../../services/studentService';
import type { SubmitAnswerRequest } from '../../../types';

export const useAutoSave = (attemptId: number, timeRemaining: number) => {
	const saveQueueRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
	const pendingSavesRef = useRef<Set<number>>(new Set());
	const answersRef = useRef<Record<number, any>>({});

	const submitAnswerMutation = useMutation({
		mutationFn: (data: SubmitAnswerRequest) => {
			// Backend allows 30s grace period after exam ends
			return studentService.submitAnswer(attemptId, data);
		},
	});

	const saveAnswer = (
		questionId: number,
		answer: any,
		onSuccess?: () => void,
		onError?: () => void
	) => {
		// Store answer for potential flush
		answersRef.current[questionId] = answer;

		const existingTimeout = saveQueueRef.current.get(questionId);
		if (existingTimeout) clearTimeout(existingTimeout);

		pendingSavesRef.current.add(questionId);

		const timeout = setTimeout(() => {
			submitAnswerMutation.mutate(
				{ question_id: questionId, answer },
				{
					onSuccess: () => {
						pendingSavesRef.current.delete(questionId);
						onSuccess?.();
					},
					onError: () => {
						onError?.();
					},
				}
			);
			saveQueueRef.current.delete(questionId);
		}, 2000);

		saveQueueRef.current.set(questionId, timeout);
	};

	// Flush pending saves immediately
	const flushPendingSaves = async () => {
		// Clear all pending timeouts
		saveQueueRef.current.forEach((timeout) => clearTimeout(timeout));
		saveQueueRef.current.clear();

		const pendingQuestions = Array.from(pendingSavesRef.current);
		if (pendingQuestions.length === 0) return;

		// Save all pending immediately
		const savePromises = pendingQuestions.map((questionId) =>
			submitAnswerMutation
				.mutateAsync({
					question_id: questionId,
					answer: answersRef.current[questionId],
				})
				.then(() => {
					pendingSavesRef.current.delete(questionId);
				})
				.catch(() => {
					// Ignore errors on flush
				})
		);

		await Promise.all(savePromises);
	};

	return {
		saveAnswer,
		flushPendingSaves,
		isAutoSaving: submitAnswerMutation.isPending,
	};
};
