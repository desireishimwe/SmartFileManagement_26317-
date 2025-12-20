import axiosInstance from './axiosConfig';
import { Folder, FolderCreateRequest } from '../types/folder';
import { File } from '../types/file';
import { PageResponse } from '../types/api';


export const folderApi = {
  getAll: async (params?: { page?: number; size?: number; sort?: string; keyword?: string }): Promise<PageResponse<Folder>> => {
    const response = await axiosInstance.get<PageResponse<Folder>>('/folders', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Folder> => {
    const response = await axiosInstance.get<Folder>(`/folders/${id}`);
    return response.data;
  },

  create: async (folder: FolderCreateRequest): Promise<Folder> => {
    // Prepare request body - convert undefined to null for parentFolderId if needed
    const requestBody: any = {
      folderName: folder.folderName,
    };

    if (folder.description) {
      requestBody.description = folder.description;
    }

    // Include parentFolderId only if it's provided (not undefined)
    // Backend may expect null for root folders or a number for child folders
    if (folder.parentFolderId !== undefined) {
      requestBody.parentFolderId = folder.parentFolderId;
    }

    const response = await axiosInstance.post<Folder>('/folders', requestBody);
    return response.data;
  },

  update: async (id: number, folder: Partial<Folder>): Promise<Folder> => {
    const response = await axiosInstance.put<Folder>(`/folders/${id}`, folder);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/folders/${id}`);
  },

  search: async (name: string): Promise<Folder[]> => {
    const response = await axiosInstance.get<Folder[]>('/folders/search', {
      params: { name },
    });
    return response.data;
  },

  getFilesByFolder: async (folderId: number): Promise<File[]> => {
    const response = await axiosInstance.get<File[]>(`/folders/folder/${folderId}`);
    return response.data;
  },

  getRootFolders: async (): Promise<Folder[]> => {
    try {
      const response = await axiosInstance.get<Folder[]>('/folders/root');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching root folders:', error);
      return [];
    }
  },

  getSubFolders: async (parentId: number): Promise<Folder[]> => {
    try {
      const response = await axiosInstance.get<Folder[]>(`/folders/${parentId}/subfolders`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching subfolders:', error);
      return [];
    }
  },
};

