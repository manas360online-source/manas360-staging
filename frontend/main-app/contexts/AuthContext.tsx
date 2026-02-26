/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUTH CONTEXT - CENTRALIZED AUTHENTICATION STATE
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Provides:
 * - User authentication state (user, role, permissions)
 * - Login/logout/refresh methods
 * - Token persistence across app
 * - Auto-refresh on 401 errors
 * 
 * Usage:
 *   import { useAuth } from '@/contexts/AuthContext';
 *   
 *   const { user, role, login, logout, isAuthenticated } = useAuth();
 * 
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api, isAuthenticated as hasAuthCookie } from '../../utils/apiClient-unified';

// ════════════════════════════════════════════════════════════════════════════
// Types
// ════════════════════════════════════════════════════════════════════════════

interface User {
  id: string;
  phone: string;
  role: 'patient' | 'therapist' | 'admin';
  createdAt: string;
  adminMetadata?: {
    permissions: string[];
    department?: string;
  };
}

interface AuthContextValue {
  user: User | null;
  role: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, otp?: string) => Promise<{ requiresOtp: boolean; user?: User | null }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ════════════════════════════════════════════════════════════════════════════
// Context
// ════════════════════════════════════════════════════════════════════════════

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ════════════════════════════════════════════════════════════════════════════
// Provider Component
// ════════════════════════════════════════════════════════════════════════════

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --------------------------------------------------------
  // Fetch current user on mount (if token exists)
  // --------------------------------------------------------
  const refreshUser = useCallback(async () => {
    if (!hasAuthCookie()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.users.getMe();
      const userData = response?.data?.data || response?.data?.user || null;
      setUser(userData);
    } catch (error) {
      console.error('[AuthContext] Failed to fetch user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // --------------------------------------------------------
  // Login: Send OTP or verify OTP
  // --------------------------------------------------------
  const login = useCallback(async (identifier: string, otp?: string) => {
    if (!otp) {
      // Step 1: Send OTP
      await api.auth.sendOtp(identifier);
      return { requiresOtp: true };
    }

    // Step 2: Verify OTP and get tokens
    const response = await api.auth.verifyOtp(identifier, otp);
    const userData = response?.data?.user || response?.data?.data?.user || null;
    setUser(userData);

    return { requiresOtp: false, user: userData };
  }, []);

  // --------------------------------------------------------
  // Logout: Clear tokens and user state
  // --------------------------------------------------------
  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch {
      // ignore logout failures on client reset path
    }
    setUser(null);
  }, []);

  // --------------------------------------------------------
  // Derived state
  // --------------------------------------------------------
  const isAuthenticated = !!user;
  const role = user?.role || null;
  const permissions = user?.adminMetadata?.permissions || [];

  const value: AuthContextValue = {
    user,
    role,
    permissions,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
