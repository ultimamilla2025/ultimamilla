//src\app\componentes\boton-borrado-usuarios.tsx
"use client";

export default function BotonBorrar({ userId }: { userId: string }) {
  const borrarUsuario = async () => {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resultado = await response.json();

      if (response.ok) {
        alert(`✅ ${resultado.message}`);
        window.location.reload(); // Recargar la página para ver cambios
      } else {
        alert(`❌ Error: ${resultado.error}`);
      }
    } catch (error) {
      alert(`❌ Error al enviar: ${error}`);
    }
  };

  return (
    <button
      onClick={borrarUsuario}
      className="border p-2 flex justify-center items-center rounded hover:bg-white/10 transition-all"
    >
      Borrar 🗑️
    </button>
  );
}
