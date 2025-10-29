import { cookies } from "next/headers";

interface FetchWithAuthOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: object;
}

export async function fetchWithAuth(
  endpoint: string,
  options: FetchWithAuthOptions = {}
) {
  const { method = "GET", body } = options;

  // Obtener todas las cookies de la sesión
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  // Construir la URL completa
  const url = `${process.env.BACKEND_URL}${endpoint}`;

  // Configurar las opciones del fetch
  const fetchOptions: RequestInit = {
    method,
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  };

  // Agregar body solo si existe y no es GET
  if (body && method !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }

  // Realizar la petición
  const response = await fetch(url, fetchOptions);
  const data = await response.json();

  return data;
}
