import { apiClient, type ApiResponse } from './api-client';

export type UserRole = 'ADMIN' | 'EDITOR' | 'USER';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
};

export const userService = {
  async list(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>('/users');
    return response.data || [];
  },

  async get(id: string): Promise<User | null> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data || null;
  },

  async create(payload: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password?: string }): Promise<User | null> {
    const response = await apiClient.post<ApiResponse<User>>('/users', payload);
    return response.data || null;
  },

  async update(id: string, payload: Partial<User>): Promise<User | null> {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, payload);
    return response.data || null;
  },

  async delete(id: string): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<any>>(`/users/${id}`);
    return response.success;
  }
};
