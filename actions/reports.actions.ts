
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export type MonthlyOverview = {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  budget: number | null;
  budgetRemaining: number | null;
  budgetUtilization: number | null;
};

export async function getMonthlyOverview(
  month: number,
  year: number
): Promise<MonthlyOverview | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  // Validate the requested month and year.
  if (
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12 ||
    !Number.isInteger(year) ||
    year < 2000 ||
    year > 9999
  ) {
    return null;
  }

  // Start and end boundaries for the selected month.
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 1));

  // Fetch income and expenses for the logged-in user.
  const transactions = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId: user.id,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const totalIncome = Number(
    transactions.find((item) => item.type === "INCOME")?._sum.amount ?? 0
  );

  const totalExpenses = Number(
    transactions.find((item) => item.type === "EXPENSE")?._sum.amount ?? 0
  );

  // Fetch the budget for the selected month.
  const budgetRecord = await prisma.budget.findUnique({
    where: {
      userId_year_month: {
        userId: user.id,
        year,
        month,
      },
    },
  });

  const budget = budgetRecord ? Number(budgetRecord.amount) : null;

  const netSavings = totalIncome - totalExpenses;

  const budgetRemaining =
    budget !== null ? budget - totalExpenses : null;

  const budgetUtilization =
    budget !== null && budget > 0
      ? (totalExpenses / budget) * 100
      : null;

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    budget,
    budgetRemaining,
    budgetUtilization,
  };
}

export type CategoryExpense = {
  name: string;
  value: number;
};

export async function getMonthlyExpenseBreakdown(
  month: number,
  year: number
): Promise<CategoryExpense[] | null> {
  const user = await getCurrentUser();

  if (!user) return null;

  if (
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12 ||
    !Number.isInteger(year) ||
    year < 2000 ||
    year > 9999
  ) {
    return null;
  }

  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 1));

  // Group expense transactions by category.
  const expenses = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      userId: user.id,
      type: "EXPENSE",
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    _sum: {
      amount: true,
    },
  });

  if (expenses.length === 0) return [];

  // Fetch category names.
  const categories = await prisma.category.findMany({
    where: {
      id: {
        in: expenses.map((item) => item.categoryId),
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const categoryMap = new Map(
    categories.map((category) => [category.id, category.name])
  );

  return expenses
    .map((item) => ({
      name: categoryMap.get(item.categoryId) ?? "Unknown",
      value: Number(item._sum.amount ?? 0),
    }))
    .sort((a, b) => b.value - a.value);
}