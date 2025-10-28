// src/utils/frontend/EXAMPLES.md
// Ejemplos de uso de las utilidades de autenticación en el frontend

## 📚 Guía de Uso - Frontend Auth Utils

### 🎯 Hook Principal: `useCurrentUser()`

```typescript
"use client";
import { useCurrentUser } from "@/utils/frontend";

export default function MyComponent() {
  const {
    user, // Usuario completo
    role, // Rol del usuario
    email, // Email del usuario
    name, // Nombre del usuario
    isAdmin, // true si es ADMIN
    isDelivery, // true si es DELIVERY
    isUser, // true si es USER
    isAuthenticated, // true si está autenticado
    isLoading, // true mientras carga la sesión
    hasRole, // Función para verificar roles
  } = useCurrentUser();

  // Mostrar loader mientras carga
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return <div>Debes iniciar sesión</div>;
  }

  // Renderizado condicional por rol
  return (
    <div>
      <h1>Hola, {name || email}</h1>
      <p>Tu rol es: {role}</p>

      {isAdmin && <AdminPanel />}
      {isDelivery && <DeliveryPanel />}
      {isUser && <UserPanel />}
    </div>
  );
}
```

### 🔍 Hook Simplificado: `useUser()`

```typescript
"use client";
import { useUser } from "@/utils/frontend";

export default function ProfileComponent() {
  const user = useUser();

  if (!user) return <div>No autenticado</div>;

  return (
    <div>
      <p>Email: {user.email}</p>
      <p>Nombre: {user.name}</p>
      <p>Rol: {user.role}</p>
    </div>
  );
}
```

### 🎭 Hook de Rol: `useUserRole()`

```typescript
"use client";
import { useUserRole } from "@/utils/frontend";
import { Role } from "@/generated/prisma";

export default function DashboardSelector() {
  const role = useUserRole();

  if (!role) return null;

  switch (role) {
    case Role.ADMIN:
      return <AdminDashboard />;
    case Role.DELIVERY:
      return <DeliveryDashboard />;
    case Role.USER:
      return <UserDashboard />;
    default:
      return <DefaultDashboard />;
  }
}
```

### ✅ Hooks de Verificación

```typescript
"use client";
import {
  useIsAdmin,
  useIsDelivery,
  useIsAuthenticated,
} from "@/utils/frontend";

export default function ConditionalComponent() {
  const isAdmin = useIsAdmin();
  const isDelivery = useIsDelivery();
  const isAuth = useIsAuthenticated();

  return (
    <div>
      {isAuth && <p>Estás autenticado</p>}
      {isAdmin && <button>Panel de Admin</button>}
      {isDelivery && <button>Gestionar Entregas</button>}
    </div>
  );
}
```

### 🎨 Ejemplo Completo: Navbar con Permisos

```typescript
"use client";
import { useCurrentUser } from "@/utils/frontend";
import Link from "next/link";
import { Role } from "@/generated/prisma";

export default function NavigationMenu() {
  const {
    isAuthenticated,
    isLoading,
    isAdmin,
    isDelivery,
    hasRole,
    name,
    email,
  } = useCurrentUser();

  if (isLoading) return <div>Cargando menú...</div>;

  if (!isAuthenticated) return <LoginButton />;

  return (
    <nav>
      <p>Bienvenido, {name || email}</p>

      {/* Visible para todos */}
      <Link href="/dashboard">Dashboard</Link>

      {/* Solo para Admin */}
      {isAdmin && (
        <>
          <Link href="/admin/users">Usuarios</Link>
          <Link href="/admin/settings">Configuración</Link>
        </>
      )}

      {/* Para Admin y Delivery */}
      {hasRole([Role.ADMIN, Role.DELIVERY]) && (
        <Link href="/deliveries">Entregas</Link>
      )}

      {/* Solo para Delivery */}
      {isDelivery && <Link href="/my-deliveries">Mis Entregas</Link>}
    </nav>
  );
}
```

### 🚀 Ejemplo: Componente Protegido

```typescript
"use client";
import { useCurrentUser } from "@/utils/frontend";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, isAdmin } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
    if (!isLoading && isAuthenticated && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading) return <div>Cargando...</div>;
  if (!isAuthenticated) return null;
  if (!isAdmin) return null;

  return (
    <div>
      <h1>Panel de Administración</h1>
      {/* Contenido solo para admins */}
    </div>
  );
}
```

### 🎯 Ejemplo: Botón Condicional

```typescript
"use client";
import { useCurrentUser } from "@/utils/frontend";
import { Role } from "@/generated/prisma";

export default function ActionButton() {
  const { hasRole, isLoading } = useCurrentUser();

  if (isLoading) return <button disabled>Cargando...</button>;

  const canDelete = hasRole([Role.ADMIN]);
  const canEdit = hasRole([Role.ADMIN, Role.DELIVERY]);

  return (
    <div>
      {canEdit && <button>Editar</button>}
      {canDelete && <button className="danger">Eliminar</button>}
    </div>
  );
}
```

### 📊 Ejemplo: Dashboard Dinámico

```typescript
"use client";
import { useCurrentUser } from "@/utils/frontend";

export default function DynamicDashboard() {
  const { user, isAdmin, isDelivery, isUser, isLoading } = useCurrentUser();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard - {user?.name}</h1>

      <div className="widgets">
        {/* Widget para todos */}
        <ProfileWidget user={user} />

        {/* Widgets específicos por rol */}
        {isAdmin && (
          <>
            <UsersStatsWidget />
            <SystemHealthWidget />
            <RevenueWidget />
          </>
        )}

        {isDelivery && (
          <>
            <MyDeliveriesWidget />
            <RouteMapWidget />
          </>
        )}

        {isUser && (
          <>
            <MyOrdersWidget />
            <TrackingWidget />
          </>
        )}
      </div>
    </div>
  );
}
```

## 🎯 Resumen de Hooks

| Hook                     | Retorna                  | Uso Principal                |
| ------------------------ | ------------------------ | ---------------------------- |
| `useCurrentUser()`       | Objeto completo con todo | Hook principal, más completo |
| `useUser()`              | Usuario o null           | Acceso rápido al usuario     |
| `useUserRole()`          | Role o null              | Solo necesitas el rol        |
| `useIsAuthenticated()`   | boolean                  | Verificar si está logueado   |
| `useIsAdmin()`           | boolean                  | Verificar si es admin        |
| `useIsDelivery()`        | boolean                  | Verificar si es delivery     |
| `useIsAdminOrDelivery()` | boolean                  | Verificar múltiples roles    |

## ✅ Ventajas de estos Hooks

- ✨ TypeScript completo con tipos seguros
- 🎯 Múltiples niveles de abstracción según necesidad
- 🚀 Optimizados con Next-Auth
- 📦 Fáciles de importar y usar
- 🔒 Seguros y verificados
- 🎨 Perfectos para renderizado condicional
