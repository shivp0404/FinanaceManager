
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type TransactionType  = "INCOME" | "EXPENSE";

export async function addExpense(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const description = formData.get("description");
  const amountValue = formData.get("amount");
  const type = formData.get("type");
  const categoryIdValue = formData.get("categoryId");

  if (typeof description !== "string" || !description.trim()) {
    return {
      success: false,
      message: "Enter a transaction description",
    };
  }

  if (typeof amountValue !== "string") {
    return {
      success: false,
      message: "Enter a valid amount",
    };
  }

  if (type !== "INCOME" && type !== "EXPENSE") {
    return {
      success: false,
      message: "Invalid transaction type",
    };
  }

  if (typeof categoryIdValue !== "string") {
    return {
      success: false,
      message: "Please select a category",
    };
  }

  const amount = Number(amountValue);
  const categoryId = Number(categoryIdValue);

  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      success: false,
      message: "Enter a valid amount",
    };
  }

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return {
      success: false,
      message: "Invalid category",
    };
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    return {
      success: false,
      message: "Selected category does not exist",
    };
  }

  await prisma.transaction.create({
    data: {
      userId: Number(user.id),
      description: description.trim(),
      amount,
      type,
      categoryId,
    },
  });

  revalidatePath("/transaction");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: `${type === "INCOME" ? "Income" : "Expense"} added successfully`,
  };
}

export async function updateTransaction(
  id: number,
  formData: FormData
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const userId = Number(currentUser.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return {
      success: false,
      message: "Invalid transaction ID",
    };
  }

  const description = formData.get("description");
  const amountValue = formData.get("amount");
  const type = formData.get("type");

  if (
    typeof description !== "string" ||
    typeof amountValue !== "string"
  ) {
    return {
      success: false,
      message: "Invalid form data",
    };
  }

  if (type !== "INCOME" && type !== "EXPENSE") {
    return {
      success: false,
      message: "Invalid transaction type",
    };
  }

  const trimmedDescription = description.trim();
  const amount = Number(amountValue);

  if (!trimmedDescription) {
    return {
      success: false,
      message: "Description is required",
    };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      success: false,
      message: "Enter a valid amount",
    };
  }

  const result = await prisma.transaction.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      description: trimmedDescription,
      amount,
      type,
    },
  });

  if (result.count === 0) {
    return {
      success: false,
      message: "Transaction not found",
    };
  }

  revalidatePath("/transaction");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Transaction updated successfully",
  };
}

export async function deleteTransaction(id: number) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!Number.isSafeInteger(id) || id <= 0) {
    return {
      success: false,
      message: "Invalid transaction ID",
    };
  }

  const result = await prisma.transaction.deleteMany({
    where: {
      id,
      userId: Number(currentUser.id),
    },
  });

  if (result.count === 0) {
    return {
      success: false,
      message: "Transaction not found",
    };
  }

  revalidatePath("/transaction");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Transaction deleted successfully",
  };
}
