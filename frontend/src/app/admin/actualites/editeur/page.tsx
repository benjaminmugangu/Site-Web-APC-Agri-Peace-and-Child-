"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Save,
  ArrowLeft,
  Info,
  Clock,
  User,
  Tag,
  Loader2,
  Calendar,
  Eye,
  FileText
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { getArticle, createArticle, updateArticle } from "@/lib/api/articles"
import { toast } from "sonner"

// Helper to slugify text
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // split accented characters into base letters and accent marks
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // remove all non-word characters except hyphens
    .replace(/\-\-+/g, '-') // replace multiple consecutive hyphens with a single one
    .replace(/^-+/, '') // trim leading hyphens
    .replace(/-+$/, ''); // trim trailing hyphens
}

export default function AdminArticleEditor() {
  const router = useRouter()
  const [id, setId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form states
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("Rapport")
  const [author, setAuthor] = useState("Admin APC")
  const [readTime, setReadTime] = useState(5)
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">("draft")
  const [featured, setFeatured] = useState(false)
  const [includeNewsletter, setIncludeNewsletter] = useState(true)
  const [mainImage, setMainImage] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")

  // Flag to check if slug was modified manually
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  useEffect(() => {
    // Read the query parameters using standard window APIs to avoid Suspense packaging issues
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const articleId = params.get("id")
      if (articleId) {
        setId(articleId)
        fetchArticle(articleId)
      } else {
        setLoading(false)
      }
    }
  }, [])

  // Auto-generate slug from title
  useEffect(() => {
    if (!isSlugManuallyEdited && !id) {
      setSlug(slugify(title))
    }
  }, [title, isSlugManuallyEdited, id])

  // Auto-calculate read time based on word count (~200 words per minute)
  useEffect(() => {
    if (content.trim()) {
      const words = content.trim().split(/\s+/).length
      const calculated = Math.max(1, Math.ceil(words / 200))
      setReadTime(calculated)
    }
  }, [content])

  async function fetchArticle(articleId: string) {
    try {
      const article = await getArticle(articleId)
      if (article) {
        setTitle(article.title)
        setSlug(article.slug)
        setExcerpt(article.excerpt || "")
        setContent(article.content || "")
        setCategory(article.category || "Rapport")
        setAuthor(article.author || "Admin APC")
        setReadTime(article.readTime || 5)
        setStatus(article.status || "draft")
        setFeatured(article.featured || false)
        setIncludeNewsletter(article.includeNewsletter ?? true)
        setMainImage(article.mainImage || "")
        if (article.scheduledDate) {
          // Format date-time for datetime-local input (YYYY-MM-DDTHH:MM)
          const date = new Date(article.scheduledDate)
          const formatted = date.toISOString().slice(0, 16)
          setScheduledDate(formatted)
        }
        setIsSlugManuallyEdited(true) // Don't overwrite slug when editing
      } else {
        toast.error("Article introuvable")
        router.push("/admin/actualites")
      }
    } catch (error) {
      toast.error("Erreur lors de la récupération de l'article")
      router.push("/admin/actualites")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, customStatus?: "draft" | "published" | "scheduled") => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Veuillez saisir un titre")
      return
    }
    if (!slug.trim()) {
      toast.error("Veuillez générer ou saisir un slug unique")
      return
    }
    if (!content.trim()) {
      toast.error("Le contenu de l'article ne peut pas être vide")
      return
    }
    if (!mainImage) {
      toast.error("Veuillez uploader une image de couverture")
      return
    }

    const targetStatus = customStatus || status

    if (targetStatus === "scheduled" && !scheduledDate) {
      toast.error("Veuillez spécifier une date et heure de planification")
      return
    }

    setSaving(true)
    const payload = {
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      readTime: Number(readTime),
      status: targetStatus,
      featured,
      includeNewsletter,
      mainImage,
      scheduledDate: targetStatus === "scheduled" ? new Date(scheduledDate).toISOString() : null,
      publishDate: targetStatus === "published" ? new Date().toISOString() : null
    }

    try {
      if (id) {
        await updateArticle(id, payload)
        toast.success("Article mis à jour avec succès !")
      } else {
        await createArticle(payload)
        toast.success("Article créé et enregistré avec succès !")
      }
      router.push("/admin/actualites")
      router.refresh()
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Erreur lors de l'enregistrement"
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-gray-400">
        <Loader2 className="animate-spin mb-4 text-apc-green" size={40} />
        <p className="font-medium">Chargement des données de l&apos;éditeur...</p>
      </div>
    )
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="max-w-4xl mx-auto space-y-8 text-black">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/actualites"
          className="flex items-center gap-2 text-gray-500 hover:text-apc-green transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Retour à la liste</span>
        </Link>
        <div className="flex gap-3">
          <Button 
            type="button" 
            variant="outline"
            onClick={(e) => handleSubmit(e, "draft")}
            disabled={saving}
            className="hover:bg-slate-50 border-slate-200"
          >
            Enregistrer Brouillon
          </Button>
          <Button 
            type="submit" 
            disabled={saving}
            onClick={() => {
              if (status === "draft") {
                setStatus("published")
              }
            }}
            className="gap-2 bg-apc-green hover:bg-emerald-700 text-white font-bold"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {id ? "Mettre à jour" : "Publier l'Article"}
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">{id ? "Modifier l'Article" : "Nouvel Article"}</h1>
        <p className="text-gray-500 text-sm">
          Rédigez un article, un rapport d&apos;activité ou une histoire de réussite à partager avec le public d&apos;APC.
        </p>
      </div>

      {/* Main Form Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Colonne principale : Contenu */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">

            {/* Titre */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Titre de l&apos;Article
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: L'impact du micro-crédit chez les femmes de Goma"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all text-lg font-medium text-gray-900"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between">
                <span>Lien URL (Slug)</span>
                {isSlugManuallyEdited && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsSlugManuallyEdited(false)
                      setSlug(slugify(title))
                    }}
                    className="text-apc-green hover:underline lowercase font-normal"
                  >
                    Réinitialiser auto
                  </button>
                )}
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value))
                  setIsSlugManuallyEdited(true)
                }}
                placeholder="slug-de-l-article"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all text-sm font-mono text-gray-700 bg-slate-50"
              />
            </div>

            {/* Extrait / Résumé */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Extrait (Résumé Court)
              </label>
              <p className="text-[11px] text-gray-400">
                Affiché dans les cartes d&apos;aperçu sur la page d&apos;accueil et des Actualités. Max 200 caractères. ({excerpt.length}/200)
              </p>
              <textarea
                rows={2}
                maxLength={200}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Résumé accrocheur et court de l'article..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all resize-none text-sm text-gray-700"
              />
            </div>

            {/* Contenu Principal */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Contenu de l&apos;Article (HTML supporté)
              </label>
              <textarea
                required
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Rédigez le contenu complet de l'article ici... Vous pouvez utiliser du HTML pour enrichir le contenu."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green font-sans text-sm text-gray-800 transition-all"
              />
              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                <Info size={12} /> Séparez vos paragraphes proprement ou utilisez des balises HTML standard pour les titres, listes et gras.
              </p>
            </div>

            {/* Grille Métadonnées */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-slate-50">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Tag size={12} /> Catégorie
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all bg-white text-sm text-gray-700 font-medium"
                >
                  <option value="Rapport">Rapport</option>
                  <option value="Terrain">Terrain</option>
                  <option value="Impact">Impact</option>
                  <option value="Éducation">Éducation</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Protection">Protection</option>
                  <option value="Partenariat">Partenariat</option>
                  <option value="Événement">Événement</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <User size={12} /> Auteur
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Nom de l'auteur"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all text-sm text-gray-700 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={12} /> Temps de Lecture (min)
                </label>
                <input
                  type="number"
                  required
                  value={readTime}
                  onChange={(e) => setReadTime(Number(e.target.value))}
                  placeholder="5"
                  min={1}
                  max={60}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all text-sm text-gray-700 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Colonne latérale : Média & Publication */}
        <div className="space-y-6">

          {/* Image de couverture */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <ImageUploader 
              value={mainImage} 
              onChange={setMainImage}
              label="Image de Couverture"
            />
          </div>

          {/* Statut & Planification */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-sm text-gray-900 border-b border-slate-50 pb-2">
              <FileText size={18} className="text-apc-green" /> Statut de Publication
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-slate-100/50 transition-colors">
                <input 
                  type="radio" 
                  name="status" 
                  value="draft" 
                  checked={status === "draft"}
                  onChange={() => setStatus("draft")}
                  className="accent-apc-green w-4 h-4"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Brouillon</span>
                  <span className="text-[10px] text-slate-400 block">Visible uniquement par les admins</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-slate-100/50 transition-colors">
                <input 
                  type="radio" 
                  name="status" 
                  value="published" 
                  checked={status === "published"}
                  onChange={() => setStatus("published")}
                  className="accent-apc-green w-4 h-4"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Publié</span>
                  <span className="text-[10px] text-slate-400 block">Visible immédiatement par le public</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-slate-100/50 transition-colors">
                <input 
                  type="radio" 
                  name="status" 
                  value="scheduled" 
                  checked={status === "scheduled"}
                  onChange={() => setStatus("scheduled")}
                  className="accent-apc-green w-4 h-4"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Planifié</span>
                  <span className="text-[10px] text-slate-400 block">Publier automatiquement à une date future</span>
                </div>
              </label>
            </div>

            {status === "scheduled" && (
              <div className="space-y-2 pt-3 border-t border-slate-50 animate-fadeIn">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Calendar size={12} className="text-apc-green" /> Date & Heure de Planification
                </label>
                <input 
                  type="datetime-local" 
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-apc-green/20 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Options de promotion */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-sm text-gray-900 border-b border-slate-50 pb-2">
              <Info size={18} className="text-apc-green" /> Options de Promotion
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-slate-100/50 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Article À la Une</span>
                  <span className="text-[10px] text-slate-400">Afficher en premier sur les Actualités</span>
                </div>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-apc-green"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-slate-100/50 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Inclure dans la Newsletter</span>
                  <span className="text-[10px] text-slate-400">Notifier les abonnés à la newsletter</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeNewsletter}
                  onChange={(e) => setIncludeNewsletter(e.target.checked)}
                  className="w-4 h-4 accent-apc-green"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
