"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "@/components/ui/button";

function ResetForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="w-full max-w-md rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-8 text-center shadow-luxe">
        <h1 className="font-display text-3xl text-forest-900">Lien invalide</h1>
        <p className="mt-3 text-sm text-forest-800/70">
          Ce lien de réinitialisation est incomplet. Demandez un nouveau lien pour
          continuer.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/mot-de-passe-oublie">Demander un nouveau lien</Link>
        </Button>
      </div>
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/reinitialiser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Réinitialisation impossible.");
        setLoading(false);
        return;
      }
      // Succès : retour à la connexion avec un message.
      router.push("/login?reset=ok");
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-8 shadow-luxe">
      <p className="badge">Nouveau mot de passe</p>
      <h1 className="mt-6 font-display text-4xl text-forest-900">Réinitialiser</h1>
      <p className="mt-3 text-sm text-forest-800/70">
        Choisissez un nouveau mot de passe pour votre compte.
      </p>

      <form className="mt-8 space-y-5" onSubmit={submit}>
        {error && (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <label className="block text-sm text-forest-800">
          Nouveau mot de passe
          <input
            required
            minLength={8}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="mt-2 w-full rounded-full border border-forest-700/10 bg-white px-4 py-3 outline-none placeholder:text-forest-800/40"
          />
        </label>
        <label className="block text-sm text-forest-800">
          Confirmer le mot de passe
          <input
            required
            minLength={8}
            type="password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            placeholder="••••••••"
            className="mt-2 w-full rounded-full border border-forest-700/10 bg-white px-4 py-3 outline-none placeholder:text-forest-800/40"
          />
        </label>
        <Button className="w-full" disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer le nouveau mot de passe"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-forest-800/70">
        <Link href="/login" className="font-medium text-forest-900">
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-16">
      <Suspense
        fallback={
          <div className="w-full max-w-md animate-pulse rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-8 shadow-luxe">
            <div className="h-8 w-2/3 rounded bg-ivory-200" />
            <div className="mt-6 h-10 rounded-full bg-ivory-200" />
            <div className="mt-4 h-10 rounded-full bg-ivory-200" />
          </div>
        }
      >
        <ResetForm />
      </Suspense>
    </main>
  );
}
