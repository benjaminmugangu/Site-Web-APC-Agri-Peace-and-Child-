"use client"

import React, { useState } from "react"
import { Plus, Edit, Trash2, Cog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockDomaines } from "@/lib/data/mock-domaines"

export default function AdminServicesPage() {
  const [services, setServices] = useState(mockDomaines)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Services</h1>
          <p className="text-gray-500 text-sm">Configurez les domaines d&apos;intervention d&apos;Agri-Peace and Child.</p>
        </div>
        <Button className="gap-2 bg-[#1a472a] hover:bg-[#2d6a4f]">
          <Plus size={18} /> Ajouter un Service
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Icône</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Titre (FR)</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Titre (EN)</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className={`w-10 h-10 rounded-lg ${service.bgClass} flex items-center justify-center`}>
                    <service.icon size={20} className={service.accentClass} />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{service.title}</div>
                  <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">{service.description}</div>
                </td>
                <td className="px-6 py-4 text-gray-500 italic text-sm">
                  {/* Placeholder for English title */}
                  {service.title} (EN)
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
          <Plus size={20} className="text-[#1a472a]" /> Ajouter un nouveau Service
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-[#1a472a] border-b pb-2">Français</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Titre (FR)</label>
              <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20" placeholder="Ex: Études & Évaluations" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description (FR)</label>
              <textarea className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20 h-24" placeholder="Description détaillée..."></textarea>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-blue-600 border-b pb-2">Anglais</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Titre (EN)</label>
              <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20" placeholder="Ex: Studies & Evaluations" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description (EN)</label>
              <textarea className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 h-24" placeholder="Detailed description..."></textarea>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <label className="text-sm font-medium text-gray-700">Classe de l&apos;icône (Lucide ou FontAwesome)</label>
          <div className="flex gap-4">
            <input type="text" className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20 font-mono text-sm" defaultValue="fas fa-cogs" />
            <p className="text-xs text-gray-500 max-w-xs mt-2">Utilisez les classes FontAwesome 5 (ex: fas fa-handshake) ou le nom Lucide.</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
          <Button variant="outline">Annuler</Button>
          <Button className="bg-[#1a472a] hover:bg-[#2d6a4f]">Enregistrer le Service</Button>
        </div>
      </div>
    </div>
  )
}
