import Link from "next/link";

export default function Header() {
  return (
    <nav className="w-full h-16 px-8 flex items-center justify-between bg-white border-b">

      {/* Logo */}
      <div className="text-2xl font-bold text-gray-800">
        <span className="text-green-600">💰</span> muneem
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-8 text-gray-600 font-medium">
        <Link href="/" className="hover:text-green-600">
          Home
        </Link>

        <Link href="/features" className="hover:text-green-600">
          Features
        </Link>

        <Link href="/about" className="hover:text-green-600">
          About
        </Link>

        <Link href="/contact" className="hover:text-green-600">
          Contact
        </Link>
      </div>

      {/* Login Button */}
      <Link
        href="/login"
        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
      >
        Login
      </Link>

    </nav>
  );
}