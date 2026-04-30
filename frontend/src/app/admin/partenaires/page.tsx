"use client"

import React, { useState } from "react"
import { Plus, Edit, Trash2, Link as LinkIcon, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const mockPartenaires = [
  { id: 1, nom: "PAM", identite: "Partenaire Officiel", lien: "https://www.wfp.org", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/World_Food_Programme_Logo.svg/1200px-World_Food_Programme_Logo.svg.png" },
  { id: 2, nom: "UNICEF", identite: "Partenaire Technique", lien: "https://www.unicef.org", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/UNICEF_Logo.svg/1200px-UNICEF_Logo.svg.png" },
]

export default function AdminPartenairesPage() {
  const [partenaires, setPartenaires] = useState(mockPartenaires)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Partenaires</h1>
          <p className="text-gray-500 text-sm">Gérez les logos et les liens des organisations partenaires.</p>
        </div>
        <Button className="gap-2 bg-[#1a472a] hover:bg-[#2d6a4f]">
          <Plus size={18} /> Ajouter un Partenaire
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aperçu Logo</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Identité Partenaire</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lien Externe</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
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
          <Plus size={20} className="text-[#1a472a]" /> Ajouter un nouveau Partenaire
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nom de l&apos;Organisation</label>
            <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20" placeholder="Ex: UNICEF" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Identité / Type</label>
            <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20" placeholder="Ex: Partenaire Officiel" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Lien Externe (URL)</label>
            <input type="url" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20" placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">URL du Logo</label>
            <div className="flex gap-2">
              <input type="text" className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20" placeholder="https://..." />
              <Button variant="outline" className="gap-2">
                <ImageIcon size={16} /> Parcourir
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
          <Button variant="outline">Annuler</Button>
          <Button className="bg-[#1a472a] hover:bg-[#2d6a4f]">Ajouter le Partenaire</Button>
        </div>
      </div>
    </div>
  )
}
