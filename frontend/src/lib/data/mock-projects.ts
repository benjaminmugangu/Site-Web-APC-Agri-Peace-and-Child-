export type ProjectCategory = "agriculture" | "protection" | "dignite" | "paix"
export type ProjectStatus = "draft" | "published" | "archived"

export type Project = {
  id: string
  title: string
  slug: string
  description: string
  content?: string
  category: ProjectCategory
  status: ProjectStatus
  budget: number
  currency: string
  location: string
  province: string
  beneficiaries: number
  startDate: string
  endDate?: string
  mainImage: string // Aligné avec le backend
  gallery?: string[]
  featured: boolean
  showOnHome: boolean
  needsDonation: boolean
  isVisible?: boolean
  createdAt: string
  updatedAt: string
  createdBy?: string
}

export const mockProjects: Project[] = [
  {
    id: "proj-001",
    title: "Sécurité Alimentaire à Masisi 2024",
    slug: "securite-alimentaire-masisi-2024",
    description: "Distribution de semences améliorées et formation agricole pour 2 400 familles déplacées dans le territoire de Masisi. Ce projet vise à restaurer l'autonomie alimentaire des ménages affectés par les conflits armés en leur fournissant des intrants agricoles de qualité et un accompagnement technique sur les pratiques durables.",
    category: "agriculture",
    status: "published",
    budget: 45000,
    currency: "USD",
    location: "Territoire de Masisi",
    province: "Nord-Kivu",
    beneficiaries: 2400,
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    mainImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop",
    featured: true,
    showOnHome: true,
    needsDonation: false,
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-03-20T14:30:00Z",
    createdBy: "usr-001",
  },
  {
    id: "proj-002",
    title: "Protection de l'Enfance — Goma 2024",
    slug: "protection-enfance-goma-2024",
    description: "Accompagnement psychosocial et réinsertion scolaire de 380 enfants séparés de leurs familles lors des déplacements forcés dans la ville de Goma. Le programme inclut un suivi individuel, des activités récréatives thérapeutiques et une coordination avec les familles d'accueil.",
    category: "protection",
    status: "published",
    budget: 28000,
    currency: "USD",
    location: "Ville de Goma",
    province: "Nord-Kivu",
    beneficiaries: 380,
    startDate: "2024-02-01",
    mainImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
    featured: false,
    showOnHome: true,
    needsDonation: true,
    createdAt: "2024-01-25T09:00:00Z",
    updatedAt: "2024-04-01T11:00:00Z",
    createdBy: "usr-002",
  },
  {
    id: "proj-003",
    title: "Autonomisation des Femmes — Butembo 2023",
    slug: "autonomisation-femmes-butembo-2023",
    description: "Programme de micro-crédit et formation entrepreneuriale pour 650 femmes chefs de ménage dans la ville de Butembo, en partenariat avec les coopératives locales. Chaque bénéficiaire reçoit un crédit de démarrage, une formation en gestion et un suivi mensuel sur 6 mois.",
    category: "dignite",
    status: "published",
    budget: 32000,
    currency: "USD",
    location: "Ville de Butembo",
    province: "Nord-Kivu",
    beneficiaries: 650,
    startDate: "2023-06-01",
    endDate: "2023-12-31",
    mainImage: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=800&auto=format&fit=crop",
    featured: false,
    showOnHome: false,
    needsDonation: false,
    createdAt: "2023-05-15T10:00:00Z",
    updatedAt: "2024-01-10T09:00:00Z",
    createdBy: "usr-001",
  },
  {
    id: "proj-004",
    title: "Dialogue Intercommunautaire — Rutshuru",
    slug: "dialogue-rutshuru-2024",
    description: "Organisation de forums de paix entre communautés Hunde et Nande dans le territoire de Rutshuru pour réduire les tensions et favoriser la cohabitation pacifique. Trois forums sont prévus avec plus de 200 représentants communautaires, leaders religieux et autorités locales.",
    category: "paix",
    status: "draft",
    budget: 18000,
    currency: "USD",
    location: "Territoire de Rutshuru",
    province: "Nord-Kivu",
    beneficiaries: 1200,
    startDate: "2024-05-01",
    mainImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
    featured: false,
    showOnHome: false,
    needsDonation: true,
    createdAt: "2024-04-01T07:00:00Z",
    updatedAt: "2024-04-14T16:00:00Z",
    createdBy: "usr-003",
  },
  {
    id: "proj-005",
    title: "Reboisement & Agroforesterie — Lubero",
    slug: "reboisement-lubero-2025",
    description: "Plantation de 50 000 arbres et introduction de l'agroforesterie dans 8 villages du territoire de Lubero pour lutter contre la déforestation et améliorer la sécurité alimentaire à long terme. Le projet associe espèces fruitières et essences locales.",
    category: "agriculture",
    status: "draft",
    budget: 55000,
    currency: "USD",
    location: "Territoire de Lubero",
    province: "Nord-Kivu",
    beneficiaries: 3200,
    startDate: "2025-03-01",
    mainImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
    featured: false,
    showOnHome: false,
    needsDonation: true,
    createdAt: "2024-04-10T08:00:00Z",
    updatedAt: "2024-04-14T10:00:00Z",
    createdBy: "usr-002",
  },
  {
    id: "proj-006",
    title: "Accès à l'Eau Potable — Uvira",
    slug: "eau-potable-uvira-2023",
    description: "Construction de 12 points d'eau et réhabilitation du réseau de distribution dans les quartiers périurbains d'Uvira pour garantir l'accès à l'eau potable à plus de 5 000 personnes.",
    category: "dignite",
    status: "archived",
    budget: 67000,
    currency: "USD",
    location: "Ville d'Uvira",
    province: "Sud-Kivu",
    beneficiaries: 5000,
    startDate: "2022-09-01",
    endDate: "2023-08-31",
    mainImage: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop",
    featured: false,
    showOnHome: false,
    needsDonation: false,
    createdAt: "2022-08-20T08:00:00Z",
    updatedAt: "2023-09-05T10:00:00Z",
    createdBy: "usr-001",
  },
]
