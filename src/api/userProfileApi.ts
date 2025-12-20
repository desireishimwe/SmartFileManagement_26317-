import axiosInstance from './axiosConfig';
import { UserProfile } from '../types/userProfile';

export const userProfileApi = {
  getAll: async (): Promise<UserProfile[]> => {
    const response = await axiosInstance.get<UserProfile[]>('/user-profiles');
    return response.data;
  },

  getById: async (id: number): Promise<UserProfile> => {
    const response = await axiosInstance.get<UserProfile>(`/user-profiles/${id}`);
    return response.data;
  },

  getByUserId: async (userId: number): Promise<UserProfile> => {
    const response = await axiosInstance.get<UserProfile>(`/user-profiles/by-user/${userId}`);
    return response.data;
  },

  create: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await axiosInstance.post<UserProfile>('/user-profiles', profile);
    return response.data;
  },

  update: async (id: number, profile: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await axiosInstance.put<UserProfile>(`/user-profiles/${id}`, profile);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/user-profiles/${id}`);
  },
};

