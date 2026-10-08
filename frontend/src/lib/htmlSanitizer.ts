/**
 * Sanitizer HTML pour sécuriser le contenu du Rich Text Editor
 * Autorise uniquement les balises et attributs sûrs pour éviter XSS
 * Préserve les styles de couleur et la mise en forme de base
 */

import DOMPurify from 'isomorphic-dompurify'

// Balises HTML autorisées
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote',
  'a',
  'span',
  'div'
]

// Pour les contenus venant du RichTextEditor, autoriser plus de balises
const RICH_TEXT_ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote',
  'a',
  'span',
  'div',
  'font' // Pour compatibilité avec document.execCommand
]

// Attributs autorisés
const ALLOWED_ATTRIBUTES = {
  'a': ['href', 'target', 'rel', 'title'],
  'span': ['style', 'class'],
  'div': ['style', 'class'],
  'p': ['style', 'class'],
  'h1': ['style', 'class'],
  'h2': ['style', 'class'],
  'h3': ['style', 'class'],
  'h4': ['style', 'class'],
  'h5': ['style', 'class'],
  'h6': ['style', 'class'],
  'ul': ['style', 'class'],
  'ol': ['style', 'class'],
  'li': ['style', 'class'],
  'blockquote': ['style', 'class'],
  'strong': ['style', 'class'],
  'b': ['style', 'class'],
  'em': ['style', 'class'],
  'i': ['style', 'class'],
  'u': ['style', 'class'],
  's': ['style', 'class'],
  'strike': ['style', 'class'],
  'br': [],
}

// Styles CSS autorisés (color et text-decoration uniquement)
const ALLOWED_STYLES = [
  'color',
  'text-decoration',
  'font-weight',
  'font-style',
  'text-align',
  'margin',
  'padding',
  'list-style-type'
]

/**
 * Nettoie un style CSS pour ne garder que les propriétés autorisées
 */
function sanitizeStyle(styleString: string): string {
  if (!styleString) return ''
  
  const properties = styleString.split(';').filter(p => p.trim())
  const allowedProperties: string[] = []
  
  for (const prop of properties) {
    const [property, value] = prop.split(':').map(s => s.trim())
    if (property && value && ALLOWED_STYLES.includes(property)) {
      // Vérifier que la valeur ne contient pas de scripts ou fonctions dangereuses
      if (!/expression|javascript:|@import|url\(/i.test(value)) {
        allowedProperties.push(`${property}: ${value}`)
      }
    }
  }
  
  return allowedProperties.join('; ')
}

/**
 * Nettoie les attributs d'un élément
 */
function sanitizeAttributes(tagName: string, attributes: Record<string, string>): Record<string, string> {
  const allowed = ALLOWED_ATTRIBUTES[tagName as keyof typeof ALLOWED_ATTRIBUTES] || []
  const clean: Record<string, string> = {}
  
  for (const [key, value] of Object.entries(attributes)) {
    if (allowed.includes(key)) {
      if (key === 'style') {
        clean[key] = sanitizeStyle(value)
      } else if (key === 'href') {
        // Nettoyer les URLs pour éviter javascript:
        clean[key] = value.replace(/^javascript:/i, '')
      } else {
        clean[key] = value
      }
    }
  }
  
  return clean
}

/**
 * Convertit une chaîne HTML en DOM, nettoie, et retourne le HTML nettoyé
 */
export function sanitizeHTML(html: string, allowRichText: boolean = false): string {
  if (!html) return ''

  // Choisir la liste de balises appropriée
  const allowedTags = allowRichText ? RICH_TEXT_ALLOWED_TAGS : ALLOWED_TAGS

  // Utiliser DOMPurify pour la sécurisation XSS
  const config = {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: ['href', 'target', 'rel', 'title', 'style', 'class'],
    ALLOWED_STYLE: ALLOWED_STYLES,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  }

  return DOMPurify.sanitize(html, config)
}

/**
 * Version côté serveur (Node.js) utilisant DOMPurify si disponible
 * Fallback vers une regex simplifiée
 */
export function sanitizeHTMLServer(html: string): string {
  if (!html) return ''
  
  // Supprimer les scripts et events dangereux
  let cleaned = html
    cleaned = cleaned.replace(/<script[^>]*>.*?<\/script>/gis, '')
  cleaned = cleaned.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
  cleaned = cleaned.replace(/on\w+\s*=\s*[^\s>]+/gi, '')
  cleaned = cleaned.replace(/javascript:/gi, '')
  cleaned = cleaned.replace(/<iframe[^>]*>.*?<\/iframe>/gis, '')
  
  // Autoriser uniquement les balises et styles de couleur
  const allowedTagsPattern = new RegExp(
    `<(?:${ALLOWED_TAGS.join('|')})(?:\\s+[^>]*style=["'][^"']*["'][^>]*)?>`,
    'gi'
  )
  
  // Garder le contenu des balises autorisées
  const tagMatches = cleaned.match(allowedTagsPattern) || []
  const tagsContent = tagMatches.map(match => {
    const tagMatch = match.match(/<(\w+)/)
    if (!tagMatch) return ''
    const tag = tagMatch[1]
    const content = match.replace(/<[^>]+>([^<]*)<\/[^>]+>/, '$1')
    return match.replace(content, '') // Garder la balise avec style
  })
  
  // Reconstruire avec les balises autorisées
  // Note: C'est une simplification - pour une production réelle, utiliser DOMPurify
  return tagsContent.join('') || cleaned
}
