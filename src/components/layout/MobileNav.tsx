"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Calendar,
    Heart,
    FileText,
    User,
    Baby,
    Activity,
    BookOpen,
    MessageSquare,
    Users,
    ClipboardList,
    Settings
} from "lucide-react"

const patientNavItems = [
    { name: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
    { name: "Health", href: "/patient/health", icon: Activity },
    { name: "Appointments", href: "/patient/appointments", icon: Calendar },
    { name: "Chat", href: "/patient/chat", icon: MessageSquare },
    { name: "Profile", href: "/profile", icon: User },
]

const doctorNavItems = [
    { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
    { name: "Patients", href: "/doctor/patients", icon: Users },
    { name: "Appointments", href: "/doctor/appointments", icon: Calendar },
    { name: "Messages", href: "/doctor/chat", icon: MessageSquare },
    { name: "Profile", href: "/profile", icon: User },
]

export function MobileNav() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const role = session?.user?.role

    const navItems = role === "DOCTOR" ? doctorNavItems : patientNavItems

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
            <nav className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                                isActive
                                    ? "text-pink-600"
                                    : "text-gray-600 hover:text-pink-500"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive && "text-pink-600")} />
                            <span className="text-xs font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
