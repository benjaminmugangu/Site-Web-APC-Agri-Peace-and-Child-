import type { Metadata } from "next"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, CheckCircle2, DollarSign } from "lucide-react"

export const metadata: Metadata = {
  title: "Faire un Don — APC",
  description:
    "Soutenez les actions d'Agri-Peace and Child (APC) en RD Congo en faisant un don.",
}

const impactTiers = [
  { amount: 50, impact: "Fournit un kit de semences et d'outils pour une famille agricole." },
  { amount: 100, impact: "Finance la scolarité et les fournitures scolaires d'un enfant vulnérable pendant un an." },
  { amount: 250, impact: "Soutient la création d'une activité génératrice de revenus pour une femme." },
  { amount: 500, impact: "Permet d'organiser un atelier de cohésion sociale ou une clinique mobile." },
]

export default function FaireUnDonPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        title="Faire un Don"
        subtitle="Votre soutien financier direct permet de transformer la vie de milliers de personnes vulnérables dans l'Est de la RDC. Ensemble, nous avons le pouvoir de changer les choses."
        breadcrumbs={[{ label: "Faire un Don" }]}
        tag="Soutenir APC"
      />

      <section className="py-20 bg-apc-bgLight">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* ── Formulaire de don (UI purement illustrative) ── */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-md border border-border/50">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-apc-green/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-apc-green flex-shrink-0" fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Soutien Ponctuel ou Mensuel</h2>
                  <p className="text-muted-foreground text-sm">Chaque don compte et est sécurisé.</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Type de don */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-foreground">Type de don</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 px-4 border-2 border-apc-green bg-apc-green/5 text-apc-green font-bold rounded-xl transition-all">
                      Ponctuel
                    </button>
                    <button className="py-3 px-4 border-2 border-border text-muted-foreground hover:border-gray-300 font-medium rounded-xl transition-all">
                      Mensuel
                    </button>
                  </div>
                </div>

                {/* Montant */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-foreground">Sélectionnez un montant (USD)</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {impactTiers.map((tier) => (
                      <button key={tier.amount} className="py-3 px-4 border border-border bg-gray-50 hover:bg-gray-100 hover:border-gray-300 font-semibold text-foreground rounded-xl transition-all">
                        ${tier.amount}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      placeholder="Autre montant"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30 transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Infos personnelles */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-foreground">Vos informations</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <input type="text" placeholder="Prénom" className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30" />
                    <input type="text" placeholder="Nom" className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30" />
                  </div>
                  <input type="email" placeholder="Adresse E-mail" className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30" />
                </div>

                <Button className="w-full text-base py-6" size="lg">
                  Continuer vers le paiement
                </Button>
                
                <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-apc-green" />
                  Paiement 100% sécurisé via nos partenaires financiers.
                </p>
              </div>
            </div>

            {/* ── Impact & Informations Complémentaires ── */}
            <div className="space-y-8 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Votre Impact Concret</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Chez APC, nous mettons un point d'honneur à ce que chaque dollar donné soit 
                  utilisé avec la plus grande transparence et efficacité pour maximiser
                  l'impact sur le terrain. 
                </p>

                <div className="space-y-4">
                  {impactTiers.map((tier) => (
                    <div key={tier.amount} className="flex gap-4 p-4 rounded-2xl bg-white border border-border/50 shadow-sm">
                      <div className="w-16 h-16 rounded-xl bg-apc-green/10 flex items-center justify-center text-apc-green font-bold shrink-0 text-xl">
                        ${tier.amount}
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-foreground">{tier.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1a472a] rounded-3xl p-8 text-white">
                <h3 className="font-bold text-xl mb-4">Autres moyens de contribuer</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  Si vous préférez faire un don par virement bancaire ou legs, ou si votre 
                  organisation souhaite établir un partenariat de financement corporatif, 
                  rejoignez-nous directement à notre siège.
                </p>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-apc-greenLight shrink-0" />
                  <span className="text-sm font-medium">Bureaux à Goma, Nord-Kivu, RDC<br />Quartier Le Volcan</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
