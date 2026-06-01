import { Link } from "react-router-dom";
import { WashingMachine, Shirt, Sparkles, Flame, Wind, Layers, ArrowRight } from "lucide-react";
import { PublicNavbar, PublicFooter } from "@/components/landing/PublicLayout";

const SERVICIOS = [
  {
    icon: WashingMachine,
    title: "Lavado doméstico",
    desc: "Servicio completo de lavado, secado y doblado para tu ropa del día a día. Fresca y perfectamente doblada.",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
  },
  {
    icon: Shirt,
    title: "Limpieza en seco",
    desc: "Cuidado especializado para telas finas y ropa formal. Eliminamos manchas difíciles sin dañar la prenda.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    featured: true,
  },
  {
    icon: Sparkles,
    title: "Eliminación de manchas",
    desc: "Las manchas más difíciles no tienen oportunidad. Tratamientos avanzados que restauran tus prendas.",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-100",
  },
  {
    icon: Flame,
    title: "Planchado profesional",
    desc: "Acabado impecable en cada prenda. Tu ropa lucirá perfecta para cualquier ocasión.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: Wind,
    title: "Lavado de cortinas",
    desc: "Servicio especializado para cortinas y textiles del hogar. Sin desmontaje complicado.",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
  {
    icon: Layers,
    title: "Ropa de cama",
    desc: "Sábanas, edredones y almohadas tratados con productos hipoalergénicos para un descanso sano.",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
  },
];

const PASOS = [
  { n: "1", title: "Dejas tu ropa",    desc: "Llévala al local o solicita recojo a domicilio." },
  { n: "2", title: "La procesamos",    desc: "Nuestro equipo la trata con los mejores productos." },
  { n: "3", title: "Te avisamos",      desc: "Recibes una notificación cuando esté lista." },
  { n: "4", title: "La recoge",        desc: "Pásala a recoger o la enviamos a tu puerta." },
];

export default function ServiciosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      {/* Hero */}
      <section className="pt-28 pb-14 bg-gradient-to-br from-primary/8 via-white to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest mb-3">
            Lo que ofrecemos
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-dark leading-tight">
            Servicios diseñados para<br className="hidden sm:block" /> cada necesidad
          </h1>
          <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto">
            Desde lavado cotidiano hasta limpiezas especializadas, contamos con el servicio ideal para ti.
          </p>
        </div>
      </section>

      {/* Grid de servicios */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICIOS.map(({ icon: Icon, title, desc, color, bg, border, featured }) => (
              <div
                key={title}
                className={`relative bg-white rounded-2xl p-6 border ${border} shadow-sm flex flex-col gap-3 ${
                  featured ? "ring-2 ring-primary/25" : ""
                }`}
              >
                {featured && (
                  <span className="absolute -top-3 left-5 bg-primary text-white text-xs font-bold px-3 py-0.5 rounded-full">
                    Más solicitado
                  </span>
                )}
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="font-bold text-dark">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{desc}</p>
                <Link
                  to="/registro"
                  className={`inline-flex items-center gap-1 text-sm font-semibold ${color} hover:opacity-75 transition-opacity mt-1`}
                >
                  Solicitar <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-dark text-center mb-10">¿Cómo funciona?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PASOS.map(({ n, title, desc }) => (
              <div key={n} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white font-black text-lg flex items-center justify-center mx-auto mb-3 shadow-md shadow-primary/25">
                  {n}
                </div>
                <h4 className="font-bold text-dark mb-1">{title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-dark mb-3">¿Tienes un pedido activo?</h2>
          <p className="text-gray-500 mb-7">Consulta el estado de tu ropa en tiempo real con tu código de pedido.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/seguimiento" className="px-7 py-3 bg-primary text-white font-semibold rounded-full shadow-md hover:opacity-90 transition-opacity">
              Consultar mi pedido
            </Link>
            <Link to="/registro" className="px-7 py-3 border border-gray-200 text-dark font-semibold rounded-full hover:border-primary hover:text-primary transition-colors">
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
