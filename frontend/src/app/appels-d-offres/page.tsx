"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHero } from "@/components/ui/page-hero"
import { Button } from "@/components/ui/button"
import HTMLContent from "@/components/ui/html-content"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/fade-in"
import { listTenders } from "@/lib/api/tenders"
import { Tender } from "@/types"
import {
  FileText,
  Calendar,
  Download,
  Globe,
  Loader2,
  ArrowLeft,
} from "lucide-react"

export default function AppelsDOffresPage() {
  const router = useRouter()
  const [tenders, setTenders] = useState<Tender[]>([])
  const [loadingTenders, setLoadingTenders] = useState(true)

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const res = await listTenders();
        setTenders(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Failed to fetch tenders", err);
      } finally {
        setLoadingTenders(false);
      }
    };
    fetchTenders();
  }, []);

  const handleTenderClick = (tender: Tender) => {
    if (tender.slug) {
      router.push(`/appels-d-offres/${tender.slug}`)
    } else {
      // Fallback to ID-based approach if no slug
      console.warn("Tender has no slug, using ID-based navigation")
      router.push(`/appels-d-offres?id=${tender.id}`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        title="Appels d'Offres"
        subtitle="Agri-Peace and Child publie régulièrement des opportunités pour des fournitures et travaux dans le cadre de ses projets humanitaires."
        breadcrumbs={[{ label: "Appels d'Offres" }]}
        tag="Procurement"
      />

      <section className="py-24 bg-apc-bgLight">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <FadeIn className="mb-16 text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Marchés Publics APC</h2>
              <p className="text-gray-500 text-lg">Consultez nos appels d&apos;offres ouverts et soumettez votre proposition technique et financière directement en ligne.</p>
            </FadeIn>

            {loadingTenders ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-apc-green animate-spin" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Chargement des offres...</p>
              </div>
            ) : tenders.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
                <Globe className="w-12 h-12 text-gray-200 mx-auto mb-6" />
                <p className="text-gray-400 font-medium italic">Aucun appel d&apos;offres n&apos;est ouvert actuellement.</p>
              </div>
            ) : (
              <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {tenders.map((tender) => (
                  <StaggerItem key={tender.id}>
                    <div 
                      onClick={() => handleTenderClick(tender)}
                      className="bg-white rounded-[2.5rem] p-10 border border-border/40 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col h-full group relative overflow-hidden cursor-pointer"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-apc-green/5 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                      
                      {tender.imageUrl && (
                        <div className="relative h-48 -mx-10 -mt-10 mb-6 overflow-hidden rounded-t-[2.5rem]">
                          <img 
                            src={tender.imageUrl} 
                            alt={tender.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border border-gray-100">
                          Ref: {tender.reference}
                        </div>
                        <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${tender.status === 'open' ? 'text-apc-green' : 'text-gray-400'}`}>
                          <div className={`w-2 h-2 rounded-full ${tender.status === 'open' ? 'bg-apc-green animate-pulse' : 'bg-gray-400'}`} />
                          {tender.status === 'open' ? 'Ouvert' : 'Clôturé'}
                        </span>
                      </div>

                      <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-apc-green transition-colors uppercase tracking-tight leading-none">
                        {tender.title}
                      </h3>
                      <div className="text-gray-500 text-sm leading-relaxed mb-10 flex-1">
                        {tender.description && tender.description.includes('<') ? (
                          <HTMLContent content={tender.description} />
                        ) : (
                          <p className="line-clamp-3">{tender.description}</p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-8 mb-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-apc-green" />
                          Limite : {new Date(tender.deadline).toLocaleDateString('fr-FR')}
                        </div>
                      </div>

                      <Button 
                        className="w-full h-14 gap-3 rounded-2xl bg-apc-green hover:bg-apc-green/90 font-black uppercase tracking-widest text-[11px] shadow-xl shadow-apc-green/20 relative z-10"
                      >
                        Détails & Soumission <ArrowLeft className="w-4 h-4 rotate-180" />
                      </Button>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
