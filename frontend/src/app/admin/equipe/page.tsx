"use client"

import React, { useState } from "react"
import { Plus, Edit, Trash2, Mail, Phone, UserPlus, ArrowLeft, Save, Camera, AlertCircle, CheckCircle2, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import { listTeam, createTeamMember, updateTeamMember, deleteTeamMember, getTeamMember } from "@/lib/api/team"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"

export default function AdminEquipePage() {
  const [team, setTeam] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    bio: "",
    photo: "",
    order: 0
  })

  async function load() {
    setFetching(true)
    try {
      const result = await listTeam()
      setTeam(result?.data || [])
    } catch (error) {
      toast.error("Erreur chargement équipe")
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleAdd = () => {
    setEditingMember(null)
    setFormData({ name: "", role: "", email: "", phone: "", bio: "", photo: "", order: 0 })
    setShowForm(true)
  }

  const handleEdit = async (id: string) => {
    setLoading(true)
    try {
      const member = await getTeamMember(id)
      setEditingMember(member)
      setFormData({
        name: member.name,
        role: member.role,
        email: member.email || "",
        phone: member.phone || "",
        bio: member.bio || "",
        photo: member.photo || "",
        order: member.order || 0
      })
      setShowForm(true)
    } catch (error) {
      toast.error("Erreur chargement membre")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingMember) {
        await updateTeamMember(editingMember.id, formData)
        toast.success("Profil mis à jour")
      } else {
        await createTeamMember(formData)
        toast.success("Membre ajouté")
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
    if (confirm("Supprimer ce membre de l'équipe ?")) {
      try {
        await deleteTeamMember(id)
        toast.success("Supprimé")
        load()
      } catch (error) {
        toast.error("Erreur suppression")
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingMember(null)
  }

  if (fetching) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-emerald-600" size={48} /></div>

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {showForm ? (editingMember ? "Modifier le Profil" : "Nouvel Expert") : "Gestion de l'Équipe"}
          </h1>
          <p className="text-gray-500 text-sm">
            {showForm 
              ? "Saisissez les informations professionnelles du collaborateur." 
              : "Gérez les membres de l'organisation et les experts affichés sur le site."}
          </p>
        </div>
        {!showForm && (
          <Button onClick={handleAdd} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
            <UserPlus size={18} /> Ajouter un Expert
          </Button>
        )}
        {showForm && (
          <Button onClick={handleCancel} variant="outline" className="gap-2">
            <ArrowLeft size={18} /> Retour à l&apos;annuaire
          </Button>
        )}
      </div>

      {!showForm ? (
        /* LISTE DES MEMBRES */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Membre</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {team.length === 0 ? (
                 <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-400">Aucun membre enregistré</td>
                 </tr>
              ) : team.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {member.photo ? (
                        <img src={member.photo} className="w-10 h-10 rounded-full object-cover border border-gray-100" alt={member.name} />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0 border border-emerald-200">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div className="font-bold text-gray-900">{member.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-md inline-block font-medium">
                      {member.role}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Mail size={12} className="text-blue-600" /> {member.email || "-"}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Phone size={12} className="text-emerald-600" /> {member.phone || "-"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(member.id)}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(member.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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
      ) : (
        /* FORMULAIRE D'EDITION */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-10">
              {/* Photo Upload Simulation */}
              <div className="w-full md:w-48 space-y-4">
                {formData.photo ? (
                  <div className="aspect-square rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                    <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setFormData({...formData, photo: ""})}
                      className="w-full mt-2 text-red-500 text-[10px] font-bold"
                    >SUPPRIMER PHOTO</Button>
                  </div>
                ) : (
                  <div className="aspect-square rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-2">
                    <Camera size={32} />
                    <span className="text-xs font-medium px-4 text-center text-gray-400">Photo du profil</span>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">URL de la Photo</label>
                  <input 
                    type="text" 
                    value={formData.photo}
                    onChange={e => setFormData({...formData, photo: e.target.value})}
                    placeholder="Lien de l'image..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[11px] focus:outline-none"
                  />
                </div>
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                      placeholder="Ex: Coordinateur de Terrain" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Adresse E-mail</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" 
                      placeholder="jean@agripeace.org" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Téléphone (WhatsApp)</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" 
                      placeholder="+243..." 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Ordre d'affichage</label>
                    <input 
                      type="number" 
                      value={formData.order}
                      onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Courte Biographie (Optionnel)</label>
                  <textarea 
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none h-24 text-sm" 
                    placeholder="Parcours professionnel résumé..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-gray-50 px-8 py-6 flex justify-end gap-3 border-t border-gray-100">
            <Button variant="ghost" onClick={handleCancel} disabled={loading}>Annuler</Button>
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
