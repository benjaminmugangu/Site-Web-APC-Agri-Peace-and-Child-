"use client"

import React from "react"
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  History,
  FileText,
  UserCheck,
  MapPin,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

// Simulation de données (à remplacer par API)
const teamData: Record<string, any> = {
  "1": {
    id: 1,
    name: "Benjamin Mugangu",
    role: "Directeur Exécutif",
    email: "benjamin@apc.org",
    phone: "+243 975 418 316",
    location: "Goma, RD Congo",
    joinDate: "2017-02-18",
    status: "Actif",
    bio: "Fondateur d'APC avec plus de 10 ans d'expérience dans l'humanitaire. Expert en gestion de projets et développement communautaire.",
    experience: [
      { period: "2017 - Présent", company: "APC", role: "Directeur Exécutif" },
      { period: "2014 - 2016", company: "NGO International", role: "Chef de Projet Agriculture" }
    ],
    education: [
      { year: "2013", degree: "Master en Développement Rural", school: "Université de Goma" }
    ],
    skills: ["Gestion de Projet", "Plaidoyer", "Agriculture Durable", "Leadership"],
    internalNotes: "Profil très engagé, leadership naturel. Point focal pour les relations bailleurs.",
    tasks: [
      { id: 1, task: "Validation rapport annuel 2023", status: "En cours" },
      { id: 2, task: "Meeting OCHA Coordination", status: "Terminé" }
    ]
  },
  "2": {
    id: 2,
    name: "Marie Louise",
    role: "Coordination Projets",
    email: "marie@apc.org",
    phone: "+243 888 000 111",
    location: "Goma, RD Congo",
    joinDate: "2019-05-10",
    status: "Actif",
    bio: "Spécialiste en protection de l'enfance. Gère le cycle de projet de la planification à l'évaluation.",
    experience: [
      { period: "2019 - Présent", company: "APC", role: "Coordinatrice Programmes" }
    ],
    education: [
      { year: "2015", degree: "Licence en Sciences Sociales", school: "ULPGL" }
    ],
    skills: ["Protection", "MEAL", "Coordination"],
    internalNotes: "Excellente rigueur dans le suivi des indicateurs (MEAL).",
    tasks: []
  }
}

export default function AdminMemberDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const member = teamData[id]

  if (!member) {
    return (
      <div className="p-12 text-center text-black">
        <h2 className="text-xl font-bold mb-4">Collaborateur introuvable</h2>
        <Button onClick={() => router.push('/admin/equipe')}>Retour à la liste</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-black">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/equipe">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{member.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-full border border-blue-200">
                {member.role}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} /> Membre depuis {new Date(member.joinDate).getFullYear()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileText size={18} /> Dossier RH
          </Button>
          <Button className="bg-apc-green hover:bg-green-700 gap-2">
            Modifier le profil
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Gauche - Profil & Contact */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center">
            <div className="w-24 h-24 rounded-full bg-apc-green/10 border-4 border-white shadow-md mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-apc-green">
              {member.name.charAt(0)}
            </div>
            <h3 className="font-bold text-lg mb-1">{member.name}</h3>
            <p className="text-gray-500 text-sm mb-6">{member.role}</p>
            
            <div className="space-y-3 text-left border-t border-gray-50 pt-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail size={14} className="text-apc-blue" /> {member.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone size={14} className="text-apc-green" /> {member.phone}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin size={14} className="text-red-400" /> {member.location}
              </div>
            </div>
          </div>

          <div className="bg-amber-50/50 rounded-3xl border border-amber-100 p-6 shadow-sm">
            <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
              <UserCheck size={16} /> Notes Internes
            </h3>
            <p className="text-sm text-amber-800 leading-relaxed italic">
              "{member.internalNotes}"
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-2">
              <Award size={16} className="text-apc-green" /> Compétences
            </h3>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((s: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne Droite - Parcours & Tâches */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText size={20} className="text-apc-blue" /> Biographie Professionnelle
            </h3>
            <p className="text-gray-600 leading-relaxed">{member.bio}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expérience */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Briefcase size={18} className="text-apc-green" /> Expérience
              </h3>
              <div className="space-y-4">
                {member.experience.map((ex: any, idx: number) => (
                  <div key={idx} className="border-l-2 border-gray-100 pl-4 py-1">
                    <div className="text-xs font-bold text-apc-green">{ex.period}</div>
                    <div className="text-sm font-bold text-gray-900">{ex.role}</div>
                    <div className="text-xs text-gray-500">{ex.company}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formation */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <GraduationCap size={18} className="text-apc-blue" /> Formation
              </h3>
              <div className="space-y-4">
                {member.education.map((ed: any, idx: number) => (
                  <div key={idx} className="border-l-2 border-gray-100 pl-4 py-1">
                    <div className="text-xs font-bold text-apc-blue">{ed.year}</div>
                    <div className="text-sm font-bold text-gray-900">{ed.degree}</div>
                    <div className="text-xs text-gray-500">{ed.school}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tâches / Suivi */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History size={20} className="text-gray-400" /> Tâches en cours
              </div>
              <Button size="sm" variant="outline" className="text-xs h-8">Attribuer une tâche</Button>
            </h3>
            {member.tasks.length > 0 ? (
              <div className="space-y-3">
                {member.tasks.map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 bg-gray-50/30">
                    <div className="text-sm font-medium">{t.task}</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.status === 'Terminé' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400 text-sm italic">
                Aucune tâche assignée pour le moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
