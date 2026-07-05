"use client"

import React, { useState, useEffect } from "react"
import {
  Plus, Edit, Trash2, Save, Loader2, AlertCircle,
  CheckCircle2, X, ToggleLeft, ToggleRight, FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  listAllCareerTypes, createCareerType, updateCareerType,
  deleteCareerType, toggleCareerType, type CareerType
} from "@/lib/api/career-types"
import { useRole } from "@/hooks/useRole"
import { toast } from "sonner"

export default function AdminCareerTypesPage() {
  const { canWrite } = useRole()
  const canEdit = canWrite('rh')

  const [types, setTypes] = useState<CareerType[]>([])
  const [fetching, setFetching] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<CareerType | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const emptyForm = { name: "", nameEn: "", order: 0, isActive: true }
  const [formData, setFormData] = useState(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  async function load() {
    setFetching(true)
    try {
      const data = await listAllCareerTypes()
      setTypes(data || [])
    } catch {
      toast.error("Erreur de chargement des types de contrats")
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setFormData(emptyForm)
    setFormError(null)
    setShowForm(true)
  }

  const openEdit = (type: CareerType) => {
    setEditing(type)
    setFormData({
      name: type.name,
      nameEn: type.nameEn || "",
      order: type.order,
      isActive: type.isActive
    })
    setFormError(null)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditing(null)
    setFormError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setFormError("Le nom du type est requis.")
      return
    }
    setLoading(true)
    setFormError(null)
    try {
      if (editing) {
        await updateCareerType(editing.id, formData)
        toast.success("Type de contrat mis à jour !")
      } else {
        await createCareerType(formData)
        toast.success("Type de contrat créé avec succès !")
      }
      setShowForm(false)
      load()
    } catch (err: any) {
      const msg = err?.message || "Une erreur est survenue"
      setFormError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (id: string) => {
    try {
      await toggleCareerType(id)
      toast.success("Statut modifié")
      load()
    } catch {
      toast.error("Erreur lors du changement de statut")
    }
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      await deleteCareerType(id)
      toast.success("Type de contrat supprimé")
      setDeleteConfirm(null)
      load()
    } catch {
      toast.error("Erreur lors de la suppression")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">Chargement des types de contrats...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="text-emerald-600" />
            Gestion des Types de Contrats
          </h1>
          <p className="text-gray-500 text-sm">
            Définissez les types de contrats (CDI, CDD, Stage...) pour les offres d&apos;emploi.
          </p>
        </div>
        {canEdit && !showForm && (
          <Button onClick={openCreate} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-6 rounded-xl shadow-lg shadow-emerald-600/10">
            <Plus size={18} /> Nouveau Type
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-lg">
              {editing ? "Modifier le type de contrat" : "Nouveau type de contrat"}
            </h2>
            <button type="button" onClick={handleCancel} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          {formError && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-medium">
              <AlertCircle size={18} className="shrink-0" />
              {formError}
            </div>
          )}

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Nom du type (FR) *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: CDI - Temps Plein"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Nom du type (EN)</label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="Ex: Full-Time Contract"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Ordre d&apos;affichage</label>
              <input
                type="number"
                value={formData.order}
                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Statut</label>
              <div className="flex items-center gap-3 h-[50px]">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                    formData.isActive
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-gray-50 border-gray-200 text-gray-500"
                  }`}
                >
                  {formData.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  {formData.isActive ? "Actif" : "Inactif"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-5 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={handleCancel} disabled={loading}>Annuler</Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-8 font-bold"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
              {editing ? "Enregistrer les modifications" : "Créer le type de contrat"}
            </Button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {types.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
            <FileText size={48} className="text-gray-200" />
            <div className="text-center">
              <p className="font-semibold">Aucun type de contrat configuré</p>
              <p className="text-sm mt-1">Créez le premier type pour catégoriser vos offres d&apos;emploi.</p>
            </div>
            {canEdit && (
              <Button onClick={openCreate} className="mt-2 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus size={16} /> Créer le premier type
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type de contrat</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Ordre</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Statut</th>
                  {canEdit && <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {types.map(type => (
                  <tr key={type.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                          <FileText size={16} className="text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{type.name}</div>
                          {type.nameEn && <div className="text-xs text-gray-400">{type.nameEn}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-semibold text-gray-600">{type.order}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {type.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          <CheckCircle2 size={12} /> Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                          <X size={12} /> Inactif
                        </span>
                      )}
                    </td>
                    {canEdit && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => handleToggle(type.id)}
                            title={type.isActive ? "Désactiver" : "Activer"}
                            className={`h-8 w-8 p-0 ${type.isActive ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50" : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"}`}
                          >
                            {type.isActive ? <ToggleLeft size={16} /> : <ToggleRight size={16} />}
                          </Button>
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => openEdit(type)}
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit size={15} />
                          </Button>
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => setDeleteConfirm(type.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Supprimer ce type ?</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Les offres d&apos;emploi associées conserveront leur type sous forme de texte. Cette action est irréversible.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setDeleteConfirm(null)} disabled={loading}>Annuler</Button>
              <Button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white gap-2 font-bold"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
