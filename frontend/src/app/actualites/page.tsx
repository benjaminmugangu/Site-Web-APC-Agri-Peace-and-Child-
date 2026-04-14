import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { articles, categoryColors } from "@/lib/data"
import { Calendar, Clock, ChevronRight, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Actualités & Rapports — APC",
  description:
    "Suivez les dernières nouvelles d'APC : rapports de terrain, résultats de projets, partenariats et événements.",
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function ActualitesPage() {
  const featured = articles.find((a) => a.featured)
  const rest = articles.filter((a) => !a.featured)

  // Unique categories
  const categories = ["Tous", ...Array.from(new Set(articles.map((a) => a.category)))]

  return (
    <div className="flex flex-col">
      <PageHero
        title="Actualités & Rapports"
        subtitle="Restez informés des avancées de nos programmes, des témoignages du terrain et des résultats concrets de nos projets."
        breadcrumbs={[{ label: "Actualités" }]}
        tag="Dernières Nouvelles"
      />

      <section className="py-16 bg-apc-bgLight">
        <div className="container px-4">
          {/* ── Categories strip ── */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <span
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all border ${
                  cat === "Tous"
                    ? "bg-apc-green text-white border-apc-green shadow-md"
                    : "bg-white text-muted-foreground border-border/50 hover:border-apc-green/40 hover:text-apc-green"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* ── Featured Article ── */}
          {featured && (
            <Link href={`/actualites/${featured.slug}`} className="group block mb-10">
              <article className="relative h-[420px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        categoryColors[featured.category] || "bg-white/20 text-white"
                      }`}
                    >
                      {featured.category}
                    </span>
                    <span className="text-white/60 text-xs flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(featured.date)}
                    </span>
                    <span className="text-white/60 text-xs flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featured.readTime} min de lecture
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-3 group-hover:text-apc-greenLight transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-white/75 text-sm md:text-base leading-relaxed line-clamp-2 mb-4 max-w-2xl">
                    {featured.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-apc-greenLight font-medium text-sm">
                    Lire l&apos;article complet
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Featured badge */}
                <div className="absolute top-5 right-5 bg-apc-alert text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  ★ À la Une
                </div>
              </article>
            </Link>
          )}

          {/* ── Article grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {rest.map((article) => (
              <Link
                key={article.id}
                href={`/actualites/${article.slug}`}
                className="group"
              >
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span
                      className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm bg-white/85 ${
                        categoryColors[article.category] || "text-gray-600"
                      }`}
                    >
                      {article.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(article.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime} min
                      </span>
                    </div>

                    <h3 className="font-bold text-foreground leading-snug mb-2 flex-1 group-hover:text-apc-green transition-colors line-clamp-3">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-auto">
                      <span className="text-xs text-muted-foreground">
                        Par {article.author}
                      </span>
                      <span className="text-apc-green text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Lire <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* ── Newsletter CTA ── */}
          <div className="bg-apc-green rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Ne Manquez Aucune Actualité
              </h3>
              <p className="text-white/75 mb-6 max-w-md mx-auto">
                Inscrivez-vous à notre newsletter pour recevoir nos rapports, 
                actualités et appels à l'action directement dans votre boîte mail.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/15 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60 text-sm"
                />
                <Button variant="white" className="shrink-0 px-6">
                  S&apos;inscrire
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
