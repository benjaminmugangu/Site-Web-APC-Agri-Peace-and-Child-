"use client"

import React, { useState } from "react"
import { 
  Globe, 
  Save,
  Mail,
  MapPin,
  Phone,
  Camera,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { apc } from "@/lib/data"

export default function AdminParametres() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  
  // Logo Preview State
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
    
    // Simuler un enregistrement
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStatus({ type: 'success', message: "Paramètres mis à jour avec succès !" })
    } catch (err) {
      setStatus({ type: 'error', message: "Erreur lors de la sauvegarde." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres Généraux</h1>
          <p className="text-gray-500 text-sm">Configurez l&apos;identité visuelle et les informations de contact d&apos;Agri-Peace and Child.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="gap-2 bg-apc-green hover:bg-green-700 min-w-[160px]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><Save size={18} /> Enregistrer</>
          )}
        </Button>
      </div>

      {status && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{status.message}</span>
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
                  <div className="text-center p-4">
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

        {/* Organisation */}
        <section className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
            <Globe size={20} className="text-apc-green" /> Identité de l&apos;Organisation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nom complet de l&apos;ONG</label>
              <input type="text" defaultValue={apc.name} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Slogan / Vision</label>
              <input type="text" defaultValue={apc.slogan} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all" />
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
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email de Contact principal</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" defaultValue={apc.email} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apc-blue/20" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Téléphone de Contact</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" defaultValue={apc.phone} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apc-blue/20" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Adresse du Siège Social (Goma)</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
              <textarea defaultValue={apc.hq} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl h-24 focus:outline-none focus:ring-2 focus:ring-apc-green/20" />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
            Réseaux Sociaux officiels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">f</div>
              <input type="text" defaultValue={apc.socials.facebook} placeholder="URL Facebook" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 focus:outline-none" />
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white font-bold text-xs shrink-0">X</div>
              <input type="text" defaultValue={apc.socials.twitter} placeholder="URL Twitter (X)" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gray-100 focus:outline-none" />
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold shrink-0 italic">ig</div>
              <input type="text" defaultValue={apc.socials.instagram} placeholder="URL Instagram" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-100 focus:outline-none" />
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white font-bold shrink-0 text-xs">in</div>
              <input type="text" defaultValue={apc.socials.linkedin} placeholder="URL LinkedIn" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none" />
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
