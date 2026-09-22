export type Role = "client" | "admin" | "developer";
export type OrderStatus =
  | "en_attente"
  | "confirme"
  | "expedie"
  | "livre"
  | "annule";

export interface BoutiqueRecord {
  id: string;
  nom: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  createdAt: string;
}

export interface ProduitRecord {
  id: string;
  nom: string;
  slug: string;
  description?: string | null;
  prix: number;
  stock: number;
  boutiqueId: string;
  createdAt: string;
}

export interface ImageProduitRecord {
  id: string;
  produitId: string;
  url: string;
  ordre: number;
}

export interface UtilisateurRecord {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface CommandeRecord {
  id: string;
  utilisateurId: string;
  statut: OrderStatus;
  total: number;
  createdAt: string;
}
