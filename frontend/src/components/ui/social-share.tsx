"use client"

import { Facebook, Twitter, Linkedin, MessageCircle, Link2 } from "lucide-react"
import { Button } from "./button"
import { toast } from "sonner"

interface SocialShareProps {
  url: string
  title: string
  description?: string
}

export default function SocialShare({ url, title, description }: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description || "")

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  }

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    toast.success("Lien copié dans le presse-papier")
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Partager</span>
      <Button
        variant="outline"
        size="sm"
        className="h-10 w-10 p-0 text-green-600 hover:bg-green-50"
        onClick={() => window.open(shareLinks.whatsapp, '_blank')}
      >
        <MessageCircle size={18} />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-10 w-10 p-0 text-blue-600 hover:bg-blue-50"
        onClick={() => window.open(shareLinks.facebook, '_blank')}
      >
        <Facebook size={18} />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-10 w-10 p-0 text-sky-500 hover:bg-sky-50"
        onClick={() => window.open(shareLinks.twitter, '_blank')}
      >
        <Twitter size={18} />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-10 w-10 p-0 text-blue-700 hover:bg-blue-50"
        onClick={() => window.open(shareLinks.linkedin, '_blank')}
      >
        <Linkedin size={18} />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-10 w-10 p-0 text-gray-600 hover:bg-gray-50"
        onClick={copyLink}
      >
        <Link2 size={18} />
      </Button>
    </div>
  )
}
