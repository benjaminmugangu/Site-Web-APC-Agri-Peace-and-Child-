import { 
  Plus, 
  UserPlus, 
  Mail, 
  Shield, 
  MoreVertical,
  MailQuestion
} from "lucide-react"
import { Button } from "@/components/ui/button"

const team = [
  { id: 1, name: "Benjamin Mugangu", role: "Directeur Exécutif", email: "benjamin@apc.org", access: "Super Admin" },
  { id: 2, name: "Marie Louise", role: "Coordination Projets", email: "marie@apc.org", access: "Admin" },
  { id: 3, name: "Jean Kabila", role: "Chargé de Paix", email: "jean@apc.org", access: "Éditeur" },
]

export default function AdminEquipe() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-black">
        <div>
          <h1 className="text-2xl font-bold">Membres & Équipe</h1>
          <p className="text-gray-500 text-sm">Gérez les comptes des collaborateurs et leurs permissions.</p>
        </div>
        <Button className="gap-2 bg-apc-blue hover:bg-blue-700">
          <UserPlus size={18} /> Ajouter un Membre
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {team.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:border-apc-blue/30 transition-all text-black">
            <div className="w-16 h-16 rounded-full bg-apc-blue/10 flex items-center justify-center text-apc-blue text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
              {member.name.charAt(0)}
            </div>
            <h3 className="font-bold text-gray-900">{member.name}</h3>
            <p className="text-apc-blue text-xs font-semibold uppercase tracking-wider mb-4">{member.role}</p>
            
            <div className="w-full space-y-3 pt-4 border-t border-gray-50 text-left">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Mail size={14} /> {member.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Shield size={14} className="text-amber-500" /> Accès : {member.access}
              </div>
            </div>

            <div className="flex gap-2 mt-6 w-full">
              <Button variant="outline" size="sm" className="flex-1">Gérer</Button>
              <Button variant="ghost" size="sm" className="text-red-500">Suspendre</Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Invitation Section */}
      <div className="bg-gray-50 rounded-2xl p-8 border border-dashed border-gray-200 text-center text-black">
        <MailQuestion size={40} className="mx-auto text-gray-400 mb-4" />
        <h3 className="font-bold mb-2">Envoyer une invitation</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
          Vous pouvez inviter de nouveaux membres par email. Ils recevront un lien pour configurer leur compte.
        </p>
        <div className="flex max-w-md mx-auto gap-2">
          <input 
            type="email" 
            placeholder="email@collaborateur.com"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-apc-blue/20"
          />
          <Button className="bg-apc-blue">Inviter</Button>
        </div>
      </div>
    </div>
  )
}
