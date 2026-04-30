// ============================================
// APC — Données statiques (Mock)
// À remplacer par des appels API (backend NestJS/Express)
// ============================================

export type ProjectStatus = "active" | "completed" | "upcoming"
export type ProjectDomain = "agriculture" | "paix" | "enfance" | "femmes" | "sante"

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  fullDescription: string
  status: ProjectStatus
  domain: ProjectDomain
  location: string
  startDate: string
  endDate: string
  budget: number
  currency: string
  beneficiaries: number
  image: string
  tags: string[]
  progress: number // 0–100
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  author: string
  image: string
  tags: string[]
  featured?: boolean
  readTime: number // minutes
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  initials: string
  color: string
}

// ============================================
// PROJETS
// ============================================
export const projects: Project[] = [
  {
    id: "1",
    slug: "securite-alimentaire-masisi-2024",
    title: "Sécurité Alimentaire à Masisi",
    description:
      "Distribution de semences améliorées et formation agricole durable pour 500 familles de déplacés dans le territoire de Masisi.",
    fullDescription: `Ce programme renforce la résilience alimentaire des communautés déplacées à Masisi. À travers la distribution de semences sélectionnées et des formations pratiques, nous aidons 500 familles à retrouver leur autonomie alimentaire.\n\nLes activités comprennent des sessions de formation, la mise en place de jardins communautaires et un suivi terrain par nos agents.`,
    status: "active",
    domain: "agriculture",
    location: "Masisi, Nord-Kivu",
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    budget: 85000,
    currency: "USD",
    beneficiaries: 2500,
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop",
    tags: ["Agriculture", "Sécurité Alimentaire", "Nord-Kivu"],
    progress: 68,
  },
  {
    id: "2",
    slug: "protection-enfance-goma-2024",
    title: "Protection de l'Enfance — Goma",
    description:
      "Soutien psychosocial aux enfants victimes de violences et de séparation familiale dans les camps de déplacés de Goma.",
    fullDescription: `Ce projet cible les enfants séparés et non accompagnés dans les camps de déplacés autour de Goma. Notre équipe de travailleurs sociaux identifie, enregistre et accompagne chaque enfant vers une solution durable : réunification familiale ou hébergement sécurisé.`,
    status: "active",
    domain: "enfance",
    location: "Goma, Nord-Kivu",
    startDate: "2024-03-01",
    endDate: "2025-02-28",
    budget: 120000,
    currency: "USD",
    beneficiaries: 850,
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
    tags: ["Enfance", "Protection", "Psychosocial", "Goma"],
    progress: 45,
  },
  {
    id: "3",
    slug: "autonomisation-femmes-butembo-2023",
    title: "Autonomisation des Femmes — Butembo",
    description:
      "Formation professionnelle et appui à l'entrepreneuriat féminin pour 200 femmes vulnérables à Butembo.",
    fullDescription: `Le projet a formé 200 femmes en couture, transformation agro-alimentaire et commerce. Chaque participante a reçu un kit de démarrage et un accompagnement de 6 mois. 78% ont lancé une activité génératrice de revenus.`,
    status: "completed",
    domain: "femmes",
    location: "Butembo, Nord-Kivu",
    startDate: "2023-03-01",
    endDate: "2023-12-31",
    budget: 65000,
    currency: "USD",
    beneficiaries: 200,
    image:
      "https://images.unsplash.com/photo-1573659874553-859c3d5b3b1a?q=80&w=2069&auto=format&fit=crop",
    tags: ["Femmes", "Entrepreneuriat", "Formation", "Butembo"],
    progress: 100,
  },
  {
    id: "4",
    slug: "distribution-alimentaire-urgence-2022",
    title: "Distribution Alimentaire d'Urgence",
    description:
      "Réponse humanitaire suite aux éruptions du Nyiragongo : vivres distribués à 3 000 familles déplacées.",
    fullDescription: `En réponse à la crise du Nyiragongo, APC a mené une vaste opération de distribution alimentaire d'urgence en partenariat avec des organisations internationales, atteignant 3 000 familles sur 4 mois.`,
    status: "completed",
    domain: "sante",
    location: "Goma & environs, Nord-Kivu",
    startDate: "2022-01-01",
    endDate: "2022-04-30",
    budget: 200000,
    currency: "USD",
    beneficiaries: 15000,
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop",
    tags: ["Urgence", "Alimentation", "Nyiragongo"],
    progress: 100,
  },
  {
    id: "5",
    slug: "programme-paix-ituri-2025",
    title: "Programme Paix & Cohésion — Ituri",
    description:
      "Dialogue intercommunautaire et réintégration des ex-combattants pour une coexistence pacifique en Ituri.",
    fullDescription: `Ce programme cible les communautés en conflit en Ituri. Ateliers de dialogue, projets communautaires communs et accompagnement psychosocial des ex-combattants pour bâtir des bases solides pour la paix.`,
    status: "upcoming",
    domain: "paix",
    location: "Bunia, Ituri",
    startDate: "2025-04-01",
    endDate: "2026-03-31",
    budget: 150000,
    currency: "USD",
    beneficiaries: 5000,
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2069&auto=format&fit=crop",
    tags: ["Paix", "Cohésion Sociale", "Ituri"],
    progress: 0,
  },
  {
    id: "6",
    slug: "clinique-mobile-tanganyika-2025",
    title: "Clinique Mobile — Tanganyika",
    description:
      "Déploiement d'unités médicales mobiles pour améliorer l'accès aux soins et lutter contre la malnutrition au Tanganyika.",
    fullDescription: `Face au déficit en infrastructures sanitaires au Tanganyika, APC lancera en 2025 un réseau de cliniques mobiles offrant consultations médicales, suivi nutritionnel et campagnes de vaccination dans les zones reculées.`,
    status: "upcoming",
    domain: "sante",
    location: "Tanganyika",
    startDate: "2025-06-01",
    endDate: "2026-05-31",
    budget: 180000,
    currency: "USD",
    beneficiaries: 8000,
    image:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=2069&auto=format&fit=crop",
    tags: ["Santé", "Nutrition", "Clinique Mobile", "Tanganyika"],
    progress: 0,
  },
]

// ============================================
// ARTICLES / ACTUALITÉS
// ============================================
export const articles: Article[] = [
  {
    id: "1",
    slug: "rapport-annuel-2023-resilience",
    title: "Rapport Annuel 2023 : Une Année de Résilience et d'Espoir",
    excerpt:
      "Retour sur une année marquée par l'engagement de nos équipes terrain, le soutien de nos partenaires et l'impact concret sur les communautés vulnérables de l'Est du Congo.",
    category: "Rapport",
    date: "2024-02-15",
    author: "Équipe APC",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
    tags: ["Rapport Annuel", "Bilan", "2023"],
    featured: true,
    readTime: 8,
  },
  {
    id: "2",
    slug: "distribution-semences-masisi-2024",
    title: "500 Familles Bénéficiaires à Masisi : Première Phase de Distribution",
    excerpt:
      "L'équipe APC a lancé la première phase de distribution de semences améliorées dans le territoire de Masisi, touchant directement 500 ménages déplacés.",
    category: "Terrain",
    date: "2024-03-20",
    author: "Jean-Paul Ndagijimana",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop",
    tags: ["Agriculture", "Masisi", "Distribution"],
    readTime: 4,
  },
  {
    id: "3",
    slug: "femmes-entrepreneures-butembo-succes",
    title: "78% des Femmes Formées ont Lancé leur Activité à Butembo",
    excerpt:
      "Le programme d'autonomisation des femmes à Butembo a dépassé ses objectifs : 156 femmes sur 200 ont créé une entreprise ou une activité génératrice de revenus.",
    category: "Impact",
    date: "2024-01-10",
    author: "Marie-Claire Zawadi",
    image:
      "https://images.unsplash.com/photo-1573659874553-859c3d5b3b1a?q=80&w=2069&auto=format&fit=crop",
    tags: ["Femmes", "Entrepreneuriat", "Impact", "Butembo"],
    readTime: 5,
  },
  {
    id: "4",
    slug: "apc-partenariat-ocha-2024",
    title: "APC Renforce son Partenariat avec OCHA pour la Réponse Humanitaire",
    excerpt:
      "Un accord de coopération a été signé entre APC et OCHA pour renforcer la coordination de l'aide humanitaire dans les provinces de l'Est de la RDC.",
    category: "Partenariat",
    date: "2024-04-05",
    author: "Direction APC",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2069&auto=format&fit=crop",
    tags: ["Partenariat", "OCHA", "Humanitaire"],
    readTime: 3,
  },
  {
    id: "5",
    slug: "journee-enfant-africain-2024",
    title: "Journée de l'Enfant Africain 2024 : APC Célèbre avec les Communautés",
    excerpt:
      "À l'occasion du 16 juin, APC a organisé des activités éducatives et récréatives pour plus de 300 enfants dans les camps de déplacés de Goma.",
    category: "Événement",
    date: "2024-06-16",
    author: "Équipe APC",
    image:
      "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?q=80&w=2070&auto=format&fit=crop",
    tags: ["Enfance", "Événement", "Goma"],
    readTime: 3,
  },
  {
    id: "6",
    slug: "appel-dons-programme-ituri-2025",
    title: "Appel à Soutien : Aidez-nous à Financer le Programme Paix en Ituri",
    excerpt:
      "APC lance une campagne de collecte de fonds pour son programme de dialogue intercommunautaire et de consolidation de la paix en Ituri.",
    category: "Appel à Dons",
    date: "2024-11-01",
    author: "Direction APC",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop",
    tags: ["Dons", "Ituri", "Paix"],
    readTime: 4,
  },
]

// ============================================
// ÉQUIPE
// ============================================
export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Directeur Exécutif",
    role: "Direction Générale & Stratégie",
    bio: "Fondateur d'APC avec plus de 10 ans d'expérience dans l'humanitaire et le développement communautaire en RDC.",
    initials: "DE",
    color: "#2E7D32",
  },
  {
    id: "2",
    name: "Coordinatrice des Programmes",
    role: "Gestion & Suivi des Projets",
    bio: "Spécialiste en gestion de projets humanitaires, avec une expertise en protection de l'enfance et en questions de genre.",
    initials: "CP",
    color: "#1565C0",
  },
  {
    id: "3",
    name: "Responsable Agriculture",
    role: "Développement Rural & Sécurité Alimentaire",
    bio: "Agronome de formation, il supervise tous les programmes liés à l'agriculture durable et la sécurité alimentaire.",
    initials: "RA",
    color: "#66BB6A",
  },
  {
    id: "4",
    name: "Chargée de Communication",
    role: "Communication & Plaidoyer",
    bio: "En charge de la visibilité institutionnelle, du plaidoyer et des relations avec les partenaires et bailleurs.",
    initials: "CC",
    color: "#F57C00",
  },
]

// ============================================
// HELPERS
// ============================================
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}

export function getProjectsByStatus(status: ProjectStatus): Project[] {
  return projects.filter((p) => p.status === status)
}

export const statusLabels: Record<ProjectStatus, string> = {
  active: "En cours",
  completed: "Terminé",
  upcoming: "À venir",
}

export const statusColors: Record<ProjectStatus, string> = {
  active: "bg-apc-green/10 text-apc-green border-apc-green/20",
  completed: "bg-gray-100 text-gray-600 border-gray-200",
  upcoming: "bg-apc-blue/10 text-apc-blue border-apc-blue/20",
}

export const categoryColors: Record<string, string> = {
  Rapport: "bg-apc-green/10 text-apc-green",
  Terrain: "bg-amber-100 text-amber-700",
  Impact: "bg-blue-100 text-blue-700",
  Partenariat: "bg-purple-100 text-purple-700",
  Événement: "bg-pink-100 text-pink-700",
  "Appel à Dons": "bg-orange-100 text-orange-700",
}

export const apc = {
  name: "Agri-Peace and Child",
  sigle: "APC",
  slogan: "Agissons Pour la Protection, l'Agriculture, la Dignité et la Paix",
  founded: "18 février 2017",
  hq: "Goma, Nord-Kivu, RD Congo",
  address: "Quartier Le Volcan, Commune de Goma, Ville de Goma, Nord-Kivu, République Démocratique du Congo",
  email: "agripeaceandchild@gmail.com",
  phone: "+243 975 418 316",
  stats: {
    beneficiaries: 15000,
    hectares: 450,
    projects: 32,
    provinces: 4,
    womenPercentage: 80,
  },
  socials: {
    facebook: "https://facebook.com/agripeaceandchild",
    twitter: "https://twitter.com/agripeacechild",
    linkedin: "https://linkedin.com/company/agripeaceandchild",
    instagram: "https://instagram.com/agripeaceandchild",
  }
}
