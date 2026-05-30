import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Phone, Mail, MapPin, Users, ShoppingBag } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { EstadoBadge } from "@/components/ui/badge";
import { PageSpinner } from "@/components/ui/spinner";
import { formatCurrency, formatDate, formatDateShort } from "@/lib/utils";
import api from "@/lib/api";
import type { Cliente, Pedido } from "@/types";

export function ClienteDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<{ cliente: Cliente; pedidos: Pedido[] }>({
    queryKey: ["cliente-historial", id],
    queryFn: () => api.get(`/clientes/${id}/historial/`).then((r) => r.data),
  });

  if (isLoading || !data) return <PageSpinner />;

  const { cliente, pedidos } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/clientes")}
          className="p-2 rounded-lg hover:bg-white/7 text-slate-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-violet-500/15 flex items-center justify-center text-violet-300 font-bold text-lg">
            {cliente.nombres[0]}{cliente.apellidos[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {cliente.nombres} {cliente.apellidos}
            </h1>
            <p className="text-slate-400 text-sm">Desde {formatDateShort(cliente.fecha_registro)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-5">
          {/* Info */}
          <Card>
            <CardHeader><h2 className="text-sm font-semibold text-slate-100">Información de contacto</h2></CardHeader>
            <CardBody className="space-y-3">
              {cliente.telefono && (
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Phone className="w-4 h-4 text-slate-500" />
                  {cliente.telefono}
                </div>
              )}
              {cliente.correo && (
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Mail className="w-4 h-4 text-slate-500" />
                  {cliente.correo}
                </div>
              )}
              {cliente.direccion && (
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  {cliente.direccion}
                </div>
              )}
              {!cliente.telefono && !cliente.correo && !cliente.direccion && (
                <p className="text-sm text-slate-500">Sin datos de contacto</p>
              )}
            </CardBody>
          </Card>

          {/* Personas autorizadas */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-100">
                  Personas autorizadas ({cliente.personas_autorizadas?.length ?? 0})
                </h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-2">
              {(cliente.personas_autorizadas ?? []).length === 0 ? (
                <p className="text-sm text-slate-500">Sin personas autorizadas</p>
              ) : (
                cliente.personas_autorizadas!.map((p) => (
                  <div key={p.id} className="p-3 bg-white/4 rounded-lg">
                    <p className="text-sm font-medium text-slate-100">{p.nombres}</p>
                    <p className="text-xs text-slate-500">DNI: {p.dni} · {p.telefono ?? "—"}</p>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>

        {/* Pedidos */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-100">
                  Historial de pedidos ({pedidos.length})
                </h2>
              </div>
            </CardHeader>
            <div className="divide-y divide-white/5">
              {pedidos.length === 0 && (
                <p className="px-5 py-8 text-sm text-slate-500 text-center">Sin pedidos registrados</p>
              )}
              {pedidos.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/pedidos/${p.id}`)}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-white/4 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-mono font-semibold text-violet-400">{p.codigo}</p>
                    <p className="text-xs text-slate-500">{formatDate(p.fecha_ingreso)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <EstadoBadge estado={p.estado} />
                    <p className="text-sm font-semibold text-white w-20 text-right">
                      {formatCurrency(p.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
