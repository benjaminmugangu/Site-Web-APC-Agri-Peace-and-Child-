import api from "./api-client";
import { type Career, type ApiResponse } from "@/types";

export const listCareers = async (options?: any): Promise<Career[]> => {
  const response = await api.get<ApiResponse<Career[]>>("/careers", { params: options });
  return response.data.data || [];
};

export const getCareer = async (id: string) => {
  const response = await api.get(`/careers/${id}`);
  return response.data;
};

export const createCareer = async (data: any) => {
  const response = await api.post("/careers", data);
  return response.data;
};

export const updateCareer = async (id: string, data: any) => {
  const response = await api.put(`/careers/${id}`, data);
  return response.data;
};

export const deleteCareer = async (id: string) => {
  const response = await api.delete(`/careers/${id}`);
  return response.data;
};

export const bulkDeleteCareers = async (ids: string[]) => {
  const response = await api.delete("/careers/bulk", { data: { ids } });
  return response.data;
};

export const bulkSetStatusCareers = async (ids: string[], status: string) => {
  const response = await api.patch("/careers/bulk-status", { ids, status });
  return response.data;
};
