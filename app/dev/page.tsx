import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DevPage() {
  const [boutiques, produits, commandes, utilisateurs] = await Promise.all([prisma.boutique.count(), prisma.produit.count(), prisma.commande.count(), prisma.utilisateur.count()]);
  return <main className="container-shell py-16"><p className="badge">Developer</p><h1 className="section-title mt-5">État technique</h1><div className="mt-10 grid gap-4 md:grid-cols-4">{[["Boutiques", boutiques], ["Produits", produits], ["Commandes", commandes], ["Utilisateurs", utilisateurs]].map(([label, value]) => <div key={String(label)} className="rounded-[1.5rem] border border-forest-700/10 bg-ivory-50 p-6"><p className="text-sm text-forest-800/60">{label}</p><p className="mt-3 font-display text-4xl text-forest-900">{value}</p></div>)}</div><div className="mt-10 rounded-[1.5rem] bg-forest-900 p-6 text-ivory-50"><p className="text-sm text-ivory-100/70">Connexion base</p><p className="mt-2 font-medium">PostgreSQL / Prisma opérationnel</p></div></main>;
}
