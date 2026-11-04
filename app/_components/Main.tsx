import Link from "next/link";

export default function Main() {
  return (
    <main className="bg-gray-50 min-h-screen">

      
      <section className="max-w-7xl mx-auto px-8 py-20 flex items-center justify-between gap-12">

        <div className="max-w-xl">
          <p className="text-green-600 font-semibold mb-4">
            YOUR MONEY, YOUR CONTROL
          </p>

          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Manage your money.
            <span className="text-green-600"> Build your future.</span>
          </h1>

          <p className="text-gray-500 text-lg mt-6 leading-relaxed">
            Take control of your finances with Muneem.
            Track expenses, manage budgets and understand
            where your money goes — all in one place.
          </p>

          <div className="flex gap-4 mt-8">
            <Link
              href="/register"
              className="bg-green-600 text-white px-7 py-3 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="border border-gray-300 px-7 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="bg-white rounded-2xl shadow-lg border p-7 w-full max-w-md">

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Balance</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                ₹45,250
              </h2>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm">
              +12.5%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">

            <div className="bg-green-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Income</p>
              <h3 className="text-xl font-bold text-green-700 mt-2">
                ₹60,000
              </h3>
            </div>

            <div className="bg-red-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Expenses</p>
              <h3 className="text-xl font-bold text-red-600 mt-2">
                ₹14,750
              </h3>
            </div>

          </div>

          <div className="mt-8">
            <div className="flex justify-between mb-3">
              <p className="font-semibold text-gray-800">Monthly Budget</p>
              <p className="text-sm text-gray-500">65% used</p>
            </div>

            <div className="w-full h-3 bg-gray-100 rounded-full">
              <div className="w-[65%] h-3 bg-green-500 rounded-full"></div>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              ₹6,500 of ₹10,000 spent
            </p>
          </div>

          <div className="mt-8">
            <p className="font-semibold text-gray-800 mb-4">
              Recent Transactions
            </p>

            <div className="space-y-4">

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="bg-orange-100 p-2 rounded-lg">🍔</span>
                  <div>
                    <p className="font-medium text-gray-800">Food</p>
                    <p className="text-xs text-gray-400">Today</p>
                  </div>
                </div>
                <p className="font-semibold text-red-500">-₹450</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 p-2 rounded-lg">🛍️</span>
                  <div>
                    <p className="font-medium text-gray-800">Shopping</p>
                    <p className="text-xs text-gray-400">Yesterday</p>
                  </div>
                </div>
                <p className="font-semibold text-red-500">-₹1,200</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="bg-green-100 p-2 rounded-lg">💼</span>
                  <div>
                    <p className="font-medium text-gray-800">Salary</p>
                    <p className="text-xs text-gray-400">28 Oct</p>
                  </div>
                </div>
                <p className="font-semibold text-green-600">+₹60,000</p>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* Features Section */}
      <section className="bg-white py-20 px-8">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">
            <p className="text-green-600 font-semibold">WHAT MUNEEM OFFERS</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">
              Everything you need to manage money
            </h2>
            <p className="text-gray-500 mt-3">
              Simple tools to make smarter financial decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="p-7 rounded-2xl border hover:shadow-md transition">
              <div className="text-3xl mb-5">💳</div>
              <h3 className="text-xl font-semibold">Expense Tracking</h3>
              <p className="text-gray-500 mt-3 leading-relaxed">
                Record your daily income and expenses and
                keep track of where your money goes.
              </p>
            </div>

            <div className="p-7 rounded-2xl border hover:shadow-md transition">
              <div className="text-3xl mb-5">🎯</div>
              <h3 className="text-xl font-semibold">Budget Management</h3>
              <p className="text-gray-500 mt-3 leading-relaxed">
                Set monthly budgets and monitor your spending
                to stay within your limits.
              </p>
            </div>

            <div className="p-7 rounded-2xl border hover:shadow-md transition">
              <div className="text-3xl mb-5">📊</div>
              <h3 className="text-xl font-semibold">Spending Insights</h3>
              <p className="text-gray-500 mt-3 leading-relaxed">
                Understand your spending habits and discover
                opportunities to save more.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="max-w-5xl mx-auto px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900">
          Take control of your money today.
        </h2>

        <p className="text-gray-500 mt-4">
          Start managing your finances with clarity and confidence.
        </p>

        <Link
          href="/register"
          className="inline-block mt-8 bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition"
        >
          Get Started with Muneem
        </Link>
      </section>

    </main>
  );
}