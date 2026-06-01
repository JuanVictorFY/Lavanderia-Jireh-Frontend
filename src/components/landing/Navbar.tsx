import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { WashingMachine, Menu, X, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Inicio",      href: "#home",     to: null },
  { label: "Nosotros",    href: null,        to: "/nosotros" },
  { label: "Servicios",   href: null,        to: "/nuestros-servicios" },
  { label: "Mi pedido",   href: null,        to: "/seguimiento" },
  { label: "Contacto",    href: "#contact",  to: null },
];

const navVariant = {
  hidden:  { y: -90, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const linkVariant: Variants = {
  hidden:  { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.35 + i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      variants={navVariant}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/96 backdrop-blur-lg shadow-[0_2px_24px_rgba(44,194,209,0.12)]"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <motion.a
            href="#home"
            className="flex items-center gap-2"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
              className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm"
            >
              <WashingMachine className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-extrabold text-dark tracking-tight">
              Jireh<span className="text-primary">.</span>
            </span>
          </motion.a>

          {/* Links escritorio */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href, to }, i) => (
              <motion.li key={label} custom={i} variants={linkVariant} initial="hidden" animate="visible">
                {to ? (
                  <Link
                    to={to}
                    className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors duration-200 group inline-block"
                  >
                    {label}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-primary rounded-full transition-all duration-300 group-hover:w-4/5" />
                  </Link>
                ) : (
                  <a
                    href={href!}
                    className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors duration-200 group inline-block"
                  >
                    {label}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-primary rounded-full transition-all duration-300 group-hover:w-4/5" />
                  </a>
                )}
              </motion.li>
            ))}
          </ul>

          {/* CTAs escritorio */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="hidden md:flex items-center gap-2"
          >
            <Link to="/registro">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:border-primary transition-colors duration-200 text-sm font-semibold text-dark cursor-pointer"
              >
                Registrarme
              </motion.span>
            </Link>

            <Link to="/login">
              <motion.span
                whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(44,194,209,0.30)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full shadow-md cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                Ingresar
              </motion.span>
            </Link>
          </motion.div>

          {/* Toggle móvil */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Abrir menú"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mobileOpen ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{   rotate: 90,   opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Menú móvil */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{   opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <ul className="flex flex-col px-4 py-4 gap-1">
              {NAV_LINKS.map(({ label, href, to }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.28 }}
                >
                  {to ? (
                    <Link
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href!}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                    >
                      {label}
                    </a>
                  )}
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.06 + 0.05, duration: 0.28 }}
                className="pt-2 flex flex-col gap-2"
              >
                <Link
                  to="/registro"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-primary/30 text-primary font-semibold text-sm rounded-xl"
                >
                  Registrarme
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl"
                >
                  <LogIn className="w-4 h-4" />
                  Ingresar
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
