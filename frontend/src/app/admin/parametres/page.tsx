"use client"

import React, { useState, useEffect } from "react"
import { 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  Loader2,
  X,
  AlertCircle,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { settingsService, type SiteSettings } from "@/lib/api/settings"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  
  // State for the settings data
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setFetching(true)
    try {
      const data = await settingsService.get()
      if (data) {
        setSettings(data)
        setLogoPreview(data.hero.imageUrl)
      }
    } catch (err) {
      console.error("Failed to fetch settings", err)
    } finally {
      setFetching(false)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
        if (settings) {
          setSettings({
            ...settings,
            hero: { ...settings.hero, imageUrl: reader.result as string }
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!settings) return
    setLoading(true)
    setStatus(null)
    
    try {
      await settingsService.update(settings)
      setStatus({ type: 'success', message: "Paramètres mis à jour avec succès !" })
    } catch (err) {
      setStatus({ type: 'error', message: "Erreur lors de la mise à jour." })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-apc-green" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-xl">
        Erreur: Impossible de charger les paramètres.
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres du Site</h1>
          <p className="text-gray-500 text-sm">Gérez l&apos;identité et les coordonnées globales de l&apos;ONG.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="gap-2 bg-apc-green hover:bg-green-700 shadow-lg shadow-apc-green/20 min-w-[150px]"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</>
          ) : (
            <><Save size={18} /> Enregistrer</>
          )}
        </Button>
      </div>

      {status && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
          status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium flex-1">{status.message}</span>
          <button onClick={() => setStatus(null)} className="p-1 hover:bg-black/5 rounded-full"><X size={16} /></button>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-10">
        
        {/* Logo Section */}
        <section className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
            Image Hero / Logo Principal
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
              <div className="w-64 h-40 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-apc-green">
                {logoPreview ? (
                  <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4 text-black">
                    <Camera size={32} className="mx-auto text-gray-300 mb-2" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Image Hero</span>
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-apc-green text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Plus size={20} />
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
              </label>
            </div>
            
            <div className="flex-1 space-y-3">
              <p className="text-sm text-gray-600 font-semibold italic">&quot;Cette image apparaîtra en haut de la page d&apos;accueil.&quot;</p>
              <ul className="text-xs text-gray-400 space-y-1.5 list-disc pl-4">
                <li>Format recommandé : JPG ou WebP</li>
                <li>Taille maximale : 5 Mo</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Identity Form */}
        <section className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
            <Globe size={20} className="text-apc-green" /> Contenu de l&apos;Accueil
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Titre Hero</label>
              <input 
                type="text" 
                value={settings.hero.title}
                onChange={e => setSettings({...settings, hero: {...settings.hero, title: e.target.value}})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all text-black" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sous-titre Hero</label>
              <textarea 
                rows={3}
                value={settings.hero.subtitle}
                onChange={e => setSettings({...settings, hero: {...settings.hero, subtitle: e.target.value}})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all text-black" 
              />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
            Statistiques d&apos;Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bénéficiaires</label>
              <input 
                type="text" 
                value={settings.stats.beneficiaries}
                onChange={e => setSettings({...settings, stats: {...settings.stats, beneficiaries: e.target.value}})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Projets</label>
              <input 
                type="text" 
                value={settings.stats.projects}
                onChange={e => setSettings({...settings, stats: {...settings.stats, projects: e.target.value}})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Provinces</label>
              <input 
                type="text" 
                value={settings.stats.provinces}
                onChange={e => setSettings({...settings, stats: {...settings.stats, provinces: e.target.value}})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black" 
              />
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
            <Mail size={20} className="text-blue-600" /> Coordonnées & Réseaux
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Principal</label>
              <input 
                type="email" 
                value={settings.contact.email}
                onChange={e => setSettings({...settings, contact: {...settings.contact, email: e.target.value}})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Téléphone</label>
              <input 
                type="text" 
                value={settings.contact.phone}
                onChange={e => setSettings({...settings, contact: {...settings.contact, phone: e.target.value}})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Adresse Physique</label>
            <textarea 
              rows={2}
              value={settings.contact.address}
              onChange={e => setSettings({...settings, contact: {...settings.contact, address: e.target.value}})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <input 
              placeholder="Facebook URL"
              value={settings.contact.socials?.facebook || ""}
              onChange={e => setSettings({...settings, contact: {...settings.contact, socials: {...settings.contact.socials, facebook: e.target.value}}})}
              className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm text-black"
            />
            <input 
              placeholder="LinkedIn URL"
              value={settings.contact.socials?.linkedin || ""}
              onChange={e => setSettings({...settings, contact: {...settings.contact, socials: {...settings.contact.socials, linkedin: e.target.value}}})}
              className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm text-black"
            />
          </div>
        </section>

      </div>
    </div>
  )
}
