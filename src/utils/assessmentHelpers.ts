/**
 * Assessment Helpers
 * Utility functions for assessment management
 */

import i18n from "i18next";
import { Assessment, AssessmentStatus } from "../types";

/**
 * Check if assessment questions can be edited
 * Based on FRONTEND_QUESTION_LOCK_MIGRATION.md
 *
 * Questions are locked when:
 * - Assessment is Archived
 * - Assessment is Active/Expired AND has student attempts
 *
 * @param assessment - The assessment to check
 * @returns true if questions can be edited, false if locked
 */
export const canEditQuestions = (assessment: Assessment): boolean => {
	// Cannot edit archived assessments
	if (assessment.status === AssessmentStatus.Archived) {
		return false;
	}

	// Draft can always edit
	if (assessment.status === AssessmentStatus.Draft) {
		return true;
	}

	// Active/Expired: only if no attempts (when API provides this field)
	if (assessment.has_attempts !== undefined) {
		return !assessment.has_attempts;
	}

	// Fallback: use can_edit flag if available
	if (assessment.can_edit !== undefined) {
		return assessment.can_edit;
	}

	// Default: allow for now, will get error if attempts exist
	return true;
};

/**
 * Get lock reason message for UI display
 *
 * @param assessment - The assessment to check
 * @returns Localized message explaining why questions are locked
 */
export const getQuestionsLockReason = (
	assessment: Assessment,
): string | null => {
	if (assessment.status === AssessmentStatus.Archived) {
		return i18n.t("assessment.lockReason.archived");
	}

	if (
		(assessment.status === AssessmentStatus.Active ||
			assessment.status === AssessmentStatus.Expired) &&
		assessment.has_attempts
	) {
		return i18n.t("assessment.lockReason.hasAttempts");
	}

	return null;
};

/**
 * Constants for points validation
 */
export const POINTS_VALIDATION = {
	MIN: 1,
	MAX: 100,
	TOTAL_MAX: 100,
} as const;

/**
 * Validate individual question points
 *
 * @param points - Points to validate
 * @returns true if valid, false otherwise
 */
export const validateQuestionPoints = (points: number): boolean => {
	return (
		Number.isInteger(points) &&
		points >= POINTS_VALIDATION.MIN &&
		points <= POINTS_VALIDATION.MAX
	);
};

/**
 * Validate total assessment points
 *
 * @param questions - Array of questions with points
 * @returns Validation result with error message if invalid
 */
export const validateTotalPoints = (
	questions: Array<{ points: number }>,
): { valid: boolean; error?: string; total?: number } => {
	const total = questions.reduce((sum, q) => sum + q.points, 0);

	if (total > POINTS_VALIDATION.TOTAL_MAX) {
		return {
			valid: false,
			error: i18n.t("assessment.validation.totalPointsExceeded", {
				total,
				max: POINTS_VALIDATION.TOTAL_MAX,
			}),
			total,
		};
	}

	return { valid: true, total };
};

/**
 * Check if adding a question with given points would exceed total limit
 *
 * @param currentTotal - Current total points
 * @param newPoints - Points for new question
 * @returns true if would exceed, false otherwise
 */
export const wouldExceedTotalPoints = (
	currentTotal: number,
	newPoints: number,
): boolean => {
	return currentTotal + newPoints > POINTS_VALIDATION.TOTAL_MAX;
};

/**
 * Calculate remaining points available
 *
 * @param currentTotal - Current total points
 * @returns Remaining points (0 if already at or above max)
 */
export const getRemainingPoints = (currentTotal: number): number => {
	return Math.max(0, POINTS_VALIDATION.TOTAL_MAX - currentTotal);
};
