"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "À Propos", href: "/a-propos" },
  { label: "Domaines", href: "/domaines" },
  { label: "Projets", href: "/projets" },
  { label: "Actualités", href: "/actualites" },
  { label: "Contact", href: "/contact" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur shadow-md border-b border-border/40"
          : "bg-white/80 backdrop-blur border-b border-border/20"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-9 h-9 rounded-xl bg-apc-green flex items-center justify-center text-white font-extrabold text-base shadow-md group-hover:scale-105 transition-transform">
            A
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-lg text-apc-green tracking-tight">
              APC
            </span>
            <span className="hidden sm:block text-[10px] text-muted-foreground tracking-widest uppercase">
              Agri-Peace & Child
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-0.5 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-apc-green bg-apc-green/10 font-semibold"
                    : "text-foreground/65 hover:text-apc-green hover:bg-apc-green/5"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="block mx-auto mt-0.5 h-0.5 w-4 bg-apc-green rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* ── CTA + Hamburger ── */}
        <div className="flex items-center gap-3">
          <Link href="/faire-un-don" className="hidden sm:block">
            <Button variant="default" size="sm" className="shadow-md">
              Faire un don
            </Button>
          </Link>

          <button
            id="mobile-menu-toggle"
            className="md:hidden p-2 rounded-lg text-foreground/60 hover:text-apc-green hover:bg-apc-green/5 transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-border/30 bg-white/98">
          <nav className="container px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "text-apc-green bg-apc-green/10 font-semibold"
                      : "text-foreground/75 hover:text-apc-green hover:bg-apc-green/5"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="pt-3 pb-1 border-t border-border/30 mt-1">
              <Link href="/faire-un-don">
                <Button className="w-full" size="sm">
                  Faire un don
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
