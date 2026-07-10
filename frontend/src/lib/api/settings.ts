import { apiClient, type ApiResponse } from './api-client';
import { type SiteSettings, type ApiResponse as TypeApiResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

type DeepPartial<T> = T extends Array<infer U>
  ? U[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export type SettingsUpdatePayload = DeepPartial<SiteSettings>;

export const settingsService = {
  async get(): Promise<SiteSettings | null> {
    try {
      const isServer = typeof window === 'undefined';

      const fetchOptions: RequestInit = isServer
        ? {
            // Côté serveur (SSR/Next.js) : mise en cache avec revalidation toutes les 60s
            next: { revalidate: 60 },
          } as RequestInit
        : {
            // Côté client (navigateur admin) : JAMAIS de cache, toujours les données fraîches
            cache: 'no-store',
          };

      const response = await fetch(`${API_BASE_URL}/settings`, fetchOptions);
      if (!response.ok) return null;
      const result: TypeApiResponse<SiteSettings> = await response.json();
      return result.data || null;
    } catch {
      return null;
    }
  },

  async update(payload: SettingsUpdatePayload): Promise<SiteSettings | null> {
    // Uses apiClient so the JWT token is automatically attached
    const response = await apiClient.put<ApiResponse<SiteSettings>>('/settings', payload);
    return response.data || null;
  }
};

