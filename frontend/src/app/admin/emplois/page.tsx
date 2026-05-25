"use client"

import React, { useState, useEffect } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  MapPin, 
  Briefcase, 
  ArrowLeft, 
  Save, 
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  Eye,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import { listCareers, listAdminCareers, createCareer, updateCareer, deleteCareer, getCareer } from "@/lib/api/careers"
import { toast } from "sonner"
import { format } from "date-fns"

export default function AdminEmploisPage() {
  const [emplois, setEmplois] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    type: "FULL_TIME",
    location: "Goma",
    deadline: "",
    description: "",
    content: "",
    status: "OPEN"
  })

  async function load() {
    setFetching(true)
    try {
      const result = await listAdminCareers()
      setEmplois(result || [])
    } catch (error) {
      toast.error("Erreur chargement carrières")
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleAdd = () => {
    setEditingJob(null)
    setFormData({ title: "", type: "FULL_TIME", location: "Goma", deadline: "", description: "", content: "", status: "OPEN" })
    setShowForm(true)
  }

  const handleEdit = async (id: string) => {
    setLoading(true)
    try {
      const job = await getCareer(id)
      if (!job) {
        toast.error("Offre d'emploi introuvable")
        return
      }
      setEditingJob(job)
      setFormData({
        title: job.title,
        type: job.type,
        location: job.location,
        deadline: job.deadline ? format(new Date(job.deadline), 'yyyy-MM-dd') : "",
        description: job.description || "",
        content: job.content || "",
        status: job.status
      })
      setShowForm(true)
    } catch (error) {
      toast.error("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload: any = { ...formData }
      // Clean empty strings to avoid DTO validation errors
      if (payload.content === "") payload.content = null;
      if (payload.description === "") payload.description = null;
      if (payload.deadline === "") payload.deadline = null;
      if (payload.location === "") payload.location = null;

      if (editingJob) {
        await updateCareer(editingJob.id, payload)
        toast.success("Offre mise à jour")
      } else {
        await createCareer(payload)
        toast.success("Offre publiée")
      }
      setShowForm(false)
      load()
    } catch (err: any) {
      const msg = err?.errors?.map((e: any) => e.constraints ? Object.values(e.constraints).join(', ') : e).join('\n')
      toast.error(msg || err.message || "Erreur lors de l'enregistrement")
    } finally {
      setLoading(false)
    }
  }


  const handleDelete = async (id: string) => {
    if (confirm("Supprimer cette offre d'emploi ?")) {
      try {
        await deleteCareer(id)
        toast.success("Supprimé")
        load()
      } catch (error) {
        toast.error("Erreur suppression")
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingJob(null)
  }

  const typeLabels: Record<string, string> = {
    FULL_TIME: "CDI",
    PART_TIME: "Temps Partiel",
    CONTRACT: "Contractuel",
    INTERNSHIP: "Stage",
    VOLUNTEER: "Bénévole"
  }

  if (fetching) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-emerald-600" size={48} /></div>

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {showForm ? (editingJob ? "Modifier l'Offre" : "Nouvelle Offre d'Emploi") : "Gestion des Carrières"}
          </h1>
          <p className="text-gray-500 text-sm">
            {showForm 
              ? "Détaillez le profil recherché et les conditions du poste." 
              : "Publiez et gérez les opportunités de carrière au sein d'Agri-Peace and Child."}
          </p>
        </div>
        {!showForm && (
          <Button onClick={handleAdd} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
            <Plus size={18} /> Publier une Offre
          </Button>
        )}
        {showForm && (
          <Button onClick={handleCancel} variant="outline" className="gap-2">
            <ArrowLeft size={18} /> Retour aux offres
          </Button>
        )}
      </div>

      {!showForm ? (
        /* LISTE DES OFFRES */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Poste / Intitulé</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contrat / Lieu</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Limite</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {emplois.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">Aucune offre d'emploi publiée</td>
                </tr>
              ) : emplois.map((offre) => (
                <tr key={offre.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{offre.title}</div>
                    <div className="text-[10px] text-gray-400 font-mono mt-1 uppercase tracking-tighter">STATUT: {offre.status}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="w-fit px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                        {typeLabels[offre.type] || offre.type}
                      </span>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={10} /> {offre.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-emerald-600" />
                      <span className="font-medium text-gray-700">
                        {offre.deadline ? format(new Date(offre.deadline), 'dd/MM/yyyy') : "N/A"}
                      </span>
                    </div>
                  </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href="/nous-rejoindre" target="_blank">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50" title="Voir sur le site public">
                            <Eye size={16} />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(offre.id)}
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit size={16} />
                        </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(offre.id)}
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
        /* FORMULAIRE OFFRE D'EMPLOI */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="md:col-span-2 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Intitulé du Poste *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    placeholder="Ex: Responsable des Opérations" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description Courte</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 h-24 text-sm" 
                    placeholder="Résumé de l'offre..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contenu Détaillé (Markdown)</label>
                  <textarea 
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none h-48 font-mono text-sm" 
                    placeholder="Détaillez les missions, profils et avantages..."
                  />
                </div>
              </div>

              {/* Side Info */}
              <div className="space-y-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Type de Contrat</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="FULL_TIME">CDI (Plein temps)</option>
                    <option value="PART_TIME">Temps Partiel</option>
                    <option value="CONTRACT">Contractuel / CDD</option>
                    <option value="INTERNSHIP">Stage</option>
                    <option value="VOLUNTEER">Bénévole</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lieu de travail</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date Limite de dépôt *</label>
                  <input 
                    type="date" 
                    required
                    value={formData.deadline}
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Statut</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none text-sm"
                  >
                    <option value="OPEN">OUVERT</option>
                    <option value="CLOSED">FERMÉ</option>
                    <option value="ARCHIVED">ARCHIVÉ</option>
                  </select>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <FileText size={16} />
                    <span className="text-[10px] font-bold uppercase">Prêt pour Publication</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="bg-gray-50 px-8 py-6 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={handleCancel} disabled={loading}>Annuler</Button>
            <Button 
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-8 shadow-lg shadow-emerald-600/20 font-bold min-w-[220px]"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <><Save size={18} /> {editingJob ? "Mettre à jour l'offre" : "Publier l'offre d'emploi"}</>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
