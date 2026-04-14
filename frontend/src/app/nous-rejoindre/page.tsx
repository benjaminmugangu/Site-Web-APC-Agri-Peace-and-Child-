import type { Metadata } from "next"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { Users, Briefcase, GraduationCap, Send, HeartHandshake } from "lucide-react"

export const metadata: Metadata = {
  title: "Nous Rejoindre (Bénévolat & Carrières) — APC",
  description:
    "Engagez-vous à nos côtés ou postulez pour rejoindre l'équipe d'Agri-Peace and Child (APC) en RD Congo.",
}

const engagementTypes = [
  {
    title: "Bénévolat sur le terrain",
    icon: HeartHandshake,
    color: "text-apc-green",
    bg: "bg-apc-green/10",
    description: "Appuyez nos équipes dans les distributions, les formations agricoles ou l'animation psychosociale des enfants."
  },
  {
    title: "Bénévolat de compétences (À distance)",
    icon: GraduationCap,
    color: "text-apc-blue",
    bg: "bg-apc-blue/10",
    description: "Offrez votre expertise technique : communication, plaidoyer, rédaction de projets subventionnés, etc."
  },
  {
    title: "Stage Professionnel",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-100",
    description: "Intégrez APC dans le cadre de vos études supérieures pour une expérience pratique en action humanitaire."
  },
  {
    title: "Carrières & Offres d'emploi",
    icon: Briefcase,
    color: "text-apc-alert",
    bg: "bg-apc-alert/10",
    description: "Rejoignez notre équipe salariée. Les postes disponibles sont régulièrement mis à jour sur cette page."
  }
]

export default function NousRejoindrePage() {
  return (
    <div className="flex flex-col">
      <PageHero
        title="Nous Rejoindre"
        subtitle="Qu'il s'agisse de donner de votre temps, de partager vos compétences ou de poursuivre votre carrière, votre talent peut faire la différence."
        breadcrumbs={[{ label: "Nous Rejoindre" }]}
        tag="Engagement & Carrières"
      />

      <section className="py-24 bg-apc-bgLight">
        <div className="container px-4">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">Comment souhaitez-vous vous engager ?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nous croyons fermement que c'est l'addition des volontés locales et internationales 
              qui permet la pérennité de l'action humanitaire. Explorez les différentes manières 
              de collaborer avec nous :
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-20">
            {engagementTypes.map((type, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-border/50 shadow-sm flex items-start gap-6 hover:shadow-md hover:-translate-y-1 transition-all">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${type.bg}`}>
                  <type.icon className={`w-7 h-7 ${type.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{type.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{type.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-border/50">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              
              {/* Formulaire */}
              <div className="lg:col-span-3 p-8 md:p-12">
                <h3 className="text-2xl font-bold text-foreground mb-2">Formulaire de candidature</h3>
                <p className="text-muted-foreground mb-8 text-sm">
                  Remplissez ce formulaire pour postuler de façon spontanée à une mission de bénévolat, de stage, ou un emploi.
                </p>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-foreground">Prénom</label>
                      <input type="text" id="firstName" className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30 transition-all text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-foreground">Nom</label>
                      <input type="text" id="lastName" className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30 transition-all text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">E-mail</label>
                      <input type="email" id="email" className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30 transition-all text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-foreground">Téléphone (avec indicatif)</label>
                      <input type="tel" id="phone" className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30 transition-all text-sm" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="type" className="text-sm font-medium text-foreground">Type d'engagement souhaité</label>
                    <select id="type" className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30 transition-all text-sm">
                      <option>Bénévolat terrain</option>
                      <option>Bénévolat à distance</option>
                      <option>Stage</option>
                      <option>Emploi / Contrat</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">Lettre de motivation & Compétences clés</label>
                    <textarea id="message" rows={5} placeholder="Présentez brièvement vos motivations et vos domaines d'expertise..." className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-apc-green/30 transition-all resize-none text-sm"></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground block">Curriculum Vitae (CV)</label>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="cv" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <p className="text-sm text-gray-500 font-medium">Cliquez pour téléverser votre CV</p>
                          <p className="text-xs text-gray-400 mt-1">PDF, DOC, ou DOCX (Max: 5MB)</p>
                        </div>
                        <input id="cv" type="file" className="hidden" accept=".pdf,.doc,.docx" />
                      </label>
                    </div>
                  </div>

                  <Button type="button" size="lg" className="w-full gap-2 mt-4 text-base py-6">
                    Envoyer ma candidature <Send className="w-5 h-5" />
                  </Button>
                </form>
              </div>

              {/* Panneau latéral Info */}
              <div className="lg:col-span-2 bg-apc-green p-8 md:p-12 text-white flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-6">Pourquoi s'engager avec nous ?</h3>
                <ul className="space-y-6">
                  <li>
                    <h4 className="font-bold text-lg mb-2 text-apc-greenLight">1. Impact direct</h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Nos équipes sont aux premières lignes au Nord-Kivu, Ituri et Tanganyika. 
                      Votre aide parvient directement aux bénéficiaires sans intermédiaires.
                    </p>
                  </li>
                  <li>
                    <h4 className="font-bold text-lg mb-2 text-apc-greenLight">2. Une équipe plurisdisciplinaire</h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Vous évoluerez au sein d'une organisation ayant des experts en agronomie, 
                      psychosocial, consolidation de la paix, et protection des droits humains.
                    </p>
                  </li>
                  <li>
                    <h4 className="font-bold text-lg mb-2 text-apc-greenLight">3. Transparence et Professionnalisme</h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      L'intégrité, la gestion orientée résultats et l'amélioration continue
                      forment l'ossature comportementale de chacun de nos membres.
                    </p>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
