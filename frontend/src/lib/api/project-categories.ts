import { apiClient } from './api-client';
import { type ApiResponse } from '@/types';

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateProjectCategoryPayload = {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
};

export type UpdateProjectCategoryPayload = Partial<CreateProjectCategoryPayload>;

// ── GET /api/v1/project-categories ──
export async function listProjectCategories(): Promise<ProjectCategory[]> {
  const response = await apiClient.get<ApiResponse<ProjectCategory[]>>('/project-categories');
  return response.data || [];
}

// ── GET /api/v1/project-categories/:id ──
export async function getProjectCategory(id: string): Promise<ProjectCategory | null> {
  const response = await apiClient.get<ApiResponse<ProjectCategory>>(`/project-categories/${id}`);
  return response.data || null;
}

// ── POST /api/v1/project-categories ──
export async function createProjectCategory(payload: CreateProjectCategoryPayload): Promise<ProjectCategory> {
  const response = await apiClient.post<ApiResponse<ProjectCategory>>('/project-categories', payload);
  if (!response.data) throw new Error('Erreur lors de la création de la catégorie');
  return response.data;
}

// ── PUT /api/v1/project-categories/:id ──
export async function updateProjectCategory(id: string, payload: UpdateProjectCategoryPayload): Promise<ProjectCategory | null> {
  const response = await apiClient.put<ApiResponse<ProjectCategory>>(`/project-categories/${id}`, payload);
  return response.data || null;
}

// ── DELETE /api/v1/project-categories/:id ──
export async function deleteProjectCategory(id: string): Promise<boolean> {
  const response = await apiClient.delete<ApiResponse<any>>(`/project-categories/${id}`);
  return response.success;
}
