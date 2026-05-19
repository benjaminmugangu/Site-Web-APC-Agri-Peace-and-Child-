import { mockProjects } from "./mock-projects"
import { mockArticles } from "./mock-articles"
import { mockTeam, mockActivityLogs } from "./mock-team"
import { mockMessages } from "./mock-messages"

// ── Stats calculées dynamiquement depuis les données mock ──

export function getDashboardStats() {
  const publishedProjects = mockProjects.filter((p) => p.status === "published")
  const activeProjects = mockProjects.filter((p) => p.status === "published").length
  const draftProjects = mockProjects.filter((p) => p.status === "draft").length
  const totalBeneficiaries = publishedProjects.reduce((sum, p) => sum + p.beneficiaries, 0)
  const totalBudget = publishedProjects.reduce((sum, p) => sum + p.budget, 0)
  const unreadMessages = mockMessages.filter((m) => m.status === "unread").length

  return {
    services: {
      value: 6,
      label: "Nos Services",
      href: "/admin/services",
      description: "Gérer les services →"
    },
    realisations: {
      value: mockProjects.length,
      label: "Réalisations",
      href: "/admin/projets",
      subValue: `${activeProjects} en cours`,
      description: "Voir les projets →"
    },
    emplois: {
      value: 2,
      label: "Offres d'Emploi",
      href: "/admin/emplois",
      description: "Recrutements →"
    },
    equipe: {
      value: mockTeam.length,
      label: "Experts / Équipe",
      href: "/admin/equipe",
      description: "Gérer l'équipe →"
    },
    partenaires: {
      value: 3,
      label: "Partenaires",
      href: "/admin/partenaires",
      description: "Voir les partenaires →"
    },
    appels: {
      value: 2,
      label: "Appels d'Offres",
      href: "/admin/appels-d-offres",
      description: "Marchés publics →"
    },
    messages: {
      value: unreadMessages,
      label: "Messages",
      href: "/admin/messages",
      description: "Voir les messages →"
    }
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
