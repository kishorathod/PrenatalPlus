import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error("❌ NEXTAUTH_SECRET is not set in environment variables")
  throw new Error("NEXTAUTH_SECRET environment variable is not set")
}

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set in environment variables")
  console.warn("⚠️  Database operations will fail. Make sure .env.local exists with DATABASE_URL")
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
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
              email: credentials.email,
            },
          })

          if (!user || !user.password) {
            throw new Error("Invalid email or password")
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            throw new Error("Invalid email or password")
          }

          // Validate role if expectedRole is provided
          if (credentials.expectedRole && user.role !== credentials.expectedRole) {
            const roleNames: Record<string, string> = {
              'PATIENT': 'patients',
              'DOCTOR': 'doctors',
              'ADMIN': 'administrators'
            }
            const expectedRoleName = roleNames[credentials.expectedRole] || credentials.expectedRole.toLowerCase()
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions)

