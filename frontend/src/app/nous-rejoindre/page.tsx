import type { Metadata } from "next"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import { listCareers } from "@/lib/api/careers"
import { Users, Briefcase, GraduationCap, Send, HeartHandshake, MapPin, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { CareerApplicationForm } from "@/components/forms/career-application-form"


export const metadata: Metadata = {
  title: "Nous Rejoindre (Bénévolat & Carrières) — APC",
  description: "Engagez-vous à nos côtés ou postulez pour rejoindre l'équipe d'Agri-Peace and Child (APC) en RD Congo.",
}

export const dynamic = 'force-dynamic';

const engagementTypes = [
  {
    title: "Bénévolat sur le terrain",
    icon: HeartHandshake,
    color: "text-apc-green",
    bg: "bg-apc-green/10",
    description: "Appuyez nos équipes dans les distributions, les formations agricoles ou l'animation psychosociale des enfants."
  },
  {
    title: "Bénévolat de compétences",
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
    title: "Expertise Conseil",
    icon: Briefcase,
    color: "text-apc-alert",
    bg: "bg-apc-alert/10",
    description: "Apportez votre regard d'expert sur des missions ponctuelles de monitoring ou d'évaluation d'impact."
  }
]

export default async function NousRejoindrePage() {
  const careersRes = await listCareers({ status: 'open' }).catch(() => []);
  const careers = Array.isArray(careersRes) ? careersRes : [];

  return (
    <div className="flex flex-col">
      <PageHero
        title="Nous Rejoindre"
        subtitle="Qu'il s'agisse de donner de votre temps, de partager vos compétences ou de poursuivre votre carrière, votre talent peut faire la différence."
        breadcrumbs={[{ label: "Nous Rejoindre" }]}
        tag="Engagement & Carrières"
      />

      <section className="py-24 bg-apc-bgLight min-h-screen">
        <div className="container px-4">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Comment vous engager ?</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Nous croyons fermement que c'est l'addition des volontés locales et internationales 
              qui permet la pérennité de l'action humanitaire. Explorez les opportunités ci-dessous.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {engagementTypes.map((type, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-8 border border-border/40 shadow-sm hover:shadow-xl transition-all group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${type.bg}`}>
                  <type.icon className={`w-8 h-8 ${type.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{type.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{type.description}</p>
              </div>
            ))}
          </div>

          {/* ── Offres d'emploi Actives ── */}
          <div className="mb-24">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-2 h-8 bg-apc-alert rounded-full" />
                Opportunités de Carrière
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {careers.length} Poste(s) ouvert(s)
              </span>
            </div>

            {careers.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-border/60">
                <p className="text-gray-400 italic">Aucune offre d'emploi n'est publiée actuellement. N'hésitez pas à envoyer une candidature spontanée.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {careers.map((job) => (
                  <div key={job.id} className="bg-white rounded-2xl p-6 md:p-8 border border-border/40 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-apc-alert/10 text-apc-alert rounded-full border border-apc-alert/20">
                          {job.type}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-apc-green transition-colors">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-apc-alert" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-apc-green" />
                          Date limite : {new Date(job.deadline).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <Link href={`/contact?sujet=carrieres&poste=${encodeURIComponent(job.title)}`}>
                      <Button className="rounded-xl h-12 px-8 font-bold bg-apc-green hover:bg-apc-green/90 shadow-lg shadow-apc-green/20 group-hover:scale-105 transition-transform">
                        Postuler <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-border/40">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              
              <div className="lg:col-span-3 p-10 md:p-16">
                <h3 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Candidature Spontanée</h3>
                <p className="text-gray-500 mb-10 text-base leading-relaxed">
                  Vous partagez nos valeurs et souhaitez contribuer à notre mission ? Envoyez-nous votre profil et précisez votre domaine d'expertise.
                </p>

                <CareerApplicationForm />
              </div>


              <div className="lg:col-span-2 bg-[#1a472a] p-10 md:p-16 text-white flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-black mb-8 uppercase tracking-tighter">Pourquoi APC ?</h3>
                  <div className="space-y-10">
                    <div>
                      <h4 className="font-bold text-apc-greenLight text-xs uppercase tracking-widest mb-3">01. Impact Terrain</h4>
                      <p className="text-apc-bgLight/70 text-sm leading-relaxed">
                        Nos équipes sont aux premières lignes au Nord-Kivu, Ituri et Tanganyika. 
                        Votre expertise sauve des vies.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-apc-greenLight text-xs uppercase tracking-widest mb-3">02. Expertise Intégrée</h4>
                      <p className="text-apc-bgLight/70 text-sm leading-relaxed">
                        Collaborez avec des experts en agronomie, psychosocial et consolidation de la paix.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-apc-greenLight text-xs uppercase tracking-widest mb-3">03. Culture d&apos;Intégrité</h4>
                      <p className="text-apc-bgLight/70 text-sm leading-relaxed">
                        La transparence et le professionnalisme sont les piliers de notre organisation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

