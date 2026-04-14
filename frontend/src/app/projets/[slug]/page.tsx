import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import {
  getProjectBySlug,
  projects,
  statusLabels,
  statusColors,
} from "@/lib/data"
import {
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  ChevronRight,
  ArrowLeft,
} from "lucide-react"

// Generate static paths from mock data
export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const project = getProjectBySlug(params.slug)
  if (!project) return { title: "Projet introuvable — APC" }
  return {
    title: `${project.title} — APC`,
    description: project.description,
  }
}

const domainLabels: Record<string, string> = {
  agriculture: "Agriculture & Résilience Économique",
  paix: "Paix & Cohésion Sociale",
  enfance: "Protection de l'Enfance",
  femmes: "Autonomisation Femmes & Jeunes",
  sante: "Santé, Nutrition & Milieu Rural",
}

export default function ProjetDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const project = getProjectBySlug(params.slug)
  if (!project) notFound()

  const otherProjects = projects
    .filter((p) => p.slug !== project.slug && p.domain === project.domain)
    .slice(0, 2)

  const progressWidth = `${project.progress}%`

  return (
    <div className="flex flex-col">
      <PageHero
        title={project.title}
        subtitle={project.description}
        breadcrumbs={[
          { label: "Projets", href: "/projets" },
          { label: project.title },
        ]}
        tag={domainLabels[project.domain]}
      />

      <section className="py-16 bg-apc-bgLight">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Main content ── */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-border/50 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  À propos de ce projet
                </h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                  {project.fullDescription.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-white border border-border/50 rounded-full text-xs text-muted-foreground font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-5">
              {/* Status card */}
              <div className="bg-white rounded-2xl p-6 border border-border/50 shadow-sm">
                <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">
                  Informations clés
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-apc-green/10 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-apc-green font-bold text-xs">ST</span>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-0.5">Statut</div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColors[project.status]}`}>
                        {statusLabels[project.status]}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-apc-alert/10 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-apc-alert" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-0.5">Localisation</div>
                      <div className="font-medium text-sm text-foreground">{project.location}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-apc-blue/10 rounded-lg flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-apc-blue" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-0.5">Bénéficiaires</div>
                      <div className="font-bold text-lg text-foreground">
                        {project.beneficiaries.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-0.5">Période</div>
                      <div className="text-sm text-foreground font-medium">
                        {new Date(project.startDate).getFullYear()} —{" "}
                        {new Date(project.endDate).getFullYear()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-apc-greenLight/20 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-apc-green font-bold text-[10px]">USD</span>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-0.5">Budget alloué</div>
                      <div className="font-bold text-lg text-foreground">
                        {project.budget.toLocaleString()} {project.currency}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                {project.status !== "upcoming" && (
                  <div className="mt-5 pt-5 border-t border-border/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Avancement global
                      </span>
                      <span className="font-bold text-apc-green text-sm">{project.progress}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-apc-green to-apc-greenLight rounded-full"
                        style={{ width: progressWidth }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="bg-apc-green rounded-2xl p-6 text-white text-center">
                <h3 className="font-bold text-lg mb-2">Soutenir ce projet</h3>
                <p className="text-white/75 text-sm mb-4">
                  Votre contribution aide directement les bénéficiaires de ce programme.
                </p>
                <Link href="/faire-un-don" className="block">
                  <Button variant="white" className="w-full">
                    Faire un Don
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* ── Other projects in same domain ── */}
          {otherProjects.length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl font-bold text-foreground mb-6">
                Autres projets dans ce domaine
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {otherProjects.map((p) => (
                  <Link key={p.id} href={`/projets/${p.slug}`} className="group">
                    <div className="bg-white rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md flex gap-0 hover:-translate-y-0.5 transition-all">
                      <div className="relative w-32 h-32 shrink-0">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[p.status]}`}>
                          {statusLabels[p.status]}
                        </span>
                        <h4 className="font-semibold text-foreground text-sm mt-2 mb-1 group-hover:text-apc-green transition-colors line-clamp-2">
                          {p.title}
                        </h4>
                        <span className="text-apc-green text-xs flex items-center gap-1">
                          Voir <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-10">
            <Link href="/projets">
              <Button variant="ghost" className="text-muted-foreground gap-2 hover:text-apc-green">
                <ArrowLeft className="w-4 h-4" />
                Retour à tous les projets
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
