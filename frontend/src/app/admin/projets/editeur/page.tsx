import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  Plus, 
  Info,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminProjectEditor() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link href="/admin/projets" className="flex items-center gap-2 text-gray-500 hover:text-apc-green transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Retour à la liste</span>
        </Link>
        <div className="flex gap-3">
          <Button variant="outline">Enregistrer Brouillon</Button>
          <Button className="gap-2 bg-apc-green hover:bg-green-700">
            <Save size={18} /> Publier le Projet
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Noueau Projet</h1>
        <p className="text-gray-500">Remplissez les informations ci-dessous pour présenter votre action sur le site.</p>
      </div>

      {/* Main Form Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 text-black">
            {/* Titre */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Titre du Projet</label>
              <input 
                type="text" 
                placeholder="Ex: Soutien à l'agriculture durable"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all text-lg font-medium"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Description Détaillée</label>
              <textarea 
                rows={8}
                placeholder="Décrivez l'impact, le contexte et les objectifs..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all"
              />
            </div>

            {/* Grid for Small Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Catégorie</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all">
                  <option>Protection</option>
                  <option>Agriculture</option>
                  <option>Dignité</option>
                  <option>Paix</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Budget Prévu ($)</label>
                <input 
                  type="number" 
                  placeholder="5000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Media & Meta */}
        <div className="space-y-6">
          {/* Media Upload */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-black">
              <ImageIcon size={18} className="text-apc-green" /> Image de Couverture
            </h3>
            <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center p-4 hover:border-apc-green hover:bg-green-50/20 transition-all cursor-pointer group">
              <div className="p-3 rounded-full bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-apc-green" />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-600">Cliquez pour uploader</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG ou WebP (Max 5MB)</p>
            </div>
          </div>

          {/* Visibility & Settings */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-black">
            <h3 className="font-bold flex items-center gap-2">
              <Info size={18} className="text-apc-green" /> Paramètres de Publication
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Afficher sur l&apos;accueil</span>
                <input type="checkbox" className="w-5 h-5 accent-apc-green" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Besoins de dons</span>
                <input type="checkbox" className="w-5 h-5 accent-apc-green" />
              </div>
            </div>
            
            <div className="pt-4 mt-4 border-t border-gray-100 italic text-xs text-gray-400 flex gap-2">
              <CheckCircle2 size={14} /> Dernière sauvegarde auto à 14:35
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
