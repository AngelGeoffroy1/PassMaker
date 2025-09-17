import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PassMaker - Générateur de Bracelets Événementiels",
  description: "Créez des bracelets événementiels professionnels en quelques clics. Parfait pour vos soirées étudiantes, festivals et événements. Génération IA, export PNG/PDF, prêt impression.",
  keywords: ["bracelet", "événementiel", "soirée étudiante", "festival", "impression", "Tyvek", "IA"],
  authors: [{ name: "PassMaker Team" }],
  creator: "PassMaker",
  publisher: "PassMaker",
  robots: "index, follow"
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#3b82f6'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
