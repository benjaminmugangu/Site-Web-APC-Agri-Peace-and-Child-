"use client"

import { useState, useEffect } from "react"
import { 
  Search, 
  Filter, 
  Trash2, 
  Mail, 
  MailOpen, 
  Reply, 
  MoreVertical,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Tag
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { listMessages, updateMessageStatus, deleteMessage } from "@/lib/api/messages"
import { type Message } from "@/lib/data/mock-messages"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchMessages()
  }, [filter])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const result = await listMessages({ 
        search: search || undefined,
        status: filter !== "all" ? (filter as any) : undefined
      })
      setMessages(result.data)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, status: any) => {
    try {
      await updateMessageStatus(id, status)
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m))
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce message ?")) return
    try {
      await deleteMessage(id)
      setMessages(prev => prev.filter(m => m.id !== id))
    } catch (error) {
      console.error("Failed to delete message:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages & Contacts</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez les demandes de contact, dons et partenariats.</p>
        </div>
      </div>

      {/* Barre d'outils */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher un nom, email ou sujet..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchMessages()}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 bg-white text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="unread">Non lus</option>
            <option value="read">Lus</option>
            <option value="replied">Répondu</option>
          </select>
          <Button variant="outline" className="gap-2" onClick={fetchMessages}>
            <Filter size={16} /> Actualiser
          </Button>
        </div>
      </div>

      {/* Liste des messages */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-apc-green/20 border-t-apc-green rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">Chargement des messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-20 text-center">
            <Mail className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">Aucun message trouvé.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((message) => (
              <div key={message.id} className={`p-6 hover:bg-gray-50 transition-colors group ${message.status === 'unread' ? 'bg-emerald-50/30' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      message.status === 'unread' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {message.status === 'unread' ? <Mail size={20} /> : <MailOpen size={20} />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold ${message.status === 'unread' ? 'text-gray-900' : 'text-gray-600'}`}>
                          {message.name}
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium flex items-center gap-1">
                          <Tag size={10} /> {message.type}
                        </span>
                        {message.status === 'replied' && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-medium flex items-center gap-1">
                            <CheckCircle2 size={10} /> Répondu
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{message.subject}</p>
                      <p className="text-sm text-gray-500 line-clamp-2 max-w-2xl">{message.content}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Mail size={12} /> {message.email}</span>
                        {message.phone && <span className="flex items-center gap-1"><Phone size={12} /> {message.phone}</span>}
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> 
                          {format(new Date(message.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {message.status === 'unread' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        onClick={() => handleStatusChange(message.id, 'read')}
                      >
                        Marquer comme lu
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600">
                      <Reply size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-400 hover:text-red-600"
                      onClick={() => handleDelete(message.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
