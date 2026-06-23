"use client"

import React, { useState, useEffect } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Link as LinkIcon, 
  ArrowLeft, 
  Save,
  Search,
  Loader2,
  Globe,
  Phone,
  Mail,
  DollarSign,
  Users,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { listPartners, createPartner, updatePartner, deletePartner, getPartner } from "@/lib/api/partners"
import { toast } from "sonner"
import { partnerCategoriesApi } from "@/lib/api/partner-categories"
import { type Partner, type PartnerCategory } from "@/types"

const emptyForm = {
  name: "",
  categoryId: "",
  logoUrl: "",
  websiteUrl: "",
  description: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  totalFunding: 0,
  isActive: true,
}

export default function AdminPartenairesPage() {
  const [partenaires, setPartenaires] = useState<Partner[]>([])
  const [categories, setCategories] = useState<PartnerCategory[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [formData, setFormData] = useState(emptyForm)

  async function load() {
    setFetching(true)
    setError(null)
    try {
      const [parts, cats] = await Promise.all([
        listPartners(),
        partnerCategoriesApi.getAll()
      ])
      setPartenaires(Array.isArray(parts) ? parts : [])
      setCategories(cats)
    } catch (err: any) {
      setError("Impossible de charger la liste des partenaires. Veuillez réessayer.")
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleAdd = () => {
    setEditingPartner(null)
    setFormData(emptyForm)
    setShowForm(true)
  }

  const handleEdit = async (id: string) => {
    setLoading(true)
    try {
      const partner = await getPartner(id)
      if (!partner) throw new Error()
      setEditingPartner(partner)
      setFormData({
        name: partner.name,
        categoryId: partner.categoryId || "",
        logoUrl: partner.logoUrl || "",
        websiteUrl: partner.websiteUrl || "",
        description: partner.description || "",
        contactName: partner.contactName || "",
        contactEmail: partner.contactEmail || "",
        contactPhone: partner.contactPhone || "",
        totalFunding: partner.totalFunding || 0,
        isActive: partner.isActive,
      })
      setShowForm(true)
    } catch {
      toast.error("Erreur lors du chargement du partenaire")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) { toast.error("Le nom est requis"); return }
    setLoading(true)
    try {
      const payload = {
        ...formData,
        totalFunding: Number(formData.totalFunding) || 0,
        websiteUrl: formData.websiteUrl || undefined,
      }
      if (editingPartner) {
        await updatePartner(editingPartner.id, payload)
        toast.success("Partenaire mis à jour avec succès")
      } else {
        await createPartner(payload)
        toast.success("Partenaire ajouté avec succès")
      }
      setShowForm(false)
      load()
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'enregistrement")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer définitivement "${name}" ?`)) return
    try {
      await deletePartner(id)
      toast.success("Partenaire supprimé")
      setPartenaires(prev => prev.filter(p => p.id !== id))
    } catch {
      toast.error("Erreur lors de la suppression")
    }
  }

  const filtered = partenaires.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || "").toLowerCase().includes(search.toLowerCase())
  )

  // ── Error State ──────────────────────────────────────────────────────────
  if (!fetching && error && !showForm) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-gray-400">
        <AlertCircle size={40} className="text-red-400" />
        <p className="font-medium text-red-600">{error}</p>
        <Button onClick={load} variant="outline" className="gap-2">Réessayer</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {showForm ? (editingPartner ? "Modifier le Partenaire" : "Nouveau Partenaire") : "Gestion des Partenaires"}
          </h1>
          <p className="text-gray-500 text-sm">
            {showForm
              ? "Complétez les informations de l'organisation partenaire."
              : "Gérez les organisations partenaires et bailleurs de fonds de l'APC."}
          </p>
        </div>
        {!showForm ? (
          <Button onClick={handleAdd} className="gap-2 bg-apc-green hover:bg-emerald-700 text-white font-bold">
            <Plus size={18} /> Ajouter un Partenaire
          </Button>
        ) : (
          <Button onClick={() => { setShowForm(false); setEditingPartner(null) }} variant="outline" className="gap-2">
            <ArrowLeft size={18} /> Retour à la liste
          </Button>
        )}
      </div>

      {!showForm ? (
        <>
          {/* Barre de recherche */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher un partenaire..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 text-sm"
              />
            </div>
          </div>

          {/* Table des partenaires */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {fetching ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <Loader2 className="animate-spin mb-4 text-apc-green" size={36} />
                <p className="text-sm">Chargement des partenaires...</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Logo</th>
                    <th className="px-6 py-4">Partenaire</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Financement (USD)</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-gray-400">
                        <Users size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="font-medium">{search ? "Aucun résultat trouvé" : "Aucun partenaire enregistré"}</p>
                        {!search && <p className="text-xs mt-1">Commencez par ajouter votre premier partenaire.</p>}
                      </td>
                    </tr>
                  ) : filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                      {/* Logo */}
                      <td className="px-6 py-4">
                        <div className="w-16 h-10 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center p-1 overflow-hidden">
                          {p.logoUrl ? (
                            <img src={p.logoUrl} alt={p.name} className="max-w-full max-h-full object-contain" />
                          ) : (
                            <Globe size={18} className="text-gray-300" />
                          )}
                        </div>
                      </td>
                      {/* Nom */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{p.name}</div>
                        {p.websiteUrl && (
                          <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-apc-blue hover:underline flex items-center gap-1 mt-0.5">
                            <LinkIcon size={10} /> {p.websiteUrl.replace(/^https?:\/\//, "").split("/")[0]}
                          </a>
                        )}
                      </td>
                      {/* Type */}
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                          {p.category?.name || "Non catégorisé"}
                        </span>
                      </td>
                      {/* Contact */}
                      <td className="px-6 py-4 text-sm">
                        {p.contactName ? (
                          <div>
                            <div className="font-medium text-gray-800">{p.contactName}</div>
                            {p.contactEmail && <div className="text-xs text-gray-400">{p.contactEmail}</div>}
                          </div>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      {/* Financement */}
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                        {p.totalFunding ? `$${Number(p.totalFunding).toLocaleString('fr-FR')}` : <span className="text-gray-300">—</span>}
                      </td>
                      {/* Statut */}
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {p.isActive ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => handleEdit(p.id)}
                            className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50"
                            title="Modifier"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => handleDelete(p.id, p.name)}
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        /* ── FORMULAIRE PARTENAIRE ── */
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">

              {/* Nom */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nom de l&apos;Organisation *</label>
                <input
                  type="text" required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green font-semibold"
                  placeholder="Ex: UNICEF, PAM, Caritas..."
                />
              </div>

              {/* Type + Statut */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Type de Partenariat *</label>
                  <select
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 bg-white text-sm font-medium"
                    required
                  >
                    <option value="" disabled>Sélectionner un type...</option>
                    {categories.filter(c => c.isActive).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Financement Total (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number" min={0}
                      value={formData.totalFunding}
                      onChange={e => setFormData({ ...formData, totalFunding: Number(e.target.value) })}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Site web */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Site Web Officiel</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="url"
                    value={formData.websiteUrl}
                    onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 text-sm"
                    placeholder="https://www.exemple.org"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description du Partenariat</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 text-sm resize-none"
                  placeholder="Rôle de ce partenaire dans les activités de l'APC..."
                />
              </div>

              {/* Contact */}
              <div className="pt-4 border-t border-gray-50 space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Point Focal / Contact</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400">Nom complet</label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 text-sm"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 text-sm"
                        placeholder="contact@org.org"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                      <input
                        type="tel"
                        value={formData.contactPhone}
                        onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 text-sm"
                        placeholder="+243 812 ..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Logo Uploader */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <ImageUploader
                value={formData.logoUrl}
                onChange={url => setFormData({ ...formData, logoUrl: url })}
                label="Logo de l'Organisation"
              />
            </div>

            {/* Statut */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Visibilité</p>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-slate-100/50 transition-colors">
                <div>
                  <span className="text-sm font-bold text-gray-700 block">Partenaire Actif</span>
                  <span className="text-[10px] text-gray-400">Visible sur la page publique des partenaires</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-apc-green"
                />
              </label>
            </div>

            {/* Boutons */}
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-apc-green hover:bg-emerald-700 text-white gap-2 font-bold"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {editingPartner ? "Mettre à jour" : "Enregistrer le Partenaire"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditingPartner(null) }} className="w-full">
                Annuler
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
