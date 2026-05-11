import { apiClient, type ApiResponse } from './api-client';

export type PartnerType = 'institutionnel' | 'technique' | 'financier' | 'local';

export type Partner = {
  id: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  type: PartnerType;
  description?: string;
  order: number;
  isActive: boolean;
};

export const partnerService = {
  async list(params?: any): Promise<Partner[]> {
    const response = await apiClient.get<ApiResponse<Partner[]>>('/partners', params);
    return response.data || [];
  },

  async create(payload: any): Promise<Partner> {
    const response = await apiClient.post<ApiResponse<Partner>>('/partners', payload);
    if (!response.data) throw new Error('Erreur de création');
    return response.data;
  },

  async update(id: string, payload: any): Promise<Partner | null> {
    const response = await apiClient.put<ApiResponse<Partner>>(`/partners/${id}`, payload);
    return response.data || null;
  },

  async delete(id: string): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<any>>(`/partners/${id}`);
    return response.success;
  },

  async bulkDelete(ids: string[]): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<any>>('/partners/bulk', { ids });
    return response.success;
  }
};
