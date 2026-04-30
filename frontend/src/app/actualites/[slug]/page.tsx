import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { getArticleBySlug, articles, categoryColors } from "@/lib/data"
import {
  Calendar,
  Clock,
  ArrowLeft,
  ChevronRight,
  Globe,
} from "lucide-react"

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const article = getArticleBySlug(params.slug)
  if (!article) return { title: "Article introuvable — APC" }
  return {
    title: article.title,
    description: article.excerpt,
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function ArticleDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const article = getArticleBySlug(params.slug)
  if (!article) notFound()

  const related = articles
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .slice(0, 3)

  const others = related.length < 3
    ? [
        ...related,
        ...articles
          .filter((a) => a.slug !== article.slug && !related.includes(a))
          .slice(0, 3 - related.length),
      ]
    : related

  return (
    <div className="flex flex-col">
      <PageHero
        title={article.title}
        subtitle={article.excerpt}
        breadcrumbs={[
          { label: "Actualités", href: "/actualites" },
          { label: article.category, href: "/actualites" },
          { label: article.title },
        ]}
        tag={article.category}
      />

      <section className="py-16 bg-apc-bgLight">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Main Article ── */}
            <article className="lg:col-span-2 space-y-6">
              {/* Hero image */}
              <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
                <span
                  className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm bg-white/90 ${
                    categoryColors[article.category] || "text-gray-700"
                  }`}
                >
                  {article.category}
                </span>
              </div>

              {/* Meta bar */}
              <div className="bg-white rounded-2xl p-5 border border-border/50 shadow-sm flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-apc-green" />
                  <span>{formatDate(article.date)}</span>
                </div>
                <div className="w-px h-4 bg-border hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-apc-green" />
                  <span>{article.readTime} min de lecture</span>
                </div>
                <div className="w-px h-4 bg-border hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-apc-green" />
                  <span>Par <strong className="text-foreground">{article.author}</strong></span>
                </div>
              </div>

              {/* Article body */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-border/50 shadow-sm">
                {/* Excerpt as lead */}
                <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-apc-green pl-5 mb-8 italic">
                  {article.excerpt}
                </p>

                {/* Placeholder content — to be replaced by rich text from CMS */}
                <div className="prose prose-green max-w-none space-y-5 text-muted-foreground leading-relaxed">
                  <p>
                    Dans le cadre de ses activités de terrain, APC continue de déployer ses équipes
                    dans les zones les plus vulnérables de l&apos;Est de la République Démocratique du Congo.
                    Cet article présente les détails et résultats liés à cette initiative.
                  </p>
                  <p>
                    Le travail accompli s&apos;inscrit dans notre mission fondamentale : contribuer à
                    l&apos;amélioration durable des conditions de vie des populations vulnérables, à travers
                    une approche intégrée qui combine aspects humanitaires, développement agricole
                    et consolidation de la paix.
                  </p>
                  <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
                    Contexte et Enjeux
                  </h3>
                  <p>
                    La situation humanitaire dans l&apos;Est du Congo continue de nécessiter une réponse
                    rapide et coordonnée. Les déplacements de population, les crises alimentaires
                    et les tensions intercommunautaires constituent des défis permanents auxquels
                    APC répond avec les outils adaptés à chaque territoire d&apos;intervention.
                  </p>
                  <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
                    Résultats & Impact
                  </h3>
                  <p>
                    Les résultats obtenus témoignent de l&apos;efficacité de notre approche de proximité.
                    Grâce à l&apos;engagement de nos équipes terrain et au soutien de nos partenaires,
                    nous avons pu atteindre les objectifs fixés et générer un impact mesurable
                    sur la vie des bénéficiaires.
                  </p>
                  <p>
                    <em>
                      Le contenu complet de cet article sera disponible dès le lancement
                      de la plateforme CMS backend APC. Pour plus d&apos;informations, contactez-nous
                      directement.
                    </em>
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border/40">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-apc-bgLight border border-border/50 rounded-full text-xs text-muted-foreground font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share / CTA */}
              <div className="bg-apc-green rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    Cet article vous a touché ?
                  </h3>
                  <p className="text-white/75 text-sm">
                    Soutenez notre mission sur le terrain.
                  </p>
                </div>
                <Link href="/contact?sujet=don" className="shrink-0">
                  <Button variant="white" className="px-6">
                    Faire un Don
                  </Button>
                </Link>
              </div>

              {/* Back link */}
              <Link href="/actualites">
                <Button
                  variant="ghost"
                  className="text-muted-foreground gap-2 hover:text-apc-green"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour aux actualités
                </Button>
              </Link>
            </article>

            {/* ── Sidebar ── */}
            <aside className="space-y-6">
              {/* About APC block */}
              <div className="bg-[#1a472a] rounded-2xl p-6 text-white">
                <div className="w-12 h-12 bg-apc-greenLight/20 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-apc-greenLight font-bold text-xl">A</span>
                </div>
                <h3 className="font-bold text-lg mb-2">À propos d&apos;APC</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  ONG humanitaire fondée en 2017 à Goma, RDC. Nous agissons pour
                  la Protection, l&apos;Agriculture, la Dignité et la Paix.
                </p>
                <Link href="/a-propos">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-white/40 text-white hover:bg-white/10 hover:text-white"
                  >
                    En savoir plus
                  </Button>
                </Link>
              </div>

              {/* Related articles */}
              {others.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-border/50 shadow-sm">
                  <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">
                    Autres Actualités
                  </h3>
                  <div className="space-y-4">
                    {others.map((a) => (
                      <Link
                        key={a.id}
                        href={`/actualites/${a.slug}`}
                        className="group flex gap-3 hover:bg-apc-bgLight rounded-xl p-2 -mx-2 transition-colors"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={a.image}
                            alt={a.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              categoryColors[a.category] || "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {a.category}
                          </span>
                          <p className="text-sm font-medium text-foreground mt-1 line-clamp-2 group-hover:text-apc-green transition-colors leading-snug">
                            {a.title}
                          </p>
                          <span className="text-[11px] text-muted-foreground">
                            {formatDate(a.date)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/40">
                    <Link
                      href="/actualites"
                      className="text-apc-green text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Voir toutes les actualités{" "}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Newsletter mini block */}
              <div className="bg-apc-bgLight rounded-2xl p-5 border border-border/50">
                <h3 className="font-bold text-foreground mb-2 text-sm">
                  📬 Newsletter APC
                </h3>
                <p className="text-muted-foreground text-xs mb-3 leading-relaxed">
                  Recevez nos actualités et rapports directement par email.
                </p>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full px-3 py-2 rounded-xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30 mb-2"
                />
                <Button size="sm" className="w-full text-xs">
                  S&apos;inscrire
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
