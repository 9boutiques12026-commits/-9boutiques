"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type Unavailable = { message: string; whatsapp: string; whatsappUrl: string };

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [devLink, setDevLink] = useState("");
  const [unavailable, setUnavailable] = useState<Unavailable | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setDevLink("");
    setUnavailable(null);
    setLoading(true);
    try {
      const response = await fetch("/api/mot-de-passe-oublie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Impossible de traiter la demande.");
      } else if (data.emailUnavailable) {
        setUnavailable({
          message: data.message,
          whatsapp: data.whatsapp,
          whatsappUrl: data.whatsappUrl,
        });
      } else {
        setSuccess(
          data.message ||
            "Si un compte existe avec cette adresse, un email de réinitialisation vient d'être envoyé.",
        );
        if (data.devResetUrl) setDevLink(data.devResetUrl);
      }
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    }
    setLoading(false);
  }

  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-8 shadow-luxe">
        <p className="badge">Réinitialisation</p>
        <h1 className="mt-6 font-display text-4xl text-forest-900">Mot de passe oublié</h1>
        <p className="mt-3 text-sm text-forest-800/70">
          Saisissez l&apos;email de votre compte. Nous vous enverrons un lien pour
          créer un nouveau mot de passe.
        </p>

        <form className="mt-8 space-y-5" onSubmit={submit}>
          {error && (
            <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
          {success && (
            <p role="status" className="rounded-2xl bg-forest-50 px-4 py-3 text-sm text-forest-800">
              {success}
            </p>
          )}
          <label className="block text-sm text-forest-800">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="votre@email.com"
              className="mt-2 w-full rounded-full border border-forest-700/10 bg-white px-4 py-3 outline-none placeholder:text-forest-800/40"
            />
          </label>
          <Button className="w-full" disabled={loading}>
            {loading ? "Envoi en cours..." : "Envoyer le lien"}
          </Button>
        </form>

        {unavailable && (
          <div className="mt-5 rounded-2xl border border-gold-500/40 bg-gold-500/5 px-4 py-4 text-sm text-forest-800">
            <p className="font-semibold text-forest-900">Réinitialisation par email indisponible</p>
            <p className="mt-1 leading-6 text-forest-800/80">{unavailable.message}</p>
            <a
              href={unavailable.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-forest-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ivory-50 transition hover:bg-gold-500"
            >
              <MessageCircle className="h-4 w-4" /> Écrire sur WhatsApp · {unavailable.whatsapp}
            </a>
          </div>
        )}

        {devLink && (
          <div className="mt-5 rounded-2xl border border-gold-500/40 bg-gold-500/5 px-4 py-3 text-xs text-forest-800">
            <p className="font-semibold text-forest-900">Mode local (SMTP non configuré)</p>
            <p className="mt-1 text-forest-800/70">
              Aucun email n&apos;est parti. Ouvrez ce lien pour tester la réinitialisation :
            </p>
            <a href={devLink} className="mt-2 block break-all font-medium text-forest-900 underline underline-offset-2">
              {devLink}
            </a>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-forest-800/70">
          <Link href="/login" className="font-medium text-forest-900">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </main>
  );
}
