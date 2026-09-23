import Link from "next/link";
import { BarChart3, LayoutDashboard, Package, Settings, ShoppingBag, Tag, Users } from "lucide-react";

const menu = [["Tableau de bord", "/admin", LayoutDashboard], ["Produits", "/admin/produits/nouveau", Package], ["Commandes", "/admin/commandes", ShoppingBag], ["Clients", "/admin", Users], ["Promotions", "/admin/promotions", Tag], ["Statistiques", "/admin/statistiques", BarChart3], ["Paramètres", "/admin/parametres", Settings]] as const;

export function AdminSection({ active, eyebrow, title, children }: { active: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return <div className="admin-shell"><aside className="admin-sidebar"><Link href="/admin" className="admin-brand"><span className="admin-brand-mark">9</span><span><strong>9boutiques</strong><small>Administration</small></span></Link><nav className="mt-10 space-y-1">{menu.map(([label, href, Icon]) => <Link key={label} href={href} className={`admin-nav-item ${label === active ? "admin-nav-active" : ""}`}><Icon className="h-[17px] w-[17px]" />{label}</Link>)}</nav><div className="admin-sidebar-footer"><span className="admin-avatar">ZK</span><span><strong>ZOKOU</strong><small>Administrateur</small></span></div></aside><main className="admin-main"><div className="admin-topbar"><div><p className="admin-eyebrow">{eyebrow}</p><h1>{title}</h1></div><Link href="/admin" className="admin-back">Retour au tableau de bord</Link></div>{children}</main></div>;
}
