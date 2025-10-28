import prisma from "@/lib/prisma";
import UserTable from "./components/UserTable";

export default async function Home() {
  const users = await prisma.user.findMany();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            Backoffice
          </h1>
          <p className="text-gray-400">
            {users.length} usuario{users.length !== 1 ? "s" : ""} registrado
            {users.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Tabla */}
        <UserTable users={users} />
      </div>
    </div>
  );
}
