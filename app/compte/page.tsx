import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getCurrentSession();
  if (!session?.user?.id) redirect("/login?callbackUrl=/compte");

  const user = await prisma.utilisateur.findUnique({
    where: { id: session.user.id },
    include: { commandes: { include: { lignes: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!user) redirect("/login");

  return <main className="container-shell py-16"><p className="badge">Mon espace</p><h1 className="section-title mt-5">Bonjour, {user.email}</h1><div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]"><section className="h-fit rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-6"><p className="text-sm text-forest-800/60">Profil</p><p className="mt-3 font-medium text-forest-900">{user.email}</p><p className="mt-2 text-sm capitalize text-forest-800/70">Rôle : {user.role}</p></section><section className="rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-6"><h2 className="font-display text-3xl text-forest-900">Historique des commandes</h2>{user.commandes.length ? <div className="mt-5 divide-y divide-forest-700/10">{user.commandes.map((commande) => <div key={commande.id} className="flex justify-between gap-4 py-4"><div><p className="font-medium text-forest-900">#{commande.id.slice(-8).toUpperCase()}</p><p className="text-sm text-forest-800/60">{commande.lignes.length} article(s) · {commande.statut}</p></div><p>{Number(commande.total).toFixed(2)} €</p></div>)}</div> : <p className="mt-6 text-sm text-forest-800/65">Aucune commande pour le moment.</p>}</section></div></main>;
}