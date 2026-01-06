import { CasdoorConfig } from '../config/casdoor';

export interface TokenResponse {
	access_token: string;
	refresh_token?: string;
	expires_in?: number;
	token_type?: string;
}

/**
 * Token Service for managing access tokens and refresh tokens
 */
export class TokenService {
	private static refreshPromise: Promise<string | null> | null = null;

	/**
	 * Get the current access token from localStorage
	 */
	static getAccessToken(): string | null {
		return localStorage.getItem('casdoor_token');
	}

	/**
	 * Get the current refresh token from localStorage
	 */
	static getRefreshToken(): string | null {
		return localStorage.getItem('casdoor_refresh_token');
	}

	/**
	 * Get the token expiry time from localStorage
	 */
	static getTokenExpiry(): number | null {
		const expiry = localStorage.getItem('casdoor_token_expiry');
		return expiry ? parseInt(expiry, 10) : null;
	}

	/**
	 * Check if the access token is expired or will expire soon
	 * @param bufferSeconds Number of seconds before actual expiry to consider token as expired (default: 60)
	 */
	static isTokenExpired(bufferSeconds: number = 60): boolean {
		const expiry = this.getTokenExpiry();
		if (!expiry) return true;

		const now = Date.now();
		const bufferMs = bufferSeconds * 1000;
		return now >= expiry - bufferMs;
	}

	/**
	 * Store tokens in localStorage
	 */
	static setTokens(data: TokenResponse): void {
		if (data.access_token) {
			localStorage.setItem('casdoor_token', data.access_token);
		}

		if (data.refresh_token) {
			localStorage.setItem('casdoor_refresh_token', data.refresh_token);
		}

		if (data.expires_in) {
			const expiryTime = Date.now() + data.expires_in * 1000;
			localStorage.setItem('casdoor_token_expiry', expiryTime.toString());
		}
	}

	/**
	 * Clear all tokens from localStorage
	 */
	static clearTokens(): void {
		localStorage.removeItem('casdoor_token');
		localStorage.removeItem('casdoor_refresh_token');
		localStorage.removeItem('casdoor_token_expiry');
	}

	/**
	 * Refresh the access token using the refresh token
	 * Returns the new access token or null if refresh fails
	 */
	static async refreshAccessToken(): Promise<string | null> {
		// If a refresh is already in progress, return that promise
		if (this.refreshPromise) {
			return this.refreshPromise;
		}

		// Create a new refresh promise
		this.refreshPromise = this._performRefresh();

		try {
			const result = await this.refreshPromise;
			return result;
		} finally {
			// Clear the promise when done
			this.refreshPromise = null;
		}
	}

	/**
	 * Internal method to perform the actual token refresh
	 */
	private static async _performRefresh(): Promise<string | null> {
		const refreshToken = this.getRefreshToken();

		if (!refreshToken) {
			console.warn('No refresh token available');
			return null;
		}

		try {
			const tokenUrl = `${CasdoorConfig.serverUrl}/api/login/oauth/refresh_token`;
			const tokenParams = new URLSearchParams({
				grant_type: 'refresh_token',
				refresh_token: refreshToken,
				scope: 'read',
				client_id: CasdoorConfig.clientId,
			});

			const response = await fetch(tokenUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: tokenParams.toString(),
			});

			if (!response.ok) {
				console.error('Token refresh failed:', response.status, response.statusText);
				// If refresh fails, clear tokens to force re-login
				this.clearTokens();
				return null;
			}

			const data: TokenResponse = await response.json();

			if (data && data.access_token) {
				// Store the new tokens
				this.setTokens(data);
				return data.access_token;
			}

			return null;
		} catch (error) {
			console.error('Error refreshing token:', error);
			// Clear tokens on error
			this.clearTokens();
			return null;
		}
	}

	/**
	 * Get a valid access token, refreshing if necessary
	 * @returns A valid access token or null if unable to obtain one
	 */
	static async getValidAccessToken(): Promise<string | null> {
		const accessToken = this.getAccessToken();

		// If no token exists, return null
		if (!accessToken) {
			return null;
		}

		// If token is not expired, return it
		if (!this.isTokenExpired()) {
			return accessToken;
		}

		// Token is expired, try to refresh

		return this.refreshAccessToken();
	}
}
