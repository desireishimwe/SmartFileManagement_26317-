import axiosInstance from './axiosConfig';
import { File } from '../types/file';
import { PageResponse } from '../types/api';

export const fileApi = {
  getAll: async (params?: { keyword?: string; page?: number; size?: number; sort?: string }): Promise<PageResponse<File>> => {
    const response = await axiosInstance.get<PageResponse<File>>('/files', { params });
    return response.data;
  },

  getById: async (id: number): Promise<File> => {
    const response = await axiosInstance.get<File>(`/files/${id}`);
    return response.data;
  },

  search: async (keyword: string): Promise<File[]> => {
    const response = await axiosInstance.get<File[]>('/files', {
      params: { keyword },
    });
    return response.data;
  },

  searchByName: async (name: string): Promise<File[]> => {
    const response = await axiosInstance.get<File[]>('/files/by-name', {
      params: { name },
    });
    return response.data;
  },

  filter: async (
    minSize?: number,
    page: number = 0,
    size: number = 10,
    sort: string = 'uploadedAt,desc'
  ): Promise<PageResponse<File>> => {
    const response = await axiosInstance.get<PageResponse<File>>('/files/filter', {
      params: { minSize, page, size, sort },
    });
    return response.data;
  },

  update: async (id: number, file: Partial<File>): Promise<File> => {
    const response = await axiosInstance.put<File>(`/files/${id}`, file);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/files/${id}`);
  },



  download: async (id: number): Promise<void> => {
    const response = await axiosInstance.get(`/files/${id}/download`, {
      responseType: 'blob',
    });
    const disposition = response.headers['content-disposition'];
    let filename = `file-${id}`;

    if (disposition) {
      // More robust filename extraction
      // Handles: attachment; filename="foo.jpg", attachment; filename=foo.jpg, filename*=UTF-8''foo%20bar.jpg
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
        // Handle potential filename* encoding
        if (filename.startsWith("UTF-8''")) {
          filename = decodeURIComponent(filename.substring(7));
        }
      }
    }

    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link); // Required for some browsers
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  getDownloadUrl: (id: number): string => {
    const token = localStorage.getItem('token');
    return `${axiosInstance.defaults.baseURL}/files/${id}/download${token ? `?token=${token}` : ''}`;
  },

  getPreviewUrl: (id: number): string => {
    const token = localStorage.getItem('token');
    return `${axiosInstance.defaults.baseURL}/files/${id}/preview${token ? `?token=${token}` : ''}`;
  },

  upload: async (
    file: globalThis.File,
    userId: number,
    folderId: number,
    fileName?: string,
    description?: string
  ): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());

    if (fileName) {
      formData.append('fileName', fileName);
    }

    // folderId is optional in backend, only append if provided and > 0
    if (folderId && folderId > 0) {
      formData.append('folderId', folderId.toString());
    }
    // description is optional in backend
    if (description) {
      formData.append('description', description);
    }
    // Backend endpoint: POST /api/files/upload
    await axiosInstance.post('/files/upload', formData, {
      timeout: 30000,
    });
  },

  getByUser: async (userId: number): Promise<File[]> => {
    const response = await axiosInstance.get<File[]>(`/files/user/${userId}`);
    return response.data;
  },

  getByFolder: async (folderId: number): Promise<File[]> => {
    const response = await axiosInstance.get<File[]>(`/files/folder/${folderId}`);
    return response.data;
  },
};

