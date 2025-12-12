export interface Template {
    id: string;
    name: string;
    type: 'EMAIL' | 'PUSH';
    subject: string;
    body: string;
    variables: Record<string, string>;
}

export interface TemplateCreate {
    name: string;
    type: 'EMAIL' | 'PUSH';
    subject: string;
    body: string;
    variables?: Record<string, string>;
}

export interface UserNotification {
    id: string;
    type: string;
    subject: string;
    content: string;
    isRead: boolean;
    createdAt: number;
}

export interface NotificationTypeSetting {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
}

export interface Preferences {
    id: string;
    userId: number;
    notificationsEnabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    emailFrequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY';
    notificationTypes: Record<string, NotificationTypeSetting>;
}

export interface PreferencesCreate {
    notificationsEnabled?: boolean;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    emailFrequency?: 'IMMEDIATE' | 'DAILY' | 'WEEKLY';
    notificationTypes?: Record<string, NotificationTypeSetting>;
}

export interface SSEStats {
    activeUserConnections: number;
    timestamp: number;
}

export interface EventPublishResponse {
    success: boolean;
    messageId?: string;
    stream?: string;
    event?: any;
}
