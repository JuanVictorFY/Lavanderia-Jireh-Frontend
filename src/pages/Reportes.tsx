import { useQuery } from "@tanstack/react-query";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, BarChart3, Download, Users, ShoppingBag, DollarSign, Package,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageSpinner } from "@/components/ui/spinner";
import { formatCurrency } from "@/lib/utils";
import api from "@/lib/api";

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
const ESTADO_COLORS: Record<string, string> = {
  Pendiente:    "#F59E0B",
  "En proceso": "#2cc2d1",
  Listo:        "#10B981",
  Entregado:    "#6366F1",
  Cancelado:    "#EF4444",
};

interface ChartTooltipProps { active?: boolean; payload?: { value: number }[]; label?: string }

const CustomTooltipMoney = ({ active, payload, label }: ChartTooltipProps) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-[#1A1C2E] border border-slate-200 dark:border-white/10 rounded-xl shadow-lg px-4 py-2.5 text-sm">
        <p className="font-semibold text-slate-600 dark:text-slate-300 mb-1">{label}</p>
        <p className="text-primary">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

function ResumenCard({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4 py-5">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      </CardBody>
    </Card>
  );
}

export function Reportes() {
  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: ["analytics"],
    queryFn: () => api.get("/reportes/analytics/").then((r) => r.data),
    staleTime: 60_000,
  });

  const descargarExcel = async () => {
    const response = await api.get("/reportes/excel/", { responseType: "blob" });
    const url = URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    a.download = `lavanderia_jireh_${today}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading || !analytics) return <PageSpinner />;

  const { resumen, ingresos_semana, ingresos_mes, pedidos_por_estado, top_servicios } = analytics;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Reportes</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Resumen de actividad y estadísticas del negocio</p>
        </div>
        <Button leftIcon={<Download className="w-4 h-4" />} onClick={descargarExcel} className="self-start sm:self-auto">
          Exportar Excel
        </Button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ResumenCard
          icon={<ShoppingBag className="w-5 h-5 text-primary" />}
          color="bg-primary/10"
          label="Pedidos hoy"
          value={resumen.pedidos_hoy}
        />
        <ResumenCard
          icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
          color="bg-emerald-500/10"
          label="Ingresos hoy"
          value={formatCurrency(resumen.ingresos_hoy)}
        />
        <ResumenCard
          icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
          color="bg-blue-500/10"
          label="Pedidos este mes"
          value={resumen.pedidos_mes}
        />
        <ResumenCard
          icon={<Users className="w-5 h-5 text-amber-500" />}
          color="bg-amber-500/10"
          label="Clientes registrados"
          value={resumen.clientes_total}
        />
      </div>

      {/* Gráficas fila 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Ingresos 7 días */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-100">Ingresos últimos 7 días</h2>
            </div>
          </CardHeader>
          <CardBody className="pt-1 pb-5">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={ingresos_semana} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradCeleste2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2cc2d1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2cc2d1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `S/${v}`} />
                <Tooltip content={<CustomTooltipMoney />} />
                <Area type="monotone" dataKey="total" stroke="#2cc2d1" strokeWidth={2.5} fill="url(#gradCeleste2)" dot={{ r: 4, fill: "#2cc2d1", strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Pedidos por estado */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-100">Pedidos por estado</h2>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col items-center pt-1 pb-5">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={pedidos_por_estado}
                  dataKey="count"
                  nameKey="estado"
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={68}
                  paddingAngle={3}
                >
                  {pedidos_por_estado.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.estado.toLowerCase() === "cancelado" ? "#EF4444" : (ESTADO_COLORS[entry.estado] ?? PIE_COLORS[i % PIE_COLORS.length])}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "12px" }}
                  formatter={(v, n) => [`${v} pedidos`, `${n}`]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-2 mt-1">
              {pedidos_por_estado.map((e, i) => (
                <div key={e.estado} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: e.estado.toLowerCase() === "cancelado" ? "#EF4444" : (ESTADO_COLORS[e.estado] ?? PIE_COLORS[i % PIE_COLORS.length]) }}
                    />
                    <span className="text-slate-500 dark:text-slate-400">{e.estado}</span>
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{e.count}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Gráficas fila 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Ingresos por mes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-100">Ingresos por mes</h2>
            </div>
          </CardHeader>
          <CardBody className="pt-1 pb-5">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ingresos_mes} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `S/${v}`} />
                <Tooltip content={<CustomTooltipMoney />} />
                <Bar dataKey="total" fill="#2cc2d1" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Top servicios */}
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-100">Top servicios solicitados</h2>
          </CardHeader>
          <CardBody className="pt-1 pb-5">
            {top_servicios.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">Sin datos aún</p>
            ) : (
              <div className="space-y-3">
                {top_servicios.map((s, i) => {
                  const max = top_servicios[0].count;
                  const pct = max > 0 ? (s.count / max) * 100 : 0;
                  return (
                    <div key={s.nombre}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate">{s.nombre}</span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-200 ml-2">{s.count}</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            background: PIE_COLORS[i % PIE_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
