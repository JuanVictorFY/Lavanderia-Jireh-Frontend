import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, Clock, CheckCircle2, PlayCircle, WashingMachine, ArrowRight } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EstadoBadge } from "@/components/ui/badge";
import { PageSpinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/auth";
import { formatDate } from "@/lib/utils";
import api from "@/lib/api";
import type { Pedido, PaginatedResponse } from "@/types";
import { useNavigate } from "react-router-dom";

function StatCard({
  icon, label, value, color, sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  sub?: string;
}) {
  return (
    <Card className="flex-1">
      <CardBody className="flex items-start gap-4 py-5">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-slate-400 font-medium">{label}</p>
          {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
        </div>
      </CardBody>
    </Card>
  );
}

function PrendaCount({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
      <Package className="w-3 h-3" />
      {count} {count === 1 ? "prenda" : "prendas"}
    </span>
  );
}

export function DashboardOperario() {
  const empleado = useAuthStore((s) => s.empleado);
  const navigate  = useNavigate();
  const qc        = useQueryClient();

  const hora   = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";

  const { data, isLoading } = useQuery<PaginatedResponse<Pedido>>({
    queryKey: ["pedidos"],
    queryFn: () => api.get("/pedidos/").then((r) => r.data),
  });

  const cambiarEstado = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) =>
      api.patch(`/pedidos/${id}/cambiar-estado/`, { estado, descripcion: "" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pedidos"] }),
  });

  const pedidos    = data?.results ?? [];
  const pendientes = pedidos.filter((p) => p.estado === "pendiente");
  const enProceso  = pedidos.filter((p) => p.estado === "en_proceso");
  const listos     = pedidos.filter((p) => p.estado === "listo");

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {saludo}, {empleado?.nombres}
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Aquí están los pedidos que necesitan atención</p>
        </div>
        <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-2 self-start sm:self-auto">
          <WashingMachine className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-violet-300">
            {new Date().toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" })}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Clock className="w-5 h-5 text-amber-400" />}
          color="bg-amber-500/10"
          label="Pendientes"
          value={pendientes.length}
          sub="Sin iniciar"
        />
        <StatCard
          icon={<PlayCircle className="w-5 h-5 text-blue-400" />}
          color="bg-blue-500/10"
          label="En proceso"
          value={enProceso.length}
          sub="En lavado"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          color="bg-emerald-500/10"
          label="Listos"
          value={listos.length}
          sub="Para entregar"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Cola de trabajo: pendientes + en proceso */}
        <div className="space-y-4">
          {/* En proceso */}
          {enProceso.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <h2 className="text-sm font-semibold text-slate-100">En proceso ({enProceso.length})</h2>
                </div>
              </CardHeader>
              <div className="divide-y divide-white/5">
                {enProceso.map((p) => (
                  <div key={p.id} className="px-4 py-3.5 flex items-center justify-between gap-3">
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => navigate(`/pedidos/${p.id}`)}
                    >
                      <p className="text-sm font-semibold text-white font-mono">{p.codigo}</p>
                      <p className="text-xs text-slate-400 truncate">{p.cliente_nombre}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <PrendaCount count={p.prendas.length} />
                        {p.fecha_entrega && (
                          <span className="text-xs text-slate-500">
                            Entrega: {formatDate(p.fecha_entrega)}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      loading={cambiarEstado.isPending}
                      onClick={() => cambiarEstado.mutate({ id: p.id, estado: "listo" })}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Marcar listo
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Pendientes */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <h2 className="text-sm font-semibold text-slate-100">
                  Pendientes ({pendientes.length})
                </h2>
              </div>
            </CardHeader>
            {pendientes.length === 0 ? (
              <CardBody>
                <p className="text-sm text-slate-500 py-4 text-center">Sin pedidos pendientes</p>
              </CardBody>
            ) : (
              <div className="divide-y divide-white/5">
                {pendientes.map((p) => (
                  <div key={p.id} className="px-4 py-3.5 flex items-center justify-between gap-3">
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => navigate(`/pedidos/${p.id}`)}
                    >
                      <p className="text-sm font-semibold text-white font-mono">{p.codigo}</p>
                      <p className="text-xs text-slate-400 truncate">{p.cliente_nombre}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <PrendaCount count={p.prendas.length} />
                        {p.fecha_entrega && (
                          <span className="text-xs text-slate-500">
                            Entrega: {formatDate(p.fecha_entrega)}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      loading={cambiarEstado.isPending}
                      onClick={() => cambiarEstado.mutate({ id: p.id, estado: "en_proceso" })}
                    >
                      <PlayCircle className="w-3.5 h-3.5 mr-1" />
                      Iniciar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Listos para entrega */}
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <h2 className="text-sm font-semibold text-slate-100">
                Listos para entregar ({listos.length})
              </h2>
            </div>
          </CardHeader>
          {listos.length === 0 ? (
            <CardBody>
              <p className="text-sm text-slate-500 py-4 text-center">Ninguno listo aún</p>
            </CardBody>
          ) : (
            <div className="divide-y divide-white/5">
              {listos.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/pedidos/${p.id}`)}
                  className="px-4 py-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/4 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white font-mono">{p.codigo}</p>
                      <EstadoBadge estado={p.estado} />
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{p.cliente_nombre}</p>
                    <PrendaCount count={p.prendas.length} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
