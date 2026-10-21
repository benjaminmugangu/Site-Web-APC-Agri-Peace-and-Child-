import * as LucideIcons from "lucide-react"
import { Heart } from "lucide-react"

/**
 * Charge dynamiquement une icône Lucide React par son nom
 * @param iconName - Nom de l'icône (ex: "Heart", "ShieldCheck")
 * @param fallbackIcon - Icône par défaut si non trouvée
 * @returns Le composant icône ou l'icône de fallback (jamais undefined)
 */
export function getLucideIcon(iconName: string, fallbackIcon = "Heart") {
  // Si iconName est vide ou invalide, utiliser le fallback
  if (!iconName || typeof iconName !== 'string') {
    return Heart
  }

  const IconComponent = (LucideIcons as any)[iconName] || (LucideIcons as any)[fallbackIcon]

  // Si toujours undefined, retourner le fallback importé directement
  if (!IconComponent) {
    return Heart
  }

  return IconComponent
}

/**
 * Liste des icônes couramment utilisées pour le sélecteur
 */
export const COMMON_ICONS = [
  "Heart",
  "ShieldCheck",
  "Sprout",
  "Handshake",
  "Users",
  "Globe",
  "Home",
  "Building2",
  "MapPin",
  "Calendar",
  "Clock",
  "CheckCircle2",
  "AlertCircle",
  "Info",
  "Star",
  "Award",
  "Target",
  "TrendingUp",
  "Activity",
  "Zap",
  "Sun",
  "Moon",
  "Cloud",
  "Droplets",
  "Flame",
  "Leaf",
  "TreePine",
  "Wheat",
  "Utensils",
  "HeartHandshake",
  "Baby",
  "Child",
  "GraduationCap",
  "BookOpen",
  "Lightbulb",
  "Cpu",
  "Wifi",
  "Phone",
  "Mail",
  "MessageSquare",
  "Send",
  "Share2",
  "Github",
  "Twitter",
  "Linkedin",
  "Facebook",
  "Instagram",
  "Youtube",
] as const
