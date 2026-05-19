"use client"

/**
 * Page d'édition d'un projet existant.
 * Route : /admin/projets/[id]/edit
 *
 * Réutilise l'éditeur commun en passant l'ID du projet via les params Next.js.
 * L'éditeur se charge de récupérer et pré-remplir les données.
 */
export { default } from "../../editeur/page"
