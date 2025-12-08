"use client"

import { LoginForm } from "@/components/features/auth/LoginForm"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { UserRole } from "@prisma/client"
import { Baby, Shield } from "lucide-react"

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
            title: "Welcome Back",
            subtitle: "Access your prenatal journey anytime.",
            color: "#4D9FFF",
            registerLink: "/register?role=patient",
            expectedRole: "PATIENT" as UserRole
        },
        doctor: {
            title: "Welcome Back",
            subtitle: "Access your clinical dashboard.",
            color: "#A1E4C1",
            registerLink: "/register?role=doctor",
            expectedRole: "DOCTOR" as UserRole
        },
        admin: {
            title: "Welcome Back",
            subtitle: "Access system management.",
            color: "#9F8CFF",
            registerLink: "/register?role=admin",
            expectedRole: "ADMIN" as UserRole
        }
    }

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.patient

    const showRegisterLink = role !== "admin" || allowAdminRegister

    return (
        <div className="flex min-h-screen items-center justify-center relative overflow-hidden p-4 bg-gradient-to-br from-[#FFE4EC] via-white to-[#EAF3FF]">
            {/* Soft decorative background shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-healthcare-pink/10 blur-3xl animate-pulse duration-[8s]"></div>
                <div className="absolute bottom-[15%] right-[8%] w-[350px] h-[350px] rounded-full bg-healthcare-blue/10 blur-3xl animate-pulse duration-[10s]"></div>
                <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] rounded-full bg-healthcare-lavender/10 blur-3xl animate-pulse duration-[12s]"></div>
            </div>

            <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Side - Illustration */}
                <div className="hidden md:flex flex-col items-center justify-center space-y-6 animate-in fade-in slide-in-from-left duration-1000">
                    {/* Pregnant Mother Silhouette - Using SVG */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-healthcare-pink/20 to-healthcare-blue/20 rounded-full blur-3xl"></div>
                        <svg className="w-80 h-80 relative z-10" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Mother silhouette */}
                            <circle cx="100" cy="60" r="25" fill="url(#gradient1)" opacity="0.8" />
                            <ellipse cx="100" cy="120" rx="35" ry="45" fill="url(#gradient1)" opacity="0.8" />
                            <circle cx="100" cy="130" r="28" fill="url(#gradient2)" opacity="0.9" />
                            <path d="M 70 100 Q 65 120 70 140 L 80 145 L 75 165 L 85 165 L 90 145 Z" fill="url(#gradient1)" opacity="0.8" />
                            <path d="M 130 100 Q 135 120 130 140 L 120 145 L 125 165 L 115 165 L 110 145 Z" fill="url(#gradient1)" opacity="0.8" />

                            {/* Heart symbol */}
                            <path d="M 100 135 L 95 130 Q 90 125 90 120 Q 90 115 95 115 Q 100 115 100 120 Q 100 115 105 115 Q 110 115 110 120 Q 110 125 105 130 Z" fill="#FFB7D1" />

                            <defs>
                                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#4D9FFF" stopOpacity="0.6" />
                                    <stop offset="100%" stopColor="#9F8CFF" stopOpacity="0.6" />
                                </linearGradient>
                                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#FFB7D1" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#A1E4C1" stopOpacity="0.5" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-heading font-bold text-healthcare-text-primary">Your Care, Our Priority</h3>
                        <p className="text-healthcare-text-secondary max-w-sm">Supporting mothers through every step of their pregnancy journey with compassionate, data-driven care.</p>
                    </div>
                </div>

                {/* Right Side - Login Card */}
                <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-right duration-1000">
                    {/* Glassmorphic Card */}
                    <div className="bg-white/75 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60 p-10 space-y-6 hover:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.15)] transition-all duration-500">
                        {/* Branding */}
                        <div className="text-center space-y-4">
                            <Link href="/" className="inline-flex items-center gap-3 mb-2 hover:opacity-80 transition-opacity group">
                                <div className="h-12 w-12 bg-gradient-to-br from-healthcare-blue to-healthcare-lavender rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200/50 group-hover:scale-110 transition-transform">
                                    P+
                                </div>
                                <h1 className="text-3xl font-heading font-bold tracking-tight text-healthcare-text-primary">
                                    PrenatalPlus
                                </h1>
                            </Link>
                            <div>
                                <h2 className="text-2xl font-heading font-bold text-healthcare-text-primary">{config.title}</h2>
                                <p className="text-sm text-healthcare-text-secondary mt-2">{config.subtitle}</p>
                            </div>
                        </div>

                        {/* Login Form */}
                        <LoginForm expectedRole={config.expectedRole} />

                        {/* Trust Badge */}
                        <div className="flex items-center justify-center gap-2 text-xs text-healthcare-text-secondary bg-healthcare-cream/50 rounded-full px-4 py-2">
                            <Shield className="h-3.5 w-3.5 text-healthcare-mint" />
                            <span>Your information is securely encrypted</span>
                        </div>

                        {/* Register Link */}
                        <div className="text-center text-sm text-healthcare-text-secondary">
                            {showRegisterLink ? (
                                <>
                                    Don't have an account?{" "}
                                    <Link href={config.registerLink} style={{ color: config.color }} className="hover:opacity-80 font-semibold hover:underline transition-all">
                                        Sign up
                                    </Link>
                                </>
                            ) : (
                                <Link href="/" className="text-healthcare-blue hover:text-blue-600 font-semibold hover:underline transition-colors">
                                    ← Back to home
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="flex items-center justify-center gap-6 text-xs text-healthcare-text-secondary">
                        <Link href="#" className="hover:text-healthcare-blue transition-colors">Terms</Link>
                        <span>•</span>
                        <Link href="#" className="hover:text-healthcare-blue transition-colors">Privacy</Link>
                        <span>•</span>
                        <Link href="#" className="hover:text-healthcare-blue transition-colors">Support</Link>
                        <span>•</span>
                        <Link href="#" className="hover:text-healthcare-blue transition-colors">Contact</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
