"use client"

import React, { useState, useEffect } from "react"
import {
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Info,
  CheckCircle2,
  Loader2,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Star,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { createProject, updateProject, getProject } from "@/lib/api/projects"
import { toast } from "sonner"
import { useRouter, useParams } from "next/navigation"
import type { ProjectCategory, ProjectStatus } from "@/types"

const CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: "agriculture", label: "Agriculture" },
  { value: "protection", label: "Protection de l'Enfant" },
  { value: "dignite",    label: "Dignité Humaine" },
  { value: "paix",       label: "Consolidation de la Paix" },
]

const PROVINCES = [
  "Nord-Kivu", "Sud-Kivu", "Maniema", "Ituri",
  "Haut-Katanga", "Lualaba", "Kinshasa", "Autre",
]

type FormData = {
  title: string
  slug: string
  description: string
  content: string
  category: ProjectCategory
  status: ProjectStatus
  budget: number
  currency: string
  location: string
  province: string
  beneficiaries: number
  startDate: string
  endDate: string
  mainImage: string
  showOnHome: boolean
  needsDonation: boolean
  featured: boolean
  isVisible: boolean
}

const DEFAULT_FORM: FormData = {
  title: "",
  slug: "",
  description: "",
  content: "",
  category: "agriculture",
  status: "draft",
  budget: 0,
  currency: "USD",
  location: "",
  province: "",
  beneficiaries: 0,
  startDate: "",
  endDate: "",
  mainImage: "",
  showOnHome: true,
  needsDonation: false,
  featured: false,
  isVisible: true,
}

export default function AdminProjectEditor() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string | undefined

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM)

  // ── Load existing project if editing ──────────────────────────────────────
  useEffect(() => {
    if (id) loadProject()
  }, [id])

  const loadProject = async () => {
    setFetching(true)
    try {
      const project = await getProject(id!)
      if (project) {
        setFormData({
          title:        project.title,
          slug:         project.slug,
          description:  project.description,
          content:      project.content || "",
          category:     project.category as ProjectCategory,
          status:       project.status as ProjectStatus,
          budget:       Number(project.budget),
          currency:     project.currency || "USD",
          location:     project.location || "",
          province:     project.province || "",
          beneficiaries: project.beneficiaries,
          startDate:    project.startDate ? project.startDate.split("T")[0] : "",
          endDate:      project.endDate   ? project.endDate.split("T")[0]   : "",
          mainImage:    project.mainImage || "",
          showOnHome:   project.showOnHome,
          needsDonation: project.needsDonation,
          featured:     project.featured,
          isVisible:    project.isVisible,
        })
      }
    } catch {
      toast.error("Erreur lors du chargement du projet")
    } finally {
      setFetching(false)
    }
  }

  // ── Auto-generate slug from title ─────────────────────────────────────────
  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    setFormData(prev => ({ ...prev, title, slug }))
  }

  // ── Save / Publish ─────────────────────────────────────────────────────────
  const handleSave = async (asDraft = false) => {
    if (!formData.title || !formData.slug || !formData.description) {
      toast.error("Titre, slug et description sont obligatoires")
      return
    }
    setLoading(true)
    try {
      const payload = {
        ...formData,
        status: asDraft ? "draft" as ProjectStatus : "published" as ProjectStatus,
        budget:        Number(formData.budget),
        beneficiaries: Number(formData.beneficiaries),
        startDate: formData.startDate || undefined,
        endDate:   formData.endDate   || undefined,
        mainImage: formData.mainImage || undefined,
      }

      if (id) {
        await updateProject(id, payload)
        toast.success("Projet mis à jour avec succès")
      } else {
        await createProject(payload)
        toast.success("Projet créé avec succès !")
        router.push("/admin/projets")
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'enregistrement")
    } finally {
      setLoading(false)
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  const set = (key: keyof FormData, value: any) =>
    setFormData(prev => ({ ...prev, [key]: value }))

  if (fetching) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="animate-spin text-apc-green" size={48} />
    </div>
  )

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">

      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/admin/projets" className="flex items-center gap-2 text-gray-500 hover:text-apc-green transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Retour à la liste</span>
        </Link>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleSave(true)} disabled={loading}>
            Enregistrer brouillon
          </Button>
          <Button
            onClick={() => handleSave(false)}
            disabled={loading}
            className="gap-2 bg-[#1a472a] hover:bg-[#2d6a4f] min-w-[160px] text-white"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <><Save size={18} /> {id ? "Mettre à jour" : "Publier le Projet"}</>
            )}
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">{id ? "Modifier le Projet" : "Nouveau Projet"}</h1>
        <p className="text-gray-500 mt-1">Remplissez les informations ci-dessous pour présenter votre action sur le site.</p>
      </div>

      {/* Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left: Main fields ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6 text-black">

          {/* Titre & Slug */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Titre du Projet *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="Ex : Soutien à l'Agriculture Durable à Rutshuru"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all text-lg font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Slug (URL) *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={e => set("slug", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-100 bg-gray-50 text-gray-500 text-sm font-mono"
              />
              <p className="text-xs text-gray-400">URL : /projets/<strong>{formData.slug || "..."}</strong></p>
            </div>
          </div>

          {/* Description & Contenu */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Description Courte *</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => set("description", e.target.value)}
                placeholder="Un court résumé du projet (affiché dans les listes et aperçus)..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Contenu Détaillé (HTML)</label>
              <textarea
                rows={14}
                value={formData.content}
                onChange={e => set("content", e.target.value)}
                placeholder="<p>Rédigez le contenu complet du projet ici...</p>"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all"
              />
            </div>
          </div>

          {/* Données chiffrées */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign size={18} className="text-apc-green" /> Données Chiffrées
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Budget</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    value={formData.budget}
                    onChange={e => set("budget", Number(e.target.value))}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all"
                  />
                  <select
                    value={formData.currency}
                    onChange={e => set("currency", e.target.value)}
                    className="px-3 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 text-sm"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="CDF">CDF</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Users size={14} /> Bénéficiaires Directs
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.beneficiaries}
                  onChange={e => set("beneficiaries", Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all"
                />
              </div>
            </div>
          </div>

          {/* Localisation & Dates */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin size={18} className="text-apc-alert" /> Localisation & Calendrier
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Ville / Localité</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => set("location", e.target.value)}
                  placeholder="Ex : Rutshuru, Nord-Kivu"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Province</label>
                <select
                  value={formData.province}
                  onChange={e => set("province", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all"
                >
                  <option value="">Sélectionner...</option>
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={14} /> Date de Début
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => set("startDate", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={14} /> Date de Fin
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => set("endDate", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Sidebar ────────────────────────────────────────────────── */}
        <div className="space-y-6 text-black">

          {/* Catégorie */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2">Catégorie</h3>
            <div className="space-y-2">
              {CATEGORIES.map(cat => (
                <label
                  key={cat.value}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${
                    formData.category === cat.value
                      ? "border-apc-green bg-apc-green/5"
                      : "border-transparent hover:border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={formData.category === cat.value}
                    onChange={() => set("category", cat.value)}
                    className="accent-apc-green"
                  />
                  <span className="text-sm font-medium">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Image de couverture */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <ImageIcon size={18} className="text-apc-green" /> Image de Couverture
            </h3>
            <ImageUploader
              value={formData.mainImage}
              onChange={url => set("mainImage", url)}
            />
          </div>

          {/* Paramètres */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Info size={18} className="text-apc-green" /> Paramètres
            </h3>
            <div className="space-y-2">
              {[
                { key: "showOnHome",   label: "Afficher sur l'accueil" },
                { key: "featured",     label: "Projet mis en avant ★" },
                { key: "needsDonation", label: "Appel aux dons" },
                { key: "isVisible",    label: "Visible sur le site" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium">{label}</span>
                  <input
                    type="checkbox"
                    checked={formData[key as keyof FormData] as boolean}
                    onChange={e => set(key as keyof FormData, e.target.checked)}
                    className="w-5 h-5 accent-apc-green"
                  />
                </label>
              ))}
            </div>

            {/* Statut manuel */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Statut</label>
              <select
                value={formData.status}
                onChange={e => set("status", e.target.value as ProjectStatus)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 text-sm"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </div>

            <div className="pt-4 border-t border-gray-100 italic text-xs text-gray-400 flex gap-2">
              <CheckCircle2 size={14} className="text-apc-green shrink-0" />
              Utilisez "Enregistrer brouillon" pour sauvegarder sans publier.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
