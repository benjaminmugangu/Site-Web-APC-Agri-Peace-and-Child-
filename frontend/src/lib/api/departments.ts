import api from "./api-client";
import { type ApiResponse } from "@/types";

export interface Department {
  id: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const listDepartments = async (): Promise<Department[]> => {
  const response = await api.get<ApiResponse<Department[]>>("/departments");
  return response.data || [];
};

export const listAllDepartments = async (): Promise<Department[]> => {
  const response = await api.get<ApiResponse<Department[]>>("/departments/admin/all");
  return response.data || [];
};

export const getDepartment = async (id: string): Promise<Department | null> => {
  const response = await api.get<ApiResponse<Department>>(`/departments/${id}`);
  return response.data || null;
};

export const createDepartment = async (data: Partial<Department>): Promise<Department> => {
  const response = await api.post<ApiResponse<Department>>("/departments", data);
  return response.data as Department;
};

export const updateDepartment = async (id: string, data: Partial<Department>): Promise<Department> => {
  const response = await api.put<ApiResponse<Department>>(`/departments/${id}`, data);
  return response.data as Department;
};

export const toggleDepartment = async (id: string): Promise<Department> => {
  const response = await api.patch<ApiResponse<Department>>(`/departments/${id}/toggle`, {});
  return response.data as Department;
};

export const deleteDepartment = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<any>>(`/departments/${id}`);
};
