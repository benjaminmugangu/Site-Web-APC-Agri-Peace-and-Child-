"use client"

import React from "react"
import { sanitizeHTML } from "@/lib/htmlSanitizer"

interface HTMLContentProps {
  content: string
  className?: string
  allowRichText?: boolean
}

/**
 * Composant pour afficher du contenu HTML produit par le RichTextEditor
 * avec sécurité XSS via le sanitizer.
 */
export default function HTMLContent({ content, className = "", allowRichText = true }: HTMLContentProps) {
  const sanitizedContent = sanitizeHTML(content, allowRichText)

  return (
    <div 
      className={`prose ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  )
}
