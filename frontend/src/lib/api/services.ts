import { apiClient, type ApiResponse } from './api-client';

export type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon?: string;
  mainImage?: string;
  actions?: string[];
  stats?: { label: string; value: string }[];
  style?: {
    color: string;
    bgColor: string;
    borderColor: string;
  };
  order: number;
  isActive: boolean;
};

export const domainService = {
  async list(params?: any): Promise<Service[]> {
    const response = await apiClient.get<ApiResponse<Service[]>>('/services', params);
    return response.data || [];
  },

  async get(id: string): Promise<Service | null> {
    const response = await apiClient.get<ApiResponse<Service>>(`/services/${id}`);
    return response.data || null;
  },

  async create(payload: any): Promise<Service> {
    const response = await apiClient.post<ApiResponse<Service>>('/services', payload);
    if (!response.data) throw new Error('Erreur de création');
    return response.data;
  },

  async update(id: string, payload: any): Promise<Service | null> {
    const response = await apiClient.put<ApiResponse<Service>>(`/services/${id}`, payload);
    return response.data || null;
  },

  async delete(id: string): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<any>>(`/services/${id}`);
    return response.success;
  },

  async bulkDelete(ids: string[]): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<any>>('/services/bulk', { ids });
    return response.success;
  }
};
