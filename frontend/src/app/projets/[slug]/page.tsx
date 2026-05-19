import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { getProjectBySlug, listProjects } from "@/lib/api/projects"
import {
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  ChevronRight,
  ArrowLeft,
  DollarSign,
} from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug).catch(() => null);
  
  if (!project) return { title: "Projet introuvable — APC" }
  return {
    title: `${project.title} — APC`,
    description: project.description,
  }
}

const categoryColors: Record<string, string> = {
  "agriculture": "bg-apc-green/10 text-apc-green border-apc-green/20",
  "protection": "bg-orange-100 text-orange-600 border-orange-200",
  "paix": "bg-apc-blue/10 text-apc-blue border-apc-blue/20",
  "dignite": "bg-purple-100 text-purple-700 border-purple-200",
}

export default async function ProjetDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const project = await getProjectBySlug(params.slug).catch(() => null);
  
  if (!project) notFound();

  // Fetch related projects (same category)
  const relatedRes = await listProjects({ category: project.category, limit: 3 }).catch(() => ({ data: [] }));
  const otherProjects = Array.isArray(relatedRes?.data)
    ? relatedRes.data.filter((p: any) => p.id !== project.id).slice(0, 2)
    : [];

  return (
    <div className="flex flex-col">
      <PageHero
        title={project.title}
        subtitle={project.description}
        breadcrumbs={[
          { label: "Projets", href: "/projets" },
          { label: project.title },
        ]}
        tag={project.category}
      />

      <section className="py-16 bg-apc-bgLight min-h-screen">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* ── Main content ── */}
            <div className="lg:col-span-2 space-y-10">
              {/* Image */}
              <div className="relative h-80 md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl">
                {project.mainImage ? (
                  <Image
                    src={project.mainImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-apc-green/20 to-apc-blue/10 flex items-center justify-center">
                    <span className="text-6xl">🌿</span>
                  </div>
                )}
              </div>

              {/* Description & Content */}
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-border/40 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-apc-green rounded-full" />
                  Présentation du Projet
                </h2>
                
                {/* We use dangerouslySetInnerHTML for HTML content from CMS/Backend */}
                <div 
                  className="prose prose-lg prose-apc max-w-none text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: project.content || project.description }}
                />
              </div>

              {/* Category badge */}
              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2 bg-white border border-border/50 rounded-2xl text-xs text-gray-500 font-bold uppercase tracking-widest shadow-sm">
                  #{project.category}
                </span>
                {project.province && (
                  <span className="px-5 py-2 bg-white border border-border/50 rounded-2xl text-xs text-gray-500 font-bold uppercase tracking-widest shadow-sm">
                    📍 {project.province}
                  </span>
                )}
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-8">
              {/* Status card */}
              <div className="bg-white rounded-[2rem] p-8 border border-border/40 shadow-xl sticky top-24">
                <h3 className="font-bold text-gray-900 mb-8 text-xs uppercase tracking-[0.2em] opacity-50">
                  Fiche Technique
                </h3>
                <div className="space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-apc-green/10 rounded-2xl flex items-center justify-center shrink-0">
                      <TrendingUp className="w-6 h-6 text-apc-green" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Catégorie</div>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${categoryColors[project.category] || "bg-gray-100"}`}>
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-apc-alert/10 rounded-2xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-apc-alert" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Localisation</div>
                      <div className="font-bold text-gray-900">{project.location}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-apc-blue/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6 text-apc-blue" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Impact Direct</div>
                      <div className="font-black text-2xl text-gray-900 leading-none">
                        {project.beneficiaries?.toLocaleString()}
                        <span className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-tighter">Bénéficiaires</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Calendrier</div>
                      <div className="text-sm text-gray-900 font-bold">
                        {new Date(project.startDate).getFullYear()} — {project.endDate ? new Date(project.endDate).getFullYear() : 'En cours'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-apc-greenLight/20 rounded-2xl flex items-center justify-center shrink-0">
                      <DollarSign className="w-6 h-6 text-apc-green" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Budget Total</div>
                      <div className="font-black text-2xl text-gray-900 leading-none">
                        {project.budget?.toLocaleString()}
                        <span className="text-xs font-bold text-gray-400 ml-2 uppercase">{project.currency}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar (simulated for now based on dates or simple calculation) */}
                <div className="mt-10 pt-10 border-t border-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">État d&apos;avancement</span>
                    <span className="font-black text-apc-green text-sm">85%</span>
                  </div>
                  <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-apc-green to-apc-greenLight rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>

                <div className="mt-10">
                  <Link href="/contact" className="block">
                    <Button className="w-full h-14 rounded-2xl bg-apc-green hover:bg-apc-green/90 text-white font-bold shadow-lg shadow-apc-green/20">
                      Soutenir ce Projet
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Other projects in same category ── */}
          {otherProjects.length > 0 && (
            <div className="mt-24 pt-24 border-t border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-10 flex items-center gap-3">
                <div className="w-2 h-8 bg-apc-blue rounded-full" />
                Projets Similaires
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {otherProjects.map((p: any) => (
                  <Link key={p.id} href={`/projets/${p.slug}`} className="group">
                    <div className="bg-white rounded-3xl overflow-hidden border border-border/40 shadow-sm hover:shadow-xl flex items-center transition-all">
                      <div className="relative w-32 md:w-48 h-32 md:h-48 shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center">
                        {p.mainImage ? (
                          <Image
                            src={p.mainImage}
                            alt={p.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <span className="text-3xl opacity-20">🌿</span>
                        )}
                      </div>
                      <div className="p-6 md:p-8 flex-1">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${categoryColors[p.category] || "bg-gray-100"}`}>
                          {p.category}
                        </span>
                        <h4 className="font-bold text-gray-900 text-lg mt-4 mb-2 group-hover:text-apc-green transition-colors line-clamp-2">
                          {p.title}
                        </h4>
                        <span className="text-apc-green text-xs font-bold flex items-center gap-2">
                          Découvrir <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-16 text-center">
            <Link href="/projets">
              <Button variant="ghost" className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] gap-3 hover:text-apc-green">
                <ArrowLeft className="w-4 h-4" />
                Retour à la liste des projets
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

