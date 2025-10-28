"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Role } from "@/generated/prisma";

// Esquema de validación con Zod - ahora siempre incluye todos los campos como opcionales
const loginSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  name: z.string().optional(),
  lastName: z.string().optional(),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

type LoginFormProps = {
  mode?: "login" | "register";
} & React.ComponentProps<"div">;

export function LoginForm({
  className,
  mode = "login",
  ...props
}: LoginFormProps) {
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const router = useRouter();
  const isRegister = mode === "register";

  // Función para redirigir según el rol
  const redirectByRole = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        router.push("/backoffice");
        break;
      case Role.DELIVERY:
        router.push("/dashboard/deliveryDashboard");
        break;
      case Role.USER:
      default:
        router.push("/dashboard/userDashboard");
        break;
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      lastName: "",
    },
  });

  // Cargar el email guardado al montar el componente
  useEffect(() => {
    if (!isRegister) {
      const savedEmail = localStorage.getItem("rememberedEmail");
      if (savedEmail) {
        setValue("email", savedEmail);
        setRememberEmail(true);
      }
    }
  }, [isRegister, setValue]);

  const enviarFormulario: SubmitHandler<LoginFormInputs> = async (datos) => {
    setIsLoading(true);
    setMensaje("");

    // Validación manual para register
    if (isRegister) {
      if (!datos.name || datos.name.trim() === "") {
        setMensaje("❌ El nombre es requerido");
        setIsLoading(false);
        return;
      }
      if (!datos.lastName || datos.lastName.trim() === "") {
        setMensaje("❌ El apellido es requerido");
        setIsLoading(false);
        return;
      }
    }

    try {
      if (isRegister) {
        // Registro: crear usuario con role USER
        const response = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...datos,
            role: "USER", // Forzar role USER en registro
          }),
        });

        const resultado = await response.json();

        if (response.ok) {
          setMensaje("✅ Usuario creado exitosamente. Redirigiendo...");
          reset();
          // Auto-login después de registro exitoso
          const result = await signIn("credentials", {
            email: datos.email,
            password: datos.password,
            redirect: false,
          });

          if (result?.ok) {
            // Obtener la sesión fresca después del login
            const freshSession = await getSession();
            const userRole = freshSession?.user?.role || Role.USER;
            setMensaje("✅ Usuario creado exitosamente. Redirigiendo...");
            redirectByRole(userRole);
          }
        } else {
          setMensaje(`❌ ${resultado.error || "Error al registrar usuario"}`);
        }
      } else {
        // Login
        const result = await signIn("credentials", {
          email: datos.email,
          password: datos.password,
          redirect: false,
        });

        if (result?.ok) {
          // Guardar o eliminar el email según la preferencia del usuario
          if (rememberEmail) {
            localStorage.setItem("rememberedEmail", datos.email);
          } else {
            localStorage.removeItem("rememberedEmail");
          }

          // Obtener la sesión fresca después del login
          const freshSession = await getSession();
          const userRole = freshSession?.user?.role || Role.USER;
          setMensaje("✅ Inicio de sesión exitoso. Redirigiendo...");
          redirectByRole(userRole);
        } else {
          setMensaje("❌ Credenciales inválidas");
        }
      }
    } catch (error) {
      setMensaje(
        `❌ Error: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={handleSubmit(enviarFormulario)}
            className="p-6 md:p-8"
            autoComplete="off"
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  {isRegister ? "Crear cuenta" : "Bienvenido/a de nuevo!"}
                </h1>
                <p className="text-muted-foreground text-balance">
                  {isRegister
                    ? "Registrate para acceder a la plataforma"
                    : "Accedé!"}
                </p>
              </div>

              {isRegister && (
                <>
                  <Field>
                    <FieldLabel htmlFor="name">Nombre</FieldLabel>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="name"
                          type="text"
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
                          type="text"
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
                </>
              )}

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
                      autoComplete="email"
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
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="******"
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  )}
                />
                {errors.password && (
                  <span className="text-red-600 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </Field>

              {!isRegister && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rememberEmail"
                    checked={rememberEmail}
                    onChange={(e) => setRememberEmail(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor="rememberEmail"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Recordar mi email
                  </label>
                </div>
              )}

              <Field>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="hover:cursor-pointer"
                >
                  {isLoading
                    ? "Procesando..."
                    : isRegister
                    ? "Registrarse"
                    : "Login"}
                </Button>
              </Field>

              {mensaje && (
                <p className="text-sm font-semibold text-center">{mensaje}</p>
              )}

              <FieldDescription className="text-center">
                {isRegister ? (
                  <>
                    ¿Ya tienes cuenta?{" "}
                    <a href="/login" className="underline">
                      Inicia sesión
                    </a>
                  </>
                ) : (
                  <>
                    No tenés una cuenta?{" "}
                    <Link href="/register" className="underline">
                      Registrate!
                    </Link>
                  </>
                )}
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/sending.jpg"
              alt="Image"
              width={1000}
              height={1000}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      {/* TODO: Luego investigar por la política de privacidad */}
      {/* <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription> */}
    </div>
  );
}
