import { apiClient } from './api-client';
import { type Supplier, type ApiResponse } from "@/types";

export const supplierService = {
  async list(params?: any): Promise<Supplier[]> {
    const response = await apiClient.get<ApiResponse<Supplier[]>>('/suppliers', params);
    return response.data || [];
  },

  async get(id: string): Promise<Supplier | null> {
    const response = await apiClient.get<ApiResponse<Supplier>>(`/suppliers/${id}`);
    return response.data || null;
  },

  async create(payload: any): Promise<Supplier> {
    const response = await apiClient.post<ApiResponse<Supplier>>('/suppliers', payload);
    if (!response.data) throw new Error('Erreur de création');
    return response.data;
  },

  async update(id: string, payload: any): Promise<Supplier | null> {
    const response = await apiClient.put<ApiResponse<Supplier>>(`/suppliers/${id}`, payload);
    return response.data || null;
  },

  async delete(id: string): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<any>>(`/suppliers/${id}`);
    return response.success;
  },

  async export(params?: any): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suppliers/export?${new URLSearchParams(params)}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) throw new Error('Erreur export');
    return await response.blob();
  },

  async importFromSubmission(submissionId: string): Promise<Supplier> {
    const response = await apiClient.post<ApiResponse<Supplier>>('/suppliers/import-from-submission', { submissionId });
    if (!response.data) throw new Error('Erreur import');
    return response.data;
  }
};

export const listSuppliers = supplierService.list;
export const getSupplier = supplierService.get;
export const createSupplier = supplierService.create;
export const updateSupplier = supplierService.update;
export const deleteSupplier = supplierService.delete;
export const exportSuppliers = supplierService.export;
export const importSupplierFromSubmission = supplierService.importFromSubmission;
