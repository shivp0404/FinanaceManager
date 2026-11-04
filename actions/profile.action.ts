
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export default async function updateProfileAction(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();

  if (!name || !email) {
    return {
      success: false,
      message: "Name and email are required",
    };
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
      NOT: {
        id: Number(currentUser.id),
      },
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    return {
      success: false,
      message: "Email already exists",
    };
  }

  await prisma.user.update({
    where: {
      id: Number(currentUser.id),
    },
    data: {
      name,
      email,
    },
  });

  revalidatePath("/profile");

  return {
    success: true,
    message: "Profile updated successfully",
  };
}
