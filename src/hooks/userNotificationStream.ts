// hooks/useNotificationStream.ts
import { useEffect, useRef, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { notificationService, Notification } from '../services/notificationService';

interface UseNotificationStreamOptions {
    enabled?: boolean;
    onNotification?: (notification: Notification) => void;
    onError?: (error: Event) => void;
    onConnectionChange?: (connected: boolean) => void;
}

export function useNotificationStream(options: UseNotificationStreamOptions = {}) {
    const {
        enabled = true,
        onNotification,
        onError,
        onConnectionChange,
    } = options;

    const queryClient = useQueryClient();
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const mountedRef = useRef(true);

    const handleNotification = useCallback((notification: Notification) => {
        if (!mountedRef.current) return;

        console.log('New notification received:', notification);

        // Invalidate notifications query để refresh UI
        queryClient.invalidateQueries({ queryKey: ['notifications'] });

        // Gọi callback nếu có
        onNotification?.(notification);
    }, [queryClient, onNotification]);

    const handleError = useCallback((error: Event) => {
        if (!mountedRef.current) return;

        console.error('SSE connection error:', error);
        setIsConnected(false);
        setConnectionError('Connection lost. Attempting to reconnect...');
        onConnectionChange?.(false);
        onError?.(error);
    }, [onConnectionChange, onError]);

    const handleOpen = useCallback(() => {
        if (!mountedRef.current) return;

        console.log('SSE connection opened');
        setIsConnected(true);
        setConnectionError(null);
        onConnectionChange?.(true);
    }, [onConnectionChange]);

    useEffect(() => {
        mountedRef.current = true;

        if (enabled) {
            notificationService.connectSSE(
                handleNotification,
                handleError,
                handleOpen
            );
        }

        return () => {
            mountedRef.current = false;
            notificationService.disconnectSSE();
        };
    }, [enabled, handleNotification, handleError, handleOpen]);

    const reconnect = useCallback(() => {
        notificationService.disconnectSSE();
        notificationService.connectSSE(
            handleNotification,
            handleError,
            handleOpen
        );
    }, [handleNotification, handleError, handleOpen]);

    return {
        isConnected,
        connectionError,
        reconnect,
    };
}

export default useNotificationStream;