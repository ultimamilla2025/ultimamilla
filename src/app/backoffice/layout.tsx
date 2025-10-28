"use client";

import { Role } from "@/generated/prisma";
import { useCurrentUser } from "@/utils/frontend/getCurrentUser";
import { unauthorized } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { role, isLoading } = useCurrentUser();

  console.log("Role:", role, "Loading:", isLoading);

  // Mientras está cargando, no hacemos nada (o mostramos un loader)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  // Una vez que terminó de cargar, verificamos el rol
  if (role !== Role.ADMIN) {
    unauthorized();
  }

  return <div>{children}</div>;
}
