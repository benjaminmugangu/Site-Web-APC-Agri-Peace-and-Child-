"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Loader2, CheckCircle2, Upload, X, AlertCircle } from "lucide-react"

export function CareerApplicationForm() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [cv, setCv] = useState<File | null>(null)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    type: "job",
    motivation: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = "Requis"
    if (!formData.lastName.trim()) newErrors.lastName = "Requis"
    if (!formData.email.trim()) newErrors.email = "Requis"
    if (!cv) newErrors.cv = "CV obligatoire (PDF, DOCX)"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setStatus(null)

    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value)
      })
      if (cv) data.append("cv", cv)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/careers/apply`, {
        method: "POST",
        body: data,
      })

      if (!response.ok) throw new Error("Erreur serveur")

      setStatus({ 
        type: 'success', 
        message: "Votre candidature a été transmise ! Notre équipe RH l'étudiera avec attention." 
      })
      setFormData({ firstName: "", lastName: "", email: "", phone: "", type: "job", motivation: "" })
      setCv(null)
    } catch (err) {
      setStatus({ type: 'error', message: "Une erreur est survenue. Veuillez réessayer." })
    } finally {
      setLoading(false)
    }
  }

  if (status?.type === 'success') {
    return (
      <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Candidature Envoyée</h3>
        <p className="text-gray-500 mb-8">{status.message}</p>
        <Button onClick={() => setStatus(null)} variant="outline" className="rounded-xl">
          Envoyer une autre candidature
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {status?.type === 'error' && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
          <AlertCircle size={18} /> {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Prénom *</label>
          <input 
            type="text" 
            required
            value={formData.firstName}
            onChange={e => setFormData({...formData, firstName: e.target.value})}
            className="w-full h-14 px-6 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all font-medium text-gray-900" 
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nom de famille *</label>
          <input 
            type="text" 
            required
            value={formData.lastName}
            onChange={e => setFormData({...formData, lastName: e.target.value})}
            className="w-full h-14 px-6 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all font-medium text-gray-900" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email professionnel *</label>
          <input 
            type="email" 
            required
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full h-14 px-6 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all font-medium text-gray-900" 
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Type d&apos;engagement</label>
          <select 
            value={formData.type}
            onChange={e => setFormData({...formData, type: e.target.value})}
            className="w-full h-14 px-6 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all font-medium text-gray-900"
          >
            <option value="volunteer">Bénévolat</option>
            <option value="internship">Stage</option>
            <option value="job">Emploi</option>
            <option value="consultant">Expertise Conseil</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Curriculum Vitae (PDF/DOCX) *</label>
        <div className="relative">
          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${cv ? 'border-apc-green bg-green-50' : 'border-gray-100 bg-gray-50 hover:border-apc-green/50 hover:bg-white'}`}>
            {cv ? (
              <div className="flex items-center gap-3 text-green-700 font-bold px-6">
                <CheckCircle2 size={24} />
                <span className="truncate max-w-[200px]">{cv.name}</span>
                <button type="button" onClick={(e) => { e.preventDefault(); setCv(null); }} className="p-1 hover:bg-green-100 rounded-lg"><X size={16}/></button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <Upload size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">Choisir un fichier</span>
              </div>
            )}
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => setCv(e.target.files?.[0] || null)} />
          </label>
          {errors.cv && <p className="text-[10px] text-red-500 font-bold mt-2 uppercase tracking-widest">{errors.cv}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Votre motivation</label>
        <textarea 
          rows={5} 
          value={formData.motivation}
          onChange={e => setFormData({...formData, motivation: e.target.value})}
          className="w-full p-6 rounded-[2rem] border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all resize-none font-medium text-gray-900"
          placeholder="Pourquoi souhaitez-vous nous rejoindre ?"
        ></textarea>
      </div>

      <Button type="submit" disabled={loading} className="w-full h-16 rounded-[1.5rem] bg-apc-green hover:bg-apc-green/90 text-white font-black uppercase tracking-widest shadow-xl shadow-apc-green/20 hover:scale-[1.01] transition-all">
        {loading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            Transmission en cours...
          </div>
        ) : (
          <div className="flex items-center gap-3">
            Soumettre ma candidature <Send className="w-5 h-5" />
          </div>
        )}
      </Button>
    </form>
  )
}
