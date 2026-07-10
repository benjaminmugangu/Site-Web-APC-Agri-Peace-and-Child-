import React from "react"
import { PageHero } from "@/components/ui/page-hero"
import { FileText } from "lucide-react"
import { settingsService } from "@/lib/api/settings"

export default async function MentionsLegalesPage() {
  const settings = await settingsService.get()

  return (
    <div className="flex flex-col">
      <PageHero
        title="Mentions Légales"
        subtitle="Informations légales concernant l'organisation Agri-Peace and Child (APC)."
        tag="Légal"
      />

      <section className="py-20">
        <div className="container max-w-3xl px-4">
          <div className="prose prose-apc prose-lg max-w-none text-black">
            {settings?.legalSection?.legalNotices ? (
              <div dangerouslySetInnerHTML={{ __html: settings.legalSection.legalNotices }} />
            ) : (
              <>
                <div className="flex items-center gap-3 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <FileText className="text-gray-400" size={32} />
                  <p className="text-sm font-medium text-gray-500 m-0">Conformité aux lois de la République Démocratique du Congo.</p>
                </div>

                <h2 className="text-2xl font-bold mb-4">1. Présentation de l&apos;Organisation</h2>
                <p className="mb-6">
                  Le site web est édité par l&apos;ONG <strong>{settings?.institution?.name || 'Agri-Peace and Child'}</strong> ({settings?.institution?.acronym || 'APC'}).<br />
                  <strong>Siège social :</strong> {settings?.contact?.address || 'Goma, Nord-Kivu, RD Congo'}<br />
                  <strong>Téléphone :</strong> {settings?.contact?.phone1 || ''}<br />
                  <strong>Email :</strong> {settings?.contact?.email || ''}
                </p>

                <h2 className="text-2xl font-bold mb-4">2. Hébergement</h2>
                <p className="mb-6">
                  Le site est hébergé par Vercel Inc., situé au 340 S Lemon Ave #4133 Walnut, CA 91789, USA.
                </p>

                <h2 className="text-2xl font-bold mb-4">3. Propriété Intellectuelle</h2>
                <p className="mb-6">
                  L&apos;ensemble de ce site relève de la législation congolaise et internationale sur le droit d&apos;auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                </p>

                <h2 className="text-2xl font-bold mb-4">4. Limitation de Responsabilité</h2>
                <p className="mb-6">
                  {settings?.institution?.name || 'Agri-Peace and Child'} s&apos;efforce d&apos;assurer au mieux de ses possibilités l&apos;exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, l&apos;organisation ne peut garantir l&apos;exactitude, la précision ou l&apos;exhaustivité des informations mises à la disposition sur ce site.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
