"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Cog, 
  Briefcase, 
  Search, 
  Users, 
  Newspaper,
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageSquare,
  ShieldCheck,
  Tag
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

const menuItems = [
  { icon: LayoutDashboard, label: "Tableau de Bord", href: "/admin", roles: ['ADMIN', 'ADMIN_RH'] },
  { icon: Cog, label: "Nos Services", href: "/admin/services", roles: ['ADMIN', 'ADMIN_RH'] },
  { icon: Briefcase, label: "Réalisations", href: "/admin/projets", roles: ['ADMIN', 'ADMIN_RH'] },
  { icon: Tag, label: "Catégories Projets", href: "/admin/projets/categories", roles: ['ADMIN', 'ADMIN_RH'], subItem: true },
  { icon: Newspaper, label: "Actualités", href: "/admin/actualites", roles: ['ADMIN', 'ADMIN_RH'] },
  { icon: Tag, label: "Catégories Actualités", href: "/admin/actualites/categories", roles: ['ADMIN', 'ADMIN_RH'], subItem: true },
  { icon: MessageSquare, label: "Témoignages", href: "/admin/temoignages", roles: ['ADMIN', 'ADMIN_RH'] },
  { icon: FileText, label: "Appels d'Offres", href: "/admin/appels-d-offres", roles: ['ADMIN', 'ADMIN_RH'] },
  { icon: Search, label: "Offres d'Emploi", href: "/admin/emplois", roles: ['ADMIN', 'ADMIN_RH'] },
  { icon: FileText, label: "Candidatures", href: "/admin/candidatures", roles: ['ADMIN', 'ADMIN_RH'] },
  { icon: Users, label: "Experts / Équipe", href: "/admin/equipe", roles: ['ADMIN', 'ADMIN_RH'] },
  { icon: ShieldCheck, label: "Partenaires", href: "/admin/partenaires", roles: ['ADMIN', 'ADMIN_RH'] },
  { icon: Tag, label: "Types Partenaires", href: "/admin/partenaires/categories", roles: ['ADMIN', 'ADMIN_RH'], subItem: true },
  { icon: MessageSquare, label: "Messages", href: "/admin/messages", roles: ['ADMIN', 'ADMIN_RH'] },
  { icon: Tag, label: "Sujets de contact", href: "/admin/messages/sujets", roles: ['ADMIN'], subItem: true },
  { icon: ShieldCheck, label: "Utilisateurs", href: "/admin/utilisateurs", roles: ['ADMIN'] },
  { icon: Settings, label: "Paramètres", href: "/admin/parametres", roles: ['ADMIN'] },
]

export function Sidebar({ userRole = "ADMIN" }: { userRole?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [logo, setLogo] = useState<string | null>(null)

  useEffect(() => {
    import("@/lib/api/settings").then(({ settingsService }) => {
      settingsService.get().then((data) => {
        if (data?.logo?.logoHeader) {
          setLogo(data.logo.logoHeader);
        }
      }).catch(err => console.error("Failed to load sidebar logo", err));
    });
  }, [])

  const handleLogout = () => {
    // Effacer le cookie de session
    document.cookie = "apc_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside 
      className={cn(
        "h-screen bg-[#1a472a] text-white flex flex-col transition-all duration-300 relative",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Bouton pour rétracter */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 w-6 h-6 rounded-full bg-apc-greenLight text-white border-2 border-[#1a472a] hover:bg-white hover:text-[#1a472a] z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </Button>

      {/* Header Sidebar */}
      <div className="p-6 flex items-center gap-3 overflow-hidden h-20 shrink-0">
        {logo ? (
          <img src={logo} alt="APC" className={cn("object-contain select-none transition-all duration-300", isCollapsed ? "h-8 w-8" : "h-10 w-10")} />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-apc-greenLight flex items-center justify-center shrink-0">
            <span className="font-bold text-white">A</span>
          </div>
        )}
        {!isCollapsed && (
          <span className="font-bold text-lg tracking-tight whitespace-nowrap">
            Admin APC
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.filter(item => {
          return item.roles.includes(userRole)
        }).map((item) => {
          const isActive = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
                item.subItem ? "ml-4" : "",
                isActive 
                  ? "bg-white/10 text-apc-greenLight font-semibold" 
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform group-hover:scale-110",
                item.subItem ? "w-4 h-4" : "",
                isActive ? "text-apc-greenLight" : "text-white/60 group-hover:text-white"
              )} />
              {!isCollapsed && <span className={cn("text-sm", item.subItem ? "text-xs" : "")}>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-xl w-full text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          {!isCollapsed && <span className="text-sm font-medium">Déconnexion</span>}
        </button>
      </div>
    </aside>
  )
}
