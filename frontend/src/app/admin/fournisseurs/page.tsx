"use client"

import React, { useState, useEffect } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  ArrowLeft, 
  Save, 
  Loader2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Star,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRole } from "@/hooks/useRole"
import { toast } from "sonner"
import { 
  listSuppliers, 
  createSupplier, 
  updateSupplier, 
  deleteSupplier, 
  exportSuppliers,
  importSupplierFromSubmission 
} from "@/lib/api/suppliers"
import { Supplier, SupplierCategory } from "@/types"

const SUPPLIER_CATEGORIES: { value: SupplierCategory; label: string }[] = [
  { value: "construction", label: "Construction" },
  { value: "fournitures", label: "Fournitures" },
  { value: "services", label: "Services" },
  { value: "transport", label: "Transport" },
  { value: "consulting", label: "Consulting" },
  { value: "autre", label: "Autre" }
]

const SUPPLIER_STATUSES = ["active", "inactive", "blacklisted"]

export default function AdminFournisseursPage() {
  const { canWrite } = useRole()
  const canEdit = canWrite('rh')
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [exporting, setExporting] = useState(false)

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")

  // Form State
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    category: "autre" as SupplierCategory,
    specialties: "",
    taxId: "",
    registrationNumber: "",
    notes: ""
  })

  async function load() {
    setFetching(true)
    try {
      const params: any = {}
      if (categoryFilter) params.category = categoryFilter
      if (statusFilter) params.status = statusFilter
      if (searchTerm) params.search = searchTerm
      
      const result = await listSuppliers(params)
      setSuppliers(result || [])
    } catch (error) {
      toast.error("Erreur chargement fournisseurs")
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    load()
  }, [categoryFilter, statusFilter, searchTerm])

  const handleAdd = () => {
    setEditingSupplier(null)
    setFormData({
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      category: "autre",
      specialties: "",
      taxId: "",
      registrationNumber: "",
      notes: ""
    })
    setShowForm(true)
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      companyName: supplier.companyName,
      contactName: supplier.contactName,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address || "",
      website: supplier.website || "",
      category: supplier.category,
      specialties: supplier.specialties || "",
      taxId: supplier.taxId || "",
      registrationNumber: supplier.registrationNumber || "",
      notes: supplier.notes || ""
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, formData)
        toast.success("Fournisseur mis à jour")
      } else {
        await createSupplier(formData)
        toast.success("Fournisseur ajouté")
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
    if (confirm("Supprimer définitivement ce fournisseur ?")) {
      try {
        await deleteSupplier(id)
        toast.success("Supprimé")
        load()
      } catch (error) {
        toast.error("Erreur suppression")
      }
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const params: any = {}
      if (categoryFilter) params.category = categoryFilter
      if (statusFilter) params.status = statusFilter
      if (searchTerm) params.search = searchTerm

      const blob = await exportSuppliers(params)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fournisseurs-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Export Excel réussi")
    } catch (error) {
      toast.error("Erreur lors de l'export")
    } finally {
      setExporting(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingSupplier(null)
  }

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = !searchTerm || 
      supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !categoryFilter || supplier.category === categoryFilter
    const matchesStatus = !statusFilter || supplier.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  if (fetching) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-apc-blue" size={48} /></div>

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {showForm ? (editingSupplier ? "Modifier le Fournisseur" : "Nouveau Fournisseur") : "Gestion des Fournisseurs"}
          </h1>
          <p className="text-gray-500 text-sm">
            {showForm 
              ? "Gérez les informations des fournisseurs et prestataires." 
              : "Consultez et gérez votre base de données de fournisseurs."}
          </p>
        </div>
        {!showForm && (
          <div className="flex gap-3">
            <Button 
              onClick={handleExport} 
              disabled={exporting || filteredSuppliers.length === 0}
              variant="outline"
              className="gap-2"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download size={18} />
              )}
              Exporter Excel
            </Button>
            {canEdit && (
              <Button onClick={handleAdd} className="gap-2 bg-apc-blue hover:bg-blue-700 shadow-lg shadow-apc-blue/20 text-white font-bold">
                <Plus size={18} /> Nouveau Fournisseur
              </Button>
            )}
          </div>
        )}
        {showForm && (
          <Button onClick={handleCancel} variant="outline" className="gap-2">
            <ArrowLeft size={18} /> Retour à la liste
          </Button>
        )}
      </div>

      {!showForm ? (
        <>
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Rechercher (entreprise, contact, email)..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 text-sm"
                  />
                </div>
              </div>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none bg-white text-sm"
              >
                <option value="">Toutes catégories</option>
                {SUPPLIER_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none bg-white text-sm"
              >
                <option value="">Tous statuts</option>
                {SUPPLIER_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {(searchTerm || categoryFilter || statusFilter) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm("")
                    setCategoryFilter("")
                    setStatusFilter("")
                  }}
                  className="gap-2"
                >
                  <X size={16} /> Réinitialiser
                </Button>
              )}
            </div>
          </div>

          {/* LISTE DES FOURNISSEURS */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entreprise</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Catégorie</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400">
                      {suppliers.length === 0 ? "Aucun fournisseur enregistré" : "Aucun résultat ne correspond à votre recherche"}
                    </td>
                  </tr>
                ) : filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-apc-blue/10 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-apc-blue" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{supplier.companyName}</div>
                          {!supplier.manualEntry && (
                            <div className="text-[10px] text-apc-green font-medium flex items-center gap-1">
                              <Star size={10} className="fill-apc-green" />
                              Importé
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{supplier.contactName}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                        <Mail size={12} /> {supplier.email}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <Phone size={12} /> {supplier.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                        {SUPPLIER_CATEGORIES.find(c => c.value === supplier.category)?.label || supplier.category}
                      </span>
                      {supplier.specialties && (
                        <div className="text-[10px] text-gray-400 mt-1 max-w-[200px] truncate">
                          {supplier.specialties}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        supplier.status === 'active' ? 'bg-green-100 text-green-700' :
                        supplier.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {supplier.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {canEdit && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(supplier)}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(supplier.id)}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* FORMULAIRE FOURNISSEUR */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Raison Sociale *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.companyName}
                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20" 
                    placeholder="Nom complet de l'entreprise" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Principal *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.contactName}
                    onChange={e => setFormData({...formData, contactName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20" 
                    placeholder="Prénom & Nom" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email *</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20" 
                      placeholder="contact@entreprise.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Téléphone *</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20" 
                      placeholder="+243 XXX XXX XXX" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Adresse</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20" 
                    placeholder="Adresse physique" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Site Web</label>
                  <input 
                    type="url" 
                    value={formData.website}
                    onChange={e => setFormData({...formData, website: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20" 
                    placeholder="https://www.entreprise.com" 
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Catégorie *</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as SupplierCategory})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none bg-white text-sm"
                  >
                    {SUPPLIER_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Spécialités</label>
                  <textarea
                    value={formData.specialties}
                    onChange={e => setFormData({...formData, specialties: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 text-sm resize-none"
                    placeholder="Ex: Matériel informatique, Mobilier de bureau"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Numéro Fiscal</label>
                    <input 
                      type="text" 
                      value={formData.taxId}
                      onChange={e => setFormData({...formData, taxId: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 text-sm" 
                      placeholder="N° IF" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">N° RCCM</label>
                    <input 
                      type="text" 
                      value={formData.registrationNumber}
                      onChange={e => setFormData({...formData, registrationNumber: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 text-sm" 
                      placeholder="Numéro RCCM" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Notes internes</label>
                  <textarea
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 text-sm resize-none"
                    placeholder="Notes sur le fournisseur..."
                    rows={3}
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
                <><Save size={18} /> {editingSupplier ? "Mettre à jour" : "Ajouter le fournisseur"}</>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
