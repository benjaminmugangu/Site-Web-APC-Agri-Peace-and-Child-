"use client"

import React, { useState } from "react"
import { Plus, Edit, Trash2, ArrowLeft, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockDomaines } from "@/lib/data/mock-domaines"

export default function AdminServicesPage() {
  const [services, setServices] = useState(mockDomaines)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)

  const handleAdd = () => {
    setEditingService(null)
    setShowForm(true)
  }

  const handleEdit = (service: any) => {
    setEditingService(service)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingService(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {showForm ? (editingService ? "Modifier le Service" : "Nouveau Service") : "Gestion des Services"}
          </h1>
          <p className="text-gray-500 text-sm">
            {showForm 
              ? "Remplissez les informations ci-dessous pour enregistrer le service." 
              : "Configurez les domaines d'intervention d'Agri-Peace and Child."}
          </p>
        </div>
        {!showForm && (
          <Button onClick={handleAdd} className="gap-2 bg-apc-green hover:bg-green-700">
            <Plus size={18} /> Ajouter un Service
          </Button>
        )}
        {showForm && (
          <Button onClick={handleCancel} variant="outline" className="gap-2">
            <ArrowLeft size={18} /> Retour à la liste
          </Button>
        )}
      </div>

      {!showForm ? (
        /* TABLEAU DE LISTE */
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
                    {service.title} (EN)
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(service)}
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
        /* FORMULAIRE D'EDITION / AJOUT */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Colonne Gauche (Français) */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-apc-green font-bold border-b border-gray-100 pb-2 text-lg">
                  <span className="px-2 py-0.5 rounded bg-apc-green/10 text-xs uppercase">FR</span> Langue Française
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Titre du service (FR)</label>
                    <input 
                      type="text" 
                      defaultValue={editingService?.title || ""}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all" 
                      placeholder="Ex: Sécurité Alimentaire" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Description détaillée (FR)</label>
                    <textarea 
                      defaultValue={editingService?.description || ""}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all h-32" 
                      placeholder="Décrivez le domaine d'intervention..."
                    />
                  </div>
                </div>
              </div>

              {/* Colonne Droite (Anglais) */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-apc-blue font-bold border-b border-gray-100 pb-2 text-lg">
                  <span className="px-2 py-0.5 rounded bg-apc-blue/10 text-xs uppercase">EN</span> Langue Anglaise
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Service Title (EN)</label>
                    <input 
                      type="text" 
                      defaultValue={editingService?.title ? editingService.title + " (EN)" : ""}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 focus:border-apc-blue transition-all" 
                      placeholder="Ex: Food Security" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Detailed Description (EN)</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 focus:border-apc-blue transition-all h-32" 
                      placeholder="Describe the area of intervention..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration Icone */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Identité Visuelle</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400">Classe de l&apos;icône (Lucide ou FontAwesome)</label>
                  <input 
                    type="text" 
                    defaultValue="fas fa-hand-holding-heart"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none font-mono text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400">Couleur d&apos;accentuation</label>
                  <div className="flex gap-3">
                    {["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-rose-500"].map((color) => (
                      <button key={color} className={`w-8 h-8 rounded-full ${color} ring-offset-2 hover:ring-2 ring-gray-300 transition-all`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Formulaire */}
          <div className="bg-gray-50 px-8 py-6 flex justify-end gap-3 border-t border-gray-100">
            <Button variant="ghost" onClick={handleCancel} className="text-gray-500">Annuler</Button>
            <Button className="bg-apc-green hover:bg-green-700 gap-2 px-8">
              <Save size={18} /> {editingService ? "Mettre à jour" : "Enregistrer le Service"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
