import type { Metadata, Viewport } from "next"
import { Inter, Nunito } from "next/font/google"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { PusherProvider } from "@/components/providers/PusherProvider"
// import { ThemeProvider } from "@/components/theme-provider" // Disabled dark mode
import { Toaster } from "sonner"
import { InstallPrompt } from "@/components/pwa/InstallPrompt"
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const nunito = Nunito({ subsets: ["latin"], variable: '--font-nunito' })

export const viewport: Viewport = {
  themeColor: "#4D9FFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: "PrenatalPlus - Your Pregnancy Journey, Supported Every Step",
  description: "A comprehensive healthcare platform for tracking pregnancy, monitoring health, and staying connected with your care team",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PrenatalPlus",
    // startupImage: [] // We can add these later if we generate them
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "PrenatalPlus",
    title: "PrenatalPlus - Your Pregnancy Journey, Supported Every Step",
    description: "A comprehensive healthcare platform for tracking pregnancy, monitoring health, and staying connected with your care team",
  },
  twitter: {
    card: "summary",
    title: "PrenatalPlus - Your Pregnancy Journey, Supported Every Step",
    description: "A comprehensive healthcare platform for tracking pregnancy, monitoring health, and staying connected with your care team",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${inter.className} ${nunito.variable}`}>
        <SessionProvider>
          <PusherProvider>
            {children}
            <InstallPrompt />
            <ServiceWorkerRegister />
            <Toaster richColors position="top-right" />
          </PusherProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
