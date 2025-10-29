"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  User as UserIcon,
  UserCircle,
  Badge,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useCurrentUser } from "@/utils/frontend/getCurrentUser";
import Loader from "@/components/global/loader";
import { Role, User } from "@/generated/prisma";

interface UserProfileClientProps {
  user: User;
}

export default function UserProfileClient({ user }: UserProfileClientProps) {
  const { role, isLoading } = useCurrentUser();

  const roleColors = {
    ADMIN: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    DELIVERY: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    USER: "bg-green-500/20 text-green-300 border-green-500/30",
  };

  const roleLabels = {
    ADMIN: "Administrador",
    DELIVERY: "Repartidor",
    USER: "Usuario",
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-5 justify-center min-h-screen">
        <Loader size="xs" />
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header con botón de volver */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href={`${role === Role.ADMIN ? "/backoffice" : "/"}`}>
            <Button variant="outline" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
              Perfil de Usuario
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground truncate">
              Información detallada del usuario
            </p>
          </div>
        </div>

        {/* Card Principal */}
        <Card>
          <CardHeader className="pb-3 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <UserCircle className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground break-words">
                  {user.name} {user.lastName}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground break-all">
                  {user.email}
                </p>
              </div>
              <span
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border shrink-0 ${
                  roleColors[user.role]
                }`}
              >
                {roleLabels[user.role]}
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Información General */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span>Información General</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Nombre
                  </p>
                  <p className="text-sm sm:text-base font-medium text-foreground break-words">
                    {user.name || "No especificado"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Apellido
                  </p>
                  <p className="text-sm sm:text-base font-medium text-foreground break-words">
                    {user.lastName || "No especificado"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Correo Electrónico
                  </p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                    <p className="text-sm sm:text-base font-medium text-foreground break-all">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Rol
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                    <p className="text-sm sm:text-base font-medium text-foreground">
                      {roleLabels[user.role]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Separador */}
            <div className="border-t border-border"></div>

            {/* Información del Sistema */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span>Información del Sistema</span>
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    ID de Usuario
                  </p>
                  <p className="font-mono text-xs text-foreground break-all bg-muted/30 p-2 rounded">
                    {user.id}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        {role === Role.ADMIN && (
          <div className="flex justify-stretch sm:justify-end gap-3">
            <Link href="/backoffice" className="flex-1 sm:flex-initial">
              <Button variant="outline" className="w-full sm:w-auto">
                Volver al Backoffice
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
