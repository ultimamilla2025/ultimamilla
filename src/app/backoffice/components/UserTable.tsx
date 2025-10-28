"use client";

import { User } from "@/generated/prisma";
import DynamicTable, {
  Column,
} from "../../components/dynamic-items/DynamicTable";
import ActionMenu, {
  ActionMenuItem,
  ActionMenuDivider,
} from "../../components/dynamic-items/ActionMenu";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (userId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      return;
    }

    setDeleting(userId);

    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Error al eliminar usuario");
      }
    } catch {
      alert("Error al eliminar usuario");
    } finally {
      setDeleting(null);
    }
  };

  // Definir las columnas de la tabla
  const columns: Column<User>[] = [
    {
      key: "id",
      header: "ID",
      render: (user) => (
        <span className="font-mono text-xs text-gray-400">
          {user.id.slice(0, 8)}...
        </span>
      ),
      desktopClassName: "max-w-[100px]", // Ancho máximo en desktop
      mobileClassName: "order-4", // Se muestra al final en mobile
    },
    {
      key: "name",
      header: "Nombre",
      render: (user) => (
        <span className="font-medium">{user.name || "Sin nombre"}</span>
      ),
      mobileClassName: "order-1", // Se muestra primero en mobile
    },
    {
      key: "email",
      header: "Email",
      render: (user) => <span className="text-blue-400">{user.email}</span>,
      mobileClassName: "order-2", // Se muestra segundo en mobile
    },
    {
      key: "role",
      header: "Rol",
      render: (user) => {
        const roleColors = {
          ADMIN: "bg-purple-500/20 text-purple-300 border-purple-500/30",
          DELIVERY: "bg-blue-500/20 text-blue-300 border-blue-500/30",
          USER: "bg-green-500/20 text-green-300 border-green-500/30",
        };

        return (
          <span
            className={`
              px-3 py-1 rounded-full text-xs font-semibold
              border inline-block
              ${roleColors[user.role]}
            `}
          >
            {user.role}
          </span>
        );
      },
      mobileClassName: "order-3", // Se muestra tercero en mobile
    },
    {
      key: "actions",
      header: "Acciones",
      render: (user) => (
        <ActionMenu>
          <ActionMenuItem
            icon={<Eye size={16} />}
            label="Ver detalle"
            onClick={() => router.push(`/users/${user.id}`)}
            variant="primary"
          />
          <ActionMenuItem
            icon={<Edit size={16} />}
            label="Editar usuario"
            onClick={() => router.push(`/formdemo/${user.id}`)}
            variant="warning"
          />
          <ActionMenuDivider />
          <ActionMenuItem
            icon={<Trash2 size={16} />}
            label={deleting === user.id ? "Eliminando..." : "Eliminar"}
            onClick={() => handleDelete(user.id)}
            variant="danger"
            disabled={deleting === user.id}
          />
        </ActionMenu>
      ),
      desktopClassName: "text-right w-20", // Columna estrecha alineada a la derecha en desktop
    },
  ];

  return (
    <DynamicTable
      data={users}
      columns={columns}
      keyExtractor={(user) => user.id}
      emptyMessage="No hay usuarios registrados"
      className="w-full"
    />
  );
}
