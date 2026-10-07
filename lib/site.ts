// ============================================================
//  CONFIGURATION DE LA BOUTIQUE
//  ------------------------------------------------------------
//  Modifie UNIQUEMENT les valeurs ci-dessous.
//  Tout le site (panier, confirmation, WhatsApp, admin)
//  utilise ce fichier : pas besoin de chercher ailleurs.
// ============================================================

export const SITE = {
  // Nom de la boutique, affiché dans l'en-tête et les messages
  nom: "9boutiques",

  // Identité affichée dans l'espace d'administration
  adminNom: "ZOKOU", // ← À REMPLACER par ton nom ou celui du gérant
  adminInitiales: "ZK", // ← À REMPLACER (2 lettres, ex: "CO")

  // Numéro WhatsApp au format INTERNATIONAL, sans "+" ni espaces.
  // Exemple : 225 07 01 02 03 04  ->  "2250701020304"
  whatsapp: "2250700000000", // ← À REMPLACER par ton vrai numéro WhatsApp

  // Numéros AFFICHÉS aux clients pour chaque moyen de paiement
  // (format lisible, avec le +225). Remplace par tes vrais numéros marchands.
  paiement: {
    wave: "+225 07 00 00 00 00", // ← À REMPLACER
    orangeMoney: "+225 07 00 00 00 00", // ← À REMPLACER
    mtnMomo: "+225 05 00 00 00 00", // ← À REMPLACER
  },
} as const;

// Construit un lien WhatsApp cliquable avec un message pré-rempli.
// `message` doit être du texte brut (il est encodé automatiquement).
export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}
