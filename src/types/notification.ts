/**
 * Notification Types
 * Types matching notification-service backend DTOs
 */

// ============= Core Notification Types =============

/**
 * User notification from backend API
 */
export interface Notification {
    id: string;
    type: string;
    subject: string;
    content: string;
    read: boolean;
    createdAt: number;
}

/**
 * Paginated notification response from Spring Boot backend
 */
export interface NotificationPage {
    content: Notification[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

// ============= Notification Preferences =============

/**
 * Per-notification-type settings
 * Matches backend: Map<String, Map<String, Boolean>>
 */
export interface NotificationTypeSettings {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    telegramEnabled: boolean;
}

/**
 * User notification preferences matching backend PreferenceDto
 */
export interface NotificationPreferences {
    id?: string;
    userId?: string;
    notificationsEnabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    telegramEnabled: boolean;
    telegramChatId?: string;
    telegramLinkedAt?: string;
    notificationTypes?: Record<string, NotificationTypeSettings>;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Update payload for notification preferences
 */
export interface NotificationPreferencesUpdate {
    notificationsEnabled?: boolean;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    telegramEnabled?: boolean;
    notificationTypes?: Record<string, NotificationTypeSettings>;
}

/**
 * Known notification type keys used in the system
 */
export const NOTIFICATION_TYPES = {
    ASSESSMENT_ASSIGNED: 'assessment_assigned',
    ASSESSMENT_REMINDERS: 'assessment_reminders',
    GRADE_NOTIFICATIONS: 'grade_notifications',
    COMMENTS_FEEDBACK: 'comments_feedback',
    SYSTEM_UPDATES: 'system_updates',
} as const;

export type NotificationTypeKey = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

// ============= SSE Event Types =============

export interface SSENotificationEvent {
    type: string;
    content: string;
    timestamp: string;
}

export interface SSEConnectEvent {
    message: string;
    userId: string;
    timestamp: string;
}

export interface SSEHeartbeatEvent {
    timestamp: string;
    type: 'heartbeat';
}

export type SSEEventData = SSENotificationEvent | SSEConnectEvent | SSEHeartbeatEvent;

// ============= Telegram Integration Types =============

/**
 * Response from GET /api/v1/telegram/link
 */
export interface TelegramLinkResponse {
    deepLink: string;
    qrCode: string; // Base64 encoded PNG
    expiresInSeconds: number;
}

/**
 * Response from GET /api/v1/telegram/status
 */
export interface TelegramStatus {
    linked: boolean;
    chatId: string;
}

