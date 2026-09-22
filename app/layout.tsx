import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "9boutiques | Mode élégante",
  description: "Marketplace mode haut de gamme avec neuf boutiques indépendantes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
