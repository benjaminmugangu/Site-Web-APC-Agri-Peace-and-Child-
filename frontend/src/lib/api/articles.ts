import { mockArticles, type Article, type ArticleStatus } from "@/lib/data/mock-articles"

const STORAGE_KEY = "apc_articles"

function getStore(): Article[] {
  if (typeof window === "undefined") return mockArticles
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockArticles))
    return mockArticles
  }
  return JSON.parse(raw) as Article[]
}

function saveStore(articles: Article[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
  }
}

export type ListArticlesOptions = {
  status?: ArticleStatus | "all"
  category?: string
  search?: string
  featured?: boolean
  page?: number
  perPage?: number
}

export type PaginatedResult<T> = {
  data: T[]
  meta: { total: number; page: number; perPage: number; totalPages: number }
}

export function listArticles(options: ListArticlesOptions = {}): PaginatedResult<Article> {
  const { status = "all", category, search, featured, page = 1, perPage = 10 } = options
  let items = getStore()

  if (status !== "all") items = items.filter((a) => a.status === status)
  if (category) items = items.filter((a) => a.category === category)
  if (featured !== undefined) items = items.filter((a) => a.featured === featured)
  if (search) {
    const q = search.toLowerCase()
    items = items.filter(
      (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
    )
  }

  items = items.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  const total = items.length
  const totalPages = Math.ceil(total / perPage)
  const data = items.slice((page - 1) * perPage, page * perPage)
  return { data, meta: { total, page, perPage, totalPages } }
}

export function getArticle(id: string): Article | null {
  return getStore().find((a) => a.id === id) ?? null
}

export function createArticle(payload: Omit<Article, "id" | "createdAt" | "updatedAt">): Article {
  const articles = getStore()
  const newArticle: Article = {
    ...payload,
    id: `art-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  saveStore([newArticle, ...articles])
  return newArticle
}

export function updateArticle(id: string, payload: Partial<Article>): Article | null {
  const articles = getStore()
  const idx = articles.findIndex((a) => a.id === id)
  if (idx === -1) return null
  articles[idx] = { ...articles[idx], ...payload, updatedAt: new Date().toISOString() }
  saveStore(articles)
  return articles[idx]
}

export function deleteArticle(id: string): boolean {
  const articles = getStore()
  const filtered = articles.filter((a) => a.id !== id)
  if (filtered.length === articles.length) return false
  saveStore(filtered)
  return true
}

export function publishArticle(id: string): Article | null {
  return updateArticle(id, { status: "published", publishDate: new Date().toISOString() })
}

export function unpublishArticle(id: string): Article | null {
  return updateArticle(id, { status: "draft", publishDate: null })
}

export function scheduleArticle(id: string, scheduledDate: string): Article | null {
  return updateArticle(id, { status: "scheduled", scheduledDate })
}

export function duplicateArticle(id: string): Article | null {
  const original = getArticle(id)
  if (!original) return null
  return createArticle({
    ...original,
    title: `${original.title} (copie)`,
    slug: `${original.slug}-copie-${Date.now()}`,
    status: "draft",
    featured: false,
    publishDate: null,
  })
}

export function resetArticlesToMock(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockArticles))
  }
}
