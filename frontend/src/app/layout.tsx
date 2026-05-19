import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { settingsService } from "@/lib/api/settings";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await settingsService.get();
    const seo = settings?.seo;
    const name = settings?.institution?.name || "Agri-Peace and Child";
    const acronym = settings?.institution?.acronym || "APC";
    
    return {
      title: {
        default: seo?.metaTitle || `${name} — Organisation Humanitaire en RDC`,
        template: `%s | ${acronym}`,
      },
      description: seo?.metaDescription || `${name} est une ONG humanitaire engagée pour la Protection, l'Agriculture, la Dignité et la Paix en République Démocratique du Congo.`,
      keywords: seo?.metaKeywords || [name, acronym, "ONG", "humanitaire", "Congo", "agriculture", "paix", "enfance"],
      openGraph: {
        type: "website",
        locale: "fr_FR",
        siteName: name,
        images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata dynamically", error);
    return {
      title: {
        default: "Agri-Peace and Child — Organisation Humanitaire en RDC",
        template: "%s | Agri-Peace and Child",
      },
      description: "Agri-Peace and Child est une ONG humanitaire engagée pour la Protection, l'Agriculture, la Dignité et la Paix en République Démocratique du Congo.",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
