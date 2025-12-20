import axiosInstance from './axiosConfig';
import { LoginRequest, LoginResponse, SignupRequest, ForgotPasswordRequest, ResetPasswordRequest, User } from '../types/user';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<any> => {
    const response = await axiosInstance.post('/auth/signup', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/auth/me');
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await axiosInstance.post('/auth/forgot-password', data);
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await axiosInstance.post('/auth/reset-password', data);
  },

  verify2FA: async (email: string, code: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/verify-2fa', { email, code });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  enable2FA: async (email: string, method: 'email' | 'google' = 'email'): Promise<{ message: string; secret?: string; qrCode?: string }> => {
    const response = await axiosInstance.post('/auth/enable-2fa', { email, method });
    return response.data;
  },
};

