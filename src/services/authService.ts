import { CasdoorConfig } from '../config/casdoor';
import { TokenService } from './tokenService';

export class AuthService {
	/**
	 * Logout from Casdoor using Single Sign-Out (SSO)
	 * Implements best practices from Casdoor SSO documentation
	 */
	static async logout(): Promise<void> {
		try {
			const accessToken = TokenService.getAccessToken();

			if (accessToken) {
				// Use the SSO logout endpoint as per Casdoor documentation
				const logoutUrl = `${CasdoorConfig.serverUrl}/api/sso-logout`;

				// Create abort controller for 5-second timeout
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 5000);

				try {
					await fetch(logoutUrl, {
						method: 'POST',
						headers: {
							Authorization: `Bearer ${accessToken}`,
							'Content-Type': 'application/json',
						},
						credentials: 'include', // Include cookies for session handling
						signal: controller.signal,
					});
				} catch (fetchError) {
					// Log error but don't throw - we'll clear local state anyway
					if (fetchError instanceof Error && fetchError.name === 'AbortError') {
						console.warn('Logout request timed out after 5 seconds');
					} else {
						console.error('Logout API error:', fetchError);
					}
				} finally {
					clearTimeout(timeoutId);
				}
			}
		} catch (error) {
			// Log unexpected errors but continue to clear local state
			console.error('Unexpected logout error:', error);
		} finally {
			// Always clear local authentication state regardless of API success
			// This ensures the user appears logged out even if the endpoint fails
			TokenService.clearTokens();
			sessionStorage.clear();
		}
	}
}
