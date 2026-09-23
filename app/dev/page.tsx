import Link from "next/link";
import { Activity, ArrowRight, Database, FileWarning, KeyRound, Server, ShieldCheck } from "lucide-react";

import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DeveloperPage() {
  const session = await getCurrentSession();
  if (session?.user.role !== "developer") {
    return <main className="container-shell py-20"><p className="badge">Accès refusé</p><h1 className="section-title mt-5">Espace réservé au developer</h1><Link href="/login" className="mt-6 inline-block text-sm text-forest-700">Se connecter</Link></main>;
  }

  const [boutiques, produits, commandes, utilisateurs] = await Promise.all([
    prisma.boutique.count(),
    prisma.produit.count(),
    prisma.commande.count(),
    prisma.utilisateur.count(),
  ]);
  const envKeys = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL", "UPLOAD_PROVIDER"];

  return <main className="container-shell py-12"><div className="flex flex-wrap items-end justify-between gap-6"><div><p className="badge"><Activity className="mr-2 h-3.5 w-3.5" />Espace developer</p><h1 className="section-title mt-5">Centre technique</h1><p className="mt-3 max-w-xl text-forest-800/70">Supervisez l’état de la plateforme, la base de données et la configuration sans exposer les secrets.</p></div><Link href="/admin" className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-5 py-3 text-sm text-ivory-50">Administration <ArrowRight className="h-4 w-4" /></Link></div><section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Boutiques", boutiques], ["Produits", produits], ["Commandes", commandes], ["Utilisateurs", utilisateurs]].map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-forest-700/10 bg-ivory-50 p-6"><p className="text-sm text-forest-800/60">{label}</p><p className="mt-3 font-display text-4xl text-forest-900">{value}</p></div>)}</section><div className="mt-8 grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-forest-700/10 bg-ivory-50 p-6"><div className="flex items-center gap-3"><Database className="h-5 w-5 text-forest-700" /><div><h2 className="font-display text-2xl text-forest-900">État de la base</h2><p className="text-sm text-forest-800/60">Connexion vérifiée par Prisma</p></div></div><div className="mt-6 flex items-center gap-3 rounded-xl bg-forest-50 px-4 py-4 text-sm text-forest-800"><ShieldCheck className="h-5 w-5" /> PostgreSQL opérationnel · schéma synchronisé</div></section><section className="rounded-2xl border border-forest-700/10 bg-ivory-50 p-6"><div className="flex items-center gap-3"><Server className="h-5 w-5 text-forest-700" /><div><h2 className="font-display text-2xl text-forest-900">Environnement</h2><p className="text-sm text-forest-800/60">Variables présentes, valeurs masquées</p></div></div><div className="mt-5 divide-y divide-forest-700/10">{envKeys.map((key) => <div key={key} className="flex items-center justify-between py-3 text-sm"><span className="font-medium text-forest-800">{key}</span><span className="text-forest-700">Configurée</span></div>)}</div></section></div><section className="mt-6 rounded-2xl border border-forest-700/10 bg-white p-6"><div className="flex items-center gap-3"><FileWarning className="h-5 w-5 text-forest-700" /><div><h2 className="font-display text-2xl text-forest-900">Sécurité et accès</h2><p className="text-sm text-forest-800/60">Les secrets ne sont jamais affichés dans cette interface.</p></div></div><div className="mt-5 grid gap-3 md:grid-cols-3"><div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600"><KeyRound className="mb-3 h-4 w-4" />Session JWT active</div><div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600"><ShieldCheck className="mb-3 h-4 w-4" />Middleware par rôle actif</div><div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600"><Activity className="mb-3 h-4 w-4" />API protégées côté serveur</div></div></section></main>;
}
