//src\app\users\[userId]\page.tsx

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import UserProfileClient from "./UserProfileClient";

type Parametros = {
  params: {
    userId: string;
  };
};

export default async function ProfilePage({ params }: Parametros) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    notFound();
  }

  return <UserProfileClient user={user} />;
}
