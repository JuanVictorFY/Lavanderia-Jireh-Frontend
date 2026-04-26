import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";

type AlertVariant = "info" | "success" | "warning" | "error";
interface AlertProps { variant?: AlertVariant; title?: string; children: React.ReactNode; className?: string; }

const CFG: Record<AlertVariant, { icon: React.ElementType; cls: string }> = {
  info:    { icon: Info,         cls: "bg-blue-500/10 border-blue-500/20 text-blue-300" },
  success: { icon: CheckCircle2, cls: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" },
  warning: { icon: AlertCircle,  cls: "bg-amber-500/10 border-amber-500/20 text-amber-300" },
  error:   { icon: XCircle,      cls: "bg-red-500/10 border-red-500/20 text-red-300" },
};

export function Alert({ variant = "info", title, children, className }: AlertProps) {
  const { icon: Icon, cls } = CFG[variant];
  return (
    <div className={cn("flex gap-3 rounded-xl border px-4 py-3 text-sm", cls, className)}>
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <div>
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div className="opacity-90">{children}</div>
      </div>
    </div>
  );
}
