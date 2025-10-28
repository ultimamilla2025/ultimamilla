// src/types/next-auth.d.ts
// Extensión de tipos de NextAuth para incluir campos personalizados

import { Role } from "@/generated/prisma";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string | null;
    role: Role;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: Role;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
