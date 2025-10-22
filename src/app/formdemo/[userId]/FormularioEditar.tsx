//src\app\formdemo\[userId]\FormularioEditar.tsx

"use client";
import { Role, User } from "@/generated/prisma";
import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  name: z.string().optional(),
  role: z.string().min(1, "El rol es requerido"),
});

type FormInputs = z.infer<typeof formSchema>;

type Props = {
  usuario: User;
};

export default function FormularioEditar({ usuario }: Props) {
  const [mensaje, setMensaje] = useState("");

  const roles = Object.values(Role);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: usuario.email,
      name: usuario.name || "",
      role: usuario.role,
    },
  });

  const enviarFormulario: SubmitHandler<FormInputs> = async (datos) => {
    try {
      const response = await fetch(`/api/user/${usuario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      const resultado = await response.json();

      if (response.ok) {
        setMensaje(`✅ ${resultado.message}`);
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
        <h2 className="text-xl font-bold mb-4 text-gray-700">Editar Usuario</h2>
        <p className="text-sm text-gray-600 mb-2">ID: {usuario.id}</p>

        <form
          onSubmit={handleSubmit(enviarFormulario)}
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
              />
            )}
          />
          {errors.email && (
            <span className="text-red-600 text-sm">{errors.email.message}</span>
          )}

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

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <select {...field} className="p-2 rounded-lg bg-white">
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
            className="text-white rounded-lg p-2 bg-blue-500 hover:bg-blue-600"
          >
            EDITAR USUARIO
          </button>
        </form>

        {mensaje && <p className="mt-4 text-sm font-semibold">{mensaje}</p>}
      </div>
    </div>
  );
}
