import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contactez-nous — APC",
  description:
    "Prenez contact avec Agri-Peace and Child (APC) pour toute question, proposition de partenariat ou demande d'information.",
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
