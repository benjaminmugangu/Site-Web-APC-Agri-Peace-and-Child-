"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield, 
  UserCheck, 
  UserX,
  Mail,
  Calendar,
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react"
import { userService, type User, type UserRole } from "@/lib/api/users"
import { toast } from "sonner"

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Modal State
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "ADMIN" as UserRole,
    isActive: true
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const data = await userService.list()
      setUsers(data)
    } catch (error) {
      toast.error("Erreur lors du chargement des utilisateurs")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return
    
    try {
      const success = await userService.delete(id)
      if (success) {
        toast.success("Utilisateur supprimé")
        loadUsers()
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    }
  }

  const filteredUsers = users.filter(user => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAdd = () => {
    setEditingUser(null)
    setFormData({ firstName: "", lastName: "", email: "", password: "", role: "ADMIN", isActive: true })
    setStatus(null)
    setShowForm(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "", // On ne charge pas le mot de passe
      role: user.role,
      isActive: user.isActive
    })
    setStatus(null)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setStatus(null)

    try {
      if (editingUser) {
        // En cas d'édition, ne pas envoyer le mot de passe s'il est vide
        const payload: any = { ...formData }
        if (!payload.password) delete payload.password
        await userService.update(editingUser.id, payload)
        toast.success("Utilisateur mis à jour")
      } else {
        // Il faudrait un endpoint create dans userService (on va l'appeler via un POST manuel ici)
        // Mais simulons ou utilisons un appel custom si le userService.create manque
        // @ts-ignore
        if (userService.create) {
          // @ts-ignore
          await userService.create(formData)
        } else {
          // Fallback direct apiClient
          const { apiClient } = await import('@/lib/api/api-client');
          await apiClient.post('/users', formData);
        }
        toast.success("Utilisateur créé")
      }
      setShowForm(false)
      loadUsers()
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || "Une erreur est survenue" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-emerald-600" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-slate-500">Gérez les comptes et les permissions de l'équipe administrative.</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
          <UserPlus className="h-4 w-4" />
          Nouvel Utilisateur
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white transition-colors">
              <Filter className="h-4 w-4" />
              Filtrer
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Utilisateur</th>
                <th className="px-6 py-4 font-semibold">Rôle</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold">Dernière Connexion</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 w-40 bg-slate-100 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-100 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-100 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-100 rounded"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 w-8 bg-slate-100 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold uppercase shadow-inner">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 capitalize">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-slate-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Shield className={`h-4 w-4 ${user.role === 'ADMIN' ? 'text-amber-500' : 'text-slate-400'}`} />
                        <span className="text-sm font-medium">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20' 
                          : 'bg-slate-100 text-slate-600 ring-1 ring-slate-400/20'
                      }`}>
                        {user.isActive ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                        {user.isActive ? "Actif" : "Désactivé"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-500 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Jamais'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(user)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Users className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                    <p>Aucun utilisateur trouvé.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Formulaire */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                {editingUser ? "Modifier l'utilisateur" : "Nouvel Utilisateur"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-2 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {status && (
                <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {status.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {status.message}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Prénom *</label>
                  <input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Nom *</label>
                  <input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Email *</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  {editingUser ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe *"}
                </label>
                <input type="password" required={!editingUser} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Rôle *</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="ADMIN">Administrateur</option>
                    <option value="EDITOR">Éditeur</option>
                    <option value="USER">Utilisateur</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Statut *</label>
                  <select value={formData.isActive ? "true" : "false"} onChange={e => setFormData({...formData, isActive: e.target.value === "true"})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option value="true">Actif</option>
                    <option value="false">Désactivé</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-medium">
                  Annuler
                </button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {editingUser ? "Enregistrer" : "Créer l'utilisateur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
