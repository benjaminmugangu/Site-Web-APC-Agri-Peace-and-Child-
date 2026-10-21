"use client"

import { useState } from "react"
import * as LucideIcons from "lucide-react"
import { COMMON_ICONS } from "@/lib/icons"

interface IconSelectorProps {
  value: string
  onChange: (iconName: string) => void
  className?: string
}

export function IconSelector({ value, onChange, className = "" }: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredIcons = COMMON_ICONS.filter(icon =>
    icon.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const IconComponent = (LucideIcons as any)[value] || (LucideIcons as any)["Heart"]

  return (
    <div className={`relative ${className}`}>
      {/* Bouton de sélection avec prévisualisation */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-apc-green/20 flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
          <IconComponent size={20} className="text-gray-700" />
        </div>
        <span className="font-mono text-sm text-gray-700">{value}</span>
        <span className="ml-auto text-gray-400">▼</span>
      </button>

      {/* Dropdown avec liste d'icônes */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-80 overflow-hidden">
          {/* Barre de recherche */}
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              placeholder="Rechercher une icône..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 text-sm"
            />
          </div>

          {/* Grille d'icônes */}
          <div className="p-3 grid grid-cols-6 gap-2 max-h-60 overflow-y-auto">
            {filteredIcons.map((iconName) => {
              const Icon = (LucideIcons as any)[iconName]
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => {
                    onChange(iconName)
                    setIsOpen(false)
                    setSearchTerm("")
                  }}
                  className={`p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center ${
                    value === iconName ? "bg-apc-green/10 ring-2 ring-apc-green" : ""
                  }`}
                  title={iconName}
                >
                  <Icon size={20} className="text-gray-700" />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
