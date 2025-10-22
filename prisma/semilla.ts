import prisma from "@/lib/prisma";
import { Role } from "@/generated/prisma";

const userData = [
  {
    name: "Alice",
    email: "alice@prisma.io",
    role: Role.ADMIN,
  },
  {
    name: "Bob",
    email: "bob@prisma.io",
    role: Role.USER,
  },
  {
    name: "Charlie",
    email: "charlie@prisma.io",
    role: Role.DELIVERY,
  },
];

export async function semilla() {
  // Limpiar la tabla de usuarios primero
  await prisma.user.deleteMany({});
  console.log("🗑️ Usuarios anteriores eliminados");

  // Crear los nuevos usuarios
  await prisma.user.createMany({
    data: userData,
  });
  console.log("✅ Seed completado exitosamente");
}

semilla();
