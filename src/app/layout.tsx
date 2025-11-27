import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { PusherProvider } from "@/components/providers/PusherProvider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MotherCare+ - Prenatal Tracking System",
  description: "A comprehensive healthcare application for tracking and managing prenatal care",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <PusherProvider>
            {children}
          </PusherProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
