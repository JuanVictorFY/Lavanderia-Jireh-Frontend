import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Phone, Truck, WashingMachine, PackageCheck } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect } from "react";

const STEPS = [
  {
    number: "01", icon: Phone,
    title: "Llámanos",
    description: "Haz tu pedido por teléfono, app o sitio web en segundos.",
    color: "#2cc2d1", ringColor: "ring-primary/30", lightBg: "bg-primary/10", badgeBg: "bg-primary",
  },
  {
    number: "02", icon: Truck,
    title: "Recogemos",
    description: "Nuestro conductor recoge tu ropa en la puerta de tu casa.",
    color: "#A855F7", ringColor: "ring-purple-300", lightBg: "bg-purple-100", badgeBg: "bg-purple-500",
  },
  {
    number: "03", icon: WashingMachine,
    title: "Lavamos",
    description: "Limpieza experta con productos premium para un resultado perfecto.",
    color: "#F59E0B", ringColor: "ring-yellow-300", lightBg: "bg-yellow-100", badgeBg: "bg-yellow-400",
  },
  {
    number: "04", icon: PackageCheck,
    title: "Entregamos",
    description: "Tu ropa fresca y limpia de vuelta en tu puerta.",
    color: "#10B981", ringColor: "ring-emerald-300", lightBg: "bg-emerald-100", badgeBg: "bg-emerald-500",
  },
];

function AnimatedLine({ isInView }: { isInView: boolean }) {
  const progress = useMotionValue(0);
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    if (isInView) {
      animate(progress, 1, { duration: 1.4, ease: "easeOut", delay: 0.3 });
    }
  }, [isInView, progress]);

  return (
    <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-[2px] bg-gray-200 overflow-hidden z-0">
      <motion.div style={{ width }} className="h-full bg-primary/50 origin-left" />
    </div>
  );
}

const stepVariant = {
  hidden:  { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.18, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function ProcessSection() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="process" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-bold text-primary tracking-widest uppercase mb-3">
            Nuestro proceso
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark">¿Cómo trabajamos?</h2>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto">
            Un proceso simple y sin complicaciones, diseñado para encajar en tu vida.
          </p>
        </motion.div>

        <div className="relative">
          <AnimatedLine isInView={isInView} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                custom={i}
                variants={stepVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.12, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 280 }}
                  className={`w-24 h-24 ${step.lightBg} rounded-full flex items-center justify-center mb-5 relative shadow-sm ring-4 ${step.ringColor}`}
                >
                  <step.icon className="w-9 h-9" style={{ color: step.color }} />
                  <span
                    className={`absolute -top-2 -right-2 w-7 h-7 ${step.badgeBg} text-white text-xs font-extrabold rounded-full flex items-center justify-center shadow-md`}
                  >
                    {i + 1}
                  </span>
                </motion.div>
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: step.color }}>
                  Paso {step.number}
                </p>
                <h3 className="text-base font-bold text-dark mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[11rem]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
