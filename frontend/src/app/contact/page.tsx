import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Send } from "lucide-react"

export const metadata: Metadata = {
  title: "Contactez-nous — APC",
  description:
    "Prenez contact avec Agri-Peace and Child (APC) pour toute question, proposition de partenariat ou demande d'information.",
}

// Ensure the map component does not SSR
const MapDynamic = dynamic(() => import("@/components/ui/map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-gray-100 animate-pulse flex items-center justify-center rounded-2xl">
      <span className="text-muted-foreground font-medium">Chargement de la carte...</span>
    </div>
  ),
})

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        title="Contactez-nous"
        subtitle="Vous avez une question, une proposition de partenariat ou vous souhaitez en savoir plus sur nos actions ? N'hésitez pas à nous écrire."
        breadcrumbs={[{ label: "Contact" }]}
        tag="Prendre Contact"
      />

      <section className="py-20 bg-apc-bgLight">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* ── Formulaire ── */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-6">Envoyez-nous un message</h2>
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="Votre prénom"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Votre nom"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Adresse E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="exemple@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30 transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-sm font-medium text-foreground">
                    Sujet
                  </label>
                  <select
                    id="subject"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30 transition-all"
                  >
                    <option>Demande d'information générale</option>
                    <option>Proposition de partenariat</option>
                    <option>Presse & Médias</option>
                    <option>Problème technique (site web)</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Comment pouvons-nous vous aider ?"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30 transition-all resize-none"
                    required
                  ></textarea>
                </div>

                <Button type="button" size="lg" className="w-full gap-2 mt-4">
                  Envoyer le message <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* ── Coordonnées & Carte ── */}
            <div className="space-y-8 flex flex-col">
              {/* Infos Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-apc-green rounded-3xl p-8 text-white relative overflow-hidden h-full">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <MapPin className="w-8 h-8 text-white/80 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Notre Bureau (Siège)</h3>
                  <p className="text-white/80 leading-relaxed text-sm">
                    Quartier Le Volcan<br />
                    Commune de Goma<br />
                    Ville de Goma, Nord-Kivu<br />
                    République Démocratique du Congo
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 border border-border/50 shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-apc-blue/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-apc-blue" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-1">E-mail</h4>
                      <a href="mailto:agripeaceandchild@gmail.com" className="text-sm text-muted-foreground hover:text-apc-blue transition-colors break-all">
                        agripeaceandchild<br />@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-border/50 shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-apc-alert/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-apc-alert" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-1">Téléphone</h4>
                      <a href="tel:+243975418316" className="text-sm text-muted-foreground hover:text-apc-alert transition-colors">
                        +243 975 418 316
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte Leaflet */}
              <div className="relative rounded-3xl overflow-hidden shadow-md border border-border/50 flex-1 min-h-[400px]">
                <MapDynamic position={[-1.6858, 29.2312]} zoom={14} />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
