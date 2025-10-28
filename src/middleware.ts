//src\middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Matcher para las rutas protegidas
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
