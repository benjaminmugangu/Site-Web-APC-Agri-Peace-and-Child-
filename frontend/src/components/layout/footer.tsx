import Link from "next/link"
import { Globe, X, Camera, Mail, Phone, MapPin } from "lucide-react"
import { mockSettings } from "@/lib/data/mock-settings"

export function Footer() {
  const { contact } = mockSettings

  return (
    <footer className="bg-[#1a472a] text-white pt-16 pb-8">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <h3 className="text-xl font-bold mb-4">Agri-Peace and Child</h3>
          <p className="text-apc-bgLight/80 text-sm mb-4">
            Organisation Non Gouvernementale humanitaire agissant pour la Protection, l&apos;Agriculture, la Dignité humaine et la Paix en République Démocratique du Congo.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-white hover:text-apc-greenLight transition-colors" aria-label="Website">
              <Globe className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-white hover:text-apc-greenLight transition-colors" aria-label="Twitter">
              <X className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-white hover:text-apc-greenLight transition-colors" aria-label="Instagram">
              <Camera className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-apc-greenLight">Liens Rapides</h4>
          <ul className="space-y-2 text-sm text-apc-bgLight/80">
            <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
            <li><Link href="/a-propos" className="hover:text-white transition-colors">À Propos</Link></li>
            <li><Link href="/domaines" className="hover:text-white transition-colors">Nos Domaines</Link></li>
            <li><Link href="/projets" className="hover:text-white transition-colors">Nos Projets</Link></li>
            <li><Link href="/appels-d-offres" className="hover:text-white transition-colors">Appels d&apos;Offres</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-apc-greenLight">S&apos;impliquer</h4>
          <ul className="space-y-2 text-sm text-apc-bgLight/80">
            <li><Link href="/faire-un-don" className="hover:text-white transition-colors">Faire un don</Link></li>
            <li><Link href="/nous-rejoindre" className="hover:text-white transition-colors">Devenir Bénévole</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Partenariats</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-apc-greenLight">Contact</h4>
          <ul className="space-y-4 text-sm text-apc-bgLight/80">
            <li className="flex gap-3">
              <MapPin className="h-5 w-5 text-apc-alert shrink-0" />
              <span>{contact.address}</span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone className="h-5 w-5 text-apc-alert shrink-0" />
              <span>{contact.phone}</span>
            </li>
            <li className="flex gap-3 items-center">
              <Mail className="h-5 w-5 text-apc-alert shrink-0" />
              <span>{contact.email}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mt-12 pt-8 border-t border-white/10 text-center text-sm text-apc-bgLight/60">
        <p>&copy; {new Date().getFullYear()} Agri-Peace and Child. Tous droits réservés.</p>
      </div>
    </footer>
  )
}
