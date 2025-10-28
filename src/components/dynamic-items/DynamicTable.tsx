"use client";

import { ReactNode } from "react";

/**
 * # DynamicTable - Tabla Dinámica y Responsive
 *
 * Componente genérico para mostrar datos en formato tabla (desktop/tablet)
 * que se transforma automáticamente en tarjetas (mobile).
 *
 * ## 🎯 Características
 * - 100% Responsive (tabla → cards en mobile)
 * - TypeScript genérico (funciona con cualquier tipo de dato)
 * - Acepta componentes personalizados en cada celda
 * - Diseño moderno con glassmorphism
 * - Hover effects y transiciones suaves
 *
 * ## 📖 Ejemplo de Uso Básico
 *
 * ```tsx
 * import DynamicTable, { Column } from "@/components/dynamic-items/DynamicTable";
 *
 * interface Product {
 *   id: string;
 *   name: string;
 *   price: number;
 * }
 *
 * const columns: Column<Product>[] = [
 *   {
 *     key: "name",
 *     header: "Producto",
 *     render: (product) => <strong>{product.name}</strong>
 *   },
 *   {
 *     key: "price",
 *     header: "Precio",
 *     render: (product) => `$${product.price.toFixed(2)}`
 *   }
 * ];
 *
 * export default function ProductList({ products }: { products: Product[] }) {
 *   return (
 *     <DynamicTable
 *       data={products}
 *       columns={columns}
 *       keyExtractor={(product) => product.id}
 *       emptyMessage="No hay productos disponibles"
 *     />
 *   );
 * }
 * ```
 *
 * ## 📖 Ejemplo con Componentes Personalizados
 *
 * ```tsx
 * const columns: Column<User>[] = [
 *   {
 *     key: "avatar",
 *     header: "Avatar",
 *     render: (user) => (
 *       <Image
 *         src={user.avatarUrl}
 *         alt={user.name}
 *         width={40}
 *         height={40}
 *         className="rounded-full"
 *       />
 *     )
 *   },
 *   {
 *     key: "status",
 *     header: "Estado",
 *     render: (user) => (
 *       <span className={`badge ${user.active ? 'badge-success' : 'badge-error'}`}>
 *         {user.active ? 'Activo' : 'Inactivo'}
 *       </span>
 *     )
 *   },
 *   {
 *     key: "actions",
 *     header: "Acciones",
 *     render: (user) => (
 *       <div className="flex gap-2">
 *         <button onClick={() => handleEdit(user.id)}>Editar</button>
 *         <button onClick={() => handleDelete(user.id)}>Borrar</button>
 *       </div>
 *     ),
 *     className: "text-right" // Personalizar estilos de la celda
 *   }
 * ];
 * ```
 *
 * ## 🎨 Personalización de Estilos
 *
 * ```tsx
 * const columns: Column<Data>[] = [
 *   {
 *     key: "field",
 *     header: "Campo",
 *     headerClassName: "bg-blue-500 text-white", // Estilo del header
 *     className: "font-bold text-center",        // Estilo de las celdas
 *     render: (item) => item.field
 *   }
 * ];
 *
 * <DynamicTable
 *   data={items}
 *   columns={columns}
 *   keyExtractor={(item) => item.id}
 *   className="shadow-xl" // Estilos adicionales al contenedor
 * />
 * ```
 *
 * ## 📱 Comportamiento Responsive
 *
 * - **md y superior (≥768px)**: Muestra tabla tradicional con columnas
 * - **Menor a md (<768px)**: Se transforma en cards verticales
 *
 * En mobile, cada card muestra:
 * - Header de la columna en texto pequeño
 * - Valor renderizado debajo
 *
 * ## ⚠️ Notas Importantes
 *
 * 1. Este es un **Client Component** ("use client")
 * 2. Si usás en Server Component, envolvelo en un Client Component
 * 3. El `keyExtractor` debe devolver un string único por item
 * 4. Si no usás `render`, mostrará `item[column.key]` directamente
 */

// Definición de columna
export interface Column<T> {
  /** Clave única de la columna (debe coincidir con una propiedad de T si no usás render) */
  key: string;

  /** Texto que se muestra en el header de la tabla */
  header: string;

  /** Función opcional para renderizar el contenido de la celda. Si no se provee, usa item[key] */
  render?: (item: T) => ReactNode;

  /** Clases CSS adicionales para las celdas de esta columna */
  className?: string;

  /** Clases CSS adicionales para el header de esta columna */
  headerClassName?: string;

  /** Clases CSS específicas para la vista desktop (tabla) - sobrescribe className */
  desktopClassName?: string;

  /** Clases CSS específicas para la vista mobile (tarjetas) */
  mobileClassName?: string;
}

// Props del componente
interface DynamicTableProps<T> {
  /** Array de datos a mostrar en la tabla */
  data: T[];

  /** Definición de columnas */
  columns: Column<T>[];

  /** Función que extrae un identificador único de cada item (usado como key en React) */
  keyExtractor: (item: T) => string;

  /** Mensaje a mostrar cuando no hay datos (opcional) */
  emptyMessage?: string;

  /** Clases CSS adicionales para el contenedor principal (opcional) */
  className?: string;
}

export default function DynamicTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = "No hay datos para mostrar",
  className = "",
}: DynamicTableProps<T>) {
  // Validar que data sea un array
  if (!Array.isArray(data)) {
    console.error(
      "DynamicTable: 'data' debe ser un array, recibido:",
      typeof data
    );
    return (
      <div className="flex items-center justify-center p-12 text-red-500 bg-red-500/10 backdrop-blur-sm rounded-2xl border border-red-500/20">
        Error: Los datos proporcionados no son válidos
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-500 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* VISTA DESKTOP/TABLET - Tabla */}
      <div className="hidden md:block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="relative">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-4 text-left text-sm font-semibold text-gray-200 ${
                      column.desktopClassName || column.headerClassName || ""
                    }`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="relative">
              {data.map((item, index) => (
                <tr
                  key={keyExtractor(item)}
                  className={`
                    border-b border-white/5 
                    transition-all duration-200
                    hover:bg-white/10
                    ${index % 2 === 0 ? "bg-white/0" : "bg-white/[0.02]"}
                  `}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 text-sm text-gray-300 ${
                        column.desktopClassName || column.className || ""
                      }`}
                    >
                      {column.render
                        ? column.render(item)
                        : String(
                            (item as Record<string, unknown>)[column.key] ?? ""
                          )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VISTA MOBILE - Cards */}
      <div className="md:hidden space-y-4">
        {data.map((item) => {
          // Separar la columna de acciones del resto
          const actionColumn = columns.find((col) => col.key === "actions");
          const otherColumns = columns.filter((col) => col.key !== "actions");

          return (
            <div
              key={keyExtractor(item)}
              className="
                relative
                rounded-2xl border border-white/10 
                bg-white/5 backdrop-blur-sm 
                p-5 space-y-3
                hover:bg-white/10 transition-all duration-200
                shadow-lg hover:shadow-xl
              "
            >
              {/* Botón de acciones en la esquina superior derecha (solo ícono, sin texto) */}
              {actionColumn && (
                <div className="absolute top-2 right-2 z-10">
                  {actionColumn.render && actionColumn.render(item)}
                </div>
              )}

              {/* Resto de las columnas (las acciones NO aparecen aquí) */}
              {otherColumns.map((column) => (
                <div
                  key={column.key}
                  className={`flex flex-col gap-1 ${
                    column.mobileClassName || ""
                  }`}
                >
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {column.header}
                  </span>
                  <div className="text-sm text-gray-200">
                    {column.render
                      ? column.render(item)
                      : String(
                          (item as Record<string, unknown>)[column.key] ?? ""
                        )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
