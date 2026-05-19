"use client"

import React, { useState, useEffect } from "react"
import { Plus, Edit, Trash2, ArrowLeft, Save, AlertCircle, CheckCircle2, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { domainService } from "@/lib/api/services"
import { type Service } from "@/types"
import * as LucideIcons from "lucide-react"
import { ImageUploader } from "@/components/ui/ImageUploader"

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [fetching, setFetching] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    titleEn: "",
    slug: "",
    description: "",
    descriptionEn: "",
    iconName: "Heart",
    bgClass: "bg-emerald-500",
    accentClass: "text-emerald-700",
    mainImage: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    setFetching(true)
    try {
      const data = await domainService.list()
      setServices(data)
    } catch (error) {
      setStatus({ type: 'error', message: "Erreur lors du chargement des services." })
    } finally {
      setFetching(false)
    }
  }

  const handleAdd = () => {
    setEditingService(null)
    setFormData({
      name: "",
      titleEn: "",
      slug: "",
      description: "",
      descriptionEn: "",
      iconName: "Heart",
      bgClass: "bg-emerald-500",
      accentClass: "text-emerald-700",
      mainImage: ""
    })
    setErrors({})
    setStatus(null)
    setShowForm(true)
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name || "",
      titleEn: service.titleEn || "",
      slug: service.slug || "",
      description: service.description || "",
      descriptionEn: service.descriptionEn || "", 
      iconName: service.iconName || "Heart",
      bgClass: service.bgClass || "bg-emerald-500",
      accentClass: service.accentClass || "text-emerald-700",
      mainImage: service.mainImage || ""
    })
    setErrors({})
    setStatus(null)
    setShowForm(true)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Le titre est obligatoire"
    if (!formData.description.trim()) newErrors.description = "La description est obligatoire"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setStatus(null)

    try {
      const payload: Partial<Service> = {
        name: formData.name,
        titleEn: formData.titleEn,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formData.description,
        descriptionEn: formData.descriptionEn,
        iconName: formData.iconName,
        bgClass: formData.bgClass,
        accentClass: formData.accentClass,
        mainImage: formData.mainImage,
        isActive: true,
        order: editingService ? editingService.order : services.length,
      };

      if (editingService) {
        await domainService.update(editingService.id, payload)
        setStatus({ type: 'success', message: "Service mis à jour avec succès !" })
      } else {
        await domainService.create(payload)
        setStatus({ type: 'success', message: "Nouveau service créé !" })
      }
      
      loadServices()
      setTimeout(() => setShowForm(false), 1500)
    } catch (err) {
      setStatus({ type: 'error', message: "Erreur lors de l'enregistrement." })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) return
    try {
      await domainService.delete(id)
      setStatus({ type: 'success', message: "Service supprimé avec succès." })
      loadServices()
    } catch (err) {
      setStatus({ type: 'error', message: "Erreur lors de la suppression." })
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingService(null)
  }

  if (fetching && !showForm) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-apc-green" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {showForm ? (editingService ? "Modifier le Service" : "Nouveau Service") : "Gestion des Services"}
          </h1>
          <p className="text-gray-500 text-sm">
            {showForm 
              ? "Remplissez les informations ci-dessous pour enregistrer le service." 
              : "Configurez les domaines d'intervention d'Agri-Peace and Child."}
          </p>
        </div>
        {!showForm && (
          <Button onClick={handleAdd} className="gap-2 bg-apc-green hover:bg-green-700">
            <Plus size={18} /> Ajouter un Service
          </Button>
        )}
        {showForm && (
          <Button onClick={handleCancel} variant="outline" className="gap-2">
            <ArrowLeft size={18} /> Retour à la liste
          </Button>
        )}
      </div>

      {!showForm ? (
        /* TABLEAU DE LISTE */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Icône</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Titre (FR)</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.map((service) => {
                // @ts-ignore
                const IconComponent = LucideIcons[service.iconName || 'Heart'] || LucideIcons.Heart;
                return (
                <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className={`w-10 h-10 rounded-lg ${service.bgClass || 'bg-emerald-500'} flex items-center justify-center text-white`}>
                      <IconComponent size={20} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{service.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">{service.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/domaines#${service.slug}`} target="_blank">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                          title="Voir sur le site public"
                        >
                          <Eye size={16} />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(service)}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(service.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      ) : (
        /* FORMULAIRE D'EDITION / AJOUT */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-8 space-y-8">
            {status && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <span className="text-sm font-medium">{status.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Colonne Gauche (Français) */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-apc-green font-bold border-b border-gray-100 pb-2 text-lg">
                  <span className="px-2 py-0.5 rounded bg-apc-green/10 text-xs uppercase">FR</span> Langue Française
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Titre du service (FR) *</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all`} 
                      placeholder="Ex: Sécurité Alimentaire" 
                    />
                    {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Description détaillée (FR) *</label>
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all h-32`} 
                      placeholder="Décrivez le domaine d'intervention..."
                    />
                    {errors.description && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.description}</p>}
                  </div>
                </div>
              </div>

              {/* Colonne Droite (Anglais) */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-apc-blue font-bold border-b border-gray-100 pb-2 text-lg">
                  <span className="px-2 py-0.5 rounded bg-apc-blue/10 text-xs uppercase">EN</span> Langue Anglaise
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Service Title (EN)</label>
                    <input 
                      type="text" 
                      value={formData.titleEn}
                      onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 focus:border-apc-blue transition-all" 
                      placeholder="Ex: Food Security" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Detailed Description (EN)</label>
                    <textarea 
                      value={formData.descriptionEn}
                      onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 focus:border-apc-blue transition-all h-32" 
                      placeholder="Describe the area of intervention..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image de Couverture */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Image Principale</h3>
              <ImageUploader 
                value={formData.mainImage}
                onChange={(url) => setFormData({ ...formData, mainImage: url })}
                label="Image de couverture du domaine"
              />
            </div>

            {/* Configuration Icone et Couleurs */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Identité Visuelle</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400">Icône (Lucide React)</label>
                  <input 
                    type="text" 
                    value={formData.iconName}
                    onChange={e => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none font-mono text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400">Couleur d&apos;accentuation (Classe Tailwind Text)</label>
                  <input 
                    type="text" 
                    value={formData.accentClass}
                    onChange={e => setFormData({ ...formData, accentClass: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none font-mono text-sm" 
                    placeholder="Ex: text-emerald-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400">Couleur de fond (Classe Tailwind Bg)</label>
                  <div className="flex gap-3 flex-wrap">
                    {["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-rose-500", "bg-apc-green", "bg-apc-blue", "bg-indigo-500"].map((color) => (
                      <button 
                        key={color} 
                        type="button"
                        onClick={() => setFormData({ ...formData, bgClass: color })}
                        className={`w-8 h-8 rounded-full ${color} ring-offset-2 transition-all ${formData.bgClass === color ? 'ring-2 ring-gray-900 scale-110' : 'hover:ring-2 ring-gray-300'}`} 
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Formulaire */}
          <div className="bg-gray-50 px-8 py-6 flex justify-end gap-3 border-t border-gray-100">
            <Button variant="ghost" onClick={handleCancel} disabled={loading} className="text-gray-500">Annuler</Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-apc-green hover:bg-green-700 gap-2 px-8 min-w-[180px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={18} /> {editingService ? "Mettre à jour" : "Enregistrer le Service"}
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
