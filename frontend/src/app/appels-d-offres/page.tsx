"use client"

import { useState, useEffect } from "react"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/fade-in"
import { listTenders } from "@/lib/api/tenders"
import { Tender } from "@/types"
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Download,
  Upload,
  Globe,
  Loader2,
} from "lucide-react"

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

export default function AppelsDOffresPage() {
  const [tenders, setTenders] = useState<Tender[]>([])
  const [loadingTenders, setLoadingTenders] = useState(true)
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)
  const [form, setForm] = useState<FormState>(initialState)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const res = await listTenders();
        setTenders(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Failed to fetch tenders", err);
      } finally {
        setLoadingTenders(false);
      }
    };
    fetchTenders();
  }, []);

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
      formData.append("tenderId", selectedTender?.id || "");
      
      if (form.offreTechnique) formData.append("offreTechnique", form.offreTechnique);
      if (form.offreFinanciere) formData.append("offreFinanciere", form.offreFinanciere);
      if (form.documentAdministratif) formData.append("documentAdministratif", form.documentAdministratif);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenders/submit`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors de la soumission");
      
      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Une erreur est survenue lors de l'envoi de votre offre. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        title="Appels d'Offres"
        subtitle="Agri-Peace and Child publie régulièrement des opportunités pour des fournitures et travaux dans le cadre de ses projets humanitaires."
        breadcrumbs={[{ label: "Appels d'Offres" }]}
        tag="Procurement"
      />

      <section className="py-24 bg-apc-bgLight">
        <div className="container px-4">
          {!selectedTender ? (
            <div className="max-w-6xl mx-auto">
              <FadeIn className="mb-16 text-center max-w-2xl mx-auto">
                <h2 className="text-4xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Marchés Publics APC</h2>
                <p className="text-gray-500 text-lg">Consultez nos appels d&apos;offres ouverts et soumettez votre proposition technique et financière directement en ligne.</p>
              </FadeIn>

              {loadingTenders ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 text-apc-green animate-spin" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Chargement des offres...</p>
                </div>
              ) : tenders.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
                  <Globe className="w-12 h-12 text-gray-200 mx-auto mb-6" />
                  <p className="text-gray-400 font-medium italic">Aucun appel d&apos;offres n&apos;est ouvert actuellement.</p>
                </div>
              ) : (
                <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {tenders.map((tender) => (
                    <StaggerItem key={tender.id}>
                      <div className="bg-white rounded-[2.5rem] p-10 border border-border/40 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col h-full group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-apc-green/5 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                        
                        <div className="flex justify-between items-start mb-8 relative z-10">
                          <div className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border border-gray-100">
                            Ref: {tender.reference}
                          </div>
                          <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${tender.status === 'open' ? 'text-apc-green' : 'text-gray-400'}`}>
                            <div className={`w-2 h-2 rounded-full ${tender.status === 'open' ? 'bg-apc-green animate-pulse' : 'bg-gray-400'}`} />
                            {tender.status === 'open' ? 'Ouvert' : 'Clôturé'}
                          </span>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-apc-green transition-colors uppercase tracking-tight leading-none">
                          {tender.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-10 flex-1 line-clamp-3">
                          {tender.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-8 mb-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-apc-green" />
                            Limite : {new Date(tender.deadline).toLocaleDateString('fr-FR')}
                          </div>
                        </div>

                        <Button 
                          onClick={() => setSelectedTender(tender)}
                          className="w-full h-14 gap-3 rounded-2xl bg-apc-green hover:bg-apc-green/90 font-black uppercase tracking-widest text-[11px] shadow-xl shadow-apc-green/20 relative z-10"
                        >
                          Détails & Soumission <ArrowLeft className="w-4 h-4 rotate-180" />
                        </Button>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <FadeIn>
                <button 
                  onClick={() => { setSelectedTender(null); setSubmitted(false); }}
                  className="flex items-center gap-3 text-gray-400 hover:text-apc-green transition-all font-black uppercase tracking-widest text-[10px] mb-12"
                >
                  <ArrowLeft className="w-4 h-4" /> Retour aux opportunités
                </button>

                <div className="bg-white rounded-[3rem] border border-border/40 shadow-2xl overflow-hidden mb-12">
                  <div className="bg-[#1a472a] p-12 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px]" />
                    <div className="relative z-10">
                      <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-none">{selectedTender.title}</h2>
                      <div className="flex flex-wrap items-center gap-6 opacity-60 text-[10px] font-black uppercase tracking-widest">
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4" /> {selectedTender.reference}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> Publié le {new Date(selectedTender.createdAt || new Date()).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-12">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Description du marché</h3>
                    <div 
                      className="prose prose-apc max-w-none text-gray-600 mb-12 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedTender.content || selectedTender.description }}
                    />

                    {selectedTender.documents && selectedTender.documents.length > 0 ? (
                      <>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Documents à télécharger</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                          {selectedTender.documents.map((doc: { label: string; url: string }, idx: number) => (
                            <a key={`${selectedTender.id}-doc-${idx}`} href={doc.url} className="flex items-center justify-between p-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] hover:bg-white hover:border-apc-green transition-all group shadow-sm">
                              <span className="text-xs font-bold text-gray-900">{doc.label}</span>
                              <Download className="w-5 h-5 text-apc-green group-hover:scale-110 transition-transform" />
                            </a>
                          ))}
                        </div>
                      </>
                    ) : selectedTender.fileUrl && (
                      <>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Documents à télécharger</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                          <a href={selectedTender.fileUrl} className="flex items-center justify-between p-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] hover:bg-white hover:border-apc-green transition-all group shadow-sm">
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
                          {new Date(selectedTender.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
                    <Button onClick={() => setSelectedTender(null)} className="h-14 px-10 rounded-2xl bg-[#1a472a] font-black uppercase tracking-widest text-[11px]">
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
                            placeholder="+243..."
                            required
                            value={form.numero}
                            onChange={(e) => handleSet("numero", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="pt-10 border-t border-gray-50">
                        <div className="flex items-center gap-3 mb-8">
                          <FileText className="w-5 h-5 text-apc-green" />
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">Dossier de candidature (Pièces Jointes)</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <FileUploadField 
                            id="tech" 
                            label="1. Offre Technique" 
                            file={form.offreTechnique}
                            onChange={(f) => handleSet("offreTechnique", f)}
                          />
                          <FileUploadField 
                            id="fin" 
                            label="2. Offre Financière" 
                            file={form.offreFinanciere}
                            onChange={(f) => handleSet("offreFinanciere", f)}
                          />
                          <FileUploadField 
                            id="admin" 
                            label="3. Dossier Administratif" 
                            file={form.documentAdministratif}
                            onChange={(f) => handleSet("documentAdministratif", f)}
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-16 rounded-[1.5rem] bg-apc-green hover:bg-apc-green/90 text-white font-black uppercase tracking-widest shadow-xl shadow-apc-green/20 hover:scale-[1.01] transition-all disabled:opacity-50"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Transmission sécurisée...
                          </div>
                        ) : "Envoyer mon offre de services"}
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
