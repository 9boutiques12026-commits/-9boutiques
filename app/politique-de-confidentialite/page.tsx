import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";

import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { SITE, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité | 9boutiques",
  description:
    "Comment 9boutiques collecte, utilise et protège vos données personnelles. Boutique à Bouaké, Côte d'Ivoire.",
};

const LAST_UPDATED = "8 octobre 2026";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-10 first:mt-0">
      <h2 className="font-display text-2xl tracking-[-0.03em] text-forest-900">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-forest-800/75">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-ivory-50 text-forest-900">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-14 md:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-forest-900/60 transition hover:text-gold-500">
          <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
        </Link>

        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.32em] text-gold-500">
          Vos données nous tiennent à cœur
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight tracking-[-0.04em] text-forest-900 md:text-5xl">
          Politique de confidentialité
        </h1>
        <p className="mt-4 text-sm text-forest-800/60">Dernière mise à jour : {LAST_UPDATED}</p>

        <p className="mt-8 rounded-2xl border border-forest-900/10 bg-ivory-100 p-5 text-sm leading-7 text-forest-800/80">
          Chez <strong>9boutiques</strong>, nous vendons des vêtements, jamais vos
          informations. Ce document explique, en langage clair, quelles données nous
          collectons, pourquoi, et quels sont vos droits. Il est conforme à la
          réglementation ivoirienne, notamment la <strong>loi n° 2013-450 du 19 juin
          2013</strong> relative à la protection des données à caractère personnel.
        </p>

        <Section id="responsable" title="1. Qui sommes-nous ?">
          <p>
            Le responsable du traitement des données est la boutique <strong>9boutiques</strong>,
            située à {SITE.ville} ({SITE.situation}), Côte d'Ivoire. Pour toute question
            relative à vos données, contactez-nous sur WhatsApp au{" "}
            <a href={whatsappLink("Bonjour, j'ai une question sur ma vie privée.")} target="_blank" rel="noopener noreferrer" className="text-gold-600 underline-offset-2 hover:underline">
              {SITE.whatsappAffiche}
            </a>.
          </p>
        </Section>

        <Section id="donnees" title="2. Quelles données collectons-nous ?">
          <ul className="list-disc space-y-1.5 pl-5">
            <li><strong>Données de commande :</strong> nom, numéro de téléphone, adresse et ville de livraison, éventuellement des notes.</li>
            <li><strong>Données de compte :</strong> adresse email et mot de passe (stocké de façon chiffrée, illisible pour nous).</li>
            <li><strong>Historique :</strong> le détail de vos commandes passées chez 9boutiques.</li>
            <li><strong>Panier et favoris :</strong> conservés localement dans votre navigateur, sans être envoyés sur nos serveurs.</li>
          </ul>
          <p>
            Nous ne collectons <strong>aucune donnée bancaire ni numéro de carte</strong>.
            Les paiements s'effectuent par Wave, Orange Money ou en espèces à la livraison,
            auprès de l'opérateur ou de notre équipe.
          </p>
        </Section>

        <Section id="finalites" title="3. Pourquoi utilisons-nous ces données ?">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Préparer, livrer et suivre vos commandes.</li>
            <li>Vous recontacter au sujet d'une commande (par téléphone ou WhatsApp).</li>
            <li>Gérer votre compte et votre historique.</li>
            <li>Améliorer nos services et prévenir les abus ou fausses commandes.</li>
          </ul>
          <p>
            Ces traitements reposent sur l'exécution de votre commande, votre consentement,
            ou notre intérêt légitime à faire fonctionner la boutique.
          </p>
        </Section>

        <Section id="partage" title="4. Partageons-nous vos données ?">
          <p>
            Jamais à des fins publicitaires ni de revente. Nous pouvons transmettre les
            informations strictement nécessaires à : notre hébergeur technique (Render),
            l'opérateur de paiement mobile choisi (Wave, Orange Money), et nos livreurs
            pour l'acheminement de votre colis. WhatsApp est utilisé uniquement comme moyen
            de contact : vos échanges nous servent à traiter votre demande.
          </p>
        </Section>

        <Section id="cookies" title="5. Cookies et stockage local">
          <p>
            Un cookie technique est utilisé pour maintenir votre session lorsque vous êtes
            connecté. Votre panier et vos articles favoris sont enregistrés dans le stockage
            local de votre navigateur. Vous pouvez effacer ces données à tout moment via les
            réglages de votre navigateur ou en vidant le panier.
          </p>
        </Section>

        <Section id="duree" title="6. Combien de temps les conservons-nous ?">
          <p>
            Les données de commande sont conservées le temps nécessaire au suivi de la
            commande et au respect de nos obligations légales (facturation). Les données de
            compte sont conservées tant que votre compte est actif, puis supprimées sur votre
            demande.
          </p>
        </Section>

        <Section id="securite" title="7. Comment protégeons-nous vos données ?">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Le site est accessible en connexion sécurisée (HTTPS).</li>
            <li>Les mots de passe sont chiffrés et ne peuvent être lus.</li>
            <li>L'accès aux commandes est réservé aux personnes autorisées de 9boutiques.</li>
          </ul>
        </Section>

        <Section id="droits" title="8. Vos droits">
          <p>Conformément à la loi ivoirienne, vous disposez des droits suivants :</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li><strong>Accès</strong> — savoir quelles données nous détenons sur vous.</li>
            <li><strong>Rectification</strong> — corriger une information inexacte.</li>
            <li><strong>Effacement</strong> — demander la suppression de vos données.</li>
            <li><strong>Opposition</strong> — vous opposer à un traitement.</li>
            <li><strong>Retrait du consentement</strong> — à tout moment.</li>
          </ul>
          <p>
            Pour exercer un droit, écrivez-nous sur WhatsApp au {SITE.whatsappAffiche}. Nous
            répondrons dans les meilleurs délais. Vous pouvez également saisir l'
            <strong>ARTCI</strong> (Autorité de Régulation des Télécommunications/TIC de Côte
            d'Ivoire), autorité en charge de la protection des données personnelles.
          </p>
        </Section>

        <Section id="mineurs" title="9. Mineurs">
          <p>
            Le site s'adresse à un public adulte. Nous ne collectons pas sciemment de données
            de personnes mineures sans l'accord d'un parent ou tuteur.
          </p>
        </Section>

        <Section id="modifications" title="10. Mise à jour de cette politique">
          <p>
            Cette politique peut être ajustée pour refléter l'évolution de nos services ou de
            la loi. Toute modification sera publiée sur cette page avec sa date de mise à jour.
          </p>
        </Section>

        <div className="mt-12 rounded-2xl border border-forest-900/10 bg-ivory-100 p-6 text-center">
          <p className="text-sm text-forest-800/70">Une question sur cette politique ?</p>
          <a
            href={whatsappLink("Bonjour 9boutiques, j'ai une question concernant votre politique de confidentialité.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 bg-forest-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ivory-50 transition hover:bg-forest-800"
          >
            <MessageCircle className="h-4 w-4" /> Écrire sur WhatsApp
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
