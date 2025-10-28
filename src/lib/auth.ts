import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { User, Role } from "@/generated/prisma";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          throw new Error("Email y contraseña requeridos");
        }

        // Buscar usuario en la DB por email (ya tipado por Prisma)
        const user: User | null = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("Credenciales inválidas");
        }

        // Verificar contraseña con bcrypt directamente
        const ok = bcrypt.compareSync(password, user.password);
        if (!ok) throw new Error("Credenciales inválidas");

        // Devolver TODOS los campos del usuario (menos password)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      // En el primer login, user existe y copiamos sus datos al token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.lastName = user.lastName;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Copiar todos los datos del token a la sesión
      session.user.id = (token.id as string) || (token.sub as string);
      session.user.email = (token.email as string) || "";
      session.user.name = (token.name as string) || "";
      session.user.lastName = (token.lastName as string) || "";
      session.user.role = token.role as Role;
      return session;
    },
    // Callback authorized para el middleware
    ...authConfig.callbacks,
  },
});
