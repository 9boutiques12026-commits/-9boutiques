import Link from "next/link";
import { Banknote, MapPin, MessageSquare, Phone, Smartphone, User } from "lucide-react";

import { prisma } from "@/lib/db";
import { OrderStatusForm } from "@/app/admin/commandes/[id]/order-status-form";

export const dynamic = "force-dynamic";

const paymentLabels: Record<string, { label: string; icon: any }> = {
  especes_livraison: { label: "Espèces à la livraison", icon: Banknote },
  wave: { label: "Wave Mobile Money", icon: Smartphone },
  orange_money: { label: "Orange Money", icon: Smartphone },
  mtn_momo: { label: "MTN Mobile Money", icon: Smartphone },
  whatsapp: { label: "Commande directe WhatsApp", icon: MessageSquare },
};

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const commande = await prisma.commande.findUnique({
    where: { id: params.id },
    include: { utilisateur: true, lignes: { include: { produit: true } } },
  });

  if (!commande) {
    return (
      <main className="container-shell py-16">
        <h1 className="section-title">Commande introuvable</h1>
        <Link className="mt-6 inline-block text-forest-700 underline" href="/admin/commandes">
          Retour aux commandes
        </Link>
      </main>
    );
  }

  const paymentConfig = paymentLabels[commande.modePaiement] ?? {
    label: commande.modePaiement,
    icon: Banknote,
  };
  const PaymentIcon = paymentConfig.icon;

  const clientName = commande.nomClient || commande.utilisateur?.email || "Client";

  return (
    <main className="container-shell py-16">
      <Link href="/admin/commandes" className="text-sm text-forest-800/65 underline">
        ← Toutes les commandes
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <p className="badge">Commande #{commande.id.slice(-8).toUpperCase()}</p>
            <span className="flex items-center gap-1.5 rounded-full bg-forest-100 px-3 py-1 text-xs font-semibold text-forest-900">
              <PaymentIcon className="h-3.5 w-3.5" />
              {paymentConfig.label}
            </span>
          </div>
          <h1 className="section-title mt-4">Détail de la commande</h1>
          <p className="mt-2 text-sm text-forest-800/65">
            Créée le{" "}
            {new Intl.DateTimeFormat("fr-FR", {
              dateStyle: "full",
              timeStyle: "short",
            }).format(commande.createdAt)}
          </p>
        </div>

        <OrderStatusForm id={commande.id} initialStatus={commande.statut} />
      </div>

      {/* Informations de livraison et contact */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-6">
          <div className="flex items-center gap-2 border-b border-forest-700/10 pb-3">
            <User className="h-4 w-4 text-forest-700" />
            <h2 className="font-display text-lg text-forest-900">Client & Contact</h2>
          </div>
          <div className="mt-4 space-y-2.5 text-sm text-forest-800/80">
            <p className="font-semibold text-forest-900">{clientName}</p>
            {commande.utilisateur?.email && (
              <p className="text-xs text-forest-800/60">Email du compte : {commande.utilisateur.email}</p>
            )}
            {commande.telephone ? (
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-forest-700" />
                <a
                  href={`tel:${commande.telephone}`}
                  className="font-medium text-forest-900 underline"
                >
                  {commande.telephone}
                </a>
                <a
                  href={`https://wa.me/${commande.telephone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800"
                >
                  WhatsApp
                </a>
              </div>
            ) : (
              <p className="text-xs text-forest-800/50">Aucun numéro renseigné</p>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-6">
          <div className="flex items-center gap-2 border-b border-forest-700/10 pb-3">
            <MapPin className="h-4 w-4 text-forest-700" />
            <h2 className="font-display text-lg text-forest-900">Adresse de livraison</h2>
          </div>
          <div className="mt-4 space-y-2 text-sm text-forest-800/80">
            {commande.adresse || commande.ville ? (
              <>
                <p className="font-medium text-forest-900">
                  {commande.adresse || "Adresse non spécifiée"}
                </p>
                {commande.ville && (
                  <p className="text-xs text-forest-800/60">Ville / Commune : {commande.ville}</p>
                )}
              </>
            ) : (
              <p className="text-xs text-forest-800/50">Aucune adresse renseignée</p>
            )}
            {commande.notes && (
              <div className="mt-3 rounded-xl bg-forest-100/50 p-3 text-xs italic text-forest-800">
                <span className="font-semibold not-italic">Note client :</span> {commande.notes}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Liste des articles */}
      <section className="mt-8 rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-7">
        <h2 className="font-display text-2xl text-forest-900">Articles commandés</h2>
        <div className="mt-5 divide-y divide-forest-700/10">
          {commande.lignes.map((ligne) => (
            <div key={ligne.id} className="flex justify-between gap-5 py-4">
              <div>
                <p className="font-medium text-forest-900">{ligne.produit.nom}</p>
                <p className="text-sm text-forest-800/60">
                  Quantité : {ligne.quantite} × {Number(ligne.prixUnitaire).toLocaleString("fr-FR")} FCFA
                </p>
              </div>
              <p className="font-semibold text-forest-800">
                {(Number(ligne.prixUnitaire) * ligne.quantite).toLocaleString("fr-FR")} FCFA
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between border-t border-forest-700/10 pt-5 font-display text-xl text-forest-900">
          <span>Total</span>
          <span className="text-2xl font-bold">
            {Number(commande.total).toLocaleString("fr-FR")} FCFA
          </span>
        </div>
      </section>
    </main>
  );
}
