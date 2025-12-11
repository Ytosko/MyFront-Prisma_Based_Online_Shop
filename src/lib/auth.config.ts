import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/admin/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnAdmin = nextUrl.pathname.startsWith('/admin')
            const isOnAdminLogin = nextUrl.pathname === '/admin/login'

            // Allow access to login page even when not logged in
            if (isOnAdminLogin) {
                if (isLoggedIn) {
                    // Redirect logged in users away from login page
                    return Response.redirect(new URL('/admin', nextUrl))
                }
                return true
            }

            if (isOnAdmin) {
                if (isLoggedIn) return true
                return false // Redirect to login
            }
            return true
        },
        // Add session callback to expose ID and Role
        session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub
                // @ts-ignore
                session.user.role = token.role as string
            }
            return session
        },
        jwt({ token, user }) {
            if (user) {
                // @ts-ignore
                token.role = user.role
            }
            return token
        }
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
