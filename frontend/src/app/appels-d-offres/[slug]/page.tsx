import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTenderBySlug } from "@/lib/api/tenders"
import TenderDetailClient from "./tender-detail-client"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const tender = await getTenderBySlug(params.slug).catch(() => null);
  
  if (!tender) return { title: "Appel d'offres introuvable — APC" }
  
  // S'assurer que l'URL de l'image est absolue pour WhatsApp et les réseaux sociaux
  const absoluteImageUrl = tender.imageUrl && !tender.imageUrl.startsWith('http') 
    ? `https://www.agri-peaceandchild.org${tender.imageUrl}` 
    : tender.imageUrl;
  
  return {
    title: `${tender.title} — Appel d'offres APC`,
    description: tender.metaDescription || tender.description?.substring(0, 160),
    openGraph: {
      title: tender.title,
      description: tender.metaDescription || tender.description?.substring(0, 160),
      images: absoluteImageUrl ? [{ url: absoluteImageUrl, width: 1200, height: 630, alt: tender.title }] : [],
      type: "website",
      locale: "fr_FR",
      siteName: "Agri-Peace and Child",
    },
    twitter: {
      card: "summary_large_image",
      title: tender.title,
      description: tender.metaDescription || tender.description?.substring(0, 160),
      images: absoluteImageUrl ? [absoluteImageUrl] : [],
    },
  }
}

export default async function TenderDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const tender = await getTenderBySlug(params.slug).catch(() => null);
  
  if (!tender) notFound();
  
  return <TenderDetailClient tender={tender} />
}
