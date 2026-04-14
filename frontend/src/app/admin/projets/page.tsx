import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"

const projects = [
  { 
    id: 1, 
    title: "Protection Civile Goma", 
    category: "Protection", 
    statut: "Publié", 
    date: "12/04/2026",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=200&h=150&auto=format&fit=crop"
  },
  { 
    id: 2, 
    title: "Agriculture Durable Kivu", 
    category: "Agriculture", 
    statut: "Brouillon", 
    date: "10/04/2026",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=200&h=150&auto=format&fit=crop"
  },
  { 
    id: 3, 
    title: "Dignité pour Tous", 
    category: "Dignité", 
    statut: "Publié", 
    date: "05/04/2026",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=200&h=150&auto=format&fit=crop"
  },
]

export default function AdminProjects() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Projets</h1>
          <p className="text-gray-500 text-sm">Créez, modifiez et gérez la visibilité de vos actions humanitaires.</p>
        </div>
        <Button className="gap-2 bg-[#1a472a] hover:bg-[#2d6a4f]">
          <Plus size={18} /> Nouveau Projet
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un projet..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-greenLight/20 focus:border-apc-greenLight transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="gap-2 flex-1 md:flex-none">
            <Filter size={18} /> Filtres
          </Button>
          <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-apc-greenLight/20">
            <option>Tous les statuts</option>
            <option>Publié</option>
            <option>Brouillon</option>
            <option>Archivé</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden text-black">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Projet</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-12 h-10 rounded-lg object-cover bg-gray-100"
                      />
                      <span className="font-semibold text-gray-900 truncate max-w-[200px]">{project.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold",
                      project.statut === "Publié" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    )}>
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        project.statut === "Publié" ? "bg-green-600" : "bg-amber-600"
                      )} />
                      {project.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {project.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-apc-green hover:bg-green-50">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
          <p className="text-sm text-gray-500">Affichage de 1 à 3 sur 12 projets</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Précédent</Button>
            <Button variant="outline" size="sm">Suivant</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
