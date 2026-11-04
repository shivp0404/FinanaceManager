import { cookies } from "next/headers"
import findUser from "@/app/services/finduser"
import { verifyAccessToken } from "./token"

export async function getCurrentUser() {
    const cookieStore = await cookies()

    const accessToken = cookieStore.get("accessToken")?.value

    if (!accessToken) {
        return null
    }

    const payload = verifyAccessToken(accessToken)

    if (!payload) {
        return null
    }

    const user = await findUser(payload.email)

    if (!user || String(user.id) !== payload.sub) {
        return null
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email
    }
}