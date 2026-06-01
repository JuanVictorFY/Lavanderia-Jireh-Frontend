import { useAuthStore } from "@/store/auth";
import { DashboardOperario } from "@/pages/DashboardOperario";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingBag, Clock, CheckCircle2, TrendingUp, WashingMachine, BarChart3,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { EstadoBadge } from "@/components/ui/badge";
import { PageSpinner } from "@/components/ui/spinner";
import { formatCurrency, formatDate } from "@/lib/utils";
import api from "@/lib/api";
import type { Pedido, PaginatedResponse } from "@/types";
import { useNavigate } from "react-router-dom";

interface Analytics {
  ingresos_semana: { fecha: string; total: number }[];
  ingresos_mes: { mes: string; total: number }[];
  pedidos_por_estado: { estado: string; count: number }[];
  top_servicios: { nombre: string; count: number }[];
  resumen: {
    pedidos_hoy: number;
    ingresos_hoy: number;
    pedidos_mes: number;
    clientes_total: number;
  };
}

const PIE_COLORS = ["#2cc2d1", "#F59E0B", "#10B981", "#EC4899", "#EF4444"];

function StatCard({
  icon, label, value, sub, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <Card className="flex-1">
      <CardBody className="flex items-start gap-4 py-5">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
          {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
        </div>
      </CardBody>
    </Card>
  );
}

interface TooltipEntry { name: string; value: number; color: string }
interface ChartTooltipProps { active?: boolean; payload?: TooltipEntry[]; label?: string }

const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-[#1A1C2E] border border-slate-200 dark:border-white/10 rounded-xl shadow-lg px-4 py-2.5 text-sm">
        <p className="font-semibold text-slate-600 dark:text-slate-300 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const empleado = useAuthStore((s) => s.empleado);
  const navigate = useNavigate();

  const esOperario = empleado?.rol === "operario" || empleado?.rol === "recepcionista";

  const { data, isLoading } = useQuery<PaginatedResponse<Pedido>>({
    queryKey: ["pedidos"],
    queryFn: () => api.get("/pedidos/").then((r) => r.data),
    enabled: !esOperario,
  });

  const { data: analytics } = useQuery<Analytics>({
    queryKey: ["analytics"],
    queryFn: () => api.get("/reportes/analytics/").then((r) => r.data),
    staleTime: 60_000,
    enabled: !esOperario,
  });

  if (esOperario) {
    return <DashboardOperario />;
  }

  const pedidos = data?.results ?? [];
  const pendientes = pedidos.filter((p) => p.estado === "pendiente").length;
  const enProceso  = pedidos.filter((p) => p.estado === "en_proceso").length;
  const listos     = pedidos.filter((p) => p.estado === "listo").length;
  const recientes  = pedidos.slice(0, 6);

  const hora   = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {saludo}, {empleado?.nombres}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Aquí tienes el resumen del día</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2 self-start sm:self-auto">
          <WashingMachine className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {new Date().toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" })}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<ShoppingBag className="w-5 h-5 text-primary" />}
          color="bg-primary/10"
          label="Pedidos hoy"
          value={analytics?.resumen.pedidos_hoy ?? 0}
          sub={`${data?.count ?? 0} en total`}
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-amber-500" />}
          color="bg-amber-500/10"
          label="Pendientes"
          value={pendientes}
          sub={enProceso > 0 ? `${enProceso} en proceso` : undefined}
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          color="bg-emerald-500/10"
          label="Listos para entrega"
          value={listos}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
          color="bg-primary/10"
          label="Ingresos hoy"
          value={formatCurrency(analytics?.resumen.ingresos_hoy ?? 0)}
        />
      </div>

      {/* Gráficas */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Ingresos 7 días */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-100">Ingresos últimos 7 días</h2>
              </div>
            </CardHeader>
            <CardBody className="pt-1 pb-4">
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={analytics.ingresos_semana} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradCeleste" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#2cc2d1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2cc2d1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `S/${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="total" stroke="#2cc2d1" strokeWidth={2} fill="url(#gradCeleste)" dot={{ r: 3, fill: "#2cc2d1" }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Pedidos por estado */}
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-100">Pedidos por estado</h2>
            </CardHeader>
            <CardBody className="flex flex-col items-center pt-1 pb-4">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={analytics.pedidos_por_estado}
                    dataKey="count"
                    nameKey="estado"
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={60}
                    paddingAngle={3}
                  >
                    {analytics.pedidos_por_estado.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.estado.toLowerCase() === "cancelado" ? "#EF4444" : PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "12px" }}
                    formatter={(v, n) => [`${v}`, `${n}`]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full space-y-1.5 mt-1">
                {analytics.pedidos_por_estado.map((e, i) => (
                  <div key={e.estado} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: e.estado.toLowerCase() === "cancelado" ? "#EF4444" : PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      <span className="text-slate-500">{e.estado}</span>
                    </div>
                    <span className="font-semibold text-slate-700">{e.count}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Ingresos 6 meses */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-100">Ingresos por mes</h2>
              </div>
            </CardHeader>
            <CardBody className="pt-1 pb-4">
              <ResponsiveContainer width="100%" height={170}>
                <BarChart data={analytics.ingresos_mes} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `S/${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" fill="#2cc2d1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Top servicios */}
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-100">Top servicios</h2>
            </CardHeader>
            <CardBody className="pt-1 pb-4">
              <ResponsiveContainer width="100%" height={170}>
                <BarChart
                  layout="vertical"
                  data={analytics.top_servicios}
                  margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="nombre" type="category" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} width={70} />
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "12px" }}
                  />
                  <Bar dataKey="count" fill="#22a8b6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800 dark:text-white">Pedidos recientes</h2>
          <button
            onClick={() => navigate("/pedidos")}
            className="text-sm text-primary hover:text-primary-dark font-medium cursor-pointer transition-colors"
          >
            Ver todos →
          </button>
        </div>

        <Card>
          <div className="divide-y divide-slate-100">
            {recientes.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-sm">
                No hay pedidos registrados aún
              </div>
            )}
            {recientes.map((pedido) => (
              <div
                key={pedido.id}
                onClick={() => navigate(`/pedidos/${pedido.id}`)}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{pedido.codigo}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{pedido.cliente_nombre}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <p className="text-sm text-slate-400 dark:text-slate-500 hidden md:block">{formatDate(pedido.fecha_ingreso)}</p>
                  <EstadoBadge estado={pedido.estado} />
                  <p className="text-sm font-semibold text-slate-700 dark:text-white text-right whitespace-nowrap">
                    {formatCurrency(pedido.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
