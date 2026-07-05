import {
  Sprout,
  Handshake,
  Heart,
  Users,
  ShieldCheck,
} from "lucide-react"

export const mockDomaines = [
  {
    id: "agriculture",
    icon: Sprout,
    title: "Agriculture & Résilience Économique",
    color: "#2E7D32",
    lightColor: "#E8F5E9",
    colorHex: "#1a472a",
    borderClass: "border-apc-green/20",
    description:
      "Nous promouvons une agriculture durable et productive pour garantir la sécurité alimentaire et l'autonomie économique des communautés vulnérables, en particulier dans les zones affectées par les déplacements.",
    actions: [
      "Distribution de semences améliorées et d'outils agricoles",
      "Formation aux techniques d'agriculture durable et résiliente",
      "Mise en place de coopératives et jardins communautaires",
      "Appui à la commercialisation des productions locales",
      "Réhabilitation des terres agricoles dégradées",
    ],
    stats: [
      { value: "8", label: "Projets actifs" },
      { value: "12 000+", label: "Bénéficiaires" },
      { value: "450 ha", label: "Terres cultivées" },
    ],
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "paix",
    icon: Handshake,
    title: "Droits Fondamentaux & Cohésion Sociale",
    color: "#1565C0",
    lightColor: "#E3F2FD",
    colorHex: "#1e3a8a",
    borderClass: "border-apc-blue/20",
    description:
      "Nous œuvrons pour la résolution pacifique des conflits, le dialogue intercommunautaire et la promotion des droits humains dans les zones affectées par la violence et les déplacements forcés.",
    actions: [
      "Organisation d'ateliers de dialogue intercommunautaire",
      "Soutien juridique et psychosocial aux victimes de violences",
      "Formation de médiateurs locaux et leaders communautaires",
      "Accompagnement à la réintégration des ex-combattants",
      "Plaidoyer pour les droits des populations marginalisées",
    ],
    stats: [
      { value: "5", label: "Projets actifs" },
      { value: "8 000+", label: "Bénéficiaires" },
      { value: "3", label: "Provinces couvertes" },
    ],
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2069&auto=format&fit=crop",
  },
  {
    id: "enfance",
    icon: Heart,
    title: "Protection de l'Enfance",
    color: "#F57C00",
    lightColor: "#FFF3E0",
    colorHex: "#ef4444",
    borderClass: "border-apc-alert/20",
    description:
      "Nous protégeons les droits des enfants — notamment ceux séparés, non accompagnés ou victimes de violences — à travers un accompagnement psychosocial, juridique et éducatif adapté à chaque situation.",
    actions: [
      "Identification et enregistrement des enfants séparés",
      "Réunification familiale et placement en famille d'accueil",
      "Soutien psychosocial individuel et en groupe",
      "Accès à l'éducation pour les enfants en situation de vulnérabilité",
      "Sensibilisation contre le travail et le mariage précoce",
    ],
    stats: [
      { value: "6", label: "Projets actifs" },
      { value: "5 000+", label: "Enfants soutenus" },
      { value: "2", label: "Provinces couvertes" },
    ],
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "femmes",
    icon: Users,
    title: "Autonomisation des Femmes & Jeunes",
    color: "#7B1FA2",
    lightColor: "#F3E5F5",
    colorHex: "#9333ea",
    borderClass: "border-purple-200",
    description:
      "Nous renforçons les capacités des femmes et des jeunes pour leur permettre de jouer un rôle actif dans le développement économique et social de leurs communautés, et de vivre dans la dignité.",
    actions: [
      "Formations professionnelles (couture, transformation agro-alimentaire)",
      "Appui à l'entrepreneuriat et aux activités génératrices de revenus",
      "Création de groupes d'épargne et de crédit (AVEC)",
      "Sensibilisation sur les droits des femmes et la prévention des VBG",
      "Promotion du leadership féminin et de la participation civique",
    ],
    stats: [
      { value: "7", label: "Projets réalisés" },
      { value: "3 500+", label: "Femmes touchées" },
      { value: "78%", label: "Taux de réussite" },
    ],
    image:
      "https://images.unsplash.com/photo-1573659874553-859c3d5b3b1a?q=80&w=2069&auto=format&fit=crop",
  },
  {
    id: "sante",
    icon: ShieldCheck,
    title: "Santé, Nutrition & Milieu Rural",
    color: "#00838F",
    lightColor: "#E0F7FA",
    colorHex: "#0d9488",
    borderClass: "border-teal-200",
    description:
      "Nous améliorons l'accès aux services de santé de base et luttons activement contre la malnutrition, particulièrement chez les enfants de moins de 5 ans et les femmes enceintes dans les zones rurales et enclavées.",
    actions: [
      "Déploiement d'unités médicales mobiles dans les zones reculées",
      "Dépistage et traitement actif de la malnutrition aigüe",
      "Sensibilisation sur la santé maternelle, néonatale et infantile",
      "Distributions alimentaires d'urgence et suppléments nutritionnels",
      "Campagnes de vaccination et de prévention des maladies endémiques",
    ],
    stats: [
      { value: "6", label: "Programmes actifs" },
      { value: "20 000+", label: "Bénéficiaires" },
      { value: "4", label: "Provinces couvertes" },
    ],
    image:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=2069&auto=format&fit=crop",
  },
]
