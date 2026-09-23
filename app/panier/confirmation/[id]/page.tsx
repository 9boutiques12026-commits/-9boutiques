import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Banknote,
  CheckCircle2,
  Clock,
  HelpCircle,
  MapPin,
  MessageSquare,
  PackageCheck,
  Phone,
  Smartphone,
  Truck,
} from "lucide-react";

import { prisma } from "@/lib/db";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const PAYMENT_LABELS: Record<
  string,
  { label: string; icon: any; instructions: string }
> = {
  especes_livraison: {
    label: "Espèces à la livraison",
    icon: Banknote,
    instructions:
      "Veuillez préparer la somme exacte en liquide pour le livreur lors de la remise de votre commande.",
  },
  wave: {
    label: "Wave Mobile Money",
    icon: Smartphone,
    instructions:
      "Effectuez votre paiement instantané Wave vers le numéro +225 07 00 00 00 00 en mentionnant le numéro de commande en référence.",
  },
  orange_money: {
    label: "Orange Money",
    icon: Smartphone,
    instructions:
      "Effectuez votre transfert Orange Money vers le numéro +225 07 00 00 00 00 avec votre référence de commande.",
  },
  mtn_momo: {
    label: "MTN Mobile Money",
    icon: Smartphone,
    instructions:
      "Effectuez votre transfert MTN MoMo vers le numéro +225 05 00 00 00 00 avec votre référence de commande.",
  },
  whatsapp: {
    label: "Commande directe WhatsApp",
    icon: MessageSquare,
    instructions:
      "Notre conseiller va valider votre commande et convenir avec vous du créneau exact de livraison.",
  },
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const commande = await prisma.commande.findUnique({
    where: { id: params.id },
    include: {
      lignes: {
        include: {
          produit: true,
        },
      },
    },
  });

  if (!commande) {
    notFound();
  }

  const paymentInfo =
    PAYMENT_LABELS[commande.modePaiement] ?? PAYMENT_LABELS.especes_livraison;
  const PaymentIcon = paymentInfo.icon;

  const orderRef = `#${commande.id.slice(-6).toUpperCase()}`;

  const whatsappMessage = encodeURIComponent(
    `Bonjour 9boutiques ! Je vous contacte au sujet de ma commande ${orderRef} (${Number(
      commande.total,
    ).toLocaleString("fr-FR")} FCFA). Pouvez-vous m'indiquer le délai de livraison ?`,
  );

  return (
    <>
      <Header />
      <main className="container-shell pb-24 pt-12">
        <div className="mx-auto max-w-3xl">
          {/* En-tête de confirmation */}
          <div className="rounded-[2.5rem] border border-forest-700/10 bg-ivory-50 p-8 text-center sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest-100 text-forest-800">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-forest-700">
              Commande confirmée avec succès
            </p>
            <h1 className="mt-2 font-display text-3xl text-forest-900 sm:text-4xl">
              Merci pour votre commande !
            </h1>
            <p className="mt-3 text-sm text-forest-800/70">
              Votre commande <span className="font-semibold text-forest-900">{orderRef}</span> est
              bien enregistrée et prise en charge par notre équipe.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={`https://wa.me/2250700000000?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-emerald-700"
              >
                <MessageSquare className="h-4 w-4" />
                Suivre sur WhatsApp
              </a>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/boutiques">Continuer mes achats</Link>
              </Button>
            </div>
          </div>

          {/* Instructions de règlement */}
          <div className="mt-8 rounded-[2rem] border border-forest-700/10 bg-white p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest-50 text-forest-800">
                <PaymentIcon className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-forest-800/60 font-semibold">
                  Moyen de paiement choisi
                </span>
                <h2 className="font-display text-xl text-forest-900 mt-0.5">
                  {paymentInfo.label}
                </h2>
                <p className="mt-2 text-sm text-forest-800/75 leading-relaxed">
                  {paymentInfo.instructions}
                </p>
              </div>
            </div>
          </div>

          {/* Détails de livraison & Récapitulatif */}
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {/* Livraison */}
            <div className="rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-6">
              <div className="flex items-center gap-2 border-b border-forest-700/10 pb-3">
                <Truck className="h-4 w-4 text-forest-700" />
                <h3 className="font-display text-lg text-forest-900">Adresse de livraison</h3>
              </div>

              <div className="mt-4 space-y-2 text-sm text-forest-800/80">
                <p className="font-semibold text-forest-900">
                  {commande.nomClient || "Client"}
                </p>
                {commande.telephone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-forest-700/60" />
                    <a href={`tel:${commande.telephone}`} className="underline">
                      {commande.telephone}
                    </a>
                  </p>
                )}
                {commande.adresse && (
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-700/60" />
                    <span>
                      {commande.adresse}, {commande.ville}
                    </span>
                  </p>
                )}
                {commande.notes && (
                  <p className="mt-3 rounded-xl bg-forest-100/50 p-2.5 text-xs text-forest-800/80 italic">
                    Note : {commande.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Suivi & Statut */}
            <div className="rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-6">
              <div className="flex items-center gap-2 border-b border-forest-700/10 pb-3">
                <Clock className="h-4 w-4 text-forest-700" />
                <h3 className="font-display text-lg text-forest-900">Statut de la commande</h3>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-forest-800/70">Statut actuel :</span>
                  <span className="rounded-full bg-gold-400/20 px-3 py-0.5 text-xs font-semibold text-forest-900">
                    En préparation
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-forest-800/70">Date :</span>
                  <span className="text-forest-900 font-medium">
                    {new Intl.DateTimeFormat("fr-FR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(commande.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-forest-800/70">Paiement :</span>
                  <span className="text-forest-900 font-medium">
                    {paymentInfo.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des articles */}
          <div className="mt-8 rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-6 sm:p-8">
            <h3 className="font-display text-xl text-forest-900 border-b border-forest-700/10 pb-4">
              Articles commandés
            </h3>

            <div className="divide-y divide-forest-700/10">
              {commande.lignes.map((ligne) => (
                <div key={ligne.id} className="flex justify-between items-center py-4 text-sm">
                  <div>
                    <p className="font-medium text-forest-900">{ligne.produit.nom}</p>
                    <p className="text-xs text-forest-800/60">
                      Quantité : {ligne.quantite} ×{" "}
                      {Number(ligne.prixUnitaire).toLocaleString("fr-FR")} FCFA
                    </p>
                  </div>
                  <span className="font-semibold text-forest-900">
                    {(Number(ligne.prixUnitaire) * ligne.quantite).toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between border-t border-forest-700/15 pt-5 font-display text-xl text-forest-900">
              <span>Total</span>
              <span className="text-2xl font-bold">
                {Number(commande.total).toLocaleString("fr-FR")} FCFA
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
