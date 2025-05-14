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
          
          // More comprehensive check for valid user data
          if (response && 
              response.data && 
              response.data.success && 
              response.data.data && 
              response.data.data.user) {
            
            setUser(response.data.data.user);
            setIsAuthenticated(true);
          } else {
            // If response format isn't as expected but no error thrown
            console.warn('Auth check: Unexpected response format', response);
            handleLogout('Session expired. Please login again.');
          }
        } catch (err: any) {
          // Handle auth check error
          console.error('Authentication check failed:', err);
          
          // Only clear auth if it's an auth-related error (like 401 Unauthorized)
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            handleLogout('Session expired. Please login again.');
          } else {
            // For network or server errors, don't log the user out
            // This prevents logout on temporary server issues
            console.error('Server or network error during auth check');
            setError('Connection error. Your login status could not be verified.');
          }
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Helper function to handle logout with optional error message
  const handleLogout = (errorMsg?: string) => {
    localStorage.removeItem('token');
    api.removeAuthToken();
    setUser(null);
    setIsAuthenticated(false);
    
    if (errorMsg) {
      setError(errorMsg);
    }
  };

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

      if (response && response.data && response.data.success) {
        const { accessToken, user } = response.data.data;

        // Store token in localStorage
        localStorage.setItem('token', accessToken);
        api.setAuthToken(accessToken);

        setUser(user);
        setIsAuthenticated(true);
      } else {
        throw new Error(response?.data?.message || 'Registration failed');
      }
    } catch (err: any) {
      let errorMessage = 'An error occurred during registration';
      
      console.error('Registration error:', err); // Add this for debugging
      
      // Better error handling with more specific messages
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
                      
        // Check if it's a 404 error
        if (err.response.status === 404) {
          errorMessage = 'API endpoint not found. Please check server configuration. Endpoint: /auth/signup';
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check if the server is running at http://localhost:4000';
      } else {
        // Something happened in setting up the request
        errorMessage = err.message;
      }
      
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

      if (response && response.data && response.data.success) {
        const { accessToken, user } = response.data.data;

        // Store token in localStorage
        localStorage.setItem('token', accessToken);
        api.setAuthToken(accessToken);

        setUser(user);
        setIsAuthenticated(true);
      } else {
        throw new Error(response?.data?.message || 'Login failed');
      }
    } catch (err: any) {
      let errorMessage = 'An error occurred during login';
      
      console.error('Login error:', err); // Add this for debugging
      
      // Better error handling with more specific messages
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = err.response.data?.message || 
                      `Server error: ${err.response.status}`;
                      
        // Check if it's a 404 error
        if (err.response.status === 404) {
          errorMessage = 'API endpoint not found. Please check server configuration. Endpoint: /auth/signin';
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check if the server is running at http://localhost:4000';
      } else {
        // Something happened in setting up the request
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    handleLogout();
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