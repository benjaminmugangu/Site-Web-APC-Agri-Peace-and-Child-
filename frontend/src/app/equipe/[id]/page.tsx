import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Mail, Phone, Linkedin, MapPin, Briefcase, Building2, ExternalLink } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"

async function getMember(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/team/${id}`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const json = await res.json()
    return json.data || null
  } catch {
    return null
  }
}

async function getAllMembers() {
  try {
    const res = await fetch(`${API_BASE_URL}/team`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    const json = await res.json()
    return json.data || []
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const member = await getMember(params.id)
  if (!member) return { title: "Membre introuvable | APC" }
  return {
    title: `${member.name} — ${member.role} | APC`,
    description: member.bio || `Découvrez le profil de ${member.name}, ${member.role} chez Agri-Peace and Child.`,
  }
}

const DEPT_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Direction:   { bg: "bg-purple-50",  text: "text-purple-700",  dot: "bg-purple-400" },
  Protection:  { bg: "bg-rose-50",    text: "text-rose-700",    dot: "bg-rose-400" },
  Agriculture: { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400" },
  Finance:     { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400" },
  Programmes:  { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
}

export default async function TeamMemberPage({ params }: { params: { id: string } }) {
  const [member, allMembers] = await Promise.all([getMember(params.id), getAllMembers()])

  if (!member || member.status !== "active") notFound()

  const deptStyle = DEPT_COLORS[member.department] || DEPT_COLORS["Programmes"]
  const displayPhoto = member.photoUrl || member.photo

  const parts = (member.name || "").trim().split(/\s+/)
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : (parts[0] || "M").slice(0, 2).toUpperCase()

  // Autres membres actifs (sauf le courant)
  const otherMembers = allMembers
    .filter((m: any) => m.id !== member.id && m.status === "active")
    .slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen bg-apc-bgLight">
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-border/40">
        <div className="container px-4 py-4">
          <Link
            href="/a-propos#equipe"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-apc-green transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour à l'équipe
          </Link>
        </div>
      </div>

      {/* ── Hero profil ── */}
      <section className="bg-white py-16 border-b border-border/40">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start max-w-4xl mx-auto">
            {/* Photo */}
            <div className="shrink-0">
              {displayPhoto ? (
                <div className="relative w-40 h-40 rounded-[2rem] overflow-hidden shadow-xl ring-4 ring-apc-green/10">
                  <Image src={displayPhoto} alt={member.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-40 h-40 rounded-[2rem] bg-gradient-to-br from-apc-green to-emerald-700 flex items-center justify-center text-white text-5xl font-black shadow-xl">
                  {initials}
                </div>
              )}
            </div>

            {/* Info principale */}
            <div className="flex-1 text-center md:text-left">
              {/* Badge département */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${deptStyle.bg} ${deptStyle.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${deptStyle.dot}`} />
                {member.department || "Équipe"}
              </span>

              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-2">
                {member.name}
              </h1>
              <p className="text-apc-green font-bold text-lg mb-6">{member.role}</p>

              {/* Contacts */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-700 hover:border-apc-green/40 hover:text-apc-green transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-700 hover:border-apc-green/40 hover:text-apc-green transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    {member.phone}
                  </a>
                )}
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Corps ── */}
      <section className="py-16">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Biographie */}
            <div className="lg:col-span-2">
              {member.bio ? (
                <div className="bg-white rounded-[2rem] p-8 border border-border/40 shadow-sm">
                  <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Biographie</h2>
                  <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">{member.bio}</p>
                </div>
              ) : (
                <div className="bg-white rounded-[2rem] p-8 border border-dashed border-border/60 text-center text-gray-400">
                  <p className="text-sm">Biographie à venir.</p>
                </div>
              )}
            </div>

            {/* Infos latérales */}
            <div className="space-y-4">
              <div className="bg-white rounded-[2rem] p-6 border border-border/40 shadow-sm space-y-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Informations</h2>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-apc-green/10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4 text-apc-green" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Poste</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{member.role}</p>
                  </div>
                </div>

                {member.department && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-apc-green/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-apc-green" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Département</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">{member.department}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-apc-green/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-apc-green" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Organisation</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">Agri-Peace and Child — APC</p>
                    <p className="text-xs text-gray-400 mt-0.5">Goma, Nord-Kivu, RDC</p>
                  </div>
                </div>
              </div>

              <Link
                href="/nous-rejoindre"
                className="block bg-apc-green text-white rounded-[2rem] p-6 text-center font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-apc-green/20"
              >
                Rejoindre l'équipe →
              </Link>
            </div>
          </div>

          {/* ── Autres membres ── */}
          {otherMembers.length > 0 && (
            <div className="max-w-4xl mx-auto mt-16">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Autres membres de l'équipe</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {otherMembers.map((m: any) => {
                  const photo = m.photoUrl || m.photo
                  const mParts = (m.name || "").trim().split(/\s+/)
                  const mInitials = mParts.length >= 2
                    ? (mParts[0][0] + mParts[1][0]).toUpperCase()
                    : (mParts[0] || "M").slice(0, 2).toUpperCase()

                  return (
                    <Link
                      key={m.id}
                      href={`/equipe/${m.id}`}
                      className="bg-white rounded-2xl p-5 flex items-center gap-4 border border-border/40 hover:border-apc-green/40 hover:shadow-md transition-all group"
                    >
                      {photo ? (
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                          <Image src={photo} alt={m.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-apc-green flex items-center justify-center text-white font-bold shrink-0">
                          {mInitials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate group-hover:text-apc-green transition-colors">{m.name}</p>
                        <p className="text-xs text-gray-400 truncate">{m.role}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
