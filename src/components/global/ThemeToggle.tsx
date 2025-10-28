"use client";

import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--borders)] hover:border-[var(--primary)] transition-all duration-300 text-[var(--text)]"
      aria-label={`Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`}
      title={`Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}
