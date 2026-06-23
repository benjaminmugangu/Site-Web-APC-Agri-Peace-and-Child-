"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Loader2, Tag, ToggleLeft, ToggleRight, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { partnerCategoriesApi } from "@/lib/api/partner-categories"
import type { PartnerCategory } from "@/types"

// ── Helpers ──────────────────────────────────────────────────────────────────
function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminPartnerCategories() {
  const [categories, setCategories] = useState<PartnerCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<PartnerCategory | null>(null)
  const [formName, setFormName] = useState("")
  const [formSlug, setFormSlug] = useState("")
  const [formDesc, setFormDesc] = useState("")
  const [saving, setSaving] = useState(false)

  // Delete confirmation
  const [deleteModal, setDeleteModal] = useState<PartnerCategory | null>(null)

  // ── Load ──────────────────────────────────────────────────────────────────
  async function load() {
    setLoading(true)
    try {
      const data = await partnerCategoriesApi.getAll()
      setCategories(data)
    } catch {
      showToast("Erreur lors du chargement", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // ── Toast ─────────────────────────────────────────────────────────────────
  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Open form ─────────────────────────────────────────────────────────────
  function openCreate() {
    setEditTarget(null)
    setFormName("")
    setFormSlug("")
    setFormDesc("")
    setShowForm(true)
  }

  function openEdit(cat: PartnerCategory) {
    setEditTarget(cat)
    setFormName(cat.name)
    setFormSlug(cat.slug)
    setFormDesc(cat.description || "")
    setShowForm(true)
  }

  function handleNameChange(val: string) {
    setFormName(val)
    if (!editTarget) setFormSlug(slugify(val))
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!formName.trim() || !formSlug.trim()) {
      showToast("Le nom et le slug sont obligatoires", "error")
      return
    }
    setSaving(true)
    try {
      if (editTarget) {
        await partnerCategoriesApi.update(editTarget.id, { name: formName, slug: formSlug, description: formDesc })
        showToast(`Catégorie "${formName}" mise à jour`)
      } else {
        await partnerCategoriesApi.create({ name: formName, slug: formSlug, description: formDesc })
        showToast(`Catégorie "${formName}" créée avec succès !`)
      }
      setShowForm(false)
      load()
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || "Erreur lors de l'enregistrement", "error")
    } finally {
      setSaving(false)
    }
  }

  // ── Toggle active ─────────────────────────────────────────────────────────
  async function handleToggle(cat: PartnerCategory) {
    try {
      await partnerCategoriesApi.update(cat.id, { isActive: !cat.isActive })
      showToast(`Catégorie "${cat.name}" ${!cat.isActive ? "activée" : "désactivée"}`)
      load()
    } catch {
      showToast("Erreur lors de la mise à jour", "error")
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteModal) return
    try {
      await partnerCategoriesApi.delete(deleteModal.id)
      showToast(`Catégorie "${deleteModal.name}" supprimée`)
      setDeleteModal(null)
      load()
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || "Erreur lors de la suppression", "error")
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
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
          <h1 className="text-2xl font-bold text-gray-900">Types de Partenaires</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gérez les différentes catégories de partenaires (Bailleur de fonds, Technique, Local, etc.).
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="gap-2 bg-[#1a472a] hover:bg-[#2d6a4f] text-white"
        >
          <Plus size={18} /> Nouveau Type
        </Button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 flex items-start gap-3">
        <Tag size={18} className="shrink-0 mt-0.5 text-blue-500" />
        <span>
          Les types de partenaires sont désormais <strong>dynamiques</strong>. Vous pouvez en ajouter, modifier ou désactiver librement.
          Un type désactivé ne sera plus proposé lors de l'ajout d'un partenaire.
        </span>
      </div>

      {/* Category list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-apc-green" size={36} />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Tag size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">Aucun type pour le moment</p>
            <p className="text-sm mt-1">Cliquez sur "Nouveau Type" pour commencer.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Slug</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Description</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Tag size={14} className="text-emerald-600" />
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{cat.slug}</code>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-sm text-gray-500 max-w-xs truncate">
                    {cat.description || <span className="text-gray-300 italic">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggle(cat)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                        cat.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {cat.isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                      {cat.isActive ? "Actif" : "Inactif"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8 text-apc-green hover:bg-green-50"
                        title="Modifier"
                        onClick={() => openEdit(cat)}
                      >
                        <Edit size={15} />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-50"
                        title="Supprimer"
                        onClick={() => setDeleteModal(cat)}
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Form Modal ────────────────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editTarget ? "Modifier le type" : "Nouveau type de partenaire"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Nom *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="Ex : Bailleur de fonds"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all text-black"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Slug *</label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={e => setFormSlug(e.target.value)}
                  placeholder="bailleur-de-fonds"
                  className="w-full px-4 py-2 rounded-lg border border-gray-100 bg-gray-50 text-gray-600 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-apc-green/20"
                />
                <p className="text-xs text-gray-400">Identifiant unique utilisé dans les URLs</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Description <span className="font-normal text-gray-400">(optionnel)</span></label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="Brève description de ce type de partenaire..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all resize-none text-black"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>
                Annuler
              </Button>
              <Button
                className="flex-1 bg-[#1a472a] hover:bg-[#2d6a4f] text-white gap-2"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {editTarget ? "Mettre à jour" : "Créer le type"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ──────────────────────────────────────────────────── */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setDeleteModal(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Supprimer ce type ?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Le type <strong className="text-gray-800">"{deleteModal.name}"</strong> sera supprimé.
              Les partenaires déjà associés ne seront pas supprimés, mais leur catégorie sera mise à <strong>vide</strong>.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteModal(null)}>Annuler</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>
                Oui, supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
