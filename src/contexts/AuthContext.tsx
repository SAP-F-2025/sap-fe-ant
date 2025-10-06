import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { CasdoorSdk } from '../config/casdoor';

export interface User {
  name: string;
  email?: string;
  avatar?: string;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  getAccessToken: () => string | null;
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
      const token = localStorage.getItem('casdoor_token');
      if (token) {
        try {
          const userInfo = await CasdoorSdk.getUserInfo();
          setUser(userInfo);
        } catch (error) {
          console.error('Failed to get user info:', error);
          localStorage.removeItem('casdoor_token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = () => {
    // Redirect to Casdoor login page
    window.location.href = CasdoorSdk.getSigninUrl();
    // console.log(CasdoorSdk.getSigninUrl())
  };

  const logout = () => {
    localStorage.removeItem('casdoor_token');
    setUser(null);
    // Redirect to Casdoor logout
    window.location.href = CasdoorSdk.getSignoutUrl();
  };

  const getAccessToken = () => {
    return localStorage.getItem('casdoor_token');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
