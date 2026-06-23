import { apiClient } from './api-client';
import { type PartnerCategory, type ApiResponse } from '@/types';

// ── GET /api/v1/partner-categories ──
export const partnerCategoriesApi = {
  getAll: async (): Promise<PartnerCategory[]> => {
    const response = await apiClient.get<ApiResponse<PartnerCategory[]>>('/partner-categories');
    return response.data || [];
  },

  getById: async (id: string): Promise<PartnerCategory | null> => {
    const response = await apiClient.get<ApiResponse<PartnerCategory>>(`/partner-categories/${id}`);
    return response.data || null;
  },

  create: async (data: Partial<PartnerCategory>): Promise<PartnerCategory> => {
    const response = await apiClient.post<ApiResponse<PartnerCategory>>('/partner-categories', data);
    if (!response.data) throw new Error('Erreur lors de la création de la catégorie');
    return response.data;
  },

  update: async (id: string, data: Partial<PartnerCategory>): Promise<PartnerCategory | null> => {
    const response = await apiClient.put<ApiResponse<PartnerCategory>>(`/partner-categories/${id}`, data);
    return response.data || null;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<ApiResponse<any>>(`/partner-categories/${id}`);
    return response.success;
  }
};
