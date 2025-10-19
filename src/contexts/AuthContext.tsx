import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { CasdoorSdk } from '../config/casdoor';
import { generateCodeVerifier, generateCodeChallenge, storePKCEVerifier } from '../utils/pkce';
import { TokenService } from '../services/tokenService';
import { decodeJWT, extractUserInfo } from '../utils/jwt';
import { handleError, handleErrorSilently } from '../utils/errorHandler';

export interface User {
  // Basic info
  id?: string;
  name: string;
  displayName?: string;
  avatar?: string;
  type?: string;

  // Contact
  email?: string;
  emailVerified?: boolean;
  phone?: string;
  countryCode?: string;

  // Organization
  owner?: string;
  affiliation?: string;
  education?: string;

  // Permissions
  isAdmin?: boolean;
  role?: string; // User role: 'student', 'teacher', 'admin', etc.
  roles?: any[];
  permissions?: any[];

  // Metadata
  createdTime?: string;
  lastSigninTime?: string;

  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  getAccessToken: () => Promise<string | null>;
  refreshToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        // Try to get a valid access token (will refresh if expired)
        const token = await TokenService.getValidAccessToken();

        if (token) {
          // Decode JWT to get full user info
          const decodedToken = decodeJWT(token);
          console.log('Full decoded token:', decodedToken);

          if (decodedToken) {
            // Extract only essential user info
            const userInfo = extractUserInfo(decodedToken);
            console.log('Extracted user info:', userInfo);
            setUser(userInfo);
          } else {
            // Fallback to SDK getUserInfo if decode fails
            const userInfo = await CasdoorSdk.getUserInfo(token);
            setUser(userInfo);
          }
        }
      } catch (error) {
        console.error('Failed to get user info:', error);
        handleErrorSilently(error);
        TokenService.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async () => {
    // Generate PKCE code verifier and challenge
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store code verifier for later use in callback
    storePKCEVerifier(codeVerifier);

    // Get signin URL with PKCE parameters
    const signinUrl = CasdoorSdk.getSigninUrl();
    const urlWithPKCE = `${signinUrl}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    // Redirect to Casdoor login page with PKCE
    window.location.href = urlWithPKCE;
  };

  const logout = () => {
    // Clear all tokens
    TokenService.clearTokens();
    setUser(null);

    // Optionally redirect to Casdoor logout
    // window.location.href = CasdoorSdk.getSignoutUrl();
  };

  /**
   * Get a valid access token, refreshing if necessary
   */
  const getAccessToken = async (): Promise<string | null> => {
    return TokenService.getValidAccessToken();
  };

  /**
   * Manually refresh the access token
   */
  const refreshToken = async (): Promise<string | null> => {
    try {
      const newToken = await TokenService.refreshAccessToken();

      if (newToken) {
        // Decode JWT to get updated user info
        const decodedToken = decodeJWT(newToken);

        if (decodedToken) {
          // Extract only essential user info
          const userInfo = extractUserInfo(decodedToken);
          setUser(userInfo);
        } else {
          // Fallback to SDK getUserInfo if decode fails
          const userInfo = await CasdoorSdk.getUserInfo(newToken);
          setUser(userInfo);
        }
      } else {
        // Refresh failed, clear user
        setUser(null);
      }

      return newToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      handleError(error, 'Không thể làm mới phiên đăng nhập.');
      setUser(null);
      return null;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    setUser,
    getAccessToken,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
