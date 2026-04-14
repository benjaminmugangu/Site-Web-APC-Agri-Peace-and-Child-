"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import {
  projects,
  statusLabels,
  statusColors,
  type ProjectStatus,
} from "@/lib/data"
import { MapPin, Users, ChevronRight, TrendingUp } from "lucide-react"

const tabs: { label: string; value: "all" | ProjectStatus }[] = [
  { label: "Tous les projets", value: "all" },
  { label: "En cours", value: "active" },
  { label: "Terminés", value: "completed" },
  { label: "À venir", value: "upcoming" },
]

const domainLabels: Record<string, string> = {
  agriculture: "Agriculture",
  paix: "Paix & Cohésion",
  enfance: "Protection Enfance",
  femmes: "Femmes & Jeunes",
  sante: "Santé & Nutrition",
}

const domainColors: Record<string, string> = {
  agriculture: "bg-apc-green/10 text-apc-green",
  paix: "bg-apc-blue/10 text-apc-blue",
  enfance: "bg-orange-100 text-orange-600",
  femmes: "bg-purple-100 text-purple-700",
  sante: "bg-teal-100 text-teal-700",
}

export default function ProjetsPage() {
  const [activeTab, setActiveTab] = useState<"all" | ProjectStatus>("all")

  const filtered =
    activeTab === "all"
      ? projects
      : projects.filter((p) => p.status === activeTab)

  return (
    <div className="flex flex-col">
      <PageHero
        title="Nos Projets"
        subtitle="Découvrez l'ensemble de nos initiatives sur le terrain — programmes en cours, projets accomplis et futures interventions planifiées."
        breadcrumbs={[{ label: "Projets" }]}
        tag="Sur le Terrain"
      />

      <section className="py-16 bg-apc-bgLight min-h-screen">
        <div className="container px-4">
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10 bg-white p-1.5 rounded-2xl shadow-sm border border-border/50 max-w-xl">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.value
                    ? "bg-apc-green text-white shadow-md"
                    : "text-muted-foreground hover:text-apc-green hover:bg-apc-green/5"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.value
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-muted-foreground"
                  }`}
                >
                  {tab.value === "all"
                    ? projects.length
                    : projects.filter((p) => p.status === tab.value).length}
                </span>
              </button>
            ))}
          </div>

          {/* Project grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              Aucun projet dans cette catégorie pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project) => (
                <article
                  key={project.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Status badge */}
                    <span
                      className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full border backdrop-blur-sm bg-white/80 ${statusColors[project.status]}`}
                    >
                      {statusLabels[project.status]}
                    </span>
                    {/* Domain badge */}
                    <span
                      className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm bg-white/80 ${domainColors[project.domain]}`}
                    >
                      {domainLabels[project.domain]}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="font-bold text-foreground text-lg leading-snug mb-2 group-hover:text-apc-green transition-colors">
                      {project.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                      {project.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-apc-alert" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-apc-blue" />
                        {project.beneficiaries.toLocaleString()} bénéficiaires
                      </span>
                    </div>

                    {/* Progress bar (only for active/completed) */}
                    {project.status !== "upcoming" && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Avancement
                          </span>
                          <span className="font-semibold text-apc-green">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-apc-green to-apc-greenLight rounded-full transition-all duration-700"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Budget */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">
                        Budget:{" "}
                        <strong className="text-foreground">
                          {project.budget.toLocaleString()} {project.currency}
                        </strong>
                      </span>
                      <Link href={`/projets/${project.slug}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-apc-green hover:bg-apc-green/10 gap-1 text-xs"
                        >
                          Détails <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 text-center py-12 bg-white rounded-3xl border border-border/50 shadow-sm">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Vous souhaitez soutenir un projet ?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Votre don, quel que soit son montant, contribue directement à 
              la réalisation de ces projets sur le terrain.
            </p>
            <Link href="/faire-un-don">
              <Button size="lg" className="px-8">
                Faire un Don
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
