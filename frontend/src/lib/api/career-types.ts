import api from "./api-client";
import { type CareerType, type ApiResponse } from "@/types";

export const listCareerTypes = async (): Promise<CareerType[]> => {
  const response = await api.get<ApiResponse<CareerType[]>>("/career-types");
  return response.data || [];
};

export const listAllCareerTypes = async (): Promise<CareerType[]> => {
  const response = await api.get<ApiResponse<CareerType[]>>("/career-types/admin/all");
  return response.data || [];
};

export const getCareerType = async (id: string): Promise<CareerType | null> => {
  const response = await api.get<ApiResponse<CareerType>>(`/career-types/${id}`);
  return response.data || null;
};

export const createCareerType = async (data: Partial<CareerType>): Promise<CareerType> => {
  const response = await api.post<ApiResponse<CareerType>>("/career-types", data);
  return response.data as CareerType;
};

export const updateCareerType = async (id: string, data: Partial<CareerType>): Promise<CareerType> => {
  const response = await api.put<ApiResponse<CareerType>>(`/career-types/${id}`, data);
  return response.data as CareerType;
};

export const toggleCareerType = async (id: string): Promise<CareerType> => {
  const response = await api.patch<ApiResponse<CareerType>>(`/career-types/${id}/toggle`, {});
  return response.data as CareerType;
};

export const deleteCareerType = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<any>>(`/career-types/${id}`);
};
