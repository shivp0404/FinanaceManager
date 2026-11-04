import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

import {
    generateAccessToken,
    verifyRefreshToken
} from "@/lib/token"

import findUser from "@/app/services/finduser"

export async function GET(request: NextRequest) {

    const cookieStore = await cookies()

    const refreshToken = cookieStore.get("refreshToken")?.value

    const next = request.nextUrl.searchParams.get("next") || "/dashboard"

    // Prevent external redirects
    const safeNext =
        next.startsWith("/") && !next.startsWith("//")
            ? next
            : "/dashboard"

    const loginUrl = new URL("/login", request.url)

    if (!refreshToken) {
        const response = NextResponse.redirect(loginUrl)

        response.cookies.delete("accessToken")
        response.cookies.delete("refreshToken")

        return response
    }

    const payload = verifyRefreshToken(refreshToken)

    if (!payload) {
        const response = NextResponse.redirect(loginUrl)

        response.cookies.delete("accessToken")
        response.cookies.delete("refreshToken")

        return response
    }

    const user = await findUser(payload.email)

    if (!user || String(user.id) !== payload.sub) {
        const response = NextResponse.redirect(loginUrl)

        response.cookies.delete("accessToken")
        response.cookies.delete("refreshToken")

        return response
    }

    // Generate a new access token
    const newAccessToken = generateAccessToken({
        id: user.id,
        email: user.email
    })

    const response = NextResponse.redirect(
        new URL(safeNext, request.url)
    )

    response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60
    })

    return response
}