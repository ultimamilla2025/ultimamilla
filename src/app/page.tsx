//src\app\page.tsx
import { User } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const users = await prisma.user.findMany();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-2xl font-bold">Usuarios</h1>
      <div className="grid grid-cols-3 gap-4">
        {users.map((user: User) => (
          <div key={user.id} className="border p-4 rounded">
            <p>
              <strong>Id:</strong> {user.id}
            </p>
            <p>
              <strong>Nombre:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Rol:</strong> {user.role}
            </p>

            <div className="flex gap-5 w-full justify-center mt-2">
              <Link
                href={"users/" + user.id}
                className="border p-2 flex justify-center items-center rounded hover:bg-white/10 transition-all"
              >
                VER 👁️
              </Link>

              <Link
                href={"/formdemo/" + user.id}
                className="border p-2 flex justify-center items-center rounded hover:bg-white/10 transition-all"
              >
                Editar ✏️
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
