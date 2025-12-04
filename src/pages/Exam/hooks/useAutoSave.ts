import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import studentService from '../../../services/studentService';
import type { SubmitAnswerRequest } from '../../../types';

export const useAutoSave = (attemptId: number) => {
  const saveQueueRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const pendingSavesRef = useRef<Set<number>>(new Set());

  const submitAnswerMutation = useMutation({
    mutationFn: (data: SubmitAnswerRequest) =>
      studentService.submitAnswer(attemptId, data),
  });

  const saveAnswer = (questionId: number, answer: any, onSuccess?: () => void, onError?: () => void) => {
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

  const flushPendingSaves = async (answers: Record<number, any>) => {
    const pendingQuestions = Array.from(pendingSavesRef.current);
    if (pendingQuestions.length === 0) return;

    const savePromises = pendingQuestions.map((questionId) =>
      submitAnswerMutation.mutateAsync({
        question_id: questionId,
        answer: answers[questionId],
      }).then(() => {
        pendingSavesRef.current.delete(questionId);
      })
    );

    await Promise.all(savePromises);
  };

  return { saveAnswer, flushPendingSaves, isAutoSaving: submitAnswerMutation.isPending };
};
