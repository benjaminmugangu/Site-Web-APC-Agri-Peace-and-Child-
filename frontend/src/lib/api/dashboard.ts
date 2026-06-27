import { apiClient, type ApiResponse } from './api-client';

// ─── Interfaces typées alignées sur la réponse de /api/v1/stats/dashboard ───

export interface StatBlock {
  total: number;
  label: string;
  href: string;
}

export interface DashboardStatsAdmin {
  role: 'ADMIN';
  projets: StatBlock & { publies: number };
  actualites: StatBlock & { publiees: number };
  messages: StatBlock & { nonLus: number };
  services: StatBlock;
  emplois: StatBlock & { actifs: number };
  equipe: StatBlock;
  appels: StatBlock & { actifs: number };
}

export interface DashboardStatsRH {
  role: 'ADMIN_RH';
  emplois: StatBlock & { actifs: number };
  equipe: StatBlock;
  appels: StatBlock & { actifs: number };
}

export type DashboardStats = DashboardStatsAdmin | DashboardStatsRH;

export const dashboardService = {
  async getStats(): Promise<DashboardStats | null> {
    try {
      const response = await apiClient.get<ApiResponse<DashboardStats>>('/stats/dashboard');
      return response.data || null;
    } catch {
      return null;
    }
  },
};
