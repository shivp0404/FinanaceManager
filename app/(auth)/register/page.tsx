
'use client'

import Link from "next/link"
import { useActionState } from "react"
import { RegisterUser } from "@/actions/auth.actions"

const initialState = {
    success: false,
    message: ""
}

export default function RegisterForm() {

    const [state, formAction, pending] = useActionState(
        RegisterUser,
        initialState
    )

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-md border">

                {/* Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-600">
                        💰 Muneem
                    </h1>

                    <h2 className="text-2xl font-semibold mt-6 text-gray-800">
                        Create Account
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Start managing your money today
                    </p>
                </div>

                {/* Register Form */}
                <form className="space-y-5" action={formAction}>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>

                        <input
                            name="name"
                            type="text"
                            placeholder="Enter your name"
                            required
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>

                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="Enter your email"
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Create a password"
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Server Action Response */}
                    {state.message && (
                        <p
                            aria-live="polite"
                            className={`text-sm ${
                                state.success
                                    ? "text-green-600"
                                    : "text-red-500"
                            }`}
                        >
                            {state.message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={pending}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60"
                    >
                        {pending ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-green-600 font-semibold hover:underline"
                    >
                        Login
                    </Link>
                </p>

            </div>
        </div>
    )
}
