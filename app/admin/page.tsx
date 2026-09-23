import { AdminDashboard } from "@/app/admin/admin-dashboard";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { BarChart3, LayoutDashboard, Package, Settings, ShoppingBag, Tag, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [boutiques, produits, commandes, clients] = await Promise.all([
    prisma.boutique.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.produit.findMany({ include: { boutique: true }, orderBy: { createdAt: "desc" } }),
    prisma.commande.count(),
    prisma.utilisateur.count({ where: { role: "client" } }),
  ]);

  const serializableProduits = produits.map((produit) => ({
    ...produit,
    prix: Number(produit.prix),
  }));

  const menu = [["Tableau de bord", "/admin", LayoutDashboard], ["Produits", "/admin/produits/nouveau", Package], ["Commandes", "/admin/commandes", ShoppingBag], ["Clients", "/admin", Users], ["Promotions", "/admin/promotions", Tag], ["Statistiques", "/admin/statistiques", BarChart3], ["Paramètres", "/admin/parametres", Settings]] as const;
  return <div className="admin-shell"><aside className="admin-sidebar"><Link href="/admin" className="admin-brand"><span className="admin-brand-mark">9</span><span><strong>9boutiques</strong><small>Administration</small></span></Link><nav className="mt-10 space-y-1">{menu.map(([label, href, Icon]) => <Link key={label} href={href} className={`admin-nav-item ${label === "Tableau de bord" ? "admin-nav-active" : ""}`}><Icon className="h-[17px] w-[17px]" />{label}</Link>)}</nav><div className="admin-sidebar-footer"><span className="admin-avatar">OC</span><span><strong>OUATTARA</strong><small>Administrateur</small></span></div></aside><main className="admin-main"><div className="admin-topbar"><div><p className="admin-eyebrow">Vue d’ensemble</p><h1>Tableau de bord</h1></div><Link href="/admin/produits/nouveau" className="rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white">Ajouter un produit</Link></div><div className="mt-8 grid gap-4 md:grid-cols-4"><Metric label="Produits" value={produits.length} detail="Dans le catalogue" /><Metric label="Boutiques" value={boutiques.length} detail="Maisons actives" /><Metric label="Commandes" value={commandes} detail="Toutes périodes" /><Metric label="Clients" value={clients} detail="Comptes inscrits" /></div><AdminDashboard initialBoutiques={boutiques} initialProduits={serializableProduits} /></main></div>;
}

function Metric({ label, value, detail }: { label: string; value: number; detail: string }) { return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.025)]"><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900">{value}</p><p className="mt-2 text-[11px] text-slate-400">{detail}</p></div>; }
