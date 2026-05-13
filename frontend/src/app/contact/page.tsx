"use client"

import React, { useState, Suspense } from "react"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { createMessage } from "@/lib/api/messages"
import { MapPin, Phone, Mail, Send, Heart, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react"

// Ensure the map component does not SSR
const MapDynamic = dynamic(() => import("@/components/ui/map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-gray-100 animate-pulse flex items-center justify-center rounded-2xl">
      <span className="text-muted-foreground font-medium">Chargement de la carte...</span>
    </div>
  ),
})

const apcContact = {
  address: "Q. les volcans, Av. des orchidées, Goma, Nord-Kivu, RD Congo",
  email: "contact@apc-rdc.org",
  phone: "+243 972 581 216"
}

// ── Sous-composant qui utilise useSearchParams (doit être dans Suspense) ──
function DonationBanner() {
  const searchParams = useSearchParams()
  const isDonation = searchParams.get("sujet") === "don"

  if (!isDonation) return null

  return (
    <div className="bg-[#1a472a] text-white py-10">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          <div className="w-20 h-20 rounded-[1.5rem] bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <Heart className="w-10 h-10 text-white animate-pulse" />
          </div>
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter">Merci pour votre générosité</h3>
            <p className="text-apc-bgLight/80 text-base leading-relaxed">
              Pour effectuer un don sécurisé, merci de nous contacter directement par téléphone ou email. 
              Nos équipes vous guideront pour le transfert ou le dépôt physique.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Page principale ──
export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = "Prénom requis"
    if (!formData.lastName.trim()) newErrors.lastName = "Nom requis"
    if (!formData.email.trim()) {
      newErrors.email = "Email requis"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide"
    }
    if (!formData.message.trim()) newErrors.message = "Message requis"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setStatus(null)

    try {
      await createMessage({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        subject: formData.subject || "Information Générale",
        message: formData.message,
      });
      
      setStatus({ 
        type: 'success', 
        message: "Message transmis avec succès ! Notre équipe vous répondra dans les plus brefs délais." 
      })
      setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" })
    } catch (err) {
      console.error("Submission error:", err);
      setStatus({ type: 'error', message: "Une erreur est survenue lors de l'envoi. Veuillez réessayer." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        title="Contactez-nous"
        subtitle="Vous avez une question, une proposition de partenariat ou vous souhaitez en savoir plus sur nos actions ? N'hésitez pas à nous écrire."
        breadcrumbs={[{ label: "Contact" }]}
        tag="Prendre Contact"
      />

      <Suspense fallback={null}>
        <DonationBanner />
      </Suspense>

      <section className="py-24 bg-apc-bgLight">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* ── Formulaire ── */}
            <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-border/40">
              <div className="mb-12">
                <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Envoyez un message</h2>
                <p className="text-gray-500 font-medium">Nous sommes à votre écoute pour toute demande d&apos;information.</p>
              </div>
              
              {status && (
                <div className={`mb-10 p-6 rounded-[1.5rem] flex items-start gap-4 animate-in fade-in slide-in-from-top-4 ${
                  status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100 shadow-sm' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  <div className={`p-2 rounded-xl ${status.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-bold leading-relaxed">{status.message}</p>
                  </div>
                  <button onClick={() => setStatus(null)} className="p-2 hover:bg-black/5 rounded-xl transition-colors"><X size={20} /></button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Prénom *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      placeholder="Jean"
                      className={`w-full h-14 px-6 rounded-2xl border font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all text-gray-900 ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50'}`}
                    />
                    {errors.firstName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nom *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      placeholder="Dupont"
                      className={`w-full h-14 px-6 rounded-2xl border font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all text-gray-900 ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50'}`}
                    />
                    {errors.lastName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email professionnel *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="exemple@organisation.org"
                    className={`w-full h-14 px-6 rounded-2xl border font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all text-gray-900 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50'}`}
                  />
                  {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.email}</p>}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nature de la demande</label>
                  <Suspense fallback={<div className="h-14 w-full bg-gray-50 animate-pulse rounded-2xl" />}>
                    <SubjectSelect 
                      value={formData.subject} 
                      onChange={(val) => setFormData({...formData, subject: val})} 
                    />
                  </Suspense>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Message *</label>
                  <textarea
                    rows={6}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="Comment pouvons-nous vous aider ?"
                    className={`w-full p-6 rounded-[2rem] border font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all resize-none text-gray-900 ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50'}`}
                  ></textarea>
                  {errors.message && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.message}</p>}
                </div>

                <Button type="submit" disabled={loading} className="w-full h-16 rounded-[1.5rem] bg-apc-green hover:bg-apc-green/90 text-white font-black uppercase tracking-widest shadow-xl shadow-apc-green/20 hover:scale-[1.01] transition-all">
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Transmission...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      Envoyer le message <Send className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </form>
            </div>

            {/* ── Coordonnées & Carte ── */}
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-8">
                <div className="bg-[#1a472a] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-[10rem] group-hover:scale-125 transition-transform duration-700" />
                  <MapPin className="w-10 h-10 text-apc-greenLight mb-6" />
                  <h3 className="font-black text-xl mb-4 uppercase tracking-widest">Siège Social</h3>
                  <p className="text-apc-bgLight/70 leading-relaxed text-base font-medium">
                    {apcContact.address.split(',').map((line, i) => (
                      <React.Fragment key={i}>{line.trim()}<br /></React.Fragment>
                    ))}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-[2.5rem] p-8 border border-border/40 shadow-sm flex flex-col gap-4 group">
                    <div className="w-14 h-14 rounded-2xl bg-apc-blue/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6 text-apc-blue" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">E-mail Officiel</h4>
                      <a href={`mailto:${apcContact.email}`} className="text-base font-bold text-gray-900 hover:text-apc-blue transition-colors break-all">
                        {apcContact.email}
                      </a>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-8 border border-border/40 shadow-sm flex flex-col gap-4 group">
                    <div className="w-14 h-14 rounded-2xl bg-apc-alert/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Phone className="w-6 h-6 text-apc-alert" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Permanence</h4>
                      <a href={`tel:${apcContact.phone.replace(/\s/g, '')}`} className="text-lg font-black text-gray-900 hover:text-apc-alert transition-colors">
                        {apcContact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte Leaflet */}
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-border/40 min-h-[450px]">
                <MapDynamic position={[-1.6858, 29.2312]} zoom={14} />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

// ── Sous-composant pour le champ Sujet ──
function SubjectSelect({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const searchParams = useSearchParams()
  const isDonation = searchParams.get("sujet") === "don"

  // Initialize value if empty and we have a param
  React.useEffect(() => {
    if (!value && isDonation) {
      onChange("don")
    }
  }, [isDonation, value, onChange])

  return (
    <select
      value={value || (isDonation ? "don" : "")}
      onChange={e => onChange(e.target.value)}
      className="w-full h-14 px-6 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all font-medium text-gray-900"
    >
      <option value="">Information Générale</option>
      <option value="don">Faire un don</option>
      <option value="partenariat">Partenariat</option>
      <option value="carrieres">Carrières</option>
      <option value="presse">Média & Presse</option>
      <option value="autre">Autre</option>
    </select>
  )
}

