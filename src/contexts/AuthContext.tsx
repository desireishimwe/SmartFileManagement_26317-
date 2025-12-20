import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, SignupRequest } from '../types/user';
import { authApi } from '../api/authApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<any>;
  signup: (data: SignupRequest) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  verify2FA: (email: string, code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    const bootstrap = async () => {
      if (token) {
        try {
          const me = await authApi.getCurrentUser();
          setUser(me);
          localStorage.setItem('user', JSON.stringify(me));
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    bootstrap();
  }, []);


  const login = async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    if (!response.requires2FA) {
      setUser(response.user);
    }
    return response;
  };

  const signup = async (data: SignupRequest) => {
    const response = await authApi.signup(data);
    if (response.user && !response.requires2FA) {
      setUser(response.user);
    }
    return response;
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const refresh = async () => {
    const me = await authApi.getCurrentUser();
    setUser(me);
    localStorage.setItem('user', JSON.stringify(me));
  };

  const verify2FA = async (email: string, code: string) => {
    const response = await authApi.verify2FA(email, code);
    setUser(response.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        refresh,
        verify2FA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

