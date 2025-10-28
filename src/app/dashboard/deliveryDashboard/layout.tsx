"use client";

import React from "react";
import { Role } from "@/generated/prisma";
import { useCurrentUser } from "@/utils/frontend/getCurrentUser";
import { unauthorized } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { role } = useCurrentUser();

  if (role !== Role.DELIVERY) {
    unauthorized();
  }

  return <div>{children}</div>;
}
