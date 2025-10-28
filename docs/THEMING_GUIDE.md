# Sistema de Theming - Última Milla

Este documento describe el sistema de theming simplificado implementado en la plataforma Última Milla.

## 📁 Archivos principales

- **`src/app/globals.css`** - ⭐ Variables CSS (aquí cambias los colores)
- **`src/context/ThemeContext.tsx`** - Contexto React para manejar el tema
- **`src/components/global/ThemeToggle.tsx`** - Componente para cambiar de tema

## 🎨 Cómo Cambiar Colores

Para cambiar los colores del theming, edita **`src/app/globals.css`**:

```css
/* Tema Claro */
:root {
  --background: #ffffff; /* Cambia estos valores */
  --surface: #f9fafb;
  --elevated: #ffffff;
  --text: #111827;
  --textmuted: #6b7280;
  --borders: #e5e7eb;

  --primary: #3b82f6; /* Colores de marca */
  --secondary: #8b5cf6;
  --accent: #06b6d4;

  --success: #10b981; /* Colores de estado */
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #0ea5e9;
}

/* Tema Oscuro */
.dark {
  --background: #000000; /* Cambia estos valores */
  --surface: #171717;
  --elevated: #262626;
  --text: #ffffff;
  --textmuted: #a3a3a3;
  --borders: rgba(255, 255, 255, 0.1);

  /* Brand & Status pueden ser iguales o diferentes */
}
```

## 🎨 Variables CSS Disponibles

Todas las variables funcionan automáticamente para **tema claro y oscuro**.

### Backgrounds

```css
--background   /* Fondo principal de la aplicación */
--surface      /* Superficies (tarjetas, paneles) */
--elevated     /* Elementos elevados (modales, navbar) */
```

### Text

```css
--text         /* Texto principal */
--textmuted    /* Texto secundario (descripciones) */
```

### Borders

```css
--borders      /* Bordes */
```

### Brand Colors

```css
--primary      /* Azul #3B82F6 - Color principal */
--secondary    /* Púrpura #8B5CF6 - Color secundario */
--accent       /* Cyan #06B6D4 - Color de acento */
```

### Status

```css
--success      /* Verde #10B981 - Éxito */
--warning      /* Naranja #F59E0B - Advertencias */
--error        /* Rojo #EF4444 - Errores */
--info         /* Azul cielo #0EA5E9 - Información */
```

## 💡 Uso en Tailwind CSS

### Ejemplos básicos

#### Backgrounds

```tsx
<div className="bg-[var(--background)]">Fondo principal</div>
<div className="bg-[var(--surface)]">Superficie</div>
<div className="bg-[var(--elevated)]">Elemento elevado</div>
```

#### Text

```tsx
<h1 className="text-[var(--text)]">Título Principal</h1>
<p className="text-[var(--textmuted)]">Descripción secundaria</p>
```

#### Borders

```tsx
<div className="border border-[var(--borders)]">Elemento con borde</div>
```

#### Buttons

```tsx
{
  /* Primary button */
}
<button className="bg-[var(--primary)] text-white hover:opacity-90">
  Click me
</button>;

{
  /* Secondary button */
}
<button className="bg-transparent border border-[var(--borders)] text-[var(--text)] hover:bg-[var(--surface)]">
  Secondary
</button>;

{
  /* Success button */
}
<button className="bg-[var(--success)] text-white">Guardar</button>;
```

#### Status Messages

```tsx
{
  /* Success */
}
<div className="bg-[var(--success)]/10 border border-[var(--success)]/20 text-[var(--success)]">
  ✓ Operación exitosa
</div>;

{
  /* Error */
}
<div className="bg-[var(--error)]/10 border border-[var(--error)]/20 text-[var(--error)]">
  ✗ Error en la operación
</div>;

{
  /* Warning */
}
<div className="bg-[var(--warning)]/10 border border-[var(--warning)]/20 text-[var(--warning)]">
  ⚠ Advertencia
</div>;
```

#### Gradients

```tsx
{
  /* Gradient de marca */
}
<div className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
  Gradiente
</div>;

{
  /* Texto con gradiente */
}
<h1 className="bg-gradient-to-r from-[var(--text)] to-[var(--textmuted)] bg-clip-text text-transparent">
  Título con gradiente
</h1>;
```

#### Opacity

```tsx
<div className="bg-[var(--primary)]/10">10% opacidad</div>
<div className="bg-[var(--primary)]/20">20% opacidad</div>
<div className="bg-[var(--primary)]/50">50% opacidad</div>
```

## 🔄 Hook useTheme()

```tsx
import { useTheme } from "@/context/ThemeContext";

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div>
      <p>Tema actual: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("dark")}>Dark</button>
    </div>
  );
}
```

## 🎯 Componente ThemeToggle

```tsx
import ThemeToggle from "@/components/global/ThemeToggle";

function Navbar() {
  return (
    <nav>
      <ThemeToggle />
    </nav>
  );
}
```

## 🌓 Valores por Tema

### Light Mode

| Variable       | Valor     |
| -------------- | --------- |
| `--background` | `#FFFFFF` |
| `--surface`    | `#F9FAFB` |
| `--elevated`   | `#FFFFFF` |
| `--text`       | `#111827` |
| `--textmuted`  | `#6B7280` |
| `--borders`    | `#E5E7EB` |

### Dark Mode

| Variable       | Valor                      |
| -------------- | -------------------------- |
| `--background` | `#000000`                  |
| `--surface`    | `#171717`                  |
| `--elevated`   | `#262626`                  |
| `--text`       | `#FFFFFF`                  |
| `--textmuted`  | `#A3A3A3`                  |
| `--borders`    | `rgba(255, 255, 255, 0.1)` |

### Brand & Status (igual en ambos temas)

| Variable      | Valor     |
| ------------- | --------- |
| `--primary`   | `#3B82F6` |
| `--secondary` | `#8B5CF6` |
| `--accent`    | `#06B6D4` |
| `--success`   | `#10B981` |
| `--warning`   | `#F59E0B` |
| `--error`     | `#EF4444` |
| `--info`      | `#0EA5E9` |

## ✅ Best Practices

1. **Usa variables simples**

   ```tsx
   // ✅ Correcto
   <div className="bg-[var(--background)] text-[var(--text)]">

   // ❌ Evitar valores hardcodeados
   <div className="bg-white text-black dark:bg-black dark:text-white">
   ```

2. **Opacidad para variaciones**

   ```tsx
   <div className="bg-[var(--primary)]/10">
   <div className="border-[var(--primary)]/20">
   ```

3. **Transiciones suaves**

   ```tsx
   <div className="bg-[var(--background)] transition-colors duration-300">
   ```

4. **Hover states**
   ```tsx
   <button className="bg-[var(--primary)] hover:opacity-90">
   <div className="border-[var(--borders)] hover:border-[var(--primary)]">
   ```

## 📦 Componentes Actualizados

- ✅ `src/app/page.tsx` - Homepage
- ✅ `src/components/global/Navbar.tsx` - Navbar
- ✅ `src/components/global/ThemeToggle.tsx` - Toggle de tema
- ✅ `src/app/layout.tsx` - Layout principal

## 🎨 Paleta de Colores Completa

```css
/* Backgrounds */
--background: Blanco / Negro
--surface: Gris muy claro / Gris oscuro
--elevated: Blanco / Gris medio oscuro

/* Text */
--text: Negro / Blanco
--textmuted: Gris / Gris claro

/* Borders */
--borders: Gris claro / Blanco transparente

/* Brand (iguales en ambos temas) */
--primary: #3B82F6 (Azul)
--secondary: #8B5CF6 (Púrpura)
--accent: #06B6D4 (Cyan)

/* Status (iguales en ambos temas) */
--success: #10B981 (Verde)
--warning: #F59E0B (Naranja)
--error: #EF4444 (Rojo)
--info: #0EA5E9 (Azul cielo)
```

---

**Última actualización**: Octubre 2025  
**Versión**: 2.0.0 (Simplificado)

## 💡 Uso en Tailwind CSS

### Ejemplos de uso con Tailwind

#### Backgrounds

```tsx
<div className="bg-[var(--bg-primary)]">
  <div className="bg-[var(--bg-secondary)]">
    <div className="bg-[var(--surface-elevated)]">Contenido</div>
  </div>
</div>
```

#### Text Colors

```tsx
<h1 className="text-[var(--text-primary)]">Título Principal</h1>
<p className="text-[var(--text-secondary)]">Descripción secundaria</p>
<a href="#" className="text-[var(--text-link)] hover:underline">Enlace</a>
```

#### Borders

```tsx
<div className="border border-[var(--border-default)] hover:border-[var(--border-strong)]">
  Tarjeta con borde
</div>
```

#### Buttons

```tsx
<button className="bg-[var(--interactive-default)] hover:bg-[var(--interactive-hover)] active:bg-[var(--interactive-active)] text-white">
  Click me
</button>

<button className="bg-transparent border border-[var(--border-medium)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]">
  Secondary Button
</button>
```

#### Status Messages

```tsx
<div className="bg-[var(--status-success)]/10 border border-[var(--status-success)]/20 text-[var(--status-success)]">
  ✓ Operación exitosa
</div>

<div className="bg-[var(--status-error)]/10 border border-[var(--status-error)]/20 text-[var(--status-error)]">
  ✗ Error en la operación
</div>
```

#### Gradients

```tsx
<div className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)]">
  Gradiente de marca
</div>

<h1 className="bg-gradient-to-r from-[var(--text-primary)] via-[var(--text-secondary)] to-[var(--text-tertiary)] bg-clip-text text-transparent">
  Texto con gradiente
</h1>
```

#### Opacity

```tsx
<div className="bg-[var(--brand-primary)]/10">10% de opacidad</div>
<div className="bg-[var(--brand-primary)]/20">20% de opacidad</div>
<div className="bg-[var(--brand-primary)]/50">50% de opacidad</div>
```

## 🔄 Hook useTheme()

```tsx
import { useTheme } from "@/context/ThemeContext";

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div>
      <p>Tema actual: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("dark")}>Dark</button>
    </div>
  );
}
```

## 🎯 Componente ThemeToggle

Componente preconfigurado para cambiar entre tema claro y oscuro:

```tsx
import ThemeToggle from "@/components/global/ThemeToggle";

function Navbar() {
  return (
    <nav>
      {/* Tu contenido */}
      <ThemeToggle />
    </nav>
  );
}
```

## 🌓 Valores por Tema

### Light Mode

- Fondos: Blancos y grises muy claros
- Texto: Grises oscuros a negros
- Bordes: Grises claros

### Dark Mode

- Fondos: Negros y grises muy oscuros
- Texto: Blancos y grises claros
- Bordes: Blancos con transparencia

## ✅ Best Practices

1. **Siempre usa variables CSS** en lugar de valores hardcodeados

   ```tsx
   // ✅ Correcto
   <div className="bg-[var(--bg-primary)]">

   // ❌ Evitar
   <div className="bg-white dark:bg-black">
   ```

2. **Usa opacidad para variaciones**

   ```tsx
   <div className="bg-[var(--brand-primary)]/10">  // 10% opacity
   <div className="bg-[var(--brand-primary)]/20">  // 20% opacity
   ```

3. **Combina con transiciones** para suavizar cambios de tema

   ```tsx
   <div className="bg-[var(--bg-primary)] transition-colors duration-300">
   ```

4. **Usa hover states apropiados**
   ```tsx
   <button className="bg-[var(--interactive-default)] hover:bg-[var(--interactive-hover)]">
   ```

## 🔧 Extender el Sistema

Para agregar nuevas variables CSS:

1. **Edita `src/config/theme.config.ts`** para definir los valores
2. **Actualiza `src/app/globals.css`** en las secciones `:root` y `.dark`
3. **Documenta la nueva variable** en este archivo

## 📦 Componentes Actualizados

Los siguientes componentes ya están adaptados al sistema de theming:

- ✅ `src/app/page.tsx` - Homepage
- ✅ `src/components/global/Navbar.tsx` - Barra de navegación
- ✅ `src/components/global/ThemeToggle.tsx` - Toggle de tema
- ✅ `src/app/layout.tsx` - Layout principal

## 🎨 Paleta de Colores

### Brand Colors (Modo claro y oscuro)

- **Primary (Blue)**: `#3B82F6`
- **Secondary (Purple)**: `#8B5CF6`
- **Accent (Cyan)**: `#06B6D4`

### Status Colors

- **Success (Green)**: `#10B981`
- **Warning (Orange)**: `#F59E0B`
- **Error (Red)**: `#EF4444`
- **Info (Sky Blue)**: `#0EA5E9`

---

**Última actualización**: Octubre 2025
**Versión**: 1.0.0
