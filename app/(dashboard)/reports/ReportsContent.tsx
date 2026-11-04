
"use client";

import { useEffect, useState } from "react";
import {
  getMonthlyOverview,
  getMonthlyExpenseBreakdown,
  type MonthlyOverview,
  type CategoryExpense,
} from "@/actions/reports.actions";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#16a34a",
  "#4ade80",
  "#86efac",
  "#15803d",
  "#bbf7d0",
  "#dcfce7",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function ReportsContent() {
  const [period, setPeriod] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState("2026-11");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [overview, setOverview] = useState<MonthlyOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState("");

  const [categoryData, setCategoryData] = useState<CategoryExpense[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadMonthlyReport() {
      if (period !== "monthly") {
        setOverview(null);
        setCategoryData([]);
        setOverviewLoading(false);
        setCategoryLoading(false);
        setOverviewError("");
        setCategoryError("");
        return;
      }

      setOverviewLoading(true);
      setCategoryLoading(true);
      setOverviewError("");
      setCategoryError("");

      try {
        const [year, month] = selectedMonth.split("-").map(Number);

        const [overviewResult, categoryResult] = await Promise.all([
          getMonthlyOverview(month, year),
          getMonthlyExpenseBreakdown(month, year),
        ]);

        if (!isActive) return;

        if (overviewResult === null || categoryResult === null) {
          setOverview(null);
          setCategoryData([]);
          setOverviewError("Please log in to view your reports.");
          setCategoryError("Please log in to view your reports.");
          return;
        }

        setOverview(overviewResult);
        setCategoryData(categoryResult);
      } catch (error) {
        console.error("Failed to load monthly report:", error);

        if (isActive) {
          setOverview(null);
          setCategoryData([]);
          setOverviewError("Unable to load your financial overview.");
          setCategoryError("Unable to load category expenses.");
        }
      } finally {
        if (isActive) {
          setOverviewLoading(false);
          setCategoryLoading(false);
        }
      }
    }

    loadMonthlyReport();

    return () => {
      isActive = false;
    };
  }, [selectedMonth, period]);

  const monthlyChartData = overview
    ? [
        {
          name: "Selected month",
          income: overview.totalIncome,
          expenses: overview.totalExpenses,
          savings: overview.netSavings,
        },
      ]
    : [];

  const budget = overview?.budget ?? null;
  const expenses = overview?.totalExpenses ?? 0;
  const budgetRemaining = overview?.budgetRemaining ?? null;
  const budgetUtilization = overview?.budgetUtilization ?? null;

  // Keep the progress bar within the visible 0–100% range.
  const budgetProgress =
    budgetUtilization !== null
      ? Math.min(Math.max(budgetUtilization, 0), 100)
      : 0;

  const hasBudget = budget !== null && budget > 0;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <section>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports & Insights
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Understand your spending habits and track your financial progress.
          </p>
        </section>

        {/* Filters */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-semibold text-gray-800">
                Reporting period
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Choose the period you want to analyse.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  View
                </label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-600 sm:w-40"
                >
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>

              {period === "monthly" ? (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Select month
                  </label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      From
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      max={endDate || undefined}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      To
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate || undefined}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {period === "custom" && (
            <p className="mt-4 text-sm text-amber-700">
              Custom date range reports are not connected yet. Monthly reports
              are currently available.
            </p>
          )}
        </section>

        {/* Financial Overview */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Financial overview
            </h2>
            <p className="text-sm text-gray-500">
              A summary of your income, expenses and savings for the selected month.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryCard
              title="Total income"
              amount={
                period === "custom"
                  ? "—"
                  : overviewLoading
                    ? "Loading..."
                    : overview
                      ? formatCurrency(overview.totalIncome)
                      : "—"
              }
              description="Money received"
              color="green"
            />

            <SummaryCard
              title="Total expenses"
              amount={
                period === "custom"
                  ? "—"
                  : overviewLoading
                    ? "Loading..."
                    : overview
                      ? formatCurrency(overview.totalExpenses)
                      : "—"
              }
              description="Money spent"
              color="red"
            />

            <SummaryCard
              title="Net savings"
              amount={
                period === "custom"
                  ? "—"
                  : overviewLoading
                    ? "Loading..."
                    : overview
                      ? formatCurrency(overview.netSavings)
                      : "—"
              }
              description="Income minus expenses"
              color="blue"
            />
          </div>

          {overviewError && period === "monthly" && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {overviewError}
            </p>
          )}
        </section>

        {/* Monthly Financial Chart */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Monthly financial summary
            </h2>
            <p className="text-sm text-gray-500">
              Income, expenses and savings for the selected month.
            </p>
          </div>

          <div className="h-80 w-full">
            {period === "custom" ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                Custom range report is not available yet.
              </div>
            ) : overviewLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                Loading financial chart...
              </div>
            ) : overviewError ? (
              <div className="flex h-full items-center justify-center text-sm text-red-600">
                Unable to load financial chart.
              </div>
            ) : overview ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData} barGap={12}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="#16a34a"
                    radius={[5, 5, 0, 0]}
                  />
                  <Bar
                    dataKey="expenses"
                    name="Expenses"
                    fill="#f87171"
                    radius={[5, 5, 0, 0]}
                  />
                  <Bar
                    dataKey="savings"
                    name="Savings"
                    fill="#60a5fa"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                No financial data available.
              </div>
            )}
          </div>
        </section>

        {/* Category and Budget */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Category Analysis */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Expense breakdown
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              See where your money is going.
            </p>

            <div className="mt-5 h-64">
              {period === "custom" ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  Custom range report is not available yet.
                </div>
              ) : categoryLoading ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  Loading category expenses...
                </div>
              ) : categoryError ? (
                <div
                  className="flex h-full items-center justify-center text-sm text-red-600"
                  role="alert"
                >
                  {categoryError}
                </div>
              ) : categoryData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  No expenses recorded for this month.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          {/* Budget Performance */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Budget performance
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Compare your planned budget with actual spending.
            </p>

            <div className="mt-8">
              {period === "custom" ? (
                <p className="text-sm text-gray-500">
                  Custom range report is not available yet.
                </p>
              ) : overviewLoading ? (
                <p className="text-sm text-gray-500">
                  Loading budget performance...
                </p>
              ) : overviewError ? (
                <p className="text-sm text-red-600">
                  Unable to load budget performance.
                </p>
              ) : !hasBudget ? (
                <div className="rounded-xl bg-gray-50 p-5">
                  <p className="font-medium text-gray-800">
                    No budget set for this month
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Set a monthly budget to track your spending against it.
                  </p>
                  <p className="mt-4 text-sm text-gray-600">
                    Actual expenses: {formatCurrency(expenses)}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Monthly budget
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(budget)}
                    </span>
                  </div>

                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${
                        expenses > budget ? "bg-red-500" : "bg-green-500"
                      }`}
                      style={{ width: `${budgetProgress}%` }}
                    />
                  </div>

                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>Spent: {formatCurrency(expenses)}</span>
                    <span>
                      {budgetUtilization?.toFixed(1)}% used
                    </span>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-green-50 p-4">
                      <p className="text-xs text-green-700">
                        {budgetRemaining !== null && budgetRemaining < 0
                          ? "Over budget"
                          : "Remaining"}
                      </p>
                      <p className="mt-1 text-xl font-bold text-green-700">
                        {formatCurrency(Math.abs(budgetRemaining ?? 0))}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">
                        Utilization
                      </p>
                      <p className="mt-1 text-xl font-bold text-gray-800">
                        {budgetUtilization?.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

        {/* Insights */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Financial insights
            </h2>
            <p className="text-sm text-gray-500">
              Observations based on your financial activity.
            </p>
          </div>

          <p className="mb-3 text-xs text-amber-700">
            Sample insights — database integration pending.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <InsightCard
              title="Highest expense category"
              description="Rent accounts for the largest portion of your expenses this month."
            />

            <InsightCard
              title="Budget status"
              description="You have used 91.4% of your monthly budget. ₹3,000 remains."
            />

            <InsightCard
              title="Savings performance"
              description="You saved ₹23,000 this month after deducting expenses from income."
            />

            <InsightCard
              title="Monthly spending"
              description="Your monthly spending can be compared with the previous month to identify changes."
            />
          </div>
        </section>

      </div>
    </main>
  );
}

function SummaryCard({
  title,
  amount,
  description,
  color,
}: {
  title: string;
  amount: string;
  description: string;
  color: "green" | "red" | "blue";
}) {
  const styles = {
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-blue-700",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-3 text-2xl font-bold text-gray-900">{amount}</p>
      <span
        className={`mt-3 inline-block rounded-full px-3 py-1 text-xs ${styles[color]}`}
      >
        {description}
      </span>
    </div>
  );
}

function InsightCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-green-500" />
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
