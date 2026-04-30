import { mockProjects } from "./mock-projects"
import { mockArticles } from "./mock-articles"
import { mockTeam, mockActivityLogs } from "./mock-team"
import { mockMessages } from "./mock-messages"

// ── Stats calculées dynamiquement depuis les données mock ──

export function getDashboardStats() {
  const publishedProjects = mockProjects.filter((p) => p.status === "published")
  const draftProjects = mockProjects.filter((p) => p.status === "draft")
  const totalBeneficiaries = publishedProjects.reduce((sum, p) => sum + p.beneficiaries, 0)
  const totalBudget = publishedProjects.reduce((sum, p) => sum + p.budget, 0)
  const totalHectares = 450 // valeur fixe pour la démo
  const unreadMessages = mockMessages.filter((m) => m.status === "unread").length

  return {
    beneficiaires: {
      value: totalBeneficiaries.toLocaleString("fr-FR"),
      raw: totalBeneficiaries,
      change: "+12.4%",
      trend: "up" as const,
      label: "Bénéficiaires directs",
      period: "vs trimestre précédent",
    },
    projetsActifs: {
      value: publishedProjects.length,
      raw: publishedProjects.length,
      change: `+${draftProjects.length} en cours`,
      trend: "up" as const,
      label: "Projets publiés",
      period: `${draftProjects.length} brouillon(s)`,
    },
    fondsLeves: {
      value: `$${(totalBudget / 1000).toFixed(0)}K`,
      raw: totalBudget,
      change: "+23.7%",
      trend: "up" as const,
      label: "Budget total des projets",
      period: "vs année précédente",
    },
    hectaresCultives: {
      value: totalHectares.toLocaleString("fr-FR"),
      raw: totalHectares,
      change: "+5.2%",
      trend: "up" as const,
      label: "Hectares cultivés",
      period: "cette saison agricole",
    },
    articlesPublies: {
      value: mockArticles.filter((a) => a.status === "published").length,
      raw: mockArticles.filter((a) => a.status === "published").length,
      change: `${mockArticles.filter((a) => a.status === "draft").length} brouillon(s)`,
      trend: "neutral" as const,
      label: "Articles publiés",
      period: "au total",
    },
    messagesNonLus: {
      value: unreadMessages,
      raw: unreadMessages,
      trend: unreadMessages > 0 ? ("warning" as const) : ("neutral" as const),
      label: "Messages non lus",
    },
  }
}

export function getRecentActivity() {
  return mockActivityLogs
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)
    .map((log) => {
      const member = mockTeam.find((m) => m.id === log.userId)
      const elapsed = getElapsedTime(log.timestamp)
      return {
        ...log,
        memberName: member?.name ?? "Inconnu",
        memberInitials: member?.avatarInitials ?? "??",
        memberColor: member?.avatarColor ?? "bg-gray-400",
        elapsed,
      }
    })
}

export function getProjectsByStatus() {
  return {
    published: mockProjects.filter((p) => p.status === "published").length,
    draft: mockProjects.filter((p) => p.status === "draft").length,
    archived: mockProjects.filter((p) => p.status === "archived").length,
  }
}

export function getMessagesByType() {
  return {
    total: mockMessages.length,
    unread: mockMessages.filter((m) => m.status === "unread").length,
    donation: mockMessages.filter((m) => m.type === "donation").length,
    partnership: mockMessages.filter((m) => m.type === "partnership").length,
    volunteer: mockMessages.filter((m) => m.type === "volunteer").length,
    contact: mockMessages.filter((m) => m.type === "contact").length,
  }
}

// ── Utilitaire : temps écoulé ──
function getElapsedTime(timestamp: string): string {
  const now = new Date("2024-04-14T23:00:00Z") // date fixe pour la démo
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffH = Math.floor(diffMs / (1000 * 60 * 60))
  const diffD = Math.floor(diffH / 24)

  if (diffH < 1) return "Il y a moins d'une heure"
  if (diffH < 24) return `Il y a ${diffH}h`
  if (diffD === 1) return "Hier"
  return `Il y a ${diffD} jours`
}

// ── Exports groupés pour faciliter les imports ──
export { mockProjects, mockArticles, mockTeam, mockActivityLogs, mockMessages }
