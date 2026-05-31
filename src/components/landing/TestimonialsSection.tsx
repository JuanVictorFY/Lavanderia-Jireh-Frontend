import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TESTIMONIALS = [
  {
    name: "María González", role: "Cliente habitual",
    avatar: "https://i.pravatar.cc/80?img=47", rating: 5,
    text: "¡Servicio increíble! Mi ropa regresa perfecta cada vez. El personal es muy amable y la puntualidad en la entrega es impecable. Definitivamente no confiaría mi lavandería a nadie más.",
  },
  {
    name: "Carlos Méndez", role: "Empresario",
    avatar: "https://i.pravatar.cc/80?img=12", rating: 5,
    text: "Como profesional con agenda apretada, dependo completamente de Jireh. Manejan los uniformes de mi empresa con un cuidado excepcional. La calidad es consistente y el tiempo de entrega es impresionante.",
  },
  {
    name: "Sofía Rodríguez", role: "Mamá de familia",
    avatar: "https://i.pravatar.cc/80?img=23", rating: 5,
    text: "Estaba escéptica al principio, pero después de que eliminaron una mancha muy difícil de la ropa de mi hijo, quedé completamente convencida. Excelente precio y resultados aún mejores.",
  },
  {
    name: "Andrés Herrera", role: "Chef profesional",
    avatar: "https://i.pravatar.cc/80?img=32", rating: 5,
    text: "Mis uniformes de cocina quedaban imposibles de limpiar hasta que encontré Jireh. Ahora llegan impecables y con olor a limpio. El servicio a domicilio es un ahorro de tiempo enorme.",
  },
];

const ALL_AVATARS = [
  "https://i.pravatar.cc/80?img=47",
  "https://i.pravatar.cc/80?img=12",
  "https://i.pravatar.cc/80?img=23",
  "https://i.pravatar.cc/80?img=32",
  "https://i.pravatar.cc/80?img=55",
];

const slideVariant = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60, transition: { duration: 0.3 } }),
};

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const { ref, isInView } = useScrollAnimation();

  const go = (delta: number) => {
    setDirection(delta);
    setActive((a) => (a + delta + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-sm font-bold text-primary tracking-widest uppercase mb-3">
            Testimonios
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark">
            Lo que dicen nuestros 20K+ clientes
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center mb-8"
        >
          <div className="flex -space-x-3">
            {ALL_AVATARS.map((src, i) => (
              <motion.img
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                src={src}
                alt="cliente"
                className="w-10 h-10 rounded-full ring-2 ring-white object-cover"
              />
            ))}
            <div className="w-10 h-10 rounded-full ring-2 ring-white bg-primary flex items-center justify-center text-white text-xs font-bold">
              20k
            </div>
          </div>
        </motion.div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              variants={slideVariant}
              initial="enter"
              animate="center"
              exit="exit"
              className="bg-gray-50 rounded-3xl p-8 md:p-12 text-center relative shadow-sm"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              >
                <Quote className="w-10 h-10 text-primary/25 mx-auto mb-6" />
              </motion.div>

              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                &ldquo;{TESTIMONIALS[active].text}&rdquo;
              </p>

              <div className="flex justify-center gap-1 mb-5">
                {Array.from({ length: TESTIMONIALS[active].rating }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.25 + i * 0.07 }}
                  >
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                ))}
              </div>

              <img
                src={TESTIMONIALS[active].avatar}
                alt={TESTIMONIALS[active].name}
                className="w-16 h-16 rounded-full mx-auto mb-3 ring-4 ring-white shadow-md object-cover"
              />
              <p className="font-bold text-dark">{TESTIMONIALS[active].name}</p>
              <p className="text-sm text-gray-400 mt-0.5">{TESTIMONIALS[active].role}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center items-center gap-4 mt-8">
          <motion.button
            onClick={() => go(-1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>

          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                animate={{ width: i === active ? 24 : 10 }}
                className={`rounded-full h-2.5 transition-colors duration-300 ${i === active ? "bg-primary" : "bg-gray-200"}`}
                aria-label={`Testimonio ${i + 1}`}
              />
            ))}
          </div>

          <motion.button
            onClick={() => go(1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
