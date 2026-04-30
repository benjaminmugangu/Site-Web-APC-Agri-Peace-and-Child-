"use client"

import React, { useState, Suspense } from "react"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Send, Heart, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react"
import { apc } from "@/lib/data"

// Ensure the map component does not SSR
const MapDynamic = dynamic(() => import("@/components/ui/map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-gray-100 animate-pulse flex items-center justify-center rounded-2xl">
      <span className="text-muted-foreground font-medium">Chargement de la carte...</span>
    </div>
  ),
})

// ── Sous-composant qui utilise useSearchParams (doit être dans Suspense) ──
function DonationBanner() {
  const searchParams = useSearchParams()
  const isDonation = searchParams.get("sujet") === "don"

  if (!isDonation) return null

  return (
    <div className="bg-apc-blue text-white py-6">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">Merci pour votre générosité !</h3>
            <p className="text-white/90 text-sm leading-relaxed">
              Pour effectuer un don, merci de nous contacter directement par{" "}
              <a href={`tel:${apc.phone.replace(/\s/g, '')}`} className="font-bold underline hover:no-underline">
                téléphone au {apc.phone}
              </a>{" "}
              ou par{" "}
              <a href={`mailto:${apc.email}`} className="font-bold underline hover:no-underline">
                email à {apc.email}
              </a>
              . Vous pouvez également passer directement à nos bureaux.
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
    if (!formData.firstName.trim()) newErrors.firstName = "Requis"
    if (!formData.lastName.trim()) newErrors.lastName = "Requis"
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
      // Simulation API
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStatus({ 
        type: 'success', 
        message: "Message envoyé avec succès ! Nous vous répondrons bientôt." 
      })
      setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" })
    } catch (err) {
      setStatus({ type: 'error', message: "Erreur lors de l'envoi du message." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      <PageHero
        title="Contactez-nous"
        subtitle="Vous avez une question, une proposition de partenariat ou vous souhaitez en savoir plus sur nos actions ? N'hésitez pas à nous écrire."
        breadcrumbs={[{ label: "Contact" }]}
        tag="Prendre Contact"
      />

      <Suspense fallback={null}>
        <DonationBanner />
      </Suspense>

      <section className="py-20 bg-apc-bgLight">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* ── Formulaire ── */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-6">Envoyez-nous un message</h2>
              
              {status && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
                  status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <p className="text-sm font-medium flex-1">{status.message}</p>
                  <button onClick={() => setStatus(null)} className="p-1 hover:bg-black/5 rounded-full"><X size={16} /></button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Prénom *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      placeholder="Votre prénom"
                      className={`w-full px-4 py-2.5 rounded-xl border ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-border'} bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30 transition-all text-black`}
                    />
                    {errors.firstName && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Nom *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      placeholder="Votre nom"
                      className={`w-full px-4 py-2.5 rounded-xl border ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-border'} bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30 transition-all text-black`}
                    />
                    {errors.lastName && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Adresse E-mail *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="exemple@email.com"
                    className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-300 bg-red-50' : 'border-border'} bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30 transition-all text-black`}
                  />
                  {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Sujet</label>
                  <Suspense fallback={<div className="h-10 w-full bg-gray-50 animate-pulse rounded-xl" />}>
                    <SubjectSelect 
                      value={formData.subject} 
                      onChange={(val) => setFormData({...formData, subject: val})} 
                    />
                  </Suspense>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Message *</label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="Comment pouvons-nous vous aider ?"
                    className={`w-full px-4 py-2.5 rounded-xl border ${errors.message ? 'border-red-300 bg-red-50' : 'border-border'} bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30 transition-all resize-none text-black`}
                  ></textarea>
                  {errors.message && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.message}</p>}
                </div>

                <Button type="submit" size="lg" disabled={loading} className="w-full gap-2 mt-4 bg-apc-green hover:bg-green-700">
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...</>
                  ) : (
                    <>Envoyer le message <Send className="w-4 h-4" /></>
                  )}
                </Button>
              </form>
            </div>

            {/* ── Coordonnées & Carte ── */}
            <div className="space-y-8 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-apc-green rounded-3xl p-8 text-white relative overflow-hidden h-full">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <MapPin className="w-8 h-8 text-white/80 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Notre Bureau (Siège)</h3>
                  <p className="text-white/80 leading-relaxed text-sm">
                    {apc.address.split(',').map((line, i) => (
                      <React.Fragment key={i}>{line.trim()}<br /></React.Fragment>
                    ))}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 border border-border/50 shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-apc-blue/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-apc-blue" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-1">E-mail</h4>
                      <a href={`mailto:${apc.email}`} className="text-sm text-muted-foreground hover:text-apc-blue transition-colors break-all">
                        {apc.email}
                      </a>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-border/50 shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-apc-alert/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-apc-alert" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-1">Téléphone</h4>
                      <a href={`tel:${apc.phone.replace(/\s/g, '')}`} className="text-sm text-muted-foreground hover:text-apc-alert transition-colors">
                        {apc.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte Leaflet */}
              <div className="relative rounded-3xl overflow-hidden shadow-md border border-border/50 flex-1 min-h-[400px]">
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
      className="w-full px-4 py-2.5 rounded-xl border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30 transition-all text-black"
    >
      <option value="">Demande d&apos;information générale</option>
      <option value="don">Faire un don</option>
      <option value="partenariat">Proposition de partenariat</option>
      <option value="presse">Presse &amp; Médias</option>
      <option value="autre">Autre</option>
    </select>
  )
}
