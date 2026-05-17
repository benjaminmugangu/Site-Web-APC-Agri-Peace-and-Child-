import { apiClient, type ApiResponse } from './api-client';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN';
};

export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export const authService = {
  async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    
    if (response.success && response.data) {
      const { accessToken, refreshToken } = response.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('apc_access_token', accessToken);
        localStorage.setItem('apc_refresh_token', refreshToken);
        localStorage.setItem('apc_user', JSON.stringify(response.data.user));
        
        // Optionnel : Définir un cookie pour le middleware Next.js
        document.cookie = `apc_admin_session=authenticated; path=/; max-age=86400; SameSite=Lax`;
      }
      return response.data;
    }
    throw new Error(response.message || 'Échec de la connexion');
  },

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('apc_access_token');
      localStorage.removeItem('apc_refresh_token');
      localStorage.removeItem('apc_user');
      document.cookie = 'apc_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    // Optionnel : Appeler l'endpoint logout du backend
    try {
      await apiClient.post('/auth/logout', {});
    } catch (e) {
      // Ignorer l'erreur au logout
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('apc_user');
    return user ? JSON.parse(user) : null;
  }
};
