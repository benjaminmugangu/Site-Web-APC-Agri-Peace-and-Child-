import { apiClient } from './api-client';
import { type Message, type MessageStatus, type MessageType, type PaginatedResult, type ApiResponse } from "@/types";

export type ListMessagesOptions = {
  status?: MessageStatus | "all";
  type?: MessageType | "all";
  search?: string;
  page?: number;
  perPage?: number;
};

/**
 * Normalise un message provenant du backend en convertissant le champ 'sender' en 'name'
 * attendu par le frontend.
 */
function mapMessage(backendMsg: any): Message {
  if (!backendMsg) return backendMsg;
  return {
    ...backendMsg,
    name: backendMsg.sender || backendMsg.name || 'Anonyme',
  };
}

// ── POST /api/v1/contact (Public/Admin) ──
export async function createMessage(payload: any): Promise<ApiResponse<Message>> {
  // Traduction auto-correctrice : si le formulaire envoie 'firstName'/'lastName' ou 'message',
  // on les mappe vers les colonnes attendues par l'API du backend ('sender', 'content').
  const senderName = payload.sender || payload.name || `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || 'Anonyme';
  
  const isSubjectUuid = payload.subject && payload.subject.length === 36 && payload.subject.includes('-');

  const normalizedPayload = {
    sender: senderName,
    email: payload.email,
    phone: payload.phone || undefined,
    // On garde le subject texte, mais on met 'Information Générale' si c'est un UUID (pour garder un titre lisible si le backend ne le fait pas)
    subject: isSubjectUuid ? 'Information Générale' : (payload.subject || 'Information Générale'),
    content: payload.content || payload.message || '',
    type: isSubjectUuid ? undefined : (payload.type || (payload.subject === 'don' ? 'donation' : payload.subject === 'partenariat' ? 'partnership' : 'contact')),
    messageSubjectId: isSubjectUuid ? payload.subject : undefined
  };

  const response = await apiClient.post<ApiResponse<any>>('/contact', normalizedPayload);
  
  if (response.data) {
    response.data = mapMessage(response.data);
  }
  return response as ApiResponse<Message>;
}

// ── GET /api/v1/contact (Admin) ──
export async function listMessages(options: ListMessagesOptions = {}): Promise<PaginatedResult<Message>> {
  const queryParams: any = {
    page: options.page,
    limit: options.perPage,
    status: options.status && options.status !== 'all' ? options.status : undefined,
    type: options.type && options.type !== 'all' ? options.type : undefined,
    search: options.search || undefined
  };

  const response = await apiClient.get<ApiResponse<any[]>>('/contact', queryParams);
  const rawData = response.data || [];
  const mappedData = rawData.map(mapMessage);

  return {
    data: mappedData,
    meta: response.meta || { total: mappedData.length, page: 1, perPage: 20, totalPages: 1 }
  };
}

// ── GET /api/v1/contact/:id (Admin) ──
export async function getMessage(id: string): Promise<Message | null> {
  const response = await apiClient.get<ApiResponse<any>>(`/contact/${id}`);
  return response.data ? mapMessage(response.data) : null;
}

// ── PATCH /api/v1/contact/:id/status (Admin) ──
export async function updateMessageStatus(id: string, status: MessageStatus): Promise<Message | null> {
  const response = await apiClient.patch<ApiResponse<any>>(`/contact/${id}/status`, { status });
  return response.data ? mapMessage(response.data) : null;
}

// ── POST /api/v1/contact/:id/reply (Admin) ──
export async function replyToMessage(id: string, content: string): Promise<Message | null> {
  const response = await apiClient.post<ApiResponse<any>>(`/contact/${id}/reply`, { content });
  return response.data ? mapMessage(response.data) : null;
}

// ── DELETE /api/v1/contact/:id (Admin) ──
export async function deleteMessage(id: string): Promise<boolean> {
  const response = await apiClient.delete<ApiResponse<any>>(`/contact/${id}`);
  return response.success;
}

// ── GET /api/v1/contact/unread-count (Admin) ──
export async function getUnreadCount(): Promise<number> {
  const response = await apiClient.get<ApiResponse<{ count: number }>>('/contact/unread-count');
  return response.data?.count || 0;
}

