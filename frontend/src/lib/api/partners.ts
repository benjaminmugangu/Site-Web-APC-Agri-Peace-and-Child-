import { apiClient, type ApiResponse } from './api-client';
import { type Partner } from '@/types';

export type ListPartnersOptions = {
  type?: 'DONOR' | 'TECHNICAL' | 'LOCAL' | 'STRATEGIC';
  search?: string;
};

// ── GET /api/v1/partners ──
export async function listPartners(options: ListPartnersOptions = {}): Promise<Partner[]> {
  const response = await apiClient.get<ApiResponse<Partner[]>>('/partners', options);
  return response.data || [];
}

// ── GET /api/v1/partners/:id ──
export async function getPartner(id: string): Promise<Partner | null> {
  const response = await apiClient.get<ApiResponse<Partner>>(`/partners/${id}`);
  return response.data || null;
}

// ── POST /api/v1/partners ──
export async function createPartner(payload: any): Promise<Partner> {
  const response = await apiClient.post<ApiResponse<Partner>>('/partners', payload);
  if (!response.data) throw new Error('Erreur lors de la création du partenaire');
  return response.data;
}

// ── PUT /api/v1/partners/:id ──
export async function updatePartner(id: string, payload: any): Promise<Partner | null> {
  const response = await apiClient.put<ApiResponse<Partner>>(`/partners/${id}`, payload);
  return response.data || null;
}

// ── DELETE /api/v1/partners/:id ──
export async function deletePartner(id: string): Promise<boolean> {
  const response = await apiClient.delete<ApiResponse<any>>(`/partners/${id}`);
  return response.success;
}

// ── DELETE /api/v1/partners/bulk ──
export async function bulkDeletePartners(ids: string[]): Promise<boolean> {
  const response = await apiClient.delete<ApiResponse<any>>('/partners/bulk', { ids });
  return response.success;
}
