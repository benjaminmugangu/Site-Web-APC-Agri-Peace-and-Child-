import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/ui/fade-in"
import { settingsService } from "@/lib/api/settings"
import { listTeam } from "@/lib/api/team"
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
    "Découvrez l'histoire, la mission, la vision et les valeurs d'Agri-Peace and Child — ONG humanitaire engagée pour le développement durable en RD Congo.",
}

export const dynamic = 'force-dynamic';

// Mapping icon name → lucide component
const iconMap: Record<string, any> = { Sprout, Handshake, ShieldCheck, Users, Heart, Globe };

export default async function AProposPage() {
  const settings = await settingsService.get();
  const team = await listTeam();
  const activeMembers = team.filter((m: any) => m.status === "active");

  const stats = settings?.stats || {
    beneficiaries: "15 000+",
    projects: "32",
    provinces: "4",
    hectares: "450",
    womenPercentage: "80"
  };

  const inst = settings?.institution || {
    name: "Agri-Peace and Child",
    acronym: "APC",
    foundationYear: 2015,
    mission: "Contribuer à l'amélioration des conditions de vie des personnes vulnérables — enfants, femmes et orphelins — à travers l'agriculture durable, la nutrition, la promotion des droits de l'enfant, la paix et la résilience communautaire.",
    vision: "Un pays où les enfants et les personnes vulnérables vivent dans la dignité, jouissent pleinement de leurs droits fondamentaux, bénéficient d'une sécurité alimentaire durable et évoluent dans un environnement pacifique et résilient."
  };

  // Section histoire dynamique
  const historySection = settings?.historySection || {
    title: "Une organisation née de la nécessité du terrain",
    subtitle: "Notre Histoire",
    paragraphs: [
      `Fondée en ${inst.foundationYear}, <strong>${inst.name} (${inst.acronym})</strong> est une Organisation Non Gouvernementale humanitaire dont le siège est établi à <strong>Goma, Nord-Kivu, RD Congo</strong>.`,
      "Face aux crises récurrentes qui frappent l'Est de la RDC, nos fondateurs ont décidé d'agir localement avec une approche intégrée conjuguant agriculture durable, protection sociale et consolidation de la paix.",
      `Aujourd'hui, nous intervenons dans plusieurs provinces de l'Est, touchant plus de <strong>${stats.beneficiaries} bénéficiaires directs</strong>.`
    ],
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
    objectives: [
      { label: "Promouvoir l'agriculture durable et la sécurité alimentaire", icon: "Sprout", color: "text-apc-green", bg: "bg-apc-green/10" },
      { label: "Consolider la paix et la cohésion sociale", icon: "Handshake", color: "text-apc-blue", bg: "bg-apc-blue/10" },
      { label: "Protéger et promouvoir les droits des enfants", icon: "ShieldCheck", color: "text-apc-alert", bg: "bg-apc-alert/10" },
      { label: "Autonomiser les femmes et les jeunes", icon: "Users", color: "text-purple-600", bg: "bg-purple-100" },
      { label: "Améliorer l'accès aux services sociaux de base", icon: "Heart", color: "text-rose-600", bg: "bg-rose-100" }
    ]
  };

  const name = inst.name;
  const acronym = inst.acronym;
  const foundationYear = inst.foundationYear;
  const mission = inst.mission;
  const vision = inst.vision;

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
            <FadeIn direction="right">
              <span className="inline-block text-apc-green font-semibold text-sm tracking-widest uppercase mb-4">{historySection.subtitle || 'Notre Histoire'}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                {historySection.title || 'Une organisation née de la nécessité du terrain'}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {(historySection.paragraphs || []).map((para: string, i: number) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
                ))}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-apc-bgLight border border-border/50">
                  <Calendar className="w-5 h-5 text-apc-green mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Année de Fondation</div>
                    <div className="font-semibold text-sm text-foreground">{foundationYear}</div>
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

            <FadeIn direction="left" delay={0.15}>
              <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={historySection.imageUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"}
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
            <span className="inline-block text-apc-green font-semibold text-sm tracking-widest uppercase mb-4">Nos Fondements</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Mission & Vision</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-apc-green rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Notre Mission</h3>
                <p className="text-white/85 leading-relaxed text-sm md:text-base">
                  {mission}
                </p>
              </div>
            </div>

            <div className="bg-apc-blue rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Notre Vision</h3>
                <p className="text-white/85 leading-relaxed italic text-sm md:text-base">
                  « {vision} »
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
              <span className="inline-block text-apc-green font-semibold text-sm tracking-widest uppercase mb-4">Ce que nous faisons</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Nos Objectifs Spécifiques</h2>
              <div className="space-y-4">
                {(historySection.objectives || []).map((obj: any, i: number) => {
                  const Icon = iconMap[obj.icon] || Globe;
                  return (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 hover:border-apc-green/30 hover:shadow-sm transition-all group">
                      <div className={`w-10 h-10 ${obj.bg} rounded-xl flex items-center justify-center shrink-0`}>
                        <Icon className={`w-5 h-5 ${obj.color}`} />
                      </div>
                      <span className="text-foreground font-medium leading-snug group-hover:text-apc-green transition-colors">{obj.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-apc-green rounded-3xl p-8 text-white text-center">
                  <div className="text-5xl font-bold mb-2">450</div>
                  <div className="text-white/80 text-sm">Hectares cultivés</div>
                </div>
                <div className="bg-apc-bgLight border border-border rounded-3xl p-8 text-center mt-6">
                  <div className="text-5xl font-bold text-apc-blue mb-2">80%</div>
                  <div className="text-muted-foreground text-sm">Femmes bénéficiaires</div>
                </div>
                <div className="bg-apc-bgLight border border-border rounded-3xl p-8 text-center -mt-6">
                  <div className="text-5xl font-bold text-apc-alert mb-2">{stats.projects}</div>
                  <div className="text-muted-foreground text-sm">Projets réalisés</div>
                </div>
                <div className="bg-[#1a472a] rounded-3xl p-8 text-white text-center">
                  <div className="text-5xl font-bold mb-2 text-apc-greenLight">{stats.provinces}</div>
                  <div className="text-white/80 text-sm">Provinces couvertes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Équipe ── */}
      <section id="equipe" className="py-24 bg-white border-t border-gray-50">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-apc-green font-semibold text-sm tracking-widest uppercase mb-4">Les Personnes Derrière la Mission</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Notre Équipe</h2>
            <p className="text-muted-foreground mt-4">
              Des professionnels engagés qui consacrent leur expertise au service des communautés vulnérables.
            </p>
          </div>
          
          {activeMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeMembers.map((member: any) => {
                const fullName = member.name || (member.firstName && member.lastName ? `${member.firstName} ${member.lastName}` : "Collaborateur APC");
                const displayRole = member.role || member.position || "Expert";
                const displayPhoto = member.photoUrl || member.photo;
                
                // Extraction intelligente des initiales
                const parts = fullName.trim().split(/\s+/);
                const initials = parts.length >= 2 
                  ? (parts[0][0] + parts[1][0]).toUpperCase()
                  : parts[0].slice(0, 2).toUpperCase();

                return (
                  <Link key={member.id} href={`/equipe/${member.id}`} className="group bg-apc-bgLight rounded-2xl p-6 text-center border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-in fade-in duration-500 block">
                    {displayPhoto ? (
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 shadow-md">
                        <Image src={displayPhoto} alt={fullName} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-apc-green flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-md">
                        {initials}
                      </div>
                    )}
                    <h3 className="font-bold text-foreground text-sm leading-snug mb-1">
                      {fullName}
                    </h3>
                    <p className="text-apc-green text-xs font-medium mb-3">{displayRole}</p>
                    {member.bio && <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">{member.bio}</p>}
                    <span className="inline-block mt-4 text-xs font-bold text-apc-green opacity-0 group-hover:opacity-100 transition-opacity">
                      Voir le profil →
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Mise à jour de l'équipe en cours...</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-apc-green text-white">
        <div className="container px-4 text-center max-w-3xl mx-auto">
          <BookOpen className="w-12 h-12 mx-auto mb-6 text-apc-greenLight opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Rejoignez Notre Mission</h2>
          <p className="text-white/80 text-lg mb-8">
            Que vous souhaitiez faire un don, devenir bénévole ou établir un partenariat, votre engagement fait la différence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="white" size="lg" className="text-base px-8 w-full sm:w-auto">Nous Soutenir</Button>
            </Link>
            <Link href="/nous-rejoindre">
              <Button variant="outline" size="lg" className="text-base px-8 w-full sm:w-auto border-white/50 text-white hover:bg-white/10 hover:text-white">
                Devenir Bénévole <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
