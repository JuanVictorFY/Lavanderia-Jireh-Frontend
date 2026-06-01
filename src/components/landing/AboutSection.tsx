import { motion, type Variants } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const PERKS = [
  "Productos de limpieza ecológicos y respetuosos con el medio ambiente",
  "Personal certificado y con amplia experiencia en lavandería",
  "Recogida y entrega gratuita en tu puerta",
  "Seguimiento en tiempo real de tu pedido",
];

const containerVariant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const itemVariant: Variants = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function AboutSection() {
  const { ref: textRef, isInView: textInView } = useScrollAnimation();
  const { ref: imgRef,  isInView: imgInView  } = useScrollAnimation();

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <motion.div
            ref={imgRef}
            initial={{ opacity: 0, x: -60 }}
            animate={imgInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] as const }}
            className="relative"
          >
            <motion.div
              animate={{ rotate: [0, 6, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-5 -left-5 w-28 h-28 bg-primary/10 rounded-3xl -z-10"
            />
            <motion.div
              animate={{ rotate: [0, -6, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-5 -right-5 w-40 h-40 bg-primary/15 rounded-3xl -z-10"
            />

            <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/5]">
              <motion.img
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.5 }}
                src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=600&q=80"
                alt="Familia usando el servicio de lavandería Jireh"
                className="w-full h-full object-cover"
              />
            </div>

            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -right-6 top-1/3 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
            >
              <p className="text-3xl font-extrabold text-primary">15+</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Años de experiencia</p>
            </motion.div>
          </motion.div>

          <motion.div
            ref={textRef}
            initial={{ opacity: 0, x: 60 }}
            animate={textInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] as const, delay: 0.1 }}
          >
            <span className="inline-block text-sm font-bold text-primary tracking-widest uppercase mb-3">
              Nuestra historia
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-dark leading-tight mb-5">
              15+ años de experiencia en lavandería y limpieza
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              En <strong className="text-dark">Jireh</strong> combinamos tecnología de punta con
              atención personalizada para devolverle a cada prenda su mejor versión. Tu ropa está
              en las mejores manos.
            </p>

            <motion.ul
              variants={containerVariant}
              initial="hidden"
              animate={textInView ? "visible" : "hidden"}
              className="space-y-3 mb-8"
            >
              {PERKS.map((perk) => (
                <motion.li key={perk} variants={itemVariant} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-gray-600 text-sm">{perk}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.a
              href="#services"
              whileHover={{ scale: 1.05, boxShadow: "0 6px 24px rgba(44,194,209,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold rounded-full shadow-md"
            >
              Ver servicios
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
