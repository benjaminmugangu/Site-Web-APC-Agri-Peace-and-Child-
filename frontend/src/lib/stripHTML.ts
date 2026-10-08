/**
 * Fonction utilitaire pour supprimer les balises HTML
 * Version serveur-sécurisée (n'utilise pas DOMPurify)
 * Utile pour afficher des extraits en texte brut dans les Server Components
 * @param html - La chaîne HTML à nettoyer
 * @returns La chaîne sans balises HTML
 */
export function stripHTMLTags(html: string): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}
