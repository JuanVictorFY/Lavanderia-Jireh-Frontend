import { motion } from "framer-motion";
import { PackageCheck, CalendarCheck, Clock, Star, Leaf } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: PackageCheck,
    title: "Entrega en punto",
    description: "Puntos de entrega convenientes en toda la ciudad. Deja tu ropa y nosotros nos encargamos de todo.",
  },
  {
    icon: CalendarCheck,
    title: "Reserva en línea",
    description: "Programa recogidas y entregas desde nuestra app o sitio web en menos de 60 segundos, en cualquier momento.",
  },
  {
    icon: Clock,
    title: "Puntualidad garantizada",
    description: "Garantizamos la entrega en 1 hora dentro del horario acordado. Sin retrasos, sin excusas.",
  },
  {
    icon: Star,
    title: "Calidad premium",
    description: "Detergentes y técnicas de nivel profesional aseguran que cada prenda regresa en condiciones impecables.",
  },
  {
    icon: Leaf,
    title: "Eco-amigable",
    description: "Usamos productos biodegradables y procesos de bajo consumo de agua para cuidar el planeta.",
  },
];

const listVariant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const itemVariant = {
  hidden:  { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function FeaturesSection() {
  const { ref: leftRef, isInView: leftInView } = useScrollAnimation();
  const { ref: imgRef,  isInView: imgInView  } = useScrollAnimation();

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <div>
            <span className="inline-block text-sm font-bold text-primary tracking-widest uppercase mb-3">
              ¿Por qué elegirnos?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-dark leading-tight mb-8">
              Entrega puntual y la mejor calidad en lavandería
            </h2>

            <motion.ul
              ref={leftRef}
              variants={listVariant}
              initial="hidden"
              animate={leftInView ? "visible" : "hidden"}
              className="space-y-5"
            >
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <motion.li
                  key={title}
                  variants={itemVariant}
                  className="flex gap-4 items-start group cursor-default"
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 350 }}
                    className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-200"
                  >
                    <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-200" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-dark mb-0.5">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={leftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-8"
            >
              <Link to="/login">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm cursor-pointer"
                >
                  Ver todas las ventajas <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            ref={imgRef}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={imgInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] as const }}
            className="relative flex justify-center"
          >
            <div className="relative max-w-sm w-full">
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-primary/10 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] -z-10"
              />
              <div className="rounded-3xl overflow-hidden shadow-xl aspect-[3/4]">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  src="https://images.unsplash.com/photo-1521656958802-c50e5a3bde90?w=600&q=80"
                  alt="Cliente feliz con ropa limpia de Jireh"
                  className="w-full h-full object-cover"
                />
              </div>

              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-6 bottom-1/4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <PackageCheck className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pedido listo</p>
                    <p className="text-sm font-bold text-dark">Entrega en 1 h</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
