"use client"

import React, { useRef, useEffect, useState } from "react"
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Undo, 
  Redo,
  Palette,
  ChevronDown
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

const APC_COLORS = [
  { name: "Vert APC", value: "#0f623c" },
  { name: "Rouge", value: "#dc2626" },
  { name: "Noir", value: "#000000" },
  { name: "Gris foncé", value: "#374151" },
  { name: "Bleu", value: "#2563eb" },
  { name: "Orange", value: "#ea580c" },
  { name: "Vert clair", value: "#16a34a" },
  { name: "Rouge clair", value: "#ef4444" },
]

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Saisissez votre contenu...", 
  className = "",
  minHeight = "200px"
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [activeColor, setActiveColor] = useState("#000000")

  // Initialiser le contenu éditeur
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  // Appliquer une commande de formatage
  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleContentChange()
  }

  // Gérer le changement de contenu
  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  // Appliquer la couleur
  const applyColor = (color: string) => {
    execCommand("foreColor", color)
    setActiveColor(color)
    setShowColorPicker(false)
  }

  const toolbarButtons = [
    { icon: Undo, command: "undo", title: "Annuler" },
    { icon: Redo, command: "redo", title: "Rétablir" },
    { divider: true },
    { icon: Bold, command: "bold", title: "Gras" },
    { icon: Italic, command: "italic", title: "Italique" },
    { icon: Underline, command: "underline", title: "Souligné" },
    { icon: Strikethrough, command: "strikeThrough", title: "Barré" },
    { divider: true },
    { icon: Heading1, command: "formatBlock", value: "H1", title: "Titre 1" },
    { icon: Heading2, command: "formatBlock", value: "H2", title: "Titre 2" },
    { icon: Heading3, command: "formatBlock", value: "H3", title: "Titre 3" },
    { divider: true },
    { icon: List, command: "insertUnorderedList", title: "Liste à puces" },
    { icon: ListOrdered, command: "insertOrderedList", title: "Liste numérotée" },
    { icon: Quote, command: "formatBlock", value: "BLOCKQUOTE", title: "Citation" },
    { divider: true },
    { icon: LinkIcon, command: "createLink", title: "Lien" },
    { divider: true },
    { icon: Palette, command: "foreColor", value: null, title: "Couleur", isColor: true },
  ]

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden ${className}`}>
      {/* Barre d'outils */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex flex-wrap items-center gap-1">
        {toolbarButtons.map((btn, index) => {
          if (btn.divider) {
            return <div key={index} className="w-px h-6 bg-gray-300 mx-1" />
          }

          const Icon = btn.icon
          const isActive = btn.isColor && activeColor === btn.value

          return (
            <div key={index} className="relative">
              <button
                type="button"
                onClick={() => {
                  if (btn.isColor) {
                    setShowColorPicker(!showColorPicker)
                  } else if (btn.command === "createLink") {
                    const url = prompt("Entrez l'URL du lien :")
                    if (url) execCommand(btn.command, url)
                  } else {
                    execCommand(btn.command, btn.value || null)
                  }
                }}
                title={btn.title}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  isActive ? "bg-gray-300" : ""
                }`}
              >
                <Icon size={16} />
              </button>

              {/* Sélecteur de couleurs */}
              {btn.isColor && showColorPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 w-48">
                  <div className="grid grid-cols-4 gap-1">
                    {APC_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => applyColor(color.value)}
                        title={color.name}
                        className="w-8 h-8 rounded border border-gray-200 hover:border-gray-400 transition-colors"
                        style={{ backgroundColor: color.value }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <input
                      type="color"
                      value={activeColor}
                      onChange={(e) => applyColor(e.target.value)}
                      className="w-full h-8 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Zone d'édition */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        suppressContentEditableWarning
        className="px-4 py-3 outline-none min-h-[200px] bg-white"
        style={{ minHeight }}
        data-placeholder={placeholder}
      />
    </div>
  )
}
