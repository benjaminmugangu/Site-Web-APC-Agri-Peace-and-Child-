import { type SiteSettings, type ApiResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const settingsService = {
  async get(): Promise<SiteSettings | null> {
    try {
      // Utilise le cache natif de Next.js : revalidation toutes les 60 secondes
      // Évite un appel backend à chaque rendu SSR de page
      const response = await fetch(`${API_BASE_URL}/settings`, {
        next: { revalidate: 60 },
      });
      if (!response.ok) return null;
      const result: ApiResponse<SiteSettings> = await response.json();
      return result.data || null;
    } catch {
      return null;
    }
  },

  async update(payload: SiteSettings): Promise<SiteSettings | null> {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const result: ApiResponse<SiteSettings> = await response.json();
    return result.data || null;
  }
};
