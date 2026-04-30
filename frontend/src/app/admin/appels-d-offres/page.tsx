"use client"

import React, { useState } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Download, 
  CheckCircle2, 
  Building2, 
  ArrowLeft, 
  Save, 
  Calendar,
  AlertCircle,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"

const initialAppels = [
  { id: 1, titre: "Fournitures agricoles 2025", ref: "AAO-N°001", status: "Ouvert", candidatures: 12 },
  { id: 2, titre: "Réhabilitation forages", ref: "AAO-N°002", status: "Ouvert", candidatures: 5 },
]

export default function AdminAppelsOffresPage() {
  const [appels, setAppels] = useState(initialAppels)
  const [showForm, setShowForm] = useState(false)
  const [editingAppel, setEditingAppel] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    titre: "",
    ref: "AAO-N°00X",
    dateLimite: "",
    description: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleAdd = () => {
    setEditingAppel(null)
    setFormData({ titre: "", ref: "AAO-N°00X", dateLimite: "", description: "" })
    setErrors({})
    setStatus(null)
    setShowForm(true)
  }

  const handleEdit = (appel: any) => {
    setEditingAppel(appel)
    setFormData({
      titre: appel.titre,
      ref: appel.ref,
      dateLimite: "", // Placeholder
      description: ""
    })
    setErrors({})
    setStatus(null)
    setShowForm(true)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.titre.trim()) newErrors.titre = "Le titre est requis"
    if (!formData.ref.trim()) newErrors.ref = "La référence est requise"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setStatus(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingAppel) {
        setAppels(prev => prev.map(a => a.id === editingAppel.id ? { ...a, ...formData } : a))
        setStatus({ type: 'success', message: "Appel d'offres mis à jour !" })
      } else {
        const newAppel = {
          id: Math.max(...appels.map(a => a.id)) + 1,
          ...formData,
          status: "Ouvert",
          candidatures: 0
        }
        setAppels(prev => [...prev, newAppel])
        setStatus({ type: 'success', message: "Nouvel appel d'offres publié !" })
      }
      
      setTimeout(() => setShowForm(false), 1500)
    } catch (err) {
      setStatus({ type: 'error', message: "Erreur lors de l'enregistrement." })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: number) => {
    if (confirm("Supprimer définitivement cet appel d'offres ?")) {
      setAppels(prev => prev.filter(a => a.id !== id))
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingAppel(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {showForm ? (editingAppel ? "Modifier l'Appel d'Offres" : "Nouvel Appel d'Offres") : "Gestion des Appels d'Offres"}
          </h1>
          <p className="text-gray-500 text-sm">
            {showForm 
              ? "Publiez les documents du dossier d'appel d'offres (DAO)." 
              : "Publiez des dossiers d'appels d'offres et suivez les soumissions des prestataires."}
          </p>
        </div>
        {!showForm && (
          <Button onClick={handleAdd} className="gap-2 bg-apc-blue hover:bg-blue-700 shadow-lg shadow-apc-blue/20">
            <Plus size={18} /> Nouvel Appel d&apos;Offres
          </Button>
        )}
        {showForm && (
          <Button onClick={handleCancel} variant="outline" className="gap-2">
            <ArrowLeft size={18} /> Retour à la liste
          </Button>
        )}
      </div>

      {!showForm ? (
        <>
          {/* LISTE DES APPELS */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Titre / Référence</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Soumissions</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appels.map((appel) => (
                  <tr key={appel.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{appel.titre}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-1 uppercase">{appel.ref}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase">
                        {appel.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <FileText size={14} className="text-apc-blue" />
                        <span className="text-gray-900 font-bold">{appel.candidatures}</span> dossiers reçus
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-apc-green hover:bg-apc-green/10 font-bold text-[11px]">
                          <Download size={14} /> VOIR DOSSIERS
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(appel)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(appel.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
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

          {/* Section Soumissions Récentes (Quick View) */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-apc-green" size={20} /> Soumissions récentes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { company: "SARL Construction XYZ", tender: "Réhabilitation forages", date: "Il y a 2h" },
                { company: "Agro-Services Goma", tender: "Fournitures agricoles 2025", date: "Il y a 5h" },
              ].map((sub, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                      <Building2 className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium px-2 py-1 bg-gray-50 rounded-lg">{sub.date}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{sub.company}</h4>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-1">Pour: {sub.tender}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-[10px] h-7 px-3 border-gray-100 font-bold">Détails</Button>
                    <Button size="sm" className="text-[10px] h-7 px-3 bg-apc-blue hover:bg-blue-700 font-bold">Valider</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* FORMULAIRE APPEL D'OFFRES */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-8 space-y-8">
            {status && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <span className="text-sm font-medium">{status.message}</span>
                <button type="button" onClick={() => setStatus(null)} className="ml-auto"><X size={16} /></button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Titre de l&apos;Appel d&apos;Offres *</label>
                  <input 
                    type="text" 
                    value={formData.titre}
                    onChange={e => setFormData({...formData, titre: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.titre ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-apc-blue/20`} 
                    placeholder="Ex: Fourniture de matériel de bureau" 
                  />
                  {errors.titre && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.titre}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Référence (AAO) *</label>
                    <input 
                      type="text" 
                      value={formData.ref}
                      onChange={e => setFormData({...formData, ref: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.ref ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-apc-blue/20 font-mono text-sm`} 
                    />
                    {errors.ref && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.ref}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date Limite</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="date" 
                        value={formData.dateLimite}
                        onChange={e => setFormData({...formData, dateLimite: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20" 
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description brève</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 h-24" 
                    placeholder="Résumé de l'appel d'offres..."
                  />
                </div>
              </div>

              <div className="space-y-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-apc-blue/10 flex items-center justify-center mx-auto">
                    <FileText size={32} className="text-apc-blue" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Dossier d&apos;Appel d&apos;Offres (DAO)</h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">Veuillez charger le fichier PDF complet contenant toutes les spécifications techniques.</p>
                  </div>
                  <Button type="button" variant="outline" className="border-apc-blue text-apc-blue hover:bg-apc-blue/5">
                    Sélectionner le PDF
                  </Button>
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
              className="bg-apc-blue hover:bg-blue-700 gap-2 px-8 shadow-lg shadow-apc-blue/20 font-bold min-w-[200px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Save size={18} /> {editingAppel ? "Mettre à jour" : "Publier l'appel d'offres"}</>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
