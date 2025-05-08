import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (fullName: string, email: string, password: string, phone?: string) => Promise<void>;
  login: (email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        api.setAuthToken(token);
        try {
          const response = await api.auth.getCurrentUser();
          if (response.data && response.data.success) {
            setUser(response.data.data.user);
            setIsAuthenticated(true);
          }
        } catch (err) {
          // Invalid/expired token
          localStorage.removeItem('token');
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (fullName: string, email: string, password: string, phone?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.auth.register({
        fullName,
        email,
        password,
        phone,
        addresses: []
      });

      if (response.data && response.data.success) {
        const { accessToken, user } = response.data.data;

        // ✅ Store token in localStorage
        localStorage.setItem('token', accessToken);
        api.setAuthToken(accessToken);

        setUser(user);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred during registration';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, phone: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.auth.login({
        email,
        phone,
        password
      });

      if (response.data && response.data.success) {
        const { accessToken, user } = response.data.data;

        // ✅ Store token in localStorage
        localStorage.setItem('token', accessToken);
        api.setAuthToken(accessToken);

        setUser(user);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred during login';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // ✅ clear saved token
    api.removeAuthToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    clearError,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
