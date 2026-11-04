import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TransactionClient from "./TransactionClient";

export default async function TransactionPage() {
  const user = await getCurrentUser();

   if (!user) {
        redirect("/api/auth/refresh?next=/dashboard")
    }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      date: "desc",
    },
  });

  const formattedTransactions = transactions.map((transaction) => ({
    id: transaction.id,
    description: transaction.description,
    amount: Number(transaction.amount),
    date: transaction.date.toISOString(),
    type:transaction.type
  }));



const categories = await prisma.category.findMany({
  orderBy: {
    name: "asc",
  },
});

return (
  <TransactionClient
    transactions={formattedTransactions}
    categories={categories}
  />
);
}