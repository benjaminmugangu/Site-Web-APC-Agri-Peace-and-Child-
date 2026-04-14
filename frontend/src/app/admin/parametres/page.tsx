import { 
  Settings, 
  Globe, 
  Bell, 
  ShieldCheck, 
  Save,
  Palette,
  Mail
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminParametres() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between text-black">
        <div>
          <h1 className="text-2xl font-bold">Paramètres Système</h1>
          <p className="text-gray-500 text-sm">Configurez les options globales du site et de l&apos;organisation.</p>
        </div>
        <Button className="gap-2 bg-apc-green">
          <Save size={18} /> Enregistrer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Mini Settings */}
        <div className="space-y-1">
          <button className="w-full text-left px-4 py-2 rounded-lg bg-white border border-gray-100 text-apc-green font-bold text-sm shadow-sm flex items-center gap-2">
            <Globe size={16} /> Général
          </button>
          <button className="w-full text-left px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-50 text-sm flex items-center gap-2">
            <Palette size={16} /> Apparence
          </button>
          <button className="w-full text-left px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-50 text-sm flex items-center gap-2">
            <Bell size={16} /> Notifications
          </button>
          <button className="w-full text-left px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-50 text-sm flex items-center gap-2">
            <ShieldCheck size={16} /> Sécurité
          </button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8 text-black">
            
            {/* Organisation */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-gray-50 pb-2">
                Informations Organisation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Nom de l&apos;ONG</label>
                  <input type="text" defaultValue="Agri-Peace and Child" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-apc-green/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Slogan</label>
                  <input type="text" defaultValue="Agir pour la Dignité et la Paix" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-apc-green/20" />
                </div>
              </div>
            </section>

            {/* Contact Info */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-gray-50 pb-2">
                Coordonnées de Contact
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Email de Contact</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="email" defaultValue="agripeaceandchild@gmail.com" className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Siège Social</label>
                  <textarea defaultValue="Goma, Nord-Kivu, RD Congo" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg h-20" />
                </div>
              </div>
            </section>

            {/* Social Links */}
            <section className="space-y-4 text-black font-semibold">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-gray-50 pb-2">
                Réseaux Sociaux
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">Facebook: <input type="text" placeholder="URL" className="flex-1 bg-gray-50 border border-gray-200 rounded px-2 py-1" /></div>
                <div className="flex items-center gap-2 text-sm text-gray-500">Twitter (X): <input type="text" placeholder="URL" className="flex-1 bg-gray-50 border border-gray-200 rounded px-2 py-1" /></div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
