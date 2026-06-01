import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useThemeStore } from "@/store/theme";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Scissors,
  CreditCard,
  UserCog,
  LogOut,
  WashingMachine,
  BarChart3,
  X,
  Sun,
  Moon,
} from "lucide-react";

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  adminOnly?: boolean;
  noOperario?: boolean;
}

const navItems: NavItem[] = [
  { to: "/dashboard",  icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
  { to: "/pedidos",    icon: <ShoppingBag className="w-5 h-5" />,     label: "Pedidos" },
  { to: "/clientes",   icon: <Users className="w-5 h-5" />,           label: "Clientes",  noOperario: true },
  { to: "/servicios",  icon: <Scissors className="w-5 h-5" />,        label: "Servicios", noOperario: true },
  { to: "/pagos",      icon: <CreditCard className="w-5 h-5" />,      label: "Pagos",     noOperario: true },
  { to: "/reportes",   icon: <BarChart3 className="w-5 h-5" />,       label: "Reportes",  adminOnly: true },
  { to: "/empleados",  icon: <UserCog className="w-5 h-5" />,         label: "Empleados", adminOnly: true },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { empleado, logout, isAdmin, isOperario } = useAuthStore();
  const { isDark, toggle } = useThemeStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavClick = () => {
    onClose?.();
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen w-60 flex flex-col z-40 transition-transform duration-300",
        "bg-white dark:bg-[#0D0F1A]",
        "border-r border-slate-200 dark:border-white/6",
        "md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="px-5 py-6 border-b border-slate-100 dark:border-white/6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <WashingMachine className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-slate-800 dark:text-white font-bold text-sm leading-tight">Lavandería</p>
            <p className="text-primary text-xs font-medium">Jireh</p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/7 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems
          .filter((item) => !item.adminOnly  || isAdmin())
          .filter((item) => !item.noOperario || !isOperario())
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-white shadow-sm shadow-primary/30"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-cyan-50 dark:hover:bg-white/7"
                )
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-slate-100 dark:border-white/6">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
            {empleado?.nombres?.[0]}{empleado?.apellidos?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-slate-700 dark:text-slate-200 text-xs font-medium truncate">
              {empleado?.nombres} {empleado?.apellidos}
            </p>
            <p className="text-slate-400 text-xs capitalize truncate">{empleado?.rol}</p>
          </div>
        </div>

        {/* Tema toggle */}
        <button
          onClick={toggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/7 transition-all duration-150 cursor-pointer mb-0.5"
        >
          {isDark
            ? <Sun className="w-5 h-5 text-amber-400" />
            : <Moon className="w-5 h-5 text-slate-400" />
          }
          {isDark ? "Modo claro" : "Modo oscuro"}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-150 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
