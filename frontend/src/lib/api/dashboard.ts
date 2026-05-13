import { apiClient, type ApiResponse } from './api-client';

export interface DashboardStats {
  projects: {
    total: number;
    published: number;
    draft: number;
  };
  articles: {
    total: number;
    published: number;
  };
  team: {
    total: number;
  };
  messages: {
    total: number;
    unread: number;
  };
}

export interface ActivityLog {
  id: string;
  action: string;
  target: string;
  userName: string;
  createdAt: string;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/admin/stats');
    return response.data || {
      projects: { total: 0, published: 0, draft: 0 },
      articles: { total: 0, published: 0 },
      team: { total: 0 },
      messages: { total: 0, unread: 0 }
    };
  },

  async getRecentActivity(): Promise<ActivityLog[]> {
    const response = await apiClient.get<ApiResponse<ActivityLog[]>>('/admin/activity');
    return response.data || [];
  }
};
