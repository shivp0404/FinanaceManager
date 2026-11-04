import jwt, { JwtPayload } from "jsonwebtoken"

interface AccessTokenPayload extends JwtPayload {
    sub: string
    email: string
}

interface RefreshTokenPayload extends JwtPayload {
    sub: string
    email: string
}

function getAccessSecret() {
    const secret = process.env.ACCESS_TOKEN_SECRET

    if (!secret) {
        throw new Error("ACCESS_TOKEN_SECRET is missing")
    }

    return secret
}

function getRefreshSecret() {
    const secret = process.env.REFRESH_TOKEN_SECRET

    if (!secret) {
        throw new Error("REFRESH_TOKEN_SECRET is missing")
    }

    return secret
}

export function generateAccessToken(user: {
    id: number | string
    email: string
}) {
    return jwt.sign(
        {
            sub: String(user.id),
            email: user.email
        },
        getAccessSecret(),
        { expiresIn: "15m" }
    )
}

export function generateRefreshToken(user: {
    id: number | string
    email: string
}) {
    return jwt.sign(
        {
            sub: String(user.id),
            email: user.email
        },
        getRefreshSecret(),
        { expiresIn: "7d" }
    )
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
    try {
        const decoded = jwt.verify(token, getAccessSecret())

        if (
            typeof decoded === "string" ||
            typeof decoded.sub !== "string" ||
            typeof decoded.email !== "string"
        ) {
            return null
        }

        return decoded as AccessTokenPayload
    } catch {
        return null
    }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
        const decoded = jwt.verify(token, getRefreshSecret())

        if (
            typeof decoded === "string" ||
            typeof decoded.sub !== "string" ||
            typeof decoded.email !== "string"
        ) {
            return null
        }

        return decoded as RefreshTokenPayload
    } catch {
        return null
    }
}