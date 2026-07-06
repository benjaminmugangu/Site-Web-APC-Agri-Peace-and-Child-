"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Loader2, CheckCircle2, Upload, X, AlertCircle, Briefcase } from "lucide-react"
import { type CareerType } from "@/types"

interface CareerApplicationFormProps {
  /** ID de l'offre d'emploi ciblée (candidature directe) */
  careerId?: string
  /** Titre du poste pour l'affichage */
  jobTitle?: string
  /** Callback appelé après une soumission réussie */
  onSuccess?: () => void
  /** Types de contrats dynamiques (pour candidature spontanée) */
  careerTypes?: CareerType[]
}

export function CareerApplicationForm({ careerId, jobTitle, onSuccess, careerTypes = [] }: CareerApplicationFormProps = {}) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [cv, setCv] = useState<File | null>(null)

  // Ne pré-remplir careerTypeId que s'il y a des types ET que c'est une candidature spontanée (pas une candidature directe à un poste)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    type: "",
    careerTypeId: (!careerId && careerTypes.length > 0) ? careerTypes[0].id : "",
    motivation: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = "Requis"
    if (!formData.lastName.trim()) newErrors.lastName = "Requis"
    if (!formData.email.trim()) newErrors.email = "Requis"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email invalide"
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
        // N'envoyer careerTypeId/careerId que s'ils sont non-vides (évite l'erreur @IsUUID sur chaîne vide)
        if ((key === 'careerTypeId' || key === 'careerId') && !value) return;
        data.append(key, value)
      })
      if (cv) data.append("cv", cv)
      if (careerId) data.append("careerId", careerId)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/careers/apply`, {
        method: "POST",
        body: data,
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || "Erreur serveur")
      }

      setStatus({
        type: 'success',
        message: jobTitle
          ? `Votre candidature pour le poste « ${jobTitle} » a été transmise ! Notre équipe RH l'étudiera avec attention.`
          : "Votre candidature spontanée a été transmise ! Notre équipe RH l'étudiera avec attention."
      })
      setFormData({ firstName: "", lastName: "", email: "", phone: "", type: "", careerTypeId: (!careerId && careerTypes.length > 0) ? careerTypes[0].id : "", motivation: "" })
      setCv(null)
      onSuccess?.()
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || "Une erreur est survenue. Veuillez réessayer." })
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
        <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Candidature Envoyée !</h3>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">{status.message}</p>
        <Button onClick={() => setStatus(null)} variant="outline" className="rounded-xl">
          Envoyer une autre candidature
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Poste ciblé (si candidature directe) */}
      {jobTitle && (
        <div className="flex items-center gap-3 px-5 py-3 bg-apc-green/8 border border-apc-green/20 rounded-2xl">
          <Briefcase size={16} className="text-apc-green shrink-0" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-apc-green/70">Poste visé</p>
            <p className="text-sm font-bold text-gray-900">{jobTitle}</p>
          </div>
        </div>
      )}

      {status?.type === 'error' && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
          <AlertCircle size={18} className="shrink-0" /> {status.message}
        </div>
      )}

      {/* Prénom / Nom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Prénom *</label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
            className={`w-full h-13 px-5 py-3 rounded-2xl border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all font-medium text-gray-900 text-sm ${errors.firstName ? 'border-red-300' : 'border-gray-200'}`}
            placeholder="Jean"
          />
          {errors.firstName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.firstName}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nom de famille *</label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
            className={`w-full h-13 px-5 py-3 rounded-2xl border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all font-medium text-gray-900 text-sm ${errors.lastName ? 'border-red-300' : 'border-gray-200'}`}
            placeholder="Mukendi"
          />
          {errors.lastName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.lastName}</p>}
        </div>
      </div>

      {/* Email / Téléphone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className={`w-full h-13 px-5 py-3 rounded-2xl border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all font-medium text-gray-900 text-sm ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
            placeholder="jean@exemple.com"
          />
          {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Téléphone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="w-full h-13 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all font-medium text-gray-900 text-sm"
            placeholder="+243..."
          />
        </div>
      </div>

      {/* Type d'engagement (masqué si candidature directe) */}
      {!careerId && (
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Type d&apos;engagement</label>
          <select
            value={formData.careerTypeId || formData.type}
            onChange={e => setFormData({ ...formData, careerTypeId: e.target.value, type: "" })}
            className="w-full h-13 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all font-medium text-gray-900 text-sm"
          >
            {careerTypes.length === 0 ? (
              <option value="">Sélectionnez un type</option>
            ) : (
              careerTypes.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))
            )}
            {formData.type && !formData.careerTypeId && (
              <option value={formData.type}>{formData.type}</option>
            )}
          </select>
        </div>
      )}

      {/* Upload CV */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Curriculum Vitae (PDF/DOCX) *</label>
        <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${cv ? 'border-apc-green bg-green-50' : errors.cv ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-apc-green/50 hover:bg-white'}`}>
          {cv ? (
            <div className="flex items-center gap-3 text-green-700 font-bold px-6">
              <CheckCircle2 size={22} />
              <span className="truncate max-w-[200px] text-sm">{cv.name}</span>
              <button
                type="button"
                onClick={e => { e.preventDefault(); setCv(null) }}
                className="p-1 hover:bg-green-100 rounded-lg ml-1"
                aria-label="Retirer le fichier"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Upload size={22} />
              <span className="text-[10px] font-black uppercase tracking-widest">Glisser ou choisir un fichier</span>
              <span className="text-[9px] text-gray-300">PDF, DOC, DOCX · Max 5 Mo</span>
            </div>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={e => setCv(e.target.files?.[0] || null)}
          />
        </label>
        {errors.cv && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.cv}</p>}
      </div>

      {/* Motivation */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Lettre de motivation</label>
        <textarea
          rows={4}
          value={formData.motivation}
          onChange={e => setFormData({ ...formData, motivation: e.target.value })}
          className="w-full p-5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all resize-none font-medium text-gray-900 text-sm"
          placeholder="Pourquoi souhaitez-vous nous rejoindre ? Quelles compétences apportez-vous ?"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-14 rounded-2xl bg-apc-green hover:bg-apc-green/90 text-white font-black uppercase tracking-widest shadow-lg shadow-apc-green/20 hover:scale-[1.01] transition-all"
      >
        {loading ? (
          <span className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" /> Transmission en cours...
          </span>
        ) : (
          <span className="flex items-center gap-3">
            Soumettre ma candidature <Send className="w-4 h-4" />
          </span>
        )}
      </Button>
    </form>
  )
}
