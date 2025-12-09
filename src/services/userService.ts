import { API_CONFIG, API_ENDPOINTS } from "../config/api";
import apiService from "./api";
import { User, PaginationParams } from "../types";
import { delay } from "./mockData";

interface UserListResponse {
	users: User[];
	total: number;
	page: number;
	size: number;
}

interface UserSearchParams extends PaginationParams {
	q?: string;
	role?: string;
}

class UserService {
	async getUsers(params?: UserSearchParams): Promise<UserListResponse> {
		if (API_CONFIG.USE_MOCK) {
			await delay();
			const mockUsers: User[] = [
				{
					id: "user_1",
					full_name: "Nguyễn Văn A",
					email: "nguyenvana@example.com",
					role: "teacher",
					avatar_url: "https://i.pravatar.cc/150?img=1",
					email_verified: true,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				},
				{
					id: "user_2",
					full_name: "Trần Thị B",
					email: "tranthib@example.com",
					role: "teacher",
					avatar_url: "https://i.pravatar.cc/150?img=2",
					email_verified: true,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				},
				{
					id: "user_3",
					full_name: "Lê Văn C",
					email: "levanc@example.com",
					role: "student",
					avatar_url: "https://i.pravatar.cc/150?img=3",
					email_verified: true,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				},
			];

			let filtered = [...mockUsers];
			if (params?.q) {
				const search = params.q.toLowerCase();
				filtered = filtered.filter(
					(u) =>
						u.full_name.toLowerCase().includes(search) ||
						u.email.toLowerCase().includes(search),
				);
			}

			if (params?.role) {
				filtered = filtered.filter((u) => u.role === params.role);
			}

			const page = params?.page || 1;
			const size = params?.size || 10;
			const start = (page - 1) * size;
			const end = start + size;

			return {
				users: filtered.slice(start, end),
				total: filtered.length,
				page,
				size,
			};
		}

		return apiService.get<UserListResponse>(API_ENDPOINTS.USERS, params);
	}

	async searchUsers(params: UserSearchParams): Promise<UserListResponse> {
		if (API_CONFIG.USE_MOCK) {
			return this.getUsers(params);
		}

		return apiService.get<UserListResponse>(
			API_ENDPOINTS.USERS_SEARCH,
			params,
		);
	}

	async getUser(id: string): Promise<User> {
		if (API_CONFIG.USE_MOCK) {
			await delay();
			return {
				id,
				full_name: "Mock User",
				email: "mock@example.com",
				role: "teacher",
				email_verified: true,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};
		}

		return apiService.get<User>(API_ENDPOINTS.USER_DETAIL(id));
	}
}

export const userService = new UserService();
export default userService;
