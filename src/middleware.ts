import { auth } from "@/server/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const token = req.auth
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") ||
        req.nextUrl.pathname.startsWith("/register")
    const isDashboardPage = req.nextUrl.pathname === "/dashboard"

    // Redirect authenticated users away from auth pages and /dashboard to their specific dashboard
    // But allow access to the root landing page "/"
    if ((isAuthPage || isDashboardPage) && token) {
        if (token.user.role === "DOCTOR") {
            return NextResponse.redirect(new URL("/doctor/dashboard", req.url))
        } else if (token.user.role === "ADMIN") {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url))
        } else {
            return NextResponse.redirect(new URL("/patient/dashboard", req.url))
        }
    }

    // Protect dashboard routes - ensure users can only access their role-specific sections
    if (req.nextUrl.pathname.startsWith("/patient")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login?role=patient", req.url))
        }
        if (token.user.role !== "PATIENT") {
            // Redirect to their appropriate dashboard
            if (token.user.role === "DOCTOR") {
                return NextResponse.redirect(new URL("/doctor/dashboard", req.url))
            } else if (token.user.role === "ADMIN") {
                return NextResponse.redirect(new URL("/admin/dashboard", req.url))
            }
        }
    }

    if (req.nextUrl.pathname.startsWith("/doctor")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login?role=doctor", req.url))
        }
        if (token.user.role !== "DOCTOR") {
            // Redirect to their appropriate dashboard
            if (token.user.role === "PATIENT") {
                return NextResponse.redirect(new URL("/patient/dashboard", req.url))
            } else if (token.user.role === "ADMIN") {
                return NextResponse.redirect(new URL("/admin/dashboard", req.url))
            }
        }
    }

    if (req.nextUrl.pathname.startsWith("/admin")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login?role=admin", req.url))
        }
        if (token.user.role !== "ADMIN") {
            // Redirect to their appropriate dashboard
            if (token.user.role === "PATIENT") {
                return NextResponse.redirect(new URL("/patient/dashboard", req.url))
            } else if (token.user.role === "DOCTOR") {
                return NextResponse.redirect(new URL("/doctor/dashboard", req.url))
            }
        }
    }

    // If accessing protected route without token
    const isProtected = req.nextUrl.pathname.startsWith("/patient") ||
        req.nextUrl.pathname.startsWith("/doctor") ||
        req.nextUrl.pathname.startsWith("/admin") ||
        req.nextUrl.pathname.startsWith("/dashboard")

    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/patient/:path*",
        "/doctor/:path*",
        "/admin/:path*",
        "/profile/:path*",
        "/appointments/:path*",
        "/vitals/:path*",
        "/reports/:path*",
        "/calendar/:path*",
        "/settings/:path*",
        "/pregnancy/:path*",
        "/login",
        "/register",
        "/",
    ],
}
