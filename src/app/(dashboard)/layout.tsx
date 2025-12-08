"use client"

import { AuthGuard } from "@/components/features/auth/AuthGuard"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { Footer } from "@/components/layout/Footer"
import { Toaster } from "@/components/ui/toaster"
import { usePusher } from "@/hooks/usePusher"
import { ErrorBoundary } from "@/components/error-boundary"

import { MobileNav } from "@/components/layout/MobileNav"
import { MedicationReminderManager } from "@/components/medications/MedicationReminderManager"

function DashboardContent({ children }: { children: React.ReactNode }) {
  // Initialize Pusher for real-time updates
  usePusher()

  return (
    <div className="min-h-screen flex flex-col">
      <MedicationReminderManager />
      <Header />
      <div className="flex flex-1">
        {/* Sidebar - Hidden on mobile, visible on tablet+ */}
        <aside className="hidden md:block w-64 shrink-0">
          <Sidebar />
        </aside>
        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>
      <MobileNav />
      <div className="hidden md:block">
        <Footer />
      </div>
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
