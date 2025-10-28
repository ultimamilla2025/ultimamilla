import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Forzar runtime de Node.js para todas las rutas (necesario para Prisma)
  experimental: {
    authInterrupts: true,
  },
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
