"use client"

import { RegisterForm } from "@/components/features/auth/RegisterForm"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function RegisterContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "patient"

  const roleConfig = {
    patient: {
      title: "Create Patient Account",
      subtitle: "Sign up to start tracking your prenatal care",
      color: "#3B82F6",
      loginLink: "/login?role=patient"
    },
    doctor: {
      title: "Create Doctor Account",
      subtitle: "Join as a healthcare provider",
      color: "#4FBAA7",
      loginLink: "/login?role=doctor"
    },
    admin: {
      title: "Create Admin Account",
      subtitle: "System administrator registration",
      color: "#6B7280",
      loginLink: "/login?role=admin"
    }
  }

  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.patient

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] relative overflow-hidden p-4 py-12">
      {/* Subtle decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#E0E8FF]/40 blur-3xl"></div>
        <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/30 blur-3xl"></div>
      </div>

      <div className="w-full max-w-lg space-y-6 relative z-10">
        <div className="text-center">
          <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              PrenatalCare<span style={{ color: config.color }}>+</span>
            </h1>
          </Link>
          <h2 className="text-xl font-semibold text-gray-900">{config.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{config.subtitle}</p>
        </div>

        <RegisterForm role={role} />

        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href={config.loginLink} style={{ color: config.color }} className="hover:opacity-80 font-medium hover:underline transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6] mx-auto"></div>
        </div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
