"use client"

import { AuthGuard } from "@/components/features/auth/AuthGuard"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { Footer } from "@/components/layout/Footer"
import { Toaster } from "@/components/ui/toaster"
import { usePusher } from "@/hooks/usePusher"
import { ErrorBoundary } from "@/components/error-boundary"

function DashboardContent({ children }: { children: React.ReactNode }) {
  // Initialize Pusher for real-time updates
  usePusher()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        {/* Desktop Sidebar - Hidden on mobile */}
        <aside className="hidden lg:block">
          <Sidebar />
        </aside>
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      <Footer />
      <Toaster />
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <AuthGuard>
        <DashboardContent>{children}</DashboardContent>
      </AuthGuard>
    </ErrorBoundary>
  )
}
