import { apiClient } from './api-client';
import { type NewsCategory, type ApiResponse } from '@/types';

// ── GET /api/v1/news-categories ──
export const newsCategoriesApi = {
  getAll: async (): Promise<NewsCategory[]> => {
    const response = await apiClient.get<ApiResponse<NewsCategory[]>>('/news-categories');
    return response.data || [];
  },

  getById: async (id: string): Promise<NewsCategory | null> => {
    const response = await apiClient.get<ApiResponse<NewsCategory>>(`/news-categories/${id}`);
    return response.data || null;
  },

  create: async (data: Partial<NewsCategory>): Promise<NewsCategory> => {
    const response = await apiClient.post<ApiResponse<NewsCategory>>('/news-categories', data);
    if (!response.data) throw new Error('Erreur lors de la création de la catégorie');
    return response.data;
  },

  update: async (id: string, data: Partial<NewsCategory>): Promise<NewsCategory | null> => {
    const response = await apiClient.put<ApiResponse<NewsCategory>>(`/news-categories/${id}`, data);
    return response.data || null;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<ApiResponse<any>>(`/news-categories/${id}`);
    return response.success;
  }
};
