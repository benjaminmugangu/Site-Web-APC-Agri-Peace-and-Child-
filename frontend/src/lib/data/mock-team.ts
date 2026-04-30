export type MemberAccess = "super_admin" | "admin" | "editor" | "viewer"
export type MemberStatus = "active" | "suspended" | "pending"

export type TeamMember = {
  id: string
  name: string
  role: string
  department: string
  email: string
  phone?: string
  access: MemberAccess
  status: MemberStatus
  joinDate: string
  lastActive: string
  avatarInitials: string
  avatarColor: string
  bio?: string
  activityCount: number
}

export type ActivityLog = {
  id: string
  userId: string
  action: string
  target: string
  targetType: "project" | "article" | "member" | "settings" | "system"
  timestamp: string
}

export const mockTeam: TeamMember[] = [
  {
    id: "usr-001",
    name: "Benjamin Mugangu",
    role: "Directeur Exécutif",
    department: "Direction",
    email: "benjamin@apc.org",
    phone: "+243 975 418 316",
    access: "super_admin",
    status: "active",
    joinDate: "2020-01-01",
    lastActive: "2024-04-14T22:00:00Z",
    avatarInitials: "BM",
    avatarColor: "bg-emerald-600",
    bio: "Fondateur et Directeur Exécutif d'APC depuis 2020. Expert en gestion humanitaire et développement communautaire.",
    activityCount: 248,
  },
  {
    id: "usr-002",
    name: "Marie Louise Kabulo",
    role: "Coordinatrice de Projets",
    department: "Programmes",
    email: "marie@apc.org",
    phone: "+243 894 221 455",
    access: "admin",
    status: "active",
    joinDate: "2021-03-15",
    lastActive: "2024-04-14T18:30:00Z",
    avatarInitials: "ML",
    avatarColor: "bg-blue-600",
    bio: "Responsable de la coordination de l'ensemble des projets terrain. 8 ans d'expérience en gestion de projets humanitaires.",
    activityCount: 184,
  },
  {
    id: "usr-003",
    name: "Jean-Paul Nkunda",
    role: "Chargé de Programme Paix",
    department: "Programmes",
    email: "jean@apc.org",
    phone: "+243 851 334 122",
    access: "editor",
    status: "active",
    joinDate: "2022-06-01",
    lastActive: "2024-04-13T10:00:00Z",
    avatarInitials: "JN",
    avatarColor: "bg-amber-600",
    bio: "Spécialiste en médiation et résolution de conflits communautaires. Intervient principalement dans les territoires de Rutshuru et Masisi.",
    activityCount: 97,
  },
  {
    id: "usr-004",
    name: "Espérance Murhula",
    role: "Responsable Communication",
    department: "Communication",
    email: "esperance@apc.org",
    access: "editor",
    status: "active",
    joinDate: "2023-01-10",
    lastActive: "2024-04-14T15:00:00Z",
    avatarInitials: "EM",
    avatarColor: "bg-purple-600",
    bio: "Gère la communication digitale et les relations presse d'APC. Responsable du contenu éditorial du site web.",
    activityCount: 63,
  },
  {
    id: "usr-005",
    name: "David Kambale",
    role: "Stagiaire Développeur",
    department: "Technique",
    email: "david@apc.org",
    access: "viewer",
    status: "pending",
    joinDate: "2024-04-01",
    lastActive: "2024-04-14T09:00:00Z",
    avatarInitials: "DK",
    avatarColor: "bg-gray-500",
    activityCount: 5,
  },
  {
    id: "usr-006",
    name: "Claudine Amani",
    role: "Chargée de l'Agriculture",
    department: "Programmes",
    email: "claudine@apc.org",
    phone: "+243 970 118 233",
    access: "editor",
    status: "active",
    joinDate: "2022-03-01",
    lastActive: "2024-04-12T16:00:00Z",
    avatarInitials: "CA",
    avatarColor: "bg-green-700",
    bio: "Agronome de formation, responsable des programmes d'agriculture durable et de sécurité alimentaire.",
    activityCount: 112,
  },
]

export const mockActivityLogs: ActivityLog[] = [
  { id: "log-001", userId: "usr-001", action: "A publié le projet", target: "Sécurité Alimentaire Masisi 2024", targetType: "project", timestamp: "2024-04-14T22:10:00Z" },
  { id: "log-002", userId: "usr-002", action: "A créé l'article", target: "Forum de paix à Rutshuru", targetType: "article", timestamp: "2024-04-14T18:35:00Z" },
  { id: "log-003", userId: "usr-001", action: "A invité le membre", target: "david@apc.org", targetType: "member", timestamp: "2024-04-14T15:00:00Z" },
  { id: "log-004", userId: "usr-004", action: "A mis à jour l'article", target: "Rapport Annuel 2023", targetType: "article", timestamp: "2024-04-14T14:20:00Z" },
  { id: "log-005", userId: "usr-003", action: "A modifié le projet", target: "Dialogue Intercommunautaire Rutshuru", targetType: "project", timestamp: "2024-04-14T11:45:00Z" },
  { id: "log-006", userId: "usr-002", action: "A archivé le projet", target: "Accès à l'Eau Potable — Uvira", targetType: "project", timestamp: "2024-04-13T16:00:00Z" },
  { id: "log-007", userId: "usr-001", action: "A modifié les paramètres", target: "Réseaux sociaux", targetType: "settings", timestamp: "2024-04-12T10:00:00Z" },
]
