import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany();

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

export async function POST(crudo: Request) {
  try {
    const { email, name, role } = await crudo.json();

    const nuevoUsuario = await prisma.user.create({
      data: { email, name, role },
    });

    return NextResponse.json(
      {
        message: "Usuario creado exitosamente",
        usuario: nuevoUsuario,
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
