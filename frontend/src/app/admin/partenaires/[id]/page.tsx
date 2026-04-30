"use client"

import React from "react"
import { 
  ArrowLeft, 
  ExternalLink, 
  Mail, 
  Phone, 
  Globe, 
  FileText, 
  Calendar,
  Building2,
  ShieldCheck,
  Briefcase,
  History,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

// Simulation de données (à remplacer par API)
const partnersData: Record<string, any> = {
  "1": {
    id: 1,
    nom: "PAM (Programme Alimentaire Mondial)",
    identite: "Partenaire de Financement",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/World_Food_Programme_Logo.svg/1200px-World_Food_Programme_Logo.svg.png",
    description: "Le Programme alimentaire mondial est l'organisme d'aide alimentaire de l'Organisation des Nations unies. C'est la plus grande organisation humanitaire au monde luttant contre la faim.",
    website: "https://www.wfp.org",
    contactName: "Jean Dupont",
    contactEmail: "j.dupont@wfp.org",
    contactPhone: "+33 1 23 45 67 89",
    startDate: "2018-05-12",
    status: "Actif",
    totalFunding: "450,000 USD",
    projectsInvolved: [
      { id: "p1", title: "Sécurité Alimentaire Masisi", role: "Bailleur principal" },
      { id: "p2", title: "Urgence Nyiragongo", role: "Appui logistique" }
    ],
    history: [
      { date: "2024-03-15", event: "Renouvellement du protocole d'accord" },
      { date: "2023-12-01", event: "Versement de la tranche Q4" }
    ]
  },
  "2": {
    id: 2,
    nom: "UNICEF",
    identite: "Partenaire Technique",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/UNICEF_Logo.svg/1200px-UNICEF_Logo.svg.png",
    description: "Le Fonds des Nations unies pour l'enfance est une agence de l'Organisation des Nations unies consacrée à l'amélioration et à la promotion de la condition des enfants.",
    website: "https://www.unicef.org",
    contactName: "Sarah Kabila",
    contactEmail: "s.kabila@unicef.org",
    contactPhone: "+243 812 345 678",
    startDate: "2020-02-20",
    status: "Actif",
    totalFunding: "120,000 USD",
    projectsInvolved: [
      { id: "p3", title: "Protection Enfance Goma", role: "Partenaire technique" }
    ],
    history: [
      { date: "2024-02-10", event: "Audit technique validé" }
    ]
  }
}

export default function AdminPartnerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const partner = partnersData[id]

  if (!partner) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold mb-4">Partenaire introuvable</h2>
        <Button onClick={() => router.push('/admin/partenaires')}>Retour à la liste</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/partenaires">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{partner.nom}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full border border-green-200">
                {partner.status}
              </span>
              <span className="text-xs text-gray-500">Depuis le {new Date(partner.startDate).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileText size={18} /> Exporter Fiche
          </Button>
          <Button className="bg-apc-green hover:bg-green-700 gap-2">
            Modifier les infos
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Gauche - Infos & Contact */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div className="w-32 h-20 bg-gray-50 rounded-xl border border-gray-100 p-3 mb-6 mx-auto flex items-center justify-center">
              <img src={partner.logo} alt={partner.nom} className="max-w-full max-h-full object-contain" />
            </div>
            
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2 flex items-center gap-2">
              <Building2 size={18} className="text-apc-green" />
              Profil Institutionnel
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6 italic">
              "{partner.description}"
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                  <Globe size={16} />
                </div>
                <a href={partner.website} target="_blank" className="text-apc-blue hover:underline flex items-center gap-1">
                  Site Officiel <ExternalLink size={12} />
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                  <ShieldCheck size={16} />
                </div>
                <span className="text-gray-700 font-medium">{partner.identite}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2 flex items-center gap-2">
              <Mail size={18} className="text-apc-blue" />
              Point Focal
            </h3>
            <div className="space-y-4">
              <div className="font-bold text-gray-900">{partner.contactName}</div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail size={14} className="text-gray-400" /> {partner.contactEmail}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone size={14} className="text-gray-400" /> {partner.contactPhone}
              </div>
              <Button variant="ghost" className="w-full text-apc-blue bg-blue-50/50 hover:bg-blue-50 mt-2 text-xs font-bold uppercase tracking-wider">
                Contacter via CRM
              </Button>
            </div>
          </div>
        </div>

        {/* Colonne Droite - Projets & Historique */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-apc-green text-white rounded-3xl p-6 shadow-lg shadow-apc-green/20">
              <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Volume de financement</div>
              <div className="text-3xl font-bold">{partner.totalFunding}</div>
              <div className="mt-4 flex items-center gap-2 text-xs bg-white/20 w-fit px-2 py-1 rounded-full">
                <TrendingUp size={12} /> +12% par rapport à 2023
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Projets actifs</div>
              <div className="text-3xl font-bold text-gray-900">{partner.projectsInvolved.length}</div>
              <div className="mt-4 flex items-center gap-2 text-xs text-apc-blue font-semibold">
                Voir les rapports d'impact
              </div>
            </div>
          </div>

          {/* Projets impliqués */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Briefcase size={20} className="text-apc-green" />
              Projets en Collaboration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partner.projectsInvolved.map((p: any) => (
                <div key={p.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/30 hover:border-apc-green/30 transition-colors group">
                  <div className="font-bold text-gray-900 group-hover:text-apc-green transition-colors">{p.title}</div>
                  <div className="text-xs text-gray-500 mt-1 uppercase font-semibold tracking-tighter">Rôle : {p.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Historique */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <History size={20} className="text-gray-400" />
              Journal des Événements
            </h3>
            <div className="space-y-4 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              {partner.history.map((h: any, idx: number) => (
                <div key={idx} className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-white border-4 border-gray-200" />
                  <div className="text-xs font-bold text-gray-400 mb-0.5">{new Date(h.date).toLocaleDateString('fr-FR')}</div>
                  <div className="text-sm font-medium text-gray-700">{h.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
