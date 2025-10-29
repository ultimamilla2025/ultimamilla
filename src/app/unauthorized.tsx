import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-background">
      <div className="w-full max-w-2xl">
        <Card className="border-2 border-destructive/20">
          <CardContent className="p-8 sm:p-12 text-center space-y-6">
            {/* Icono principal */}
            <div className="flex justify-center">
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-destructive/10 flex items-center justify-center">
                <ShieldAlert className="h-12 w-12 sm:h-16 sm:w-16 text-destructive" />
              </div>
            </div>

            {/* Código de error */}
            <div className="space-y-2">
              <h1 className="text-6xl sm:text-7xl font-bold text-foreground">
                401
              </h1>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                Acceso No Autorizado
              </h2>
            </div>

            {/* Mensaje descriptivo */}
            <div className="max-w-md mx-auto space-y-2">
              <p className="text-base sm:text-lg text-muted-foreground">
                No tenés los permisos necesarios para acceder a esta página.
              </p>
              <p className="text-sm text-muted-foreground">
                Si creés que esto es un error, por favor contactá con el
                administrador del sistema.
              </p>
            </div>

            {/* Separador decorativo */}
            <div className="flex items-center gap-4 py-4">
              <div className="flex-1 h-px bg-border"></div>
              <div className="h-2 w-2 rounded-full bg-destructive/50"></div>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/" className="flex-1 sm:flex-initial">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto gap-2"
                  size="lg"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver Atrás
                </Button>
              </Link>
              <Link href="/" className="flex-1 sm:flex-initial">
                <Button className="w-full sm:w-auto gap-2" size="lg">
                  <Home className="h-4 w-4" />
                  Ir al Inicio
                </Button>
              </Link>
            </div>

            {/* Footer informativo */}
            <div className="pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Código de error: <span className="font-mono">AUTH_401</span> •
                Última Milla
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
