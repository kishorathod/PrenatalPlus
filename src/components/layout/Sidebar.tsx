"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import {
  LayoutDashboard,
  Calendar,
  Heart,
  FileText,
  Settings,
  User,
  Baby,
  Users,
  Stethoscope,
  Building2,
  Activity,
  ClipboardList,
  MessageSquare,
  Timer,
  Pill,
  Shield,
} from "lucide-react"

const patientNavigation = [
  {
    name: "Dashboard",
    href: "/patient/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Pregnancy",
    href: "/pregnancy",
    icon: Baby,
  },
  {
    name: "Chat",
    href: "/patient/chat",
    icon: MessageSquare,
  },
  {
    name: "Appointments",
    href: "/patient/appointments",
    icon: Calendar,
  },
  {
    name: "Health Analytics",
    href: "/patient/health",
    icon: Activity,
  },
  {
    name: "Kick Counter",
    href: "/patient/kick-counter",
    icon: Baby,
  },
  {
    name: "Contraction Timer",
    href: "/patient/contraction-timer",
    icon: Timer,
  },
  {
    name: "Medications",
    href: "/patient/medications",
    icon: Pill,
  },
  {
    name: "Vitals",
    href: "/vitals",
    icon: Heart,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    name: "Privacy",
    href: "/patient/privacy",
    icon: Shield,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

const doctorNavigation = [
  {
    name: "Dashboard",
    href: "/doctor/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Patients",
    href: "/doctor/patients",
    icon: Users,
  },
  {
    name: "Appointments",
    href: "/doctor/appointments",
    icon: Calendar,
  },
  {
    name: "Messages",
    href: "/doctor/chat",
    icon: MessageSquare,
  },
  {
    name: "Medical Notes",
    href: "/doctor/notes",
    icon: ClipboardList,
  },
  {
    name: "Vitals History",
    href: "/doctor/vitals",
    icon: Activity,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

const adminNavigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Doctors",
    href: "/admin/doctors",
    icon: Stethoscope,
  },
  {
    name: "Patients",
    href: "/admin/patients",
    icon: Users,
  },
  {
    name: "Departments",
    href: "/admin/departments",
    icon: Building2,
  },
  {
    name: "Logs",
    href: "/admin/logs",
    icon: FileText,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role

  let navigation = patientNavigation

  if (role === "DOCTOR") {
    navigation = doctorNavigation
  } else if (role === "ADMIN") {
    navigation = adminNavigation
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background transition-colors duration-300">
      <div className="flex h-16 items-center border-b px-6">
        <Link href={role === "DOCTOR" ? "/doctor/dashboard" : role === "ADMIN" ? "/admin/dashboard" : "/patient/dashboard"} className="flex items-center space-x-2">
          <span className="text-xl font-bold">PrenatalPlus</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-pink-50 text-pink-700 relative pl-4 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-pink-500 before:rounded-r-lg shadow-sm"
                  : "text-muted-foreground hover:bg-pink-50 hover:text-pink-600"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-transform duration-200 group-hover:scale-110", isActive ? "text-pink-600" : "text-gray-400 group-hover:text-pink-500")} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
