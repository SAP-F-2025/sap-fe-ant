import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { TokenService } from '../services/tokenService';

export const useNotificationStream = () => {
    const queryClient = useQueryClient();
    const eventSourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
        const connect = async () => {
            const token = await TokenService.getValidAccessToken();
            if (!token) return;

            // Construct URL with token query param as EventSource doesn't support headers natively
            // Check if we need to prepend base URL (similar logic to service)
            let url = API_ENDPOINTS.SSE_CONNECT;
            if (API_CONFIG.NOTIFICATION_BASE_URL && API_CONFIG.NOTIFICATION_BASE_URL !== API_CONFIG.BASE_URL) {
                const base = API_CONFIG.NOTIFICATION_BASE_URL.replace(/\/$/, '');
                url = `${base}${url}`;
            } else {
                url = `${API_CONFIG.BASE_URL}${url}`;
            }

            // Append token
            const streamUrl = `${url}?token=${token}`;

            const es = new EventSource(streamUrl);

            es.onopen = () => {
                console.log('SSE Connected');
            };

            es.addEventListener('notification', (event: MessageEvent) => {
                try {
                    const data = JSON.parse(event.data);
                    // Invalidate queries to refresh list/count
                    queryClient.invalidateQueries({ queryKey: ['notifications'] });
                    queryClient.invalidateQueries({ queryKey: ['unread_count'] });

                    // Optional: Show toast for distinct notification types
                    if (data.subject) {
                        message.info(data.subject);
                    }
                } catch (e) {
                    console.error('Error parsing notification event', e);
                }
            });

            es.onerror = (e) => {
                console.error('SSE Error', e);
                es.close();
            };

            eventSourceRef.current = es;
        };

        connect();

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, [queryClient]);
};
