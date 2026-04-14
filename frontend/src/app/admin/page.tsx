import { 
  Users, 
  Leaf, 
  TrendingUp, 
  Clock, 
  Plus, 
  ArrowUpRight 
} from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  { label: "Bénéficiaires", value: "15,240", change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Hectares Cultivés", value: "450", change: "+5%", icon: Leaf, color: "text-green-600", bg: "bg-green-50" },
  { label: "Fonds Levés ($)", value: "84,000", change: "+24%", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
]

const recentActivities = [
  { id: 1, action: "Nouveau projet publié", target: "Agriculture Durable à Goma", time: "Il y a 2 heures", status: "Succès" },
  { id: 2, action: "Don reçu", target: "Anonyme - 500$", time: "Il y a 5 heures", status: "Info" },
  { id: 3, action: "Nouveau membre ajouté", target: "Jean Kabila (Équipe Paix)", time: "Hier", status: "Succès" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenue sur le Dashboard</h1>
          <p className="text-gray-500">Voici un aperçu de l&apos;impact d&apos;APC aujourd&apos;hui.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            Exporter Rapport
          </Button>
          <Button className="gap-2">
            <Plus size={18} /> Nouveau Projet
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <span className="text-green-500 text-sm font-bold flex items-center">
                {stat.change} <ArrowUpRight size={14} className="ml-1" />
              </span>
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Grid: Projects & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-black">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Clock size={20} className="text-apc-green" /> Activités Récentes
            </h3>
            <Button variant="ghost" size="sm" className="text-apc-green">Voir tout</Button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-apc-green transition-colors">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.target} • {activity.time}</p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold",
                  activity.status === "Succès" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                )}>
                  {activity.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips / Impact Graph Placeholder */}
        <div className="bg-[#1a472a] rounded-2xl p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-apc-greenLight/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4">Conseil du jour</h3>
            <p className="text-white/80 leading-relaxed mb-6">
              N&apos;oubliez pas de mettre à jour les photos du projet à Bukavu. 
              Les donateurs adorent voir des mises à jour visuelles concrètes !
            </p>
            <Button variant="secondary" className="bg-white text-[#1a472a] hover:bg-white/90">
              Gérer la Galerie
            </Button>
          </div>
          <div className="mt-8 relative z-10 pt-8 border-t border-white/10">
            <p className="text-white/60 text-sm">Quota d&apos;hébergement utilisé :</p>
            <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div className="w-1/3 h-full bg-apc-greenLight" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Utility function copied for current file scope if needed, 
// usually it would be imported from @/lib/utils but here it ensures compile
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
