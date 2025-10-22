import { CasdoorConfig } from '../config/casdoor';
import { TokenService } from './tokenService';

export class AuthService {
  /**
   * Logout from Casdoor
   */
  static async logout(): Promise<void> {
    try {
      const accessToken = TokenService.getAccessToken();
      const sessionId = this.getSessionId();
      
      if (accessToken) {
        const logoutUrl = `${CasdoorConfig.serverUrl}/api/logout`;
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        };

        if (sessionId) {
          headers['casdoor_session_id'] = sessionId;
        }
        
        await fetch(logoutUrl, {
          method: 'POST',
          headers,
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      TokenService.clearTokens();
      this.clearSessionId();
    }
  }

  private static getSessionId(): string | null {
    const cookies = document.cookie.split('; ');
    const sessionCookie = cookies.find(c => c.startsWith('casdoor_session_id='));
    return sessionCookie ? sessionCookie.split('=')[1] : null;
  }

  private static clearSessionId(): void {
    document.cookie = 'casdoor_session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}
