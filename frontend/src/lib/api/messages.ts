import { apiClient, type ApiResponse } from './api-client';
import { type Message, type MessageStatus, type MessageType } from "@/lib/data/mock-messages";

export type ListMessagesOptions = {
  status?: MessageStatus | "all";
  type?: MessageType | "all";
  search?: string;
  page?: number;
  perPage?: number;
};

export type PaginatedResult<T> = {
  data: T[];
  meta: { total: number; page: number; perPage: number; totalPages: number };
};

// ── GET /api/v1/contact ──
export async function listMessages(options: ListMessagesOptions = {}): Promise<PaginatedResult<Message>> {
  const response = await apiClient.get<ApiResponse<Message[]>>('/contact', options);
  return {
    data: response.data || [],
    meta: response.meta || { total: 0, page: 1, perPage: 20, totalPages: 0 }
  };
}

// ── GET /api/v1/contact/:id ──
export async function getMessage(id: string): Promise<Message | null> {
  const response = await apiClient.get<ApiResponse<Message>>(`/contact/${id}`);
  return response.data || null;
}

// ── PATCH /api/v1/contact/:id/status ──
export async function updateMessageStatus(id: string, status: MessageStatus): Promise<Message | null> {
  const response = await apiClient.patch<ApiResponse<Message>>(`/contact/${id}/status`, { status });
  return response.data || null;
}

// ── POST /api/v1/contact/:id/reply ──
export async function replyToMessage(id: string, content: string): Promise<Message | null> {
  const response = await apiClient.post<ApiResponse<Message>>(`/contact/${id}/reply`, { content });
  return response.data || null;
}

// ── DELETE /api/v1/contact/:id ──
export async function deleteMessage(id: string): Promise<boolean> {
  const response = await apiClient.delete<ApiResponse<any>>(`/contact/${id}`);
  return response.success;
}

// ── GET /api/v1/contact/unread-count ──
export async function getUnreadCount(): Promise<number> {
  const response = await apiClient.get<ApiResponse<{ count: number }>>('/contact/unread-count');
  return response.data?.count || 0;
}
