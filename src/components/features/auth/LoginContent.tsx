"use client"

import { LoginForm } from "@/components/features/auth/LoginForm"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { UserRole } from "@prisma/client"

interface LoginContentProps {
    allowAdminRegister: boolean
    fixedRole?: UserRole  // If provided, this role is enforced and query params are ignored
}

export function LoginContent({ allowAdminRegister, fixedRole }: LoginContentProps) {
    const searchParams = useSearchParams()
    // Use fixedRole if provided, otherwise fall back to query param
    const roleParam = searchParams.get("role") || "patient"
    const role = fixedRole ? fixedRole.toLowerCase() : roleParam

    const roleConfig = {
        patient: {
            title: "Patient Login",
            subtitle: "Access your prenatal care dashboard",
            color: "#3B82F6",
            registerLink: "/register?role=patient",
            expectedRole: "PATIENT" as UserRole
        },
        doctor: {
            title: "Doctor Login",
            subtitle: "Access your clinical dashboard",
            color: "#4FBAA7",
            registerLink: "/register?role=doctor",
            expectedRole: "DOCTOR" as UserRole
        },
        admin: {
            title: "Admin Login",
            subtitle: "Access system management",
            color: "#6B7280",
            registerLink: "/register?role=admin",
            expectedRole: "ADMIN" as UserRole
        }
    }

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.patient

    const showRegisterLink = role !== "admin" || allowAdminRegister

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] relative overflow-hidden p-4">
            {/* Subtle decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#E0E8FF]/40 blur-3xl"></div>
                <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/30 blur-3xl"></div>
            </div>

            <div className="w-full max-w-md space-y-6 relative z-10">
                <div className="text-center">
                    <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            PrenatalCare<span style={{ color: config.color }}>+</span>
                        </h1>
                    </Link>
                    <h2 className="text-xl font-semibold text-gray-900">{config.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{config.subtitle}</p>
                </div>

                <LoginForm expectedRole={config.expectedRole} />

                <div className="text-center text-sm text-gray-600">
                    {showRegisterLink ? (
                        <>
                            Don't have an account?{" "}
                            <Link href={config.registerLink} style={{ color: config.color }} className="hover:opacity-80 font-medium hover:underline transition-colors">
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <Link href="/" className="text-[#3B82F6] hover:text-[#2563EB] font-medium hover:underline transition-colors">
                            ← Back to home
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
