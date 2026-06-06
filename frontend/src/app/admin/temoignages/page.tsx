"use client"

import React, { useState, useEffect } from "react"
import { 
  Plus, Edit, Trash2, ArrowLeft, Save, AlertCircle, Loader2, 
  Search, MessageSquare, MapPin, Tag, Quote, Eye
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { 
  listAllTestimonials, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial,
  getTestimonial
} from "@/lib/api/testimonials"
import { toast } from "sonner"

export default function AdminTestimonialPage() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [filteredTestimonials, setFilteredTestimonials] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Filters State
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("ALL")

  // Form State
  const [formData, setFormData] = useState({
    authorName: "",
    authorRole: "",
    authorLocation: "",
    photoUrl: "",
    content: "",
    projectName: "",
    status: "draft",
    order: 0
  })

  async function load() {
    setFetching(true)
    try {
      const result = await listAllTestimonials()
      setTestimonials(result || [])
      setFilteredTestimonials(result || [])
    } catch (error) {
      toast.error("Erreur de chargement des témoignages")
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // Filter application
  useEffect(() => {
    let filtered = [...testimonials]

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t => 
        (t.authorName && t.authorName.toLowerCase().includes(query)) || 
        (t.authorRole && t.authorRole.toLowerCase().includes(query)) ||
        (t.content && t.content.toLowerCase().includes(query)) ||
        (t.projectName && t.projectName.toLowerCase().includes(query))
      )
    }

    if (selectedStatus !== "ALL") {
      filtered = filtered.filter(t => t.status === selectedStatus)
    }

    setFilteredTestimonials(filtered)
  }, [searchQuery, selectedStatus, testimonials])

  const handleAdd = () => {
    setEditingTestimonial(null)
    setErrorMsg(null)
    setFormData({ 
      authorName: "", 
      authorRole: "", 
      authorLocation: "", 
      photoUrl: "", 
      content: "", 
      projectName: "",
      status: "draft",
      order: 0 
    })
    setShowForm(true)
  }

  const handleEdit = async (id: string) => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const testimonial = await getTestimonial(id)
      if (!testimonial) {
        toast.error("Témoignage introuvable")
        return
      }
      setEditingTestimonial(testimonial)
      setFormData({
        authorName: testimonial.authorName || "",
        authorRole: testimonial.authorRole || "",
        authorLocation: testimonial.authorLocation || "",
        photoUrl: testimonial.photoUrl || "",
        content: testimonial.content || "",
        projectName: testimonial.projectName || "",
        status: testimonial.status || "draft",
        order: testimonial.order || 0
      })
      setShowForm(true)
    } catch (error) {
      toast.error("Erreur de chargement des détails du témoignage")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    
    const payload: any = {
      ...formData,
      order: Number(formData.order) || 0
    }

    // Clean up empty strings to avoid DTO validation errors on backend
    if (payload.authorRole === "") payload.authorRole = undefined;
    if (payload.authorLocation === "") payload.authorLocation = undefined;
    if (payload.photoUrl === "") payload.photoUrl = undefined;
    if (payload.projectName === "") payload.projectName = undefined;

    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, payload)
        toast.success("Témoignage mis à jour avec succès !")
      } else {
        await createTestimonial(payload)
        toast.success("Témoignage ajouté avec succès !")
      }
      setShowForm(false)
      load()
    } catch (err: any) {
      const serverMessage = err.errors && Array.isArray(err.errors)
        ? err.errors.map((e: any) => `${e.property}: ${e.constraints ? Object.values(e.constraints).join(', ') : JSON.stringify(e)}`).join('\n')
        : (err.message || "Erreur lors de l'enregistrement");
      setErrorMsg(serverMessage);
      toast.error("Erreur de validation. Veuillez vérifier les champs.");
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce témoignage ?")) {
      try {
        await deleteTestimonial(id)
        toast.success("Témoignage supprimé")
        load()
      } catch (error) {
        toast.error("Erreur lors de la suppression")
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingTestimonial(null)
    setErrorMsg(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">Publié</span>
      case 'archived':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Archivé</span>
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">Brouillon</span>
    }
  }

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">Chargement des témoignages...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Quote className="text-emerald-600" size={24} />
            {showForm ? (editingTestimonial ? "Modifier le Témoignage" : "Nouveau Témoignage") : "Témoignages des Bénéficiaires"}
          </h1>
          <p className="text-gray-500 text-sm">
            {showForm 
              ? "Saisissez le témoignage recueilli auprès d'un de nos bénéficiaires." 
              : "Gérez les récits et témoignages de réussite des bénéficiaires pour le site public."}
          </p>
        </div>
        {!showForm ? (
          <Button onClick={handleAdd} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-6 rounded-xl shadow-lg shadow-emerald-600/10">
            <Plus size={18} /> Ajouter un Témoignage
          </Button>
        ) : (
          <Button onClick={handleCancel} variant="outline" className="gap-2 border-gray-200 hover:bg-gray-50">
            <ArrowLeft size={18} /> Retour à la liste
          </Button>
        )}
      </div>

      {!showForm ? (
        /* LISTE DES TEMOIGNAGES */
        <div className="space-y-4">
          {/* Filters Panel */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher un témoignage..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <span className="text-xs text-gray-400 font-semibold">Statut :</span>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none bg-white"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Auteur</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Témoignage</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Projet Associé</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTestimonials.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-400">
                        <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        Aucun témoignage trouvé.
                      </td>
                    </tr>
                  ) : filteredTestimonials.map((testimonial) => (
                    <tr key={testimonial.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {testimonial.photoUrl ? (
                            <img src={testimonial.photoUrl} className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-sm" alt={testimonial.authorName} />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold shrink-0 border border-emerald-100 shadow-sm">
                              {testimonial.authorName ? testimonial.authorName.charAt(0) : "B"}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-900 leading-snug">{testimonial.authorName}</div>
                            <div className="text-xs text-gray-500">{testimonial.authorRole || "Bénéficiaire"}</div>
                            {testimonial.authorLocation && (
                              <div className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-0.5">
                                <MapPin size={8} /> {testimonial.authorLocation}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 line-clamp-2 max-w-md italic">
                          &ldquo;{testimonial.content}&rdquo;
                        </p>
                        <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">Ordre: {testimonial.order || 0}</div>
                      </td>
                      <td className="px-6 py-4">
                        {testimonial.projectName ? (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {testimonial.projectName}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(testimonial.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href="/actualites" target="_blank">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50" title="Voir sur le site public">
                              <Eye size={15} />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(testimonial.id)}
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit size={15} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(testimonial.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* FORMULAIRE D'EDITION */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {errorMsg && (
            <div className="mx-8 mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm font-semibold">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div className="flex flex-col whitespace-pre-line">
                <span className="font-bold mb-1">Échec de validation :</span>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-10">
              {/* Photo Upload Zone */}
              <div className="w-full md:w-60 shrink-0">
                <ImageUploader 
                  value={formData.photoUrl}
                  onChange={(url) => setFormData({ ...formData, photoUrl: url })}
                  label="Photo du Bénéficiaire"
                />
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Nom Complet *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.authorName}
                      onChange={e => setFormData({ ...formData, authorName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm" 
                      placeholder="Ex: Espérance Nabintu" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Rôle / Profil (Ex: Mère de famille, Agriculteur)</label>
                    <input 
                      type="text" 
                      value={formData.authorRole}
                      onChange={e => setFormData({ ...formData, authorRole: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm" 
                      placeholder="Ex: Bénéficiaire du projet maraîcher" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Localité / Ville</label>
                    <input 
                      type="text" 
                      value={formData.authorLocation}
                      onChange={e => setFormData({ ...formData, authorLocation: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm" 
                      placeholder="Ex: Kabare, Sud-Kivu" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Projet associé (Optionnel)</label>
                    <input 
                      type="text" 
                      value={formData.projectName}
                      onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm" 
                      placeholder="Ex: Projet Semences d'Espoir" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Statut de publication *</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm bg-white"
                    >
                      <option value="draft">Brouillon</option>
                      <option value="published">Publié</option>
                      <option value="archived">Archivé</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Ordre d'affichage</label>
                    <input 
                      type="number" 
                      value={formData.order}
                      onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Témoignage (Texte) *</label>
                  <textarea 
                    required
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none h-32 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    placeholder="Saisissez ici le témoignage textuel du bénéficiaire..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-gray-50 px-8 py-6 flex justify-end gap-3 border-t border-gray-100">
            <Button variant="ghost" onClick={handleCancel} disabled={loading} type="button">Annuler</Button>
            <Button 
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-8 min-w-[200px] font-bold"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save size={18} /> {editingTestimonial ? "Enregistrer les modifications" : "Ajouter le témoignage"}
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
