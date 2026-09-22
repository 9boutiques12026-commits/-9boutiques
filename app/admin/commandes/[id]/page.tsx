import Link from "next/link";

import { prisma } from "@/lib/db";
import { OrderStatusForm } from "@/app/admin/commandes/[id]/order-status-form";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const commande = await prisma.commande.findUnique({ where: { id: params.id }, include: { utilisateur: true, lignes: { include: { produit: true } } } });
  if (!commande) return <main className="container-shell py-16"><h1 className="section-title">Commande introuvable</h1><Link className="mt-6 inline-block text-forest-700" href="/admin/commandes">Retour aux commandes</Link></main>;
  return <main className="container-shell py-16"><Link href="/admin/commandes" className="text-sm text-forest-800/65">← Toutes les commandes</Link><div className="mt-6 flex flex-wrap items-end justify-between gap-5"><div><p className="badge">Commande #{commande.id.slice(-8).toUpperCase()}</p><h1 className="section-title mt-5">Détail de la commande</h1><p className="mt-3 text-sm text-forest-800/65">{commande.utilisateur.email} · {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(commande.createdAt)}</p></div><OrderStatusForm id={commande.id} initialStatus={commande.statut} /></div><section className="mt-10 rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-7"><h2 className="font-display text-3xl text-forest-900">Articles</h2><div className="mt-5 divide-y divide-forest-700/10">{commande.lignes.map((ligne) => <div key={ligne.id} className="flex justify-between gap-5 py-4"><div><p className="font-medium text-forest-900">{ligne.produit.nom}</p><p className="text-sm text-forest-800/60">Quantité : {ligne.quantite}</p></div><p className="text-forest-800">{(Number(ligne.prixUnitaire) * ligne.quantite).toFixed(2)} €</p></div>)}</div><div className="mt-6 flex justify-between border-t border-forest-700/10 pt-5 font-medium text-forest-900"><span>Total</span><span>{Number(commande.total).toFixed(2)} €</span></div></section></main>;
}
