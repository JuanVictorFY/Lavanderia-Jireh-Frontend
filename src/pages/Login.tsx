import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { WashingMachine, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import axios from "axios";

const schema = z.object({
  username: z.string().min(1, "Requerido"),
  password: z.string().min(1, "Requerido"),
});

type FormData = z.infer<typeof schema>;

export function Login() {
  const navigate = useNavigate();
  const { setTokens, setEmpleado } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      const res = await axios.post("/api/auth/login/", data);
      setTokens(res.data.access, res.data.refresh);
      if (res.data.empleado) setEmpleado(res.data.empleado);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.detail
          || err.response?.data?.non_field_errors?.[0]
          || err.response?.data?.error
          || "Credenciales incorrectas";
        setServerError(msg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07080F] via-[#0D0A1F] to-[#07080F] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-600/40 mb-4">
              <WashingMachine className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Lavandería Jireh</h1>
            <p className="text-slate-400 text-sm mt-1">Sistema de gestión</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Usuario</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register("username")}
                  placeholder="Tu nombre de usuario"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>
              {errors.username && <p className="text-xs text-red-400">{errors.username.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>

            {serverError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{serverError}</p>
              </div>
            )}

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full py-3 mt-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-violet-600/30 transition-all duration-200"
            >
              Ingresar al sistema
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          © {new Date().getFullYear()} Lavandería Jireh — Sistema interno
        </p>
      </div>
    </div>
  );
}
