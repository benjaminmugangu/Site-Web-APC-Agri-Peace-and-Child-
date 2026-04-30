export type SiteSettings = {
  hero: {
    title: string
    subtitle: string
    image: string
  }
  stats: {
    beneficiaires: string
    projets: string
    provinces: string
  }
  contact: {
    address: string
    phone: string
    email: string
  }
}

export const mockSettings: SiteSettings = {
  hero: {
    title: "Agir pour la Dignité humaine et la Paix",
    subtitle: "Agri-Peace and Child est une organisation non gouvernementale engagée dans la protection sociale, le développement agricole et la consolidation de l'équité en RD Congo.",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop",
  },
  stats: {
    beneficiaires: "15k+",
    projets: "32",
    provinces: "4",
  },
  contact: {
    address: "Goma, République Démocratique du Congo",
    phone: "+243 975 418 316",
    email: "agripeaceandchild@gmail.com",
  }
}
