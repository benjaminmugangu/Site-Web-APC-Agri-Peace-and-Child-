import React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeroProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  tag?: string // small tag above title
}

export function PageHero({ title, subtitle, breadcrumbs, tag }: PageHeroProps) {
  return (
    <section className="relative bg-[#1a472a] py-20 md:py-28 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-apc-green/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-apc-greenLight/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-white/3 blur-3xl rounded-full" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container relative z-10 px-4">
        {/* Breadcrumb */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Fil d'Ariane"
            className="flex items-center flex-wrap gap-1 text-sm text-white/55 mb-6"
          >
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Accueil</span>
            </Link>
            {breadcrumbs.map((item, i) => (
              <React.Fragment key={i}>
                <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-white/90">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Tag */}
        {tag && (
          <span className="inline-block py-1 px-3 rounded-full bg-apc-greenLight/20 border border-apc-greenLight/30 text-apc-greenLight text-sm font-medium mb-5">
            {tag}
          </span>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight max-w-3xl">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Decorative accent bar */}
        <div className="mt-8 flex items-center gap-2">
          <div className="h-1 w-16 bg-apc-greenLight rounded-full" />
          <div className="h-1 w-8 bg-apc-greenLight/50 rounded-full" />
          <div className="h-1 w-4 bg-apc-greenLight/25 rounded-full" />
        </div>
      </div>
    </section>
  )
}
