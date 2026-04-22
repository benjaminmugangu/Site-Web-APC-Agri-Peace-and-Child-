import {
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Plus,
  Info,
  Clock,
  User,
  Tag
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminArticleEditor() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/actualites"
          className="flex items-center gap-2 text-gray-500 hover:text-apc-green transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Retour à la liste</span>
        </Link>
        <div className="flex gap-3">
          <Button variant="outline">Enregistrer Brouillon</Button>
          <Button className="gap-2 bg-apc-blue hover:bg-blue-700">
            <Save size={18} /> Publier l&apos;Article
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">Nouvel Article</h1>
        <p className="text-gray-500">
          Rédigez un article, un rapport ou une histoire de réussite à partager avec le public.
        </p>
      </div>

      {/* Main Form Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Colonne principale : Contenu */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 text-black">

            {/* Titre */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Titre de l&apos;Article
              </label>
              <input
                type="text"
                id="article-title"
                placeholder="Ex: L'impact du micro-crédit chez les femmes de Goma"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 focus:border-apc-blue transition-all text-lg font-medium"
              />
            </div>

            {/* Extrait / Résumé */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Extrait (Résumé Court)
              </label>
              <p className="text-xs text-gray-400">
                Affiché dans les cartes d&apos;aperçu sur la page Actualités. Max 200 caractères.
              </p>
              <textarea
                id="article-excerpt"
                rows={3}
                maxLength={200}
                placeholder="Résumé accrocheur de l'article..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 focus:border-apc-blue transition-all resize-none"
              />
            </div>

            {/* Contenu Principal */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Contenu de l&apos;Article
              </label>
              <textarea
                id="article-body"
                rows={12}
                placeholder="Rédigez le contenu complet de l'article ici. Le formatage Markdown sera supporté après intégration du backend."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 focus:border-apc-blue transition-all"
              />
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Info size={12} /> Le support Markdown complet sera activé après intégration du backend.
              </p>
            </div>

            {/* Grille Métadonnées */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Tag size={12} /> Catégorie
                </label>
                <select
                  id="article-category"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 focus:border-apc-blue transition-all bg-white"
                >
                  <option>Rapport</option>
                  <option>Impact</option>
                  <option>Éducation</option>
                  <option>Agriculture</option>
                  <option>Protection</option>
                  <option>Partenariat</option>
                  <option>Événement</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <User size={12} /> Auteur
                </label>
                <input
                  type="text"
                  id="article-author"
                  placeholder="Nom de l'auteur"
                  defaultValue="Admin APC"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 focus:border-apc-blue transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={12} /> Temps de Lecture (min)
                </label>
                <input
                  type="number"
                  id="article-readtime"
                  placeholder="5"
                  min={1}
                  max={60}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-blue/20 focus:border-apc-blue transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Colonne latérale : Média & Publication */}
        <div className="space-y-6">

          {/* Image de couverture */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-black">
              <ImageIcon size={18} className="text-apc-blue" /> Image de Couverture
            </h3>
            <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center p-4 hover:border-apc-blue hover:bg-blue-50/20 transition-all cursor-pointer group">
              <div className="p-3 rounded-full bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-apc-blue" />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-600">
                Cliquez pour uploader
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG ou WebP (Max 5MB)</p>
            </div>
          </div>

          {/* Options de publication */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-black">
            <h3 className="font-bold flex items-center gap-2">
              <Info size={18} className="text-apc-blue" /> Options de Publication
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <span className="text-sm font-medium block">Article À la Une</span>
                  <span className="text-xs text-gray-400">Afficher en premier sur la page Actualités</span>
                </div>
                <input
                  type="checkbox"
                  id="article-featured"
                  className="w-5 h-5 accent-apc-blue"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <span className="text-sm font-medium block">Inclure dans Newsletter</span>
                  <span className="text-xs text-gray-400">Notifier les abonnés à la newsletter</span>
                </div>
                <input
                  type="checkbox"
                  id="article-newsletter"
                  className="w-5 h-5 accent-apc-blue"
                  defaultChecked
                />
              </label>
            </div>

            <div className="pt-4 mt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 italic">
                Date de publication : {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Boutons rapides */}
          <div className="flex flex-col gap-3">
            <Button variant="outline" className="w-full gap-2">
              Prévisualiser l&apos;article
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
