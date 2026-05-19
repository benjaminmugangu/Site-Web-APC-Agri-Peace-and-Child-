/**
 * Client API unifié pour APC
 * Gère l'authentification, les headers et la gestion des erreurs.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
};

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    // On essaie de récupérer le token depuis le stockage local ou cookie
    return localStorage.getItem('apc_access_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      cache: 'no-store',
      ...options,
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      // Gestion des erreurs d'auth (401/403)
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('apc_access_token');
          // On évite la boucle infinie si on est déjà sur la page de login
          if (!window.location.pathname.includes('/admin/login')) {
            window.location.href = '/admin/login';
          }
        }
      }
      throw new Error(result.message || 'Une erreur est survenue');
    }

    return result as T;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== 'all') {
          query.append(key, String(value));
        }
      });
      url += `?${query.toString()}`;
    }
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
