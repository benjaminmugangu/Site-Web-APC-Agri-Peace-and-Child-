import { apiClient, type ApiResponse } from './api-client';

export type TenderStatus = 'open' | 'closed' | 'awarded' | 'cancelled';

export type Tender = {
  id: string;
  reference: string;
  title: string;
  description: string;
  category: string;
  status: TenderStatus;
  publishDate: string;
  deadline: string;
  documents?: string[];
  location: string;
  organization: string;
};

export const tenderService = {
  async list(params?: any): Promise<Tender[]> {
    const response = await apiClient.get<ApiResponse<Tender[]>>('/tenders', params);
    return response.data || [];
  },

  async get(id: string): Promise<Tender | null> {
    const response = await apiClient.get<ApiResponse<Tender>>(`/tenders/${id}`);
    return response.data || null;
  },

  async create(payload: any): Promise<Tender> {
    const response = await apiClient.post<ApiResponse<Tender>>('/tenders', payload);
    if (!response.data) throw new Error('Erreur de création');
    return response.data;
  },

  async update(id: string, payload: any): Promise<Tender | null> {
    const response = await apiClient.put<ApiResponse<Tender>>(`/tenders/${id}`, payload);
    return response.data || null;
  },

  async delete(id: string): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<any>>(`/tenders/${id}`);
    return response.success;
  },

  async bulkDelete(ids: string[]): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<any>>('/tenders/bulk', { ids });
    return response.success;
  },

  async bulkSetStatus(ids: string[], status: TenderStatus): Promise<boolean> {
    const response = await apiClient.patch<ApiResponse<any>>('/tenders/bulk-status', { ids, status });
    return response.success;
  }
};
