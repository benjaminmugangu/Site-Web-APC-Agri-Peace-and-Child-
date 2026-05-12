import { apiClient } from './api-client';

export type MediaUploadResponse = {
  url: string;
  publicId: string;
  originalName: string;
  size: number;
};

export const mediaService = {
  /**
   * Upload un fichier image vers le backend (Cloudinary)
   */
  async uploadImage(file: File): Promise<MediaUploadResponse | null> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // On utilise le fetch natif ou on configure apiClient pour accepter FormData
      // Pour éviter les soucis de Content-Type avec JSON, on utilise fetch direct
      const token = localStorage.getItem('token');
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      
      const response = await fetch(`${baseURL}/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Ne pas mettre de Content-Type, le navigateur le met tout seul avec le boundary pour FormData
        },
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'upload');
      }

      // data correspond à l'objet ApiResponse de notre backend: { success, message, data: { url, publicId... } }
      return data.data as MediaUploadResponse;
    } catch (error) {
      console.error('Erreur Media Upload:', error);
      throw error;
    }
  }
};
