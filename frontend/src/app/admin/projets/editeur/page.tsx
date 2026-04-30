"use client"

import React, { useState } from "react"
import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  Plus, 
  Info,
  CheckCircle2,
  AlertCircle,
  X
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminProjectEditor() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Protection",
    budget: "",
    showOnHome: true,
    needsDonations: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = "Le titre est requis"
    if (!formData.description.trim()) newErrors.description = "La description est requise"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (isDraft = false) => {
    if (!validate()) return

    setLoading(true)
    setStatus(null)

    try {
      // Simulation API
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStatus({ 
        type: 'success', 
        message: isDraft ? "Brouillon enregistré !" : "Projet publié avec succès sur le site !" 
      })
    } catch (err) {
      setStatus({ type: 'error', message: "Erreur lors de l'enregistrement." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link href="/admin/projets" className="flex items-center gap-2 text-gray-500 hover:text-apc-green transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Retour à la liste</span>
        </Link>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => handleSave(true)}
            disabled={loading}
          >
            Enregistrer Brouillon
          </Button>
          <Button 
            onClick={() => handleSave(false)}
            disabled={loading}
            className="gap-2 bg-apc-green hover:bg-green-700 min-w-[160px]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Save size={18} /> Publier le Projet</>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Nouveau Projet</h1>
        <p className="text-gray-500">Remplissez les informations ci-dessous pour présenter votre action sur le site.</p>
      </div>

      {status && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{status.message}</span>
          <button onClick={() => setStatus(null)} className="ml-auto"><X size={16} /></button>
        </div>
      )}

      {/* Main Form Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 text-black">
            {/* Titre */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Titre du Projet *</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Soutien à l'agriculture durable"
                className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all text-lg font-medium`}
              />
              {errors.title && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Description Détaillée *</label>
              <textarea 
                rows={8}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Décrivez l'impact, le contexte et les objectifs..."
                className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all`}
              />
              {errors.description && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.description}</p>}
            </div>

            {/* Grid for Small Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Catégorie</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all"
                >
                  <option>Protection</option>
                  <option>Agriculture</option>
                  <option>Dignité</option>
                  <option>Paix</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Budget Prévu ($)</label>
                <input 
                  type="number" 
                  value={formData.budget}
                  onChange={e => setFormData({...formData, budget: e.target.value})}
                  placeholder="5000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Media & Meta */}
        <div className="space-y-6">
          {/* Media Upload */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-black">
              <ImageIcon size={18} className="text-apc-green" /> Image de Couverture
            </h3>
            <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center p-4 hover:border-apc-green hover:bg-green-50/20 transition-all cursor-pointer group">
              <div className="p-3 rounded-full bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-apc-green" />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-600">Cliquez pour uploader</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG ou WebP (Max 5MB)</p>
            </div>
          </div>

          {/* Visibility & Settings */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-black">
            <h3 className="font-bold flex items-center gap-2">
              <Info size={18} className="text-apc-green" /> Paramètres de Publication
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium">Afficher sur l&apos;accueil</span>
                <input 
                  type="checkbox" 
                  checked={formData.showOnHome}
                  onChange={e => setFormData({...formData, showOnHome: e.target.checked})}
                  className="w-5 h-5 accent-apc-green" 
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium">Besoins de dons</span>
                <input 
                  type="checkbox" 
                  checked={formData.needsDonations}
                  onChange={e => setFormData({...formData, needsDonations: e.target.checked})}
                  className="w-5 h-5 accent-apc-green" 
                />
              </label>
            </div>
            
            <div className="pt-4 mt-4 border-t border-gray-100 italic text-xs text-gray-400 flex gap-2">
              <CheckCircle2 size={14} /> Prêt pour la publication
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
