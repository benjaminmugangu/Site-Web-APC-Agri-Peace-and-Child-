"use client"

import React, { useState, useEffect } from "react"
import {
  ArrowLeft,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  Building2,
  ShieldCheck,
  TrendingUp,
  Edit,
  Loader2,
  AlertCircle,
  DollarSign,
  Users,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { getPartner } from "@/lib/api/partners"
import { toast } from "sonner"
import { type Partner } from "@/types"

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  DONOR:     { label: "Bailleur de fonds",       color: "bg-emerald-100 text-emerald-700" },
  TECHNICAL: { label: "Partenaire Technique",    color: "bg-blue-100 text-blue-700" },
  LOCAL:     { label: "Partenaire Local",         color: "bg-amber-100 text-amber-700" },
  STRATEGIC: { label: "Partenaire Stratégique",  color: "bg-purple-100 text-purple-700" },
}

export default function AdminPartnerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [partner, setPartner] = useState<Partner | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPartner() {
      setLoading(true)
      try {
        const data = await getPartner(id)
        if (!data) throw new Error("Partenaire introuvable")
        setPartner(data)
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement")
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchPartner()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-gray-400">
        <Loader2 className="animate-spin mb-4 text-apc-green" size={40} />
        <p className="font-medium">Chargement des données du partenaire...</p>
      </div>
    )
  }

  if (error || !partner) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 text-gray-400">
        <AlertCircle size={40} className="text-red-400" />
        <p className="font-medium text-red-600">{error || "Partenaire introuvable"}</p>
        <Button onClick={() => router.push("/admin/partenaires")} variant="outline">
          Retour à la liste
        </Button>
      </div>
    )
  }

  const partnerType = (partner as any).type || partner.category?.name || "";
  const typeInfo = TYPE_LABELS[partnerType] || { label: partnerType || "Partenaire", color: "bg-gray-100 text-gray-600" }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-black">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/partenaires">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{partner.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border ${typeInfo.color}`}>
                {typeInfo.label}
              </span>
              {partner.isActive ? (
                <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                  <CheckCircle2 size={12} /> Actif
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-gray-400 font-semibold">
                  <XCircle size={12} /> Inactif
                </span>
              )}
            </div>
          </div>
        </div>
        <Link href={`/admin/partenaires?edit=${partner.id}`}>
          <Button className="bg-apc-green hover:bg-emerald-700 text-white gap-2 font-bold">
            <Edit size={18} /> Modifier les infos
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Gauche — Logo, Profil & Contact */}
        <div className="space-y-6">

          {/* Logo + Identité */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            {partner.logoUrl ? (
              <div className="w-32 h-20 bg-gray-50 rounded-xl border border-gray-100 p-3 mb-6 mx-auto flex items-center justify-center">
                <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <div className="w-32 h-20 bg-gray-100 rounded-xl border border-gray-200 mb-6 mx-auto flex items-center justify-center">
                <Globe size={32} className="text-gray-300" />
              </div>
            )}

            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2 flex items-center gap-2">
              <Building2 size={18} className="text-apc-green" />
              Profil Institutionnel
            </h3>

            {partner.description ? (
              <p className="text-sm text-gray-600 leading-relaxed mb-5 italic">
                &ldquo;{partner.description}&rdquo;
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic mb-5">Aucune description renseignée.</p>
            )}

            <div className="space-y-3">
              {partner.websiteUrl && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                    <Globe size={16} />
                  </div>
                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-apc-blue hover:underline flex items-center gap-1"
                  >
                    Site Officiel <ExternalLink size={12} />
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                  <ShieldCheck size={16} />
                </div>
                <span className="text-gray-700 font-medium">{typeInfo.label}</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          {(partner.contactName || partner.contactEmail || partner.contactPhone) && (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2 flex items-center gap-2">
                <Mail size={18} className="text-apc-blue" />
                Point Focal
              </h3>
              <div className="space-y-3">
                {partner.contactName && (
                  <div className="font-bold text-gray-900">{partner.contactName}</div>
                )}
                {partner.contactEmail && (
                  <a
                    href={`mailto:${partner.contactEmail}`}
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-apc-blue transition-colors"
                  >
                    <Mail size={14} className="text-gray-400" />
                    {partner.contactEmail}
                  </a>
                )}
                {partner.contactPhone && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone size={14} className="text-gray-400" />
                    {partner.contactPhone}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Colonne Droite — Statistiques */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-apc-green text-white rounded-3xl p-6 shadow-lg shadow-apc-green/20">
              <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                <DollarSign size={14} /> Volume de Financement
              </div>
              <div className="text-3xl font-bold mt-1">
                {partner.totalFunding && Number(partner.totalFunding) > 0
                  ? `$${Number(partner.totalFunding).toLocaleString('fr-FR')}`
                  : "Non renseigné"
                }
              </div>
              {partner.totalFunding && Number(partner.totalFunding) > 0 && (
                <div className="mt-4 flex items-center gap-2 text-xs bg-white/20 w-fit px-2 py-1 rounded-full">
                  <TrendingUp size={12} /> Volume total alloué (USD)
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                <Users size={14} /> Partenariat
              </div>
              <div className={`text-2xl font-bold mt-1 ${partner.isActive ? "text-green-600" : "text-gray-400"}`}>
                {partner.isActive ? "Actif" : "Inactif"}
              </div>
              <div className="mt-4 text-xs text-gray-400">
                Enregistré le {new Date(partner.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </div>
            </div>
          </div>

          {/* Informations de la Fiche */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 size={20} className="text-apc-green" />
              Informations Complètes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Identifiant (ID)</div>
                <div className="font-mono text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">{partner.id}</div>
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Type de Partenariat</div>
                <div className={`text-xs font-bold px-2 py-1 rounded-full w-fit border ${typeInfo.color}`}>{typeInfo.label}</div>
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Créé le</div>
                <div className="font-medium text-gray-700">{new Date(partner.createdAt).toLocaleDateString("fr-FR")}</div>
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Dernière modification</div>
                <div className="font-medium text-gray-700">{new Date(partner.updatedAt).toLocaleDateString("fr-FR")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
