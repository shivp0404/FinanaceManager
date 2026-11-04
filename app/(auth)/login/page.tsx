
'use client'

import Link from "next/link"
import { useActionState } from "react"
import { LoginUser } from "@/actions/auth.actions"

const initialState = {
    success: false,
    message: ""
}

export default function Login() {

    const [state, formAction, pending] = useActionState(
        LoginUser,
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
                        Welcome Back!
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Login to manage your finances
                    </p>
                </div>

                {/* Login Form */}
                <form className="space-y-5" action={formAction}>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            required
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
                            placeholder="Enter your password"
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
                        {pending ? "Logging in..." : "Login"}
                    </button>

                </form>

                {/* Register Link */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        className="text-green-600 font-semibold hover:underline"
                    >
                        Register
                    </Link>
                </p>

            </div>
        </div>
    )
}
