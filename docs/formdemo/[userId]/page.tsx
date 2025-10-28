//src\app\formdemo\[userId]\page.tsx

import prisma from "@/lib/prisma";
import FormularioEditar from "./FormularioEditar";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function PaginaEditarUsuario({ params }: Props) {
  const { userId } = await params;

  const usuario = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!usuario) {
    return <div className="text-red-500">NO EXISTE NINGÚN USUARIO!</div>;
  }

  return (
    <div>
      <FormularioEditar usuario={usuario} />
    </div>
  );
}
