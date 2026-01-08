import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import i18n from 'i18next';
import { API_CONFIG } from '../config/api';
import type { ErrorResponse } from '../types';
import { handleError } from '../utils/errorHandler';
import { TokenService } from './tokenService';

class ApiService {
	private instance: AxiosInstance;
	private isRefreshing = false;
	private failedQueue: Array<{
		resolve: (value?: any) => void;
		reject: (reason?: any) => void;
	}> = [];

	constructor() {
		this.instance = axios.create({
			baseURL: API_CONFIG.BASE_URL,
			timeout: API_CONFIG.TIMEOUT,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		this.setupInterceptors();
	}

	private processQueue(error: any, token: string | null = null) {
		this.failedQueue.forEach((prom) => {
			if (error) {
				prom.reject(error);
			} else {
				prom.resolve(token);
			}
		});

		this.failedQueue = [];
	}

	private setupInterceptors() {
		// Request interceptor - Add token to all requests
		this.instance.interceptors.request.use(
			async (config) => {
				// Get a valid token (will refresh if expired)
				const token = await TokenService.getValidAccessToken();
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		// Response interceptor - Handle token refresh on 401 and show error messages
		this.instance.interceptors.response.use(
			(response) => response,
			async (error: AxiosError<ErrorResponse>) => {
				const originalRequest = error.config as InternalAxiosRequestConfig & {
					_retry?: boolean;
				};

				// If error is 401 and we haven't retried yet
				if (error.response?.status === 401 && !originalRequest._retry) {
					if (this.isRefreshing) {
						// If already refreshing, queue this request
						return new Promise((resolve, reject) => {
							this.failedQueue.push({ resolve, reject });
						})
							.then((token) => {
								if (originalRequest.headers) {
									originalRequest.headers.Authorization = `Bearer ${token}`;
								}
								return this.instance(originalRequest);
							})
							.catch((err) => {
								handleError(err);
								return Promise.reject(err);
							});
					}

					originalRequest._retry = true;
					this.isRefreshing = true;

					try {
						// Attempt to refresh the token
						const newToken = await TokenService.refreshAccessToken();

						if (newToken) {
							// Update the failed requests with new token
							this.processQueue(null, newToken);

							// Retry the original request with new token
							if (originalRequest.headers) {
								originalRequest.headers.Authorization = `Bearer ${newToken}`;
							}
							return this.instance(originalRequest);
						} else {
							// Refresh failed, redirect to login
							this.processQueue(new Error('Token refresh failed'), null);
							TokenService.clearTokens();
							handleError(error, i18n.t('auth.sessionExpired'));
							setTimeout(() => {
								window.location.href = '/login';
							}, 1000);
							return Promise.reject(error);
						}
					} catch (refreshError) {
						// Refresh failed, clear queue and redirect
						this.processQueue(refreshError, null);
						TokenService.clearTokens();
						handleError(refreshError, i18n.t('auth.sessionExpired'));
						setTimeout(() => {
							window.location.href = '/login';
						}, 1000);
						return Promise.reject(refreshError);
					} finally {
						this.isRefreshing = false;
					}
				}

				// Handle other errors and show toast messages
				handleError(error);
				return Promise.reject(error);
			}
		);
	}

	public getAxiosInstance(): AxiosInstance {
		return this.instance;
	}

	public async get<T>(url: string, params?: any): Promise<T> {
		const response = await this.instance.get<T>(url, { params });
		return response.data;
	}

	public async post<T>(url: string, data?: any): Promise<T> {
		const response = await this.instance.post<T>(url, data);
		return response.data;
	}

	public async put<T>(url: string, data?: any): Promise<T> {
		const response = await this.instance.put<T>(url, data);
		return response.data;
	}

	public async patch<T>(url: string, data?: any): Promise<T> {
		const response = await this.instance.patch<T>(url, data);
		return response.data;
	}

	public async delete<T>(url: string, data?: any): Promise<T> {
		const response = await this.instance.delete<T>(url, { data });
		return response.data;
	}
}

export const apiService = new ApiService();
export default apiService;
