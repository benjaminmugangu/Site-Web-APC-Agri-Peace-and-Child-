import { apiClient } from './api-client';
import { type SiteSettings, type ApiResponse } from "@/types";

export const settingsService = {
  async get(): Promise<SiteSettings | null> {
    const response = await apiClient.get<ApiResponse<SiteSettings>>('/settings');
    return response.data || null;
  },

  async update(payload: SiteSettings): Promise<SiteSettings | null> {
    const response = await apiClient.put<ApiResponse<SiteSettings>>('/settings', payload);
    return response.data || null;
  }
};
