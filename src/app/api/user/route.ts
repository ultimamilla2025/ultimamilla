import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { isAdmin } from "@/utils/backend/getCurrentUser";

export async function GET() {
  try {
    // Verificar si el usuario es admin ANTES de hacer cualquier query
    const admin = await isAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "No tienes permiso para ver los usuarios" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany();

    return NextResponse.json(users);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

export async function POST(crudo: Request) {
  try {
    const { email, name, lastName, role, password } = await crudo.json();

    // Validar que la contraseña exista
    if (!password) {
      return NextResponse.json(
        { error: "La contraseña es requerida" },
        { status: 400 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    const nuevoUsuario = await prisma.user.create({
      data: {
        email,
        lastName,
        name,
        role,
        password: hashedPassword,
      },
    });

    // No devolver la contraseña en la respuesta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...usuarioSinPassword } = nuevoUsuario;

    return NextResponse.json(
      {
        message: "Usuario creado exitosamente",
        usuario: usuarioSinPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear usuario:", error);

    return NextResponse.json(
      {
        error: "Error al crear usuario",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await prisma.user.deleteMany();

    return NextResponse.json(
      { message: "Todos los usuarios han sido eliminados" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar usuarios:", error);
    return NextResponse.json({ status: 500 });
  }
}
