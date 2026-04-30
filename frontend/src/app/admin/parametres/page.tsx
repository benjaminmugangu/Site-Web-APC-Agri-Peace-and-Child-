"use client"

import React, { useState } from "react"
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
import { apc as initialApc } from "@/lib/data"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  
  // State for the organization data
  const [apc, setApc] = useState(initialApc)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setStatus(null)
    
    try {
      // Simulation API Save
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStatus({ type: 'success', message: "Paramètres généraux mis à jour avec succès !" })
    } catch (err) {
      setStatus({ type: 'error', message: "Erreur lors de la mise à jour." })
    } finally {
      setLoading(false)
    }
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
            Logo Principal du Site
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
              <div className="w-40 h-40 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-apc-green">
                {logoPreview ? (
                  <img src={logoPreview} alt="Preview" className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="text-center p-4 text-black">
                    <Camera size={32} className="mx-auto text-gray-300 mb-2" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Logo Actuel</span>
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-apc-green text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Plus size={20} />
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
              </label>
            </div>
            
            <div className="flex-1 space-y-3">
              <p className="text-sm text-gray-600 font-semibold italic">&quot;Ce logo est le visage de votre organisation sur le web.&quot;</p>
              <ul className="text-xs text-gray-400 space-y-1.5 list-disc pl-4">
                <li>Format recommandé : SVG ou PNG transparent</li>
                <li>Taille maximale : 2 Mo</li>
                <li>S&apos;affichera sur fond clair et fond sombre (header/footer)</li>
              </ul>
              {logoPreview && (
                <Button variant="ghost" size="sm" onClick={() => setLogoPreview(null)} className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 mt-2">
                  Réinitialiser
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Identity Form */}
        <section className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
            <Globe size={20} className="text-apc-green" /> Identité de l&apos;Organisation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nom de l&apos;Organisation</label>
              <input 
                type="text" 
                value={apc.name}
                onChange={e => setApc({...apc, name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all text-black" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Slogan / Vision</label>
              <input 
                type="text" 
                value={apc.slogan}
                onChange={e => setApc({...apc, slogan: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all text-black" 
              />
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
            <Mail size={20} className="text-apc-blue" /> Coordonnées de Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Principal</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  value={apc.email}
                  onChange={e => setApc({...apc, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apc-blue/20 text-black" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={apc.phone}
                  onChange={e => setApc({...apc, phone: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apc-blue/20 text-black" 
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Adresse Physique</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
              <textarea 
                rows={3}
                value={apc.address}
                onChange={e => setApc({...apc, address: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apc-green/20 text-black" 
              />
            </div>
          </div>
        </section>

        {/* Socials */}
        <section className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
            Réseaux Sociaux
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">f</div>
              <input 
                type="text" 
                value={apc.socials.facebook}
                onChange={e => setApc({...apc, socials: {...apc.socials, facebook: e.target.value}})}
                placeholder="URL Facebook" 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 focus:outline-none text-black" 
              />
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white font-bold text-xs shrink-0">X</div>
              <input 
                type="text" 
                value={apc.socials.twitter}
                onChange={e => setApc({...apc, socials: {...apc.socials, twitter: e.target.value}})}
                placeholder="URL Twitter (X)" 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gray-100 focus:outline-none text-black" 
              />
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold shrink-0 italic">ig</div>
              <input 
                type="text" 
                value={apc.socials.instagram}
                onChange={e => setApc({...apc, socials: {...apc.socials, instagram: e.target.value}})}
                placeholder="URL Instagram" 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-100 focus:outline-none text-black" 
              />
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white font-bold shrink-0 text-xs">in</div>
              <input 
                type="text" 
                value={apc.socials.linkedin}
                onChange={e => setApc({...apc, socials: {...apc.socials, linkedin: e.target.value}})}
                placeholder="URL LinkedIn" 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none text-black" 
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
