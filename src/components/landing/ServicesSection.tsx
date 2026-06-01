import { motion } from "framer-motion";
import { WashingMachine, Shirt, Sparkles, Flame } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";

const SERVICES = [
  {
    icon: WashingMachine,
    title: "Lavado doméstico",
    description: "Servicio completo de lavado, secado y doblado para tu ropa del día a día. Fresca y perfectamente doblada cuando la necesites.",
    iconBg: "bg-yellow-100", iconColor: "text-yellow-500",
    accent: "#FBBF24", glow: "rgba(251,191,36,0.25)",
  },
  {
    icon: Shirt,
    title: "Limpieza en seco",
    description: "Cuidado delicado para telas finas y ropa formal. Nuestro proceso profesional elimina manchas difíciles sin dañar la prenda.",
    iconBg: "bg-purple-100", iconColor: "text-purple-500",
    accent: "#A855F7", glow: "rgba(168,85,247,0.22)",
    featured: true,
  },
  {
    icon: Sparkles,
    title: "Eliminación de manchas",
    description: "Las manchas más difíciles no tienen oportunidad. Nuestros especialistas aplican tratamientos avanzados para restaurar tus prendas.",
    iconBg: "bg-pink-100", iconColor: "text-pink-500",
    accent: "#EC4899", glow: "rgba(236,72,153,0.22)",
  },
  {
    icon: Flame,
    title: "Planchado profesional",
    description: "Acabado impecable en cada prenda. Nuestro equipo de planchado garantiza que tu ropa luzca perfecta en cada ocasión.",
    iconBg: "bg-blue-100", iconColor: "text-blue-500",
    accent: "#3B82F6", glow: "rgba(59,130,246,0.22)",
  },
];

const cardVariant = {
  hidden:  { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function ServicesSection() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-bold text-primary tracking-widest uppercase mb-3">
            Lo que ofrecemos
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark">
            Explora nuestros servicios
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Desde lavado cotidiano hasta limpiezas especializadas — tenemos un servicio diseñado para cada necesidad.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((svc, i) => (
            <motion.div
              key={svc.title}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -10, boxShadow: `0 20px 48px ${svc.glow}`, transition: { duration: 0.25 } }}
              className={`relative bg-white rounded-3xl p-8 shadow-sm flex flex-col items-center text-center transition-shadow duration-300 ${
                svc.featured ? "ring-2 ring-primary/30" : ""
              }`}
            >
              {svc.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                  Más popular
                </span>
              )}
              <motion.div
                whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.5 } }}
                className={`w-16 h-16 ${svc.iconBg} rounded-2xl flex items-center justify-center mb-5 shadow-sm`}
              >
                <svc.icon className={`w-8 h-8 ${svc.iconColor}`} />
              </motion.div>
              <h3 className="text-lg font-bold text-dark mb-3">{svc.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{svc.description}</p>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="mt-auto inline-flex items-center text-sm font-semibold transition-colors duration-200"
                style={{ color: svc.accent }}
              >
                Saber más →
              </motion.a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Link to="/login">
            <motion.span
              whileHover={{ scale: 1.05, boxShadow: "0 6px 24px rgba(44,194,209,0.30)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-full shadow-md cursor-pointer"
            >
              Solicitar servicio ahora
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
