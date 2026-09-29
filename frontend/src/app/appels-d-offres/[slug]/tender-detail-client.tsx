"use client"

import { useState } from "react"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { MarkdownContent } from "@/components/ui/markdown-content"
import HTMLContent from "@/components/ui/html-content"
import { FadeIn } from "@/components/ui/fade-in"
import SocialShare from "@/components/ui/social-share"
import { Tender } from "@/types"
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Download,
  Upload,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

type FormState = {
  nomEntreprise: string
  nomResponsable: string
  adresse: string
  email: string
  numero: string
  offreTechnique: File | null
  offreFinanciere: File | null
  documentAdministratif: File | null
}

const initialState: FormState = {
  nomEntreprise: "",
  nomResponsable: "",
  adresse: "",
  email: "",
  numero: "",
  offreTechnique: null,
  offreFinanciere: null,
  documentAdministratif: null,
}

function FileUploadField({
  id,
  label,
  file,
  onChange,
}: {
  id: string
  label: string
  file: File | null
  onChange: (f: File | null) => void
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">{label}</label>
      <label
        htmlFor={id}
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
          file
            ? "border-apc-green bg-apc-green/5"
            : "border-gray-200 bg-gray-50 hover:border-apc-blue hover:bg-apc-blue/5"
        }`}
      >
        {file ? (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <CheckCircle2 className="w-6 h-6 text-apc-green" />
            <span className="text-xs font-bold text-apc-green truncate max-w-full">{file.name}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <Upload className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Choisir un fichier</span>
          </div>
        )}
        <input
          id={id}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  )
}

interface TenderDetailClientProps {
  tender: Tender
}

export default function TenderDetailClient({ tender }: TenderDetailClientProps) {
  const [form, setForm] = useState<FormState>(initialState)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  const handleSet = (field: keyof FormState, value: string | File | null) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const newErrors: Partial<Record<keyof FormState, string>> = {}
    if (!form.nomEntreprise.trim()) newErrors.nomEntreprise = "Requis"
    if (!form.nomResponsable.trim()) newErrors.nomResponsable = "Requis"
    if (!form.email.trim()) newErrors.email = "Requis"
    if (!form.offreTechnique) newErrors.offreTechnique = "Requis"
    if (!form.offreFinanciere) newErrors.offreFinanciere = "Requis"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    
    try {
      const formData = new FormData();
      formData.append("companyName", form.nomEntreprise);
      formData.append("contactName", form.nomResponsable);
      formData.append("email", form.email);
      formData.append("phone", form.numero);
      formData.append("address", form.adresse);
      formData.append("tenderId", tender.id);
      
      if (form.offreTechnique) formData.append("offreTechnique", form.offreTechnique);
      if (form.offreFinanciere) formData.append("offreFinanciere", form.offreFinanciere);
      if (form.documentAdministratif) formData.append("documentAdministratif", form.documentAdministratif);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenders/submit`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors de la soumission");
      
      setSubmitted(true);
      toast.success("Offre soumise avec succès!");
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Une erreur est survenue lors de l'envoi de votre offre. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        title="Appels d'Offres"
        subtitle="Agri-Peace and Child publie régulièrement des opportunités pour des fournitures et travaux dans le cadre de ses projets humanitaires."
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Appels d'Offres", href: "/appels-d-offres" },
          { label: tender.title }
        ]}
        tag="Procurement"
      />

      <section className="py-24 bg-apc-bgLight">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <button 
                onClick={() => window.history.back()}
                className="flex items-center gap-3 text-gray-400 hover:text-apc-green transition-all font-black uppercase tracking-widest text-[10px] mb-12"
              >
                <ArrowLeft className="w-4 h-4" /> Retour aux opportunités
              </button>

              <div className="bg-white rounded-[3rem] border border-border/40 shadow-2xl overflow-hidden mb-12">
                {tender.imageUrl && (
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={tender.imageUrl} 
                      alt={tender.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}

                <div className={`bg-apc-green p-12 text-white relative overflow-hidden ${!tender.imageUrl ? 'rounded-t-[3rem]' : ''}`}>
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px]" />
                  <div className="relative z-10">
                    <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-none">{tender.title}</h2>
                    <div className="flex flex-wrap items-center gap-6 opacity-60 text-[10px] font-black uppercase tracking-widest">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" /> {tender.reference}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Publié le {new Date(tender.createdAt || new Date()).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="mt-6">
                      <SocialShare 
                        url={currentUrl}
                        title={tender.title}
                        description={tender.metaDescription || tender.description}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-12">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Description du marché</h3>
                  {tender.content && tender.content.includes('<') ? (
                    <HTMLContent
                      content={tender.content}
                      className="mb-12"
                    />
                  ) : tender.description && tender.description.includes('<') ? (
                    <HTMLContent
                      content={tender.description}
                      className="mb-12"
                    />
                  ) : (
                    <MarkdownContent
                      content={tender.content || tender.description}
                      className="mb-12"
                    />
                  )}

                  {tender.documents && tender.documents.length > 0 ? (
                    <>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Documents à télécharger</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                        {tender.documents.map((doc: { label: string; url: string }, idx: number) => (
                          <a key={`${tender.id}-doc-${idx}`} href={doc.url} className="flex items-center justify-between p-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] hover:bg-white hover:border-apc-green transition-all group shadow-sm">
                            <span className="text-xs font-bold text-gray-900">{doc.label}</span>
                            <Download className="w-5 h-5 text-apc-green group-hover:scale-110 transition-transform" />
                          </a>
                        ))}
                      </div>
                    </>
                  ) : tender.fileUrl && (
                    <>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Documents à télécharger</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                        <a href={tender.fileUrl} className="flex items-center justify-between p-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] hover:bg-white hover:border-apc-green transition-all group shadow-sm">
                          <span className="text-xs font-bold text-gray-900">Document d&apos;Appel d&apos;Offres (DAO)</span>
                          <Download className="w-5 h-5 text-apc-green group-hover:scale-110 transition-transform" />
                        </a>
                      </div>
                    </>
                  )}

                  <div className="bg-red-50 rounded-[2rem] p-8 border border-red-100 flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Date limite de soumission</p>
                      <p className="text-xl font-black text-red-700 tracking-tight">
                        {new Date(tender.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {submitted ? (
                <div className="text-center p-16 bg-white rounded-[3rem] border border-apc-green/20 shadow-2xl">
                  <div className="w-20 h-20 rounded-[2rem] bg-apc-green/10 flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-10 h-10 text-apc-green" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Offre déposée avec succès !</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed font-medium">
                    Votre dossier complet a bien été transmis à la cellule de passation des marchés de APC. 
                    Vous recevrez un accusé de réception par email sous peu.
                  </p>
                  <Button onClick={() => window.history.back()} className="h-14 px-10 rounded-2xl bg-[#1a472a] font-black uppercase tracking-widest text-[11px]">
                    Revenir aux offres
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-[3rem] border border-border/40 shadow-2xl p-10 md:p-16">
                  <div className="mb-12">
                    <h3 className="text-3xl font-black text-gray-900 mb-3 uppercase tracking-tighter leading-none">Soumission en ligne</h3>
                    <p className="text-gray-500 font-medium">Veuillez renseigner les informations de votre entreprise et joindre les documents requis.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label htmlFor="nomEntreprise" className="text-[10px] font-black uppercase tracking-widest text-gray-400 cursor-pointer">Raison Sociale *</label>
                        <input 
                          id="nomEntreprise"
                          type="text" 
                          className="w-full h-14 px-6 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all font-medium"
                          placeholder="Nom complet de l'entreprise"
                          required
                          value={form.nomEntreprise}
                          onChange={(e) => handleSet("nomEntreprise", e.target.value)}
                        />
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="nomResponsable" className="text-[10px] font-black uppercase tracking-widest text-gray-400 cursor-pointer">Responsable Technique *</label>
                        <input 
                          id="nomResponsable"
                          type="text" 
                          className="w-full h-14 px-6 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all font-medium"
                          placeholder="Prénom & Nom"
                          required
                          value={form.nomResponsable}
                          onChange={(e) => handleSet("nomResponsable", e.target.value)}
                        />
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-gray-400 cursor-pointer">E-mail Officiel *</label>
                        <input 
                          id="email"
                          type="email" 
                          className="w-full h-14 px-6 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all font-medium"
                          placeholder="admin@votre-entreprise.cd"
                          required
                          value={form.email}
                          onChange={(e) => handleSet("email", e.target.value)}
                        />
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="numero" className="text-[10px] font-black uppercase tracking-widest text-gray-400 cursor-pointer">Téléphone de contact *</label>
                        <input 
                          id="numero"
                          type="tel" 
                          className="w-full h-14 px-6 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all font-medium"
                          placeholder="+243 XXX XXX XXX"
                          required
                          value={form.numero}
                          onChange={(e) => handleSet("numero", e.target.value)}
                        />
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <label htmlFor="adresse" className="text-[10px] font-black uppercase tracking-widest text-gray-400 cursor-pointer">Adresse physique</label>
                        <input 
                          id="adresse"
                          type="text" 
                          className="w-full h-14 px-6 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 transition-all font-medium"
                          placeholder="Adresse complète de l'entreprise"
                          value={form.adresse}
                          onChange={(e) => handleSet("adresse", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Documents requis</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FileUploadField
                          id="offreTechnique"
                          label="Offre Technique *"
                          file={form.offreTechnique}
                          onChange={(f) => handleSet("offreTechnique", f)}
                        />
                        <FileUploadField
                          id="offreFinanciere"
                          label="Offre Financière *"
                          file={form.offreFinanciere}
                          onChange={(f) => handleSet("offreFinanciere", f)}
                        />
                        <FileUploadField
                          id="documentAdministratif"
                          label="Document Administratif"
                          file={form.documentAdministratif}
                          onChange={(f) => handleSet("documentAdministratif", f)}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 gap-3 rounded-2xl bg-apc-green hover:bg-apc-green/90 font-black uppercase tracking-widest text-[11px] shadow-xl shadow-apc-green/20"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        "Soumettre l'offre"
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  )
}
