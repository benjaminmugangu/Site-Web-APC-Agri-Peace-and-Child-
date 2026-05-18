import { Metadata } from "next"
import { PageHero } from "@/components/ui/page-hero"
import { listPartners } from "@/lib/api/partners"
import { type Partner } from "@/types"
import { ExternalLink, Globe, Users } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Nos Partenaires — APC Agri, Peace & Child",
  description:
    "Découvrez les organisations partenaires et bailleurs de fonds qui soutiennent les actions humanitaires et de développement de l'APC au Nord-Kivu.",
}

const TYPE_CONFIG: Record<string, { label: string; dotColor: string }> = {
  DONOR:     { label: "Bailleur de fonds",       dotColor: "bg-emerald-500" },
  TECHNICAL: { label: "Partenaire Technique",    dotColor: "bg-blue-500" },
  LOCAL:     { label: "Partenaire Local",         dotColor: "bg-amber-500" },
  STRATEGIC: { label: "Partenaire Stratégique",  dotColor: "bg-purple-500" },
}

function PartnerCard({ partner }: { partner: Partner }) {
  const typeConf = TYPE_CONFIG[partner.type] || { label: partner.type, dotColor: "bg-gray-400" }

  return (
    <div className="group bg-white rounded-[2rem] border border-border/40 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
      {/* Logo Area */}
      <div className="h-36 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8 border-b border-gray-100">
        {partner.logoUrl ? (
          <img
            src={partner.logoUrl}
            alt={partner.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Globe size={48} className="text-gray-300 group-hover:text-apc-green transition-colors" />
        )}
      </div>

      {/* Info Area */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        {/* Type Badge */}
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${typeConf.dotColor}`} />
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
            {typeConf.label}
          </span>
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

export default async function PartenairesPage() {
  const partners = await listPartners().catch(() => [] as Partner[])
  const activePartners = partners.filter(p => p.isActive)

  // Group by type for stats
  const byType = activePartners.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="flex flex-col">
      <PageHero
        title="Nos Partenaires"
        subtitle="L'APC œuvre aux côtés d'organisations internationales, de bailleurs de fonds et de partenaires locaux pour maximiser l'impact de ses programmes au Nord-Kivu."
        breadcrumbs={[{ label: "Partenaires" }]}
        tag="Réseau & Alliances"
      />

      <section className="py-16 bg-apc-bgLight min-h-screen">
        <div className="container px-4">

          {/* Stats Summary */}
          {activePartners.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {Object.entries(TYPE_CONFIG).map(([type, conf]) => (
                <div key={type} className="bg-white rounded-2xl p-5 border border-border/40 shadow-sm text-center">
                  <div className={`w-2.5 h-2.5 rounded-full ${conf.dotColor} mx-auto mb-2`} />
                  <div className="text-2xl font-black text-gray-900">{byType[type] || 0}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">{conf.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {activePartners.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400">
              <Users size={64} className="mb-4 opacity-20" />
              <h2 className="text-xl font-bold text-gray-600 mb-2">Partenaires à venir</h2>
              <p className="text-sm max-w-sm">
                Notre réseau de partenaires est en cours de mise à jour. Revenez bientôt pour découvrir nos collaborations.
              </p>
            </div>
          ) : (
            <>
              {/* Section par type */}
              {Object.entries(TYPE_CONFIG).map(([type, conf]) => {
                const group = activePartners.filter(p => p.type === type)
                if (group.length === 0) return null
                return (
                  <div key={type} className="mb-14">
                    <div className="flex items-center gap-3 mb-6">
                      <span className={`w-3 h-3 rounded-full ${conf.dotColor}`} />
                      <h2 className="text-lg font-black text-gray-800 uppercase tracking-wider">
                        {conf.label}s
                      </h2>
                      <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {group.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {group.map(p => (
                        <PartnerCard key={p.id} partner={p} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </>
          )}

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-r from-apc-green to-emerald-600 rounded-[2.5rem] p-10 text-center text-white shadow-xl shadow-apc-green/20">
            <h3 className="text-2xl font-black mb-3">Devenir Partenaire de l&apos;APC ?</h3>
            <p className="text-white/80 max-w-xl mx-auto mb-6 text-sm leading-relaxed">
              Rejoignez notre réseau d&apos;organisations engagées pour la paix, l&apos;agriculture durable et la protection de l&apos;enfant au Nord-Kivu. Ensemble, nous multiplions l&apos;impact.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-apc-green font-black px-8 py-3 rounded-full hover:bg-green-50 transition-colors shadow-lg"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
