import { MessageSubject, ApiResponse } from "@/types";
import apiClient from "./api-client";

export const messageSubjectsApi = {
  // Get all message subjects (public by default returns only active)
  getMessageSubjects: async (all: boolean = false): Promise<MessageSubject[]> => {
    try {
      const url = all ? '/message-subjects/admin/all' : '/message-subjects';
      const response = await apiClient.get<ApiResponse<MessageSubject[]>>(url);
      return response.data?.data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des sujets de contact:", error);
      return [];
    }
  },

  // Get a single message subject by id
  getMessageSubjectById: async (id: string): Promise<MessageSubject | null> => {
    try {
      const response = await apiClient.get<ApiResponse<MessageSubject>>(`/message-subjects/${id}`);
      return response.data?.data || null;
    } catch (error) {
      console.error(`Erreur lors de la récupération du sujet ${id}:`, error);
      return null;
    }
  },

  // Create a new message subject (Admin)
  createMessageSubject: async (data: Partial<MessageSubject>): Promise<MessageSubject> => {
    const response = await apiClient.post<ApiResponse<MessageSubject>>("/message-subjects", data);
    if (!response.data?.data) {
      throw new Error("Failed to create message subject");
    }
    return response.data.data;
  },

  // Update a message subject (Admin)
  updateMessageSubject: async (id: string, data: Partial<MessageSubject>): Promise<MessageSubject> => {
    const response = await apiClient.put<ApiResponse<MessageSubject>>(`/message-subjects/${id}`, data);
    if (!response.data?.data) {
      throw new Error("Failed to update message subject");
    }
    return response.data.data;
  },

  // Toggle message subject active status (Admin)
  toggleMessageSubjectStatus: async (id: string): Promise<MessageSubject> => {
    const response = await apiClient.patch<ApiResponse<MessageSubject>>(`/message-subjects/${id}/toggle`);
    if (!response.data?.data) {
      throw new Error("Failed to toggle message subject status");
    }
    return response.data.data;
  },

  // Delete a message subject (Admin)
  deleteMessageSubject: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/message-subjects/${id}`);
    return response.data?.success || false;
  }
};
