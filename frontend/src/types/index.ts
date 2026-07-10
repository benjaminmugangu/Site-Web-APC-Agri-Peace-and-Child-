/**
 * APC TypeScript Types Centralization
 */

// --- ARTICLES ---
export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ArticleStatus = "draft" | "published" | "scheduled"

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  categoryId: string
  category?: NewsCategory
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
  colorHex: string;
  mainImage?: string;
  actions?: string[];
  stats?: { value: string; label: string }[];
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}


// --- DEPARTMENTS ---
export interface Department {
  id: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- TEAM ---
export type TeamRole = "Directeur" | "Agronome" | "Logistique" | "Finance" | "Protection" | "Communication" | "Admin"

export interface TeamMember {
  id: string
  name: string
  role: string
  department?: string
  departmentId?: string | null
  departmentRelation?: Department | null
  email: string
  phone?: string
  photo?: string
  photoUrl?: string
  bio?: string
  linkedinUrl?: string
  status: "active" | "suspended" | "pending"
  order: number
  createdAt: string
  updatedAt: string
}

// --- MESSAGES ---
export type MessageStatus = "unread" | "read" | "replied" | "archived"
export type MessageType = "contact" | "donation" | "partnership" | "volunteer" // deprecated, replaced by MessageSubject

export interface MessageSubject {
  id: string
  name: string
  nameEn?: string
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  content: string
  type?: MessageType
  messageSubjectId?: string
  messageSubject?: MessageSubject
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
    partners: string;
    teamMembers: string;
  };
  contact: {
    address: string;
    phone1: string;
    phone2?: string;
    whatsapp?: string;
    email: string;
    emailSupport?: string;
    emailCareers?: string;
    socials?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
      youtube?: string;
    };
  };
  institution: {
    name: string;
    acronym: string;
    foundationYear: string;
    vision: string;
    mission: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogImage?: string;
  };
  logo: {
    logoHeader: string;
    logoFooter: string;
    logoDark?: string;
    favicon?: string;
  };
  // Sections dynamiques (issues #33 / #44 / #45 / #46)
  supportSection?: {
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    bulletPoints: string[];
  };
  historySection?: {
    title: string;
    subtitle: string;
    paragraphs: string[];
    imageUrl: string;
    objectives: { label: string; icon: string; color: string; bg: string }[];
  };
  engagementSection?: {
    title: string;
    subtitle: string;
    engagementTypes: { title: string; description: string; icon: string; color: string; bg: string }[];
    reasonsTitle: string;
    reasons: { title: string; description: string }[];
  };
  donationMessage?: string;
  transparencyMessage?: {
    title: string;
    description: string;
  };
  legalSection?: {
    privacyPolicy: string;
    legalNotices: string;
  };
}

// --- PARTNERS ---
export interface PartnerCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Partner {
  id: string;
  name: string;
  categoryId?: string;
  category?: PartnerCategory;
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
export interface CareerType {
  id: string;
  name: string;
  nameEn?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Career {
  id: string;
  title: string;
  type?: string;
  careerTypeId?: string;
  careerType?: CareerType;
  location: string;
  description: string;
  content?: string;
  deadline: string;
  status: "OPEN" | "CLOSED" | "ARCHIVED";
  isOpen?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  type?: string;
  careerTypeId?: string;
  careerType?: CareerType;
  motivation?: string;
  cvUrl?: string;
  status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED";
  careerId?: string;
  career?: Career;
  createdAt: string;
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

/** Catégorie dynamique : peut être un objet (avec join) ou une chaîne legacy */
export interface ProjectCategoryObject {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  category: ProjectCategoryObject | null;
  categoryId?: string;
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

// --- TESTIMONIALS ---
export type TestimonialStatus = "draft" | "published" | "archived";

export interface BeneficiaryTestimonial {
  id: string;
  authorName: string;
  authorRole?: string;
  authorLocation?: string;
  photoUrl?: string;
  content: string;
  projectName?: string;
  status: TestimonialStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
}
