import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/ui/fade-in"
import { apc } from "@/lib/data"
import { mockTeam } from "@/lib/data/mock-team"
import {
  Heart,
  ShieldCheck,
  Sprout,
  Handshake,
  ChevronRight,
  MapPin,
  Calendar,
  Target,
  Globe,
  Users,
  BookOpen,
} from "lucide-react"

export const metadata: Metadata = {
  title: "À Propos — Agri-Peace and Child",
  description:
    "Découvrez l'histoire, la mission, la vision et les valeurs d'Agri-Peace and Child — ONG humanitaire fondée en 2017 à Goma, RD Congo.",
}

const objectifs = [
  {
    icon: Sprout,
    color: "text-apc-green",
    bg: "bg-apc-green/10",
    label: "Promouvoir l'agriculture durable et la sécurité alimentaire",
  },
  {
    icon: Handshake,
    color: "text-apc-blue",
    bg: "bg-apc-blue/10",
    label: "Consolider la paix et la cohésion sociale",
  },
  {
    icon: ShieldCheck,
    color: "text-apc-alert",
    bg: "bg-apc-alert/10",
    label: "Protéger et promouvoir les droits des enfants",
  },
  {
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-100",
    label: "Autonomiser les femmes et les jeunes",
  },
  {
    icon: Heart,
    color: "text-rose-600",
    bg: "bg-rose-100",
    label: "Améliorer l'accès aux services sociaux de base",
  },
]

const valeurs = [
  { icon: Heart, label: "Humanité", desc: "Chaque action est guidée par notre profond respect de la dignité humaine.", color: "text-rose-500", bg: "bg-rose-50" },
  { icon: ShieldCheck, label: "Intégrité", desc: "Nous agissons avec transparence, éthique et redevabilité envers nos bénéficiaires et partenaires.", color: "text-apc-green", bg: "bg-apc-green/5" },
  { icon: Handshake, label: "Partenariat", desc: "Nous croyons en la force de la collaboration et du travail communautaire.", color: "text-apc-blue", bg: "bg-apc-blue/5" },
  { icon: Sprout, label: "Durabilité", desc: "Nos interventions visent un impact pérenne au-delà de notre présence directe.", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: Globe, label: "Inclusion", desc: "Nous intervenons sans discrimination, en prenant soin des plus vulnérables.", color: "text-apc-alert", bg: "bg-apc-alert/5" },
]

export default function AProposPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        title="À Propos"
        subtitle="Découvrez qui nous sommes, notre histoire et les valeurs qui guident chaque action que nous menons pour les communautés vulnérables."
        breadcrumbs={[{ label: "À Propos" }]}
        tag="Notre Organisation"
      />

      {/* ── Notre Histoire ── */}
      <section id="histoire" className="py-24 bg-white">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <FadeIn direction="right">
              <span className="inline-block text-apc-green font-semibold text-sm tracking-widest uppercase mb-4">
                Notre Histoire
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                Une organisation née de la{" "}
                <span className="text-gradient">nécessité du terrain</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Fondée le <strong className="text-foreground">{apc.founded}</strong>,{" "}
                  <strong className="text-apc-green">Agri-Peace and Child</strong> est
                  une Organisation Non Gouvernementale humanitaire dont le siège est établi à{" "}
                  <strong className="text-foreground">Goma, Nord-Kivu, RD Congo</strong>.
                </p>
                <p>
                  Face aux crises récurrentes qui frappent l&apos;Est de la RDC — conflits armés,
                  déplacements massifs, insécurité alimentaire — nos fondateurs ont décidé d&apos;agir
                  localement avec une approche intégrée conjuguant agriculture, protection sociale
                  et consolidation de la paix.
                </p>
                <p>
                  Depuis notre création, nous avons étendu nos activités au Nord-Kivu, au
                  Sud-Kivu, en Ituri et au Tanganyika, touchant plus de <strong className="text-foreground">15 000 bénéficiaires directs</strong>.
                </p>
              </div>

              {/* Key info */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-apc-bgLight border border-border/50">
                  <Calendar className="w-5 h-5 text-apc-green mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Fondée le</div>
                    <div className="font-semibold text-sm text-foreground">{apc.founded}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-apc-bgLight border border-border/50">
                  <MapPin className="w-5 h-5 text-apc-green mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Siège Social</div>
                    <div className="font-semibold text-sm text-foreground">Goma, Nord-Kivu</div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Image — sans overlay statistiques */}
            <FadeIn direction="left" delay={0.15}>
              <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
                  alt="Équipe Agri-Peace and Child sur le terrain"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-apc-green/10" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section id="mission" className="py-24 bg-apc-bgLight">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-apc-green font-semibold text-sm tracking-widest uppercase mb-4">
              Nos Fondements
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Mission & Vision
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-apc-green rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Notre Mission</h3>
                <p className="text-white/85 leading-relaxed">
                  Contribuer à l'amélioration des conditions de vie des personnes vulnérables — 
                  enfants, femmes et orphelins — à travers l'agriculture durable, la nutrition, 
                  la promotion des droits de l'enfant, la paix et la résilience communautaire.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-apc-blue rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Notre Vision</h3>
                <p className="text-white/85 leading-relaxed italic">
                  « Un pays où les enfants et les personnes vulnérables vivent dans la dignité, 
                  jouissent pleinement de leurs droits fondamentaux, bénéficient d'une sécurité 
                  alimentaire durable et évoluent dans un environnement pacifique et résilient. »
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Objectifs ── */}
      <section className="py-24 bg-white">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-apc-green font-semibold text-sm tracking-widest uppercase mb-4">
                Ce que nous faisons
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nos Objectifs Spécifiques
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Cinq axes d'action complémentaires qui structurent notre 
                intervention et garantissent un impact durable.
              </p>
              <div className="space-y-4">
                {objectifs.map((obj, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 hover:border-apc-green/30 hover:shadow-sm transition-all group"
                  >
                    <div className={`w-10 h-10 ${obj.bg} rounded-xl flex items-center justify-center shrink-0`}>
                      <obj.icon className={`w-5 h-5 ${obj.color}`} />
                    </div>
                    <span className="text-foreground font-medium leading-snug group-hover:text-apc-green transition-colors">
                      {obj.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats visual */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-apc-green rounded-3xl p-8 text-white text-center">
                  <div className="text-5xl font-bold mb-2">{apc.stats.hectares}</div>
                  <div className="text-white/80 text-sm">Hectares cultivés</div>
                </div>
                <div className="bg-apc-bgLight border border-border rounded-3xl p-8 text-center mt-6">
                  <div className="text-5xl font-bold text-apc-blue mb-2">{apc.stats.womenPercentage}%</div>
                  <div className="text-muted-foreground text-sm">Femmes bénéficiaires</div>
                </div>
                <div className="bg-apc-bgLight border border-border rounded-3xl p-8 text-center -mt-6">
                  <div className="text-5xl font-bold text-apc-alert mb-2">{apc.stats.projects}</div>
                  <div className="text-muted-foreground text-sm">Projets réalisés</div>
                </div>
                <div className="bg-[#1a472a] rounded-3xl p-8 text-white text-center">
                  <div className="text-5xl font-bold mb-2 text-apc-greenLight">{apc.stats.provinces}</div>
                  <div className="text-white/80 text-sm">Provinces couvertes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Valeurs ── */}
      <section className="py-24 bg-apc-bgLight">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-apc-green font-semibold text-sm tracking-widest uppercase mb-4">
              Ce qui nous guide
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Nos Valeurs Fondamentales
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {valeurs.map((v, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className={`w-14 h-14 ${v.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <v.icon className={`w-7 h-7 ${v.color}`} />
                </div>
                <h3 className="font-bold text-foreground mb-2">{v.label}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Équipe — connectée au backend via mock-team ── */}
      <section id="equipe" className="py-24 bg-white">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-apc-green font-semibold text-sm tracking-widest uppercase mb-4">
              Les Personnes Derrière la Mission
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Notre Équipe</h2>
            <p className="text-muted-foreground mt-4">
              Des professionnels engagés, issus de la région, qui consacrent leur expertise
              au service des communautés vulnérables.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTeam.filter((m) => m.status === "active").map((member) => (
              <div
                key={member.id}
                className="group bg-apc-bgLight rounded-2xl p-6 text-center border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Avatar avec initiales — photo uploadable depuis l'admin */}
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-md group-hover:scale-105 transition-transform ${member.avatarColor}`}
                >
                  {member.avatarInitials}
                </div>
                <h3 className="font-bold text-foreground text-sm leading-snug mb-1">
                  {member.name}
                </h3>
                <p className="text-apc-green text-xs font-medium mb-3">{member.role}</p>
                {member.bio && (
                  <p className="text-muted-foreground text-xs leading-relaxed">{member.bio}</p>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-sm mt-8">
            Notre équipe est complétée par des bénévoles et partenaires dédiés sur le terrain.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-apc-green text-white">
        <div className="container px-4 text-center max-w-3xl mx-auto">
          <BookOpen className="w-12 h-12 mx-auto mb-6 text-apc-greenLight opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Rejoignez Notre Mission
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Que vous souhaitiez faire un don, devenir bénévole ou établir un partenariat, 
            votre engagement fait la différence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact?sujet=don">
              <Button
                variant="white"
                size="lg"
                className="text-base px-8 w-full sm:w-auto"
              >
                Nous Soutenir
              </Button>
            </Link>
            <Link href="/nous-rejoindre">
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 w-full sm:w-auto border-white/50 text-white hover:bg-white/10 hover:text-white"
              >
                Devenir Bénévole <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
