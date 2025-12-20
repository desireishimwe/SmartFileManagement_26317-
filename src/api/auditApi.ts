import axiosInstance from './axiosConfig';
import { AuditLog } from '../types/api';

export const auditApi = {
  recent: async (limit = 20): Promise<AuditLog[]> => {
    const response = await axiosInstance.get<AuditLog[]>('/audit/recent', { params: { limit } });
    return response.data;
  },
};

