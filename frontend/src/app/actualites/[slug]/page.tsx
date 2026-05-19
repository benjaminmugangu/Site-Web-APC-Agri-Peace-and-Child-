import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { getArticleBySlug, listArticles } from "@/lib/api/articles"
import {
  Calendar,
  Clock,
  ArrowLeft,
  ChevronRight,
  Globe,
  User,
} from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug).catch(() => null);
  
  if (!article) return { title: "Article introuvable — APC" }
  return {
    title: article.title,
    description: article.excerpt,
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const categoryColors: Record<string, string> = {
  "Rapport": "bg-apc-green/10 text-apc-green border-apc-green/20",
  "Terrain": "bg-amber-100 text-amber-700 border-amber-200",
  "Impact": "bg-blue-100 text-blue-700 border-blue-200",
  "Partenariat": "bg-purple-100 text-purple-700 border-purple-200",
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const article = await getArticleBySlug(params.slug).catch(() => null);
  
  if (!article) notFound();

  // Fetch recent articles for sidebar
  const recentRes = await listArticles({ perPage: 4, status: 'published' }).catch(() => ({ data: [] }));
  const others = Array.isArray(recentRes?.data) 
    ? recentRes.data.filter((a: any) => a.id !== article.id).slice(0, 3)
    : [];

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

      <section className="py-16 bg-apc-bgLight min-h-screen">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* ── Main Article ── */}
            <article className="lg:col-span-2 space-y-8">
              {/* Hero image */}
              <div className="relative h-80 md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <Image
                  src={article.mainImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
                <span
                  className={`absolute top-6 left-6 text-[10px] font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full backdrop-blur-md bg-white/90 shadow-xl ${
                    categoryColors[article.category] || "text-gray-900"
                  }`}
                >
                  {article.category}
                </span>
              </div>

              {/* Meta bar */}
              <div className="bg-white rounded-[1.5rem] p-6 border border-border/40 shadow-sm flex flex-wrap items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-apc-green" />
                  <span>{formatDate(article.publishDate || article.createdAt)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-apc-green" />
                  <span>Par <strong className="text-gray-900">{article.author || 'APC Admin'}</strong></span>
                </div>
              </div>

              {/* Article body */}
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-border/40 shadow-sm">
                {/* Excerpt as lead */}
                <p className="text-xl text-gray-500 leading-relaxed border-l-4 border-apc-green pl-6 mb-12 italic font-medium">
                  {article.excerpt}
                </p>

                {/* Content from CMS */}
                <div 
                  className="prose prose-lg prose-apc max-w-none text-gray-600 leading-relaxed space-y-6"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-50">
                    {article.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-4 py-1.5 bg-gray-50 border border-border/30 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Share / CTA */}
              <div className="bg-[#1a472a] rounded-[2rem] p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
                <div className="relative z-10 text-center md:text-left">
                  <h3 className="font-bold text-xl md:text-2xl mb-2">
                    Soutenir nos actions sur le terrain
                  </h3>
                  <p className="text-apc-bgLight/70 text-sm md:text-base">
                    Votre aide est précieuse pour la réussite de nos programmes humanitaires.
                  </p>
                </div>
                <Link href="/contact" className="shrink-0 relative z-10">
                  <Button variant="white" className="px-10 h-14 font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-transform">
                    Faire un Don
                  </Button>
                </Link>
              </div>

              {/* Back link */}
              <Link href="/actualites" className="inline-block">
                <Button
                  variant="ghost"
                  className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] gap-3 hover:text-apc-green"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour aux actualités
                </Button>
              </Link>
            </article>

            {/* ── Sidebar ── */}
            <aside className="space-y-8">
              {/* About APC block */}
              <div className="bg-[#1a472a] rounded-[2rem] p-8 text-white shadow-xl">
                <div className="w-14 h-14 bg-apc-greenLight/20 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="text-apc-greenLight w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-4">À propos d&apos;APC</h3>
                <p className="text-apc-bgLight/70 text-sm leading-relaxed mb-8">
                  ONG humanitaire fondée en 2017 à Goma, RDC. Nous agissons pour
                  la Protection, l&apos;Agriculture, la Dignité et la Paix.
                </p>
                <Link href="/a-propos">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-white/20 text-white hover:bg-white/10 font-bold text-xs uppercase tracking-widest"
                  >
                    Découvrir notre Vision
                  </Button>
                </Link>
              </div>

              {/* Related articles */}
              {others.length > 0 && (
                <div className="bg-white rounded-[2rem] p-8 border border-border/40 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-8 text-[10px] uppercase tracking-[0.2em] opacity-40">
                    Articles Récents
                  </h3>
                  <div className="space-y-6">
                    {others.map((a: any) => (
                      <Link
                        key={a.id}
                        href={`/actualites/${a.slug}`}
                        className="group flex gap-4"
                      >
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                          <Image
                            src={a.mainImage}
                            alt={a.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${categoryColors[a.category] || "bg-gray-100"}`}>
                            {a.category}
                          </span>
                          <p className="text-sm font-bold text-gray-900 mt-2 line-clamp-2 group-hover:text-apc-green transition-colors leading-snug">
                            {a.title}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-8 pt-8 border-t border-gray-50">
                    <Link
                      href="/actualites"
                      className="text-apc-green text-[10px] font-black uppercase tracking-widest flex items-center justify-between hover:translate-x-1 transition-transform"
                    >
                      Tout voir
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Newsletter mini block */}
              <div className="bg-white rounded-[2rem] p-8 border border-border/40 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">
                  📬 Restez informé
                </h3>
                <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                  Recevez nos rapports et actualités directement par email.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="w-full h-12 px-4 rounded-xl border border-gray-100 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-apc-green/20"
                    required
                  />
                  <Button className="w-full h-12 rounded-xl bg-apc-green hover:bg-apc-green/90 text-white font-bold text-xs uppercase tracking-widest">
                    S&apos;abonner
                  </Button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
