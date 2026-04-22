import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digidesign — Générateur d'images Digiforma",
  description: "Génération d'images selon la charte graphique Digiforma · Nano Banana 2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
