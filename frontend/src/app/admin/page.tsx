"use client"

import {
  Users,
  Cog,
  Briefcase,
  Search,
  Newspaper,
  Plus,
  Clock,
  FileText,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { dashboardService, type DashboardStats, type DashboardStatsAdmin } from "@/lib/api/dashboard"
import { useRole } from "@/hooks/useRole"

function isAdmin(stats: DashboardStats): stats is DashboardStatsAdmin {
  return stats.role === 'ADMIN'
}

export default function AdminDashboard() {
  const { isAdmin: userIsAdmin } = useRole()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.getStats().then((data) => {
      setStats(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apc-green"></div>
      </div>
    )
  }

  // ─── Construction des cards dynamiques selon le rôle ──────────────────────
  type CardDef = {
    label: string
    value: number | string
    href: string
    description: string
    badge?: string
    icon: React.ElementType
    color: string
    bg: string
  }

  const cards: CardDef[] = []

  if (stats && isAdmin(stats)) {
    cards.push(
      { label: stats.services.label, value: stats.services.total, href: stats.services.href, description: "Gérer les services →", icon: Cog, color: "text-blue-600", bg: "bg-blue-50" },
      { label: stats.projets.label, value: stats.projets.total, href: stats.projets.href, description: `${stats.projets.publies} publiés →`, icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: stats.actualites.label, value: stats.actualites.total, href: stats.actualites.href, description: `${stats.actualites.publiees} publiées →`, icon: Newspaper, color: "text-cyan-600", bg: "bg-cyan-50" },
      { label: stats.messages.label, value: stats.messages.total, href: stats.messages.href, description: "Voir les messages →", icon: MessageSquare, color: "text-orange-600", bg: "bg-orange-50", badge: stats.messages.nonLus > 0 ? `${stats.messages.nonLus} non lu(s)` : undefined },
    )
  }

  if (stats) {
    cards.push(
      { label: stats.emplois.label, value: stats.emplois.total, href: stats.emplois.href, description: `${stats.emplois.actifs} actif(s) →`, icon: Search, color: "text-amber-600", bg: "bg-amber-50" },
      { label: stats.equipe.label, value: stats.equipe.total, href: stats.equipe.href, description: "Gérer l'équipe →", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
      { label: stats.appels.label, value: stats.appels.total, href: stats.appels.href, description: `${stats.appels.actifs} actif(s) →`, icon: FileText, color: "text-red-600", bg: "bg-red-50" },
    )
  }

  if (stats && isAdmin(stats) && userIsAdmin) {
    cards.push(
      { label: "Utilisateurs", value: "👥", href: "/admin/utilisateurs", description: "Gérer les accès →", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
      { label: "Paramètres", value: "⚙️", href: "/admin/parametres", description: "Configuration globale →", icon: Cog, color: "text-slate-600", bg: "bg-slate-50" },
    )
  }

  const unreadMessages = stats && isAdmin(stats) ? stats.messages.nonLus : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Administration</h1>
          <p className="text-gray-500 text-sm mt-1">Gestion des contenus de la plateforme Agri-Peace and Child.</p>
        </div>
        {userIsAdmin && (
          <div className="flex gap-3">
            <Link href="/admin/projets/editeur">
              <Button className="gap-2 bg-[#1a472a] hover:bg-[#2d6a4f]">
                <Plus size={18} /> Nouveau Projet
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="block">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer h-full relative">
              {card.badge && (
                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {card.badge}
                </span>
              )}
              <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <card.icon size={24} className={card.color} />
              </div>
              <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">{card.label}</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-gray-900">{card.value}</span>
              </div>
              <span className="mt-6 text-sm text-apc-green font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                {card.description}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Notifications */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Clock size={18} className="text-apc-green" /> Notifications &amp; Activités Récentes
            </h3>
            <span className="text-xs text-gray-400 font-medium px-2 py-1 bg-gray-100 rounded-full">
              {unreadMessages > 0 ? `${unreadMessages} message(s) non lu(s)` : "0 nouvelles alertes"}
            </span>
          </div>
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-500">Aucune activité récente enregistrée.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
