import axiosInstance from './axiosConfig';
import { User } from '../types/user';
import { PageResponse } from '../types/api';

export const userApi = {
  getAll: async (params?: { page?: number; size?: number; sort?: string; keyword?: string; locationId?: number }): Promise<PageResponse<User>> => {
    const response = await axiosInstance.get<PageResponse<User>>('/users', { params });
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  },

  create: async (user: Partial<User>): Promise<User> => {
    const response = await axiosInstance.post<User>('/users', user);
    return response.data;
  },

  update: async (id: number, user: Partial<User>): Promise<User> => {
    const response = await axiosInstance.put<User>(`/users/${id}`, user);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },

  searchByFirstName: async (firstName: string, sort?: string): Promise<User[]> => {
    const response = await axiosInstance.get<User[]>('/users/search', {
      params: { firstName, sort },
    });
    return response.data;
  },

  searchByLastName: async (
    lastName: string,
    page: number = 0,
    size: number = 10,
    sort: string = 'lastName,asc'
  ): Promise<PageResponse<User>> => {
    const response = await axiosInstance.get<PageResponse<User>>('/users/search-by-lastname', {
      params: { lastName, page, size, sort },
    });
    return response.data;
  },

  getByProvince: async (name?: string, code?: string): Promise<User[]> => {
    const response = await axiosInstance.get<User[]>('/users/by-province', {
      params: { name, code },
    });
    return response.data;
  },

  getProvinceForUser: async (id: number): Promise<any> => {
    const response = await axiosInstance.get(`/users/${id}/province`);
    return response.data;
  },

  getUserProfile: async (userId: number): Promise<any> => {
    const response = await axiosInstance.get(`/users/profile/${userId}`);
    return response.data;
  },

  changePassword: async (data: any): Promise<void> => {
    await axiosInstance.post('/users/change-password', data);
  },
};

