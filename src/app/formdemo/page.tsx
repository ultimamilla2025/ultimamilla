//src\app\formdemo\page.tsx
"use client";
import { Role } from "@/generated/prisma";
import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Definir el esquema de validación con Zod
const formSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  name: z.string().optional(),
  role: z.string().min(1, "El rol es requerido"),
});

// Inferir el tipo desde el esquema de Zod
type FormInputs = z.infer<typeof formSchema>;

export default function FormDemoApp() {
  // Estado para mostrar mensajes de éxito o error
  const [mensaje, setMensaje] = useState("");

  // Array con todos los roles disponibles (dinámico)
  const roles = Object.values(Role); // ["USER", "ADMIN", "DELIVERY"]

  // React Hook Form con Zod resolver
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(formSchema), // Conectamos Zod
    defaultValues: {
      email: "",
      name: "",
      role: "",
    },
  });

  // Función que se ejecuta cuando el usuario envía el formulario
  const enviarFormulario: SubmitHandler<FormInputs> = async (datos) => {
    try {
      // Hacemos la petición POST a nuestro endpoint
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      // Convertimos la respuesta a JSON
      const resultado = await response.json();

      // Si todo salió bien (código 200-299)
      if (response.ok) {
        setMensaje(`✅ ${resultado.message}`);
        reset(); // Limpiamos el formulario
      } else {
        setMensaje(`❌ Error: ${resultado.error}`);
      }
    } catch (error) {
      setMensaje(`❌ Error al enviar: ${error}`);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-neutral-200 flex justify-center items-center">
      <div className="border flex flex-col w-96 items-center justify-center px-6 py-8 rounded-2xl bg-neutral-300">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Crear Usuario</h2>

        {/* Formulario con React Hook Form + Controller + Zod */}
        <form
          onSubmit={handleSubmit(enviarFormulario)}
          className="flex flex-col text-gray-700 gap-4 w-full"
        >
          {/* Input de email con Controller - validación desde Zod */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                placeholder="Email"
                className="p-2 rounded-lg bg-white"
              />
            )}
          />
          {errors.email && (
            <span className="text-red-600 text-sm">{errors.email.message}</span>
          )}

          {/* Input de nombre con Controller - opcional */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Nombre"
                className="p-2 rounded-lg bg-white"
              />
            )}
          />

          {/* Select para elegir el rol con Controller - validación desde Zod */}
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <select {...field} className="p-2 rounded-lg bg-white">
                <option value="">Selecciona un rol</option>
                {/* Mapeamos dinámicamente todos los roles del enum */}
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

          {/* Botón para enviar el formulario */}
          <button
            type="submit"
            className="text-white rounded-lg p-2 bg-blue-500 hover:bg-blue-600"
          >
            CREAR USUARIO
          </button>
        </form>

        {/* Si hay un mensaje, lo mostramos */}
        {mensaje && <p className="mt-4 text-sm font-semibold">{mensaje}</p>}
      </div>
    </div>
  );
}
