"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Role } from "@/generated/prisma";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { CheckCircle2, XCircle } from "lucide-react";
import Loader from "@/components/global/loader";
import { cn } from "@/lib/utils";

// Esquema de validación
const userSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().optional(),
  role: z.enum([Role.USER, Role.DELIVERY]),
});

type UserFormInputs = z.infer<typeof userSchema>;

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  mode: "create" | "edit";
}

export default function UserModal({
  open,
  onOpenChange,
  user,
  mode,
}: UserModalProps) {
  const [mensaje, setMensaje] = useState("");
  const [mensajeType, setMensajeType] = useState<"success" | "error">(
    "success"
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      role: Role.USER,
    },
  });

  // Actualizar el formulario cuando cambie el usuario o el modo
  useEffect(() => {
    if (open) {
      if (mode === "edit" && user) {
        reset({
          name: user.name || "",
          lastName: user.lastName || "",
          email: user.email || "",
          password: "",
          role: user.role === Role.ADMIN ? Role.USER : user.role,
        });
      } else {
        reset({
          name: "",
          lastName: "",
          email: "",
          password: "",
          role: Role.USER,
        });
      }
    }
  }, [open, mode, user, reset]);

  const onSubmit = async (data: UserFormInputs) => {
    setIsLoading(true);
    setMensaje("");

    // Validar password para crear
    if (mode === "create" && (!data.password || data.password.length < 6)) {
      setMensaje("La contraseña debe tener al menos 6 caracteres");
      setMensajeType("error");
      setIsLoading(false);
      return;
    }

    try {
      const url = mode === "create" ? "/api/user" : `/api/user/${user?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      // Si es edición y no hay password, no enviarlo
      const payload =
        mode === "edit" && !data.password
          ? {
              name: data.name,
              lastName: data.lastName,
              email: data.email,
              role: data.role,
            }
          : data;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resultado = await response.json();

      if (response.ok) {
        setMensaje(
          mode === "create"
            ? "Usuario creado exitosamente"
            : "Usuario actualizado exitosamente"
        );
        setMensajeType("success");

        setTimeout(() => {
          reset();
          onOpenChange(false);
          router.refresh();
        }, 1500);
      } else {
        setMensaje(resultado.error || "Error al guardar usuario");
        setMensajeType("error");
      }
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "Error desconocido");
      setMensajeType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setMensaje("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Crear Empleado" : "Editar Usuario"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Crea un nuevo empleado o usuario en el sistema"
              : "Modifica la información del usuario"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nombre</FieldLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="Juan"
                    disabled={isLoading}
                  />
                )}
              />
              {errors.name && (
                <span className="text-red-600 text-sm">
                  {errors.name.message}
                </span>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="lastName">Apellido</FieldLabel>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="lastName"
                    placeholder="Pérez"
                    disabled={isLoading}
                  />
                )}
              />
              {errors.lastName && (
                <span className="text-red-600 text-sm">
                  {errors.lastName.message}
                </span>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="mail@ejemplo.com"
                    disabled={isLoading}
                  />
                )}
              />
              {errors.email && (
                <span className="text-red-600 text-sm">
                  {errors.email.message}
                </span>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="password">
                Contraseña {mode === "edit" && "(opcional)"}
              </FieldLabel>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder={
                      mode === "edit"
                        ? "Dejar en blanco para mantener la actual"
                        : "Mínimo 6 caracteres"
                    }
                    disabled={isLoading}
                  />
                )}
              />
              {errors.password && (
                <span className="text-red-600 text-sm">
                  {errors.password.message}
                </span>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="role">Rol</FieldLabel>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Role.USER}>Usuario</SelectItem>
                      <SelectItem value={Role.DELIVERY}>Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <span className="text-red-600 text-sm">
                  {errors.role.message}
                </span>
              )}
            </Field>

            {isLoading && (
              <div className="flex items-center justify-center gap-3 py-2">
                <Loader size="xs" className="m-0" />
                <span className="text-sm text-muted-foreground">
                  Procesando...
                </span>
              </div>
            )}

            {mensaje && !isLoading && (
              <div
                className={cn(
                  "flex items-center justify-center gap-2 rounded-md p-3 text-sm font-medium",
                  mensajeType === "success" &&
                    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
                  mensajeType === "error" &&
                    "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                )}
              >
                {mensajeType === "success" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span>{mensaje}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {mode === "create" ? "Crear Usuario" : "Guardar Cambios"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
