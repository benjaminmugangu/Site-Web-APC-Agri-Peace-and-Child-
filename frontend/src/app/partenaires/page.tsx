"use client"

import React, { useState, useEffect, useCallback, useTransition } from "react"
import { PageHero } from "@/components/ui/page-hero"
import { listPartners } from "@/lib/api/partners"
import { type Partner } from "@/types"
import { ExternalLink, Globe, Users, Search, X, SlidersHorizontal, Building2 } from "lucide-react"
import Link from "next/link"

const TYPE_CONFIG: Record<string, { label: string; dotColor: string; bg: string; text: string; border: string }> = {
  DONOR:     { label: "Bailleur de fonds",      dotColor: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  TECHNICAL: { label: "Partenaire Technique",   dotColor: "bg-blue-500",    bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200" },
  LOCAL:     { label: "Partenaire Local",        dotColor: "bg-amber-500",   bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
  STRATEGIC: { label: "Partenaire Stratégique", dotColor: "bg-purple-500",  bg: "bg-purple-50",  text: "text-purple-700",  border: "border-purple-200" },
}

// ── Skeleton Card ────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-[2rem] border border-border/30 overflow-hidden animate-pulse">
      <div className="h-36 bg-gray-100" />
      <div className="p-6 space-y-3">
        <div className="h-3 w-20 bg-gray-100 rounded-full" />
        <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
        <div className="h-3 w-full bg-gray-100 rounded-full" />
        <div className="h-3 w-2/3 bg-gray-100 rounded-full" />
      </div>
    </div>
  )
}

// ── Partner Card ─────────────────────────────────────────────
function PartnerCard({ partner }: { partner: Partner }) {
  const typeConf = TYPE_CONFIG[partner.type] || { label: partner.type, dotColor: "bg-gray-400", bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" }

  return (
    <div className="group bg-white rounded-[2rem] border border-border/40 shadow-sm hover:shadow-xl hover:border-border/60 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col">
      {/* Logo Area */}
      <div className="h-36 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {partner.logoUrl ? (
          <img
            src={partner.logoUrl}
            alt={partner.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 relative z-10"
          />
        ) : (
          <Globe size={44} className="text-gray-200 group-hover:text-apc-green transition-colors duration-300 relative z-10" />
        )}
      </div>

      {/* Info Area */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        {/* Type Badge */}
        <div className={`self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.12em] ${typeConf.bg} ${typeConf.text} ${typeConf.border}`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${typeConf.dotColor}`} />
          {typeConf.label}
        </div>

        {/* Name */}
        <h3 className="font-bold text-gray-900 leading-snug group-hover:text-apc-green transition-colors text-sm">
          {partner.name}
        </h3>

        {/* Description */}
        {partner.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
            {partner.description}
          </p>
        )}

        {/* Website Link */}
        {partner.websiteUrl && (
          <a
            href={partner.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-apc-blue hover:text-apc-green transition-colors group/link"
          >
            <ExternalLink size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
            Visiter le site
          </a>
        )}
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────
export default function PartenairesPage() {
  const [allPartners, setAllPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("ALL")
  const [isPending, startTransition] = useTransition()

  // Load all partners once on mount
  useEffect(() => {
    setLoading(true)
    listPartners()
      .then(data => setAllPartners(data.filter(p => p.isActive)))
      .catch(() => setAllPartners([]))
      .finally(() => setLoading(false))
  }, [])

  // Client-side filtering
  const filtered = allPartners.filter(p => {
    const matchType = activeFilter === "ALL" || p.type === activeFilter
    const query = searchQuery.trim().toLowerCase()
    const matchSearch = !query ||
      p.name.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.contactName && p.contactName.toLowerCase().includes(query))
    return matchType && matchSearch
  })

  // Stats by type
  const byType = allPartners.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const handleFilter = (type: string) => {
    startTransition(() => setActiveFilter(type))
  }

  const clearSearch = () => setSearchQuery("")

  return (
    <div className="flex flex-col">
      <PageHero
        title="Nos Partenaires"
        subtitle="L'APC œuvre aux côtés d'organisations internationales, de bailleurs de fonds et de partenaires locaux pour maximiser l'impact de ses programmes au Nord-Kivu."
        breadcrumbs={[{ label: "Partenaires" }]}
        tag="Réseau & Alliances"
      />

      <section className="py-12 sm:py-16 bg-apc-bgLight min-h-screen">
        <div className="container px-4">

          {/* ── Stats Summary ───────────────────────────────── */}
          {!loading && allPartners.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
              {Object.entries(TYPE_CONFIG).map(([type, conf]) => (
                <button
                  key={type}
                  onClick={() => handleFilter(activeFilter === type ? "ALL" : type)}
                  className={`rounded-2xl p-4 sm:p-5 border text-center transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-apc-green ${
                    activeFilter === type
                      ? `${conf.bg} ${conf.border} shadow-md scale-[1.02]`
                      : "bg-white border-border/40 shadow-sm hover:shadow-md hover:scale-[1.01]"
                  }`}
                  aria-pressed={activeFilter === type}
                  aria-label={`Filtrer par ${conf.label}`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${conf.dotColor} mx-auto mb-2`} />
                  <div className={`text-2xl font-black ${activeFilter === type ? conf.text : "text-gray-900"}`}>
                    {byType[type] || 0}
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${activeFilter === type ? conf.text : "text-gray-400"}`}>
                    {conf.label}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ── Search & Filters Bar ─────────────────────────── */}
          {!loading && (
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  id="partners-search"
                  type="text"
                  placeholder="Rechercher un partenaire par nom ou description..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 text-sm rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    aria-label="Effacer la recherche"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Filter selector (mobile) */}
              <div className="sm:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <SlidersHorizontal size={15} className="text-gray-400 shrink-0" />
                <select
                  value={activeFilter}
                  onChange={e => handleFilter(e.target.value)}
                  className="flex-1 text-sm bg-transparent focus:outline-none text-gray-700"
                >
                  <option value="ALL">Tous les types</option>
                  {Object.entries(TYPE_CONFIG).map(([type, conf]) => (
                    <option key={type} value={type}>{conf.label}</option>
                  ))}
                </select>
              </div>

              {/* Filter pills (desktop) */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => handleFilter("ALL")}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    activeFilter === "ALL"
                      ? "bg-apc-green text-white border-apc-green shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-apc-green/40 hover:text-apc-green"
                  }`}
                >
                  Tous
                </button>
                {Object.entries(TYPE_CONFIG).map(([type, conf]) => (
                  <button
                    key={type}
                    onClick={() => handleFilter(type)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      activeFilter === type
                        ? `${conf.bg} ${conf.text} ${conf.border} shadow-md`
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-800"
                    }`}
                  >
                    {conf.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Loading Skeletons ────────────────────────────── */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* ── Empty State ──────────────────────────────────── */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              {allPartners.length === 0 ? (
                <>
                  <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mb-6">
                    <Users size={40} className="text-gray-300" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-600 mb-2">Partenaires à venir</h2>
                  <p className="text-sm text-gray-400 max-w-sm">
                    Notre réseau de partenaires est en cours de mise à jour. Revenez bientôt pour découvrir nos collaborations.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mb-6">
                    <Search size={40} className="text-gray-300" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-600 mb-2">Aucun résultat</h2>
                  <p className="text-sm text-gray-400 max-w-sm mb-4">
                    Aucun partenaire ne correspond à votre recherche « <strong>{searchQuery}</strong> ».
                  </p>
                  <button
                    onClick={() => { clearSearch(); handleFilter("ALL") }}
                    className="text-sm font-bold text-apc-green hover:underline"
                  >
                    Réinitialiser les filtres
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── Results Count ─────────────────────────────────── */}
          {!loading && allPartners.length > 0 && filtered.length > 0 && (
            <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
              <Building2 size={15} className="text-gray-400" />
              <span>
                <strong className="text-gray-800 font-bold">{filtered.length}</strong> partenaire{filtered.length > 1 ? "s" : ""}
                {activeFilter !== "ALL" && (
                  <> · <span className={`font-semibold ${TYPE_CONFIG[activeFilter]?.text}`}>{TYPE_CONFIG[activeFilter]?.label}</span></>
                )}
                {searchQuery && <> correspondant à « <em>{searchQuery}</em> »</>}
              </span>
              {(activeFilter !== "ALL" || searchQuery) && (
                <button
                  onClick={() => { clearSearch(); handleFilter("ALL") }}
                  className="ml-auto text-xs font-bold text-apc-green hover:underline flex items-center gap-1"
                >
                  <X size={12} /> Réinitialiser
                </button>
              )}
            </div>
          )}

          {/* ── Partners Grid ────────────────────────────────── */}
          {!loading && filtered.length > 0 && (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 transition-opacity duration-200 ${isPending ? "opacity-60" : "opacity-100"}`}
            >
              {filtered.map(p => (
                <PartnerCard key={p.id} partner={p} />
              ))}
            </div>
          )}

          {/* ── CTA Section ─────────────────────────────────── */}
          {!loading && (
            <div className="mt-16 bg-gradient-to-r from-apc-green to-emerald-600 rounded-[2.5rem] p-8 sm:p-10 text-center text-white shadow-xl shadow-apc-green/20">
              <h3 className="text-xl sm:text-2xl font-black mb-3">Devenir Partenaire de l&apos;APC ?</h3>
              <p className="text-white/80 max-w-xl mx-auto mb-6 text-sm leading-relaxed">
                Rejoignez notre réseau d&apos;organisations engagées pour la paix, l&apos;agriculture durable et la protection de l&apos;enfant au Nord-Kivu. Ensemble, nous multiplions l&apos;impact.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-apc-green font-black px-8 py-3 rounded-full hover:bg-green-50 transition-colors shadow-lg text-sm"
              >
                Nous contacter
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
