import React from "react"
import { PageHero } from "@/components/ui/page-hero"
import { ShieldCheck } from "lucide-react"
import { settingsService } from "@/lib/api/settings"

export default async function PrivacyPage() {
  const settings = await settingsService.get()

  return (
    <div className="flex flex-col">
      <PageHero
        title="Politique de Confidentialité"
        subtitle="Votre vie privée est importante pour nous. Découvrez comment nous protégeons vos données."
        tag="Confidentialité"
      />

      <section className="py-20">
        <div className="container max-w-3xl px-4">
          <div className="prose prose-apc prose-lg max-w-none text-black">
            {settings?.legalSection?.privacyPolicy ? (
              <div dangerouslySetInnerHTML={{ __html: settings.legalSection.privacyPolicy }} />
            ) : (
              <>
                <div className="flex items-center gap-3 mb-8 p-4 bg-apc-blue/5 rounded-2xl border border-apc-blue/10">
                  <ShieldCheck className="text-apc-blue" size={32} />
                  <p className="text-sm font-medium text-apc-blue m-0">Dernière mise à jour : Avril 2024</p>
                </div>

                <h2 className="text-2xl font-bold mb-4">1. Collecte des informations</h2>
                <p className="mb-6">
                  Nous recueillons des informations lorsque vous utilisez notre formulaire de contact ou lorsque vous faites un don. Les informations recueillies incluent votre nom, votre adresse e-mail et votre numéro de téléphone.
                </p>

                <h2 className="text-2xl font-bold mb-4">2. Utilisation des informations</h2>
                <p className="mb-6">
                  Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour :
                  <ul className="list-disc pl-6 mt-2">
                    <li>Personnaliser votre expérience et répondre à vos besoins individuels</li>
                    <li>Améliorer notre site Web</li>
                    <li>Améliorer le service client et vos besoins de prise en charge</li>
                    <li>Vous contacter par e-mail</li>
                  </ul>
                </p>

                <h2 className="text-2xl font-bold mb-4">3. Confidentialité du commerce en ligne</h2>
                <p className="mb-6">
                  Nous sommes les seuls propriétaires des informations recueillies sur ce site. Vos informations personnelles ne seront pas vendues, échangées, transférées, ou données à une autre société pour n&apos;importe quelle raison, sans votre consentement.
                </p>

                <h2 className="text-2xl font-bold mb-4">4. Protection des informations</h2>
                <p className="mb-6">
                  Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Nous utilisons un cryptage à la pointe de la technologie pour protéger les informations sensibles transmises en ligne.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
