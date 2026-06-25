import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/providers/WagmiProvider"
import { AccessProvider } from "@/providers/AccessContext"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Lays Dapps Hub — Ritual Community Directory",
  description: "Community-run directory of dApps, tools, and games built around the Ritual AI/crypto ecosystem.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <AccessProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </AccessProvider>
        </Providers>
      </body>
    </html>
  )
}
