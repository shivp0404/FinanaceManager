
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type BudgetActionState = {
  success: boolean;
  message: string;
};

export async function addBudget(
  prevState: BudgetActionState,
  formData: FormData
): Promise<BudgetActionState> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: "Please login to continue.",
      };
    }

    const amount = Number(formData.get("amount"));

    if (!Number.isFinite(amount) || amount <= 0) {
      return {
        success: false,
        message: "Please enter a valid budget amount.",
      };
    }

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Check whether a budget already exists for this month.
    const existingBudget = await prisma.budget.findUnique({
      where: {
        userId_year_month: {
          userId: user.id,
          year,
          month,
        },
      },
    });

    if (existingBudget) {
      return {
        success: false,
        message: "A budget already exists for this month.",
      };
    }

    await prisma.budget.create({
      data: {
        amount,
        userId: user.id,
        month,
        year,
      },
    });

    revalidatePath("/budget");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Budget added successfully.",
    };
  } catch (error) {
    console.error("Add budget error:", error);

    return {
      success: false,
      message: "Something went wrong while adding your budget.",
    };
  }
}

export async function updateBudget(
  prevState: BudgetActionState,
  formData: FormData
): Promise<BudgetActionState> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: "Please login to continue.",
      };
    }

    const budgetId = Number(formData.get("budgetId"));
    const amount = Number(formData.get("amount"));

    if (!Number.isInteger(budgetId) || budgetId <= 0) {
      return {
        success: false,
        message: "Invalid budget.",
      };
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return {
        success: false,
        message: "Please enter a valid budget amount.",
      };
    }

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Update only if this is the user's current-month budget
    // and the one-time edit has not already been used.
    const result = await prisma.budget.updateMany({
      where: {
        id: budgetId,
        userId: user.id,
        month,
        year,
        editCount: 0,
      },
      data: {
        amount,
        editCount: {
          increment: 1,
        },
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        message:
          "Budget cannot be updated. It may have already been edited.",
      };
    }

    revalidatePath("/budget");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Budget updated successfully.",
    };
  } catch (error) {
    console.error("Update budget error:", error);

    return {
      success: false,
      message: "Something went wrong while updating your budget.",
    };
  }
}
