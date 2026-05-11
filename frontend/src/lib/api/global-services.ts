import { apiClient, type ApiResponse } from './api-client';

// ── SERVICES ──
export async function listServices() {
  const response = await apiClient.get<ApiResponse<any[]>>('/services');
  return response.data || [];
}

// ── PARTNERS ──
export async function listPartners() {
  const response = await apiClient.get<ApiResponse<any[]>>('/partners');
  return response.data || [];
}

// ── TEAM ──
export async function listTeam() {
  const response = await apiClient.get<ApiResponse<any[]>>('/team');
  return response.data || [];
}

// ── CAREERS (JOBS) ──
export async function listCareers() {
  const response = await apiClient.get<ApiResponse<any[]>>('/careers');
  return response.data || [];
}

// ── TENDERS ──
export async function listTenders() {
  const response = await apiClient.get<ApiResponse<any[]>>('/tenders');
  return response.data || [];
}

// ── NEWS (ARTICLES) ──
export async function listArticles() {
  const response = await apiClient.get<ApiResponse<any[]>>('/news');
  return response.data || [];
}
