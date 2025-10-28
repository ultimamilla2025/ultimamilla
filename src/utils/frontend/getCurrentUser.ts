//src\utils\frontend\getCurrentUser.ts
// Utilidades de autenticación para usar en Client Components

import { useSession } from "next-auth/react";
import { Role } from "@/generated/prisma";

/**
 * Hook personalizado para obtener la sesión del usuario en Client Components
 * @returns Objeto con la sesión, estado de carga y métodos útiles
 *
 * @example
 * const { user, role, isAdmin, isAuthenticated, isLoading } = useCurrentUser();
 */
export function useCurrentUser() {
  const { data: session, status } = useSession();

  return {
    // Datos del usuario
    user: session?.user || null,
    session: session,

    // Información específica
    email: session?.user?.email || null,
    name: session?.user?.name || null,
    lastName: session?.user?.lastName || null,
    role: session?.user?.role || null,
    id: session?.user?.id || null,

    // Estados
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",

    // Verificadores de rol
    isAdmin: session?.user?.role === Role.ADMIN,
    isDelivery: session?.user?.role === Role.DELIVERY,
    isUser: session?.user?.role === Role.USER,
    isAdminOrDelivery:
      session?.user?.role === Role.ADMIN ||
      session?.user?.role === Role.DELIVERY,

    // Método para verificar roles específicos
    hasRole: (roles: Role[]) => {
      if (!session?.user?.role) return false;
      return roles.includes(session.user.role);
    },

    // Método para verificar si tiene al menos uno de los roles
    hasAnyRole: (...roles: Role[]) => {
      if (!session?.user?.role) return false;
      return roles.includes(session.user.role);
    },

    // Método para verificar si tiene todos los roles (útil para lógica compleja)
    hasAllRoles: (...roles: Role[]) => {
      if (!session?.user?.role) return false;
      // En este caso solo tiene sentido si un usuario puede tener múltiples roles
      // Por ahora retorna true si tiene el rol
      return roles.includes(session.user.role);
    },
  };
}

/**
 * Hook simplificado que solo retorna el usuario o null
 * @returns User object o null
 *
 * @example
 * const user = useUser();
 * if (!user) return <Login />;
 */
export function useUser() {
  const { data: session } = useSession();
  return session?.user || null;
}

/**
 * Hook simplificado que solo retorna el rol del usuario
 * @returns Role o null
 *
 * @example
 * const role = useUserRole();
 * if (role === Role.ADMIN) { ... }
 */
export function useUserRole() {
  const { data: session } = useSession();
  return session?.user?.role || null;
}

/**
 * Hook para verificar si el usuario está autenticado
 * @returns boolean
 *
 * @example
 * const isAuth = useIsAuthenticated();
 * if (!isAuth) return <Redirect to="/login" />;
 */
export function useIsAuthenticated() {
  const { status } = useSession();
  return status === "authenticated";
}

/**
 * Hook para verificar si el usuario es admin
 * @returns boolean
 *
 * @example
 * const isAdmin = useIsAdmin();
 * if (isAdmin) { ... }
 */
export function useIsAdmin() {
  const { data: session } = useSession();
  return session?.user?.role === Role.ADMIN;
}

/**
 * Hook para verificar si el usuario es delivery
 * @returns boolean
 */
export function useIsDelivery() {
  const { data: session } = useSession();
  return session?.user?.role === Role.DELIVERY;
}

/**
 * Hook para verificar si el usuario es admin o delivery
 * @returns boolean
 */
export function useIsAdminOrDelivery() {
  const { data: session } = useSession();
  return (
    session?.user?.role === Role.ADMIN || session?.user?.role === Role.DELIVERY
  );
}
