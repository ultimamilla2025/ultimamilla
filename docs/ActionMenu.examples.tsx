/**
 * # ActionMenu - Ejemplos de Uso
 *
 * Este archivo contiene ejemplos de cómo usar el componente ActionMenu
 * en diferentes contextos.
 */

import ActionMenu, {
  ActionMenuItem,
  ActionMenuDivider,
  ActionMenuHeader,
} from "../src/components/dynamic-items/ActionMenu";
import {
  Eye,
  Edit,
  Trash2,
  Copy,
  Download,
  Share2,
  Archive,
  Star,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

// ========================================
// EJEMPLO 1: Menú básico con 3 acciones
// ========================================
export function BasicActionMenu({ itemId }: { itemId: string }) {
  return (
    <ActionMenu>
      <ActionMenuItem
        icon={<Eye size={16} />}
        label="Ver"
        onClick={() => console.log("Ver:", itemId)}
      />
      <ActionMenuItem
        icon={<Edit size={16} />}
        label="Editar"
        onClick={() => console.log("Editar:", itemId)}
      />
      <ActionMenuItem
        icon={<Trash2 size={16} />}
        label="Eliminar"
        onClick={() => console.log("Eliminar:", itemId)}
        variant="danger"
      />
    </ActionMenu>
  );
}

// ========================================
// EJEMPLO 2: Menú con secciones y divisores
// ========================================
export function SectionedActionMenu() {
  return (
    <ActionMenu>
      {/* Sección de visualización */}
      <ActionMenuHeader label="Vista" />
      <ActionMenuItem
        icon={<Eye size={16} />}
        label="Ver detalle"
        onClick={() => console.log("Ver")}
      />
      <ActionMenuItem
        icon={<Download size={16} />}
        label="Descargar"
        onClick={() => console.log("Descargar")}
      />

      <ActionMenuDivider />

      {/* Sección de edición */}
      <ActionMenuHeader label="Editar" />
      <ActionMenuItem
        icon={<Edit size={16} />}
        label="Modificar"
        onClick={() => console.log("Editar")}
        variant="warning"
      />
      <ActionMenuItem
        icon={<Copy size={16} />}
        label="Duplicar"
        onClick={() => console.log("Duplicar")}
      />

      <ActionMenuDivider />

      {/* Acciones peligrosas */}
      <ActionMenuItem
        icon={<Archive size={16} />}
        label="Archivar"
        onClick={() => console.log("Archivar")}
      />
      <ActionMenuItem
        icon={<Trash2 size={16} />}
        label="Eliminar"
        onClick={() => console.log("Eliminar")}
        variant="danger"
      />
    </ActionMenu>
  );
}

// ========================================
// EJEMPLO 3: Menú con estados deshabilitados
// ========================================
export function ConditionalActionMenu({
  canEdit,
  canDelete,
}: {
  canEdit: boolean;
  canDelete: boolean;
}) {
  return (
    <ActionMenu>
      <ActionMenuItem
        icon={<Eye size={16} />}
        label="Ver"
        onClick={() => console.log("Ver")}
      />
      <ActionMenuItem
        icon={<Edit size={16} />}
        label="Editar"
        onClick={() => console.log("Editar")}
        disabled={!canEdit}
        variant="warning"
      />
      <ActionMenuItem
        icon={<Trash2 size={16} />}
        label="Eliminar"
        onClick={() => console.log("Eliminar")}
        disabled={!canDelete}
        variant="danger"
      />
    </ActionMenu>
  );
}

// ========================================
// EJEMPLO 4: Menú con compartir y contacto
// ========================================
interface ContactUser {
  email: string;
  phone: string;
}

export function ContactActionMenu({ user }: { user: ContactUser }) {
  return (
    <ActionMenu>
      <ActionMenuHeader label="Contacto" />
      <ActionMenuItem
        icon={<Mail size={16} />}
        label="Enviar email"
        onClick={() => window.open(`mailto:${user.email}`)}
        variant="primary"
      />
      <ActionMenuItem
        icon={<Phone size={16} />}
        label="Llamar"
        onClick={() => window.open(`tel:${user.phone}`)}
        variant="primary"
      />
      <ActionMenuItem
        icon={<MapPin size={16} />}
        label="Ver ubicación"
        onClick={() => console.log("Ver mapa")}
      />

      <ActionMenuDivider />

      <ActionMenuHeader label="Más" />
      <ActionMenuItem
        icon={<Share2 size={16} />}
        label="Compartir"
        onClick={() => console.log("Compartir")}
      />
      <ActionMenuItem
        icon={<Star size={16} />}
        label="Marcar favorito"
        onClick={() => console.log("Favorito")}
      />
    </ActionMenu>
  );
}

// ========================================
// EJEMPLO 5: Uso en DataTable
// ========================================
/*
import { Column } from "./DataTable";
import { User } from "@/types";

const columns: Column<User>[] = [
  {
    key: "name",
    header: "Nombre",
  },
  {
    key: "email",
    header: "Email",
  },
  {
    key: "actions",
    header: "Acciones",
    render: (user) => (
      <ActionMenu>
        <ActionMenuItem
          icon={<Eye size={16} />}
          label="Ver perfil"
          onClick={() => router.push(`/users/${user.id}`)}
          variant="primary"
        />
        <ActionMenuItem
          icon={<Edit size={16} />}
          label="Editar"
          onClick={() => router.push(`/users/${user.id}/edit`)}
          variant="warning"
        />
        <ActionMenuDivider />
        <ActionMenuItem
          icon={<Trash2 size={16} />}
          label="Eliminar"
          onClick={() => handleDelete(user.id)}
          variant="danger"
        />
      </ActionMenu>
    ),
    className: "text-right",
  },
];
*/

// ========================================
// EJEMPLO 6: Con router de Next.js
// ========================================
/*
"use client";
import { useRouter } from "next/navigation";

export function UserActionMenu({ userId }: { userId: string }) {
  const router = useRouter();

  return (
    <ActionMenu>
      <ActionMenuItem
        icon={<Eye size={16} />}
        label="Ver perfil"
        onClick={() => router.push(`/users/${userId}`)}
      />
      <ActionMenuItem
        icon={<Edit size={16} />}
        label="Editar"
        onClick={() => router.push(`/users/${userId}/edit`)}
        variant="warning"
      />
    </ActionMenu>
  );
}
*/
