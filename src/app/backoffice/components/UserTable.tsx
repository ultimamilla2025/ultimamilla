"use client";

import { User, Role } from "@/generated/prisma";
import { Eye, Edit, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ActionMenu, {
  ActionMenuItem,
  ActionMenuDivider,
} from "@/components/dynamic-items/ActionMenu";
import DynamicTable, { Column } from "@/components/dynamic-items/DynamicTable";
import UserModal from "./UserModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROLE_NAMES, ROLE_VARIANTS } from "@/utils/constans/roles";

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    // No permitir editar administradores
    if (user.role === Role.ADMIN) {
      toast.error("No se pueden editar usuarios administradores", {
        description: "Los usuarios con rol ADMIN están protegidos",
      });
      return;
    }
    setSelectedUser(user);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    const userToDelete = users.find((u) => u.id === userId);

    // No permitir eliminar administradores
    if (userToDelete?.role === Role.ADMIN) {
      toast.error("No se pueden eliminar usuarios administradores", {
        description: "Los usuarios con rol ADMIN están protegidos",
      });
      return;
    }

    // Crear un toast de confirmación
    toast.warning("¿Estás seguro?", {
      description: `Vas a eliminar a ${userToDelete?.name} ${userToDelete?.lastName}`,
      action: {
        label: "Eliminar",
        onClick: async () => {
          setDeleting(userId);
          toast.loading("Eliminando usuario...", { id: userId });

          try {
            const response = await fetch(`/api/user/${userId}`, {
              method: "DELETE",
            });

            if (response.ok) {
              toast.success("Usuario eliminado exitosamente", { id: userId });
              router.refresh();
            } else {
              toast.error("Error al eliminar usuario", { id: userId });
            }
          } catch {
            toast.error("Error al eliminar usuario", { id: userId });
          } finally {
            setDeleting(null);
          }
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => toast.dismiss(),
      },
    });
  };

  // Definir las columnas de la tabla
  const columns: Column<User>[] = [
    {
      key: "id",
      header: "ID",
      render: (user) => (
        <span className="font-mono text-xs text-[var(--textmuted)]">
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
      key: "lastName",
      header: "Apellido",
      render: (user) => (
        <span className="font-medium">{user.lastName || "Sin nombre"}</span>
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
        return (
          <Badge variant={ROLE_VARIANTS[user.role]}>
            {ROLE_NAMES[user.role]}
          </Badge>
        );
      },
      mobileClassName: "order-3", // Se muestra tercero en mobile
    },
    {
      key: "actions",
      header: "Acciones",
      render: (user) => (
        <ActionMenu className="flex justify-center">
          <ActionMenuItem
            icon={<Eye size={16} />}
            label="Ver detalle"
            onClick={() => router.push(`/users/${user.id}`)}
            variant="primary"
          />
          <ActionMenuItem
            icon={<Edit size={16} />}
            label="Editar usuario"
            onClick={() => handleOpenEditModal(user)}
            variant="warning"
            disabled={user.role === Role.ADMIN}
          />
          <ActionMenuDivider />
          <ActionMenuItem
            icon={<Trash2 size={16} />}
            label={deleting === user.id ? "Eliminando..." : "Eliminar"}
            onClick={() => handleDelete(user.id)}
            variant="danger"
            disabled={deleting === user.id || user.role === Role.ADMIN}
          />
        </ActionMenu>
      ),
      desktopClassName: "text-right w-20", // Columna estrecha alineada a la derecha en desktop
    },
  ];

  return (
    <>
      <div className="flex max-sm:flex-col justify-between items-center mb-4">
        <h2 className="text-2xl font-bold max-sm:mb-2">Gestión de Usuarios</h2>
        <Button onClick={handleOpenCreateModal} className="gap-2">
          <UserPlus size={18} />
          Crear Empleado
        </Button>
      </div>

      <DynamicTable
        data={users}
        columns={columns}
        keyExtractor={(user) => user.id}
        emptyMessage="No hay usuarios registrados"
        className="w-full"
      />

      <UserModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        user={selectedUser}
        mode={modalMode}
      />
    </>
  );
}
