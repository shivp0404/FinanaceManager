import {prisma} from "@/lib/prisma"

const categories = [
  "Food",
  "Groceries",
  "Shopping",
  "Transportation",
  "Bills",
  "Rent",
  "Entertainment",
  "Healthcare",
  "Education",
  "Other Expense",
];

async function main() {
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Categories seeded successfully.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });