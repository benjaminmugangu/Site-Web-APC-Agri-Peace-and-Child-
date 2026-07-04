import { MessageSubject, ApiResponse } from "@/types";
import apiClient from "./api-client";

// Le backend via ResponseUtil.success retourne : { success, message, data: <payload> }
// Donc pour ce module, response.data est le tableau ou l'objet directement.

export const messageSubjectsApi = {
  // Get all message subjects (public by default returns only active)
  getMessageSubjects: async (all: boolean = false): Promise<MessageSubject[]> => {
    try {
      const url = all ? '/message-subjects/admin/all' : '/message-subjects';
      const response = await apiClient.get<any>(url);
      // Le backend retourne { success, message, data: [...] }
      return response.data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des sujets de contact:", error);
      return [];
    }
  },

  // Get a single message subject by id
  getMessageSubjectById: async (id: string): Promise<MessageSubject | null> => {
    try {
      const response = await apiClient.get<any>(`/message-subjects/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Erreur lors de la récupération du sujet ${id}:`, error);
      return null;
    }
  },

  // Create a new message subject (Admin)
  createMessageSubject: async (data: Partial<MessageSubject>): Promise<MessageSubject> => {
    const response = await apiClient.post<any>("/message-subjects", data);
    if (!response.data) {
      throw new Error("Failed to create message subject");
    }
    return response.data;
  },

  // Update a message subject (Admin)
  updateMessageSubject: async (id: string, data: Partial<MessageSubject>): Promise<MessageSubject> => {
    const response = await apiClient.put<any>(`/message-subjects/${id}`, data);
    if (!response.data) {
      throw new Error("Failed to update message subject");
    }
    return response.data;
  },

  // Toggle message subject active status (Admin)
  toggleMessageSubjectStatus: async (id: string): Promise<MessageSubject> => {
    const response = await apiClient.patch<any>(`/message-subjects/${id}/toggle`, {});
    if (!response.data) {
      throw new Error("Failed to toggle message subject status");
    }
    return response.data;
  },

  // Delete a message subject (Admin)
  deleteMessageSubject: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<any>(`/message-subjects/${id}`);
    return response.success || false;
  }
};
