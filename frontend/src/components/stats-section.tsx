"use client"

import { StaggerContainer, StaggerItem } from "@/components/ui/fade-in"
import { CountUp } from "@/components/ui/count-up"

interface StatsSectionProps {
  stats: {
    beneficiaries: string
    projects: string
    provinces: string
  }
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section id="impact" className="py-20 relative overflow-hidden bg-apc-green">
      <div className="absolute inset-0 bg-black/20 opacity-30 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="container relative z-10 px-4">
        <StaggerContainer className="flex flex-wrap items-center justify-center gap-12 sm:gap-24 text-white">
          <StaggerItem className="text-center">
            <CountUp value={stats.beneficiaries} className="text-5xl md:text-7xl font-bold text-white mb-2" />
            <div className="text-sm font-medium uppercase tracking-wider text-white/80">Bénéficiaires</div>
          </StaggerItem>
          <StaggerItem className="hidden sm:block w-px h-24 bg-white/20" />
          <StaggerItem className="text-center">
            <div className="text-5xl md:text-7xl font-bold text-white mb-2">{stats.projects}</div>
            <div className="text-sm font-medium uppercase tracking-wider text-white/80">Projets Réalisés</div>
          </StaggerItem>
          <StaggerItem className="hidden sm:block w-px h-24 bg-white/20" />
          <StaggerItem className="text-center">
            <div className="text-5xl md:text-7xl font-bold text-white mb-2">{stats.provinces}</div>
            <div className="text-sm font-medium uppercase tracking-wider text-white/80">Provinces RDC</div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  )
}
