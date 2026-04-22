import { headers } from "next/headers"
import { Sidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Lire le pathname injecté par le middleware
  const headersList = headers()
  const pathname = headersList.get("x-pathname") ?? ""
  const isLoginPage = pathname === "/admin/login"

  // Page de connexion : pas de sidebar, pas de header
  if (isLoginPage) {
    return <>{children}</>
  }

  // Map des titres par route pour le header dynamique
  const pageTitles: Record<string, string> = {
    "/admin": "Tableau de Bord",
    "/admin/projets": "Gestion des Projets",
    "/admin/projets/editeur": "Nouvel / Éditeur de Projet",
    "/admin/actualites": "Gestion des Actualités",
    "/admin/actualites/editeur": "Nouvel / Éditeur d'Article",
    "/admin/equipe": "Membres & Équipe",
    "/admin/messages": "Centre de Messages",
    "/admin/galerie": "Galerie Média",
    "/admin/parametres": "Paramètres",
  }
  const currentTitle = pageTitles[pathname] ?? "Administration"

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      {/* Sidebar fixe à gauche */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Admin dynamique */}
        <header className="h-16 px-8 border-b border-gray-200 bg-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm font-medium">Admin</span>
            <span className="text-gray-300">/</span>
            <h2 className="text-gray-800 font-semibold text-sm">{currentTitle}</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 leading-none">Admin APC</p>
              <p className="text-xs text-gray-500 mt-1">Directeur Technique</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1a472a] flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Zone de contenu défilable */}
        <main className="p-8 overflow-y-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
