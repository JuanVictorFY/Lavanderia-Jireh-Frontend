import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { WashingMachine, CheckCircle2, LogIn, ArrowLeft } from "lucide-react";
import { PublicNavbar, PublicFooter } from "@/components/landing/PublicLayout";

const schema = z.object({
  nombres:   z.string().min(2, "Mínimo 2 caracteres"),
  apellidos: z.string().min(2, "Mínimo 2 caracteres"),
  dni:       z.string().length(8, "El DNI debe tener 8 dígitos").regex(/^\d+$/, "Solo números"),
  telefono:  z.string().min(9, "Mínimo 9 dígitos").regex(/^\d+$/, "Solo números").optional().or(z.literal("")),
  correo:    z.string().email("Correo inválido").optional().or(z.literal("")),
  direccion: z.string().optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

function Field({
  label,
  error,
  children,
  optional,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {optional && <span className="ml-1 text-gray-400 font-normal text-xs">(opcional)</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Registro() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      await axios.post("/api/clientes/registro/", {
        nombres:   data.nombres,
        apellidos: data.apellidos,
        dni:       data.dni,
        telefono:  data.telefono  || null,
        correo:    data.correo    || null,
        direccion: data.direccion || null,
      });
      setSuccess(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const d = err.response.data;
        const msg =
          d.detail ||
          d.non_field_errors?.[0] ||
          d.dni?.[0] ||
          d.correo?.[0] ||
          "Ocurrió un error. Inténtalo nuevamente.";
        setServerError(msg);
      } else {
        setServerError("Error de conexión. Verifica tu red e inténtalo nuevamente.");
      }
    }
  };

  const inputCls =
    "w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors";

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-dark mb-3">¡Registro exitoso!</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Tu cuenta de cliente ha sido creada. Puedes acercarte al local o llamarnos
              para agendar tu primer pedido.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/seguimiento"
                className="px-6 py-3 bg-primary text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
              >
                Consultar mi pedido
              </Link>
              <Link
                to="/"
                className="px-6 py-3 border border-gray-200 text-dark font-semibold rounded-full hover:border-primary hover:text-primary transition-colors"
              >
                Ir al inicio
              </Link>
            </div>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <div className="flex-1 flex items-start justify-center px-4 py-24">
        <div className="w-full max-w-lg">
          {/* Cabecera */}
          <div className="mb-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
              <WashingMachine className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-dark">Crear cuenta de cliente</h1>
            <p className="text-gray-500 text-sm mt-2">
              Regístrate para hacer seguimiento a tus pedidos y más.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nombres" error={errors.nombres?.message}>
                <input
                  {...register("nombres")}
                  placeholder="Juan"
                  className={inputCls}
                />
              </Field>
              <Field label="Apellidos" error={errors.apellidos?.message}>
                <input
                  {...register("apellidos")}
                  placeholder="Pérez"
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="DNI" error={errors.dni?.message}>
              <input
                {...register("dni")}
                placeholder="12345678"
                maxLength={8}
                className={inputCls}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Teléfono" error={errors.telefono?.message} optional>
                <input
                  {...register("telefono")}
                  placeholder="987654321"
                  className={inputCls}
                />
              </Field>
              <Field label="Correo electrónico" error={errors.correo?.message} optional>
                <input
                  {...register("correo")}
                  type="email"
                  placeholder="correo@email.com"
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Dirección" error={errors.direccion?.message} optional>
              <input
                {...register("direccion")}
                placeholder="Av. Principal 123, Lima"
                className={inputCls}
              />
            </Field>

            {serverError && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-sm text-red-600">{serverError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? "Registrando..." : "Crear mi cuenta"}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-3 text-sm text-gray-500">
            <p>
              ¿Ya tienes un pedido?{" "}
              <Link to="/seguimiento" className="text-primary font-semibold hover:underline">
                Consulta el estado aquí
              </Link>
            </p>
            <p>
              ¿Eres empleado?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
                <LogIn className="w-3.5 h-3.5" /> Acceder al sistema
              </Link>
            </p>
            <Link to="/" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-primary transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
