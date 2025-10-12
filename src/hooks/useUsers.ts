import { useQuery } from '@tanstack/react-query';
import userService from '../services/userService';
import { User } from '../types';

interface UseUsersParams {
  q?: string;
  role?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

export const useUsers = (params?: UseUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getUsers(params),
    enabled: params?.enabled !== false,
  });
};

export const useSearchUsers = (searchQuery: string, enabled = true) => {
  return useQuery({
    queryKey: ['users', 'search', searchQuery],
    queryFn: () => userService.searchUsers({ q: searchQuery, size: 50 }),
    enabled: enabled && searchQuery.length > 0,
  });
};

export const useUser = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getUser(id),
    enabled: enabled && !!id,
  });
};
