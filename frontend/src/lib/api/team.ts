import { apiClient, type ApiResponse } from './api-client';

export type MemberStatus = 'active' | 'suspended' | 'pending';
export type MemberAccess = 'super_admin' | 'admin' | 'editor' | 'viewer';

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  email?: string;
  phone?: string;
  access: MemberAccess;
  status: MemberStatus;
  joinDate?: string;
  bio?: string;
  photoUrl?: string;
  linkedinUrl?: string;
  order: number;
  isActive: boolean;
};

// ── CRUD Team ──
export const teamService = {
  async list(params?: any): Promise<TeamMember[]> {
    const response = await apiClient.get<ApiResponse<TeamMember[]>>('/team', params);
    return response.data || [];
  },

  async get(id: string): Promise<TeamMember | null> {
    const response = await apiClient.get<ApiResponse<TeamMember>>(`/team/${id}`);
    return response.data || null;
  },

  async create(payload: any): Promise<TeamMember> {
    const response = await apiClient.post<ApiResponse<TeamMember>>('/team', payload);
    if (!response.data) throw new Error('Erreur de création');
    return response.data;
  },

  async update(id: string, payload: any): Promise<TeamMember | null> {
    const response = await apiClient.put<ApiResponse<TeamMember>>(`/team/${id}`, payload);
    return response.data || null;
  },

  async delete(id: string): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<any>>(`/team/${id}`);
    return response.success;
  },

  async setStatus(id: string, status: MemberStatus): Promise<boolean> {
    const response = await apiClient.patch<ApiResponse<any>>(`/team/${id}/status`, { status });
    return response.success;
  },

  async bulkDelete(ids: string[]): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<any>>('/team/bulk', { ids });
    return response.success;
  },

  async bulkSetStatus(ids: string[], status: MemberStatus): Promise<boolean> {
    const response = await apiClient.patch<ApiResponse<any>>('/team/bulk-status', { ids, status });
    return response.success;
  }
};
