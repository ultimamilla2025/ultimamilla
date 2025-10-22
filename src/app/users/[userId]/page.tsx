//src\app\users\[userId]\page.tsx

import prisma from "@/lib/prisma";

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

  return (
    <div className="min-h-screen flex justify-center items-center text-7xl">
      {user?.email}
    </div>
  );
}
