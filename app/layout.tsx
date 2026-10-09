import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "9boutiques | Mode élégante à Bouaké",
  description:
    "Maison de mode à Bouaké. Jeans, shorts et pièces sélectionnées à la main. Commandez sur WhatsApp, payez par Wave, Orange Money ou à la livraison.",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0d231b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
