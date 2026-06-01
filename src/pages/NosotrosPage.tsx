import { Link } from "react-router-dom";
import { Heart, Clock, Shield, Star, Users } from "lucide-react";
import { PublicNavbar, PublicFooter } from "@/components/landing/PublicLayout";

const VALORES = [
  { icon: Heart,  color: "text-rose-500",   bg: "bg-rose-50",   title: "Compromiso",  desc: "Cada prenda se trata como si fuera propia. La calidad es nuestra promesa desde el primer día." },
  { icon: Clock,  color: "text-amber-500",  bg: "bg-amber-50",  title: "Puntualidad", desc: "Cumplimos con los tiempos acordados porque sabemos que tu tiempo es lo más valioso." },
  { icon: Shield, color: "text-blue-500",   bg: "bg-blue-50",   title: "Confianza",   desc: "Más de 15 años de experiencia nos respaldan. Tus prendas siempre están en buenas manos." },
  { icon: Star,   color: "text-violet-500", bg: "bg-violet-50", title: "Excelencia",  desc: "Usamos productos de alta calidad y tecnología moderna para lograr resultados impecables." },
];

const STATS = [
  { value: "15+",  label: "Años de experiencia" },
  { value: "20K+", label: "Clientes satisfechos" },
  { value: "99%",  label: "Satisfacción" },
  { value: "6",    label: "Servicios especializados" },
];

export default function NosotrosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-primary/8 via-white to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest mb-3">
            Sobre nosotros
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-dark leading-tight">
            Más de 15 años cuidando<br className="hidden sm:block" /> tu ropa con dedicación
          </h1>
          <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Lavandería Jireh nació con una sola meta: ofrecer un servicio de lavandería
            impecable, a tiempo y con la confianza que merece cada prenda.
          </p>
        </div>
      </section>

      {/* Historia + Stats */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-dark mb-4">Nuestra historia</h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Fundada por la familia Jireh en Lima, empezamos con un pequeño local y
                grandes sueños. Con esfuerzo y constancia, crecimos hasta convertirnos
                en una referencia de calidad y confianza para miles de hogares.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Hoy contamos con tecnología de punta, un equipo especializado y más de{" "}
                <strong className="text-dark">20,000 clientes satisfechos</strong> que
                confían en nosotros semana a semana.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map(({ value, label }) => (
                <div key={label} className="bg-primary/5 rounded-2xl p-6 text-center">
                  <p className="text-3xl font-black text-primary">{value}</p>
                  <p className="text-sm text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-dark text-center mb-10">Nuestros valores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALORES.map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-dark mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <Users className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-3">¿Listo para unirte a nuestra familia?</h2>
          <p className="text-gray-500 mb-7">
            Regístrate gratis o consulta el estado de tu pedido en segundos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/registro"
              className="px-7 py-3 bg-primary text-white font-semibold rounded-full shadow-md hover:opacity-90 transition-opacity"
            >
              Crear cuenta
            </Link>
            <Link
              to="/seguimiento"
              className="px-7 py-3 border border-gray-200 text-dark font-semibold rounded-full hover:border-primary hover:text-primary transition-colors"
            >
              Consultar mi pedido
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
