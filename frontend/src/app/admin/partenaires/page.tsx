"use client"

import React, { useState } from "react"
import { Plus, Edit, Trash2, Link as LinkIcon, Image as ImageIcon, ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

const mockPartenaires = [
  { id: 1, nom: "PAM", identite: "Partenaire Officiel", lien: "https://www.wfp.org", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/World_Food_Programme_Logo.svg/1200px-World_Food_Programme_Logo.svg.png" },
  { id: 2, nom: "UNICEF", identite: "Partenaire Technique", lien: "https://www.unicef.org", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/UNICEF_Logo.svg/1200px-UNICEF_Logo.svg.png" },
]

export default function AdminPartenairesPage() {
  const [partenaires, setPartenaires] = useState(mockPartenaires)
  const [showForm, setShowForm] = useState(false)
  const [editingPartner, setEditingPartner] = useState<any>(null)

  const handleAdd = () => {
    setEditingPartner(null)
    setShowForm(true)
  }

  const handleEdit = (partner: any) => {
    setEditingPartner(partner)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingPartner(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {showForm ? (editingPartner ? "Modifier le Partenaire" : "Nouveau Partenaire") : "Gestion des Partenaires"}
          </h1>
          <p className="text-gray-500 text-sm">
            {showForm 
              ? "Enregistrez une nouvelle organisation partenaire." 
              : "Gérez les logos et les liens des organisations partenaires."}
          </p>
        </div>
        {!showForm && (
          <Button onClick={handleAdd} className="gap-2 bg-apc-green hover:bg-green-700">
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
              {partenaires.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-10 bg-gray-50 rounded border border-gray-100 flex items-center justify-center p-1 overflow-hidden">
                      <img src={p.logo} alt={p.nom} className="max-w-full max-h-full object-contain" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{p.nom}</div>
                    <div className="text-xs text-gray-500">{p.identite}</div>
                  </td>
                  <td className="px-6 py-4 text-blue-600 text-sm">
                    <a href={p.lien} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                      <LinkIcon size={14} /> {p.lien.replace("https://", "")}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(p)}
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
        /* FORMULAIRE PARTENAIRE */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nom de l&apos;Organisation</label>
                  <input 
                    type="text" 
                    defaultValue={editingPartner?.nom || ""}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20" 
                    placeholder="Ex: UNICEF, PAM, etc." 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Type de Partenariat</label>
                  <input 
                    type="text" 
                    defaultValue={editingPartner?.identite || ""}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20" 
                    placeholder="Ex: Partenaire Technique" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lien Site Web</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="url" 
                      defaultValue={editingPartner?.lien || ""}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20" 
                      placeholder="https://www.exemple.org" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Logo de l&apos;Organisation</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="text" 
                        defaultValue={editingPartner?.logo || ""}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20" 
                        placeholder="URL du logo..." 
                      />
                    </div>
                    <Button variant="outline" className="h-[50px] px-6 border-gray-200">Parcourir</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Aperçu Logo Direct */}
            {editingPartner?.logo && (
              <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 border border-gray-100">
                <div className="w-20 h-12 bg-white rounded border border-gray-200 flex items-center justify-center p-2">
                  <img src={editingPartner.logo} alt="Aperçu" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="text-xs text-gray-400 font-medium italic">Aperçu du logo actuel</div>
              </div>
            )}
          </div>

          {/* Footer Footer */}
          <div className="bg-gray-50 px-8 py-6 flex justify-end gap-3 border-t border-gray-100">
            <Button variant="ghost" onClick={handleCancel}>Annuler</Button>
            <Button className="bg-apc-green hover:bg-green-700 gap-2 px-8 shadow-lg shadow-apc-green/20">
              <Save size={18} /> {editingPartner ? "Mettre à jour" : "Ajouter le Partenaire"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
