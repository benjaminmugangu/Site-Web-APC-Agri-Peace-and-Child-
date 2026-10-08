import React from "react"
import { sanitizeHTMLServer } from "@/lib/htmlSanitizer"

interface HTMLContentProps {
  content: string
  className?: string
  allowRichText?: boolean
}

/**
 * Composant serveur pour afficher du contenu HTML produit par le RichTextEditor
 * avec sécurité XSS via le sanitizer serveur (DOMPurify).
 * Utilisé dans les pages Next.js App Router (server components).
 */
export default function HTMLContent({ content, className = "", allowRichText = true }: HTMLContentProps) {
  const sanitizedContent = sanitizeHTMLServer(content, allowRichText)

  return (
    <div
      className={`prose ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  )
}
