"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react"
import { apc } from "@/lib/data"
import { settingsService } from "@/lib/api/settings"
import { type SiteSettings } from "@/types"

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const pathname = usePathname()

  if (pathname?.startsWith("/admin")) return null;

  useEffect(() => {
    settingsService.get()
      .then(data => {
        if (data) setSettings(data)
      })
      .catch(err => console.error("Failed to load footer settings", err))
  }, [])

  const name = settings?.institution?.name || apc.name
  const acronym = settings?.institution?.acronym || apc.sigle
  const slogan = settings?.hero?.subtitle || apc.slogan
  const address = settings?.contact?.address || apc.address
  const phone = settings?.contact?.phone1 || apc.phone
  const email = settings?.contact?.email || apc.email
  const facebook = settings?.contact?.socials?.facebook || apc.socials.facebook
  const twitter = settings?.contact?.socials?.twitter || apc.socials.twitter
  const instagram = settings?.contact?.socials?.instagram || apc.socials.instagram
  const linkedin = settings?.contact?.socials?.linkedin || apc.socials.linkedin
  const youtube = settings?.contact?.socials?.youtube
  const footerLogo = settings?.logo?.logoFooter

  return (
    <footer className="bg-[#1a472a] text-white pt-16 pb-8">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1 space-y-4">
          {footerLogo ? (
            <div className="flex items-center gap-3 mb-4">
              <img src={footerLogo} alt={name} className="h-14 w-auto object-contain filter drop-shadow-md" />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-lg text-white tracking-tight">
                  {name}
                </span>
                <span className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">
                  ONG Humanitaire
                </span>
              </div>
            </div>
          ) : (
            <h3 className="text-xl font-bold mb-4">{name}</h3>
          )}
          <p className="text-apc-bgLight/80 text-sm mb-6 leading-relaxed">
            {slogan}. Organisation humanitaire de référence en RD Congo.
          </p>
          <div className="flex flex-wrap gap-3">
            {facebook && (
              <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:-translate-y-1" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {twitter && (
              <a href={twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:-translate-y-1" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:-translate-y-1" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:-translate-y-1" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {youtube && (
              <a href={youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:-translate-y-1" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-white text-lg">Liens Rapides</h4>
          <ul className="space-y-3 text-sm text-apc-bgLight/80">
            <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
            <li><Link href="/a-propos" className="hover:text-white transition-colors">À Propos</Link></li>
            <li><Link href="/domaines" className="hover:text-white transition-colors">Domaines d&apos;Action</Link></li>
            <li><Link href="/projets" className="hover:text-white transition-colors">Nos Projets</Link></li>
            <li><Link href="/actualites" className="hover:text-white transition-colors">Actualités</Link></li>
            <li><Link href="/appels-d-offres" className="hover:text-white transition-colors">Appels d&apos;Offres</Link></li>
            <li><Link href="/nous-rejoindre" className="hover:text-white transition-colors">Nous Rejoindre</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-white text-lg">Impact & Engagement</h4>
          <ul className="space-y-3 text-sm text-apc-bgLight/80">
            <li>
              <Link href="/faire-un-don" className="flex items-center gap-2 text-white font-semibold hover:text-apc-greenLight transition-colors">
                <Heart className="w-4 h-4 text-apc-greenLight" fill="currentColor" /> Faire un don
              </Link>
            </li>
            <li><Link href="/nous-rejoindre" className="hover:text-white transition-colors">Devenir Bénévole</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Partenariats</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contactez-nous</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-white text-lg">Contact Direct</h4>
          <ul className="space-y-4 text-sm text-apc-bgLight/80">
            <li className="flex gap-3">
              <MapPin className="h-5 w-5 text-apc-greenLight shrink-0" />
              <span className="leading-relaxed">{address}</span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone className="h-5 w-5 text-apc-greenLight shrink-0" />
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{phone}</a>
            </li>
            <li className="flex gap-3 items-center">
              <Mail className="h-5 w-5 text-apc-greenLight shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-white transition-colors break-all">{email}</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-apc-bgLight/60">
        <p>&copy; 2026 {name} ({acronym}). Tous droits réservés.</p>
        <div className="flex gap-6">
          <Link href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
          <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link>
        </div>
      </div>
    </footer>
  )
}
