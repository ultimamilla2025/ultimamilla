import UserTable from "./components/UserTable";
import { fetchWithAuth } from "@/utils/frontend/fetchWithAuth";

export default async function Home() {
  const users = await fetchWithAuth("/user");

  console.log(users);

  return (
    <div className="min-h-screen w-full bg-[var(--background)] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)]">
            Backoffice
          </h1>
          <p className="text-[var(--textmuted)]">
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
