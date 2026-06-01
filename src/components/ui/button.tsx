import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
}

const variantClasses = {
  primary:   "bg-primary text-white hover:bg-primary-dark shadow-sm shadow-primary/20",
  secondary: "bg-slate-100 dark:bg-white/7 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/12",
  ghost:     "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/7 hover:text-slate-700 dark:hover:text-slate-200",
  danger:    "bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-600/20",
  outline:   "border border-slate-200 dark:border-white/12 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, leftIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0B0D17] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
