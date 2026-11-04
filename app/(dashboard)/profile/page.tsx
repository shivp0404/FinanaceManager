import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import ProfileDetails from "./ProfileDetails";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

   if (!currentUser) {
        redirect("/api/auth/refresh?next=/dashboard")
    }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(currentUser.id),
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return <ProfileDetails user={user} />;
}