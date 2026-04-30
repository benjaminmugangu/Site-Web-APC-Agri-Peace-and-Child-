/**
 * Service API simulé pour les Projets
 * Utilise localStorage pour la persistance côté client.
 * À remplacer par de vraies requêtes fetch() lors de l'intégration backend.
 */

import { mockProjects, type Project, type ProjectStatus } from "@/lib/data/mock-projects"

const STORAGE_KEY = "apc_projects"

// ── Initialisation ──
function getStore(): Project[] {
  if (typeof window === "undefined") return mockProjects
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProjects))
    return mockProjects
  }
  return JSON.parse(raw) as Project[]
}

function saveStore(projects: Project[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  }
}

// ── GET /api/admin/projects ──
export type ListProjectsOptions = {
  status?: ProjectStatus | "all"
  category?: string
  search?: string
  page?: number
  perPage?: number
}

export type PaginatedResult<T> = {
  data: T[]
  meta: { total: number; page: number; perPage: number; totalPages: number }
}

export function listProjects(options: ListProjectsOptions = {}): PaginatedResult<Project> {
  const { status = "all", category, search, page = 1, perPage = 10 } = options
  let items = getStore()

  if (status !== "all") items = items.filter((p) => p.status === status)
  if (category) items = items.filter((p) => p.category === category)
  if (search) {
    const q = search.toLowerCase()
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
  }

  const total = items.length
  const totalPages = Math.ceil(total / perPage)
  const data = items.slice((page - 1) * perPage, page * perPage)
  return { data, meta: { total, page, perPage, totalPages } }
}

// ── GET /api/admin/projects/:id ──
export function getProject(id: string): Project | null {
  return getStore().find((p) => p.id === id) ?? null
}

// ── POST /api/admin/projects ──
export function createProject(payload: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
  const projects = getStore()
  const newProject: Project = {
    ...payload,
    id: `proj-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  saveStore([newProject, ...projects])
  return newProject
}

// ── PUT /api/admin/projects/:id ──
export function updateProject(id: string, payload: Partial<Project>): Project | null {
  const projects = getStore()
  const idx = projects.findIndex((p) => p.id === id)
  if (idx === -1) return null
  projects[idx] = { ...projects[idx], ...payload, updatedAt: new Date().toISOString() }
  saveStore(projects)
  return projects[idx]
}

// ── DELETE /api/admin/projects/:id ──
export function deleteProject(id: string): boolean {
  const projects = getStore()
  const filtered = projects.filter((p) => p.id !== id)
  if (filtered.length === projects.length) return false
  saveStore(filtered)
  return true
}

// ── PATCH /api/admin/projects/:id/publish ──
export function publishProject(id: string): Project | null {
  return updateProject(id, { status: "published" })
}

// ── PATCH /api/admin/projects/:id/unpublish ──
export function unpublishProject(id: string): Project | null {
  return updateProject(id, { status: "draft" })
}

// ── PATCH /api/admin/projects/:id/archive ──
export function archiveProject(id: string): Project | null {
  return updateProject(id, { status: "archived" })
}

// ── POST /api/admin/projects/:id/duplicate ──
export function duplicateProject(id: string): Project | null {
  const original = getProject(id)
  if (!original) return null
  return createProject({
    ...original,
    title: `${original.title} (copie)`,
    slug: `${original.slug}-copie-${Date.now()}`,
    status: "draft",
    featured: false,
    createdBy: original.createdBy,
  })
}

// ── Bulk actions ──
export function bulkDeleteProjects(ids: string[]): number {
  const projects = getStore()
  const filtered = projects.filter((p) => !ids.includes(p.id))
  const deleted = projects.length - filtered.length
  saveStore(filtered)
  return deleted
}

export function bulkPublishProjects(ids: string[]): number {
  let count = 0
  ids.forEach((id) => {
    const result = publishProject(id)
    if (result) count++
  })
  return count
}

// ── Reset aux données mock (utile pour les tests) ──
export function resetProjectsToMock(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProjects))
  }
}
