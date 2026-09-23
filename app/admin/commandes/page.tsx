import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const labels: Record<string, string> = {
  en_attente: "En attente",
  confirme: "Confirmée",
  expedie: "Expédiée",
  livre: "Livrée",
  annule: "Annulée",
};

const paymentLabels: Record<string, string> = {
  especes_livraison: "Espèces",
  wave: "Wave",
  orange_money: "Orange Money",
  mtn_momo: "MTN MoMo",
  whatsapp: "WhatsApp",
};

export default async function OrdersPage() {
  const commandes = await prisma.commande.findMany({
    include: { utilisateur: true, lignes: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="container-shell py-16">
      <p className="badge">Opérations</p>
      <h1 className="section-title mt-5">Commandes</h1>
      <div className="mt-10 overflow-hidden rounded-[2rem] border border-forest-700/10 bg-ivory-50">
        <div className="divide-y divide-forest-700/10">
          {commandes.map((commande) => (
            <Link
              key={commande.id}
              href={`/admin/commandes/${commande.id}`}
              className="flex flex-wrap items-center justify-between gap-5 px-6 py-5 transition hover:bg-forest-50"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-forest-900">
                    #{commande.id.slice(-8).toUpperCase()}
                  </p>
                  <span className="rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-semibold text-forest-800">
                    {paymentLabels[commande.modePaiement] || commande.modePaiement}
                  </span>
                </div>
                <p className="mt-1 text-sm text-forest-800/60">
                  {commande.nomClient || commande.utilisateur?.email || "Client"}
                  {commande.telephone ? ` · ${commande.telephone}` : ""} · {commande.lignes.length} article(s)
                </p>
              </div>
              <div className="flex items-center gap-5">
                <span className="rounded-full bg-gold-400/15 px-3 py-1 text-xs text-forest-800">
                  {labels[commande.statut] || commande.statut}
                </span>
                <span className="font-medium text-forest-800">
                  {Number(commande.total).toLocaleString("fr-FR")} FCFA
                </span>
                <ArrowRight className="h-4 w-4 text-forest-700/60" />
              </div>
            </Link>
          ))}
          {!commandes.length && (
            <p className="px-6 py-10 text-center text-forest-800/65">
              Aucune commande pour le moment.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
