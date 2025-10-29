import Logo from "@/components/global/logo";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--text)] overflow-hidden transition-colors duration-300 font-[family-name:var(--font-nunito-sans)]">
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--borders)_1px,transparent_1px),linear-gradient(to_bottom,var(--borders)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--primary)] opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--secondary)] opacity-20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
          <div className="inline-block mb-4">
            <span className="px-4 py-1.5 text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] rounded-full border border-[var(--primary)]/20">
              Logística del futuro
            </span>
          </div>

          <div className="mt-10 flex justify-center">
            <Logo className="p-5 w-40 -mb-4 rounded-full" variant="logo" />
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="block bg-gradient-to-r from-[var(--text)] via-[var(--textmuted)] to-[var(--textmuted)] bg-clip-text text-transparent">
              Última<span className="text-[var(--primary)]">M</span>illa
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-[var(--textmuted)] max-w-3xl mx-auto leading-relaxed">
            Revolucionamos la entrega final. Tecnología avanzada para conectar
            tu negocio con tus clientes en tiempo récord.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href={"/login"}
              className="px-8 py-4 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Comenzar ahora
            </Link>
            <button className="px-8 py-4 bg-transparent text-[var(--text)] font-semibold rounded-lg border border-[var(--borders)] hover:bg-[var(--surface)] transition-all duration-300">
              Conocer más
            </button>
          </div>
        </div>
      </section>
      <footer className="border-t border-[var(--borders)] py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto text-center text-[var(--textmuted)]">
          <p className="text-2xl font-bold text-[var(--text)] mb-2">
            Última Milla
          </p>
          <p className="text-sm">© 2025 Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
}
