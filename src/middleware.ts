import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "./lib/auth"

export default async function middleware(request: NextRequest) {
    const session = await auth()
    const { pathname } = request.nextUrl

    // Check if accessing admin routes (except login)
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        if (!session?.user) {
            // Redirect to admin login
            return NextResponse.redirect(new URL("/admin/login", request.url))
        }
    }

    // If logged in and trying to access login page, redirect to admin
    if (pathname === "/admin/login" && session?.user) {
        return NextResponse.redirect(new URL("/admin", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*"],
}
