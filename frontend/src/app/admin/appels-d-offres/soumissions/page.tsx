"use client"

import React, { useState, useEffect } from "react"
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Trash2, 
  Filter,
  Loader2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { listTenderSubmissions, updateTenderSubmissionStatus, deleteTenderSubmission } from "@/lib/api/tenders"
import { TenderSubmission, TenderSubmissionStatus } from "@/types"
import { toast } from "sonner"
import { useRole } from "@/hooks/useRole"

const STATUS_LABELS: Record<TenderSubmissionStatus, string> = {
  pending: "En attente",
  reviewing: "En cours d'examen",
  accepted: "Accepté",
  rejected: "Rejeté"
}

const STATUS_COLORS: Record<TenderSubmissionStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  reviewing: "bg-blue-100 text-blue-700 border-blue-200",
  accepted: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200"
}

export default function AdminTenderSubmissionsPage() {
  const { canWrite } = useRole()
  const canEdit = canWrite('rh')
  const [submissions, setSubmissions] = useState<TenderSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedSubmission, setSelectedSubmission] = useState<TenderSubmission | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  async function loadSubmissions() {
    setLoading(true)
    try {
      const result = await listTenderSubmissions()
      setSubmissions(result || [])
    } catch (error) {
      toast.error("Erreur lors du chargement des soumissions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubmissions()
  }, [])

  const handleStatusChange = async (id: string, newStatus: TenderSubmissionStatus) => {
    try {
      await updateTenderSubmissionStatus(id, newStatus)
      toast.success("Statut mis à jour")
      loadSubmissions()
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer définitivement cette soumission ?")) {
      try {
        await deleteTenderSubmission(id)
        toast.success("Soumission supprimée")
        loadSubmissions()
      } catch (error) {
        toast.error("Erreur lors de la suppression")
      }
    }
  }

  const filteredSubmissions = submissions.filter(sub => {
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter
    const matchesSearch = 
      sub.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-apc-blue" size={48} />
      </div>
    )
  }

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Soumissions d'Appels d'Offres</h1>
          <p className="text-gray-500 text-sm">
            Gérez les soumissions reçues des prestataires pour les appels d'offres.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par entreprise, contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all"
          />
        </div>
        <div className="relative sm:min-w-[180px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-4 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all appearance-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="reviewing">En cours</option>
            <option value="accepted">Accepté</option>
            <option value="rejected">Rejeté</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">{submissions.length}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">{submissions.filter(s => s.status === 'pending').length}</div>
          <div className="text-xs text-gray-500">En attente</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{submissions.filter(s => s.status === 'reviewing').length}</div>
          <div className="text-xs text-gray-500">En cours</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{submissions.filter(s => s.status === 'accepted').length}</div>
          <div className="text-xs text-gray-500">Acceptés</div>
        </div>
      </div>

      {/* Liste des soumissions */}
      {filteredSubmissions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">Aucune soumission trouvée</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entreprise</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Appel d'offres</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-apc-blue/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-apc-blue" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{submission.companyName}</div>
                        {submission.address && (
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {submission.address}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{submission.contactName}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {submission.email}
                    </div>
                    {submission.phone && (
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {submission.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{submission.tender?.title || 'N/A'}</div>
                    <div className="text-xs text-gray-400">{submission.tender?.reference || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    {canEdit ? (
                      <select
                        value={submission.status}
                        onChange={(e) => handleStatusChange(submission.id, e.target.value as TenderSubmissionStatus)}
                        className={`text-xs px-2 py-1 rounded-lg border ${STATUS_COLORS[submission.status]} outline-none focus:ring-2 focus:ring-apc-green/20`}
                      >
                        <option value="pending">En attente</option>
                        <option value="reviewing">En cours</option>
                        <option value="accepted">Accepté</option>
                        <option value="rejected">Rejeté</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[submission.status]}`}>
                        {STATUS_LABELS[submission.status]}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(submission.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSubmission(submission)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-apc-blue"
                        title="Voir détails"
                      >
                        <Eye size={16} />
                      </Button>
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(submission.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal détails */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Détails de la soumission</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSubmission(null)}
                className="h-8 w-8 p-0"
              >
                <XCircle size={20} />
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Entreprise</h3>
                <p className="text-lg font-semibold text-gray-900">{selectedSubmission.companyName}</p>
                {selectedSubmission.address && (
                  <p className="text-sm text-gray-600">{selectedSubmission.address}</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Contact</h3>
                <p className="text-gray-900">{selectedSubmission.contactName}</p>
                <p className="text-sm text-gray-600">{selectedSubmission.email}</p>
                {selectedSubmission.phone && (
                  <p className="text-sm text-gray-600">{selectedSubmission.phone}</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Appel d'offres</h3>
                <p className="text-gray-900">{selectedSubmission.tender?.title || 'N/A'}</p>
                <p className="text-sm text-gray-600">{selectedSubmission.tender?.reference || 'N/A'}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Documents soumis</h3>
                <div className="space-y-2">
                  {selectedSubmission.technicalOfferUrl && (
                    <a
                      href={selectedSubmission.technicalOfferUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-apc-blue" />
                      <span className="text-sm">Offre technique</span>
                      <Download className="w-4 h-4 ml-auto text-gray-400" />
                    </a>
                  )}
                  {selectedSubmission.financialOfferUrl && (
                    <a
                      href={selectedSubmission.financialOfferUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-apc-blue" />
                      <span className="text-sm">Offre financière</span>
                      <Download className="w-4 h-4 ml-auto text-gray-400" />
                    </a>
                  )}
                  {selectedSubmission.adminDocUrl && (
                    <a
                      href={selectedSubmission.adminDocUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-apc-blue" />
                      <span className="text-sm">Document administratif</span>
                      <Download className="w-4 h-4 ml-auto text-gray-400" />
                    </a>
                  )}
                </div>
              </div>

              {selectedSubmission.reviewNotes && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Notes d'examen</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedSubmission.reviewNotes}</p>
                </div>
              )}

              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Soumis le {new Date(selectedSubmission.createdAt).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
