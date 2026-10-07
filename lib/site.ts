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
  slogan: "Élégance au quotidien",

  // Identité affichée dans l'espace d'administration
  adminNom: "9boutiques",
  adminInitiales: "9B",

  // Numéro WhatsApp au format INTERNATIONAL, sans "+" ni espaces.
  whatsapp: "2250709525031",
  // Même numéro, format lisible pour l'affichage
  whatsappAffiche: "+225 07 09 52 50 31",

  // Numéros AFFICHÉS aux clients pour chaque moyen de paiement.
  // Laisse une chaîne VIDE ("") pour masquer un moyen de paiement
  // tant que tu n'as pas de numéro marchand pour celui-ci.
  paiement: {
    wave: "+225 07 09 52 50 31",
    orangeMoney: "+225 07 09 52 50 31",
    mtnMomo: "", // pas encore de numéro MTN fourni -> option masquée
  },
} as const;

// Construit un lien WhatsApp cliquable avec un message pré-rempli.
// `message` doit être du texte brut (il est encodé automatiquement).
export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}
