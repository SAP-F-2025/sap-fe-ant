/**
 * Notification Context
 * Provides global notification state and SSE connection management
 */
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { sseService } from '../services/sseService';
import { notificationService } from '../services/notificationService';
import { TokenService } from '../services/tokenService';
import { NotificationManager } from '../utils/errorHandler';
import type { SSENotificationEvent } from '../types/notification';

interface NotificationContextValue {
    unreadCount: number;
    isConnected: boolean;
    refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const useNotificationContext = (): NotificationContextValue => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationContext must be used within NotificationProvider');
    }
    return context;
};

interface NotificationProviderProps {
    children: React.ReactNode;
}

export const NotificationContextProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const queryClient = useQueryClient();
    const isInitialized = useRef(false);

    const refreshUnreadCount = useCallback(async () => {
        try {
            const count = await notificationService.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    }, []);

    // Handle new notification from SSE
    const handleNewNotification = useCallback(
        (notification: SSENotificationEvent) => {
            console.log('[NotificationContext] New notification:', notification);

            // Show toast notification on UI
            const notificationInstance = NotificationManager.getInstance();
            if (notificationInstance) {
                notificationInstance.info({
                    message: 'Thông báo mới',
                    description: notification.content,
                    placement: 'topRight',
                    duration: 5,
                });
            }

            // Increment unread count
            setUnreadCount((prev) => prev + 1);

            // Invalidate notifications query to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        [queryClient]
    );

    // Handle connection state change
    const handleConnectionChange = useCallback((connected: boolean) => {
        console.log('[NotificationContext] SSE connected:', connected);
        setIsConnected(connected);
    }, []);

    // Initialize SSE connection and fetch initial unread count
    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;

        const init = async () => {
            const token = await TokenService.getValidAccessToken();
            if (!token) {
                console.log('[NotificationContext] No token, skipping initialization');
                return;
            }

            // Fetch initial unread count
            await refreshUnreadCount();

            // Setup SSE listeners
            const unsubNotification = sseService.onNotification(handleNewNotification);
            const unsubConnection = sseService.onConnectionChange(handleConnectionChange);

            // Connect to SSE
            await sseService.connect();

            // Cleanup on unmount
            return () => {
                unsubNotification();
                unsubConnection();
                sseService.disconnect();
            };
        };

        init();
    }, [refreshUnreadCount, handleNewNotification, handleConnectionChange]);

    const value: NotificationContextValue = {
        unreadCount,
        isConnected,
        refreshUnreadCount,
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export default NotificationContextProvider;
