# ErrorDisplay - Componente de Visualización de Errores

Componente genérico y elegante para mostrar errores de base de datos, errores del servidor, acceso denegado y más.

## 🎨 Características

- ✅ 5 tipos de error predefinidos con estilos únicos
- ✅ Iconos de Lucide React
- ✅ Gradientes y glassmorphism
- ✅ Detalles técnicos (solo en desarrollo)
- ✅ Stack trace colapsable
- ✅ Botón de acción opcional
- ✅ Totalmente responsive
- ✅ Animaciones suaves

## 📖 Tipos de Error

| Tipo            | Color    | Icono         | Uso Recomendado      |
| --------------- | -------- | ------------- | -------------------- |
| `error`         | Rojo     | AlertCircle   | Errores generales    |
| `warning`       | Amarillo | AlertTriangle | Advertencias         |
| `access-denied` | Naranja  | Lock          | Permisos denegados   |
| `database`      | Morado   | Database      | Errores de BD        |
| `server`        | Rojo     | ServerCrash   | Errores del servidor |

## 🚀 Ejemplos de Uso

### 1. Error Básico

```tsx
import ErrorDisplay from "@/app/components/global/ErrorDisplay";

export default function ErrorPage() {
  return (
    <ErrorDisplay
      type="error"
      title="Algo salió mal"
      message="No pudimos completar tu solicitud. Inténtalo nuevamente."
    />
  );
}
```

### 2. Acceso Denegado

```tsx
export default function UnauthorizedPage() {
  return (
    <ErrorDisplay
      type="access-denied"
      title="Acceso Denegado"
      message="No tienes permisos para acceder a esta página."
      action={{
        label: "Volver al inicio",
        onClick: () => router.push("/"),
      }}
    />
  );
}
```

### 3. Error de Base de Datos (con objeto Error)

```tsx
export default async function Page() {
  try {
    const data = await fetchData();
    return <div>{/* ... */}</div>;
  } catch (error) {
    return (
      <ErrorDisplay
        type="database"
        title="Error de Base de Datos"
        message="No pudimos conectar con la base de datos."
        error={error}
        showDetails={true} // Muestra detalles técnicos
      />
    );
  }
}
```

### 4. Error con Respuesta de API

```tsx
export default async function Page() {
  const response = await fetch("/api/users");
  const data = await response.json();

  if (!response.ok) {
    return (
      <ErrorDisplay
        type="server"
        title="Error del Servidor"
        message={data.error || "Ocurrió un error en el servidor"}
        action={{
          label: "Reintentar",
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  return <div>{/* render data */}</div>;
}
```

### 5. Validación de Array (como tu caso)

```tsx
// En page.tsx
export default async function Home() {
  const response = await fetch(`${process.env.BACKEND_URL}/api/user`);
  const data = await response.json();

  if (!Array.isArray(data)) {
    return (
      <ErrorDisplay
        type="access-denied"
        title="Acceso Denegado"
        message={data.error || "No tienes permisos para ver esta página"}
        action={{
          label: "Ir al Dashboard",
          onClick: () => router.push("/dashboard"),
        }}
      />
    );
  }

  return <UserTable users={data} />;
}
```

### 6. Error de Conexión

```tsx
export default function ConnectionError() {
  return (
    <ErrorDisplay
      type="server"
      title="Sin Conexión"
      message="No pudimos conectar con el servidor. Verifica tu conexión a internet."
      action={{
        label: "Reintentar",
        onClick: () => window.location.reload(),
      }}
    />
  );
}
```

### 7. Advertencia (Warning)

```tsx
export default function MaintenancePage() {
  return (
    <ErrorDisplay
      type="warning"
      title="Mantenimiento Programado"
      message="El sistema estará en mantenimiento desde las 22:00 hasta las 02:00 hs."
      action={{
        label: "Entendido",
        onClick: () => router.push("/"),
      }}
    />
  );
}
```

### 8. Con Try-Catch en Server Component

```tsx
export default async function UsersPage() {
  let users;

  try {
    const response = await fetch("/api/users");

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    users = await response.json();

    if (!Array.isArray(users)) {
      throw new Error("Formato de datos inválido");
    }
  } catch (error) {
    return (
      <ErrorDisplay
        type="database"
        title="Error al Cargar Usuarios"
        message="No pudimos cargar la lista de usuarios"
        error={error}
        action={{
          label: "Reintentar",
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  return <UsersList users={users} />;
}
```

### 9. Error en Client Component

```tsx
"use client";

import { useEffect, useState } from "react";
import ErrorDisplay from "@/app/components/global/ErrorDisplay";

export default function ClientPage() {
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then(setData)
      .catch(setError);
  }, []);

  if (error) {
    return (
      <ErrorDisplay
        type="error"
        title="Error al Cargar Datos"
        message="Ocurrió un problema al cargar la información"
        error={error}
        action={{
          label: "Reintentar",
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  if (!data) return <div>Cargando...</div>;

  return <div>{/* render data */}</div>;
}
```

### 10. Personalizado con className

```tsx
export default function CustomError() {
  return (
    <ErrorDisplay
      type="error"
      title="Error Personalizado"
      message="Este error tiene estilos personalizados"
      className="bg-gradient-to-br from-black via-gray-900 to-black"
    />
  );
}
```

## 🎯 Props

| Prop          | Tipo                                                                | Default          | Descripción               |
| ------------- | ------------------------------------------------------------------- | ---------------- | ------------------------- |
| `type`        | `'error' \| 'warning' \| 'access-denied' \| 'database' \| 'server'` | `'error'`        | Tipo de error             |
| `title`       | `string`                                                            | Varía según tipo | Título principal          |
| `message`     | `string`                                                            | -                | Mensaje descriptivo       |
| `error`       | `Error \| unknown`                                                  | -                | Objeto de error JS        |
| `showDetails` | `boolean`                                                           | `true` en dev    | Mostrar detalles técnicos |
| `className`   | `string`                                                            | `''`             | Clases CSS adicionales    |
| `action`      | `{ label: string; onClick: () => void }`                            | -                | Botón de acción           |

## 💡 Tips

1. **Usa `showDetails={false}` en producción** para no exponer información sensible
2. **El componente detecta automáticamente** si estás en desarrollo
3. **Los detalles técnicos solo se muestran** si pasas un objeto `error`
4. **El stack trace está colapsado** por defecto para no abrumar
5. **Usa el tipo correcto** para cada situación (mejora UX)

## 🎨 Personalización

Puedes sobrescribir estilos con `className` o editar directamente el componente para agregar más tipos de error o personalizar los colores.

## ✅ Checklist de Uso

- [ ] Importar el componente
- [ ] Elegir el tipo de error apropiado
- [ ] Escribir un mensaje claro y amigable
- [ ] Agregar una acción si es necesario
- [ ] Desactivar `showDetails` en producción si es necesario
