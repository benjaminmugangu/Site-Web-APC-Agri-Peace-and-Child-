import api from "./api-client";
import { type BeneficiaryTestimonial, type ApiResponse } from "@/types";

export const listTestimonials = async (options?: any): Promise<BeneficiaryTestimonial[]> => {
  const response = await api.get<ApiResponse<BeneficiaryTestimonial[]>>("/testimonials", options);
  return response.data || [];
};

export const listAllTestimonials = async (options?: any): Promise<BeneficiaryTestimonial[]> => {
  const response = await api.get<ApiResponse<BeneficiaryTestimonial[]>>("/testimonials/admin/all", options);
  return response.data || [];
};

export const getTestimonial = async (id: string) => {
  const response = await api.get<ApiResponse<BeneficiaryTestimonial>>(`/testimonials/${id}`);
  return response.data;
};

export const createTestimonial = async (data: any) => {
  const response = await api.post<ApiResponse<BeneficiaryTestimonial>>("/testimonials", data);
  return response.data;
};

export const updateTestimonial = async (id: string, data: any) => {
  const response = await api.put<ApiResponse<BeneficiaryTestimonial>>(`/testimonials/${id}`, data);
  return response.data;
};

export const deleteTestimonial = async (id: string) => {
  const response = await api.delete<ApiResponse<any>>(`/testimonials/${id}`);
  return response.data;
};

export const bulkDeleteTestimonials = async (ids: string[]) => {
  const response = await api.delete<ApiResponse<any>>("/testimonials/bulk", { data: { ids } });
  return response.data;
};
