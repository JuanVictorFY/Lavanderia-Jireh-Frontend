import { useState } from "react";
import { Search, WashingMachine, Package, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import axios from "axios";
import type { EstadoPedidoValue } from "@/types";

interface PedidoPublico {
  codigo: string;
  cliente: string;
  estado_actual: EstadoPedidoValue;
  fecha_ingreso: string;
  fecha_entrega: string | null;
  total: string;
  historial: { estado: string; descripcion: string | null; fecha: string }[];
}

const ESTADO_ICONS: Record<string, React.ReactNode> = {
  pendiente:  <Clock className="w-5 h-5 text-amber-400" />,
  en_proceso: <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />,
  listo:      <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  entregado:  <CheckCircle2 className="w-5 h-5 text-slate-400" />,
  cancelado:  <XCircle className="w-5 h-5 text-red-400" />,
};

const ESTADO_LABELS: Record<string, string> = {
  pendiente:  "Pendiente",
  en_proceso: "En proceso",
  listo:      "Listo para recoger ✓",
  entregado:  "Entregado",
  cancelado:  "Cancelado",
};

const ESTADOS_TIMELINE: EstadoPedidoValue[] = ["pendiente", "en_proceso", "listo", "entregado"];

function estadoIndex(e: EstadoPedidoValue) {
  return ESTADOS_TIMELINE.indexOf(e);
}

export function ConsultaPublica() {
  const [codigo, setCodigo] = useState("");
  const [pedido, setPedido] = useState<PedidoPublico | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buscar = async () => {
    if (!codigo.trim()) return;
    setLoading(true);
    setError("");
    setPedido(null);
    try {
      const res = await axios.get(`/pedido/${codigo.trim().toUpperCase()}/`);
      setPedido(res.data);
    } catch {
      setError("No encontramos ningún pedido con ese código. Verifica e intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = pedido ? estadoIndex(pedido.estado_actual) : -1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07080F] via-[#0D0A1F] to-[#07080F] flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-xl relative">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-600/40 mb-4">
            <WashingMachine className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Lavandería Jireh</h1>
          <p className="text-slate-400 text-sm mt-1">Consulta el estado de tu pedido</p>
        </div>

        {/* Buscador */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <p className="text-slate-300 text-sm mb-3 font-medium">Ingresa tu código de pedido</p>
          <div className="flex gap-2">
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && buscar()}
              placeholder="Ej: LAV-AB12CD"
              className="flex-1 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            <button
              onClick={buscar}
              disabled={loading || !codigo.trim()}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl px-4 py-3 transition-all flex items-center gap-2 font-medium text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Buscar
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Resultado */}
        {pedido && (
          <div className="mt-5 bg-[#111422] rounded-2xl shadow-2xl border border-white/8 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-700 to-violet-600 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-200 text-xs font-medium uppercase tracking-wider">Código</p>
                  <p className="text-2xl font-bold font-mono">{pedido.codigo}</p>
                </div>
                <div className="text-right">
                  <p className="text-violet-200 text-xs">Total</p>
                  <p className="text-xl font-bold">{formatCurrency(pedido.total)}</p>
                </div>
              </div>
              <p className="mt-2 text-violet-100 text-sm">{pedido.cliente}</p>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Progress bar */}
              {pedido.estado_actual !== "cancelado" && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Progreso</p>
                  <div className="flex items-center gap-0">
                    {ESTADOS_TIMELINE.map((e, i) => (
                      <div key={e} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                              i <= currentStep
                                ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                                : "bg-white/8 text-slate-500"
                            )}
                          >
                            {i < currentStep ? "✓" : i + 1}
                          </div>
                          <p className={cn(
                            "text-xs mt-1.5 font-medium text-center w-16",
                            i <= currentStep ? "text-violet-400" : "text-slate-600"
                          )}>
                            {ESTADO_LABELS[e]}
                          </p>
                        </div>
                        {i < ESTADOS_TIMELINE.length - 1 && (
                          <div className={cn(
                            "flex-1 h-0.5 mb-5 mx-1 transition-all",
                            i < currentStep ? "bg-violet-600" : "bg-white/10"
                          )} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Estado actual */}
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                {ESTADO_ICONS[pedido.estado_actual]}
                <div>
                  <p className="text-xs text-slate-500">Estado actual</p>
                  <p className="text-sm font-semibold text-slate-100">
                    {ESTADO_LABELS[pedido.estado_actual]}
                  </p>
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Fecha de ingreso</p>
                  <p className="text-sm text-slate-300 mt-0.5">{formatDate(pedido.fecha_ingreso)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Entrega estimada</p>
                  <p className="text-sm text-slate-300 mt-0.5">{formatDate(pedido.fecha_entrega)}</p>
                </div>
              </div>

              {/* Historial */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-slate-500" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Historial</p>
                </div>
                <div className="space-y-2.5">
                  {pedido.historial.map((h, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <div className="flex flex-col items-center mt-1">
                        <div className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          i === pedido.historial.length - 1 ? "bg-violet-500" : "bg-slate-600"
                        )} />
                        {i < pedido.historial.length - 1 && <div className="w-px flex-1 bg-white/10 mt-1" />}
                      </div>
                      <div className="pb-2">
                        <p className="font-medium text-slate-200 capitalize">{h.estado.replace("_", " ")}</p>
                        <p className="text-xs text-slate-500">{formatDate(h.fecha)}</p>
                        {h.descripcion && <p className="text-xs text-slate-400 mt-0.5">{h.descripcion}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-slate-600 text-xs mt-6">
          ¿Necesitas ayuda? Llámanos o visítanos en nuestra tienda.
        </p>
      </div>
    </div>
  );
}
