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
  
  return {
    title: `${tender.title} — Appel d'offres APC`,
    description: tender.metaDescription || tender.description?.substring(0, 160),
    openGraph: {
      title: tender.title,
      description: tender.metaDescription || tender.description?.substring(0, 160),
      images: tender.imageUrl ? [{ url: tender.imageUrl, width: 1200, height: 630 }] : [],
      type: "website",
      locale: "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title: tender.title,
      description: tender.metaDescription || tender.description?.substring(0, 160),
      images: tender.imageUrl ? [tender.imageUrl] : [],
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
