import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const BUBBLES = [
  { size: 130, top: "8%",  left: "4%",   delay: 0   },
  { size: 80,  top: "72%", left: "2%",   delay: 1.3 },
  { size: 210, top: "18%", right: "2%",  delay: 0.7 },
  { size: 65,  top: "78%", right: "7%",  delay: 1.9 },
  { size: 110, top: "48%", left: "38%",  delay: 1.0 },
  { size: 55,  top: "4%",  left: "52%",  delay: 2.2 },
  { size: 45,  top: "60%", left: "22%",  delay: 0.4 },
  { size: 90,  top: "35%", right: "20%", delay: 1.6 },
] as const;

const ROTATING_WORDS = ["Ropa", "Ropa de Cama", "Uniformes", "Cortinas"];

const textReveal = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.14 + 0.2, duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

interface AnimatedWordProps { word: string }

function AnimatedWord({ word }: AnimatedWordProps) {
  return (
    <motion.span
      key={word}
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: "0%",   opacity: 1 }}
      exit={{    y: "-100%", opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
      className="inline-block text-white underline decoration-white/50 decoration-4 underline-offset-4"
    >
      {word}
    </motion.span>
  );
}

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setWordIndex((w) => (w + 1) % ROTATING_WORDS.length), 2500);
    return () => clearInterval(id);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - left) / width  - 0.5) * 18);
    mouseY.set(((e.clientY - top)  / height - 0.5) * 18);
  };

  return (
    <section
      id="home"
      aria-label="Inicio"
      className="relative min-h-screen bg-primary overflow-hidden flex items-center pt-20"
      onMouseMove={handleMouseMove}
    >
      {BUBBLES.map((b, i) => (
        <motion.div
          key={i}
          animate={{ y: [-14, 14, -14] }}
          transition={{ duration: 5 + b.delay * 0.5, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
          className="absolute rounded-full bg-white/10 pointer-events-none"
          style={{ width: b.size, height: b.size, top: b.top, left: "left" in b ? b.left : undefined, right: "right" in b ? b.right : undefined }}
        />
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(255,255,255,0.12)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="text-white">
            <motion.span
              custom={0} variants={textReveal} initial="hidden" animate="visible"
              className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase bg-white/20 px-4 py-1.5 rounded-full mb-6"
            >
              <Star className="w-3.5 h-3.5 fill-white" />
              Servicio #1 en Lavandería
            </motion.span>

            <motion.h1
              custom={1} variants={textReveal} initial="hidden" animate="visible"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4"
            >
              El mejor lugar para lavar tu{" "}
              <span className="relative inline-block overflow-hidden h-[1.2em] align-bottom">
                <AnimatedWord word={ROTATING_WORDS[wordIndex]} />
              </span>
            </motion.h1>

            <motion.p
              custom={2} variants={textReveal} initial="hidden" animate="visible"
              className="text-white/80 text-lg leading-relaxed mb-8 max-w-md"
            >
              En <strong className="text-white">Jireh</strong> combinamos tecnología y cuidado
              artesanal para devolverte prendas impecables, a tiempo y en tu puerta.
            </motion.p>

            <motion.div
              custom={3} variants={textReveal} initial="hidden" animate="visible"
              className="flex flex-wrap gap-4"
            >
              <motion.a
                href="#services"
                whileHover={{ scale: 1.05, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary font-bold rounded-full shadow-lg"
              >
                Ver servicios
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <Link to="/login">
                <motion.span
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                  className="inline-flex items-center px-7 py-3.5 bg-white/15 text-white font-semibold rounded-full border border-white/30 transition-colors duration-200 cursor-pointer"
                >
                  Acceder al sistema
                </motion.span>
              </Link>
            </motion.div>

            <motion.div
              custom={4} variants={textReveal} initial="hidden" animate="visible"
              className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20"
            >
              {[
                { value: "20K+", label: "Clientes felices" },
                { value: "99%",  label: "Satisfacción" },
                { value: "12 h", label: "Entrega express" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-3xl font-extrabold">{value}</p>
                  <p className="text-white/70 text-sm mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            style={{ x: springX, y: springY }}
            initial={{ opacity: 0, scale: 0.88, x: 50 }}
            animate={{ opacity: 1, scale: 1,    x: 0  }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-white/20 rounded-[40%_60%_60%_40%/40%_40%_60%_60%] blur-3xl" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&q=80"
                  alt="Persona feliz con ropa limpia"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/10" />
              </div>

              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 left-6 bg-white rounded-2xl px-4 py-3 shadow-xl"
              >
                <p className="text-xs text-gray-500 font-medium">Entrega hoy</p>
                <p className="text-sm font-bold text-dark">Limpieza express ✓</p>
              </motion.div>

              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute top-6 right-6 bg-white rounded-2xl px-3 py-2 shadow-xl flex items-center gap-2"
              >
                <span className="text-lg">⭐</span>
                <div>
                  <p className="text-xs font-bold text-dark">4.9 / 5</p>
                  <p className="text-[10px] text-gray-400">2,400 reseñas</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 40Q1080 0 720 40Q360 80 0 40Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
