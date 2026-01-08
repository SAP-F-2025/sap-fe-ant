/**
 * SSE Service
 * Manages Server-Sent Events connection for real-time notifications
 */
import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { TokenService } from './tokenService';
import type { SSENotificationEvent, SSEConnectEvent, SSEHeartbeatEvent } from '../types/notification';

type NotificationCallback = (notification: SSENotificationEvent) => void;
type ConnectionCallback = (connected: boolean) => void;

class SSEService {
    private eventSource: EventSource | null = null;
    private notificationCallbacks: Set<NotificationCallback> = new Set();
    private connectionCallbacks: Set<ConnectionCallback> = new Set();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000; // Start with 1 second
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private isManuallyDisconnected = false;

    /**
     * Connect to SSE stream
     */
    async connect(): Promise<void> {
        if (this.eventSource) {
            console.log('[SSE] Already connected');
            return;
        }

        this.isManuallyDisconnected = false;

        try {
            const token = await TokenService.getValidAccessToken();
            if (!token) {
                console.error('[SSE] No token available');
                return;
            }

            const url = `${API_CONFIG.NOTIFICATION_BASE_URL}${API_ENDPOINTS.SSE_CONNECT}?token=${token}`;

            console.log('[SSE] Connecting...');
            this.eventSource = new EventSource(url);

            this.eventSource.addEventListener('connect', (event: MessageEvent) => {
                console.log('[SSE] Connected');
                this.reconnectAttempts = 0;
                this.reconnectDelay = 1000;
                const data: SSEConnectEvent = JSON.parse(event.data);
                console.log('[SSE] Connection info:', data);
                this.notifyConnectionChange(true);
            });

            this.eventSource.addEventListener('heartbeat', (event: MessageEvent) => {
                const data: SSEHeartbeatEvent = JSON.parse(event.data);
                console.log('[SSE] Heartbeat:', data.timestamp);
            });

            // Generic handler for notification-related events
            const handleNotificationEvent = (eventType: string) => (event: MessageEvent) => {
                console.log(`[SSE] ${eventType} event received:`, event.data);
                try {
                    // The data could be a JSON object or a plain string
                    let content: string;
                    let parsedData: Record<string, unknown> | null = null;

                    try {
                        parsedData = JSON.parse(event.data);
                        content = typeof parsedData.content === 'string'
                            ? parsedData.content
                            : (typeof parsedData.data === 'string' ? parsedData.data : event.data);
                    } catch {
                        // If data is not JSON, use it as-is
                        content = event.data;
                    }

                    const notification: SSENotificationEvent = {
                        type: eventType,
                        content: content,
                        timestamp: (parsedData?.timestamp as string) || new Date().toISOString(),
                    };
                    console.log('[SSE] Notification parsed:', notification);
                    this.notifyListeners(notification);
                } catch (error) {
                    console.error('[SSE] Error parsing notification event:', error);
                }
            };

            // List of all notification event types from backend
            const notificationEventTypes = [
                'notification',           // Generic notification
                'assessment.published',   // Assessment published
                'assessment.expiring',    // Assessment expiring reminder
                'attempt.started',        // Attempt started
                'attempt.submitted',      // Attempt submitted  
                'attempt.graded',         // Attempt graded
            ];

            // Add listeners for all notification event types
            notificationEventTypes.forEach(eventType => {
                this.eventSource!.addEventListener(eventType, handleNotificationEvent(eventType));
            });

            // Also handle generic 'message' events (events without event: field)
            this.eventSource.onmessage = (event: MessageEvent) => {
                console.log('[SSE] Generic message received:', event.data);
                handleNotificationEvent('message')(event);
            };

            this.eventSource.onerror = (error) => {
                console.error('[SSE] Error:', error);
                this.handleDisconnect();
            };
        } catch (error) {
            console.error('[SSE] Connection error:', error);
            this.scheduleReconnect();
        }
    }

    /**
     * Disconnect from SSE stream
     */
    disconnect(): void {
        this.isManuallyDisconnected = true;
        this.cleanup();
        console.log('[SSE] Disconnected manually');
    }

    /**
     * Subscribe to notification events
     */
    onNotification(callback: NotificationCallback): () => void {
        this.notificationCallbacks.add(callback);
        return () => {
            this.notificationCallbacks.delete(callback);
        };
    }

    /**
     * Subscribe to connection state changes
     */
    onConnectionChange(callback: ConnectionCallback): () => void {
        this.connectionCallbacks.add(callback);
        return () => {
            this.connectionCallbacks.delete(callback);
        };
    }

    /**
     * Check if connected
     */
    isConnected(): boolean {
        return this.eventSource !== null && this.eventSource.readyState === EventSource.OPEN;
    }

    // ============= Private Methods =============

    private notifyListeners(notification: SSENotificationEvent): void {
        this.notificationCallbacks.forEach((callback) => {
            try {
                callback(notification);
            } catch (error) {
                console.error('[SSE] Error in notification callback:', error);
            }
        });
    }

    private notifyConnectionChange(connected: boolean): void {
        this.connectionCallbacks.forEach((callback) => {
            try {
                callback(connected);
            } catch (error) {
                console.error('[SSE] Error in connection callback:', error);
            }
        });
    }

    private handleDisconnect(): void {
        this.cleanup();
        this.notifyConnectionChange(false);

        if (!this.isManuallyDisconnected) {
            this.scheduleReconnect();
        }
    }

    private cleanup(): void {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }

    private scheduleReconnect(): void {
        if (this.isManuallyDisconnected) {
            return;
        }

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('[SSE] Max reconnect attempts reached');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

        console.log(`[SSE] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

        this.reconnectTimer = setTimeout(() => {
            this.connect();
        }, delay);
    }
}

export const sseService = new SSEService();
export default sseService;
