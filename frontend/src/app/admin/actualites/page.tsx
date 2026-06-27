"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  FileText,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { listArticles, deleteArticle, bulkDeleteArticles } from "@/lib/api/articles"
import { toast } from "sonner"
import { useRole } from "@/hooks/useRole"

export default function AdminActualites() {
  const { canWrite } = useRole()
  const canEdit = canWrite('tech')
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  async function load() {
    setLoading(true)
    try {
      const result = await listArticles()
      setArticles(result.data)
    } catch (error) {
      toast.error("Erreur chargement articles")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return
    try {
      await deleteArticle(id)
      toast.success("Article supprimé")
      load()
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    (a.category?.name && a.category.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-black">
          <h1 className="text-2xl font-bold">Gestion des Actualités</h1>
          <p className="text-gray-500 text-sm">Publiez des articles, des rapports et des histoires de réussite.</p>
        </div>
        <div className="flex gap-2 items-center">
          {!canEdit && (
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg font-medium">👁️ Lecture seule</span>
          )}
          {canEdit && (
            <Link href="/admin/actualites/editeur">
              <Button className="gap-2 bg-apc-green">
                <Plus size={18} /> Nouvel Article
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un article..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden text-black">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p>Chargement des articles...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-bold text-gray-500">
              <tr>
                <th className="px-6 py-4">Titre de l&apos;Article</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Auteur</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">Aucun article trouvé</td>
                </tr>
              ) : filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-3">
                    <FileText size={18} className="text-gray-400" />
                    <div className="flex flex-col">
                      <span className="truncate max-w-xs">{article.title}</span>
                      {article.mainImage && <img src={article.mainImage} alt="" className="w-10 h-6 rounded mt-1 object-cover border border-gray-100" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium">
                      {article.category?.name ?? <span className="text-gray-400 italic">—</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{article.author || "Admin"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(article.publishDate || article.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      article.status === "published" ? "bg-green-100 text-green-700" :
                      article.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {article.status === "published" ? "Publié" :
                       article.status === "scheduled" ? "Planifié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/actualites/${article.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-50" title="Voir sur le site public">
                          <Eye size={16} />
                        </Button>
                      </Link>
                      {canEdit && (
                        <Link href={`/admin/actualites/editeur?id=${article.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:bg-amber-50" title="Modifier l'article">
                            <Edit size={16} />
                          </Button>
                        </Link>
                      )}
                      {canEdit && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(article.id)}
                          title="Supprimer l'article"
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
        )}
      </div>
    </div>
  )
}
