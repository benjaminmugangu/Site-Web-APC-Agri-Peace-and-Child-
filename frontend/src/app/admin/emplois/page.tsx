"use client"

import React, { useState } from "react"
import { Plus, Edit, Trash2, Search as SearchIcon, Briefcase, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

const mockEmplois = [
  { id: 1, poste: "Consultant en Stratégie Junior", type: "Stage", limite: "2026-05-05" },
  { id: 2, poste: "Développeur Fullstack React/Laravel", type: "CDI", limite: "2026-05-20" },
]

export default function AdminEmploisPage() {
  const [emplois, setEmplois] = useState(mockEmplois)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Offres d&apos;Emploi</h1>
          <p className="text-gray-500 text-sm">Publiez et gérez les opportunités de carrière et appels d&apos;offres.</p>
        </div>
        <Button className="gap-2 bg-[#1a472a] hover:bg-[#2d6a4f]">
          <Plus size={18} /> Publier une Offre
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Poste</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Limite</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {emplois.map((offre) => (
              <tr key={offre.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{offre.poste}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    offre.type === "CDI" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {offre.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {offre.limite}
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

      <div className="mt-8 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Plus size={20} className="text-[#1a472a]" /> Ajouter une nouvelle Offre
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Titre du Poste</label>
            <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20" placeholder="Ex: Responsable Logistique" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Type de Contrat</label>
            <select className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20 bg-white">
              <option>CDI</option>
              <option>CDD</option>
              <option>Stage</option>
              <option>Consultance</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date Limite</label>
            <input type="date" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Lieu</label>
            <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20" placeholder="Ex: Goma, Nord-Kivu" />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <label className="text-sm font-medium text-gray-700">Description de l&apos;offre</label>
          <textarea className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20 h-32" placeholder="Responsabilités, qualifications..."></textarea>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
          <Button variant="outline">Annuler</Button>
          <Button className="bg-[#1a472a] hover:bg-[#2d6a4f]">Publier l&apos;Offre</Button>
        </div>
      </div>
    </div>
  )
}
