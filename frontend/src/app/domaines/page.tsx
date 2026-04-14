import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import {
  Sprout,
  Handshake,
  Heart,
  Users,
  ShieldCheck,
  ChevronRight,
  Check,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Domaines d'Intervention — APC",
  description:
    "Cinq axes d'action : Agriculture, Paix & Cohésion, Protection de l'Enfance, Autonomisation des Femmes, et Santé & Nutrition.",
}

const domaines = [
  {
    id: "agriculture",
    icon: Sprout,
    title: "Agriculture & Résilience Économique",
    color: "#2E7D32",
    lightColor: "#E8F5E9",
    accentClass: "text-apc-green",
    bgClass: "bg-apc-green/10",
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
    accentClass: "text-apc-blue",
    bgClass: "bg-apc-blue/10",
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
    accentClass: "text-apc-alert",
    bgClass: "bg-apc-alert/10",
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
    accentClass: "text-purple-700",
    bgClass: "bg-purple-100",
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
    accentClass: "text-teal-700",
    bgClass: "bg-teal-100",
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

export default function DomainesPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        title="Nos Domaines d'Intervention"
        subtitle="Cinq axes d'action complémentaires, conçus pour répondre aux besoins les plus urgents des communautés vulnérables de l'Est de la RD Congo."
        breadcrumbs={[{ label: "Domaines d'Intervention" }]}
        tag="Nos Axes d'Action"
      />

      {/* ── Domain sections ── */}
      {domaines.map((d, i) => {
        const isEven = i % 2 === 0
        const Icon = d.icon
        return (
          <section
            key={d.id}
            id={d.id}
            className={`py-20 ${isEven ? "bg-white" : "bg-apc-bgLight"}`}
          >
            <div className="container px-4">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                  !isEven ? "lg:grid-flow-dense" : ""
                }`}
              >
                {/* Image */}
                <div className={`relative h-[420px] rounded-3xl overflow-hidden shadow-xl ${!isEven ? "lg:col-start-2" : ""}`}>
                  <Image
                    src={d.image}
                    alt={d.title}
                    fill
                    className="object-cover"
                  />
                  {/* Color overlay */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `linear-gradient(135deg, ${d.color}88 0%, transparent 60%)`,
                    }}
                  />
                  {/* Stats strip */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="flex justify-around text-white">
                      {d.stats.map((s, si) => (
                        <div key={si} className="text-center">
                          <div className="text-2xl font-bold">{s.value}</div>
                          <div className="text-xs text-white/70">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={!isEven ? "lg:col-start-1 lg:row-start-1" : ""}>
                  {/* Icon + number */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
                      style={{ backgroundColor: d.lightColor }}
                    >
                      <Icon
                        className="w-7 h-7"
                        style={{ color: d.color }}
                      />
                    </div>
                    <span
                      className="text-5xl font-black opacity-10"
                      style={{ color: d.color }}
                    >
                      0{i + 1}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                    {d.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-7">
                    {d.description}
                  </p>

                  {/* Actions */}
                  <ul className="space-y-3 mb-8">
                    {d.actions.map((action, ai) => (
                      <li key={ai} className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full ${d.bgClass} flex items-center justify-center mt-0.5 shrink-0`}
                        >
                          <Check className={`w-3 h-3 ${d.accentClass}`} />
                        </div>
                        <span className="text-foreground/80 text-sm leading-snug">
                          {action}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/projets">
                    <Button
                      variant="outline"
                      className={`gap-2 border-2 hover:text-white`}
                      style={{
                        borderColor: d.color,
                        color: d.color,
                      }}
                    >
                      Voir nos projets <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {/* ── CTA ── */}
      <section className="py-20 bg-[#1a472a] text-white">
        <div className="container px-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Soutenez Nos Actions sur le Terrain
          </h2>
          <p className="text-white/75 text-lg mb-8">
            Votre contribution, quelle que soit sa forme, nous permet d'étendre 
            notre impact et d'atteindre davantage de personnes dans le besoin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/faire-un-don">
              <Button
                size="lg"
                variant="white"
                className="text-base px-8 w-full sm:w-auto"
              >
                Faire un Don
              </Button>
            </Link>
            <Link href="/nous-rejoindre">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 w-full sm:w-auto border-white/50 text-white hover:bg-white/10 hover:text-white"
              >
                Devenir Bénévole
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
