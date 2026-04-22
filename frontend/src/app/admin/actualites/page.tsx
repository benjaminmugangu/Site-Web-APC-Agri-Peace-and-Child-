import { 
  Plus, 
  Search, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2,
  FileText
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const articles = [
  { 
    id: 1, 
    title: "Inauguration de la nouvelle école à Bukavu", 
    category: "Éducation", 
    date: "14/04/2026", 
    author: "B. Mugangu",
    status: "Publié"
  },
  { 
    id: 2, 
    title: "Rapport trimestriel sur la sécurité alimentaire", 
    category: "Rapport", 
    date: "10/04/2026", 
    author: "Admin APC",
    status: "Brouillon"
  },
  { 
    id: 3, 
    title: "L'impact du micro-crédit chez les femmes de Goma", 
    category: "Impact", 
    date: "05/04/2026", 
    author: "M. Louise",
    status: "Publié"
  },
]

export default function AdminActualites() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-black">
          <h1 className="text-2xl font-bold">Gestion des Actualités</h1>
          <p className="text-gray-500 text-sm">Publiez des articles, des rapports et des histoires de réussite.</p>
        </div>
        <Link href="/admin/actualites/editeur">
          <Button className="gap-2 bg-apc-green">
            <Plus size={18} /> Nouvel Article
          </Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un article..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden text-black">
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
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-3">
                  <FileText size={18} className="text-gray-400" />
                  {article.title}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium">
                    {article.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{article.author}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{article.date}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    article.status === "Publié" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit size={16} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600"><Trash2 size={16} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
