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
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { listProjects } from "@/lib/api/projects"
import { listTeam } from "@/lib/api/team"
import { listMessages } from "@/lib/api/messages"
import { listCareers } from "@/lib/api/careers"
import { listArticles } from "@/lib/api/articles"
import { listTenders } from "@/lib/api/tenders"
import { domainService } from "@/lib/api/services"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        // Use Promise.allSettled so one failed API doesn't crash the entire dashboard
        const results = await Promise.allSettled([
          listProjects({ limit: 1 }),
          listTeam(),
          listMessages({ perPage: 1 }),
          listCareers(),
          listArticles({ perPage: 1 }),
          listTenders(),
          domainService.list()
        ])

        const getValue = (result: PromiseSettledResult<any>, fallback: any = []) => {
          return result.status === 'fulfilled' ? result.value : fallback
        }

        const projects = getValue(results[0])
        const team = getValue(results[1])
        const messages = getValue(results[2])
        const careers = getValue(results[3])
        const articles = getValue(results[4])
        const tenders = getValue(results[5])
        const services = getValue(results[6])

        setStats({
          services: { value: Array.isArray(services) ? services.length : 0, label: "Nos Services", href: "/admin/services", description: "Gérer les services →" },
          realisations: { value: projects?.meta?.total || 0, label: "Réalisations", href: "/admin/projets", description: "Voir les projets →" },
          emplois: { value: Array.isArray(careers) ? careers.length : 0, label: "Offres d'Emploi", href: "/admin/emplois", description: "Recrutements →" },
          equipe: { value: Array.isArray(team) ? team.length : 0, label: "Experts / Équipe", href: "/admin/equipe", description: "Gérer l'équipe →" },
          actualites: { value: articles?.meta?.total || 0, label: "Actualités", href: "/admin/actualites", description: "Gérer les articles →" },
          appels: { value: Array.isArray(tenders) ? tenders.length : 0, label: "Appels d'Offres", href: "/admin/appels-d-offres", description: "Marchés publics →" },
        })
      } catch (error: any) {
        console.error("Erreur chargement stats:", error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apc-green"></div>
      </div>
    )
  }

  const adminCards = stats ? [
    stats.services,
    stats.realisations,
    stats.emplois,
    stats.equipe,
    stats.actualites,
    stats.appels
  ].map((s, i) => {
    const configs = [
      { icon: Cog, color: "text-blue-600", bg: "bg-blue-50" },
      { icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50" },
      { icon: Search, color: "text-amber-600", bg: "bg-amber-50" },
      { icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
      { icon: Newspaper, color: "text-cyan-600", bg: "bg-cyan-50" },
      { icon: FileText, color: "text-red-600", bg: "bg-red-50" },
    ]
    return { ...s, ...configs[i] }
  }) : []


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

      {/* Admin Cards Grid — each card is fully clickable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-5">
        {adminCards.map((card) => (
          <Link key={card.label} href={card.href} className="block">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer h-full">
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

      {/* Main Grid / Notifications */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Clock size={18} className="text-apc-green" /> Notifications & Activités Récentes
            </h3>
            <span className="text-xs text-gray-400 font-medium px-2 py-1 bg-gray-100 rounded-full">0 nouvelles alertes</span>
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
