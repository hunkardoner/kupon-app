import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { authAPI } from '../api';

// Platform-aware secure storage helpers
const secureStorage = {
  async setItemAsync(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  async getItemAsync(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  async deleteItemAsync(key: string) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  email_verified_at?: string | null;
  google2fa_enabled?: boolean;
  google2fa_enabled_at?: string | null;
  permissions?: any;
  // Optional fields for backwards compatibility
  preferences?: UserPreferences;
  favoriteCategories?: string[];
  totalSavings?: number;
  memberSince?: string;
}

interface UserPreferences {
  notifications: boolean;
  emailAlerts: boolean;
  favoriteCategories: string[];
  priceAlertThreshold: number;
  language: string;
  currency: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export { AuthContext };

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      console.log('Login attempt with:', email);
      const response = await authAPI.login(email, password);
      console.log('Login response:', response);
      
      if (response.success && response.token) {
        console.log('Login successful, dispatching AUTH_SUCCESS with user:', response.user);
        dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      } else {
        console.log('Login failed - no token or unsuccessful:', response);
        dispatch({ type: 'AUTH_ERROR', payload: response.message || 'Giriş başarısız' });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Giriş sırasında hata oluştu';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.register(name, email, password, password);
      
      if (response.success && response.token) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: response.message || 'Kayıt başarısız' });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Kayıt sırasında hata oluştu';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local state
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    try {
      // TODO: Implement with userAPI when available
      dispatch({
        type: 'UPDATE_USER',
        payload: { 
          preferences: { 
            ...state.user?.preferences, 
            ...preferences 
          } as UserPreferences 
        },
      });
    } catch (error) {
      console.error('Update preferences error:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getUser();
      dispatch({ type: 'UPDATE_USER', payload: response });
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  // Check for existing auth on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await secureStorage.getItemAsync('auth_token');
        const userStr = await secureStorage.getItemAsync('user_data');
        
        if (token && userStr) {
          const user = JSON.parse(userStr);
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
          // Refresh user data from server
          refreshUser();
          return;
        }
        
        // No token or user found
        dispatch({ type: 'AUTH_LOGOUT' });
      } catch (error) {
        console.error('Auth check error:', error);
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updatePreferences,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
