"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useCurrentUser } from "@/utils/frontend/getCurrentUser";
import ThemeToggle from "./ThemeToggle";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  roles: string[];
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard/userDashboard",
    icon: Home,
    roles: ["USER", "DELIVERY"],
  },
  {
    name: "Backoffice",
    href: "/backoffice",
    icon: BarChart3,
    roles: ["ADMIN"],
  },
  {
    name: "Usuarios",
    href: "/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    name: "Deliveries",
    href: "/dashboard/deliveryDashboard",
    icon: Truck,
    roles: ["DELIVERY", "ADMIN"],
  },
  {
    name: "Configuración",
    href: "/settings",
    icon: Settings,
    roles: ["USER", "DELIVERY", "ADMIN"],
  },
];

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, role, name, email, isAuthenticated, isLoading } =
    useCurrentUser();
  const pathname = usePathname();

  // Si no hay sesión, no mostrar el navbar
  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const userRole = role;
  const userName = name || email;

  // Filtrar navegación según el rol del usuario
  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(userRole!)
  );

  // Obtener iniciales del usuario
  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--elevated)] shadow-2xl border-b border-[var(--borders)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent hover:opacity-80 transition-all duration-300"
              >
                Última Milla
              </Link>
            </div>

            {/* User Info, Theme Toggle & Hamburger */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Avatar with Initials */}
              <div className="hidden sm:flex items-center gap-3 bg-[var(--surface)] px-4 py-2 rounded-full border border-[var(--borders)] hover:border-[var(--primary)] transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {getInitials(userName || "U")}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-[var(--text)]">
                    {userName}
                  </p>
                  <p className="text-xs text-[var(--textmuted)]">{userRole}</p>
                </div>
              </div>

              {/* Hamburger Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--elevated)] text-[var(--textmuted)] hover:text-[var(--text)] transition-all duration-300 border border-[var(--borders)] hover:border-[var(--primary)]"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[var(--elevated)] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } border-l border-[var(--borders)]`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--borders)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold shadow-lg">
                {getInitials(userName || "U")}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">
                  {userName}
                </p>
                <p className="text-xs text-[var(--textmuted)]">{userRole}</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-[var(--surface)] text-[var(--textmuted)] hover:text-[var(--text)] transition-all duration-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive
                      ? "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-lg shadow-[var(--primary)]/50"
                      : "text-[var(--textmuted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-transform duration-300 ${
                      isActive ? "" : "group-hover:scale-110"
                    }`}
                  />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-[var(--borders)]">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-[var(--error)] hover:text-red-300 hover:bg-red-950/30 transition-all duration-300 group border border-transparent hover:border-[var(--error)]/50"
            >
              <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-16" />
    </>
  );
}
