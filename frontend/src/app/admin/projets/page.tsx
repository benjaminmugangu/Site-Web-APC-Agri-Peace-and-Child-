"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, Copy, Archive, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { listProjects, deleteProject, publishProject, unpublishProject, archiveProject, duplicateProject, bulkDeleteProjects, type ListProjectsOptions } from "@/lib/api/projects"
import type { Project, ProjectStatus } from "@/lib/data/mock-projects"

const statusLabels: Record<string, { label: string; color: string; dot: string }> = {
  published: { label: "Publié", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  draft:     { label: "Brouillon", color: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
  archived:  { label: "Archivé", color: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
}

const categoryLabels: Record<string, string> = {
  agriculture: "Agriculture",
  protection:  "Protection",
  dignite:     "Dignité",
  paix:        "Paix",
}

const tabs: { label: string; value: ProjectStatus | "all" }[] = [
  { label: "Tous", value: "all" },
  { label: "Publiés", value: "published" },
  { label: "Brouillons", value: "draft" },
  { label: "Archivés", value: "archived" },
]

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [meta, setMeta] = useState({ total: 0, page: 1, perPage: 8, totalPages: 1 })
  const [activeTab, setActiveTab] = useState<ProjectStatus | "all">("all")
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<Project | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null)

  function load(opts?: ListProjectsOptions) {
    const result = listProjects({ status: activeTab, search, page: meta.page, perPage: 8, ...opts })
    setProjects(result.data)
    setMeta(result.meta)
  }

  useEffect(() => { load({ page: 1 }) }, [activeTab, search])

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function handleTogglePublish(project: Project) {
    if (project.status === "published") {
      unpublishProject(project.id)
      showToast(`"${project.title}" dépublié`)
    } else {
      publishProject(project.id)
      showToast(`"${project.title}" publié !`)
    }
    setOpenMenuId(null)
    load()
  }

  function handleArchive(project: Project) {
    archiveProject(project.id)
    showToast(`"${project.title}" archivé`)
    setOpenMenuId(null)
    load()
  }

  function handleDuplicate(project: Project) {
    duplicateProject(project.id)
    showToast(`"${project.title}" dupliqué`)
    setOpenMenuId(null)
    load()
  }

  function handleConfirmDelete() {
    if (!deleteModal) return
    deleteProject(deleteModal.id)
    showToast(`"${deleteModal.title}" supprimé`, "error")
    setDeleteModal(null)
    load()
  }

  function handleBulkDelete() {
    const count = bulkDeleteProjects(selectedIds)
    showToast(`${count} projet(s) supprimé(s)`, "error")
    setSelectedIds([])
    load()
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => prev.length === projects.length ? [] : projects.map((p) => p.id))
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium transition-all ${toast.type === "success" ? "bg-apc-green" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Projets</h1>
          <p className="text-gray-500 text-sm">{meta.total} projet(s) au total</p>
        </div>
        <Link href="/admin/projets/editeur">
          <Button className="gap-2 bg-[#1a472a] hover:bg-[#2d6a4f]">
            <Plus size={18} /> Nouveau Projet
          </Button>
        </Link>
      </div>

      {/* Onglets statuts */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setActiveTab(tab.value); setSelectedIds([]) }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.value ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recherche & Filtres */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 text-sm"
          />
        </div>

        {/* Bulk actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
            <span className="text-sm text-red-700 font-medium">{selectedIds.length} sélectionné(s)</span>
            <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-100 h-7 text-xs gap-1" onClick={handleBulkDelete}>
              <Trash2 size={14} /> Supprimer
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden text-black">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" className="accent-apc-green w-4 h-4" checked={selectedIds.length === projects.length && projects.length > 0} onChange={toggleSelectAll} />
                </th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Projet</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Catégorie</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Lieu</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400 text-sm">
                    Aucun projet trouvé.{" "}
                    <Link href="/admin/projets/editeur" className="text-apc-green underline">Créer le premier</Link>
                  </td>
                </tr>
              ) : projects.map((project) => {
                const s = statusLabels[project.status]
                return (
                  <tr key={project.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="accent-apc-green w-4 h-4" checked={selectedIds.includes(project.id)} onChange={() => toggleSelect(project.id)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={project.imageUrl} alt="" className="w-12 h-9 rounded-lg object-cover bg-gray-100 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate max-w-[200px] text-sm">{project.title}</p>
                          <p className="text-xs text-gray-400">{project.beneficiaries.toLocaleString("fr-FR")} bénéf.</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                        {categoryLabels[project.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">{project.province}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${s.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right relative">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/projets/${project.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-50" title="Voir le détail">
                            <Eye size={15} />
                          </Button>
                        </Link>
                        <Link href={`/admin/projets/${project.id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-apc-green hover:bg-green-50" title="Modifier">
                            <Edit size={15} />
                          </Button>
                        </Link>
                        {/* Menu contextuel */}
                        <div className="relative">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpenMenuId(openMenuId === project.id ? null : project.id)}>
                            <MoreVertical size={15} />
                          </Button>
                          {openMenuId === project.id && (
                            <div className="absolute right-0 top-9 z-20 bg-white border border-gray-100 rounded-xl shadow-xl w-48 py-1 text-sm">
                              <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700" onClick={() => handleTogglePublish(project)}>
                                {project.status === "published" ? <><ToggleLeft size={15} className="text-amber-500" /> Dépublier</> : <><ToggleRight size={15} className="text-green-500" /> Publier</>}
                              </button>
                              <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700" onClick={() => handleDuplicate(project)}>
                                <Copy size={15} className="text-purple-500" /> Dupliquer
                              </button>
                              <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700" onClick={() => handleArchive(project)}>
                                <Archive size={15} className="text-gray-500" /> Archiver
                              </button>
                              <div className="border-t border-gray-100 my-1" />
                              <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600" onClick={() => { setDeleteModal(project); setOpenMenuId(null) }}>
                                <Trash2 size={15} /> Supprimer
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <p className="text-sm text-gray-500">
              {(meta.page - 1) * meta.perPage + 1}–{Math.min(meta.page * meta.perPage, meta.total)} sur {meta.total} projets
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={meta.page === 1} onClick={() => load({ page: meta.page - 1 })} className="gap-1">
                <ChevronLeft size={14} /> Préc.
              </Button>
              <Button variant="outline" size="sm" disabled={meta.page === meta.totalPages} onClick={() => load({ page: meta.page + 1 })} className="gap-1">
                Suiv. <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modale de confirmation suppression */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setDeleteModal(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Supprimer ce projet ?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              <strong className="text-gray-800">&quot;{deleteModal.title}&quot;</strong> sera définitivement supprimé. Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteModal(null)}>Annuler</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleConfirmDelete}>
                Oui, supprimer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay fermer menu contextuel */}
      {openMenuId && <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />}
    </div>
  )
}
