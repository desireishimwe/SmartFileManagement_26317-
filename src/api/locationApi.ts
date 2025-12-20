import axiosInstance from './axiosConfig';
import { Location, LocationType } from '../types/location';
import { PageResponse } from '../types/api';

export const locationApi = {
  getAll: async (page: number = 0, size: number = 10, sort: string[] = ['id,asc'], keyword?: string): Promise<PageResponse<Location>> => {
    const params: any = { page, size, sort };
    if (keyword) {
      params.keyword = keyword;
    }
    const response = await axiosInstance.get<PageResponse<Location>>('/locations', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Location> => {
    const response = await axiosInstance.get<Location>(`/locations/${id}`);
    return response.data;
  },

  create: async (location: Partial<Location>): Promise<Location> => {
    const response = await axiosInstance.post<Location>('/locations', location);
    return response.data;
  },

  update: async (id: number, location: Partial<Location>): Promise<Location> => {
    const response = await axiosInstance.put<Location>(`/locations/${id}`, location);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/locations/${id}`);
  },

  getByType: async (
    type: LocationType,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['name,asc']
  ): Promise<PageResponse<Location>> => {
    const response = await axiosInstance.get<PageResponse<Location>>('/locations/by-type', {
      params: { type, page, size, sort },
    });
    return response.data;
  },

  getChildren: async (
    id: number,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['name,asc']
  ): Promise<PageResponse<Location>> => {
    const response = await axiosInstance.get<PageResponse<Location>>(`/locations/${id}/children`, {
      params: { page, size, sort },
    });
    return response.data;
  },

  getUsersByProvinceName: async (provinceName: string): Promise<any[]> => {
    const response = await axiosInstance.get(`/locations/users/${provinceName}`);
    return response.data;
  },

  getProvinces: async (): Promise<Location[]> => {
    const response = await axiosInstance.get<Location[]>('/locations/provinces');
    return response.data;
  },

  getChildrenAll: async (parentId: number): Promise<Location[]> => {
    const response = await axiosInstance.get<Location[]>(`/locations/${parentId}/children/all`);
    return response.data;
  },
};

