# 🎨 Personalización de DataTable - Mobile vs Desktop

## Nuevas Propiedades de Columnas

El `DataTable` ahora soporta clases CSS diferenciadas para mobile y desktop:

### `desktopClassName`

Clases CSS que se aplican **solo en vista de tabla** (desktop/tablet, ≥768px).
Sobrescribe `className` y `headerClassName` en desktop.

### `mobileClassName`

Clases CSS que se aplican **solo en vista de tarjetas** (mobile, <768px).
Útil para controlar el orden de los elementos con flexbox.

---

## 📖 Ejemplo: Reordenar columnas en mobile

```tsx
const columns: Column<User>[] = [
  {
    key: "id",
    header: "ID",
    desktopClassName: "max-w-[100px]", // Ancho limitado en desktop
    mobileClassName: "order-4", // Se muestra AL FINAL en mobile
  },
  {
    key: "name",
    header: "Nombre",
    mobileClassName: "order-1", // Se muestra PRIMERO en mobile
  },
  {
    key: "email",
    header: "Email",
    mobileClassName: "order-2", // Se muestra SEGUNDO en mobile
  },
  {
    key: "role",
    header: "Rol",
    mobileClassName: "order-3", // Se muestra TERCERO en mobile
  },
];
```

**Resultado en Mobile:**

1. Nombre
2. Email
3. Rol
4. ID (al final)

**Resultado en Desktop:**
Orden normal: ID, Nombre, Email, Rol

---

## 🎯 Ejemplo: Alineación diferente por dispositivo

```tsx
const columns: Column<Product>[] = [
  {
    key: "price",
    header: "Precio",
    desktopClassName: "text-right", // Alineado a la derecha en desktop
    mobileClassName: "text-left", // Alineado a la izquierda en mobile
  },
  {
    key: "actions",
    header: "Acciones",
    desktopClassName: "text-right w-20", // Columna estrecha en desktop
    // En mobile se muestra como botón flotante (esquina superior derecha)
  },
];
```

---

## 🔥 Ejemplo: Ocultar columnas en mobile

```tsx
const columns: Column<User>[] = [
  {
    key: "details",
    header: "Detalles",
    desktopClassName: "block", // Visible en desktop
    mobileClassName: "hidden", // Oculto en mobile
  },
];
```

---

## 📱 Comportamiento de la Columna "actions"

La columna con `key: "actions"` tiene un comportamiento especial:

### En Desktop:

- Se muestra como columna normal en la tabla
- Recomendado: `desktopClassName: "text-right w-20"`

### En Mobile:

- Se renderiza como **botón flotante** en la esquina superior derecha
- **NO muestra el texto "Acciones"**, solo el ícono de 3 puntos
- Se posiciona con `absolute top-2 right-2 z-10`
- Al hacer clic, el menú aparece con backdrop blur

---

## 🎨 Jerarquía de Clases CSS

### Para Headers (desktop):

```
desktopClassName > headerClassName > (clases base)
```

### Para Celdas (desktop):

```
desktopClassName > className > (clases base)
```

### Para Cards (mobile):

```
mobileClassName > (clases base)
```

---

## 💡 Tips de Uso

### 1. Usar `order-*` para reordenar en mobile

```tsx
mobileClassName: "order-1"; // Primero
mobileClassName: "order-2"; // Segundo
mobileClassName: "order-last"; // Último
```

### 2. Controlar ancho de columnas en desktop

```tsx
desktopClassName: "w-20"; // Columna estrecha
desktopClassName: "min-w-[200px]"; // Ancho mínimo
desktopClassName: "max-w-[100px]"; // Ancho máximo
```

### 3. Alineación

```tsx
desktopClassName: "text-right"; // Derecha
desktopClassName: "text-center"; // Centro
mobileClassName: "text-left"; // Izquierda en mobile
```

### 4. Visibilidad condicional

```tsx
desktopClassName: "hidden md:table-cell"; // Solo desktop
mobileClassName: "block md:hidden"; // Solo mobile
```

---

## ⚠️ Notas Importantes

1. **No uses `className` y `desktopClassName` juntas** para la misma propiedad

   - `desktopClassName` sobrescribe `className` en desktop
   - Usa solo `desktopClassName` si quieres comportamiento diferente

2. **La columna "actions" NO usa `mobileClassName`**

   - Su posicionamiento en mobile está hardcodeado (esquina superior derecha)
   - Solo afecta `desktopClassName` para la vista de tabla

3. **`mobileClassName` se aplica al contenedor de cada field**
   - El contenedor es un `<div>` con `flex flex-col gap-1`
   - Puedes usar `order-*`, `hidden`, `text-*`, etc.

---

## 🚀 Ejemplo Completo

Ver `UserTable.tsx` para un ejemplo completo de implementación.
