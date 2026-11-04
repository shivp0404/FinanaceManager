
type BudgetCardsProps = {
  monthlyBudget: number;
  totalSpent: number;
  remainingBudget: number;
};

export default function BudgetCards({
  monthlyBudget,
  totalSpent,
  remainingBudget,
}: BudgetCardsProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const budgetUsed =
    monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

  const exceededAmount = Math.max(0, totalSpent - monthlyBudget);

  const cards = [
    {
      title: "Monthly Budget",
      amount: monthlyBudget,
      description: "Your spending limit this month",
      icon: "₹",
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Spent",
      amount: totalSpent,
      description: `${budgetUsed.toFixed(1)}% of your budget used`,
      icon: "↗",
      iconStyle: "bg-orange-50 text-orange-600",
    },
    {
      title: "Remaining Budget",
      amount: remainingBudget,
      description:
        exceededAmount > 0
          ? `${formatCurrency(exceededAmount)} over budget`
          : "Available amount to spend",
      icon: "✓",
      iconStyle: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              {card.title}
            </p>

            <span
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg font-semibold ${card.iconStyle}`}
            >
              {card.icon}
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-bold text-gray-900">
            {formatCurrency(card.amount)}
          </h3>

          <p className="mt-2 text-xs text-gray-500">
            {card.description}
          </p>

          {card.title === "Total Spent" && (
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all ${
                  budgetUsed > 100 ? "bg-red-500" : "bg-orange-500"
                }`}
                style={{ width: `${Math.min(budgetUsed, 100)}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
