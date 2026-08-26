import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { listArticles } from "@/lib/api/articles"
import { listTestimonials } from "@/lib/api/testimonials"
import { Calendar, Clock, ChevronRight, ArrowRight, Quote, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Actualités & Rapports — APC",
  description: "Suivez les dernières nouvelles d'APC : rapports de terrain, résultats de projets, partenariats et événements.",
}

export const dynamic = 'force-dynamic';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const categoryColors: Record<string, string> = {
  "Rapport": "bg-apc-green/10 text-apc-green",
  "Terrain": "bg-amber-100 text-amber-700",
  "Impact": "bg-blue-100 text-blue-700",
  "Partenariat": "bg-purple-100 text-purple-700",
}

export default async function ActualitesPage() {
  const articlesRes = await listArticles({ status: 'published' });
  const articles = articlesRes.data;
  const testimonials = await listTestimonials().catch(() => []);

  const featured = articles.find((a: any) => a.featured) || articles[0];
  const rest = articles.filter((a: any) => a.id !== featured?.id);

  return (
    <div className="flex flex-col">
      <PageHero
        title="Actualités & Rapports"
        subtitle="Restez informés des avancées de nos programmes, des témoignages du terrain et des résultats concrets de nos projets."
        breadcrumbs={[{ label: "Actualités" }]}
        tag="Dernières Nouvelles"
      />

      <section className="py-16 bg-apc-bgLight min-h-screen">
        <div className="container px-4">
          {!featured ? (
            <div className="text-center py-24 text-muted-foreground italic">
              Aucun article publié pour le moment.
            </div>
          ) : (
            <>
              {/* ── Featured Article ── */}
              <Link href={`/actualites/${featured.slug}`} className="group block mb-12">
                <article className="relative h-[420px] md:h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <Image
                    src={featured.mainImage}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-md bg-white/90 ${categoryColors[featured.category?.name || ""] || "text-gray-900"}`}>
                        {featured.category?.name}
                      </span>
                      <span className="text-white/70 text-xs flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(featured.publishDate || featured.createdAt)}
                      </span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4 group-hover:text-apc-greenLight transition-colors max-w-4xl">
                      {featured.title}
                    </h2>
                    <p className="text-white/80 text-base md:text-lg leading-relaxed line-clamp-2 mb-6 max-w-2xl">
                      {featured.excerpt}
                    </p>

                    <div className="flex items-center gap-2 text-apc-greenLight font-bold text-sm tracking-wide">
                      Lire l&apos;article complet
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>

                  <div className="absolute top-6 right-6 bg-apc-alert text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-xl uppercase tracking-widest">
                    ★ À la Une
                  </div>
                </article>
              </Link>

              {/* ── Article grid ── */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {rest.map((article: any) => (
                    <Link
                      key={article.id}
                      href={`/actualites/${article.slug}`}
                      className="group"
                    >
                      <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-border/40 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={article.mainImage}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-md bg-white/90 shadow-sm ${categoryColors[article.category?.name || ""] || "text-gray-900"}`}>
                            {article.category?.name}
                          </span>
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(article.publishDate || article.createdAt)}
                            </span>
                          </div>

                          <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3 flex-1 group-hover:text-apc-green transition-colors line-clamp-3">
                            {article.title}
                          </h3>
                          <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                            {article.excerpt}
                          </p>

                          <div className="flex items-center justify-between pt-5 border-t border-gray-50 mt-auto">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              Par {article.author || 'APC'}
                            </span>
                            <span className="text-apc-green text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                              Lire <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── Testimonials Section ── */}
          {testimonials && testimonials.length > 0 && (
            <div className="mt-20 mb-24">
              <div className="text-center max-w-2xl mx-auto space-y-4 mb-16 text-black">
                <span className="text-xs font-bold text-[#1a472a] uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full">
                  Impact & Témoignages
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Voix de nos Bénéficiaires
                </h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  Découvrez l&apos;impact de nos actions à travers les récits des personnes et des communautés que nous accompagnons au quotidien.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial: any) => (
                  <div 
                    key={testimonial.id}
                    className="bg-white rounded-3xl p-8 shadow-sm border border-border/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group overflow-hidden"
                  >
                    {/* Quote mark decoration */}
                    <div className="absolute right-6 top-6 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
                      <Quote size={56} />
                    </div>

                    <div className="flex-1 z-10">
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 italic relative">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-6 border-t border-gray-50 shrink-0">
                      {testimonial.photoUrl ? (
                        <img 
                          src={testimonial.photoUrl} 
                          alt={testimonial.authorName} 
                          className="w-12 h-12 rounded-2xl object-cover border border-gray-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold border border-emerald-100 shadow-sm">
                          {testimonial.authorName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900 leading-snug">{testimonial.authorName}</h4>
                        <p className="text-xs text-gray-500">{testimonial.authorRole || "Bénéficiaire"}</p>
                        {testimonial.authorLocation && (
                          <span className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-0.5 animate-fade-in">
                            <MapPin size={8} /> {testimonial.authorLocation}
                          </span>
                        )}
                      </div>
                    </div>

                    {testimonial.projectName && (
                      <div className="mt-4 pt-3 flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-50/50">
                        <span className="font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50/60 px-2 py-0.5 rounded">
                          {testimonial.projectName}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Newsletter CTA ── */}
          <div className="bg-[#1a472a] rounded-[2.5rem] p-10 md:p-16 text-white text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ne Manquez Aucune Actualité
              </h3>
              <p className="text-apc-bgLight/80 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                Inscrivez-vous à notre newsletter pour recevoir nos rapports de terrain et actualités directement dans votre boîte mail.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-apc-greenLight/50 text-base"
                  required
                />
                <Button variant="white" className="shrink-0 px-8 h-14 text-base font-bold shadow-xl hover:scale-105 transition-transform">
                  S&apos;inscrire
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

