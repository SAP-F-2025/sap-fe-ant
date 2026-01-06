/**
 * Student Dashboard Constants
 * Color palettes and configuration for student UI components
 */

// Gradient colors for stat cards (matching mockup design)
export const STUDENT_STAT_COLORS = {
    available: '#3b82f6',   // Blue - Available Assessments
    completed: '#10b981',   // Green - Completed
    inProgress: '#f59e0b',  // Amber - In Progress
    attempts: '#8b5cf6',    // Purple - Total Attempts
} as const;

// Score-based color coding
export const SCORE_COLORS = {
    excellent: '#10b981',  // >= 80%
    good: '#3b82f6',       // >= 70%
    average: '#f59e0b',    // >= 50%
    poor: '#ef4444',       // < 50%
} as const;

// Get color based on score percentage
export const getScoreColor = (score: number): string => {
    if (score >= 80) return SCORE_COLORS.excellent;
    if (score >= 70) return SCORE_COLORS.good;
    if (score >= 50) return SCORE_COLORS.average;
    return SCORE_COLORS.poor;
};

// Chart configuration
export const CHART_CONFIG = {
    gaugeHeight: 200,
    progressBarHeight: 12,
    animationDuration: 1000,
} as const;

// Due date urgency thresholds (in days)
export const DUE_DATE_THRESHOLDS = {
    urgent: 1,    // <= 1 day = red
    warning: 3,   // <= 3 days = orange
    normal: 7,    // > 3 days = green/blue
} as const;
