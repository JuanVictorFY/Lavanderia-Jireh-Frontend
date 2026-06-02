import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Ban, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageSpinner } from "@/components/ui/spinner";
import { Pagination } from "@/components/ui/pagination";
import { formatCurrency, formatDate } from "@/lib/utils";
import api from "@/lib/api";
import type { Pago, PaginatedResponse } from "@/types";

const PAGE_SIZE = 10;

const METODO_LABELS: Record<string, string> = {
  efectivo:      "Efectivo",
  tarjeta:       "Tarjeta",
  transferencia: "Transferencia",
  yape:          "Yape",
  plin:          "Plin",
};

export function Pagos() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery<PaginatedResponse<Pago>>({
    queryKey: ["pagos", page],
    queryFn: () => api.get(`/pagos/?page=${page}&page_size=${PAGE_SIZE}`).then((r) => r.data),
  });

  const anular = useMutation({
    mutationFn: (id: number) => api.patch(`/pagos/${id}/anular/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pagos"] }),
  });

  if (isLoading) return <PageSpinner />;
  if (isError) return (
    <div className="flex items-center gap-2 text-red-400 bg-red-500/10 rounded-lg px-4 py-3 text-sm">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>Error al cargar los pagos. Verifica tu conexión e intenta de nuevo.</span>
    </div>
  );

  const pagos      = data?.results ?? [];
  const total      = data?.count ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Pagos</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{total} pagos registrados</p>
      </div>

      {/* Cards — mobile */}
      <div className="sm:hidden space-y-4">
      <Card>
        {pagos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-sm">
            <CreditCard className="w-8 h-8 mb-2 opacity-30" />
            No hay pagos registrados
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/4">
            {pagos.map((pago) => (
              <div key={pago.id} className="px-4 py-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-100">Pedido #{pago.id_pedido}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(pago.fecha_pago)}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-white whitespace-nowrap">{formatCurrency(pago.monto)}</span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="secondary">{METODO_LABELS[pago.metodo_pago] ?? pago.metodo_pago}</Badge>
                    <Badge
                      variant={
                        pago.estado_pago === "pagado" ? "success"
                        : pago.estado_pago === "anulado" ? "danger"
                        : "warning"
                      }
                    >
                      {pago.estado_pago}
                    </Badge>
                  </div>
                  {pago.estado_pago !== "anulado" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Ban className="w-3.5 h-3.5" />}
                      onClick={() => { if (confirm("¿Anular este pago?")) anular.mutate(pago.id); }}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 shrink-0"
                    >
                      Anular
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>

      {/* Table — sm+ */}
      <Card className="hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/6">
                {["#", "Pedido", "Monto", "Método", "Fecha", "Estado", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 last:text-right whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/4">
              {pagos.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No hay pagos registrados
                  </td>
                </tr>
              )}
              {pagos.map((pago) => (
                <tr key={pago.id} className="hover:bg-slate-50 dark:hover:bg-white/4 transition-colors">
                  <td className="px-5 py-3.5 text-sm text-slate-400 font-mono whitespace-nowrap">#{pago.id}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-100 whitespace-nowrap">Pedido #{pago.id_pedido}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-bold text-slate-700 dark:text-white whitespace-nowrap">{formatCurrency(pago.monto)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant="secondary">{METODO_LABELS[pago.metodo_pago] ?? pago.metodo_pago}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(pago.fecha_pago)}</td>
                  <td className="px-5 py-3.5">
                    <Badge
                      variant={
                        pago.estado_pago === "pagado" ? "success"
                        : pago.estado_pago === "anulado" ? "danger"
                        : "warning"
                      }
                    >
                      {pago.estado_pago}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {pago.estado_pago !== "anulado" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Ban className="w-3.5 h-3.5" />}
                        onClick={() => {
                          if (confirm("¿Anular este pago?")) anular.mutate(pago.id);
                        }}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        Anular
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
      </Card>
    </div>
  );
}
