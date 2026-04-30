import { 
  Globe, 
  Save,
  Mail,
  MapPin,
  Phone
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminParametres() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between text-black">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres Généraux</h1>
          <p className="text-gray-500 text-sm">Configurez les informations d&apos;identité et de contact de l&apos;organisation.</p>
        </div>
        <Button className="gap-2 bg-apc-green hover:bg-green-700">
          <Save size={18} /> Enregistrer les modifications
        </Button>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
          
          {/* Logo Section */}
          <section className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
              Identité Visuelle (Logo)
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group relative">
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase cursor-pointer">
                  Changer
                </div>
                <img src="/logo-placeholder.png" alt="Logo" className="max-w-[80%] max-h-[80%] object-contain" />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm text-gray-600 font-medium">Logo Principal du Site</p>
                <p className="text-xs text-gray-400 max-w-md">Ce logo sera affiché dans l&apos;en-tête du site, le pied de page et les documents officiels. Utilisez de préférence un fichier PNG transparent ou SVG.</p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="h-9">Importer un fichier</Button>
                  <Button variant="ghost" size="sm" className="h-9 text-red-500">Supprimer</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Organisation */}
          <section className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
              <Globe size={20} className="text-apc-green" /> Identité de l&apos;Organisation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nom complet de l&apos;ONG</label>
                <input type="text" defaultValue="Agri-Peace and Child" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Slogan / Vision</label>
                <input type="text" defaultValue="Agir pour la Dignité humaine et la Paix" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apc-green/20 focus:border-apc-green transition-all" />
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <section className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
              <Mail size={20} className="text-apc-blue" /> Coordonnées de Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email de Contact principal</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="email" defaultValue="agripeaceandchild@gmail.com" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apc-blue/20" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Téléphone de Contact</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" defaultValue="+243 975 418 316" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apc-blue/20" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Adresse du Siège Social (Goma)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-4 text-gray-400" size={16} />
                <textarea defaultValue="Quartier Le Volcan, Commune de Goma, Ville de Goma, Nord-Kivu, RD Congo" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl h-24 focus:outline-none focus:ring-2 focus:ring-apc-green/20" />
              </div>
            </div>
          </section>

          {/* Social Links */}
          <section className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
              Réseaux Sociaux
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">f</span>
                <input type="text" placeholder="URL Facebook" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm" />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-900 font-bold text-xs">X</span>
                <input type="text" placeholder="URL Twitter (X)" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm" />
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
