"use client"

import { useState } from "react"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/fade-in"
import {
  FileText,
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
  Upload,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Download,
} from "lucide-react"

// --- Types ---
type Tender = {
  id: string
  title: string
  reference: string
  description: string
  publicationDate: string
  deadline: string
  status: "open" | "closed"
  documents?: { label: string; url: string }[]
}

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

// --- Mock Data ---
const mockTenders: Tender[] = [
  {
    id: "ao-2025-001",
    title: "Fournitures agricoles pour le Masisi",
    reference: "AAO-N°001/APC/2025",
    description: "Fourniture de semences améliorées, d'intrants agricoles et de matériel de travail destinés aux bénéficiaires du programme de sécurité alimentaire dans le territoire de Masisi, Nord-Kivu.",
    publicationDate: "1 mai 2025",
    deadline: "30 mai 2025",
    status: "open",
    documents: [{ label: "Dossier d'Appel d'Offres (DAO) complet", url: "#" }]
  },
  {
    id: "ao-2025-002",
    title: "Réhabilitation de forages d'eau potable",
    reference: "AAO-N°002/APC/2025",
    description: "Travaux de réhabilitation de 10 forages manuels et motorisés dans la zone de santé de Nyiragongo pour améliorer l'accès à l'eau potable des populations déplacées.",
    publicationDate: "10 mai 2025",
    deadline: "15 juin 2025",
    status: "open",
    documents: [{ label: "Spécifications techniques", url: "#" }]
  }
]

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

// --- Components ---
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
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <label
        htmlFor={id}
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          file
            ? "border-apc-green bg-apc-green/5"
            : "border-gray-300 bg-gray-50 hover:border-apc-blue hover:bg-apc-blue/5"
        }`}
      >
        {file ? (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <CheckCircle2 className="w-6 h-6 text-apc-green" />
            <span className="text-sm font-medium text-apc-green truncate max-w-full">{file.name}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Upload className="w-5 h-5" />
            <span className="text-xs font-medium">Choisir un fichier</span>
            <span className="text-[10px]">PDF, DOCX (Max 10Mo)</span>
          </div>
        )}
        <input
          id={id}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  )
}

export default function AppelsDOffresPage() {
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)
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
    if (!form.documentAdministratif) newErrors.documentAdministratif = "Requis"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise((res) => setTimeout(res, 2000))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        title="Appels d'Offres"
        subtitle="Agri-Peace and Child publie régulièrement des opportunités pour des fournitures et travaux dans le cadre de ses projets humanitaires."
        breadcrumbs={[{ label: "Appels d'Offres" }]}
        tag="Procurement"
      />

      <section className="py-20 bg-apc-bgLight">
        <div className="container px-4">
          {!selectedTender ? (
            /* --- LIST VIEW --- */
            <div className="max-w-5xl mx-auto">
              <FadeIn className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Offres en cours</h2>
                <p className="text-gray-600">Sélectionnez un appel d&apos;offres pour consulter les détails et soumettre votre candidature.</p>
              </FadeIn>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {mockTenders.map((tender) => (
                  <StaggerItem key={tender.id}>
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="bg-apc-blue/10 text-apc-blue text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">
                          {tender.reference}
                        </div>
                        <span className="flex items-center gap-1.5 text-xs text-apc-green font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ouvert
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-apc-green transition-colors">{tender.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">{tender.description}</p>
                      
                      <div className="space-y-3 mb-8 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-300" /> Publié le {tender.publicationDate}
                        </div>
                        <div className="flex items-center gap-2 text-red-500 font-medium">
                          <AlertCircle className="w-4 h-4" /> Date limite : {tender.deadline}
                        </div>
                      </div>

                      <Button 
                        onClick={() => setSelectedTender(tender)}
                        className="w-full gap-2 rounded-xl group-hover:bg-apc-blue transition-colors"
                      >
                        Consulter l&apos;offre <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          ) : (
            /* --- DETAIL & SUBMISSION VIEW --- */
            <div className="max-w-4xl mx-auto">
              <FadeIn>
                <button 
                  onClick={() => { setSelectedTender(null); setSubmitted(false); }}
                  className="flex items-center gap-2 text-apc-green hover:text-apc-blue transition-colors font-medium mb-8"
                >
                  <ArrowLeft className="w-4 h-4" /> Retour à la liste
                </button>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden mb-12">
                  <div className="bg-gradient-to-r from-apc-blue to-blue-700 p-8 text-white">
                    <h2 className="text-2xl font-bold mb-2">{selectedTender.title}</h2>
                    <p className="text-white/70 text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Réf: {selectedTender.reference}
                    </p>
                  </div>

                  <div className="p-8">
                    <h3 className="font-bold text-gray-900 mb-4">Description de l&apos;appel</h3>
                    <p className="text-gray-600 leading-relaxed mb-8">{selectedTender.description}</p>

                    <h3 className="font-bold text-gray-900 mb-4">Documents de référence</h3>
                    <div className="flex flex-wrap gap-4 mb-8">
                      {selectedTender.documents?.map((doc) => (
                        <a key={doc.label} href={doc.url} className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700">
                          <Download className="w-4 h-4 text-apc-green" /> {doc.label}
                        </a>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-t border-gray-50 text-sm">
                      <div>
                        <span className="text-gray-400 block mb-1">Date de publication</span>
                        <span className="font-semibold text-gray-900">{selectedTender.publicationDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-1">Date limite de soumission</span>
                        <span className="font-semibold text-red-600">{selectedTender.deadline}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {submitted ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-apc-green/20 shadow-md">
                    <div className="w-16 h-16 rounded-full bg-apc-green/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-apc-green" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Offre soumise avec succès !</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                      Nous avons bien reçu votre dossier pour l&apos;offre &quot;{selectedTender.title}&quot;. 
                      Un accusé de réception a été envoyé à votre adresse e-mail.
                    </p>
                    <Button onClick={() => setSelectedTender(null)} variant="outline" className="rounded-xl">
                      Revenir aux offres
                    </Button>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-10">
                    <div className="mb-10">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Soumettre votre offre</h3>
                      <p className="text-gray-500 text-sm">Veuillez remplir les informations de votre entreprise et joindre les trois pièces obligatoires.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Informations Entreprise */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Nom de l&apos;entreprise *</label>
                          <input 
                            type="text" 
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-apc-blue/20 transition-all ${errors.nomEntreprise ? "border-red-400 bg-red-50" : "border-gray-100 bg-gray-50"}`}
                            placeholder="Ex: SARL Construction Goma"
                            value={form.nomEntreprise}
                            onChange={(e) => handleSet("nomEntreprise", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Responsable / Contact *</label>
                          <input 
                            type="text" 
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-apc-blue/20 transition-all ${errors.nomResponsable ? "border-red-400 bg-red-50" : "border-gray-100 bg-gray-50"}`}
                            placeholder="Ex: Jean Dupont"
                            value={form.nomResponsable}
                            onChange={(e) => handleSet("nomResponsable", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">E-mail de l&apos;entreprise *</label>
                          <input 
                            type="email" 
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-apc-blue/20 transition-all ${errors.email ? "border-red-400 bg-red-50" : "border-gray-100 bg-gray-50"}`}
                            placeholder="contact@entreprise.com"
                            value={form.email}
                            onChange={(e) => handleSet("email", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Téléphone *</label>
                          <input 
                            type="tel" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-apc-blue/20"
                            placeholder="+243..."
                            value={form.numero}
                            onChange={(e) => handleSet("numero", e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Documents - Procurement Logic */}
                      <div className="pt-6 border-t border-gray-50">
                        <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-apc-blue" /> Dossier Technique & Financier
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FileUploadField 
                            id="tech" 
                            label="1. Offre Technique *" 
                            file={form.offreTechnique}
                            onChange={(f) => handleSet("offreTechnique", f)}
                          />
                          <FileUploadField 
                            id="fin" 
                            label="2. Offre Financière *" 
                            file={form.offreFinanciere}
                            onChange={(f) => handleSet("offreFinanciere", f)}
                          />
                          <FileUploadField 
                            id="admin" 
                            label="3. Documents Admin *" 
                            file={form.documentAdministratif}
                            onChange={(f) => handleSet("documentAdministratif", f)}
                          />
                        </div>
                        <p className="mt-4 text-[10px] text-gray-400 italic">
                          * Conformément aux procédures de passation de marchés de Agri-Peace and Child, ces trois pièces sont indispensables pour la recevabilité de votre offre.
                        </p>
                      </div>

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full h-14 text-lg rounded-2xl bg-apc-blue hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                        disabled={loading}
                      >
                        {loading ? "Soumission en cours..." : "Soumettre ma candidature"}
                      </Button>
                    </form>
                  </div>
                )}
              </FadeIn>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
