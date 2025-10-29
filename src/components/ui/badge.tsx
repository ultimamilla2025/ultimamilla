import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "accent"
  | "outline"
  | "admin"
  | "delivery"
  | "user";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20",
  secondary:
    "bg-[var(--secondary)]/10 text-[var(--secondary)] border-[var(--secondary)]/20",
  success:
    "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
  warning:
    "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20",
  error: "bg-[var(--error)]/10 text-[var(--error)] border-[var(--error)]/20",
  info: "bg-[var(--info)]/10 text-[var(--info)] border-[var(--info)]/20",
  accent:
    "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20",
  outline: "text-[var(--text)] border-[var(--borders)]",
  admin: "bg-primary/20 text-primary border-primary/30",
  delivery: "bg-accent/20 text-accent border-accent/30",
  user: "bg-secondary/20 text-secondary border-secondary/30",
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
