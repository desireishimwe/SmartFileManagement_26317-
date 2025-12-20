import axiosInstance from './axiosConfig';
import { DashboardStats } from '../types/api';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  getRecentFiles: async (): Promise<any[]> => {
    const response = await axiosInstance.get('/dashboard/recent-files');
    return response.data;
  },

  getRecentUsers: async (): Promise<any[]> => {
    const response = await axiosInstance.get('/dashboard/recent-users');
    return response.data;
  },
};

