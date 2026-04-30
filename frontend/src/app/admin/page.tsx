import {
  Users,
  Cog,
  Briefcase,
  Search,
  Handshake,
  MessageSquare,
  Plus,
  Clock,
  ArrowUpRight,
  LayoutDashboard,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getDashboardStats, getRecentActivity, getMessagesByType } from "@/lib/data/mock-dashboard"

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
  const messageStats = getMessagesByType()

  const adminCards = [
    {
      label: stats.services.label,
      value: stats.services.value,
      icon: Cog,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: stats.services.href,
      description: stats.services.description,
    },
    {
      label: stats.realisations.label,
      value: stats.realisations.value,
      subValue: stats.realisations.subValue,
      icon: Briefcase,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: stats.realisations.href,
      description: stats.realisations.description,
    },
    {
      label: stats.emplois.label,
      value: stats.emplois.value,
      icon: Search,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: stats.emplois.href,
      description: stats.emplois.description,
    },
    {
      label: stats.equipe.label,
      value: stats.equipe.value,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      href: stats.equipe.href,
      description: stats.equipe.description,
    },
    {
      label: stats.partenaires.label,
      value: stats.partenaires.value,
      icon: Handshake,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      href: stats.partenaires.href,
      description: stats.partenaires.description,
    },
    {
      label: stats.appels.label,
      value: stats.appels.value,
      icon: FileText,
      color: "text-red-600",
      bg: "bg-red-50",
      href: stats.appels.href,
      description: stats.appels.description,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Administration</h1>
          <p className="text-gray-500 text-sm mt-1">Gestion des contenus de la plateforme Agri-Peace and Child.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/projets/editeur">
            <Button className="gap-2 bg-[#1a472a] hover:bg-[#2d6a4f]">
              <Plus size={18} /> Nouveau Projet
            </Button>
          </Link>
        </div>
      </div>

      {/* Admin Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-5">
        {adminCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col group">
            <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <card.icon size={24} className={card.color} />
            </div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">{card.label}</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-gray-900">{card.value}</span>
              {card.subValue && <span className="text-xs text-emerald-600 font-medium ml-1">({card.subValue})</span>}
            </div>
            <Link href={card.href} className="mt-6 text-sm text-apc-green font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              {card.description}
            </Link>
          </div>
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

        {/* Messages */}
        <div className="bg-[#1a472a] rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div>
            <h3 className="font-bold mb-1 flex items-center gap-2 relative z-10">
              <MessageSquare size={16} className="text-white/70" /> Centre de Messages
            </h3>
            <div className="relative z-10 space-y-4 my-6">
              <div className="flex justify-between items-center text-sm bg-white/5 p-3 rounded-xl">
                <span className="text-white/70">Non lus</span>
                <span className="font-bold text-2xl text-white">{messageStats.unread}</span>
              </div>
              <div className="flex justify-between items-center text-sm bg-white/5 p-3 rounded-xl">
                <span className="text-white/70">Demandes de don</span>
                <span className="font-bold text-xl text-white">{messageStats.donation}</span>
              </div>
              <div className="flex justify-between items-center text-sm bg-white/5 p-3 rounded-xl">
                <span className="text-white/70">Partenariats</span>
                <span className="font-bold text-xl text-white">{messageStats.partnership}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {messageStats.unread > 0 && (
              <div className="relative z-10 bg-apc-alert/20 rounded-xl px-3 py-2 text-xs text-white border border-apc-alert/30">
                🔴 {messageStats.unread} message(s) en attente
              </div>
            )}
            <Link href="/admin/messages" className="relative z-10 block">
              <Button variant="secondary" size="sm" className="w-full bg-white text-apc-green hover:bg-gray-100 border-0 text-xs font-bold">
                Accéder à la messagerie →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
