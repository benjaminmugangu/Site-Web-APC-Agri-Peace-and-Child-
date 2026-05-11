export type MessageType = "contact" | "donation" | "partnership" | "volunteer"
export type MessageStatus = "unread" | "read" | "replied"

export type Message = {
  id: string
  name: string
  email: string
  phone?: string
  type: MessageType
  subject: string
  content: string
  status: MessageStatus
  createdAt: string
  repliedAt?: string
  repliedBy?: string
}

export const mockMessages: Message[] = [
  {
    id: "msg-001",
    name: "Jean Maluta",
    email: "jmaluta@gmail.com",
    phone: "+243 812 334 556",
    type: "donation",
    subject: "Faire un don",
    content: "Bonjour, je souhaite faire un don pour soutenir les activités d'APC, notamment le projet de protection de l'enfance à Goma. Comment puis-je procéder ? Est-il possible de faire un virement bancaire depuis l'Europe ? Merci pour votre réponse.",
    status: "unread",
    createdAt: "2024-04-14T20:30:00Z",
  },
  {
    id: "msg-002",
    name: "Fondation Ubuntu RDC",
    email: "contact@fondationubuntu.cd",
    phone: "+243 998 221 445",
    type: "partnership",
    subject: "Proposition de partenariat",
    content: "Madame, Monsieur, La Fondation Ubuntu RDC œuvre pour le développement durable dans la province du Nord-Kivu. Nous aimerions explorer une possible collaboration avec APC sur les questions de sécurité alimentaire et de cohésion communautaire. Serait-il possible d'organiser une réunion exploratoire au courant du mois de mai ?",
    status: "unread",
    createdAt: "2024-04-14T15:45:00Z",
  },
  {
    id: "msg-003",
    name: "Amina Zawadi",
    email: "aminaz@yahoo.fr",
    type: "contact",
    subject: "Demande d'information générale",
    content: "Bonjour, je suis journaliste pour un media basé à Kinshasa et je travaille sur un reportage concernant l'action humanitaire dans l'est de la RDC. Serait-il possible d'obtenir une interview avec votre direction et des informations sur vos projets en cours ? Merci d'avance.",
    status: "read",
    createdAt: "2024-04-12T09:20:00Z",
  },
  {
    id: "msg-004",
    name: "Patrick Mwamba",
    email: "pmwamba@outlook.com",
    phone: "+243 895 667 112",
    type: "volunteer",
    subject: "Nous rejoindre",
    content: "Bonjour, je suis agronome diplômé de l'Université de Goma et je cherche une opportunité de bénévolat ou de stage dans le domaine humanitaire. Je suis très intéressé par vos programmes d'agriculture durable. Avez-vous des opportunités disponibles ?",
    status: "replied",
    createdAt: "2024-04-10T11:00:00Z",
    repliedAt: "2024-04-11T14:30:00Z",
    repliedBy: "marie@apc.org",
  },
  {
    id: "msg-005",
    name: "Dr. Sophie Bertrand",
    email: "s.bertrand@msf.org",
    type: "partnership",
    subject: "Coordination MSF — APC",
    content: "Chère équipe APC, dans le cadre de notre intervention médicale dans le territoire de Masisi, nous souhaiterions coordonner nos actions avec les vôtres sur le volet nutrition et sécurité alimentaire. Pouvons-nous prévoir un appel de coordination la semaine prochaine ?",
    status: "replied",
    createdAt: "2024-04-08T08:00:00Z",
    repliedAt: "2024-04-09T10:00:00Z",
    repliedBy: "benjamin@apc.org",
  },
  {
    id: "msg-006",
    name: "Christophe Hakizimana",
    email: "chris.haki@gmail.com",
    type: "donation",
    subject: "Faire un don",
    content: "Bonjour, je vis en Belgique et je voudrais contribuer financièrement aux projets de paix d'APC dans ma province natale du Nord-Kivu. Quels sont les modes de paiement acceptés ? Merci.",
    status: "unread",
    createdAt: "2024-04-07T19:00:00Z",
  },
]
