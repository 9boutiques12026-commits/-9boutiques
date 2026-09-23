import { AdminSection } from "@/app/admin/admin-section";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function StatisticsPage() {
  const [products, shops, customers, orders, revenue] = await Promise.all([
    prisma.produit.count(),
    prisma.boutique.count(),
    prisma.utilisateur.count({ where: { role: "client" } }),
    prisma.commande.count(),
    prisma.commande.aggregate({ _sum: { total: true } }),
  ]);
  const metrics = [["Chiffre d’affaires", `${Number(revenue._sum.total ?? 0).toLocaleString("fr-FR")} FCFA`], ["Commandes", orders], ["Produits", products], ["Clients", customers], ["Boutiques", shops]];
  return <AdminSection active="Statistiques" eyebrow="Analyse / Performance" title="Statistiques"><div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">{metrics.map(([label, value]) => <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-xs text-slate-500">{label}</p><p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{value}</p></div>)}</div><section className="mt-6 rounded-xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-semibold text-slate-900">Vue catalogue</h2><p className="mt-2 text-sm text-slate-500">Les indicateurs sont calculés directement depuis PostgreSQL et se mettent à jour à chaque ouverture.</p><div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-3/5 rounded-full bg-slate-900" /></div></section></AdminSection>;
}
