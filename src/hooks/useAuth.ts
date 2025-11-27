"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useAuthStore } from "@/store/useAuthStore"

export function useAuth() {
  const { data: session, status } = useSession()
  const { setUser, clearUser, setLoading } = useAuthStore()

  useEffect(() => {
    if (status === "loading") {
      setLoading(true)
      return
    }

    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name,
        role: session.user.role,
      })
    } else {
      clearUser()
    }
  }, [session, status, setUser, clearUser, setLoading])

  return {
    user: useAuthStore((state) => state.user),
    isLoading: useAuthStore((state) => state.isLoading),
    isAuthenticated: !!session?.user,
    session,
  }
}


