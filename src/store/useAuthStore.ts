import { create } from "zustand"
import { UserRole } from "@prisma/client"

interface AuthState {
  user: {
    id: string
    email: string
    name: string | null
    role: UserRole
  } | null
  isLoading: boolean
  setUser: (user: AuthState["user"]) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  clearUser: () => set({ user: null, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}))


