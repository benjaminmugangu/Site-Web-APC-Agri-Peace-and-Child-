"use client"

import React, { useState, useEffect } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Download, 
  CheckCircle2, 
  Building2, 
  ArrowLeft, 
  Save, 
  Calendar,
  AlertCircle,
  X,
  Eye,
  Loader2,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Star
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import RichTextEditor from "@/components/RichTextEditor"
import { sanitizeHTMLServer } from "@/lib/htmlSanitizer"
import ImageUploader from "@/components/ui/ImageUploader"

import { listTenders, createTender, updateTender, deleteTender, getTender, generateTenderSlug } from "@/lib/api/tenders"
import { useRole } from "@/hooks/useRole"
import { toast } from "sonner"
import { format } from "date-fns"

/** Slugs exacts attendus par l'API (POST/PUT /api/v1/tenders) */
const TENDER_STATUSES = [
  { value: "open", label: "OUVERT" },
  { value: "closed", label: "FERMÉ" },
  { value: "cancelled", label: "ANNULÉ" },
  { value: "archived", label: "ARCHIVÉ" }
] as const

/** Anciens libellés tolérés en entrée (majuscules, français, variantes) */
const TENDER_STATUS_ALIASES: Record<string, string> = {
  open: "open", ouvert: "open", active: "open", publie: "open", publiee: "open",
  closed: "closed", ferme: "closed", cloture: "closed", cloturee: "closed",
  cancelled: "cancelled", annule: "cancelled", annulee: "cancelled",
  archived: "archived", archive: "archived", archivee: "archived"
}

/** Normalise toute valeur (OPEN, Ouvert, FERMÉ...) vers un slug API valide */
function normalizeTenderStatus(value: unknown): string {
  const slug = String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // "FERMÉ" -> "ferme"
  const resolved = TENDER_STATUS_ALIASES[slug] ?? slug
  // Dernière garantie : seul un slug accepté par l'API peut sortir d'ici
  return TENDER_STATUSES.some(s => s.value === resolved) ? resolved : "open"
}

export default function AdminAppelsOffresPage() {
  const { canWrite } = useRole()
  const canEdit = canWrite('rh')
  const [appels, setAppels] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingAppel, setEditingAppel] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    reference: "AAO-N°00X",
    deadline: "",
    description: "",
    content: "",
    fileUrl: "",
    status: "open",
    category: "Fournitures",
    imageUrl: "",
    slug: "",
    metaDescription: "",
    metaKeywords: "",
    isFeatured: false,
    submissionMode: "standard" as 'standard' | 'single'
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const [generatingSlug, setGeneratingSlug] = useState(false)

  async function load() {
    setFetching(true)
    try {
      const result = await listTenders()
      setAppels(result || [])
    } catch (error) {
      toast.error("Erreur chargement appels d'offres")
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleAdd = () => {
    setEditingAppel(null)
    const nextRef = `AAO-N°00${appels.length + 1}`
    setFormData({
      title: "",
      reference: nextRef,
      deadline: "",
      description: "",
      content: "",
      fileUrl: "",
      status: "open",
      category: "Fournitures",
      imageUrl: "",
      slug: "",
      metaDescription: "",
      metaKeywords: "",
      isFeatured: false,
      submissionMode: "standard"
    })
    setImagePreview("")
    setShowForm(true)
  }

  const handleEdit = async (id: string) => {
    setLoading(true)
    try {
      const appel = await getTender(id)
      if (!appel) {
        toast.error("Appel d'offres introuvable")
        return
      }
      setEditingAppel(appel)
      setFormData({
        title: appel.title,
        reference: appel.reference,
        deadline: appel.deadline ? format(new Date(appel.deadline), 'yyyy-MM-dd') : "",
        description: appel.description || "",
        content: appel.content || "",
        fileUrl: appel.fileUrl || "",
        status: normalizeTenderStatus(appel.status),
        category: (appel as any).category || "Fournitures",
        imageUrl: appel.imageUrl || "",
        slug: appel.slug || "",
        metaDescription: appel.metaDescription || "",
        metaKeywords: appel.metaKeywords || "",
        isFeatured: appel.isFeatured || false,
        submissionMode: appel.submissionMode || "standard"
      })
      setImagePreview(appel.imageUrl || "")
      setShowForm(true)
    } catch (error) {
      toast.error("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Sanitizer le contenu HTML pour éviter XSS
      const sanitizedContent = sanitizeHTMLServer(formData.content, true)
      const sanitizedDescription = sanitizeHTMLServer(formData.description, true)
      
      // Mapping de sécurité : l'API n'accepte que open | closed | cancelled | archived
      const payload = {
        ...formData,
        content: sanitizedContent,
        description: sanitizedDescription,
        status: normalizeTenderStatus(formData.status),
        imageUrl: formData.imageUrl || undefined,
        slug: formData.slug || undefined,
        metaDescription: formData.metaDescription || undefined,
        metaKeywords: formData.metaKeywords || undefined,
        isFeatured: formData.isFeatured,
        submissionMode: formData.submissionMode
      }
      
      if (editingAppel) {
        await updateTender(editingAppel.id, payload)
        toast.success("Appel d'offres mis à jour")
      } else {
        await createTender(payload)
        toast.success("Appel d'offres publié")
      }
      setShowForm(false)
      load()
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'enregistrement")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer définitivement cet appel d'offres ?")) {
      try {
        await deleteTender(id)
        toast.success("Supprimé")
        load()
      } catch (error) {
        toast.error("Erreur suppression")
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingAppel(null)
    setImagePreview("")
  }

  const handleImageUpload = async (url: string) => {
    setFormData({ ...formData, imageUrl: url })
    setImagePreview(url)
  }

  const handleGenerateSlug = async () => {
    if (!editingAppel) {
      toast.error("Veuillez d'abord créer l'appel d'offres")
      return
    }

    try {
      setGeneratingSlug(true)
      const result = await generateTenderSlug(editingAppel.id, formData.slug || undefined)
      setFormData({ ...formData, slug: result.slug })
      toast.success("Slug généré avec succès")
    } catch (error) {
      toast.error("Erreur lors de la génération du slug")
    } finally {
      setGeneratingSlug(false)
    }
  }

  if (fetching) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-apc-blue" size={48} /></div>

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {showForm ? (editingAppel ? "Modifier l'Appel d'Offres" : "Nouvel Appel d'Offres") : "Gestion des Appels d'Offres"}
          </h1>
          <p className="text-gray-500 text-sm">
            {showForm 
              ? "Publiez les documents du dossier d'appel d'offres (DAO)." 
              : "Publiez des dossiers d'appels d'offres et suivez les soumissions des prestataires."}
          </p>
        </div>
        {!showForm && canEdit && (
          <Button onClick={handleAdd} className="gap-2 bg-apc-blue hover:bg-blue-700 shadow-lg shadow-apc-blue/20 text-white font-bold">
            <Plus size={18} /> Nouvel Appel d&apos;Offres
          </Button>
        )}
        {!showForm && !canEdit && (
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg font-medium">👁️ Lecture seule</span>
        )}
        {showForm && (
          <Button onClick={handleCancel} variant="outline" className="gap-2">
            <ArrowLeft size={18} /> Retour à la liste
          </Button>
        )}
      </div>

      {!showForm ? (
        <>
          {/* LISTE DES APPELS */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Titre / Référence</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appels.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-400">Aucun appel d'offres publié</td>
                  </tr>
                ) : appels.map((appel) => (
                  <tr key={appel.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-gray-900">{appel.title}</div>
                        {appel.isFeatured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono mt-1 uppercase">{appel.reference}</div>
                    </td>
                    <td className="px-6 py-4">
                      {appel.slug ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 font-mono">{appel.slug}</span>
                          <Link href={`/appels-d-offres/${appel.slug}`} target="_blank">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-apc-green hover:text-apc-green/80">
                              <ExternalLink size={12} />
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Non défini</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        normalizeTenderStatus(appel.status) === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {appel.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href="/appels-d-offres" target="_blank">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50" title="Voir sur le site public">
                            <Eye size={16} />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(appel.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(appel.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* FORMULAIRE APPEL D'OFFRES */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Titre de l&apos;Appel d&apos;Offres *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20" 
                    placeholder="Ex: Fourniture de matériel de bureau" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Référence (AAO) *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.reference}
                      onChange={e => setFormData({...formData, reference: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 font-mono text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date Limite</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="date" 
                        value={formData.deadline}
                        onChange={e => setFormData({...formData, deadline: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 text-sm" 
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Statut</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none bg-white text-sm"
                  >
                    {TENDER_STATUSES.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Catégorie *</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none bg-white text-sm"
                  >
                    <option value="Fournitures">Fournitures</option>
                    <option value="Services">Services</option>
                    <option value="Construction">Construction / Travaux</option>
                    <option value="Consultant">Consultant</option>
                    <option value="Transport">Transport / Logistique</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description brève</label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) => setFormData({...formData, description: value})}
                    placeholder="Résumé de l'appel d'offres..."
                    minHeight="100px"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Image d'illustration</label>
                  <ImageUploader
                    value={imagePreview}
                    onChange={handleImageUpload}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Slug (URL unique)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 text-sm font-mono"
                      placeholder="fourniture-materiel-bureau-2024"
                    />
                    {editingAppel && (
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={handleGenerateSlug}
                        disabled={generatingSlug}
                        className="gap-2"
                      >
                        {generatingSlug ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles size={16} />
                        )}
                        Générer
                      </Button>
                    )}
                  </div>
                  {formData.slug && (
                    <Link 
                      href={`/appels-d-offres/${formData.slug}`} 
                      target="_blank"
                      className="text-xs text-apc-green hover:underline flex items-center gap-1"
                    >
                      <ExternalLink size={12} />
                      Voir la page publique
                    </Link>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Meta Description (SEO)</label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={e => setFormData({...formData, metaDescription: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 text-sm resize-none"
                    placeholder="Description pour les moteurs de recherche (150-160 caractères)"
                    rows={3}
                    maxLength={160}
                  />
                  <div className="text-[10px] text-gray-400 text-right">
                    {formData.metaDescription.length}/160
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Meta Keywords (SEO)</label>
                  <input 
                    type="text" 
                    value={formData.metaKeywords}
                    onChange={e => setFormData({...formData, metaKeywords: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 text-sm"
                    placeholder="mots, clés, séparés, par, virgules"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-300 text-apc-green focus:ring-apc-green"
                  />
                  <label htmlFor="isFeatured" className="text-xs font-bold text-gray-700 uppercase tracking-widest cursor-pointer">
                    Mettre en avant sur la page d'accueil
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mode de soumission *</label>
                  <select
                    value={formData.submissionMode}
                    onChange={e => setFormData({...formData, submissionMode: e.target.value as 'standard' | 'single'})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none bg-white text-sm"
                  >
                    <option value="standard">3 documents (Technique, Financière, Administrative)</option>
                    <option value="single">1 document (Dossier complet)</option>
                  </select>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Choisissez combien de documents les soumissionnaires doivent fournir.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contenu Détaillé (Éditeur Rich Text)</label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => setFormData({...formData, content: value})}
                    placeholder="Détails de l'appel d'offres..."
                    minHeight="200px"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">URL du Dossier (DAO)</label>
                  <input 
                    type="text" 
                    value={formData.fileUrl}
                    onChange={e => setFormData({...formData, fileUrl: e.target.value})}
                    placeholder="Lien vers le fichier PDF..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="bg-gray-50 px-8 py-6 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={handleCancel} disabled={loading}>Annuler</Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-apc-blue hover:bg-blue-700 gap-2 px-8 shadow-lg shadow-apc-blue/20 font-bold min-w-[200px] text-white"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <><Save size={18} /> {editingAppel ? "Mettre à jour" : "Publier l'appel d'offres"}</>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
