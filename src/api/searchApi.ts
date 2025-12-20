import axiosInstance from './axiosConfig';
// import { SearchResult } from '../types/api';

export const searchApi = {
  search: async (
    query: string,
    category: 'all' | 'files' | 'folders' | 'people' | 'locations' = 'all',
    page: number = 0,
    size: number = 10
  ): Promise<any> => {
    const response = await axiosInstance.get('/search', {
      params: { q: query, category, page, size },
    });
    return response.data;
  },
};

