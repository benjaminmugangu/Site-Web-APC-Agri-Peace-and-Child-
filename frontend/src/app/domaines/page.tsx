"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import {
  Sprout,
  Handshake,
  Heart,
  Users,
  ShieldCheck,
  ChevronRight,
  Check,
  Loader2,
  Globe,
} from "lucide-react"
import { domainService } from "@/lib/api/services"
import { Service } from "@/types"

const iconMap: Record<string, any> = {
  Sprout,
  Handshake,
  Heart,
  Users,
  ShieldCheck,
}

export default function DomainesPage() {
  const [domaines, setDomaines] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await domainService.list()
        setDomaines(data)
      } catch (err) {
        console.error("Erreur domaines:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHero title="Nos Domaines d'Intervention" breadcrumbs={[{ label: "Domaines" }]} />
        <div className="flex-1 flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-12 h-12 text-apc-green animate-spin" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Chargement des axes d&apos;intervention...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <PageHero
        title="Nos Domaines d'Intervention"
        subtitle="Cinq axes d'action complémentaires, conçus pour répondre aux besoins les plus urgents des communautés vulnérables de l'Est de la RD Congo."
        breadcrumbs={[{ label: "Domaines d'Intervention" }]}
        tag="Nos Axes d'Action"
      />

      {domaines.length === 0 ? (
        <div className="py-32 text-center">
          <Globe className="w-12 h-12 text-gray-200 mx-auto mb-6" />
          <p className="text-gray-400 italic">Aucun domaine d&apos;intervention n&apos;est répertorié pour le moment.</p>
        </div>
      ) : (
        domaines.map((d, i) => {
          const isEven = i % 2 === 0
          const Icon = iconMap[d.iconName] || Globe
          const color = d.accentClass.includes('text-') ? (d.accentClass.split(' ')[0] === 'text-emerald-700' ? '#047857' : '#1a472a') : '#1a472a'
          
          return (
            <section
              key={d.id}
              id={d.slug}
              className={`py-20 ${isEven ? "bg-white" : "bg-apc-bgLight"}`}
            >
              <div className="container px-4">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                    !isEven ? "lg:grid-flow-dense" : ""
                  }`}
                >
                  {/* Image */}
                  <div className={`relative h-[420px] rounded-3xl overflow-hidden shadow-xl ${!isEven ? "lg:col-start-2" : ""}`}>
                    <Image
                      src={d.mainImage || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80"}
                      alt={d.name}
                      fill
                      className="object-cover"
                    />
                    {/* Color overlay */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: `linear-gradient(135deg, ${color}88 0%, transparent 60%)`,
                      }}
                    />
                    {/* Stats strip */}
                    {d.stats && d.stats.length > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <div className="flex justify-around text-white">
                          {d.stats.map((s, si) => (
                            <div key={si} className="text-center">
                              <div className="text-2xl font-bold">{s.value}</div>
                              <div className="text-xs text-white/70">{s.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={!isEven ? "lg:col-start-1 lg:row-start-1" : ""}>
                    {/* Icon + number */}
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${d.bgClass || 'bg-emerald-50'}`}
                      >
                        <Icon
                          className={`w-7 h-7 ${d.accentClass || 'text-emerald-700'}`}
                        />
                      </div>
                      <span
                        className={`text-5xl font-black opacity-10 ${d.accentClass || 'text-emerald-700'}`}
                      >
                        0{i + 1}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                      {d.name}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-7">
                      {d.description}
                    </p>

                    {/* Actions */}
                    {d.actions && d.actions.length > 0 && (
                      <ul className="space-y-3 mb-8">
                        {d.actions.map((action, ai) => (
                          <li key={ai} className="flex items-start gap-3">
                            <div
                              className={`w-5 h-5 rounded-full ${d.bgClass || 'bg-emerald-100'} flex items-center justify-center mt-0.5 shrink-0`}
                            >
                              <Check className={`w-3 h-3 ${d.accentClass || 'text-emerald-700'}`} />
                            </div>
                            <span className="text-foreground/80 text-sm leading-snug">
                              {action}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <Link href={`/projets?domaine=${d.slug}`}>
                      <Button
                        variant="outline"
                        className={`gap-2 border-2 hover:bg-opacity-10`}
                        style={{
                          borderColor: color,
                          color: color,
                        }}
                      >
                        Voir nos projets <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )
        })
      )}

      {/* ── CTA ── */}
      <section className="py-20 bg-[#1a472a] text-white">
        <div className="container px-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Soutenez Nos Actions sur le Terrain
          </h2>
          <p className="text-white/75 text-lg mb-8">
            Votre contribution, quelle que soit sa forme, nous permet d'étendre 
            notre impact et d'atteindre davantage de personnes dans le besoin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact?sujet=don">
              <Button
                size="lg"
                className="text-base px-8 w-full sm:w-auto bg-white text-emerald-900 hover:bg-gray-100"
              >
                Faire un Don
              </Button>
            </Link>
            <Link href="/nous-rejoindre">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 w-full sm:w-auto border-white/50 text-white hover:bg-white/10 hover:text-white"
              >
                Devenir Bénévole
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
