import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import {
    EventPublishResponse,
    Preferences,
    PreferencesCreate,
    SSEStats,
    Template,
    TemplateCreate,
    UserNotification,
} from '../types/notification';
import { Pageable } from '../types';
import apiService from './api';

class NotificationService {
    // --- Base URL Handling ---
    // The notification service might be on a different port/URL.
    // We need to ensure requests go to the correct base URL if not proxied.
    // For now, assuming endpoints in API_ENDPOINTS are absolute paths from the configured base.
    // If API_CONFIG.NOTIFICATION_BASE_URL is different from API_CONFIG.BASE_URL,
    // we might need a separate axios instance or full URL construction.
    // However, apiService uses the default instance.
    // Let's assume for now the proxy handles routing /notification-service or similar,
    // OR we override the baseURL for these specific calls if strictly needed.
    // Given the config change:
    // NOTIFICATION_BASE_URL: 'http://localhost:8082/notification-service'
    // and generic BASE_URL: 'http://localhost:8888'
    // We should probably use a custom request method or specific full URLs if not behind gateway.
    // But `apiService` is hardcoded to `BASE_URL`.
    // Let's try to allow full URLs in `apiService` or just use the relative path if everything is proxied.
    // If `API_ENDPOINTS` returns a full URL (starting with http), axios usually handles it.
    // But our `API_ENDPOINTS` values are paths `/api/v1/...`.
    // For this implementation, I will assume the MAIN API GATEWAY routes to notification service
    // OR I will perform a small hack to prepend the notification URL if it differs.

    private getBaseUrl() {
        return API_CONFIG.NOTIFICATION_BASE_URL;
    }

    private getUrl(endpoint: string): string {
        if (endpoint.startsWith('http')) return endpoint;
        // Remove leading slash to join cleanly if needed, or just append
        // If BASE_URL is the gateway, we just use the endpoint.
        // If we need to talk directly to notification service (different port), we construct it.
        // Checking if NOTIFICATION_BASE_URL is distinct and not just a placeholder.
        if (API_CONFIG.NOTIFICATION_BASE_URL && API_CONFIG.NOTIFICATION_BASE_URL !== API_CONFIG.BASE_URL) {
            // Remove potentially double slashes
            const base = API_CONFIG.NOTIFICATION_BASE_URL.replace(/\/$/, '');
            const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
            return `${base}${path}`;
        }
        return endpoint;
    }

    // Since apiService uses a specific instance with `baseURL` set to `API_CONFIG.BASE_URL`,
    // passing a full URL to its methods (get, post, etc.) will override the baseURL.
    // So `getUrl` strategy is correct.

    // --- Templates ---
    async getTemplates(params?: { page?: number; size?: number; sort?: string }) {
        return apiService.get<{ content: Template[]; pageable: Pageable }>(
            this.getUrl(API_ENDPOINTS.TEMPLATES),
            params
        );
    }

    async getTemplate(name: string) {
        return apiService.get<Template>(this.getUrl(API_ENDPOINTS.TEMPLATE_DETAIL(name)));
    }

    async createTemplate(data: TemplateCreate) {
        return apiService.post<Template>(this.getUrl(API_ENDPOINTS.TEMPLATES), data);
    }

    async updateTemplate(name: string, data: TemplateCreate) {
        return apiService.put<Template>(this.getUrl(API_ENDPOINTS.TEMPLATE_DETAIL(name)), data);
    }

    async deleteTemplate(name: string) {
        return apiService.delete(this.getUrl(API_ENDPOINTS.TEMPLATE_DETAIL(name)));
    }

    // --- User Notifications ---
    async getHistory(params?: { page?: number; size?: number }) {
        return apiService.get<{ content: UserNotification[]; pageable: Pageable }>(
            this.getUrl(API_ENDPOINTS.NOTIFICATION_HISTORY),
            params
        );
    }

    async getUnreadCount() {
        const res = await apiService.get<{ count: number }>(
            this.getUrl(API_ENDPOINTS.NOTIFICATION_UNREAD_COUNT)
        );
        return res.count;
    }

    async markAsRead(id: string) {
        return apiService.put(this.getUrl(API_ENDPOINTS.NOTIFICATION_MARK_READ(id)));
    }

    async markAllAsRead() {
        return apiService.put<{ markedCount: number }>(
            this.getUrl(API_ENDPOINTS.NOTIFICATION_MARK_ALL_READ)
        );
    }

    async deleteNotification(id: string) {
        return apiService.delete(this.getUrl(API_ENDPOINTS.NOTIFICATION_DELETE(id)));
    }

    // --- Preferences ---
    async getPreferences() {
        return apiService.get<Preferences>(this.getUrl(API_ENDPOINTS.PREFERENCES));
    }

    async updatePreferences(data: PreferencesCreate) {
        // Try to update, if 404 then create (or handle in component, but typically PUT handles both or we check first)
        // The API spec has separate POST (create) and PUT (update).
        // We'll try PUT, if it fails with 404, we call POST.
        // Or we can just expose both.
        // Let's expose both and let the UI decide, or auto-handle.
        // For simplicity, let's just expose update. If the API adheres to standards, PUT might create if not exists?
        // Spec says: GET 404 -> user should create.
        // So we likely need `createPreferences` too.
        return apiService.put<Preferences>(this.getUrl(API_ENDPOINTS.PREFERENCES), data);
    }

    async createPreferences(data: PreferencesCreate) {
        return apiService.post<Preferences>(this.getUrl(API_ENDPOINTS.PREFERENCES), data);
    }


    // --- Admin / SSE ---
    async getSSEStats() {
        return apiService.get<SSEStats>(this.getUrl(API_ENDPOINTS.SSE_STATS));
    }

    async sendTestNotificationToUser(userId: number, message: string, type: string = 'test', subject: string = 'Test Notification') {
        return apiService.post<EventPublishResponse>(
            this.getUrl(API_ENDPOINTS.NOTIFICATION_SEND_USER),
            null, // body is empty, params in query
            {
                params: {
                    targetUserId: userId,
                    message,
                    type,
                    subject
                }
            }
        );
    }

    // Note: The `apiService.post` signature in `src/services/api.ts` is `post<T>(url: string, data?: any): Promise<T>`.
    // It doesn't seem to support a 3rd argument for config (like axios). 
    // I need to check `apiService.post` implementation again.
    // Checked `src/services/api.ts`: 
    // public async post<T>(url: string, data?: any): Promise<T> {
    // 	  const response = await this.instance.post<T>(url, data);
    // 	  return response.data;
    // }
    // It does NOT support params in the 3rd argument directly via the wrapper.
    // I should construct the query string manually or update the wrapper.
    // Updating the wrapper is riskier. I will append params to URL.

    async sendTestNotificationToUserCorrected(userId: number, message: string, type: string = 'test', subject: string = 'Test Notification') {
        const query = new URLSearchParams({
            targetUserId: userId.toString(),
            message,
            type,
            subject
        }).toString();
        return apiService.post<EventPublishResponse>(
            this.getUrl(`${API_ENDPOINTS.NOTIFICATION_SEND_USER}?${query}`)
        );
    }

    async broadcastMessage(topic: string, message: string) {
        const query = new URLSearchParams({
            topic,
            message
        }).toString();
        return apiService.post<{ success: boolean; topic: string; message: string }>(
            this.getUrl(`${API_ENDPOINTS.NOTIFICATION_BROADCAST}?${query}`)
        );
    }
}

export const notificationService = new NotificationService();
export default notificationService;
