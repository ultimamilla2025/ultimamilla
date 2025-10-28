//src\utils\backend\getCurrentUser.ts
// Utilidades de autenticación para usar en Server Components y API Routes

import { auth } from "@/lib/auth";
import { Role } from "@/generated/prisma";
import { redirect } from "next/navigation";

/**
 * Obtiene la sesión del usuario actual
 * @returns Session object o null si no hay sesión
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}

/**
 * Obtiene la sesión del usuario actual o redirige a login si no existe
 * @param redirectTo - Ruta a la que redirigir si no hay sesión (default: "/login")
 */
export async function requireAuth(redirectTo: string = "/login") {
  const session = await auth();

  if (!session?.user) {
    redirect(redirectTo);
  }

  return session.user;
}

/**
 * Verifica si el usuario actual tiene uno de los roles permitidos
 * @param allowedRoles - Array de roles permitidos
 * @returns true si el usuario tiene uno de los roles, false en caso contrario
 */
export async function hasRole(allowedRoles: Role[]): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user || !user.role) {
    return false;
  }

  return allowedRoles.includes(user.role);
}

/**
 * Requiere que el usuario tenga uno de los roles especificados, o redirige
 * @param allowedRoles - Array de roles permitidos
 * @param redirectTo - Ruta a la que redirigir si no tiene permiso (default: "/dashboard")
 */
export async function requireRole(
  allowedRoles: Role[],
  redirectTo: string = "/dashboard"
) {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    redirect(redirectTo);
  }

  return user;
}

/**
 * Verifica si el usuario es ADMIN
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole([Role.ADMIN]);
}

/**
 * Verifica si el usuario es ADMIN o DELIVERY
 */
export async function isAdminOrDelivery(): Promise<boolean> {
  return hasRole([Role.ADMIN, Role.DELIVERY]);
}

/**
 * Requiere que el usuario sea ADMIN o lanza error/redirige
 */
export async function requireAdmin(redirectTo: string = "/dashboard") {
  return requireRole([Role.ADMIN], redirectTo);
}

/**
 * Para API Routes: Verifica autenticación y devuelve Response si falla
 * Uso: const user = await apiRequireAuth() || return;
 */
export async function apiRequireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  return null; // null = success, continúa con la lógica
}

/**
 * Para API Routes: Verifica rol y devuelve Response si falla
 * Uso: const error = await apiRequireRole([Role.ADMIN]); if (error) return error;
 */
export async function apiRequireRole(allowedRoles: Role[]) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  if (!allowedRoles.includes(user.role)) {
    return Response.json(
      { error: "No tienes permisos para esta acción" },
      { status: 403 }
    );
  }

  return null; // null = success, continúa con la lógica
}
