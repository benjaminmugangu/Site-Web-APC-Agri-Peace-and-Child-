"use client"

import React, { useState, useEffect } from "react"
import { 
  Plus, Edit, Trash2, Mail, Phone, UserPlus, ArrowLeft, 
  Save, AlertCircle, CheckCircle2, FileText, Loader2, 
  Search, Filter, Users, Tag, Calendar, Linkedin 
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { listTeam, createTeamMember, updateTeamMember, deleteTeamMember, getTeamMember } from "@/lib/api/team"
import { listAllDepartments, type Department } from "@/lib/api/departments"
import { useRole } from "@/hooks/useRole"
import { toast } from "sonner"

export default function AdminEquipePage() {
  const { canWrite } = useRole()
  const canEdit = canWrite('rh')
  const [team, setTeam] = useState<any[]>([])
  const [filteredTeam, setFilteredTeam] = useState<any[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Filters State
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDept, setSelectedDept] = useState("ALL")
  const [selectedStatus, setSelectedStatus] = useState("ALL")

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    bio: "",
    photo: "",
    photoUrl: "",
    department: "Programmes",
    status: "active",
    linkedinUrl: "",
    order: 0
  })

  async function load() {
    setFetching(true)
    try {
      const [members, depts] = await Promise.all([
        listTeam({ adminMode: true }),
        listAllDepartments()
      ])
      setTeam(members || [])
      setFilteredTeam(members || [])
      setDepartments(depts || [])
    } catch (error) {
      toast.error("Erreur de chargement des données")
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // Filter application
  useEffect(() => {
    let filtered = [...team]

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(m => 
        (m.name && m.name.toLowerCase().includes(query)) || 
        (m.role && m.role.toLowerCase().includes(query)) ||
        (m.email && m.email.toLowerCase().includes(query))
      )
    }

    if (selectedDept !== "ALL") {
      filtered = filtered.filter(m => m.department === selectedDept)
    }

    if (selectedStatus !== "ALL") {
      filtered = filtered.filter(m => m.status === selectedStatus)
    }

    setFilteredTeam(filtered)
  }, [searchQuery, selectedDept, selectedStatus, team])

  const handleAdd = () => {
    setEditingMember(null)
    setErrorMsg(null)
    setFormData({ 
      name: "", 
      role: "", 
      email: "", 
      phone: "", 
      bio: "", 
      photo: "", 
      photoUrl: "",
      department: "Programmes",
      status: "active",
      linkedinUrl: "",
      order: 0 
    })
    setShowForm(true)
  }

  const handleEdit = async (id: string) => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const member = await getTeamMember(id)
      if (!member) {
        toast.error("Membre introuvable")
        return
      }
      setEditingMember(member)
      setFormData({
        name: member.name || "",
        role: member.role || "",
        email: member.email || "",
        phone: member.phone || "",
        bio: member.bio || "",
        photo: member.photoUrl || member.photo || "",
        photoUrl: member.photoUrl || "",
        department: member.department || "Programmes",
        status: member.status || "active",
        linkedinUrl: member.linkedinUrl || "",
        order: member.order || 0
      })
      setShowForm(true)
    } catch (error) {
      toast.error("Erreur de chargement des détails du membre")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    
    // Ensure both photo and photoUrl are synced
    const payload: any = {
      ...formData,
      photoUrl: formData.photo
    }

    // Clean up empty strings to avoid DTO validation errors on backend
    if (payload.email === "") payload.email = null;
    if (payload.linkedinUrl === "") payload.linkedinUrl = null;
    if (payload.phone === "") payload.phone = null;
    if (payload.bio === "") payload.bio = null;
    if (payload.photo === "") payload.photo = null;
    if (payload.photoUrl === "") payload.photoUrl = null;

    try {
      if (editingMember) {
        await updateTeamMember(editingMember.id, payload)
        toast.success("Profil mis à jour avec succès !")
      } else {
        await createTeamMember(payload)
        toast.success("Nouveau membre ajouté avec succès !")
      }
      setShowForm(false)
      load()
    } catch (err: any) {
      const serverMessage = err.errors && Array.isArray(err.errors)
        ? err.errors.map((e: any) => `${e.property}: ${e.constraints.join(', ')}`).join('\n')
        : (err.message || "Erreur lors de l'enregistrement");
      setErrorMsg(serverMessage);
      toast.error("Erreur de validation. Veuillez vérifier les champs.");
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment retirer ce membre de l'équipe ?")) {
      try {
        await deleteTeamMember(id)
        toast.success("Membre retiré de l'équipe")
        load()
      } catch (error) {
        toast.error("Erreur lors de la suppression")
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingMember(null)
    setErrorMsg(null)
  }

  const getDeptColor = (dept: string) => {
    switch (dept) {
      case 'Direction': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Protection': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Agriculture': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Finance': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">Actif</span>
      case 'suspended':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Suspendu</span>
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">En attente</span>
    }
  }

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">Chargement de l'équipe...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-emerald-600" />
            {showForm ? (editingMember ? "Modifier le Profil" : "Nouvel Expert") : "Gestion de l'Équipe"}
          </h1>
          <p className="text-gray-500 text-sm">
            {showForm 
              ? "Saisissez les informations professionnelles du collaborateur." 
              : "Gérez les membres de l'organisation et les experts affichés sur le site."}
          </p>
        </div>
        {!showForm && canEdit && (
          <Button onClick={handleAdd} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-6 rounded-xl shadow-lg shadow-emerald-600/10">
            <UserPlus size={18} /> Ajouter un Expert
          </Button>
        )}
        {!showForm && !canEdit && (
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg font-medium">👁️ Lecture seule</span>
        )}
        {showForm && (
          <Button onClick={handleCancel} variant="outline" className="gap-2 border-gray-200 hover:bg-gray-50">
            <ArrowLeft size={18} /> Retour à l'annuaire
          </Button>
        )}
      </div>

      {!showForm ? (
        /* LISTE DES MEMBRES */
        <div className="space-y-4">
          {/* Filters Panel */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher par nom, rôle..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-gray-400" />
                <select
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none"
                >
                  <option value="ALL">Tous les départements</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Filter size={14} className="text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none"
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="suspended">Suspendu</option>
                  <option value="pending">En attente</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Membre</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rôle / Département</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact & Liens</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTeam.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-400">
                        <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        Aucun membre trouvé correspondant aux critères.
                      </td>
                    </tr>
                  ) : filteredTeam.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {member.photoUrl || member.photo ? (
                            <img src={member.photoUrl || member.photo} className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-sm" alt={member.name} />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold shrink-0 border border-emerald-100 shadow-sm">
                              {member.name ? member.name.charAt(0) : "M"}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-900 leading-snug">{member.name}</div>
                            <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Ordre: {member.order || 0}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-gray-800">{member.role}</div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDeptColor(member.department)}`}>
                            {member.department || "Programmes"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-xs">
                          {member.email && (
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <Mail size={12} className="text-blue-500" /> {member.email}
                            </div>
                          )}
                          {member.phone && (
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <Phone size={12} className="text-emerald-500" /> {member.phone}
                            </div>
                          )}
                          {member.linkedinUrl && (
                            <div className="flex items-center gap-1.5 text-blue-600 font-medium">
                              <Linkedin size={12} /> LinkedIn Profil
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(member.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(member.id)}
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit size={15} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(member.id)}
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
                  value={formData.photo}
                  onChange={(url) => setFormData({ ...formData, photo: url })}
                  label="Photo de profil"
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
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm" 
                      placeholder="Ex: Jean Mukendi" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Poste / Fonction *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm" 
                      placeholder="Ex: Coordinateur de Terrain" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Département *</label>
                    <select 
                      value={formData.department}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                    >
                      {departments.length === 0 ? (
                        <option value="Programmes">Programmes (par défaut)</option>
                      ) : (
                        departments.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Statut *</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                    >
                      <option value="active">Actif</option>
                      <option value="suspended">Suspendu</option>
                      <option value="pending">En attente</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Adresse E-mail</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                      placeholder="jean@agripeace.org" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Téléphone (WhatsApp)</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                      placeholder="+243..." 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Lien Profil LinkedIn</label>
                    <input 
                      type="url" 
                      value={formData.linkedinUrl}
                      onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                      placeholder="https://linkedin.com/in/..." 
                    />
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
                  <label className="text-xs font-bold text-gray-400 uppercase">Courte Biographie (Optionnel)</label>
                  <textarea 
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none h-28 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    placeholder="Parcours professionnel résumé de l'expert..."
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
                  <Save size={18} /> {editingMember ? "Enregistrer les modifications" : "Créer le profil"}
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
