"use client"

import React from "react"
import { sanitizeHTML } from "@/lib/htmlSanitizer"

interface HTMLContentProps {
  content: string
  className?: string
}

/**
 * Composant pour afficher du contenu HTML produit par le RichTextEditor
 * avec sécurité XSS via le sanitizer.
 */
export default function HTMLContent({ content, className = "" }: HTMLContentProps) {
  const sanitizedContent = sanitizeHTML(content)

  return (
    <div 
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  )
}
