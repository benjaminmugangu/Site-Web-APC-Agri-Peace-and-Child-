import type { Metadata } from "next"
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
} from "lucide-react"

import { mockDomaines } from "@/lib/data/mock-domaines"

export const metadata: Metadata = {
  title: "Domaines d'Intervention — Agri-Peace and Child",
  description:
    "Cinq axes d'action : Agriculture, Paix & Cohésion, Protection de l'Enfance, Autonomisation des Femmes, et Santé & Nutrition.",
}

export default function DomainesPage() {
  const domaines = mockDomaines
  return (
    <div className="flex flex-col">
      <PageHero
        title="Nos Domaines d'Intervention"
        subtitle="Cinq axes d'action complémentaires, conçus pour répondre aux besoins les plus urgents des communautés vulnérables de l'Est de la RD Congo."
        breadcrumbs={[{ label: "Domaines d'Intervention" }]}
        tag="Nos Axes d'Action"
      />

      {/* ── Domain sections ── */}
      {domaines.map((d, i) => {
        const isEven = i % 2 === 0
        const Icon = d.icon
        return (
          <section
            key={d.id}
            id={d.id}
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
                    src={d.image}
                    alt={d.title}
                    fill
                    className="object-cover"
                  />
                  {/* Color overlay */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `linear-gradient(135deg, ${d.color}88 0%, transparent 60%)`,
                    }}
                  />
                  {/* Stats strip */}
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
                </div>

                {/* Content */}
                <div className={!isEven ? "lg:col-start-1 lg:row-start-1" : ""}>
                  {/* Icon + number */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
                      style={{ backgroundColor: d.lightColor }}
                    >
                      <Icon
                        className="w-7 h-7"
                        style={{ color: d.color }}
                      />
                    </div>
                    <span
                      className="text-5xl font-black opacity-10"
                      style={{ color: d.color }}
                    >
                      0{i + 1}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                    {d.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-7">
                    {d.description}
                  </p>

                  {/* Actions */}
                  <ul className="space-y-3 mb-8">
                    {d.actions.map((action, ai) => (
                      <li key={ai} className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full ${d.bgClass} flex items-center justify-center mt-0.5 shrink-0`}
                        >
                          <Check className={`w-3 h-3 ${d.accentClass}`} />
                        </div>
                        <span className="text-foreground/80 text-sm leading-snug">
                          {action}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/projets">
                    <Button
                      variant="outline"
                      className={`gap-2 border-2 hover:text-white`}
                      style={{
                        borderColor: d.color,
                        color: d.color,
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
      })}

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
            <Link href="/faire-un-don">
              <Button
                size="lg"
                variant="white"
                className="text-base px-8 w-full sm:w-auto"
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
