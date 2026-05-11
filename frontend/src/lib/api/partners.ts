import api from "./api-client";

export interface Partner {
  id: string;
  name: string;
  logo: string;
  websiteUrl?: string;
  type: "TECHNICAL" | "FINANCIAL" | "STRATEGIC" | "GOVERNMENTAL";
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const listPartners = async (options?: any) => {
  const response = await api.get("/partners", { params: options });
  return response.data;
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
  const response = await api.patch(`/partners/${id}`, data);
  return response.data;
};

export const deletePartner = async (id: string) => {
  const response = await api.delete(`/partners/${id}`);
  return response.data;
};
