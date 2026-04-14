import { Sidebar } from "@/components/admin/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      {/* Sidebar fixe à gauche */}
      <Sidebar />
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Header Admin (Barre du haut) */}
        <header className="h-16 px-8 border-b border-gray-200 bg-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-gray-500 font-medium text-sm">Dashboard</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 leading-none">Admin APC</p>
              <p className="text-xs text-gray-500 mt-1">Directeur Technique</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1a472a] flex items-center justify-center text-white font-bold">
              AD
            </div>
          </div>
        </header>

        {/* Zone de contenu défilable */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
