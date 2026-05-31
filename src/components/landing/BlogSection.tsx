import { motion } from "framer-motion";
import { User, MessageCircle, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const POSTS = [
  {
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&q=80",
    date: "29 Jul 2025", author: "Admin", comments: 12,
    title: "5 consejos para mantener tu ropa como nueva después de cada lavado",
  },
  {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    date: "14 Ago 2025", author: "Admin", comments: 8,
    title: "Cómo elegir el mejor servicio de limpieza en seco para telas delicadas",
  },
  {
    image: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=600&q=80",
    date: "03 Sep 2025", author: "Admin", comments: 21,
    title: "La guía definitiva para eliminar manchas difíciles en casa",
  },
  {
    image: "https://images.unsplash.com/photo-1515940279136-d4e5a2b04166?w=600&q=80",
    date: "18 Oct 2025", author: "Admin", comments: 15,
    title: "Limpieza en seco vs lavado tradicional: ¿cuándo elegir cada uno?",
  },
];

const cardVariant = {
  hidden:  { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function BlogSection() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="blog" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-bold text-primary tracking-widest uppercase mb-3">
            Consejos y novedades
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark">
            Nuestras últimas publicaciones
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {POSTS.map((post, i) => (
            <motion.article
              key={post.title}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -8, transition: { duration: 0.22 } }}
              className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.07 }}
                  transition={{ duration: 0.5 }}
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  {post.date}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    Por {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {post.comments} comentarios
                  </span>
                </div>
                <h3 className="font-bold text-dark leading-snug mb-4 group-hover:text-primary transition-colors duration-200">
                  {post.title}
                </h3>
                <motion.a
                  href="#"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Leer más <ArrowRight className="w-4 h-4" />
                </motion.a>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Ver todos los artículos <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
