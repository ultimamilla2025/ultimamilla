import prisma from "@/lib/prisma";
import { Role } from "@/generated/prisma";
import bcrypt from "bcryptjs";

const userData = [
  {
    name: "Alice",
    lastName: "Smith",
    email: "alice@prisma.io",
    password: "123456", // Se hasheará antes de guardar
    role: Role.ADMIN,
  },
  {
    name: "Bob",
    lastName: "Johnson",
    email: "bob@prisma.io",
    password: "123456",
    role: Role.USER,
  },
  {
    name: "Charlie",
    lastName: "Brown",
    email: "charlie@prisma.io",
    password: "123456",
    role: Role.DELIVERY,
  },
];

export async function semilla() {
  // Limpiar la tabla de usuarios primero
  await prisma.user.deleteMany({});
  console.log("🗑️ Usuarios anteriores eliminados");

  // Hashear contraseñas y crear usuarios
  for (const user of userData) {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });
    console.log(`✅ Usuario creado: ${user.email}`);
  }

  console.log("✅ Seed completado exitosamente");
}

semilla();
