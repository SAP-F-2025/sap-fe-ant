import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { TokenService } from './tokenService';

export interface Notification {
    id: string;
    title: string;
    content: string;
    type: string;
    read: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface NotificationPage {
    content: Notification[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
}

// Helper để lấy token
const getAuthToken = (): string | null => {
    return TokenService.getAccessToken();
};

// Helper để tạo headers với auth
const getAuthHeaders = (): HeadersInit => {
    const token = getAuthToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// Base URL cho notification service
// QUAN TRỌNG: Đảm bảo URL này đúng với backend của bạn
const NOTIFICATION_BASE_URL = import.meta.env.VITE_NOTIFICATION_API_BASE_URL || 'http://localhost:8082';

class NotificationService {
    private eventSource: EventSource | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;

    /**
     * Lấy danh sách notifications với pagination
     */
    async getNotifications(page: number = 0, size: number = 10): Promise<NotificationPage> {
        const response = await fetch(
            `${NOTIFICATION_BASE_URL}${API_ENDPOINTS.NOTIFICATIONS}?page=${page}&size=${size}`,
            {
                method: 'GET',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch notifications: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Đánh dấu notification là đã đọc
     */
    async markAsRead(notificationId: string): Promise<void> {
        const response = await fetch(
            `${NOTIFICATION_BASE_URL}${API_ENDPOINTS.NOTIFICATIONS_MARK_READ(notificationId)}`,
            {
                method: 'PUT',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to mark notification as read: ${response.status}`);
        }
    }

    /**
     * Đánh dấu tất cả notifications là đã đọc
     */
    async markAllAsRead(): Promise<void> {
        const response = await fetch(
            `${NOTIFICATION_BASE_URL}${API_ENDPOINTS.NOTIFICATIONS_MARK_ALL_READ}`,
            {
                method: 'PUT',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to mark all notifications as read: ${response.status}`);
        }
    }

    /**
     * Lấy số lượng notifications chưa đọc
     */
    async getUnreadCount(): Promise<number> {
        const response = await fetch(
            `${NOTIFICATION_BASE_URL}${API_ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT}`,
            {
                method: 'GET',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch unread count: ${response.status}`);
        }

        const data = await response.json();
        return data.count || data.unreadCount || 0;
    }

    /**
     * Kết nối SSE để nhận notifications real-time
     * QUAN TRỌNG: EventSource không hỗ trợ custom headers,
     * nên phải truyền token qua query parameter
     */
    connectSSE(
        onMessage: (notification: Notification) => void,
        onError?: (error: Event) => void,
        onOpen?: () => void
    ): void {
        // Đóng connection cũ nếu có
        this.disconnectSSE();

        const token = getAuthToken();
        if (!token) {
            console.error('No auth token available for SSE connection');
            return;
        }

        // QUAN TRỌNG: Truyền token qua query parameter vì EventSource không hỗ trợ headers
        const sseUrl = `${NOTIFICATION_BASE_URL}${API_ENDPOINTS.SSE_CONNECT}?token=${encodeURIComponent(token)}`;

        console.log('Connecting to SSE:', sseUrl.replace(token, '[TOKEN]'));

        this.eventSource = new EventSource(sseUrl);

        this.eventSource.onopen = () => {
            console.log('SSE connection established');
            this.reconnectAttempts = 0;
            onOpen?.();
        };

        this.eventSource.onmessage = (event) => {
            try {
                const notification = JSON.parse(event.data);
                console.log('Received SSE notification:', notification);
                onMessage(notification);
            } catch (error) {
                console.error('Failed to parse SSE message:', error);
            }
        };

        // Handle specific event types
        this.eventSource.addEventListener('notification', (event: MessageEvent) => {
            try {
                const notification = JSON.parse(event.data);
                onMessage(notification);
            } catch (error) {
                console.error('Failed to parse notification event:', error);
            }
        });

        this.eventSource.addEventListener('heartbeat', () => {
            console.log('SSE heartbeat received');
        });

        this.eventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            onError?.(error);

            // Auto-reconnect logic
            if (this.eventSource?.readyState === EventSource.CLOSED) {
                this.handleReconnect(onMessage, onError, onOpen);
            }
        };
    }

    /**
     * Handle SSE reconnection với exponential backoff
     */
    private handleReconnect(
        onMessage: (notification: Notification) => void,
        onError?: (error: Event) => void,
        onOpen?: () => void
    ): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max SSE reconnect attempts reached');
            return;
        }

        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
        console.log(`SSE reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);

        setTimeout(() => {
            this.reconnectAttempts++;
            this.connectSSE(onMessage, onError, onOpen);
        }, delay);
    }

    /**
     * Ngắt kết nối SSE
     */
    disconnectSSE(): void {
        if (this.eventSource) {
            console.log('Disconnecting SSE');
            this.eventSource.close();
            this.eventSource = null;
        }
    }

    /**
     * Kiểm tra trạng thái SSE connection
     */
    isSSEConnected(): boolean {
        return this.eventSource?.readyState === EventSource.OPEN;
    }

    // ==================== ADMIN METHODS ====================

    /**
     * Lấy danh sách templates (Admin)
     */
    async getAllTemplates(page: number = 0, size: number = 10): Promise<TemplatePage> {
        const response = await fetch(
            `${NOTIFICATION_BASE_URL}/api/v1/templates?page=${page}&size=${size}`,
            {
                method: 'GET',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch templates: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Tạo template mới (Admin)
     */
    async createTemplate(template: TemplateCreate): Promise<Template> {
        const response = await fetch(
            `${NOTIFICATION_BASE_URL}/api/v1/templates`,
            {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(template),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to create template: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Xóa template (Admin)
     */
    async deleteTemplate(name: string): Promise<void> {
        const response = await fetch(
            `${NOTIFICATION_BASE_URL}/api/v1/templates/${name}`,
            {
                method: 'DELETE',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to delete template: ${response.status}`);
        }
    }

    /**
    * Gửi notification test cho user (Admin)
    */
    async sendTestNotificationToUser(userId: number, message: string, type: string = 'test_notification', subject: string = 'Test Notification'): Promise<any> {
        // Query params
        const params = new URLSearchParams({
            targetUserId: userId.toString(),
            message,
            type,
            subject
        });

        const response = await fetch(
            `${NOTIFICATION_BASE_URL}/api/v1/sse/test/send-to-user?${params.toString()}`,
            {
                method: 'POST',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to send notification to user: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Broadcast notification tới topic (Admin)
     */
    async broadcastToTopic(topic: string, message: string): Promise<any> {
        const params = new URLSearchParams({
            topic,
            message
        });

        const response = await fetch(
            `${NOTIFICATION_BASE_URL}/api/v1/sse/test/broadcast?${params.toString()}`,
            {
                method: 'POST',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to broadcast: ${response.status}`);
        }

        return response.json();
    }
}

export interface Template {
    id?: string;
    name: string;
    type: 'EMAIL' | 'PUSH';
    subject: string;
    body: string;
    variables?: Record<string, string>;
    createdAt?: string;
    updatedAt?: string;
}

export interface TemplateCreate {
    name: string;
    type: 'EMAIL' | 'PUSH';
    subject: string;
    body: string;
    variables?: Record<string, string>;
}

export interface TemplatePage {
    content: Template[];
    pageable: any;
}

export const notificationService = new NotificationService();
export default notificationService;