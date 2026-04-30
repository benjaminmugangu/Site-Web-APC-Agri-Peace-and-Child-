import { mockMessages, type Message, type MessageStatus } from "@/lib/data/mock-messages"

const STORAGE_KEY = "apc_messages"

function getStore(): Message[] {
  if (typeof window === "undefined") return mockMessages
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockMessages))
    return mockMessages
  }
  return JSON.parse(raw) as Message[]
}

function saveStore(messages: Message[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }
}

export type ListMessagesOptions = {
  status?: MessageStatus | "all"
  type?: Message["type"] | "all"
  search?: string
  page?: number
  perPage?: number
}

export type PaginatedResult<T> = {
  data: T[]
  meta: { total: number; page: number; perPage: number; totalPages: number }
}

export function listMessages(options: ListMessagesOptions = {}): PaginatedResult<Message> {
  const { status = "all", type = "all", search, page = 1, perPage = 20 } = options
  let items = getStore()

  if (status !== "all") items = items.filter((m) => m.status === status)
  if (type !== "all") items = items.filter((m) => m.type === type)
  if (search) {
    const q = search.toLowerCase()
    items = items.filter(
      (m) =>
        m.sender.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q)
    )
  }

  items = items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const total = items.length
  const totalPages = Math.ceil(total / perPage)
  const data = items.slice((page - 1) * perPage, page * perPage)
  return { data, meta: { total, page, perPage, totalPages } }
}

export function getMessage(id: string): Message | null {
  return getStore().find((m) => m.id === id) ?? null
}

export function markAsRead(id: string): Message | null {
  const messages = getStore()
  const idx = messages.findIndex((m) => m.id === id)
  if (idx === -1) return null
  if (messages[idx].status === "unread") {
    messages[idx] = { ...messages[idx], status: "read" }
    saveStore(messages)
  }
  return messages[idx]
}

export function markAsReplied(id: string, repliedBy: string): Message | null {
  const messages = getStore()
  const idx = messages.findIndex((m) => m.id === id)
  if (idx === -1) return null
  messages[idx] = {
    ...messages[idx],
    status: "replied",
    repliedAt: new Date().toISOString(),
    repliedBy,
  }
  saveStore(messages)
  return messages[idx]
}

export function deleteMessage(id: string): boolean {
  const messages = getStore()
  const filtered = messages.filter((m) => m.id !== id)
  if (filtered.length === messages.length) return false
  saveStore(filtered)
  return true
}

export function getUnreadCount(): number {
  return getStore().filter((m) => m.status === "unread").length
}

export function resetMessagesToMock(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockMessages))
  }
}
