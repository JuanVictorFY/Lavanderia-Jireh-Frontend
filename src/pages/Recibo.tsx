import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft, Printer, CheckCircle, Clock, Package,
  Droplets, Wind, Zap, Sparkles, MapPin, Phone, Calendar, Hash,
  Mail, Send, CheckCircle2,
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import api from "@/lib/api";
import type { Pedido, Cliente, EstadoPedidoValue } from "@/types";

// ── Logo SVG ──────────────────────────────────────────────────────────────────
function LogoSVG({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <radialGradient id="logoGrad" cx="40%" cy="35%">
          <stop offset="0%"  stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#0E7490" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#logoGrad)" />
      <rect x="14" y="10" width="72" height="60" rx="7" fill="white" />
      <rect x="14" y="52" width="72" height="18" rx="0" fill="#BAE6FD" />
      <circle cx="26" cy="61" r="4"   fill="#0891B2" />
      <circle cx="37" cy="61" r="4"   fill="#38BDF8" />
      <rect   x="55" y="57" width="22" height="8" rx="4" fill="#7DD3FC" />
      <circle cx="50" cy="34" r="22"  fill="#E0F7FA" stroke="#0891B2" strokeWidth="4" />
      <circle cx="50" cy="34" r="9"   fill="#0891B2" />
      <circle cx="50" cy="34" r="3.5" fill="#E0F7FA" />
      <circle cx="17" cy="80" r="6"   fill="white" opacity="0.75" />
      <circle cx="28" cy="90" r="4"   fill="white" opacity="0.50" />
      <circle cx="9"  cy="90" r="3"   fill="white" opacity="0.35" />
      <ellipse cx="80" cy="80" rx="8"  ry="13" fill="#059669" transform="rotate(-25 80 80)" />
      <ellipse cx="87" cy="71" rx="6"  ry="9"  fill="#16A34A" transform="rotate(-25 87 71)" />
    </svg>
  );
}

// ── Estado ────────────────────────────────────────────────────────────────────
const ESTADO_CFG: Record<EstadoPedidoValue, { label: string; color: string; bg: string; dot: string }> = {
  pendiente:  { label: "Pendiente",           color: "text-amber-700",  bg: "bg-amber-50  border-amber-200",  dot: "bg-amber-500"  },
  en_proceso: { label: "En Proceso",          color: "text-sky-700",    bg: "bg-sky-50    border-sky-200",    dot: "bg-sky-500"    },
  listo:      { label: "Listo para entrega",  color: "text-teal-700",   bg: "bg-teal-50   border-teal-200",   dot: "bg-teal-500"   },
  entregado:  { label: "Entregado",           color: "text-green-700",  bg: "bg-green-50  border-green-200",  dot: "bg-green-500"  },
  cancelado:  { label: "Cancelado",           color: "text-red-700",    bg: "bg-red-50    border-red-200",    dot: "bg-red-500"    },
};

const SVC_ICONS  = [Droplets, Wind, Zap, Sparkles] as const;
const SVC_COLORS = [
  { bg: "bg-sky-100",    icon: "text-sky-600"    },
  { bg: "bg-amber-100",  icon: "text-amber-600"  },
  { bg: "bg-purple-100", icon: "text-purple-600" },
  { bg: "bg-teal-100",   icon: "text-teal-600"   },
];

// ── Botón enviar correo ───────────────────────────────────────────────────────
function BtnEnviarCorreo({ pedidoId, correo }: { pedidoId: string; correo?: string | null }) {
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: () => api.post(`/pedidos/${pedidoId}/enviar-recibo/`),
    onSuccess: () => setSent(true),
  });

  if (!correo) return null;

  if (sent) {
    return (
      <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold">
        <CheckCircle2 className="w-4 h-4" />
        Enviado a {correo}
      </div>
    );
  }

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
    >
      {mutation.isPending ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <Send className="w-4 h-4" />
      )}
      Enviar al correo
    </button>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────
export function Recibo() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: pedido, isLoading: loadPedido } = useQuery<Pedido>({
    queryKey: ["pedido", id],
    queryFn: () => api.get(`/pedidos/${id}/`).then((r) => r.data),
  });

  const { data: cliente } = useQuery<Cliente>({
    queryKey: ["cliente-recibo", pedido?.cliente_id],
    queryFn: () => api.get(`/clientes/${pedido!.cliente_id}/`).then((r) => r.data),
    enabled: !!pedido?.cliente_id,
  });

  if (loadPedido || !pedido) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: "linear-gradient(135deg,#0E7490 0%,#0891B2 50%,#22D3EE 100%)" }}>
        <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const total    = parseFloat(pedido.total);
  const subtotal = total / 1.18;
  const igv      = total - subtotal;
  const estado   = ESTADO_CFG[pedido.estado] ?? ESTADO_CFG.pendiente;
  const qrValue  = `${pedido.codigo} | ${pedido.cliente_nombre} | S/ ${pedido.total}`;

  // Datos del cliente: primero del pedido (si backend los incluye), luego del fetch secundario
  const clienteDni      = pedido.cliente_dni      ?? cliente?.dni      ?? null;
  const clienteTelefono = pedido.cliente_telefono ?? cliente?.telefono ?? null;
  const clienteCorreo   = pedido.cliente_correo   ?? cliente?.correo   ?? null;
  const clienteDireccion = pedido.cliente_direccion ?? cliente?.direccion ?? null;

  return (
    <div
      className="min-h-screen py-10 px-4 print:bg-white print:py-0"
      style={{ background: "linear-gradient(135deg,#0C4A6E 0%,#0891B2 55%,#67E8F9 100%)" }}
    >
      {/* ── Barra superior ─────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center gap-3 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <div className="flex-1" />
        <BtnEnviarCorreo pedidoId={id!} correo={clienteCorreo} />
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-white text-teal-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-teal-50 transition-colors shadow-lg"
        >
          <Printer className="w-4 h-4" /> Imprimir
        </button>
      </div>

      {/* ── Tarjeta principal ───────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden print:rounded-none print:shadow-none">

        {/* ═══ HEADER ══════════════════════════════════════════════════════ */}
        <div
          className="relative overflow-hidden px-8 py-8"
          style={{ background: "linear-gradient(135deg,#0E7490 0%,#0891B2 60%,#22D3EE 100%)" }}
        >
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-12 -left-8  w-36 h-36 rounded-full bg-white/5" />
          <div className="absolute top-4   right-24   w-16 h-16 rounded-full bg-white/8" />

          <div className="relative flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/15 backdrop-blur-sm p-2.5 rounded-2xl ring-1 ring-white/25">
                <LogoSVG size={54} />
              </div>
              <div>
                <h1 className="text-white font-bold text-2xl leading-tight tracking-tight">
                  Lavandería Jireh
                </h1>
                <p className="text-teal-100 text-sm mt-0.5">Servicio Profesional de Lavandería</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-teal-200 text-xs font-semibold uppercase tracking-widest mb-1">
                Recibo Electrónico
              </p>
              <p className="text-white font-mono font-bold text-2xl tracking-wide">
                {pedido.codigo}
              </p>
              <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full border text-xs font-semibold ${estado.bg} ${estado.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${estado.dot} animate-pulse`} />
                {estado.label}
              </div>
            </div>
          </div>

          <div className="relative mt-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative bg-white/20 backdrop-blur-sm px-6 py-1.5 rounded-full text-white text-xs font-bold tracking-[0.25em] uppercase">
              Recibo Electrónico
            </div>
          </div>
        </div>

        {/* ═══ CUERPO ═══════════════════════════════════════════════════════ */}
        <div className="p-6 space-y-6">

          {/* ── Info cliente + QR ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Cliente */}
            <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Datos del Cliente
              </p>
              <p className="text-lg font-bold text-slate-800 leading-tight">
                {pedido.cliente_nombre}
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Hash className="w-3.5 h-3.5 shrink-0" />
                  <span>DNI: {clienteDni ?? "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>{clienteTelefono ?? "—"}</span>
                </div>
                {clienteCorreo && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{clienteCorreo}</span>
                  </div>
                )}
                {clienteDireccion && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{clienteDireccion}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pedido + QR */}
            <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Datos del Pedido
              </p>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Ingreso: {formatDate(pedido.fecha_ingreso)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Entrega: {formatDate(pedido.fecha_entrega)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Atendido por: {pedido.empleado_nombre}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className="bg-white/80 rounded-xl p-1.5">
                    <div className="flex items-center gap-1 mb-1.5">
                      <div className="bg-teal-100 border border-teal-300 rounded px-1 py-0.5">
                        <span className="text-[7px] font-black text-teal-700">CPE</span>
                      </div>
                      <span className="text-[8px] text-slate-400">Comprobante</span>
                    </div>
                    <QRCodeSVG value={qrValue} size={90} bgColor="#FFFFFF" fgColor="#0F172A" level="M" />
                  </div>
                  <p className="text-[9px] text-slate-400">Escanea para verificar</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Prendas / Servicios ─────────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-slate-400" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Servicios / Prendas
              </p>
            </div>

            <div className="grid grid-cols-12 gap-2 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold uppercase tracking-wide mb-1">
              <div className="col-span-1" />
              <div className="col-span-5">Prenda</div>
              <div className="col-span-2 text-center">Cant.</div>
              <div className="col-span-2 text-center">Peso</div>
              <div className="col-span-2 text-right">Precio</div>
            </div>

            <div className="space-y-1">
              {pedido.prendas.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">
                  Sin prendas registradas
                </div>
              ) : (
                pedido.prendas.map((prenda, i) => {
                  const Icon  = SVC_ICONS[i % SVC_ICONS.length];
                  const clr   = SVC_COLORS[i % SVC_COLORS.length];
                  return (
                    <div
                      key={i}
                      className="grid grid-cols-12 gap-2 items-center px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                    >
                      <div className="col-span-1">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${clr.bg}`}>
                          <Icon className={`w-4 h-4 ${clr.icon}`} />
                        </div>
                      </div>
                      <div className="col-span-5">
                        <p className="text-sm font-semibold text-slate-800">{prenda.tipo_prenda}</p>
                        {prenda.color && (
                          <p className="text-xs text-slate-400">Color: {prenda.color}</p>
                        )}
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="text-sm font-medium text-slate-700 tabular-nums">
                          {prenda.cantidad}
                        </span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="text-sm text-slate-500 tabular-nums">
                          {prenda.peso} kg
                        </span>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className="text-sm font-semibold text-slate-400 tabular-nums">—</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Observaciones ───────────────────────────────────────────── */}
          {pedido.observaciones && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">
                Observaciones
              </p>
              <p className="text-sm text-slate-700">{pedido.observaciones}</p>
            </div>
          )}

          {/* ── Resumen de pago ──────────────────────────────────────────── */}
          <div className="flex justify-end">
            <div className="w-full sm:w-80">
              <div className="rounded-t-2xl px-5 py-3 text-center bg-linear-to-r from-teal-800 to-teal-600">
                <p className="text-white font-bold text-sm tracking-wider uppercase">
                  Resumen de Pago
                </p>
              </div>
              <div className="border-x border-slate-200 divide-y divide-slate-100">
                <PayRow label="Subtotal"  value={`S/ ${subtotal.toFixed(2)}`} />
                <PayRow label="Descuento" value="S/ 0.00" muted />
                <PayRow label="IGV (18%)" value={`S/ ${igv.toFixed(2)}`} />
              </div>
              <div className="rounded-b-2xl bg-linear-to-r from-teal-600 to-teal-500 px-5 py-4 flex items-center justify-between border border-teal-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-200" />
                  <p className="text-white font-bold text-sm">TOTAL A PAGAR</p>
                </div>
                <p className="text-white font-black text-2xl tabular-nums">
                  {formatCurrency(pedido.total)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ FOOTER ═══════════════════════════════════════════════════════ */}
        <div className="border-t border-slate-100 px-6 py-5 bg-slate-50 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <p className="text-xs">
              Emitido el {formatDate(pedido.fecha_ingreso)} · {pedido.codigo}
            </p>
          </div>
          <p className="text-xs text-slate-400">
            Consultas: <span className="text-teal-600 font-medium">lavanderiajireh.com</span>
            {clienteTelefono && <> · {clienteTelefono}</>}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Helper ────────────────────────────────────────────────────────────────────
function PayRow({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="bg-white px-5 py-2.5 flex items-center justify-between">
      <span className={`text-sm ${muted ? "text-slate-400" : "text-slate-600"}`}>{label}</span>
      <span className={`text-sm font-medium tabular-nums ${muted ? "text-slate-400" : "text-slate-800"}`}>
        {value}
      </span>
    </div>
  );
}
