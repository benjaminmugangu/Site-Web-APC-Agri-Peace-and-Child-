"use client"

import React, { useState } from "react"
import { Plus, Edit, Trash2, Calendar, MapPin, Briefcase, ArrowLeft, Save, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

const mockEmplois = [
  { id: 1, poste: "Consultant en Stratégie Junior", type: "Stage", limite: "2026-05-05", lieu: "Goma" },
  { id: 2, poste: "Développeur Fullstack React/Laravel", type: "CDI", limite: "2026-05-20", lieu: "Goma / Remote" },
]

export default function AdminEmploisPage() {
  const [emplois, setEmplois] = useState(mockEmplois)
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState<any>(null)

  const handleAdd = () => {
    setEditingJob(null)
    setShowForm(true)
  }

  const handleEdit = (job: any) => {
    setEditingJob(job)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingJob(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {showForm ? (editingJob ? "Modifier l'Offre" : "Nouvelle Offre d'Emploi") : "Gestion des Carrières"}
          </h1>
          <p className="text-gray-500 text-sm">
            {showForm 
              ? "Détaillez le profil recherché et les conditions du poste." 
              : "Publiez et gérez les opportunités de carrière au sein d'Agri-Peace and Child."}
          </p>
        </div>
        {!showForm && (
          <Button onClick={handleAdd} className="gap-2 bg-apc-green hover:bg-green-700">
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
              {emplois.map((offre) => (
                <tr key={offre.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{offre.poste}</div>
                    <div className="text-[10px] text-gray-400 font-mono mt-1 uppercase tracking-tighter">REF: {offre.id}00-2025</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`w-fit px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        offre.type === "CDI" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {offre.type}
                      </span>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={10} /> {offre.lieu}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-apc-blue" />
                      <span className="font-medium text-gray-700">{offre.limite}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(offre)}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
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
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="md:col-span-2 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Intitulé du Poste</label>
                  <input 
                    type="text" 
                    defaultValue={editingJob?.poste || ""}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green" 
                    placeholder="Ex: Responsable des Opérations" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description & Responsabilités</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 h-48" 
                    placeholder="Détaillez les missions du poste..."
                  />
                </div>
              </div>

              {/* Side Info */}
              <div className="space-y-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Type de Contrat</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-apc-blue/20">
                    <option selected={editingJob?.type === "CDI"}>CDI</option>
                    <option selected={editingJob?.type === "CDD"}>CDD</option>
                    <option selected={editingJob?.type === "Stage"}>Stage</option>
                    <option selected={editingJob?.type === "Consultance"}>Consultance</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lieu de travail</label>
                  <input 
                    type="text" 
                    defaultValue={editingJob?.lieu || "Goma"}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date Limite de dépôt</label>
                  <input 
                    type="date" 
                    defaultValue={editingJob?.limite || ""}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20" 
                  />
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-apc-green">
                    <FileText size={16} />
                    <span className="text-[10px] font-bold uppercase">Publication Immédiate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="bg-gray-50 px-8 py-6 flex justify-end gap-3 border-t border-gray-100">
            <Button variant="ghost" onClick={handleCancel}>Annuler</Button>
            <Button className="bg-apc-green hover:bg-green-700 gap-2 px-8 shadow-lg shadow-apc-green/20 font-bold">
              <Save size={18} /> {editingJob ? "Mettre à jour l'offre" : "Publier l'offre d'emploi"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
