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
  tags?: string[]
  createdAt: string
  updatedAt: string
}

// --- SERVICES ---
export interface Service {
  id: string;
  name: string;
  titleEn?: string;
  slug: string;
  description: string;
  descriptionEn?: string;
  iconName?: string;
  bgClass?: string;
  accentClass?: string;
  mainImage?: string;
  actions?: string[];
  stats?: { value: string; label: string }[];
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}


// --- TEAM ---
export type TeamRole = "Directeur" | "Agronome" | "Logistique" | "Finance" | "Protection" | "Communication" | "Admin"

export interface TeamMember {
  id: string
  name: string
  role: string
  department?: string
  email: string
  phone?: string
  photo?: string
  photoUrl?: string
  bio?: string
  status: "active" | "suspended" | "pending"
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
  phone?: string
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
  type: "DONOR" | "TECHNICAL" | "LOCAL" | "STRATEGIC";
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  totalFunding?: number;
  isActive: boolean;
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
  meta?: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

// --- PROJECTS ---
export type ProjectStatus = 'draft' | 'published' | 'archived';
export type ProjectCategory = 'agriculture' | 'protection' | 'dignite' | 'paix';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  budget: number;
  currency: string;
  location?: string;
  province?: string;
  beneficiaries: number;
  startDate?: string;
  endDate?: string;
  mainImage?: string;
  gallery?: string[];
  featured: boolean;
  showOnHome: boolean;
  needsDonation: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}
