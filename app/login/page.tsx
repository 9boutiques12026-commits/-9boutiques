"use client";

import Link from "next/link";
import { useState } from "react";
import { getSession, signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    if (!result || result.error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }
    const session = await getSession();
    window.location.assign(session?.user.role === "admin" || session?.user.role === "developer" ? "/admin" : "/");
  }

  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-8 shadow-luxe">
        <p className="badge">Connexion</p>
        <h1 className="mt-6 font-display text-4xl text-forest-900">Accès privilégié</h1>
        <p className="mt-3 text-sm text-forest-800/70">
          Connectez-vous pour accéder au compte client ou à l’espace de gestion.
        </p>

        <form className="mt-8 space-y-5" onSubmit={submit}>
          {error && <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <div>
            <label className="mb-2 block text-sm text-forest-800">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="bonjour@9boutiques.fr"
              className="w-full rounded-full border border-forest-700/10 bg-white px-4 py-3 outline-none ring-0 placeholder:text-forest-800/40"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-forest-800">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-full border border-forest-700/10 bg-white px-4 py-3 outline-none ring-0 placeholder:text-forest-800/40"
            />
          </div>
          <Button className="w-full" disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</Button>
        </form>

        <p className="mt-5 text-center text-sm text-forest-800/70">
          Pas encore de compte ? <Link href="/inscription" className="font-medium text-forest-900">Créer un compte client</Link>
        </p>

        <p className="mt-6 text-center text-sm text-forest-800/70">
          Retour à l’accueil : <Link href="/" className="font-medium text-forest-900">9boutiques</Link>
        </p>
      </div>
    </main>
  );
}
