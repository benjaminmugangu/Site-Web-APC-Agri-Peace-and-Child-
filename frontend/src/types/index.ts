/**
 * APC TypeScript Types Centralization
 */

// --- ARTICLES ---
export type ArticleCategory = "Impact" | "Rapport" | "Paix" | "Agriculture" | "Protection" | "Partenariat" | "Événement"
export type ArticleStatus = "draft" | "published" | "scheduled"

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: ArticleCategory
  author: string
  authorId: string
  readTime: number
  status: ArticleStatus
  featured: boolean
  includeNewsletter: boolean
  publishDate: string | null
  scheduledDate?: string
  mainImage: string
  createdAt: string
  updatedAt: string
}

// --- SERVICES ---
export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon?: string;
  mainImage?: string;
  actions?: string[];
  stats?: { label: string; value: string }[];
  style?: {
    color: string;
    bgColor: string;
    borderColor: string;
  };
  order: number;
  isActive: boolean;
}

// --- PROJECTS ---
export type ProjectStatus = "draft" | "published" | "archived" | "active" | "completed"
export type ProjectCategory = "Agriculture" | "Paix" | "Éducation" | "Santé" | "Protection" | "Infrastructure"

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  content: string
  category: ProjectCategory
  location: string
  status: ProjectStatus
  startDate: string
  endDate: string | null
  budget?: string
  beneficiaries: number
  mainImage: string
  gallery?: string[]
  tags: string[]
  featured: boolean
  createdAt: string
  updatedAt: string
}

// --- TEAM ---
export type TeamRole = "Directeur" | "Agronome" | "Logistique" | "Finance" | "Protection" | "Communication" | "Admin"

export interface TeamMember {
  id: string
  firstName: string
  lastName: string
  role: string
  position: string
  bio: string
  email: string
  phone?: string
  photo: string
  status: "active" | "inactive"
  socialLinks?: {
    linkedin?: string
    twitter?: string
  }
  order: number
  createdAt: string
  updatedAt: string
}

// --- MESSAGES ---
export type MessageStatus = "unread" | "read" | "replied" | "archived"
export type MessageType = "contact" | "donation" | "partnership" | "volunteer"

export interface Message {
  id: string
  name: string
  email: string
  subject: string
  content: string
  type: MessageType
  status: MessageStatus
  repliedBy?: string
  replyContent?: string
  createdAt: string
}

// --- TENDERS (Appels d'offres) ---
export type TenderStatus = "open" | "closed" | "awarded" | "cancelled"

export interface Tender {
  id: string
  title: string
  reference: string
  description: string
  content?: string
  status: TenderStatus
  publishDate?: string
  deadline: string
  fileUrl?: string
  location: string
  organization: string
  documents?: { label: string; url: string }[]
  createdAt: string
  updatedAt: string
}

// --- SETTINGS & HOME ---
export interface SiteSettings {
  id?: number;
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  stats: {
    beneficiaries: string;
    projects: string;
    provinces: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    socials?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
  };
}

// --- PARTNERS ---
export interface Partner {
  id: string;
  name: string;
  logo: string;
  websiteUrl?: string;
  type: "TECHNICAL" | "FINANCIAL" | "STRATEGIC" | "GOVERNMENTAL";
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// --- PAGINATION ---
export interface PaginatedResult<T> {
  data: T[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

// --- CAREERS ---
export interface Career {
  id: string;
  title: string;
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "VOLUNTEER";
  location: string;
  description: string;
  content?: string;
  deadline: string;
  status: "OPEN" | "CLOSED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}
