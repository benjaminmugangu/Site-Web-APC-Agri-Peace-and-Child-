"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle2,
  AlertTriangle,
  GripVertical,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { messageSubjectsApi } from "@/lib/api/message-subjects"
import { type MessageSubject } from "@/types"
import { useRole } from "@/hooks/useRole"

export default function MessageSubjectsPage() {
  const { isAdmin } = useRole()
  // Seul l'admin tech (isAdmin) peut gérer la structure des formulaires (pas l'admin RH)
  const canEdit = isAdmin
  
  const [subjects, setSubjects] = useState<MessageSubject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<MessageSubject | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    isActive: true,
    order: 0
  })

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await messageSubjectsApi.getMessageSubjects(true) // all=true (auth required)
      setSubjects(data)
    } catch (err: any) {
      console.error("Failed to fetch message subjects:", err)
      setError("Impossible de charger les sujets. Veuillez vérifier votre connexion au serveur backend.")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    if (!canEdit) return
    setError(null)
    try {
      await messageSubjectsApi.toggleMessageSubjectStatus(id)
      setSubjects(prev => prev.map(s => s.id === id ? { ...s, isActive: !currentStatus } : s))
      setSuccess("Statut modifié avec succès !")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error("Failed to toggle status:", err)
      setError("Impossible de modifier le statut. Serveur injoignable.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!canEdit) return
    if (!confirm("Voulez-vous vraiment supprimer ce sujet ? Les messages associés perdront cette référence.")) return
    setError(null)
    try {
      const ok = await messageSubjectsApi.deleteMessageSubject(id)
      if (ok) {
        setSubjects(prev => prev.filter(s => s.id !== id))
        setSuccess("Sujet supprimé avec succès.")
        setTimeout(() => setSuccess(null), 3000)
      } else {
        throw new Error("Delete failed");
      }
    } catch (err: any) {
      console.error("Failed to delete subject:", err)
      setError("Impossible de supprimer le sujet. Vérifiez s'il est lié à des messages.")
    }
  }

  const openModalForNew = () => {
    setEditingSubject(null)
    setFormData({ name: "", nameEn: "", isActive: true, order: subjects.length + 1 })
    setIsModalOpen(true)
  }

  const openModalForEdit = (subject: MessageSubject) => {
    setEditingSubject(subject)
    setFormData({
      name: subject.name,
      nameEn: subject.nameEn || "",
      isActive: subject.isActive,
      order: subject.order
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError("Le nom en français est requis.")
      return
    }

    setError(null)
    try {
      if (editingSubject) {
        const updated = await messageSubjectsApi.updateMessageSubject(editingSubject.id, formData)
        setSubjects(prev => prev.map(s => s.id === updated.id ? updated : s))
        setSuccess("Sujet modifié avec succès.")
      } else {
        const created = await messageSubjectsApi.createMessageSubject(formData)
        setSubjects(prev => [...prev, created].sort((a, b) => a.order - b.order))
        setSuccess("Nouveau sujet créé avec succès.")
      }
      setIsModalOpen(false)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error("Failed to save subject:", err)
      setError(err.message || err.response?.data?.message || "Erreur lors de la sauvegarde du sujet.")
    }
  }

  if (!canEdit && !loading) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-700 rounded-xl">
        <AlertTriangle className="mx-auto mb-4" size={48} />
        <h2 className="text-xl font-bold">Accès Refusé</h2>
        <p className="mt-2">Vous n'avez pas les droits d'administration technique pour gérer la structure des formulaires.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sujets de Contact</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez les motifs du formulaire de contact public.</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button onClick={openModalForNew} className="bg-apc-green hover:bg-apc-green/90 text-white gap-2">
            <Plus size={18} /> Ajouter un sujet
          </Button>
        </div>
      </div>

      {/* Alertes de feedback */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 text-sm flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle size={18} className="text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 text-sm shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        </div>
      )}

      {/* Liste des sujets */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-apc-green/20 border-t-apc-green rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 font-medium">Chargement des sujets...</p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-gray-500 font-medium">Aucun sujet de contact configuré.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {subjects.map((subject) => (
              <div key={subject.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-gray-300 cursor-grab">
                    <GripVertical size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{subject.name}</h3>
                    {subject.nameEn && (
                      <p className="text-sm text-gray-500">EN: {subject.nameEn}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 mr-4">
                    <span className={`text-xs font-semibold ${subject.isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {subject.isActive ? 'Actif' : 'Inactif'}
                    </span>
                    <button 
                      onClick={() => handleToggleStatus(subject.id, subject.isActive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${subject.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${subject.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                    onClick={() => openModalForEdit(subject)}
                  >
                    <Edit2 size={18} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    onClick={() => handleDelete(subject.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Création/Edition (Custom HTML) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingSubject ? "Modifier le sujet" : "Nouveau sujet de contact"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nom (Français) *</label>
                <input
                  type="text"
                  placeholder="Ex: Demande de partenariat"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nom (Anglais)</label>
                <input
                  type="text"
                  placeholder="Ex: Partnership request"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ordre d'affichage</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20"
                />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <label className="text-sm font-medium text-gray-700">Actif sur le formulaire public</label>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
              <Button onClick={handleSave} className="bg-apc-green hover:bg-apc-green/90 text-white">
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

