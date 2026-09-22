"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export default function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setSuccess(""); setLoading(true);
    const response = await fetch("/api/inscription", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const data = await response.json();
    if (!response.ok) setError(data.error || "Inscription impossible.");
    else { setSuccess("Compte créé. Vous pouvez maintenant vous connecter."); setEmail(""); setPassword(""); }
    setLoading(false);
  }

  return <main className="container-shell flex min-h-screen items-center justify-center py-16"><div className="w-full max-w-md rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-8 shadow-luxe"><p className="badge">Nouveau compte</p><h1 className="mt-6 font-display text-4xl text-forest-900">Rejoindre 9boutiques</h1><form className="mt-8 space-y-5" onSubmit={submit}>{error && <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}{success && <p role="status" className="rounded-2xl bg-forest-50 px-4 py-3 text-sm text-forest-800">{success}</p>}<label className="block text-sm text-forest-800">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-full border border-forest-700/10 bg-white px-4 py-3" /></label><label className="block text-sm text-forest-800">Mot de passe<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-full border border-forest-700/10 bg-white px-4 py-3" /></label><Button className="w-full" disabled={loading}>{loading ? "Création..." : "Créer mon compte"}</Button></form><p className="mt-6 text-center text-sm text-forest-800/70"><Link href="/login" className="font-medium text-forest-900">Retour à la connexion</Link></p></div></main>;
}
