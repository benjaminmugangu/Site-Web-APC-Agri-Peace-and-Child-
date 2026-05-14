import api from "./api-client";
import { type TeamMember, type ApiResponse } from "@/types";

export const listTeam = async (options?: any): Promise<TeamMember[]> => {
  const response = await api.get<ApiResponse<TeamMember[]>>("/team", { params: options });
  return response.data.data || [];
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
