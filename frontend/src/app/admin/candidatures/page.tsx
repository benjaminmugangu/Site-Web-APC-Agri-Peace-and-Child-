"use client"

import React, { useState, useEffect, useMemo } from "react"
import { 
  Trash2, 
  Search, 
  FileText,
  AlertCircle,
  X,
  Eye,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"

import { listApplications, updateApplicationStatus, deleteApplication } from "@/lib/api/careers"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function AdminCandidaturesPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Modal
  const [selectedApp, setSelectedApp] = useState<any>(null)

  async function load() {
    setFetching(true)
    try {
      const result = await listApplications()
      setApplications(result || [])
    } catch (error) {
      toast.error("Erreur lors du chargement des candidatures")
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateApplicationStatus(id, newStatus)
      toast.success("Statut mis à jour avec succès")
      load()
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette candidature ? Cette action est irréversible.")) {
      try {
        await deleteApplication(id)
        toast.success("Candidature supprimée")
        load()
      } catch (error: any) {
        toast.error(error.message || "Erreur lors de la suppression")
      }
    }
  }

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const searchLower = searchTerm.toLowerCase()
      const fullName = `${app.firstName} ${app.lastName}`.toLowerCase()
      const matchesSearch = fullName.includes(searchLower) || 
                            app.email.toLowerCase().includes(searchLower) ||
                            (app.career?.title && app.career.title.toLowerCase().includes(searchLower))
      
      const matchesStatus = statusFilter === "all" || app.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [applications, searchTerm, statusFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200"><Clock className="w-3.5 h-3.5"/> En attente</span>
      case "reviewing":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"><Eye className="w-3.5 h-3.5"/> En cours</span>
      case "accepted":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"><CheckCircle className="w-3.5 h-3.5"/> Acceptée</span>
      case "rejected":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"><XCircle className="w-3.5 h-3.5"/> Rejetée</span>
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">{status}</span>
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      volunteer: "Bénévole",
      internship: "Stage",
      job: "Emploi",
      consultant: "Consultant"
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidatures</h1>
          <p className="text-sm text-gray-500 mt-1">Examinez et gérez les candidatures reçues.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Rechercher par nom, email, poste..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20 focus:border-[#1a472a] transition-all"
            />
          </div>
          <div className="relative sm:min-w-[180px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a472a]/20 focus:border-[#1a472a] transition-all appearance-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="reviewing">En cours</option>
              <option value="accepted">Acceptée</option>
              <option value="rejected">Rejetée</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {fetching ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#1a472a]" />
            <p>Chargement des candidatures...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune candidature</h3>
            <p className="text-gray-500">Les candidatures soumises apparaîtront ici.</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-3 text-gray-400" />
            <p>Aucune candidature ne correspond à vos critères de recherche.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Candidat</th>
                  <th className="px-6 py-4">Poste / Type</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{app.firstName} {app.lastName}</span>
                        <span className="text-gray-500 text-xs">{app.email}</span>
                        {app.phone && <span className="text-gray-400 text-xs">{app.phone}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        {app.career ? (
                          <span className="font-medium text-gray-900 truncate max-w-[200px]" title={app.career.title}>
                            {app.career.title}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Candidature spontanée</span>
                        )}
                        <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                          {getTypeLabel(app.type)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {format(new Date(app.createdAt), "dd MMM yyyy", { locale: fr })}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {app.cvUrl && (
                          <a 
                            href={app.cvUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Voir le CV"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        )}
                        <button 
                          onClick={() => setSelectedApp(app)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                          className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-[#1a472a]"
                        >
                          <option value="pending">En attente</option>
                          <option value="reviewing">En cours</option>
                          <option value="accepted">Acceptée</option>
                          <option value="rejected">Rejetée</option>
                        </select>
                        <button 
                          onClick={() => handleDelete(app.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-semibold text-lg text-gray-900">
                Candidature de {selectedApp.firstName} {selectedApp.lastName}
              </h3>
              <button 
                onClick={() => setSelectedApp(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact</h4>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">{selectedApp.email}</p>
                    <p className="text-sm text-gray-600">{selectedApp.phone || "Non renseigné"}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cible</h4>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedApp.career ? selectedApp.career.title : "Candidature spontanée"}
                    </p>
                    <p className="text-sm text-gray-600">Type: {getTypeLabel(selectedApp.type)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Lettre de Motivation</h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedApp.motivation || <span className="italic text-gray-400">Aucune lettre de motivation fournie.</span>}
                  </p>
                </div>
              </div>

              {selectedApp.cvUrl && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Curriculum Vitae</h4>
                  <a 
                    href={selectedApp.cvUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 font-medium text-sm rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FileText className="w-4 h-4" /> Consulter le CV
                  </a>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedApp(null)}>
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
