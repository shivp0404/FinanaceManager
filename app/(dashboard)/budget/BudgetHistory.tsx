
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function BudgetHistory() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const budgets = await prisma.budget.findMany({
    where: {
      userId: user.id,
      OR: [
        { year: { lt: currentYear } },
        {
          year: currentYear,
          month: { lte: currentMonth },
        },
      ],
    },
    orderBy: [
      { year: "desc" },
      { month: "desc" },
    ],
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const formatMonth = (month: number, year: number) =>
    new Date(year, month - 1).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });

  if (budgets.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <h3 className="font-semibold text-gray-800">
          No budget history yet
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Your monthly budgets will appear here once you create one.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Month</th>
              <th className="px-6 py-4 font-semibold">Budget Amount</th>
              <th className="px-6 py-4 font-semibold">Last Updated</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {budgets.map((budget) => {
              const isCurrentMonth =
                budget.month === currentMonth &&
                budget.year === currentYear;

              return (
                <tr
                  key={budget.id}
                  className="transition hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                    {formatMonth(budget.month, budget.year)}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-900">
                    {formatCurrency(Number(budget.amount))}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                    {budget.updatedAt.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {isCurrentMonth ? (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
