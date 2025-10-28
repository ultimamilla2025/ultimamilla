import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-6xl">401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
      <Link
        href={"/"}
        className="bg-blue-500 rounded text-white hover:bg-blue-400 transition-all p-2 mt-2"
      >
        INICIO
      </Link>
    </main>
  );
}
