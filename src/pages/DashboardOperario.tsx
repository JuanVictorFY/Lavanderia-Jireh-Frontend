import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, CheckCircle2, PlayCircle, ArrowRight, Flame, RefreshCw, Package, ChevronRight } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageSpinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/auth";
import { formatDate } from "@/lib/utils";
import api from "@/lib/api";
import type { Pedido, PaginatedResponse } from "@/types";
import { useNavigate } from "react-router-dom";

/* ─── Helpers de urgencia ─── */
function isToday(d: string | null) {
  if (!d) return false;
  const t = new Date(), v = new Date(d);
  return v.getFullYear() === t.getFullYear() && v.getMonth() === t.getMonth() && v.getDate() === t.getDate();
}
function isOverdue(d: string | null) {
  if (!d) return false;
  const v = new Date(d); v.setHours(23, 59, 59, 999);
  return v < new Date();
}
function urgency(p: Pedido): "overdue" | "today" | null {
  if (isOverdue(p.fecha_entrega)) return "overdue";
  if (isToday(p.fecha_entrega))   return "today";
  return null;
}
function sortByUrgency(a: Pedido, b: Pedido) {
  const aU = urgency(a) !== null ? 0 : 1;
  const bU = urgency(b) !== null ? 0 : 1;
  if (aU !== bU) return aU - bU;
  if (!a.fecha_entrega) return 1;
  if (!b.fecha_entrega) return -1;
  return new Date(a.fecha_entrega).getTime() - new Date(b.fecha_entrega).getTime();
}

/* ─── Stat card ─── */
function StatCard({ icon, label, value, color, urgent }: {
  icon: React.ReactNode; label: string; value: number; color: string; urgent?: boolean;
}) {
  return (
    <Card className={urgent && value > 0 ? "border border-red-400/50" : ""}>
      <CardBody className="flex items-center gap-3 py-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
        <div>
          <p className={`text-2xl font-bold ${urgent && value > 0 ? "text-red-500" : "text-slate-800 dark:text-white"}`}>{value}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      </CardBody>
    </Card>
  );
}

/* ─── Fila de pedido ─── */
function PedidoRow({ pedido, etiqueta, loading, onAccion, onNav, variant = "primary" }: {
  pedido: Pedido; etiqueta: string; loading: boolean;
  onAccion: () => void; onNav: () => void; variant?: "primary" | "secondary";
}) {
  const u = urgency(pedido);
  return (
    <div className="px-4 py-3.5 flex items-center gap-3">
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onNav}>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-slate-800 dark:text-white font-mono">{pedido.codigo}</p>
          {u === "overdue" && (
            <span className="text-xs font-semibold text-red-600 bg-red-100 rounded px-1.5 py-0.5 leading-none">Vencido</span>
          )}
          {u === "today" && (
            <span className="text-xs font-semibold text-orange-600 bg-orange-100 rounded px-1.5 py-0.5 leading-none">Entrega hoy</span>
          )}
        </div>
        <p className="text-xs text-slate-500 truncate mt-0.5">{pedido.cliente_nombre}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <Package className="w-3 h-3" />
            {pedido.prendas.length} {pedido.prendas.length === 1 ? "prenda" : "prendas"}
          </span>
          {pedido.fecha_entrega && u === null && (
            <span className="text-xs text-slate-400">Entrega: {formatDate(pedido.fecha_entrega)}</span>
          )}
        </div>
      </div>
      <Button size="sm" variant={variant} loading={loading} onClick={onAccion}>
        {etiqueta}
      </Button>
    </div>
  );
}

/* ─── Dashboard principal ─── */
export function DashboardOperario() {
  const empleado = useAuthStore((s) => s.empleado);
  const navigate  = useNavigate();
  const qc        = useQueryClient();

  const hora   = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";

  const { data, isLoading, dataUpdatedAt } = useQuery<PaginatedResponse<Pedido>>({
    queryKey: ["pedidos-operario"],
    queryFn:  () => api.get("/pedidos/?page_size=100").then((r) => r.data),
    staleTime:       30_000,
    refetchInterval: 30_000,
  });

  const cambiarEstado = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) =>
      api.patch(`/pedidos/${id}/cambiar-estado/`, { estado, descripcion: "" }),
    onMutate: async ({ id, estado }) => {
      await qc.cancelQueries({ queryKey: ["pedidos-operario"] });
      const prev = qc.getQueryData<PaginatedResponse<Pedido>>(["pedidos-operario"]);
      qc.setQueryData<PaginatedResponse<Pedido>>(["pedidos-operario"], (old) =>
        old ? { ...old, results: old.results.map((p) => p.id === id ? { ...p, estado: estado as Pedido["estado"] } : p) } : old
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => { if (ctx?.prev) qc.setQueryData(["pedidos-operario"], ctx.prev); },
    onSettled: () => qc.invalidateQueries({ queryKey: ["pedidos-operario"] }),
  });

  const cargando = (id: number) => cambiarEstado.isPending && cambiarEstado.variables?.id === id;

  if (isLoading) return <PageSpinner />;

  const todos      = data?.results ?? [];
  const enProceso  = todos.filter((p) => p.estado === "en_proceso");
  const pendientes = todos.filter((p) => p.estado === "pendiente").sort(sortByUrgency);
  const urgentes   = pendientes.filter((p) => urgency(p) !== null);
  const normales   = pendientes.filter((p) => urgency(p) === null);
  const listos     = todos.filter((p) => p.estado === "listo");
  const listosVista = listos.slice(0, 5);

  const updatedTime = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{saludo}, {empleado?.nombres}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {new Date().toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        {updatedTime && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 self-start sm:self-auto">
            <RefreshCw className="w-3 h-3" />
            Actualizado {updatedTime}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<Clock        className="w-4 h-4 text-amber-500"  />} color="bg-amber-500/10"  label="Pendientes" value={pendientes.length} />
        <StatCard icon={<PlayCircle   className="w-4 h-4 text-primary"    />} color="bg-primary/10"    label="En proceso"  value={enProceso.length} />
        <StatCard icon={<Flame        className="w-4 h-4 text-red-500"    />} color="bg-red-500/10"    label="Urgentes"    value={urgentes.length}  urgent />
        <StatCard icon={<CheckCircle2 className="w-4 h-4 text-emerald-500"/>} color="bg-emerald-500/10" label="Listos"     value={listos.length} />
      </div>

      {/* Cola de trabajo + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">

          {/* Trabajando ahora */}
          {enProceso.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-100">Trabajando ahora ({enProceso.length})</h2>
                </div>
              </CardHeader>
              <div className="divide-y divide-slate-100">
                {enProceso.map((p) => (
                  <PedidoRow key={p.id} pedido={p} etiqueta="Marcar listo" variant="secondary"
                    loading={cargando(p.id)}
                    onAccion={() => cambiarEstado.mutate({ id: p.id, estado: "listo" })}
                    onNav={() => navigate(`/pedidos/${p.id}`)}
                  />
                ))}
              </div>
            </Card>
          )}

          {/* Urgentes */}
          {urgentes.length > 0 && (
            <Card className="border border-red-400/30">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-500" />
                  <h2 className="text-sm font-semibold text-red-600">Urgentes — entrega hoy o vencida ({urgentes.length})</h2>
                </div>
              </CardHeader>
              <div className="divide-y divide-slate-100">
                {urgentes.map((p) => (
                  <PedidoRow key={p.id} pedido={p} etiqueta="Iniciar"
                    loading={cargando(p.id)}
                    onAccion={() => cambiarEstado.mutate({ id: p.id, estado: "en_proceso" })}
                    onNav={() => navigate(`/pedidos/${p.id}`)}
                  />
                ))}
              </div>
            </Card>
          )}

          {/* Por iniciar */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-100">Por iniciar ({normales.length})</h2>
              </div>
            </CardHeader>
            {normales.length === 0 ? (
              <CardBody>
                <p className="text-sm text-slate-400 py-4 text-center">
                  {pendientes.length === 0 ? "Sin pedidos pendientes ✓" : "Solo hay urgentes pendientes"}
                </p>
              </CardBody>
            ) : (
              <div className="divide-y divide-slate-100">
                {normales.map((p) => (
                  <PedidoRow key={p.id} pedido={p} etiqueta="Iniciar"
                    loading={cargando(p.id)}
                    onAccion={() => cambiarEstado.mutate({ id: p.id, estado: "en_proceso" })}
                    onNav={() => navigate(`/pedidos/${p.id}`)}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar: listos para entregar */}
        <div>
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-100">Listos para entregar ({listos.length})</h2>
                </div>
                {listos.length > 5 && (
                  <button
                    onClick={() => navigate("/pedidos")}
                    className="flex items-center gap-0.5 text-xs text-primary hover:text-primary-dark transition-colors cursor-pointer"
                  >
                    Ver todos <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </CardHeader>
            {listos.length === 0 ? (
              <CardBody>
                <p className="text-sm text-slate-400 py-4 text-center">Ninguno listo aún</p>
              </CardBody>
            ) : (
              <>
                <div className="divide-y divide-slate-100">
                  {listosVista.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => navigate(`/pedidos/${p.id}`)}
                      className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 font-mono">{p.codigo}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{p.cliente_nombre}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
                {listos.length > 5 && (
                  <div className="px-4 py-2.5 border-t border-slate-100">
                    <button
                      onClick={() => navigate("/pedidos")}
                      className="w-full text-xs text-center text-slate-400 hover:text-primary transition-colors cursor-pointer py-1"
                    >
                      +{listos.length - 5} más en Pedidos →
                    </button>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
