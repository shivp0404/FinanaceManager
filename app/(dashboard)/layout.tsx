
import Link from "next/link";
import LogoutButton from "@/app/_components/LogoutButton";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex h-screen overflow-hidden bg-gray-50">

            {/* Sidebar */}
            <aside className="w-60 h-screen shrink-0 bg-white border-r border-gray-200 p-5 text-gray-700 flex flex-col">

                <h1 className="mb-10 text-2xl font-bold text-green-600">
                    💰 Muneem
                </h1>

                <nav className="flex flex-col gap-2">

                    <Link
                        href="/dashboard"
                        className="rounded-lg px-4 py-3 font-medium hover:bg-green-50 hover:text-green-700 transition"
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/transaction"
                        className="rounded-lg px-4 py-3 font-medium hover:bg-green-50 hover:text-green-700 transition"
                    >
                        Transaction
                    </Link>

                    <Link
                        href="/budget"
                        className="rounded-lg px-4 py-3 font-medium hover:bg-green-50 hover:text-green-700 transition"
                    >
                        Budget
                    </Link>

                    <Link
                        href="/profile"
                        className="rounded-lg px-4 py-3 font-medium hover:bg-green-50 hover:text-green-700 transition"
                    >
                        Profile
                    </Link>

                    <Link
                        href="/reports"
                        className="rounded-lg px-4 py-3 font-medium hover:bg-green-50 hover:text-green-700 transition"
                    >
                        Reports
                    </Link>

                </nav>

                {/* Logout */}
                <div className="mt-auto pt-4 border-t border-gray-200">
                    <LogoutButton />
                </div>

            </aside>

            {/* Main Content */}
            <section className="flex-1 min-w-0 h-screen overflow-y-auto bg-gray-50 p-8">

                {children}

            </section>

        </main>
    );
}
