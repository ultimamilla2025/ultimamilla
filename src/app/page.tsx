//src\app\page.tsx
import ErrorDisplay from "@/components/global/ErrorDisplay";
import UserTable from "./backoffice/components/UserTable";
import { User } from "@/generated/prisma";

export default async function Home() {
  const response = await fetch(`${process.env.BACKEND_URL}/api/user`, {
    cache: "no-store", // Evitar cache
  });

  const data = await response.json();

  // Si no es un array, es un error
  if (!Array.isArray(data)) {
    return (
      <ErrorDisplay
        type="access-denied"
        title="Acceso Denegado"
        message={data.error}
      />
    );
  }

  const users: User[] = data;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            Gestión de Usuarios
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
