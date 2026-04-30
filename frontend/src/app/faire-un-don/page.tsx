import type { Metadata } from "next"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Phone, Mail, MessageSquare } from "lucide-react"
import Link from "next/link"
import { apc } from "@/lib/data"

export const metadata: Metadata = {
  title: "Faire un Don",
  description:
    "Soutenez les actions d'Agri-Peace and Child en RD Congo. Découvrez comment contribuer directement à nos projets.",
}

export default function FaireUnDonPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        title="Faire un Don"
        subtitle="Votre générosité est le moteur de notre action. Chaque contribution nous permet d'apporter un changement réel dans la vie des plus vulnérables."
        breadcrumbs={[{ label: "Faire un Don" }]}
        tag="Soutenir notre Mission"
      />

      <section className="py-20 bg-apc-bgLight min-h-[60vh] flex items-center">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-xl shadow-apc-green/5 border border-apc-green/10 text-center relative overflow-hidden">
              {/* Éléments décoratifs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-apc-green/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-apc-blue/5 rounded-full -ml-32 -mb-32 blur-3xl" />

              <div className="relative z-10">
                <div className="w-20 h-20 bg-apc-green/10 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                  <Heart className="w-10 h-10 text-apc-green" fill="currentColor" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Merci pour votre générosité !
                </h2>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
                  Pour garantir la sécurité et la traçabilité de votre contribution, nous privilégions 
                  actuellement les dons par contact direct. Notre équipe est à votre disposition pour 
                  vous orienter selon votre mode de paiement préféré.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <a 
                    href={`tel:${apc.phone.replace(/\s/g, '')}`}
                    className="flex flex-col items-center p-6 bg-apc-bgLight rounded-2xl border border-border/50 hover:border-apc-green/30 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5 text-apc-green" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Par Téléphone</span>
                    <span className="font-bold text-foreground">{apc.phone}</span>
                  </a>

                  <a 
                    href={`mailto:${apc.email}`}
                    className="flex flex-col items-center p-6 bg-apc-bgLight rounded-2xl border border-border/50 hover:border-apc-blue/30 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5 text-apc-blue" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Par Email</span>
                    <span className="font-bold text-foreground break-all text-sm">{apc.email}</span>
                  </a>

                  <div className="flex flex-col items-center p-6 bg-apc-bgLight rounded-2xl border border-border/50 transition-all">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
                      <MapPin className="w-5 h-5 text-apc-alert" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">En Personne</span>
                    <span className="font-bold text-foreground">Bureaux à Goma</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-border/50">
                  <p className="text-sm text-muted-foreground italic">
                    Vous souhaitez nous laisser un message spécifique ?
                  </p>
                  <Link href="/contact?sujet=don">
                    <Button variant="outline" className="gap-2 rounded-xl border-apc-green text-apc-green hover:bg-apc-green/5">
                      <MessageSquare className="w-4 h-4" /> Formulaire de Contact
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Note sur la transparence */}
            <div className="mt-12 flex items-start gap-4 p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-apc-blue" />
              </div>
              <div>
                <h4 className="font-bold text-apc-blue text-sm mb-1">Engagement Transparence</h4>
                <p className="text-xs text-blue-800/70 leading-relaxed">
                  Agri-Peace and Child s'engage à fournir un reçu officiel pour chaque don reçu. 
                  Vos fonds sont directement alloués aux projets terrain de votre choix ou à nos 
                  programmes prioritaires en cours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
