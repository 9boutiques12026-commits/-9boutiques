import { CheckCircle2, Database, KeyRound, ShieldCheck } from "lucide-react";

import { AdminSection } from "@/app/admin/admin-section";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const settings = [["Base de données", "PostgreSQL / Prisma", Database], ["Authentification", "NextAuth.js / JWT", KeyRound], ["Protection", "Rôles admin et developer actifs", ShieldCheck]] as const;
  return <AdminSection active="Paramètres" eyebrow="Configuration / Système" title="Paramètres"><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"><section className="rounded-xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-semibold text-slate-900">Configuration du service</h2><p className="mt-1 text-sm text-slate-500">État des principaux services de la boutique.</p><div className="mt-6 divide-y divide-slate-100">{settings.map(([label, value, Icon]) => <div key={label} className="flex items-center justify-between gap-4 py-4"><div className="flex items-center gap-3"><Icon className="h-4 w-4 text-slate-500" /><div><p className="text-sm font-medium text-slate-900">{label}</p><p className="mt-1 text-xs text-slate-500">{value}</p></div></div><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>)}</div></section><aside className="h-fit rounded-xl border border-slate-200 bg-slate-900 p-6 text-white"><p className="text-xs uppercase tracking-[0.16em] text-white/50">Déploiement</p><h2 className="mt-3 text-lg font-semibold">Production</h2><p className="mt-2 text-sm leading-6 text-white/65">Les migrations Prisma sont appliquées automatiquement pendant le build Render.</p><div className="mt-6 rounded-lg bg-white/10 px-4 py-3 text-xs text-white/80">Environnement opérationnel</div></aside></div></AdminSection>;
}
