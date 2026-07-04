import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/fade-in";
import { Heart, Sprout, ShieldCheck, Handshake, ChevronRight, CheckCircle2 } from "lucide-react";
import { settingsService } from "@/lib/api/settings";
import { listProjects } from "@/lib/api/projects";
import { listPartners } from "@/lib/api/partners";

export const dynamic = 'force-dynamic';

const pilierLinks: Record<string, string> = {
  Protection: "/domaines#protection",
  Agriculture: "/domaines#agriculture",
  Dignité: "/domaines#dignite",
  Paix: "/domaines#paix",
};

const piliers = [
  {
    title: "Protection",
    desc: "Assurer un environnement sûr et protecteur pour les enfants et les personnes vulnérables.",
    icon: ShieldCheck,
    color: "#ef4444",
    lightColor: "#fee2e2"
  },
  {
    title: "Agriculture",
    desc: "Promouvoir des techniques durables pour garantir la sécurité alimentaire des ménages.",
    icon: Sprout,
    color: "#22c55e",
    lightColor: "#dcfce7"
  },
  {
    title: "Dignité",
    desc: "Restaurer l'espoir et le respect de soi à travers l'autonomisation et l'accès aux soins.",
    icon: Heart,
    color: "#3b82f6",
    lightColor: "#dbeafe"
  },
  {
    title: "Paix",
    desc: "Bâtir des ponts entre les communautés pour une coexistence pacifique et durable.",
    icon: Handshake,
    color: "#8b5cf6",
    lightColor: "#ede9fe"
  }
];

export default async function Home() {
  const settings = await settingsService.get();
  let recentProjects: any[] = [];
  try {
    const projectsRes = await listProjects({ limit: 6, status: 'published' });
    recentProjects = projectsRes.data || [];
  } catch (err) {
    console.error('Failed to fetch recent projects:', err);
  }
  const partners = await listPartners().catch(() => []);

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-apc-bgLight">
        <p className="text-gray-500 font-medium italic">Configuration du site en cours de chargement...</p>
      </div>
    );
  }

  const hero = settings?.hero || { title: "Agri-Peace and Child", subtitle: "Soutenir la RDC et l'Afrique", imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" };
  const stats = settings?.stats || { beneficiaries: "15 000+", projects: "32", provinces: "4" };


  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={hero.imageUrl}
            alt="Hero background"
            fill
            className="object-cover scale-105 animate-[kenburns_15s_ease-in-out_infinite_alternate]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/60" />
        </div>

        <div className="container relative z-10 text-center text-white px-4">
          <FadeIn>
            <span className="inline-block py-1 px-3 rounded-full bg-apc-green/80 text-sm font-medium mb-6 border border-apc-greenLight/50 shadow-lg">
              Soutenir la RDC et l&apos;Afrique
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              {hero.title.split(' et ').map((part, i) => (
                <span key={i}>
                  {i > 0 && " et "}
                  <span className={i % 2 === 0 ? "" : "text-apc-greenLight"}>{part}</span>
                </span>
              ))}
            </h1>
            <p className="text-lg md:text-xl md:max-w-2xl mx-auto mb-10 text-gray-200">
              {hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/faire-un-don">
                <Button size="lg" className="text-lg px-8 w-full sm:w-auto">
                  Faire un don maintenant
                </Button>
              </Link>
              <Link href="/projets">
                <Button size="lg" variant="white" className="text-lg px-8 gap-2 w-full sm:w-auto">
                  Découvrir nos projets <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Nos Domaines d'Action */}
      <section id="piliers" className="py-24 bg-white">
        <div className="container px-4">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Nos Domaines d&apos;Action</h2>
            <p className="text-muted-foreground text-lg">
              Nos actions sont structurées autour de quatre axes fondamentaux pour garantir un développement durable et équitable.
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {piliers.map((pilier) => (
              <StaggerItem key={pilier.title}>
                <div className="group rounded-3xl p-8 bg-apc-bgLight border border-border/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm" style={{ backgroundColor: pilier.lightColor }}>
                    <pilier.icon className="h-7 w-7" style={{ color: pilier.color }} strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">{pilier.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">{pilier.desc}</p>
                  <Link href={pilierLinks[pilier.title] ?? "/domaines"} className="font-medium flex items-center gap-1 hover:gap-2 transition-all" style={{ color: pilier.color }}>
                    En savoir plus <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 relative overflow-hidden bg-[#1a472a]">
        <div className="absolute inset-0 bg-[#0d2616] opacity-30 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="container relative z-10 px-4">
          <StaggerContainer className="flex flex-wrap items-center justify-center gap-12 sm:gap-24 text-white">
            <StaggerItem className="text-center">
              <div className="text-5xl md:text-7xl font-bold text-apc-greenLight mb-2">{stats.beneficiaries}</div>
              <div className="text-sm font-medium uppercase tracking-wider text-apc-bgLight/80">Bénéficiaires</div>
            </StaggerItem>
            <StaggerItem className="hidden sm:block w-px h-24 bg-white/20" />
            <StaggerItem className="text-center">
              <div className="text-5xl md:text-7xl font-bold text-apc-greenLight mb-2">{stats.projects}</div>
              <div className="text-sm font-medium uppercase tracking-wider text-apc-bgLight/80">Projets Réalisés</div>
            </StaggerItem>
            <StaggerItem className="hidden sm:block w-px h-24 bg-white/20" />
            <StaggerItem className="text-center">
              <div className="text-5xl md:text-7xl font-bold text-apc-greenLight mb-2">{stats.provinces}</div>
              <div className="text-sm font-medium uppercase tracking-wider text-apc-bgLight/80">Provinces RDC</div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Projects Section */}
      {recentProjects.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="container px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Nos Projets Récents</h2>
                <p className="text-gray-500 mt-2">Découvrez nos dernières actions sur le terrain.</p>
              </div>
              <Link href="/projets" className="text-apc-green font-semibold hover:underline flex items-center gap-1">
                Tous les projets <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentProjects.map((project) => (
                <Link key={project.id} href={`/projets/${project.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {project.mainImage ? (
                      <Image src={project.mainImage} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="text-4xl opacity-20">🌿</span>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-apc-green text-xs font-bold px-3 py-1 rounded-full uppercase">
                        {project.category?.name || ''}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-apc-green transition-colors line-clamp-1">{project.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{project.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{project.location}</span>
                      <span>{project.beneficiaries} bénéficiaires</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partenaires Section */}
      {partners && partners.length > 0 && (
        <section className="py-20 bg-apc-bgLight border-t border-gray-100">
          <div className="container px-4">
            <FadeIn className="text-center mb-12">
              <span className="inline-block text-apc-green font-semibold text-sm tracking-widest uppercase mb-3">Ils nous font confiance</span>
              <h2 className="text-3xl font-bold text-foreground">Nos Partenaires</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Découvrez les organisations et institutions qui accompagnent nos actions sur le terrain.</p>
            </FadeIn>
            
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-80">
              {partners.map(partner => (
                <Link key={partner.id} href={`/partenaires`} title={partner.name} className="grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105">
                  {partner.logoUrl ? (
                    <div className="relative w-32 h-16 flex items-center justify-center">
                      <Image src={partner.logoUrl} alt={partner.name} fill className="object-contain" />
                    </div>
                  ) : (
                    <div className="text-xl font-extrabold text-gray-400 tracking-tight">{partner.name}</div>
                  )}
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/partenaires" className="inline-flex items-center gap-1 text-sm font-semibold text-apc-green hover:underline">
                Voir tous nos partenaires <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
                alt="Enfants souriants RDC"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-apc-blue/20 mix-blend-multiply" />
            </div>

            <FadeIn direction="left">
              <span className="inline-block px-4 py-1.5 rounded-full bg-apc-blue/10 text-apc-blue font-semibold text-sm mb-6">
                Pourquoi nous soutenir ?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                Chaque action compte dans la <span className="text-apc-green">reconstruction</span> de notre communauté.
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Depuis notre création, nous avons constaté que l&apos;engagement local couplé au soutien
                international crée une force imparable. En nous soutenant, vous ne donnez pas seulement,
                vous investissez dans l&apos;autonomie et la dignité de milliers de familles.
              </p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-apc-green/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-apc-green" />
                  </div>
                  <span className="text-foreground font-medium">Transparence totale des fonds</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-apc-blue/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-apc-blue" />
                  </div>
                  <span className="text-foreground font-medium">Impact direct sur le terrain (sans intermédiaire)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-apc-blue/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-apc-blue" />
                  </div>
                  <span className="text-foreground font-medium">Projets ancrés dans les réalités locales</span>
                </li>
              </ul>

              <div className="flex items-center gap-4">
                <Link href="/faire-un-don">
                  <Button size="lg" className="shadow-lg text-base px-8 h-14">
                    Soutenir le projet
                  </Button>
                </Link>
                <Link href="/nous-rejoindre">
                  <Button variant="outline" size="lg" className="text-base h-14 px-8 border-apc-blue text-apc-blue hover:bg-apc-blue/5">
                    Nous Rejoindre
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}

