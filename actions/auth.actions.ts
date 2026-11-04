
'use server'

import { prisma } from "@/lib/prisma"
import findUser from "@/app/services/finduser"
import bcrypt from "bcrypt"

import {
    generateAccessToken,
    generateRefreshToken
} from "@/lib/token"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"


// ---------------- REGISTER ----------------

export type RegisterState = {
    success: boolean
    message: string
}

export async function RegisterUser(
    prevState: RegisterState,
    formData: FormData
): Promise<RegisterState> {

    const name = formData.get("name")
    const email = formData.get("email")
    const password = formData.get("password")

    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        !name.trim() ||
        !email.trim() ||
        !password
    ) {
        return {
            success: false,
            message: "All fields are required."
        }
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await findUser(normalizedEmail)

    if (existingUser) {
        return {
            success: false,
            message: "Email already exists."
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: {
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        }
    })

    redirect("/login")
}


// ---------------- LOGIN ----------------

export type LoginState = {
    success: boolean
    message: string
}

export async function LoginUser(
    prevState: LoginState,
    formData: FormData
): Promise<LoginState> {

    const email = formData.get("email")
    const password = formData.get("password")

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() ||
        !password
    ) {
        return {
            success: false,
            message: "Please enter your email and password."
        }
    }

    const user = await findUser(email.trim().toLowerCase())

    if (!user) {
        return {
            success: false,
            message: "Invalid email or password."
        }
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        return {
            success: false,
            message: "Invalid email or password."
        }
    }

    const accessToken = generateAccessToken({
        id: user.id,
        email: user.email
    })

    const refreshToken = generateRefreshToken({
        id: user.id,
        email: user.email
    })

    const cookieStore = await cookies()

    cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60
    })

    cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60
    })

    redirect("/dashboard")
}


// ---------------- LOGOUT ----------------

export async function logoutAction() {

    const cookieStore = await cookies()

    cookieStore.delete("accessToken")
    cookieStore.delete("refreshToken")

    redirect("/login")
}
