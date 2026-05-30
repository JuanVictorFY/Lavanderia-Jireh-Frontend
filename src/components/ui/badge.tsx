import { cn } from "@/lib/utils";
import type { EstadoPedidoValue } from "@/types";

const estadoConfig: Record<
  EstadoPedidoValue,
  { label: string; className: string }
> = {
  pendiente:  { label: "Pendiente",  className: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  en_proceso: { label: "En Proceso", className: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  listo:      { label: "Listo",      className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  entregado:  { label: "Entregado",  className: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
  cancelado:  { label: "Cancelado",  className: "bg-red-500/15 text-red-400 border-red-500/20" },
};

interface EstadoBadgeProps {
  estado: EstadoPedidoValue;
  className?: string;
}

export function EstadoBadge({ estado, className }: EstadoBadgeProps) {
  const config = estadoConfig[estado] ?? { label: estado, className: "bg-slate-500/15 text-slate-400 border-slate-500/20" };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
        config.className,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {config.label}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "success" | "warning" | "danger";
  className?: string;
}

const variantClasses = {
  default:   "bg-violet-500/15 text-violet-400 border-violet-500/20",
  secondary: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  success:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  warning:   "bg-amber-500/15 text-amber-400 border-amber-500/20",
  danger:    "bg-red-500/15 text-red-400 border-red-500/20",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
