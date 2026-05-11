import { apiClient, type ApiResponse } from './api-client';

export type Career = {
  id: string;
  title: string;
  location: string;
  type: string; // CDD, CDI, Internship
  department: string;
  description: string;
  requirements: string[];
  deadline: string;
  isOpen: boolean;
  createdAt: string;
};

export const careerService = {
  async list(params?: any): Promise<Career[]> {
    const response = await apiClient.get<ApiResponse<Career[]>>('/careers', params);
    return response.data || [];
  },

  async create(payload: any): Promise<Career> {
    const response = await apiClient.post<ApiResponse<Career>>('/careers', payload);
    return response.data!;
  },

  async update(id: string, payload: any): Promise<Career | null> {
    const response = await apiClient.put<ApiResponse<Career>>(`/careers/${id}`, payload);
    return response.data || null;
  },

  async delete(id: string): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<any>>(`/careers/${id}`);
    return response.success;
  },

  async bulkDelete(ids: string[]): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<any>>('/careers/bulk', { ids });
    return response.success;
  },

  async bulkSetStatus(ids: string[], isOpen: boolean): Promise<boolean> {
    const response = await apiClient.patch<ApiResponse<any>>('/careers/bulk-status', { ids, isOpen });
    return response.success;
  }
};
