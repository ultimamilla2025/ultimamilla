"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Schema de validación con Zod
const loginSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (datos: LoginInputs) => {
    try {
      setLoading(true);
      setMensaje("");

      const result = await signIn("credentials", {
        email: datos.email,
        password: datos.password,
        redirect: false,
      });

      if (result?.error) {
        setMensaje(`❌ ${result.error}`);
      } else {
        setMensaje("✅ Login exitoso");

        // Obtener la sesión del usuario desde la API
        const response = await fetch("/api/auth/session");
        const session = await response.json();

        // Redirigir según el rol del usuario
        if (session?.user?.role === "ADMIN") {
          router.push("/backoffice");
        } else if (session?.user?.role === "DELIVERY") {
          router.push("/dashboard/deliveryDashboard");
        } else {
          router.push("/dashboard/userDashboard");
        }
      }
    } catch (error) {
      setMensaje(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-neutral-200 flex justify-center items-center">
      <div className="border flex flex-col w-96 items-center justify-center px-6 py-8 rounded-2xl bg-neutral-300">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Login</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col text-gray-700 gap-4 w-full"
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                placeholder="Email"
                className="p-2 rounded-lg bg-white"
                disabled={loading}
              />
            )}
          />
          {errors.email && (
            <span className="text-red-600 text-sm">{errors.email.message}</span>
          )}

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                placeholder="Contraseña"
                className="p-2 rounded-lg bg-white"
                disabled={loading}
              />
            )}
          />
          {errors.password && (
            <span className="text-red-600 text-sm">
              {errors.password.message}
            </span>
          )}

          <button
            type="submit"
            disabled={loading}
            className="text-white rounded-lg p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Cargando..." : "INICIAR SESIÓN"}
          </button>
        </form>

        {mensaje && <p className="mt-4 text-sm font-semibold">{mensaje}</p>}

        <p className="mt-4 text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
