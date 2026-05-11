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
    const response = await apiClient.get<ApiResponse<any[]>>('/services', params);
    return (response.data || []).map(s => ({
      ...s,
      title: s.name, // Mapping backend name to frontend title
      icon: s.iconName, // Mapping backend iconName to frontend icon
      style: s.style || { color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-100' }
    }));
  },

  async get(id: string): Promise<Service | null> {
    const response = await apiClient.get<ApiResponse<any>>(`/services/${id}`);
    if (!response.data) return null;
    const s = response.data;
    return {
      ...s,
      title: s.name,
      icon: s.iconName,
      style: s.style || { color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-100' }
    };
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
