export type ArticleCategory = "Impact" | "Rapport" | "Paix" | "Agriculture" | "Protection" | "Partenariat" | "Événement"
export type ArticleStatus = "draft" | "published" | "scheduled"

export type Article = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string // Backend: content
  category: ArticleCategory
  author: string
  authorId: string
  readTime: number
  status: ArticleStatus
  featured: boolean
  includeNewsletter: boolean
  publishDate: string | null
  scheduledDate?: string
  mainImage: string // Backend: mainImage
  createdAt: string
  updatedAt: string
}

export const mockArticles: Article[] = [
  {
    id: "art-001",
    title: "2 400 familles de Masisi retrouvent l'autonomie alimentaire",
    slug: "familles-masisi-autonomie-alimentaire",
    excerpt: "Grâce au programme de distribution de semences et à la formation agricole d'APC, des milliers de familles déplacées ont pu replanter et récolter avant la fin de la saison 2024.",
    content: `## Contexte\n\nLe territoire de Masisi est l'un des plus affectés par les déplacements internes au Nord-Kivu. En 2023, plus de 180 000 personnes ont fui leurs villages à cause des conflits armés, abandonnant champs et récoltes.\n\n## Notre intervention\n\nAPC a lancé en janvier 2024 un programme d'urgence agricole visant à restaurer la sécurité alimentaire de 2 400 ménages. Chaque famille a reçu :\n\n- **25 kg de semences maïs** améliorées résistantes à la sécheresse\n- **10 kg de haricots** à cycle court\n- **Formation de 2 jours** sur les techniques d'agriculture durable\n- **Suivi mensuel** par un agronome de terrain\n\n## Résultats\n\nAu terme de la première saison culturale, 87 % des bénéficiaires ont déclaré avoir produit suffisamment pour nourrir leur famille. La prochaine saison s'annonce encore plus prometteuse.\n\n> "Avant ce projet, nous mangions une seule fois par jour. Aujourd'hui, nos enfants vont à l'école le ventre plein." — Consolatrice M., bénéficiaire, Masisi`,
    category: "Impact",
    author: "Benjamin Mugangu",
    authorId: "usr-001",
    readTime: 5,
    status: "published",
    featured: true,
    includeNewsletter: true,
    publishDate: "2024-04-01T08:00:00Z",
    mainImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop",
    createdAt: "2024-03-28T10:00:00Z",
    updatedAt: "2024-04-01T07:00:00Z",
  },
  {
    id: "art-002",
    title: "Rapport Annuel 2023 — APC en chiffres",
    slug: "rapport-annuel-2023",
    excerpt: "Retrouvez dans ce rapport les résultats consolidés de notre action sur le terrain : 15 240 bénéficiaires, 32 projets, 4 provinces couvertes en 2023.",
    content: `## Éditorial\n\nL'année 2023 a été une année de défis et de résilience pour les populations du Nord-Kivu et du Sud-Kivu. APC a maintenu sa présence sur le terrain malgré un contexte sécuritaire difficile.\n\n## Chiffres clés 2023\n\n| Indicateur | Résultat |\n|---|---|\n| Bénéficiaires directs | 15 240 |\n| Projets actifs | 32 |\n| Provinces couvertes | 4 |\n| Fonds levés | 178 000 USD |\n| Membres d'équipe | 18 |\n| Villages atteints | 47 |`,
    category: "Rapport",
    author: "Admin APC",
    authorId: "usr-001",
    readTime: 8,
    status: "published",
    featured: false,
    includeNewsletter: true,
    publishDate: "2024-02-15T08:00:00Z",
    mainImage: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?q=80&w=800&auto=format&fit=crop",
    createdAt: "2024-02-10T09:00:00Z",
    updatedAt: "2024-02-15T07:00:00Z",
  },
  {
    id: "art-003",
    title: "Les femmes entrepreneures de Butembo : histoires de réussite",
    slug: "femmes-entrepreneures-butembo",
    excerpt: "Six mois après le démarrage du programme de micro-crédit, des femmes partagent comment le soutien d'APC a transformé leur quotidien et celui de leurs enfants.",
    content: `## Rencontres avec des femmes qui changent leur destin\n\nButembo, ville commerçante du Nord-Kivu, abrite depuis 2023 l'un des programmes phares d'APC : l'autonomisation économique des femmes chefs de ménage.\n\n### Chance, vendeuse de légumes devenue grossiste\n\n*"Avant APC, je vendais des tomates au bord de la route. Avec le crédit de 150 USD, j'ai pu louer un espace au marché et acheter en gros. Aujourd'hui je fournis cinq autres vendeuses."*\n\n### Zawadi, couturière qui emploie maintenant deux apprenties\n\n*"La formation en gestion m'a appris à tenir une caisse et à épargner. J'ai remboursé mon crédit en 4 mois et j'ai déjà demandé un deuxième cycle."*`,
    category: "Impact",
    author: "Marie Louise Kabulo",
    authorId: "usr-002",
    readTime: 6,
    status: "published",
    featured: false,
    includeNewsletter: false,
    publishDate: "2024-03-10T08:00:00Z",
    mainImage: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=800&auto=format&fit=crop",
    createdAt: "2024-03-05T11:00:00Z",
    updatedAt: "2024-03-10T07:00:00Z",
  },
  {
    id: "art-004",
    title: "Forum de paix à Rutshuru : premières avancées",
    slug: "forum-paix-rutshuru-avancees",
    excerpt: "Le premier forum intercommunautaire organisé par APC dans le territoire de Rutshuru a réuni plus de 200 représentants des communautés locales pour établir un cadre de dialogue.",
    content: `## Un premier pas vers la réconciliation\n\nLe 28 mars 2024, APC a facilité la tenue du premier forum de dialogue intercommunautaire dans la localité de Kiwanja, territoire de Rutshuru. Cet événement a réuni leaders coutumiers, représentants religieux, jeunes et femmes des communautés Hunde et Nande.\n\n## Engagements pris\n\nÀ l'issue du forum, les participants ont signé une déclaration commune comprenant :\n- Cessation des discours de haine sur les réseaux sociaux locaux\n- Création d'un comité mixte de veille et d'alerte\n- Organisation mensuelle de marchés intercommunautaires`,
    category: "Paix",
    author: "Jean-Paul Nkunda",
    authorId: "usr-003",
    readTime: 4,
    status: "draft",
    featured: false,
    includeNewsletter: false,
    publishDate: null,
    mainImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
    createdAt: "2024-04-10T14:00:00Z",
    updatedAt: "2024-04-12T09:00:00Z",
  },
  {
    id: "art-005",
    title: "APC et UNICEF : un partenariat renforcé pour la protection de l'enfance",
    slug: "partenariat-apc-unicef-2024",
    excerpt: "APC a signé un accord de partenariat avec le bureau UNICEF de Goma pour étendre les activités de protection de l'enfance dans trois nouveaux territoires du Nord-Kivu.",
    content: `## Un accord stratégique\n\nLe 5 avril 2024, la Directrice du bureau UNICEF de Goma et le Directeur Exécutif d'APC ont signé un mémorandum d'entente pour une coopération sur 24 mois.\n\n## Périmètre de la collaboration\n\nLe partenariat couvrira trois axes prioritaires :\n1. Réunification familiale des enfants séparés\n2. Accès à l'éducation dans les zones de déplacement\n3. Prévention des violences basées sur le genre`,
    category: "Partenariat",
    author: "Benjamin Mugangu",
    authorId: "usr-001",
    readTime: 3,
    status: "scheduled",
    featured: false,
    includeNewsletter: true,
    publishDate: null,
    scheduledDate: "2024-05-01T08:00:00Z",
    mainImage: "https://images.unsplash.com/photo-1560525822-6b21f90dcbf1?q=80&w=800&auto=format&fit=crop",
    createdAt: "2024-04-12T10:00:00Z",
    updatedAt: "2024-04-14T09:00:00Z",
  },
]
