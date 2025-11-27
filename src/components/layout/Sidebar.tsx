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
  CalendarDays,
  Settings,
  User,
  Baby,
  Users,
  Stethoscope,
  Building2,
  Activity,
  ClipboardList,
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
    name: "Appointments",
    href: "/appointments",
    icon: Calendar,
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
    name: "Calendar",
    href: "/calendar",
    icon: CalendarDays,
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
    <div className="flex h-full w-64 flex-col border-r bg-background">
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
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
