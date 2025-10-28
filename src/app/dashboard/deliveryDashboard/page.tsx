import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  // Si no hay sesión, redirigir a login
  if (!session?.user) {
    redirect("/login");
  }

  console.log(session.user.id);
  console.log(session.user.role);

  return (
    <div className="min-h-screen w-screen bg-[var(--background)] flex justify-center items-center">
      <div className="border border-[var(--borders)] flex flex-col w-96 items-center justify-center px-6 py-8 rounded-2xl bg-[var(--surface)]">
        <h2 className="text-2xl font-bold mb-6 text-[var(--text)]">
          Dashboard de deliveries{" "}
        </h2>

        <div className="bg-[var(--elevated)] p-4 rounded-lg w-full mb-4">
          <p className="text-[var(--text)]">
            <strong>ID:</strong> {session.user.id}
          </p>
          <p className="text-[var(--text)]">
            <strong>Email:</strong> {session.user.email}
          </p>
          <p className="text-[var(--text)]">
            <strong>Nombre:</strong> {session.user.name || "Sin nombre"}
          </p>
          <p className="text-[var(--text)]">
            <strong>Role:</strong> {session.user.role}
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="text-white rounded-lg p-2 bg-red-500 hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
