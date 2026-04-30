import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nos Projets — Agri-Peace and Child",
  description:
    "Découvrez l'ensemble des initiatives menées par Agri-Peace and Child sur le terrain en RD Congo : agriculture durable, paix et protection de l'enfance.",
}

export default function ProjetsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
