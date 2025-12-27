import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role
                token.isVerified = (user as any).isVerified
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = (token.id as string) || (token.sub as string)
                session.user.role = token.role as any
                session.user.isVerified = token.isVerified as boolean
            }
            return session
        },
        async redirect({ baseUrl }) {
            // allows stopping redirect loops
            return baseUrl
        },
    },
    providers: [], // Providers added in full auth.ts for Node runtime
    secret: process.env.NEXTAUTH_SECRET,
    trustHost: true,
} satisfies NextAuthConfig
