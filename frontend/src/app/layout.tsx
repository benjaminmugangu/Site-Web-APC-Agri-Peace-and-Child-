import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "APC — Agri-Peace and Child",
    template: "%s | APC",
  },
  description:
    "APC (Agri-Peace and Child) est une ONG humanitaire engagée pour la Protection, l'Agriculture, la Dignité et la Paix en RD Congo.",
  keywords: ["APC", "ONG", "humanitaire", "Congo", "agriculture", "paix", "enfance"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Agri-Peace and Child (APC)",
  },
};

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
