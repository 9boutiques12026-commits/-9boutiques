import { prisma } from "@/lib/db";
import { NewProductForm } from "@/app/admin/produits/nouveau/new-product-form";
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, BarChart3, Settings } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const boutiques = await prisma.boutique.findMany({ orderBy: { nom: "asc" }, select: { id: true, nom: true } });
  const menu = [["Tableau de bord", "/admin", LayoutDashboard], ["Produits", "/admin/produits/nouveau", Package], ["Commandes", "/admin/commandes", ShoppingBag], ["Clients", "/admin", Users], ["Promotions", "/admin", Tag], ["Statistiques", "/admin", BarChart3], ["Paramètres", "/admin", Settings]] as const;
  return <div className="admin-shell"><aside className="admin-sidebar"><Link href="/admin" className="admin-brand"><span className="admin-brand-mark">9</span><span><strong>9boutiques</strong><small>Administration</small></span></Link><nav className="mt-10 space-y-1">{menu.map(([label, href, Icon]) => <Link key={label} href={href} className={`admin-nav-item ${label === "Produits" ? "admin-nav-active" : ""}`}><Icon className="h-[17px] w-[17px]" />{label}</Link>)}</nav><div className="admin-sidebar-footer"><span className="admin-avatar">ZK</span><span><strong>ZOKOU</strong><small>Administrateur</small></span></div></aside><main className="admin-main"><div className="admin-topbar"><div><p className="admin-eyebrow">Catalogue / Produits</p><h1>Ajouter un produit</h1></div><Link href="/admin" className="admin-back">Retour au tableau de bord</Link></div><NewProductForm boutiques={boutiques} /></main></div>;
}
