import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import axios from 'axios';
import { API_CONFIG } from '../config/api';

/**
 * User type definition
 */
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateInput {
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  status?: 'active' | 'inactive';
}

export interface UserUpdateInput extends Partial<UserCreateInput> {
  id: number;
}

export interface UsersQueryParams {
  page?: number;
  size?: number;
  search?: string;
  role?: string;
  status?: string;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  size: number;
}

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UsersQueryParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// Mock data for development
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    role: 'teacher',
    status: 'active',
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    role: 'student',
    status: 'inactive',
    createdAt: '2025-01-03T00:00:00Z',
    updatedAt: '2025-01-03T00:00:00Z',
  },
];

// API functions
const fetchUsers = async (params: UsersQueryParams): Promise<UsersResponse> => {
  if (API_CONFIG.USE_MOCK) {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 500));
    let filtered = [...mockUsers];

    // Apply filters
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
      );
    }
    if (params.role) {
      filtered = filtered.filter((u) => u.role === params.role);
    }
    if (params.status) {
      filtered = filtered.filter((u) => u.status === params.status);
    }

    // Apply sorting
    if (params.sortField && params.sortOrder) {
      filtered.sort((a, b) => {
        const aVal = a[params.sortField as keyof User];
        const bVal = b[params.sortField as keyof User];
        const compare = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return params.sortOrder === 'ascend' ? compare : -compare;
      });
    }

    // Apply pagination
    const page = params.page || 1;
    const size = params.size || 10;
    const start = (page - 1) * size;
    const end = start + size;
    const paginated = filtered.slice(start, end);

    return {
      data: paginated,
      total: filtered.length,
      page,
      size,
    };
  }

  // Real API implementation
  const response = await axios.get<UsersResponse>('/api/v1/users', { params });
  return response.data;
};

const createUser = async (input: UserCreateInput): Promise<User> => {
  if (API_CONFIG.USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newUser: User = {
      id: Math.max(...mockUsers.map((u) => u.id), 0) + 1,
      ...input,
      status: input.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  }

  const response = await axios.post<User>('/api/v1/users', input);
  return response.data;
};

const updateUser = async (input: UserUpdateInput): Promise<User> => {
  if (API_CONFIG.USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockUsers.findIndex((u) => u.id === input.id);
    if (index === -1) throw new Error('User not found');

    const updated: User = {
      ...mockUsers[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    mockUsers[index] = updated;
    return updated;
  }

  const response = await axios.put<User>(`/api/v1/users/${input.id}`, input);
  return response.data;
};

const deleteUser = async (id: number): Promise<void> => {
  if (API_CONFIG.USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index !== -1) {
      mockUsers.splice(index, 1);
    }
    return;
  }

  await axios.delete(`/api/v1/users/${id}`);
};

// React Query hooks

/**
 * Fetch users with server-side pagination, filtering, sorting
 */
export const useUsers = (params: UsersQueryParams = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => fetchUsers(params),
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Create user mutation with optimistic update
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate all user queries
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      message.success('Tạo người dùng thành công');
    },
  });
};

/**
 * Update user mutation with optimistic update
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: updateUser,
    // Optimistic update
    onMutate: async (input) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });

      // Snapshot previous value
      const previousUsers = queryClient.getQueriesData({
        queryKey: userKeys.lists(),
      });

      // Optimistically update
      queryClient.setQueriesData({ queryKey: userKeys.lists() }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((user: User) =>
            user.id === input.id ? { ...user, ...input } : user
          ),
        };
      });

      return { previousUsers };
    },
    onError: (_err, _input, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        context.previousUsers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      message.success('Cập nhật người dùng thành công');
    },
  });
};

/**
 * Delete user mutation
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      message.success('Xóa người dùng thành công');
    },
  });
};

/**
 * Bulk delete users mutation
 */
export const useBulkDeleteUsers = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      await Promise.all(ids.map((id) => deleteUser(id)));
    },
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      message.success(`Đã xóa ${ids.length} người dùng`);
    },
  });
};
