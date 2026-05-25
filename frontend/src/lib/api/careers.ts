import api from "./api-client";
import { type Career, type ApiResponse } from "@/types";

export const listCareers = async (options?: any): Promise<Career[]> => {
  const response = await api.get<ApiResponse<Career[]>>("/careers", options);
  return response.data || [];
};

export const listAdminCareers = async (options?: any): Promise<Career[]> => {
  const response = await api.get<ApiResponse<Career[]>>("/careers/admin/all", options);
  return response.data || [];
};

export const getCareer = async (id: string) => {
  const response = await api.get<ApiResponse<Career>>(`/careers/${id}`);
  return response.data;
};

export const createCareer = async (data: any) => {
  const response = await api.post<ApiResponse<Career>>("/careers", data);
  return response.data;
};

export const updateCareer = async (id: string, data: any) => {
  const response = await api.put<ApiResponse<Career>>(`/careers/${id}`, data);
  return response.data;
};

export const deleteCareer = async (id: string) => {
  const response = await api.delete<ApiResponse<any>>(`/careers/${id}`);
  return response.data;
};

export const bulkDeleteCareers = async (ids: string[]) => {
  const response = await api.delete<ApiResponse<any>>("/careers/bulk", { ids });
  return response.data;
};

export const bulkSetStatusCareers = async (ids: string[], status: string) => {
  const response = await api.patch<ApiResponse<any>>("/careers/bulk-status", { ids, status });
  return response.data;
};
