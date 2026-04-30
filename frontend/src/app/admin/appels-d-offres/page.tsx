"use client"

import React, { useState } from "react"
import { Plus, Edit, Trash2, FileText, Download, CheckCircle2, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const mockAppels = [
  { id: 1, titre: "Fournitures agricoles 2025", ref: "AAO-N°001", status: "Ouvert", candidatures: 12 },
  { id: 2, titre: "Réhabilitation forages", ref: "AAO-N°002", status: "Ouvert", candidatures: 5 },
]

export default function AdminAppelsOffresPage() {
  const [appels] = useState(mockAppels)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Appels d&apos;Offres</h1>
          <p className="text-gray-500 text-sm">Publiez des dossiers d&apos;appels d&apos;offres et suivez les soumissions des prestataires.</p>
        </div>
        <Button className="gap-2 bg-apc-blue hover:bg-blue-700">
          <Plus size={18} /> Nouvel Appel d&apos;Offres
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Titre / Référence</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Soumissions</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {appels.map((appel) => (
              <tr key={appel.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{appel.titre}</div>
                  <div className="text-xs text-gray-400 font-mono">{appel.ref}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase">
                    {appel.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText size={14} className="text-apc-blue" />
                    <span className="font-bold">{appel.candidatures}</span> dossiers reçus
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-apc-green hover:bg-apc-green/10">
                      <Download size={14} /> Voir dossiers
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section Candidatures Récentes */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Soumissions récentes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { company: "SARL Construction XYZ", tender: "Réhabilitation forages", date: "Il y a 2h" },
            { company: "Agro-Services Goma", tender: "Fournitures agricoles 2025", date: "Il y a 5h" },
          ].map((sub, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{sub.date}</span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">{sub.company}</h4>
              <p className="text-xs text-gray-500 mb-4">Pour: {sub.tender}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-[10px] h-7 px-2 border-gray-100">Détails</Button>
                <Button size="sm" className="text-[10px] h-7 px-2 bg-apc-blue hover:bg-blue-700">Valider</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
