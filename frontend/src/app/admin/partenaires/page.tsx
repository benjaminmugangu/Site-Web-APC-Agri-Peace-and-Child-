"use client"

import React, { useState } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  X,
  FileText
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import { listPartners, createPartner, updatePartner, deletePartner, getPartner } from "@/lib/api/partners"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"

export default function AdminPartenairesPage() {
  const [partenaires, setPartenaires] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingPartner, setEditingPartner] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    type: "TECHNICAL",
    websiteUrl: "",
    logo: "",
    description: ""
  })

  async function load() {
    setFetching(true)
    try {
      const result = await listPartners()
      setPartenaires(Array.isArray(result) ? result : [])
    } catch (error) {
      toast.error("Erreur chargement partenaires")
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleAdd = () => {
    setEditingPartner(null)
    setFormData({ name: "", type: "TECHNICAL", websiteUrl: "", logo: "", description: "" })
    setShowForm(true)
  }

  const handleEdit = async (id: string) => {
    setLoading(true)
    try {
      const partner = await getPartner(id)
      setEditingPartner(partner)
      setFormData({
        name: partner.name,
        type: partner.type,
        websiteUrl: partner.websiteUrl || "",
        logo: partner.logo,
        description: partner.description || ""
      })
      setShowForm(true)
    } catch (error) {
      toast.error("Erreur chargement partenaire")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingPartner) {
        await updatePartner(editingPartner.id, formData)
        toast.success("Partenaire mis à jour")
      } else {
        await createPartner(formData)
        toast.success("Partenaire ajouté")
      }
      setShowForm(false)
      load()
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'enregistrement")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer ce partenaire de la liste ?")) {
      try {
        await deletePartner(id)
        toast.success("Supprimé")
        load()
      } catch (error) {
        toast.error("Erreur suppression")
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingPartner(null)
  }

  const typeLabels: Record<string, string> = {
    TECHNICAL: "Technique",
    FINANCIAL: "Financier",
    STRATEGIC: "Stratégique",
    GOVERNMENTAL: "Gouvernemental"
  }

  if (fetching) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-emerald-600" size={48} /></div>

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
              ? "Enregistrez une nouvelle organisation partenaire." 
              : "Gérez les logos et les liens des organisations partenaires."}
          </p>
        </div>
        {!showForm && (
          <Button onClick={handleAdd} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
            <Plus size={18} /> Ajouter un Partenaire
          </Button>
        )}
        {showForm && (
          <Button onClick={handleCancel} variant="outline" className="gap-2">
            <ArrowLeft size={18} /> Retour à la liste
          </Button>
        )}
      </div>

      {!showForm ? (
        /* LISTE DES PARTENAIRES */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aperçu Logo</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Identité Partenaire</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lien Externe</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {partenaires.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">Aucun partenaire enregistré</td>
                </tr>
              ) : partenaires.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-10 bg-gray-50 rounded border border-gray-100 flex items-center justify-center p-1 overflow-hidden">
                      <img src={p.logo} alt={p.name} className="max-w-full max-h-full object-contain" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-500">{typeLabels[p.type] || p.type}</div>
                  </td>
                  <td className="px-6 py-4 text-blue-600 text-sm">
                    {p.websiteUrl ? (
                      <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                        <LinkIcon size={14} /> {p.websiteUrl.replace(/^https?:\/\//, "")}
                      </a>
                    ) : "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(p.id)}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(p.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* FORMULAIRE PARTENAIRE */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nom de l&apos;Organisation *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" 
                    placeholder="Ex: UNICEF, PAM, etc." 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Type de Partenariat</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none bg-white text-sm"
                  >
                    <option value="TECHNICAL">Technique</option>
                    <option value="FINANCIAL">Financier</option>
                    <option value="STRATEGIC">Stratégique</option>
                    <option value="GOVERNMENTAL">Gouvernemental</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lien Site Web</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="url" 
                      value={formData.websiteUrl}
                      onChange={e => setFormData({...formData, websiteUrl: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" 
                      placeholder="https://www.exemple.org" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Logo de l&apos;Organisation *</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="text" 
                        required
                        value={formData.logo}
                        onChange={e => setFormData({...formData, logo: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" 
                        placeholder="URL du logo..." 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none h-24 text-sm" 
                placeholder="Brève description du partenariat..."
              />
            </div>

            {/* Aperçu Logo Direct */}
            {formData.logo && (
              <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 border border-gray-100 animate-in fade-in slide-in-from-left-4">
                <div className="w-20 h-12 bg-white rounded border border-gray-200 flex items-center justify-center p-2">
                  <img src={formData.logo} alt="Aperçu" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="text-xs text-gray-400 font-medium italic">Aperçu en direct du logo</div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="bg-gray-50 px-8 py-6 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={handleCancel} disabled={loading}>Annuler</Button>
            <Button 
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-8 shadow-lg shadow-emerald-600/20 font-bold min-w-[200px]"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <><Save size={18} /> {editingPartner ? "Mettre à jour" : "Ajouter le Partenaire"}</>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
