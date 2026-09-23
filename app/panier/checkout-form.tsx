"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  MapPin,
  MessageSquare,
  Phone,
  Smartphone,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type CartItem = { id: string; name: string; price: number; quantity: number };

const PAYMENT_METHODS = [
  {
    id: "especes_livraison",
    name: "Espèces à la livraison",
    description: "Réglez directement en liquide lors de la remise en main propre.",
    icon: Banknote,
    badge: "Le plus populaire",
  },
  {
    id: "wave",
    name: "Wave",
    description: "Paiement mobile instantané sans frais via Wave.",
    icon: Smartphone,
    badge: "0% de frais",
  },
  {
    id: "orange_money",
    name: "Orange Money",
    description: "Transfert sécurisé vers notre compte marchand Orange Money.",
    icon: Smartphone,
  },
  {
    id: "mtn_momo",
    name: "MTN Mobile Money",
    description: "Paiement direct et rapide via MTN MoMo.",
    icon: Smartphone,
  },
  {
    id: "whatsapp",
    name: "Commande directe WhatsApp",
    description: "Finalisez votre commande et échangez directement avec le vendeur.",
    icon: MessageSquare,
    badge: "Direct vendeur",
  },
];

export function CheckoutForm({
  items,
  total,
}: {
  items: CartItem[];
  total: number;
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    nomClient: "",
    telephone: "",
    ville: "Abidjan",
    adresse: "",
    notes: "",
    modePaiement: "especes_livraison",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.nomClient.trim() || !form.telephone.trim() || !form.adresse.trim()) {
      setError("Veuillez renseigner votre nom, téléphone et adresse de livraison.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomClient: form.nomClient,
          telephone: form.telephone,
          ville: form.ville,
          adresse: form.adresse,
          notes: form.notes || null,
          modePaiement: form.modePaiement,
          lignes: items.map((item) => ({
            produitId: item.id,
            quantite: item.quantity,
            prixUnitaire: item.price,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de la commande.");
      }

      // Vider le panier
      localStorage.removeItem("9boutiques-cart");
      window.dispatchEvent(new Event("9boutiques-cart-updated"));

      // Si commande WhatsApp
      if (form.modePaiement === "whatsapp") {
        const recap = items.map((i) => `• ${i.name} (x${i.quantity}) : ${(i.price * i.quantity).toLocaleString("fr-FR")} FCFA`).join("\n");
        const msg = encodeURIComponent(
          `Bonjour 9boutiques,\n\nJe confirme ma commande #${data.id.slice(-6).toUpperCase()} :\n${recap}\n\n*Total : ${total.toLocaleString("fr-FR")} FCFA*\n*Nom :* ${form.nomClient}\n*Contact :* ${form.telephone}\n*Livraison :* ${form.adresse} (${form.ville})\n\nMerci !`,
        );
        window.open(`https://wa.me/2250700000000?text=${msg}`, "_blank");
      }

      // Redirection vers la page de confirmation
      router.push(`/panier/confirmation/${data.id}`);
    } catch (err: any) {
      setError(err.message || "Impossible de finaliser la commande.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Coordonnées de livraison */}
      <div className="rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-forest-700/10 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-900 text-ivory-50 text-sm font-semibold">
            1
          </div>
          <div>
            <h2 className="font-display text-xl text-forest-900">Coordonnées de livraison</h2>
            <p className="text-xs text-forest-800/60">Où devons-nous vous livrer votre commande ?</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest-800/70">
              Nom complet *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-700/40" />
              <input
                type="text"
                name="nomClient"
                required
                value={form.nomClient}
                onChange={handleChange}
                placeholder="Ex : Clement Ouattara"
                className="w-full rounded-2xl border border-forest-700/15 bg-white py-3 pl-11 pr-4 text-sm text-forest-900 placeholder:text-forest-800/35 focus:border-forest-700 focus:outline-none focus:ring-1 focus:ring-forest-700"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest-800/70">
              Téléphone (WhatsApp / Appel) *
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-700/40" />
              <input
                type="tel"
                name="telephone"
                required
                value={form.telephone}
                onChange={handleChange}
                placeholder="Ex : +225 07 00 00 00 00"
                className="w-full rounded-2xl border border-forest-700/15 bg-white py-3 pl-11 pr-4 text-sm text-forest-900 placeholder:text-forest-800/35 focus:border-forest-700 focus:outline-none focus:ring-1 focus:ring-forest-700"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest-800/70">
              Ville ou Commune *
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-700/40" />
              <input
                type="text"
                name="ville"
                required
                value={form.ville}
                onChange={handleChange}
                placeholder="Ex : Abidjan - Cocody, Marcory..."
                className="w-full rounded-2xl border border-forest-700/15 bg-white py-3 pl-11 pr-4 text-sm text-forest-900 placeholder:text-forest-800/35 focus:border-forest-700 focus:outline-none focus:ring-1 focus:ring-forest-700"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest-800/70">
              Adresse précise ou repère de livraison *
            </label>
            <input
              type="text"
              name="adresse"
              required
              value={form.adresse}
              onChange={handleChange}
              placeholder="Ex : Angré 8ème tranche, face à la pharmacie..."
              className="w-full rounded-2xl border border-forest-700/15 bg-white px-4 py-3 text-sm text-forest-900 placeholder:text-forest-800/35 focus:border-forest-700 focus:outline-none focus:ring-1 focus:ring-forest-700"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-forest-800/70">
              Instructions pour le livreur (optionnel)
            </label>
            <textarea
              name="notes"
              rows={2}
              value={form.notes}
              onChange={handleChange}
              placeholder="Ex : Appeler avant d’arriver, sonner au portail..."
              className="w-full rounded-2xl border border-forest-700/15 bg-white px-4 py-3 text-sm text-forest-900 placeholder:text-forest-800/35 focus:border-forest-700 focus:outline-none focus:ring-1 focus:ring-forest-700"
            />
          </div>
        </div>
      </div>

      {/* 2. Mode de paiement */}
      <div className="rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-forest-700/10 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-900 text-ivory-50 text-sm font-semibold">
            2
          </div>
          <div>
            <h2 className="font-display text-xl text-forest-900">Mode de paiement</h2>
            <p className="text-xs text-forest-800/60">Choisissez comment vous souhaitez régler vos achats</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {PAYMENT_METHODS.map((method) => {
            const Icon = method.icon;
            const isSelected = form.modePaiement === method.id;

            return (
              <label
                key={method.id}
                className={`relative flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
                  isSelected
                    ? "border-forest-700 bg-forest-50/70 shadow-sm"
                    : "border-forest-700/15 bg-white hover:border-forest-700/35"
                }`}
              >
                <input
                  type="radio"
                  name="modePaiement"
                  value={method.id}
                  checked={isSelected}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 border-forest-700 text-forest-800 focus:ring-forest-700"
                />

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-forest-900 text-sm sm:text-base">
                      {method.name}
                    </span>
                    {method.badge && (
                      <span className="rounded-full bg-forest-100 px-2.5 py-0.5 text-[10px] font-semibold text-forest-800">
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-forest-800/65">{method.description}</p>
                </div>

                <Icon className={`h-5 w-5 shrink-0 ${isSelected ? "text-forest-700" : "text-forest-800/40"}`} />
              </label>
            );
          })}
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Bouton de confirmation */}
      <Button
        type="submit"
        disabled={loading}
        className="h-14 w-full rounded-2xl bg-forest-900 text-base font-medium text-ivory-50 shadow-luxe hover:bg-forest-800"
      >
        {loading ? (
          <>
            <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
            Validation de votre commande...
          </>
        ) : form.modePaiement === "whatsapp" ? (
          <>
            <MessageSquare className="mr-2 h-5 w-5" />
            Commander sur WhatsApp ({total.toLocaleString("fr-FR")} FCFA)
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Confirmer la commande ({total.toLocaleString("fr-FR")} FCFA)
          </>
        )}
      </Button>

      <p className="text-center text-xs text-forest-800/50">
        Vos données de commande sont sécurisées. Vous recevrez une confirmation et un contact direct pour le suivi.
      </p>
    </form>
  );
}
