import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { App } from 'antd';
import i18n from 'i18next';
import React, { ReactNode } from 'react';

/**
 * React Query Provider with global error handling
 * Integrates with Ant Design's message/notification system
 */

interface QueryProviderProps {
	children: ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
	const { message } = App.useApp();

	// Create QueryClient with global configurations
	const [queryClient] = React.useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// Stale time: 5 minutes
						staleTime: 5 * 60 * 1000,
						// Cache time: 10 minutes
						gcTime: 10 * 60 * 1000,
						// Retry failed requests 1 time
						retry: 1,
						// Refetch on window focus in production
						refetchOnWindowFocus: import.meta.env.PROD,
						// Don't refetch on mount if data is fresh
						refetchOnMount: false,
					},
					mutations: {
						// Retry failed mutations once
						retry: 1,
					},
				},
				queryCache: new QueryCache({
					onError: (error) => {
						// Global query error handler
						const errorMessage =
							error instanceof Error ? error.message : i18n.t('errors.queryError');
						message.error(errorMessage);
					},
				}),
				mutationCache: new MutationCache({
					onError: (error) => {
						// Global mutation error handler
						const errorMessage =
							error instanceof Error ? error.message : i18n.t('errors.mutationError');
						message.error(errorMessage);
					},
				}),
			})
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{/* React Query Devtools - only in development */}
			{import.meta.env.DEV && (
				<ReactQueryDevtools
					initialIsOpen={false}
					position="bottom"
					buttonPosition="bottom-right"
				/>
			)}
		</QueryClientProvider>
	);
};
