import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  WashingMachine, Phone, Mail, MapPin,
  Users, MessageCircle, Camera, PlayCircle,
  ChevronUp, Send,
} from "lucide-react";
import { Link } from "react-router-dom";

const QUICK_LINKS  = ["Inicio", "Nosotros", "Servicios", "Cómo funcionamos", "Blog", "Contacto"];
const SERVICES_LIST = ["Lavado doméstico", "Limpieza en seco", "Eliminación de manchas", "Planchado profesional", "Limpieza de cortinas", "Pedidos al por mayor"];
const CATEGORIES    = ["Ropa diaria", "Ropa formal", "Telas delicadas", "Ropa infantil", "Ropa deportiva", "Ropa de cama y lencería"];

const colVariant: Variants = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: "easeOut" },
  }),
};

function FooterLink({ href = "#", children }: { href?: string; children: React.ReactNode }) {
  return (
    <li>
      <motion.a
        href={href}
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 400 }}
        className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm inline-block"
      >
        {children}
      </motion.a>
    </li>
  );
}

export default function Footer() {
  const [email,      setEmail]      = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  return (
    <footer id="contact" className="bg-dark text-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Columna 1 — Marca */}
          <motion.div
            custom={0} variants={colVariant} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <a href="#home" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <WashingMachine className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                Jireh<span className="text-primary">.</span>
              </span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Lavandería y limpieza en seco profesional a domicilio. Con más de 15 años de experiencia
              y 20,000 clientes satisfechos, Jireh es tu aliado para prendas perfectas.
            </p>

            <motion.a
              href="tel:18001234567"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary rounded-full px-4 py-2.5 text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              1800-1234-1234
            </motion.a>

            <div className="flex gap-3 mt-6">
              {[
                { Icon: Users,        label: "Facebook" },
                { Icon: MessageCircle, label: "Twitter / X" },
                { Icon: Camera,       label: "Instagram" },
                { Icon: PlayCircle,   label: "YouTube" },
              ].map(({ Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  whileHover={{ scale: 1.15, backgroundColor: "var(--color-primary)" }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center transition-colors duration-200"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>

            <div className="mt-6">
              <Link to="/login">
                <motion.span
                  whileHover={{ scale: 1.04, boxShadow: "0 4px 20px rgba(44,194,209,0.30)" }}
                  className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-5 py-2.5 text-sm font-semibold cursor-pointer shadow-md"
                >
                  Acceder al sistema →
                </motion.span>
              </Link>
            </div>
          </motion.div>

          {/* Columna 2 */}
          <motion.div custom={1} variants={colVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-5">Links rápidos</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => <FooterLink key={link}>{link}</FooterLink>)}
            </ul>
          </motion.div>

          {/* Columna 3 */}
          <motion.div custom={2} variants={colVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-5">Nuestros servicios</h3>
            <ul className="space-y-2.5">
              {SERVICES_LIST.map((s) => <FooterLink key={s}>{s}</FooterLink>)}
            </ul>
          </motion.div>

          {/* Columna 4 */}
          <motion.div custom={3} variants={colVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-5">Categorías</h3>
            <ul className="space-y-2.5">
              {CATEGORIES.map((c) => <FooterLink key={c}>{c}</FooterLink>)}
            </ul>
            <div className="mt-6 space-y-2">
              <a href="mailto:hola@jireh.com" className="flex items-center gap-2 text-gray-400 hover:text-primary text-sm transition-colors">
                <Mail className="w-4 h-4 shrink-0" />
                hola@jireh.com
              </a>
              <p className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                Av. Principal 123, Ciudad Limpia, CL 10001
              </p>
              <p className="text-gray-400 text-sm pl-6">Lun–Sáb: 7:00 am – 9:00 pm</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="text-center lg:text-left"
            >
              <h3 className="text-lg font-bold mb-1">Nuestro boletín</h3>
              <p className="text-gray-400 text-sm">
                Suscríbete para recibir ofertas exclusivas, consejos y novedades de Jireh.
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onSubmit={handleSubscribe}
                  className="flex w-full lg:w-auto"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu correo electrónico"
                    required
                    className="flex-1 lg:w-72 px-5 py-3.5 bg-white/10 text-white placeholder-gray-400 text-sm rounded-l-full border border-white/10 focus:outline-none focus:border-primary transition-colors"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white font-semibold text-sm rounded-r-full transition-colors duration-200 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    Suscribirme
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex items-center gap-2 text-primary font-semibold"
                >
                  ✓ ¡Gracias por suscribirte!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Lavandería Jireh. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            {["Política de privacidad", "Términos de uso", "Cookies"].map((link) => (
              <a key={link} href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.15, boxShadow: "0 8px 24px rgba(44,194,209,0.45)" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-primary text-white rounded-full shadow-lg flex items-center justify-center"
        aria-label="Volver arriba"
      >
        <ChevronUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
}
