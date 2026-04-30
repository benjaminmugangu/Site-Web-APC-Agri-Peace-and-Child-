import {
  Users,
  Leaf,
  TrendingUp,
  Clock,
  Plus,
  ArrowUpRight,
  MessageSquare,
  FileText,
  Folder,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getDashboardStats, getRecentActivity, getProjectsByStatus, getMessagesByType } from "@/lib/data/mock-dashboard"

const activityIcons: Record<string, string> = {
  project: "📁",
  article: "📝",
  member: "👤",
  settings: "⚙️",
  system: "⚡",
}

export default function AdminDashboard() {
  const stats = getDashboardStats()
  const recentActivity = getRecentActivity()
  const projectsByStatus = getProjectsByStatus()
  const messageStats = getMessagesByType()

  const statCards = [
    {
      label: stats.beneficiaires.label,
      value: stats.beneficiaires.value,
      change: stats.beneficiaires.change,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/admin/projets",
    },
    {
      label: stats.projetsActifs.label,
      value: stats.projetsActifs.value,
      change: stats.projetsActifs.change,
      icon: Folder,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: "/admin/projets",
    },
    {
      label: stats.fondsLeves.label,
      value: stats.fondsLeves.value,
      change: stats.fondsLeves.change,
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/admin/projets",
    },
    {
      label: stats.articlesPublies.label,
      value: stats.articlesPublies.value,
      change: stats.articlesPublies.change,
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50",
      href: "/admin/actualites",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenue sur le Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Voici un aperçu de l&apos;impact d&apos;APC aujourd&apos;hui.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/actualites/editeur">
            <Button variant="outline" className="gap-2 hidden sm:flex">
              <FileText size={16} /> Nouvel Article
            </Button>
          </Link>
          <Link href="/admin/projets/editeur">
            <Button className="gap-2 bg-[#1a472a] hover:bg-[#2d6a4f]">
              <Plus size={18} /> Nouveau Projet
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={22} className={stat.color} />
                </div>
                <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                  {stat.change} <ArrowUpRight size={12} />
                </span>
              </div>
              <p className="text-gray-500 text-xs font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Activités Récentes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Clock size={18} className="text-apc-green" /> Activités Récentes
            </h3>
            <span className="text-xs text-gray-400">{recentActivity.length} actions</span>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors flex items-center gap-4">
                <div className={`w-9 h-9 rounded-full ${activity.memberColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {activity.memberInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium truncate">
                    <span className="text-gray-500">{activity.memberName}</span>{" "}
                    {activity.action}{" "}
                    <span className="font-semibold">&quot;{activity.target}&quot;</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.elapsed}</p>
                </div>
                <span className="text-lg shrink-0">{activityIcons[activity.targetType] ?? "•"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panneau droit */}
        <div className="space-y-5">

          {/* État des projets */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Leaf size={16} className="text-apc-green" /> État des Projets
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600">Publiés</span>
                </div>
                <span className="font-bold text-gray-900">{projectsByStatus.published}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-sm text-gray-600">Brouillons</span>
                </div>
                <span className="font-bold text-gray-900">{projectsByStatus.draft}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  <span className="text-sm text-gray-600">Archivés</span>
                </div>
                <span className="font-bold text-gray-900">{projectsByStatus.archived}</span>
              </div>
            </div>
            <Link href="/admin/projets">
              <Button variant="outline" size="sm" className="w-full mt-5 text-xs">
                Gérer les projets →
              </Button>
            </Link>
          </div>

          {/* Messages */}
          <div className="bg-[#1a472a] rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <h3 className="font-bold mb-1 flex items-center gap-2 relative z-10">
              <MessageSquare size={16} className="text-white/70" /> Messages
            </h3>
            <div className="relative z-10 space-y-2 my-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Non lus</span>
                <span className="font-bold text-white">{messageStats.unread}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Demandes de don</span>
                <span className="font-bold text-white">{messageStats.donation}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Partenariats</span>
                <span className="font-bold text-white">{messageStats.partnership}</span>
              </div>
            </div>
            {messageStats.unread > 0 && (
              <div className="relative z-10 bg-white/10 rounded-xl px-3 py-2 text-xs text-white/80 mb-4 border border-white/20">
                🔴 {messageStats.unread} message(s) en attente de réponse
              </div>
            )}
            <Link href="/admin/messages" className="relative z-10 block">
              <Button variant="secondary" size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-0 text-xs">
                Voir les messages →
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
