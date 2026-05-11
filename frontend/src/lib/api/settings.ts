import { apiClient, type ApiResponse } from './api-client';

export type SiteSettings = {
  id?: number;
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  stats: {
    beneficiaries: string;
    projects: string;
    provinces: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    socials?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
  };
};

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
