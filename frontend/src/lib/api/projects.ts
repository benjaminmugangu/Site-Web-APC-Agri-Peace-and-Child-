import { apiClient } from './api-client';
import { type Project, type ProjectStatus, type PaginatedResult, type ApiResponse } from "@/types";

export type ListProjectsOptions = {
  status?: ProjectStatus | "all";
  category?: string;
  search?: string;
  page?: number;
  limit?: number; // Renommé perPage -> limit pour correspondre au backend
};

// ── GET /api/v1/projects ──
export async function listProjects(options: ListProjectsOptions = {}): Promise<PaginatedResult<Project>> {
  const response = await apiClient.get<ApiResponse<Project[]>>('/projects', options);
  return {
    data: response.data || [],
    meta: response.meta || { total: 0, page: 1, perPage: 10, totalPages: 0 }
  };
}

// ── GET /api/v1/projects/:id ──
export async function getProject(id: string): Promise<Project | null> {
  const response = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
  return response.data || null;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const response = await apiClient.get<ApiResponse<Project>>(`/projects/slug/${slug}`);
  return response.data || null;
}

// ── POST /api/v1/projects ──
export async function createProject(payload: Partial<Project>): Promise<Project> {
  const response = await apiClient.post<ApiResponse<Project>>('/projects', payload);
  if (!response.data) throw new Error('Erreur lors de la création');
  return response.data;
}

// ── PUT /api/v1/projects/:id ──
export async function updateProject(id: string, payload: Partial<Project>): Promise<Project | null> {
  const response = await apiClient.put<ApiResponse<Project>>(`/projects/${id}`, payload);
  return response.data || null;
}

// ── DELETE /api/v1/projects/:id ──
export async function deleteProject(id: string): Promise<boolean> {
  const response = await apiClient.delete<ApiResponse<any>>(`/projects/${id}`);
  return response.success;
}

// ── PATCH /api/v1/projects/:id/publish ──
export async function publishProject(id: string): Promise<Project | null> {
  const response = await apiClient.patch<ApiResponse<Project>>(`/projects/${id}/publish`, {});
  return response.data || null;
}

// ── PATCH /api/v1/projects/:id/unpublish ──
export async function unpublishProject(id: string): Promise<Project | null> {
  const response = await apiClient.patch<ApiResponse<Project>>(`/projects/${id}/unpublish`, {});
  return response.data || null;
}

// ── PATCH /api/v1/projects/:id/archive ──
export async function archiveProject(id: string): Promise<Project | null> {
  const response = await apiClient.patch<ApiResponse<Project>>(`/projects/${id}/archive`, {});
  return response.data || null;
}

// ── POST /api/v1/projects/:id/duplicate ──
export async function duplicateProject(id: string): Promise<Project | null> {
  const response = await apiClient.post<ApiResponse<Project>>(`/projects/${id}/duplicate`, {});
  return response.data || null;
}

// ── Bulk actions ──
export async function bulkDeleteProjects(ids: string[]): Promise<boolean> {
  const response = await apiClient.delete<ApiResponse<any>>('/projects/bulk', { ids });
  return response.success;
}

export async function bulkSetStatusProjects(ids: string[], status: ProjectStatus): Promise<boolean> {
  const response = await apiClient.patch<ApiResponse<any>>('/projects/bulk-status', { ids, status });
  return response.success;
}
