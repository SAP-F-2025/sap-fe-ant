import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsers, useCreateUser } from './useUsers';
import type { ReactNode } from 'react';

/**
 * Test: useUsers hook
 * Tests React Query hook with proper wrapper
 */

// Create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useUsers', () => {
  it('should fetch users successfully', async () => {
    const { result } = renderHook(() => useUsers({ page: 1, size: 10 }), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for data
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Check data structure
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.data).toBeInstanceOf(Array);
    expect(result.current.data?.total).toBeGreaterThanOrEqual(0);
  });

  it('should filter users by search query', async () => {
    const { result } = renderHook(
      () => useUsers({ page: 1, size: 10, search: 'Nguyễn' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Should return filtered results
    const users = result.current.data?.data || [];
    users.forEach((user) => {
      expect(
        user.name.includes('Nguyễn') || user.email.includes('nguyễn')
      ).toBeTruthy();
    });
  });

  it('should filter users by role', async () => {
    const { result } = renderHook(
      () => useUsers({ page: 1, size: 10, role: 'admin' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const users = result.current.data?.data || [];
    users.forEach((user) => {
      expect(user.role).toBe('admin');
    });
  });
});

describe('useCreateUser', () => {
  it('should have correct mutation state', () => {
    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });
});
