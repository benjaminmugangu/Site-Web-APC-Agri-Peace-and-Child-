import Link from "next/link"
import Image from "next/image"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { listProjects } from "@/lib/api/projects"
import { MapPin, Users, ChevronRight } from "lucide-react"

export const metadata = {
  title: "Nos Projets — Agri-Peace and Child",
  description: "Découvrez l'ensemble des initiatives menées par Agri-Peace and Child sur le terrain.",
}

export const dynamic = 'force-dynamic';

const categoryColors: Record<string, string> = {
  "Agriculture": "bg-apc-green/10 text-apc-green",
  "Protection": "bg-orange-100 text-orange-600",
  "Paix": "bg-apc-blue/10 text-apc-blue",
  "Éducation": "bg-purple-100 text-purple-700",
}

export default async function ProjetsPage() {
  const projectsRes = await listProjects({ status: 'published' });
  const projects = projectsRes.data;

  return (
    <div className="flex flex-col">
      <PageHero
        title="Nos Projets"
        subtitle="Découvrez l'ensemble des initiatives menées par Agri-Peace and Child sur le terrain — programmes en cours et projets accomplis."
        breadcrumbs={[{ label: "Projets" }]}
        tag="Impact sur le Terrain"
      />

      <section className="py-16 bg-apc-bgLight min-h-screen">
        <div className="container px-4">
          {projects.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-muted-foreground italic">Aucun projet publié pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100 flex items-center justify-center">
                    {project.mainImage ? (
                      <Image
                        src={project.mainImage}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-4xl opacity-20">🌿</span>
                    )}
                    <span className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-md bg-white/90 shadow-sm ${categoryColors[project.category] || "bg-white text-gray-600"}`}>
                      {project.category}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="font-bold text-gray-900 text-xl leading-tight mb-3 group-hover:text-apc-green transition-colors line-clamp-2">
                      {project.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mb-6">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-apc-alert" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-apc-blue" />
                        {project.beneficiaries?.toLocaleString()} bénéficiaires
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Budget</span>
                        <span className="text-sm font-bold text-gray-900">{project.budget?.toLocaleString()} {project.currency}</span>
                      </div>
                      <Link href={`/projets/${project.slug}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-apc-green hover:bg-apc-green/5 font-bold gap-2"
                        >
                          Détails <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-16 text-center py-16 bg-[#1a472a] rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="relative z-10 px-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Soutenir nos actions sur le terrain
              </h3>
              <p className="text-apc-bgLight/80 mb-10 max-w-xl mx-auto text-lg">
                Votre contribution directe permet de transformer durablement la vie des communautés les plus vulnérables.
              </p>
              <Link href="/contact">
                <Button size="lg" variant="white" className="px-12 h-14 text-base font-bold shadow-xl hover:scale-105 transition-transform">
                  Faire un Don
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

