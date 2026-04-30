"use client"

import { useState } from "react"
import type { Metadata } from "next"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/ui/fade-in"
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
} from "lucide-react"

type FormState = {
  // Fournisseur
  nomEntreprise: string
  nomResponsable: string
  adresse: string
  contact: string
  numero: string
  email: string
  // Fichiers
  offreTechnique: File | null
  offreFinanciere: File | null
  documentAdministratif: File | null
}

const initialState: FormState = {
  nomEntreprise: "",
  nomResponsable: "",
  adresse: "",
  contact: "",
  numero: "",
  email: "",
  offreTechnique: null,
  offreFinanciere: null,
  documentAdministratif: null,
}

function FileUploadField({
  id,
  label,
  accept,
  file,
  onChange,
}: {
  id: string
  label: string
  accept?: string
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
            <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} Ko</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Upload className="w-6 h-6" />
            <span className="text-sm font-medium">Cliquez pour choisir un fichier</span>
            <span className="text-xs">PDF, DOC, DOCX, XLS — Max 10 Mo</span>
          </div>
        )}
        <input
          id={id}
          type="file"
          className="hidden"
          accept={accept ?? ".pdf,.doc,.docx,.xls,.xlsx"}
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  )
}

export default function AppelsDOffresPage() {
  const [form, setForm] = useState<FormState>(initialState)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  function set(field: keyof FormState, value: string | File | null) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormState, string>> = {}
    if (!form.nomEntreprise.trim()) newErrors.nomEntreprise = "Champ obligatoire"
    if (!form.nomResponsable.trim()) newErrors.nomResponsable = "Champ obligatoire"
    if (!form.adresse.trim()) newErrors.adresse = "Champ obligatoire"
    if (!form.contact.trim()) newErrors.contact = "Champ obligatoire"
    if (!form.numero.trim()) newErrors.numero = "Champ obligatoire"
    if (!form.offreTechnique) newErrors.offreTechnique = "Veuillez joindre l'offre technique"
    if (!form.offreFinanciere) newErrors.offreFinanciere = "Veuillez joindre l'offre financière"
    if (!form.documentAdministratif) newErrors.documentAdministratif = "Veuillez joindre le document administratif"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    // Simulation d'envoi (à remplacer par un vrai appel API)
    await new Promise((res) => setTimeout(res, 1500))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="flex flex-col">
      <PageHero
        title="Appels d'Offres"
        subtitle="Agri-Peace and Child publie régulièrement des appels d'offres pour des prestations de services, fournitures et travaux dans le cadre de ses projets humanitaires."
        breadcrumbs={[{ label: "Appels d'Offres" }]}
        tag="Procurement"
      />

      {/* Description de l'appel */}
      <section className="py-16 bg-white">
        <div className="container px-4 max-w-4xl mx-auto">
          <FadeIn>
            {/* Avis en cours */}
            <div className="bg-apc-blue/5 border border-apc-blue/20 rounded-2xl p-6 mb-10 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-apc-blue/10 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-5 h-5 text-apc-blue" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Avis d&apos;Appel d&apos;Offres — Fournitures agricoles 2025</h3>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  Agri-Peace and Child lance un appel d&apos;offres pour la fourniture de semences améliorées, d&apos;intrants
                  agricoles et de matériel de travail destinés aux bénéficiaires du programme de sécurité alimentaire
                  dans le territoire de Masisi, Nord-Kivu.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-apc-green" /> Date de publication : 1er mai 2025</span>
                  <span className="flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-red-500" /> Date limite de dépôt : 30 mai 2025</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
              {[
                { step: "1", title: "Télécharger le DAO", desc: "Consultez le Dossier d'Appel d'Offres complet pour connaître les spécifications détaillées.", color: "bg-apc-green/10 text-apc-green" },
                { step: "2", title: "Préparer votre offre", desc: "Constituez votre offre technique, financière et les documents administratifs requis.", color: "bg-apc-blue/10 text-apc-blue" },
                { step: "3", title: "Déposer en ligne", desc: "Remplissez le formulaire ci-dessous et téléversez vos documents avant la date limite.", color: "bg-purple-100 text-purple-700" },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50">
                  <div className={`w-9 h-9 rounded-xl ${item.color} font-bold text-lg flex items-center justify-center shrink-0`}>{item.step}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Formulaire de dépôt */}
          {submitted ? (
            <FadeIn>
              <div className="text-center py-16 bg-apc-green/5 rounded-3xl border border-apc-green/20">
                <div className="w-16 h-16 rounded-full bg-apc-green/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-apc-green" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Offre soumise avec succès !</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Votre dossier a bien été reçu. Notre équipe d&apos;achat examinera votre offre et vous contactera
                  dans les meilleurs délais.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline">
                  Soumettre une autre offre
                </Button>
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-[#1a472a] to-[#2d6a4f] p-6 text-white">
                  <h2 className="text-xl font-bold">Formulaire de dépôt d&apos;offre</h2>
                  <p className="text-white/70 text-sm mt-1">Tous les champs marqués * sont obligatoires</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                  {/* Section Fournisseur */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-apc-green/10 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-apc-green" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">Informations du Fournisseur</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Nom entreprise */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nom de l&apos;entreprise *
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={form.nomEntreprise}
                            onChange={(e) => set("nomEntreprise", e.target.value)}
                            placeholder="SARL Entreprise XYZ"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-apc-green/20 ${errors.nomEntreprise ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                          />
                        </div>
                        {errors.nomEntreprise && <p className="text-red-500 text-xs mt-1">{errors.nomEntreprise}</p>}
                      </div>

                      {/* Nom responsable */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nom du responsable *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={form.nomResponsable}
                            onChange={(e) => set("nomResponsable", e.target.value)}
                            placeholder="Jean Dupont"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-apc-green/20 ${errors.nomResponsable ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                          />
                        </div>
                        {errors.nomResponsable && <p className="text-red-500 text-xs mt-1">{errors.nomResponsable}</p>}
                      </div>

                      {/* Adresse */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Adresse *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={form.adresse}
                            onChange={(e) => set("adresse", e.target.value)}
                            placeholder="Avenue de la Paix, Q. Himbi, Goma, Nord-Kivu"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-apc-green/20 ${errors.adresse ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                          />
                        </div>
                        {errors.adresse && <p className="text-red-500 text-xs mt-1">{errors.adresse}</p>}
                      </div>

                      {/* Contact (email) */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email de contact *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            value={form.contact}
                            onChange={(e) => set("contact", e.target.value)}
                            placeholder="contact@entreprise.cd"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-apc-green/20 ${errors.contact ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                          />
                        </div>
                        {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
                      </div>

                      {/* Numéro de téléphone */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Numéro de téléphone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            value={form.numero}
                            onChange={(e) => set("numero", e.target.value)}
                            placeholder="+243 9XX XXX XXX"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-apc-green/20 ${errors.numero ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                          />
                        </div>
                        {errors.numero && <p className="text-red-500 text-xs mt-1">{errors.numero}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Section Documents */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-apc-blue/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-apc-blue" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">Documents à joindre</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <FileUploadField
                          id="offreTechnique"
                          label="Offre Technique *"
                          file={form.offreTechnique}
                          onChange={(f) => set("offreTechnique", f)}
                        />
                        {errors.offreTechnique && <p className="text-red-500 text-xs mt-1">{errors.offreTechnique}</p>}
                      </div>
                      <div>
                        <FileUploadField
                          id="offreFinanciere"
                          label="Offre Financière *"
                          file={form.offreFinanciere}
                          onChange={(f) => set("offreFinanciere", f)}
                        />
                        {errors.offreFinanciere && <p className="text-red-500 text-xs mt-1">{errors.offreFinanciere}</p>}
                      </div>
                      <div>
                        <FileUploadField
                          id="documentAdministratif"
                          label="Document Administratif *"
                          file={form.documentAdministratif}
                          onChange={(f) => set("documentAdministratif", f)}
                        />
                        {errors.documentAdministratif && <p className="text-red-500 text-xs mt-1">{errors.documentAdministratif}</p>}
                      </div>
                    </div>

                    <div className="mt-4 flex items-start gap-2 text-xs text-gray-400 bg-gray-50 p-4 rounded-xl">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>
                        Formats acceptés : PDF, DOC, DOCX, XLS, XLSX. Taille maximale par fichier : 10 Mo.
                        Assurez-vous que vos documents sont lisibles et complets avant soumission.
                      </p>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center pt-4 border-t border-gray-100">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto gap-2 bg-[#1a472a] hover:bg-[#2d6a4f] px-10"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Soumission en cours...
                        </>
                      ) : (
                        <>
                          Soumettre mon offre <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-400">
                      En soumettant ce formulaire, vous acceptez que vos données soient traitées par Agri-Peace and Child dans le cadre de cet appel d&apos;offres.
                    </p>
                  </div>
                </form>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  )
}
