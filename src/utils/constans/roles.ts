import { Role } from "@/generated/prisma";
import { BadgeVariant } from "@/components/ui/badge";

export const ROLE_NAMES: Record<Role, string> = {
  ADMIN: "ADMINISTRADOR",
  DELIVERY: "REPARTIDOR",
  USER: "USUARIO",
};

export const ROLE_VARIANTS: Record<Role, BadgeVariant> = {
  ADMIN: "admin",
  DELIVERY: "delivery",
  USER: "user",
};
