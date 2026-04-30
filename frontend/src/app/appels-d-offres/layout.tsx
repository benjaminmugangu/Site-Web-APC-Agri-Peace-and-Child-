import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Appels d'Offres — Agri-Peace and Child",
  description:
    "Consultez les appels d'offres publiés par Agri-Peace and Child et soumettez votre offre en ligne pour nos projets humanitaires en RD Congo.",
}

export default function AppelsDOffresLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
