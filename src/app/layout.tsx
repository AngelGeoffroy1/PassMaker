import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PassMaker - Créez vos bracelets personnalisés avec l'IA",
  description: "Créez des bracelets personnalisés uniques pour vos événements avec l'aide de l'intelligence artificielle. Design, génération et livraison rapide.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  )
} 