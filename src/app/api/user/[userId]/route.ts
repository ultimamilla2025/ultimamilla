// src/app/api/user/[userId]/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    console.log(request);
    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener el usuario" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: paramId } = await params;
    const { name, role, email } = await request.json();
    const usuarioActualizado = await prisma.user.update({
      where: { id: paramId },
      data: { name, role, email },
    });
    return NextResponse.json({
      message: "Usuario actualizado exitosamente",
      usuario: usuarioActualizado,
    });
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    await prisma.user.delete({
      where: { id: userId },
    });
    return NextResponse.json({ message: "Usuario eliminado exitosamente" });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar usuario" },
      { status: 500 }
    );
  }
}
