/**
 * Notification Service
 * API service for notification-service backend
 */
import axios, { AxiosInstance } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { TokenService } from './tokenService';
import type {
    Notification,
    NotificationPage,
    NotificationPreferences,
    NotificationPreferencesUpdate,
    TelegramLinkResponse,
    TelegramStatus,
} from '../types/notification';

class NotificationService {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({
            baseURL: API_CONFIG.NOTIFICATION_BASE_URL,
            timeout: API_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor - Add token to all requests
        this.instance.interceptors.request.use(
            async (config) => {
                const token = await TokenService.getValidAccessToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    // ============= Notification APIs =============

    /**
     * Get paginated notification history for current user
     */
    async getNotifications(page: number = 0, size: number = 20): Promise<NotificationPage> {
        const response = await this.instance.get<NotificationPage>(API_ENDPOINTS.NOTIFICATIONS, {
            params: { page, size },
        });
        return response.data;
    }

    /**
     * Get unread notification count
     */
    async getUnreadCount(): Promise<number> {
        const response = await this.instance.get<number>(API_ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT);
        return response.data;
    }

    /**
     * Mark a specific notification as read
     */
    async markAsRead(id: string): Promise<void> {
        await this.instance.put(API_ENDPOINTS.NOTIFICATION_MARK_READ(id));
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(): Promise<number> {
        const response = await this.instance.put<number>(API_ENDPOINTS.NOTIFICATIONS_MARK_ALL_READ);
        return response.data;
    }

    /**
     * Delete a notification
     */
    async deleteNotification(id: string): Promise<void> {
        await this.instance.delete(API_ENDPOINTS.NOTIFICATION_DELETE(id));
    }

    // ============= Preference APIs =============

    /**
     * Get current user's notification preferences
     * Returns null if user has no preferences yet (404)
     */
    async getPreferences(): Promise<NotificationPreferences | null> {
        try {
            const response = await this.instance.get<NotificationPreferences>(
                API_ENDPOINTS.NOTIFICATION_PREFERENCES
            );
            return response.data;
        } catch (error: any) {
            // 404 means user has no preferences yet - this is normal
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    }

    /**
     * Update current user's notification preferences
     */
    async updatePreferences(
        preferences: NotificationPreferencesUpdate
    ): Promise<NotificationPreferences> {
        const response = await this.instance.put<NotificationPreferences>(
            API_ENDPOINTS.NOTIFICATION_PREFERENCES,
            preferences
        );
        return response.data;
    }

    /**
     * Create notification preferences (first time)
     */
    async createPreferences(
        preferences: NotificationPreferencesUpdate
    ): Promise<NotificationPreferences> {
        const response = await this.instance.post<NotificationPreferences>(
            API_ENDPOINTS.NOTIFICATION_PREFERENCES,
            preferences
        );
        return response.data;
    }

    // ============= Telegram Integration APIs =============

    /**
     * Generate Telegram deep link and QR code for linking
     */
    async generateTelegramLink(): Promise<TelegramLinkResponse> {
        const response = await this.instance.get<TelegramLinkResponse>(
            API_ENDPOINTS.TELEGRAM_LINK
        );
        return response.data;
    }

    /**
     * Unlink Telegram from user account
     */
    async unlinkTelegram(): Promise<void> {
        await this.instance.delete(API_ENDPOINTS.TELEGRAM_LINK);
    }

    /**
     * Get Telegram link status
     */
    async getTelegramStatus(): Promise<TelegramStatus> {
        const response = await this.instance.get<TelegramStatus>(
            API_ENDPOINTS.TELEGRAM_STATUS
        );
        return response.data;
    }

    // ============= Helper Methods =============

    /**
     * Get SSE connection URL with token
     */
    async getSSEConnectionUrl(): Promise<string> {
        const token = await TokenService.getValidAccessToken();
        return `${API_CONFIG.NOTIFICATION_BASE_URL}${API_ENDPOINTS.SSE_CONNECT}?token=${token}`;
    }
}

export const notificationService = new NotificationService();
export default notificationService;
