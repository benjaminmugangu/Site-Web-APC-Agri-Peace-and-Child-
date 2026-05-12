import api from "./api-client";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  email?: string;
  phone?: string;
  socialLinks?: any;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const listTeam = async (options?: any) => {
  const response = await api.get("/team", { params: options });
  return response.data;
};

export const getTeamMember = async (id: string) => {
  const response = await api.get(`/team/${id}`);
  return response.data;
};

export const createTeamMember = async (data: any) => {
  const response = await api.post("/team", data);
  return response.data;
};

export const updateTeamMember = async (id: string, data: any) => {
  const response = await api.put(`/team/${id}`, data);
  return response.data;
};

export const deleteTeamMember = async (id: string) => {
  const response = await api.delete(`/team/${id}`);
  return response.data;
};
