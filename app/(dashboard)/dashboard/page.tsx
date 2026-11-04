
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Cards from "@/app/_components/Cards";
import DashboardCharts from "./DashboardCharts";

export default async function DashboardPage() {
  // 1. Authentication
  const user = await getCurrentUser();

   if (!user) {
        redirect("/api/auth/refresh?next=/dashboard")
    }

  // 2. Current month date range
  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const startOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  // 3. Fetch all dashboard data
  const [
    budget,
    incomeResult,
    expenseResult,
    recentTransactions,
    monthlyExpenseTransactions,
  ] = await Promise.all([
    // Monthly budget
    prisma.budget.findUnique({
      where: {
        userId_year_month: {
          userId: user.id,
          year: now.getFullYear(),
          month: now.getMonth() + 1,
        },
      },
    }),

    // Total income
    prisma.transaction.aggregate({
      where: {
        userId: user.id,
        type: "INCOME",
        date: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    // Total expenses
    prisma.transaction.aggregate({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    // Recent transactions
    prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
    }),

    // Monthly expense transactions for charts
    prisma.transaction.findMany({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
      select: {
        amount: true,
        date: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  // 4. Convert Decimal values into numbers
  const monthlyBudget = Number(budget?.amount ?? 0);

  const totalIncome = Number(
    incomeResult._sum.amount ?? 0
  );

  const totalExpenses = Number(
    expenseResult._sum.amount ?? 0
  );

  // 5. Dashboard calculations
  const remainingBudget = Math.max(
    0,
    monthlyBudget - totalExpenses
  );

  const exceededAmount = Math.max(
    0,
    totalExpenses - monthlyBudget
  );

  const budgetUsage =
    monthlyBudget > 0
      ? (totalExpenses / monthlyBudget) * 100
      : 0;

  const currency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const monthName = now.toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });

  // 6. Prepare chart data
  const categoryMap = new Map<string, number>();
  const dailyMap = new Map<string, number>();

  monthlyExpenseTransactions.forEach((transaction) => {
    const amount = Number(transaction.amount);

    // Category-wise spending
    const categoryName = transaction.category.name;

    categoryMap.set(
      categoryName,
      (categoryMap.get(categoryName) ?? 0) + amount
    );

    // Daily spending
    const day = [
      transaction.date.getFullYear(),
      String(transaction.date.getMonth() + 1).padStart(2, "0"),
      String(transaction.date.getDate()).padStart(2, "0"),
    ].join("-");

    dailyMap.set(
      day,
      (dailyMap.get(day) ?? 0) + amount
    );
  });

  // Category chart data
  const categoryChartData = Array.from(
    categoryMap,
    ([name, amount]) => ({
      name,
      amount,
    })
  ).sort((a, b) => b.amount - a.amount);

  // Daily chart data
  const dailyChartData = Array.from(
    { length: now.getDate() },
    (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth(),
        index + 1
      );

      const day = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

      return {
        day: String(index + 1),
        amount: dailyMap.get(day) ?? 0,
      };
    }
  );

  // 7. Dashboard UI
  return (
    <div>
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p className="mt-2 text-gray-600">
        Welcome to your personal finance dashboard.
      </p>

      <p className="mt-1 text-sm text-gray-500">
        Overview for {monthName}
      </p>

      {/* Budget not created */}
      {monthlyBudget === 0 && (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-5">
          <h2 className="font-semibold text-blue-800">
            Set your monthly budget
          </h2>

          <p className="mt-2 text-sm text-blue-700">
            You haven't created a budget for this month yet.
            Set one to start tracking your spending.
          </p>
        </div>
      )}

      {/* Overspending warning */}
      {monthlyBudget > 0 && exceededAmount > 0 && (
        <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-800">
            ⚠ Monthly budget exceeded!
          </h2>

          <p className="mt-2 text-sm text-amber-700">
            You have exceeded your monthly budget by{" "}
            {currency(exceededAmount)}.
          </p>

          <p className="mt-1 text-sm text-amber-700">
            Please review your spending.
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <Cards
          Heading="Monthly Budget"
          Amount={monthlyBudget}
          tone="blue"
        />

        <Cards
          Heading="Income"
          Amount={totalIncome}
          tone="green"
        />

        <Cards
          Heading="Expenses"
          Amount={totalExpenses}
          tone="red"
        />

        <Cards
          Heading="Remaining Budget"
          Amount={remainingBudget}
          tone={exceededAmount > 0 ? "red" : "green"}
        />

        <Cards
          Heading="Budget Exceeded"
          Amount={exceededAmount}
          tone={exceededAmount > 0 ? "red" : "orange"}
        />
      </div>

      {/* Monthly Budget Progress */}
      {monthlyBudget > 0 && (
        <div className="mt-8 rounded-lg bg-white p-5 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Monthly Budget Usage
            </h2>

            <span className="font-semibold">
              {budgetUsage.toFixed(1)}%
            </span>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full ${
                exceededAmount > 0
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
              style={{
                width: `${Math.min(budgetUsage, 100)}%`,
              }}
            />
          </div>

          <div className="mt-3 flex justify-between text-sm text-gray-600">
            <span>
              Spent: {currency(totalExpenses)}
            </span>

            <span>
              Budget: {currency(monthlyBudget)}
            </span>
          </div>
        </div>
      )}

      {/* Spending Analytics */}
      <DashboardCharts
        categoryData={categoryChartData}
        dailyData={dailyChartData}
      />

      {/* Recent Transactions */}
      <div className="mt-8 rounded-lg bg-white p-5 shadow">
        <h2 className="text-xl font-semibold">
          Recent Transactions
        </h2>

        {recentTransactions.length === 0 ? (
          <p className="mt-4 text-gray-500">
            No transactions this month.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div>
                  <p className="font-medium">
                    {transaction.description}
                  </p>

                  <p className="text-sm text-gray-500">
                    {transaction.category.name} ·{" "}
                    {transaction.date.toLocaleDateString("en-IN")}
                  </p>
                </div>

                <p
                  className={`font-semibold ${
                    transaction.type === "INCOME"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "INCOME" ? "+" : "-"}
                  {currency(Number(transaction.amount))}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
