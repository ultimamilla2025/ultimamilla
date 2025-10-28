# 🔐 Sistema de Autenticación - Documentación

## Índice

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Componentes Principales](#componentes-principales)
4. [Flujo de Autenticación](#flujo-de-autenticación)
5. [Roles y Permisos](#roles-y-permisos)
6. [Configuración](#configuración)
7. [API Endpoints](#api-endpoints)
8. [Hooks Personalizados](#hooks-personalizados)
9. [Protección de Rutas](#protección-de-rutas)
10. [Ejemplos de Uso](#ejemplos-de-uso)

---

## Descripción General

Sistema de autenticación completo implementado con **NextAuth v5**, **Prisma**, **bcryptjs** y **react-hook-form + zod** para validación de formularios.

### Características principales:

- ✅ Login y registro de usuarios
- ✅ Sistema de roles (ADMIN, USER, DELIVERY)
- ✅ Validación de formularios con Zod
- ✅ Redirección automática según rol
- ✅ Protección de rutas por rol
- ✅ Recordar email del usuario (localStorage)
- ✅ Sesiones JWT
- ✅ Contraseñas hasheadas con bcrypt

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  LoginForm Component                                  │  │
│  │  - react-hook-form + zod validation                   │  │
│  │  - Modo: login | register                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  NextAuth (signIn, getSession)                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVIDOR (Next.js)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes                                           │  │
│  │  - /api/auth/[...nextauth]  → NextAuth handler       │  │
│  │  - /api/user (POST)          → Registro usuarios     │  │
│  │  - /api/user (GET)           → Listar usuarios       │  │
│  │  - /api/user/[userId]        → CRUD individual       │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  auth.ts (NextAuth Config)                            │  │
│  │  - Credentials Provider                               │  │
│  │  - JWT Strategy                                       │  │
│  │  - Callbacks (jwt, session)                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Prisma Client                                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  User Model                                           │  │
│  │  - id, email, name, lastName, password, role          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Componentes Principales

### 1. **LoginForm Component**

**Ubicación:** `src/components/forms/login-form.tsx`

Componente reutilizable para login y registro.

#### Props:

```typescript
type LoginFormProps = {
  mode?: "login" | "register"; // Por defecto: "login"
  className?: string;
};
```

#### Características:

- **Modo Login:**
  - Campos: email, password
  - Checkbox "Recordar mi email"
  - Redirección automática según rol
- **Modo Register:**
  - Campos: name, lastName, email, password
  - Role forzado a USER
  - Auto-login después del registro
  - Validación manual de campos obligatorios

#### Validación con Zod:

```typescript
const loginSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  name: z.string().optional(),
  lastName: z.string().optional(),
});
```

#### Redirección por Rol:

```typescript
const redirectByRole = (role: Role) => {
  switch (role) {
    case Role.ADMIN:
      router.push("/backoffice");
      break;
    case Role.DELIVERY:
      router.push("/dashboard/deliveryDashboard");
      break;
    case Role.USER:
    default:
      router.push("/dashboard/userDashboard");
      break;
  }
};
```

---

### 2. **NextAuth Configuration**

**Ubicación:** `src/lib/auth.ts`

#### Configuración Principal:

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Validar credenciales
        // Buscar usuario en DB
        // Verificar contraseña con bcrypt
        // Retornar usuario sin password
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.lastName = user.lastName;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.lastName = token.lastName as string;
      session.user.role = token.role as Role;
      return session;
    },
  },
});
```

#### Proceso de Autenticación:

1. Usuario envía credenciales
2. `authorize()` valida credenciales contra la DB
3. Si es válido, se crea un JWT con los datos del usuario
4. JWT se guarda en cookie de sesión
5. En cada request, el callback `session()` reconstruye la sesión desde el JWT

---

### 3. **Tipos TypeScript**

**Ubicación:** `src/types/next-auth.d.ts`

Extensión de tipos de NextAuth para incluir campos personalizados:

```typescript
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    lastName: string;
    name: string;
    role: Role;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      lastName: string;
      name: string;
      role: Role;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    lastName: string;
    role: Role;
  }
}
```

---

## Flujo de Autenticación

### 🔵 Flujo de Login

```
1. Usuario ingresa credenciales en LoginForm
   ↓
2. Validación con Zod (formato email, longitud password)
   ↓
3. signIn("credentials", { email, password, redirect: false })
   ↓
4. NextAuth llama a authorize() en auth.ts
   ↓
5. Busca usuario en DB por email (Prisma)
   ↓
6. Verifica password con bcrypt.compareSync()
   ↓
7. Si es válido: retorna usuario (sin password)
   ↓
8. Callback jwt() guarda datos en token
   ↓
9. Callback session() construye sesión desde token
   ↓
10. getSession() obtiene sesión fresca con role
    ↓
11. redirectByRole(role) redirige según rol
```

### 🟢 Flujo de Registro

```
1. Usuario completa formulario de registro
   ↓
2. Validación manual (name, lastName requeridos)
   ↓
3. POST a /api/user con role: "USER" forzado
   ↓
4. API hashea password con bcrypt.hashSync()
   ↓
5. Crea usuario en DB con Prisma
   ↓
6. Auto-login con signIn()
   ↓
7. Sigue flujo de login desde paso 8
```

---

## Roles y Permisos

### Roles Disponibles:

```typescript
enum Role {
  USER, // Usuario estándar
  ADMIN, // Administrador
  DELIVERY, // Repartidor
}
```

### Matriz de Permisos:

| Ruta                           | USER | DELIVERY | ADMIN |
| ------------------------------ | ---- | -------- | ----- |
| `/dashboard/userDashboard`     | ✅   | ❌       | ✅    |
| `/dashboard/deliveryDashboard` | ❌   | ✅       | ✅    |
| `/backoffice`                  | ❌   | ❌       | ✅    |

### Redirección Post-Login:

| Rol      | Destino                        |
| -------- | ------------------------------ |
| USER     | `/dashboard/userDashboard`     |
| DELIVERY | `/dashboard/deliveryDashboard` |
| ADMIN    | `/backoffice`                  |

---

## Configuración

### Variables de Entorno Requeridas:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secret_key_super_secreta

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/db"
```

### Instalación de Dependencias:

```bash
npm install next-auth@beta bcryptjs
npm install -D @types/bcryptjs
npm install react-hook-form zod @hookform/resolvers
npm install @prisma/client
npm install -D prisma
```

---

## API Endpoints

### 1. **POST /api/user** - Crear Usuario (Registro)

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "123456",
  "name": "Juan",
  "lastName": "Pérez",
  "role": "USER" // Forzado a USER desde el frontend
}
```

**Response (201):**

```json
{
  "message": "Usuario creado exitosamente",
  "usuario": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Juan",
    "lastName": "Pérez",
    "role": "USER"
  }
}
```

**Response (400/500):**

```json
{
  "error": "Descripción del error"
}
```

---

### 2. **GET /api/user** - Listar Usuarios (Solo ADMIN)

**Headers:**

```
Cookie: next-auth.session-token=xxx
```

**Response (200):**

```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Juan",
    "lastName": "Pérez",
    "role": "USER",
    "password": "hashed_password"
  }
]
```

**Response (403):**

```json
{
  "error": "No tienes permiso para ver los usuarios"
}
```

---

### 3. **GET /api/user/[userId]** - Obtener Usuario

**Response (200):**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Juan",
  "lastName": "Pérez",
  "role": "USER"
}
```

---

### 4. **PUT /api/user/[userId]** - Actualizar Usuario

**Request Body:**

```json
{
  "email": "newemail@example.com",
  "name": "Juan",
  "lastName": "Pérez",
  "role": "DELIVERY"
}
```

---

### 5. **DELETE /api/user/[userId]** - Eliminar Usuario

**Response (200):**

```json
{
  "message": "Usuario eliminado exitosamente"
}
```

---

## Hooks Personalizados

### `useCurrentUser()` - Hook Principal

**Ubicación:** `src/utils/frontend/getCurrentUser.ts`

Hook completo para obtener información del usuario autenticado en **Client Components**.

```typescript
const {
  user, // Usuario completo
  session, // Sesión completa
  email, // Email del usuario
  name, // Nombre
  lastName, // Apellido
  role, // Rol del usuario
  id, // ID del usuario
  isLoading, // true mientras carga la sesión
  isAuthenticated, // true si está autenticado
  isUnauthenticated, // true si NO está autenticado
  isAdmin, // true si es ADMIN
  isDelivery, // true si es DELIVERY
  isUser, // true si es USER
  isAdminOrDelivery, // true si es ADMIN o DELIVERY
  hasRole, // Función para verificar roles
  hasAnyRole, // Función para verificar si tiene algún rol
  hasAllRoles, // Función para verificar todos los roles
} = useCurrentUser();
```

#### Ejemplo de Uso:

```tsx
"use client";

import { useCurrentUser } from "@/utils/frontend/getCurrentUser";

export default function ProfilePage() {
  const { user, isLoading, isAdmin } = useCurrentUser();

  if (isLoading) return <div>Cargando...</div>;
  if (!user) return <div>No autenticado</div>;

  return (
    <div>
      <h1>Perfil de {user.name}</h1>
      <p>Email: {user.email}</p>
      {isAdmin && <button>Panel de Administración</button>}
    </div>
  );
}
```

---

### Otros Hooks Disponibles:

#### `useUser()` - Usuario simplificado

```typescript
const user = useUser(); // User object o null
```

#### `useUserRole()` - Solo el rol

```typescript
const role = useUserRole(); // Role o null
```

#### `useIsAuthenticated()` - Estado de autenticación

```typescript
const isAuth = useIsAuthenticated(); // boolean
```

#### `useIsAdmin()` - Verificar si es admin

```typescript
const isAdmin = useIsAdmin(); // boolean
```

#### `useIsDelivery()` - Verificar si es delivery

```typescript
const isDelivery = useIsDelivery(); // boolean
```

#### `useIsAdminOrDelivery()` - Verificar si es admin o delivery

```typescript
const isAdminOrDelivery = useIsAdminOrDelivery(); // boolean
```

---

## Protección de Rutas

### Opción 1: Protección en Layout (Client Component)

```tsx
"use client";

import { Role } from "@/generated/prisma";
import { useCurrentUser } from "@/utils/frontend/getCurrentUser";
import { unauthorized } from "next/navigation";

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isLoading } = useCurrentUser();

  // Esperar a que cargue la sesión
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Verificar permisos
  if (role !== Role.ADMIN) {
    unauthorized(); // Redirige a /unauthorized
  }

  return <div>{children}</div>;
}
```

---

### Opción 2: Protección con Middleware

```typescript
// src/middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Rutas protegidas
  if (pathname.startsWith("/backoffice")) {
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/backoffice/:path*", "/dashboard/:path*"],
};
```

---

### Opción 3: Protección en Server Component

```tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return <div>Panel de Administración</div>;
}
```

---

## Ejemplos de Uso

### 1. Página de Login

```tsx
// src/app/login/page.tsx
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-4xl">
        <LoginForm mode="login" />
      </div>
    </div>
  );
}
```

---

### 2. Página de Registro

```tsx
// src/app/register/page.tsx
import { LoginForm } from "@/components/forms/login-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-4xl">
        <LoginForm mode="register" />
      </div>
    </div>
  );
}
```

---

### 3. Dashboard Protegido

```tsx
// src/app/dashboard/userDashboard/page.tsx
"use client";

import { useCurrentUser } from "@/utils/frontend/getCurrentUser";
import { signOut } from "next-auth/react";

export default function UserDashboard() {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) return <div>Cargando...</div>;
  if (!user) return <div>No autenticado</div>;

  return (
    <div>
      <h1>Dashboard de {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Rol: {user.role}</p>
      <button onClick={() => signOut()}>Cerrar Sesión</button>
    </div>
  );
}
```

---

### 4. Verificación de Roles en Componentes

```tsx
"use client";

import { useCurrentUser } from "@/utils/frontend/getCurrentUser";

export default function ActionButtons() {
  const { isAdmin, isDelivery } = useCurrentUser();

  return (
    <div>
      {isAdmin && <button>Acceso Administrador</button>}
      {isDelivery && <button>Ver Entregas</button>}
      <button>Acción General</button>
    </div>
  );
}
```

---

### 5. Formulario de Edición de Usuario

```tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  lastName: z.string().min(1, "Apellido requerido"),
  email: z.string().email("Email inválido"),
  role: z.enum(["USER", "ADMIN", "DELIVERY"]),
});

type UserFormInputs = z.infer<typeof userSchema>;

export default function EditUserForm({ userId }: { userId: string }) {
  const { control, handleSubmit } = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormInputs) => {
    const response = await fetch(`/api/user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Usuario actualizado");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>{/* Campos del formulario */}</form>
  );
}
```

---

## Seguridad

### ✅ Implementado:

1. **Contraseñas Hasheadas:**

   - Uso de bcryptjs con salt rounds (10)
   - Nunca se almacenan contraseñas en texto plano
   - Nunca se devuelven contraseñas en las respuestas

2. **Sesiones JWT:**

   - Tokens firmados y encriptados
   - Expiración automática
   - Almacenados en httpOnly cookies

3. **Validación de Entrada:**

   - Validación con Zod en el frontend
   - Validación adicional en el backend

4. **Protección de Rutas:**

   - Middleware para rutas protegidas
   - Verificación de roles en layouts
   - Redirección automática si no autorizado

5. **Role Enforcement:**
   - Los registros nuevos siempre son USER
   - Solo ADMIN puede crear otros roles
   - Verificación de permisos en cada endpoint

### 🔒 Recomendaciones Adicionales:

1. **Rate Limiting:**

   ```typescript
   // Implementar límite de intentos de login
   // Usar paquetes como express-rate-limit
   ```

2. **CSRF Protection:**

   ```typescript
   // NextAuth maneja CSRF automáticamente
   // Asegurar que esté habilitado en producción
   ```

3. **HTTPS en Producción:**

   ```env
   NEXTAUTH_URL=https://tudominio.com
   ```

4. **Variables de Entorno Seguras:**
   ```env
   # Usar secretos fuertes y únicos
   NEXTAUTH_SECRET=<generar_con_openssl_rand_base64_32>
   ```

---

## Troubleshooting

### Problema: El rol llega como null

**Solución:** Asegurarse de que los callbacks jwt y session estén configurados correctamente y que todos los campos se copien del user al token y del token a la sesión.

```typescript
// ✅ Correcto
async jwt({ token, user }) {
  if (user) {
    token.role = user.role;  // Copiar role al token
  }
  return token;
}

async session({ session, token }) {
  session.user.role = token.role as Role;  // Copiar role a session
  return session;
}
```

---

### Problema: El layout redirige constantemente

**Solución:** Esperar a que la sesión termine de cargar antes de verificar permisos.

```typescript
// ✅ Correcto
const { role, isLoading } = useCurrentUser();

if (isLoading) {
  return <div>Cargando...</div>; // Esperar
}

// Solo después de cargar, verificar
if (role !== Role.ADMIN) {
  unauthorized();
}
```

---

### Problema: El navegador autocompleta la contraseña

**Causa:** Los navegadores modernos tienen gestores de contraseñas que ignoran `autoComplete="off"` por seguridad.

**Soluciones parciales:**

```tsx
// En el formulario
<form autoComplete="off">

// En el campo de password
<input
  type="password"
  autoComplete="new-password"  // Le dice que es una nueva contraseña
/>
```

**Nota:** El autocompletado del navegador es una característica de seguridad que no se puede desactivar completamente desde código. El usuario debe desactivarlo manualmente en la configuración del navegador.

---

### Problema: La redirección no funciona según el rol

**Solución:** Usar `getSession()` para obtener una sesión fresca después del login.

```typescript
// ✅ Correcto
const result = await signIn("credentials", {
  email,
  password,
  redirect: false,
});

if (result?.ok) {
  const freshSession = await getSession(); // Sesión fresca
  const userRole = freshSession?.user?.role || Role.USER;
  redirectByRole(userRole);
}
```

---

## Testing

### Usuarios de Prueba (después de ejecutar semilla):

| Email             | Password | Role     |
| ----------------- | -------- | -------- |
| alice@prisma.io   | 123456   | ADMIN    |
| bob@prisma.io     | 123456   | USER     |
| charlie@prisma.io | 123456   | DELIVERY |

### Ejecutar Semilla:

```bash
npm run semilla
```

---

## Changelog

### v1.0.0 - Implementación Inicial

- ✅ Sistema de login y registro
- ✅ Roles: USER, ADMIN, DELIVERY
- ✅ Validación con Zod
- ✅ Protección de rutas
- ✅ Hooks personalizados
- ✅ Redirección por rol
- ✅ Recordar email

---

## Recursos Adicionales

- [NextAuth Documentation](https://authjs.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)

---

## Contacto y Soporte

Para dudas o problemas, consultar la documentación adicional en:

- `docs/CUSTOMIZATION.md`
- `docs/ERROR_DISPLAY_DOCS.md`
- `docs/formdemo/` - Ejemplos de formularios

---

**Última actualización:** Octubre 2025
**Versión:** 1.0.0
