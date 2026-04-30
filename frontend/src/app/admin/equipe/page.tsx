"use client"

import React, { useState } from "react"
import { Plus, Edit, Trash2, Mail, Phone, Users, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

const mockTeam = [
  { id: 1, name: "Benjamin Mugangu", role: "Directeur Exécutif", email: "benjamin@apc.org", phone: "+243 975 418 316", photo: null },
  { id: 2, name: "Marie Louise", role: "Coordination Projets", email: "marie@apc.org", phone: "+243 888 000 111", photo: null },
  { id: 3, name: "Jean Kabila", role: "Expert en Paix & Résolution", email: "jean@apc.org", phone: "+243 999 222 333", photo: null },
]

export default function AdminEquipePage() {
  const [team, setTeam] = useState(mockTeam)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion de l&apos;Équipe (Experts)</h1>
          <p className="text-gray-500 text-sm">Gérez les membres de l&apos;organisation et les experts affichés sur le site.</p>
        </div>
        <Button className="gap-2 bg-[#1a472a] hover:bg-[#2d6a4f]">
          <UserPlus size={18} /> Ajouter un Expert
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Membre</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {team.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-apc-green/10 flex items-center justify-center text-apc-green font-bold shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="font-bold text-gray-900">{member.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700">{member.role}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Mail size={12} /> {member.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Phone size={12} /> {member.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
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

      <div className="mt-8 bg-gray-50 rounded-2xl p-8 border border-dashed border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <UserPlus size={20} className="text-[#1a472a]" /> Ajouter un nouveau Membre / Expert
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nom Complet</label>
            <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20" placeholder="Ex: Jean Mukendi" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Poste / Rôle</label>
            <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20" placeholder="Ex: Coordinateur de Terrain" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Adresse E-mail</label>
            <input type="email" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20" placeholder="jean@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Téléphone</label>
            <input type="tel" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20" placeholder="+243..." />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <label className="text-sm font-medium text-gray-700">Photo de profil (URL ou Fichier)</label>
          <div className="flex gap-2">
            <input type="text" className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20" placeholder="https://..." />
            <Button variant="outline">Parcourir</Button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
          <Button variant="outline">Annuler</Button>
          <Button className="bg-[#1a472a] hover:bg-[#2d6a4f]">Enregistrer le Membre</Button>
        </div>
      </div>
    </div>
  )
}
