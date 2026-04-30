"use client"

import React, { useState } from "react"
import { Plus, Edit, Trash2, Mail, Phone, UserPlus, ArrowLeft, Save, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

const mockTeam = [
  { id: 1, name: "Benjamin Mugangu", role: "Directeur Exécutif", email: "benjamin@apc.org", phone: "+243 975 418 316", photo: null },
  { id: 2, name: "Marie Louise", role: "Coordination Projets", email: "marie@apc.org", phone: "+243 888 000 111", photo: null },
  { id: 3, name: "Jean Kabila", role: "Expert en Paix & Résolution", email: "jean@apc.org", phone: "+243 999 222 333", photo: null },
]

export default function AdminEquipePage() {
  const [team, setTeam] = useState(mockTeam)
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)

  const handleAdd = () => {
    setEditingMember(null)
    setShowForm(true)
  }

  const handleEdit = (member: any) => {
    setEditingMember(member)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingMember(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {showForm ? (editingMember ? "Modifier le Membre" : "Nouvel Expert") : "Gestion de l'Équipe"}
          </h1>
          <p className="text-gray-500 text-sm">
            {showForm 
              ? "Saisissez les informations professionnelles du collaborateur." 
              : "Gérez les membres de l'organisation et les experts affichés sur le site."}
          </p>
        </div>
        {!showForm && (
          <Button onClick={handleAdd} className="gap-2 bg-apc-green hover:bg-green-700 shadow-lg shadow-apc-green/20">
            <UserPlus size={18} /> Ajouter un Expert
          </Button>
        )}
        {showForm && (
          <Button onClick={handleCancel} variant="outline" className="gap-2">
            <ArrowLeft size={18} /> Retour à l&apos;annuaire
          </Button>
        )}
      </div>

      {!showForm ? (
        /* LISTE DES MEMBRES */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Membre</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {team.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-apc-green/10 flex items-center justify-center text-apc-green font-bold shrink-0 border border-apc-green/20">
                        {member.name.charAt(0)}
                      </div>
                      <div className="font-bold text-gray-900">{member.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-md inline-block font-medium">
                      {member.role}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Mail size={12} className="text-apc-blue" /> {member.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Phone size={12} className="text-apc-green" /> {member.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(member)}
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
        /* FORMULAIRE D'EDITION */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-10">
              {/* Photo Upload Simulation */}
              <div className="w-full md:w-48 space-y-4">
                <div className="aspect-square rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-2 hover:bg-gray-100 transition-colors cursor-pointer group">
                  <Camera size={32} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium px-4 text-center">Cliquez pour ajouter une photo</span>
                </div>
                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">Format: JPG, PNG (Max 2Mo)</p>
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Nom Complet</label>
                    <input 
                      type="text" 
                      defaultValue={editingMember?.name || ""}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green" 
                      placeholder="Ex: Jean Mukendi" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Poste / Fonction</label>
                    <input 
                      type="text" 
                      defaultValue={editingMember?.role || ""}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green" 
                      placeholder="Ex: Coordinateur de Terrain" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Adresse E-mail</label>
                    <input 
                      type="email" 
                      defaultValue={editingMember?.email || ""}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 focus:border-apc-blue" 
                      placeholder="jean@agripeace.org" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Téléphone (WhatsApp)</label>
                    <input 
                      type="tel" 
                      defaultValue={editingMember?.phone || ""}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 focus:border-apc-blue" 
                      placeholder="+243..." 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Courte Biographie (Optionnel)</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 h-24" 
                    placeholder="Parcours professionnel résumé..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-gray-50 px-8 py-6 flex justify-end gap-3 border-t border-gray-100">
            <Button variant="ghost" onClick={handleCancel}>Annuler</Button>
            <Button className="bg-apc-green hover:bg-green-700 gap-2 px-8">
              <Save size={18} /> {editingMember ? "Enregistrer les modifications" : "Créer le profil"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
