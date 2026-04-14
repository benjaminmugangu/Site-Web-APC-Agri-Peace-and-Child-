"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Leaf, 
  Newspaper, 
  Users, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const menuItems = [
  { icon: LayoutDashboard, label: "Tableau de Bord", href: "/admin" },
  { icon: Leaf, label: "Gestion Projets", href: "/admin/projets" },
  { icon: Newspaper, label: "Actualités", href: "/admin/actualites" },
  { icon: Users, label: "Membres & Équipe", href: "/admin/equipe" },
  { icon: Settings, label: "Paramètres", href: "/admin/parametres" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

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
      <div className="p-6 flex items-center gap-3 overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-apc-greenLight flex items-center justify-center shrink-0">
          <span className="font-bold text-white">A</span>
        </div>
        {!isCollapsed && (
          <span className="font-bold text-lg tracking-tight whitespace-nowrap">
            APC Admin
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-white/10 text-apc-greenLight font-semibold" 
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform group-hover:scale-110",
                isActive ? "text-apc-greenLight" : "text-white/60 group-hover:text-white"
              )} />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 p-3 rounded-xl w-full text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-colors group">
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          {!isCollapsed && <span className="text-sm font-medium">Déconnexion</span>}
        </button>
      </div>
    </aside>
  )
}
