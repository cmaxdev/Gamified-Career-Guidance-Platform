import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { getStoredAuth, setStoredAuth, clearStoredAuth } from '../utils/auth';
import { authAPI } from '../utils/api';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'LOGIN'; payload: { token: string; user: User } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean };

const authReducer = (state: AuthState & { loading: boolean }, action: AuthAction) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        loading: false,
      };
    case 'LOGOUT':
      return {
        isAuthenticated: false,
        token: null,
        user: null,
        loading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

const initialState: AuthState & { loading: boolean } = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      const stored = getStoredAuth();
      
      if (stored.token && stored.user) {
        try {
          // Verify token is still valid
          const response = await authAPI.verifyToken();
          if (response.data.valid) {
            dispatch({
              type: 'LOGIN',
              payload: { token: stored.token, user: response.data.user }
            });
          } else {
            clearStoredAuth();
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          clearStoredAuth();
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = (token: string, user: User) => {
    setStoredAuth(token, user);
    dispatch({ type: 'LOGIN', payload: { token, user } });
  };

  const logout = () => {
    clearStoredAuth();
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user: User) => {
    const stored = getStoredAuth();
    if (stored.token) {
      setStoredAuth(stored.token, user);
    }
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
