import api from "./api-client";
import { type Partner, type ApiResponse } from "@/types";

export const listPartners = async (options?: any): Promise<Partner[]> => {
  const response = await api.get<ApiResponse<Partner[]>>("/partners", { params: options });
  return response.data.data || [];
};

export const getPartner = async (id: string) => {
  const response = await api.get(`/partners/${id}`);
  return response.data;
};

export const createPartner = async (data: any) => {
  const response = await api.post("/partners", data);
  return response.data;
};

export const updatePartner = async (id: string, data: any) => {
  const response = await api.put(`/partners/${id}`, data);
  return response.data;
};

export const deletePartner = async (id: string) => {
  const response = await api.delete(`/partners/${id}`);
  return response.data;
};
