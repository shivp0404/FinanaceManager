
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import BudgetCards from "./BudgetCards";
import BudgetForm from "./BudgetForm";
import BudgetHistory from "./BudgetHistory";

export default async function BudgetPage() {
  const user = await getCurrentUser();

   if (!user) {
        redirect("/api/auth/refresh?next=/dashboard")
    }

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const startOfMonth = new Date(year, month - 1, 1);
  const startOfNextMonth = new Date(year, month, 1);

  const [budget, expenseResult] = await Promise.all([
    prisma.budget.findUnique({
      where: {
        userId_year_month: {
          userId: user.id,
          year,
          month,
        },
      },
    }),

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
  ]);

  const monthlyBudget = Number(budget?.amount ?? 0);
  const totalSpent = Number(expenseResult._sum.amount ?? 0);

  const remainingBudget = Math.max(
    0,
    monthlyBudget - totalSpent
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Budget Management
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your monthly budget and category-wise spending limits.
        </p>
      </div>

      {/* Budget Overview */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Current Month
          </h2>
          <p className="text-sm text-gray-500">
            Your monthly budget overview.
          </p>
        </div>

        <BudgetCards
          monthlyBudget={monthlyBudget}
          totalSpent={totalSpent}
          remainingBudget={remainingBudget}
        />
      </section>

      {/* Monthly Budget Management */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Monthly Budget
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Set your overall spending limit for this month.
          </p>
        </div>

        <BudgetForm
          budgetId={budget?.id ?? null}
          amount={monthlyBudget}
          editCount={budget?.editCount ?? 0}
        />
      </section>

      {/* Budget History */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Budget History
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review your previous monthly budgets.
          </p>
        </div>

        <BudgetHistory />
      </section>
    </div>
  );
}
