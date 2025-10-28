"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Role } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Schema de validación con Zod
const registerSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  name: z.string().optional(),
  role: z.string().min(1, "El rol es requerido"),
});

type RegisterInputs = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const roles = Object.values(Role);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "",
    },
  });

  const onSubmit = async (datos: RegisterInputs) => {
    try {
      setLoading(true);
      setMensaje("");

      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const resultado = await response.json();

      if (response.ok) {
        setMensaje("✅ Usuario creado exitosamente");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setMensaje(`❌ Error: ${resultado.error}`);
      }
    } catch (error) {
      setMensaje(`❌ Error al registrar: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-neutral-200 flex justify-center items-center">
      <div className="border flex flex-col w-96 items-center justify-center px-6 py-8 rounded-2xl bg-neutral-300">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Registro</h2>

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

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Nombre (opcional)"
                className="p-2 rounded-lg bg-white"
                disabled={loading}
              />
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="p-2 rounded-lg bg-white"
                disabled={loading}
              >
                <option value="">Selecciona un rol</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.role && (
            <span className="text-red-600 text-sm">{errors.role.message}</span>
          )}

          <button
            type="submit"
            disabled={loading}
            className="text-white rounded-lg p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Cargando..." : "REGISTRARSE"}
          </button>
        </form>

        {mensaje && <p className="mt-4 text-sm font-semibold">{mensaje}</p>}

        <p className="mt-4 text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
