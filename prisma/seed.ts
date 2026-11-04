
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  console.log("Starting Muneem seed...");

  // 1. Create test user
  const hashedPassword = await bcrypt.hash("Test@123", 10);

  const user = await prisma.user.upsert({
    where: {
      email: "test@muneem.com",
    },
    update: {
      name: "Test User",
      password: hashedPassword,
    },
    create: {
      name: "Test User",
      email: "test@muneem.com",
      password: hashedPassword,
    },
  });

  console.log("Test user ready.");

  // 2. Get existing categories
  const categories = await prisma.category.findMany();

  if (categories.length === 0) {
    throw new Error("Please run your category seed first.");
  }

  // Find a suitable category by name.
  // Falls back to the first existing category if no match is found.
  function getCategory(keywords: string[], fallbackIndex: number) {
    const category = categories.find((item) =>
      keywords.some((keyword) =>
        item.name.toLowerCase().includes(keyword)
      )
    );

    return category?.id ?? categories[fallbackIndex % categories.length].id;
  }

  const categoryIds = {
    income: getCategory(["salary", "income"], 0),
    food: getCategory(["food", "grocery"], 1),
    rent: getCategory(["rent", "housing"], 2),
    bills: getCategory(["bill", "utility", "electric"], 3),
    transport: getCategory(["transport", "fuel", "travel"], 4),
    shopping: getCategory(["shopping"], 5),
    entertainment: getCategory(["entertainment", "movie"], 6),
    health: getCategory(["health", "medical"], 7),
  };

  // 3. Historical monthly data
  const monthlyData = [
    {
      offset: 5,
      budget: 22000,
      salary: 45000,
      extraIncome: 0,
      rent: 8000,
      groceries: 4200,
      bills: 1500,
      transport: 1800,
      shopping: 1200,
      entertainment: 800,
      health: 500,
    },
    {
      offset: 4,
      budget: 23000,
      salary: 45000,
      extraIncome: 2000,
      rent: 8000,
      groceries: 4800,
      bills: 1600,
      transport: 2000,
      shopping: 2500,
      entertainment: 1000,
      health: 0,
    },
    {
      offset: 3,
      budget: 24000,
      salary: 45000,
      extraIncome: 0,
      rent: 8000,
      groceries: 4500,
      bills: 1700,
      transport: 1600,
      shopping: 1000,
      entertainment: 700,
      health: 1200,
    },
    {
      offset: 2,
      budget: 25000,
      salary: 45000,
      extraIncome: 3000,
      rent: 8000,
      groceries: 5000,
      bills: 1800,
      transport: 2200,
      shopping: 3500,
      entertainment: 1500,
      health: 500,
    },
    {
      offset: 1,
      budget: 25000,
      salary: 45000,
      extraIncome: 0,
      rent: 8000,
      groceries: 4600,
      bills: 1500,
      transport: 1900,
      shopping: 1800,
      entertainment: 900,
      health: 0,
    },
    {
      offset: 0,
      budget: 25000,
      salary: 45000,
      extraIncome: 1500,
      rent: 8000,
      groceries: 4200,
      bills: 1600,
      transport: 1700,
      shopping: 2000,
      entertainment: 800,
      health: 500,
    },
  ];

  // 4. Remove previous test transactions
  // Other users' transactions are not affected.
  await prisma.transaction.deleteMany({
    where: {
      userId: user.id,
    },
  });

  const now = new Date();

  for (const data of monthlyData) {
    const monthDate = new Date(
      now.getFullYear(),
      now.getMonth() - data.offset,
      1
    );

    const month = monthDate.getMonth() + 1;
    const year = monthDate.getFullYear();

    // 5. Create or update monthly budget
    await prisma.budget.upsert({
      where: {
        userId_year_month: {
          userId: user.id,
          year,
          month,
        },
      },
      update: {
        amount: data.budget,
        editCount: 0,
      },
      create: {
        userId: user.id,
        amount: data.budget,
        month,
        year,
      },
    });

    // 6. Build transactions for this month
    const transactions = [
      {
        amount: data.salary,
        description: "Monthly Salary",
        type: "INCOME" as const,
        categoryId: categoryIds.income,
        day: 1,
      },
      {
        amount: data.rent,
        description: "Monthly House Rent",
        type: "EXPENSE" as const,
        categoryId: categoryIds.rent,
        day: 3,
      },
      {
        amount: data.groceries,
        description: "Monthly Groceries",
        type: "EXPENSE" as const,
        categoryId: categoryIds.food,
        day: 6,
      },
      {
        amount: data.bills,
        description: "Electricity and Internet Bills",
        type: "EXPENSE" as const,
        categoryId: categoryIds.bills,
        day: 10,
      },
      {
        amount: data.transport,
        description: "Fuel and Transportation",
        type: "EXPENSE" as const,
        categoryId: categoryIds.transport,
        day: 14,
      },
      {
        amount: data.shopping,
        description: "Shopping Expenses",
        type: "EXPENSE" as const,
        categoryId: categoryIds.shopping,
        day: 18,
      },
      {
        amount: data.entertainment,
        description: "Movies and Entertainment",
        type: "EXPENSE" as const,
        categoryId: categoryIds.entertainment,
        day: 22,
      },
      {
        amount: data.health,
        description: "Medical Expenses",
        type: "EXPENSE" as const,
        categoryId: categoryIds.health,
        day: 25,
      },
    ];

    if (data.extraIncome > 0) {
      transactions.push({
        amount: data.extraIncome,
        description: "Freelance Income",
        type: "INCOME" as const,
        categoryId: categoryIds.income,
        day: 20,
      });
    }

    // Add only dates that have already occurred in the current month.
    const daysInMonth = new Date(year, month, 0).getDate();

    await prisma.transaction.createMany({
      data: transactions.map((transaction) => {
        const day = Math.min(
          transaction.day,
          daysInMonth,
          data.offset === 0 ? now.getDate() : daysInMonth
        );

        return {
          userId: user.id,
          amount: transaction.amount,
          description: transaction.description,
          type: transaction.type,
          categoryId: transaction.categoryId,
          date: new Date(year, month - 1, day, 10, 0, 0),
        };
      }),
    });

    console.log(`Seeded ${month}/${year}`);
  }

  console.log("Six months of Muneem data seeded successfully!");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
