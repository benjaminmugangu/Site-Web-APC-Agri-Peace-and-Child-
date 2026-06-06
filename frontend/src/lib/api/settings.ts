import { apiClient, type ApiResponse } from './api-client';
import { type SiteSettings, type ApiResponse as TypeApiResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const settingsService = {
  async get(): Promise<SiteSettings | null> {
    try {
      // Uses Next.js native cache: revalidation every 60 seconds
      // Avoids a backend call on every SSR page render
      // Note: This intentionally uses raw fetch (not apiClient) for SSR
      // revalidation support, which apiClient doesn't offer.
      const response = await fetch(`${API_BASE_URL}/settings`, {
        next: { revalidate: 60 },
      });
      if (!response.ok) return null;
      const result: TypeApiResponse<SiteSettings> = await response.json();
      return result.data || null;
    } catch {
      return null;
    }
  },

  async update(payload: SiteSettings): Promise<SiteSettings | null> {
    // Uses apiClient so the JWT token is automatically attached
    const response = await apiClient.put<ApiResponse<SiteSettings>>('/settings', payload);
    return response.data || null;
  }
};
