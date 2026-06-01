import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { WashingMachine, LogIn, Menu, X } from "lucide-react";

const LINKS = [
  { label: "Inicio",      to: "/" },
  { label: "Nosotros",    to: "/nosotros" },
  { label: "Servicios",   to: "/servicios" },
  { label: "Mi pedido",   to: "/seguimiento" },
];

export function PublicNavbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-lg shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <WashingMachine className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-dark text-lg leading-none">
            Jireh<span className="text-primary">.</span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {LINKS.map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === to
                    ? "text-primary bg-primary/5"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link
            to="/registro"
            className="px-4 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-full hover:bg-primary/5 transition-colors"
          >
            Registrarme
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-full"
          >
            <LogIn className="w-3.5 h-3.5" />
            Ingresar
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-1">
          {LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                pathname === to ? "text-primary bg-primary/5" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Link to="/registro" onClick={() => setOpen(false)} className="flex-1 text-center py-2.5 text-sm font-semibold text-primary border border-primary/30 rounded-xl">
              Registrarme
            </Link>
            <Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center py-2.5 text-sm font-semibold text-white bg-primary rounded-xl">
              Ingresar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <WashingMachine className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white font-bold">Lavandería Jireh</span>
        </div>
        <p className="text-xs text-center">
          © {new Date().getFullYear()} Lavandería Jireh. Todos los derechos reservados.
        </p>
        <div className="flex gap-4 text-xs">
          {LINKS.slice(1).map(({ label, to }) => (
            <Link key={to} to={to} className="hover:text-white transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
