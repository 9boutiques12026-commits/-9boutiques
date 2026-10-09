import Link from "next/link";
import { MapPin, MessageCircle, ShieldCheck } from "lucide-react";

import { LogoMark } from "@/components/shared/logo";
import { SITE, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-forest-900/10 bg-forest-900 text-ivory-100">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-14 md:grid-cols-2 md:px-8 lg:grid-cols-4">
        {/* Marque */}
        <div>
          <div className="flex items-center gap-3">
            <LogoMark size={40} />
            <span className="font-display text-xl tracking-[-0.03em] text-ivory-50">9boutiques</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-ivory-100/60">
            Maison de mode à Bouaké. Des pièces sélectionnées à la main, commandées
            simplement et payées comme vous le souhaitez.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-400">Boutique</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory-100/70">
            <li><Link href="/" className="transition hover:text-gold-400">Accueil</Link></li>
            <li><Link href="/boutiques" className="transition hover:text-gold-400">Collection</Link></li>
            <li><Link href="/panier" className="transition hover:text-gold-400">Mon panier</Link></li>
            <li><Link href="/compte" className="transition hover:text-gold-400">Mon compte</Link></li>
          </ul>
        </div>

        {/* Aide */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-400">Aide &amp; confiance</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory-100/70">
            <li>
              <a href={whatsappLink("Bonjour 9boutiques, j'ai une question.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-gold-400">
                <MessageCircle className="h-4 w-4" /> Nous contacter
              </a>
            </li>
            <li>
              <Link href="/politique-de-confidentialite" className="inline-flex items-center gap-2 transition hover:text-gold-400">
                <ShieldCheck className="h-4 w-4" /> Politique de confidentialité
              </Link>
            </li>
            <li><Link href="/login" className="transition hover:text-gold-400">Se connecter</Link></li>
          </ul>
        </div>

        {/* Coordonnées */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-400">Nous trouver</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory-100/70">
            <li className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{SITE.ville} · {SITE.situation}, Côte d'Ivoire</span>
            </li>
            <li>
              <a href={whatsappLink("Bonjour 9boutiques !")} target="_blank" rel="noopener noreferrer" className="transition hover:text-gold-400">
                WhatsApp : {SITE.whatsappAffiche}
              </a>
            </li>
            <li className="text-ivory-100/50">Paiement Wave · Orange Money · Espèces</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory-100/10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-ivory-100/50 sm:flex-row md:px-8">
          <p>© {new Date().getFullYear()} 9boutiques. Tous droits réservés.</p>
          <Link href="/politique-de-confidentialite" className="transition hover:text-gold-400">
            Politique de confidentialité
          </Link>
        </div>
      </div>
    </footer>
  );
}
