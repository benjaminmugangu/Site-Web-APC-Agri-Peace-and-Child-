import { apiClient } from './api-client';
import { type Article, type ArticleStatus, type PaginatedResult, type ApiResponse } from "@/types";

export type ListArticlesOptions = {
  status?: ArticleStatus | "all";
  category?: string;
  search?: string;
  page?: number;
  perPage?: number;
};

// ── GET /api/v1/news ──
export async function listArticles(options: ListArticlesOptions = {}): Promise<PaginatedResult<Article>> {
  const { perPage, ...rest } = options;
  const params = { ...rest, limit: perPage };
  const response = await apiClient.get<ApiResponse<Article[]>>('/news', params);
  return {
    data: response.data || [],
    meta: response.meta || { total: 0, page: 1, perPage: 10, totalPages: 0 }
  };
}

// ── GET /api/v1/news/:id ──
export async function getArticle(id: string): Promise<Article | null> {
  const response = await apiClient.get<ApiResponse<Article>>(`/news/${id}`);
  return response.data || null;
}

export async function getArticleBySlug(slug: string): Promise<ApiResponse<Article>> {
  return apiClient.get<ApiResponse<Article>>(`/news/slug/${slug}`);
}

// ── POST /api/v1/news ──
export async function createArticle(payload: any): Promise<Article> {
  const response = await apiClient.post<ApiResponse<Article>>('/news', payload);
  if (!response.data) throw new Error('Erreur lors de la création');
  return response.data;
}

// ── PUT /api/v1/news/:id ──
export async function updateArticle(id: string, payload: any): Promise<Article | null> {
  const response = await apiClient.put<ApiResponse<Article>>(`/news/${id}`, payload);
  return response.data || null;
}

// ── DELETE /api/v1/news/:id ──
export async function deleteArticle(id: string): Promise<boolean> {
  const response = await apiClient.delete<ApiResponse<any>>(`/news/${id}`);
  return response.success;
}

// ── PATCH /api/v1/news/:id/publish ──
export async function publishArticle(id: string): Promise<Article | null> {
  const response = await apiClient.patch<ApiResponse<Article>>(`/news/${id}/publish`, {});
  return response.data || null;
}

// ── POST /api/v1/news/:id/duplicate ──
export async function duplicateArticle(id: string): Promise<Article | null> {
  const response = await apiClient.post<ApiResponse<Article>>(`/news/${id}/duplicate`, {});
  return response.data || null;
}

// ── Bulk actions ──
export async function bulkDeleteArticles(ids: string[]): Promise<boolean> {
  const response = await apiClient.delete<ApiResponse<any>>('/news/bulk', { ids });
  return response.success;
}

export async function bulkSetStatusArticles(ids: string[], status: ArticleStatus): Promise<boolean> {
  const response = await apiClient.patch<ApiResponse<any>>('/news/bulk-status', { ids, status });
  return response.success;
}
