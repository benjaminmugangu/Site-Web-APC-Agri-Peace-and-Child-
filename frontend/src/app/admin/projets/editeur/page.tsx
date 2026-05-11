"use client"

import React, { useState, useEffect } from "react"
import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  Plus, 
  Info,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createProject, updateProject, getProject } from "@/lib/api/projects"
import { toast } from "sonner"
import { useRouter, useParams } from "next/navigation"

export default function AdminProjectEditor() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    category: "agriculture",
    budget: 0,
    location: "",
    province: "",
    beneficiaries: 0,
    mainImage: "",
    showOnHome: true,
    needsDonation: false,
    status: "draft"
  })

  useEffect(() => {
    if (id && id !== 'editeur') {
      loadProject()
    }
  }, [id])

  const loadProject = async () => {
    setFetching(true)
    try {
      const project = await getProject(id)
      if (project) {
        setFormData({
          title: project.title,
          slug: project.slug,
          description: project.description,
          content: project.content || "",
          category: project.category,
          budget: Number(project.budget),
          location: project.location || "",
          province: project.province || "",
          beneficiaries: project.beneficiaries,
          mainImage: project.mainImage || "",
          showOnHome: project.showOnHome,
          needsDonation: project.needsDonation,
          status: project.status
        })
      }
    } catch (error) {
      toast.error("Erreur lors du chargement du projet")
    } finally {
      setFetching(false)
    }
  }

  const handleSave = async (isDraft = false) => {
    setLoading(true)
    try {
      const payload = { 
        ...formData, 
        status: isDraft ? "draft" : "published",
        budget: Number(formData.budget),
        beneficiaries: Number(formData.beneficiaries)
      }

      if (id && id !== 'editeur') {
        await updateProject(id, payload)
        toast.success("Projet mis à jour")
      } else {
        await createProject(payload)
        toast.success("Projet créé")
        router.push("/admin/projets")
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'enregistrement")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin text-emerald-600" size={48} /></div>


  const updateSlug = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setFormData(prev => ({ ...prev, title, slug }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link href="/admin/projets" className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Retour à la liste</span>
        </Link>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => handleSave(true)}
            disabled={loading}
          >
            Enregistrer Brouillon
          </Button>
          <Button 
            onClick={() => handleSave(false)}
            disabled={loading}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 min-w-[160px] text-white"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <><Save size={18} /> {id && id !== 'editeur' ? "Mettre à jour" : "Publier le Projet"}</>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{id && id !== 'editeur' ? "Modifier le Projet" : "Nouveau Projet"}</h1>
        <p className="text-gray-500">Remplissez les informations ci-dessous pour présenter votre action sur le site.</p>
      </div>

      {/* Main Form Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6 text-black">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            {/* Titre & Slug */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Titre du Projet *</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => updateSlug(e.target.value)}
                  placeholder="Ex: Soutien à l'agriculture durable"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Slug (URL) *</label>
                <input 
                  type="text" 
                  value={formData.slug}
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-100 bg-gray-50 text-gray-500 text-sm font-mono"
                />
              </div>
            </div>

            {/* Description Courte */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Description Courte *</label>
              <textarea 
                rows={3}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Un court résumé du projet (max 200 caractères)..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Contenu Complet */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Contenu Détaillé (Markdown)</label>
              <textarea 
                rows={12}
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                placeholder="Rédigez l'article complet ici..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Grid for Small Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Catégorie</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
                >
                  <option value="agriculture">Agriculture</option>
                  <option value="protection">Protection</option>
                  <option value="dignite">Dignité</option>
                  <option value="paix">Paix</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Budget ($)</label>
                <input 
                  type="number" 
                  value={formData.budget}
                  onChange={e => setFormData({...formData, budget: Number(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Province</label>
                <input 
                  type="text" 
                  value={formData.province}
                  onChange={e => setFormData({...formData, province: e.target.value})}
                  placeholder="Ex: Nord-Kivu"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Bénéficiaires</label>
                <input 
                  type="number" 
                  value={formData.beneficiaries}
                  onChange={e => setFormData({...formData, beneficiaries: Number(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Media & Meta */}
        <div className="space-y-6 text-black">
          {/* Media Upload */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <ImageIcon size={18} className="text-emerald-600" /> Image de Couverture
            </h3>
            <div className="space-y-3">
              <input 
                type="text" 
                value={formData.mainImage}
                onChange={e => setFormData({...formData, mainImage: e.target.value})}
                placeholder="URL de l'image (Cloudinary)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-100 bg-gray-50 focus:outline-none"
              />
              <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center p-4 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all cursor-pointer group">
                {formData.mainImage ? (
                  <img src={formData.mainImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <>
                    <div className="p-3 rounded-full bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                      <Plus size={24} className="text-emerald-600" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-600">Cliquez pour uploader</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Visibility & Settings */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Info size={18} className="text-emerald-600" /> Paramètres de Publication
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium">Afficher sur l&apos;accueil</span>
                <input 
                  type="checkbox" 
                  checked={formData.showOnHome}
                  onChange={e => setFormData({...formData, showOnHome: e.target.checked})}
                  className="w-5 h-5 accent-emerald-600" 
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium">Besoins de dons</span>
                <input 
                  type="checkbox" 
                  checked={formData.needsDonation}
                  onChange={e => setFormData({...formData, needsDonation: e.target.checked})}
                  className="w-5 h-5 accent-emerald-600" 
                />
              </label>
            </div>
            
            <div className="pt-4 mt-4 border-t border-gray-100 italic text-xs text-gray-400 flex gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" /> Prêt pour la publication
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
