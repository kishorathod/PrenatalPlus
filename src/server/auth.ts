import NextAuth, { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"
import { authConfig } from "./auth.config"

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error("❌ NEXTAUTH_SECRET is not set in environment variables")
  throw new Error("NEXTAUTH_SECRET environment variable is not set")
}

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set in environment variables")
  console.warn("⚠️  Database operations will fail. Make sure .env.local exists with DATABASE_URL")
}

export const authOptions: NextAuthConfig = {
  ...authConfig,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        expectedRole: { label: "Expected Role", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required")
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string,
            },
          })

          if (!user || !user.password) {
            throw new Error("Invalid email or password")
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordValid) {
            throw new Error("Invalid email or password")
          }

          // Validate role if expectedRole is provided
          if (credentials.expectedRole && user.role !== (credentials.expectedRole as string)) {
            const roleNames: Record<string, string> = {
              'PATIENT': 'patients',
              'DOCTOR': 'doctors',
              'ADMIN': 'administrators'
            }
            const expectedRoleName = roleNames[credentials.expectedRole as string] || (credentials.expectedRole as string).toLowerCase()
            throw new Error(`This login page is for ${expectedRoleName} only. Please use the correct login page.`)
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("Authorization error:", error)
          throw error
        }
      },
    }),
  ],
}

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions)

