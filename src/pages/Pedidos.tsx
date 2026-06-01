import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { Plus, Search, ShoppingBag, Filter, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EstadoBadge } from "@/components/ui/badge";
import { PageSpinner } from "@/components/ui/spinner";
import { ConfirmModal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { formatCurrency, formatDate } from "@/lib/utils";
import api from "@/lib/api";
import type { Pedido, PaginatedResponse, EstadoPedidoValue } from "@/types";

const PAGE_SIZE = 8;

const ESTADOS: { value: EstadoPedidoValue | "todos"; label: string }[] = [
  { value: "todos",      label: "Todos" },
  { value: "pendiente",  label: "Pendiente" },
  { value: "en_proceso", label: "En Proceso" },
  { value: "listo",      label: "Listo" },
  { value: "entregado",  label: "Entregado" },
  { value: "cancelado",  label: "Cancelado" },
];

export function Pedidos() {
  const navigate    = useNavigate();
  const qc          = useQueryClient();
  const isOperario  = useAuthStore((s) => s.isOperario)();

  const [page, setPage]                 = useState(1);
  const [search, setSearch]             = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoPedidoValue | "todos">("todos");
  const [confirmModal, setConfirmModal] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  const { data, isLoading } = useQuery<PaginatedResponse<Pedido>>({
    queryKey: ["pedidos", page],
    queryFn: () => api.get(`/pedidos/?page=${page}&page_size=${PAGE_SIZE}`).then((r) => r.data),
  });

  const eliminar = useMutation({
    mutationFn: (id: number) => api.delete(`/pedidos/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pedidos"] });
      setConfirmModal(false);
      setEliminandoId(null);
      if (pedidos.length === 1 && page > 1) setPage((p) => p - 1);
    },
  });

  const confirmarEliminar = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEliminandoId(id);
    setConfirmModal(true);
  };

  const cambiarFiltroEstado = (estado: EstadoPedidoValue | "todos") => {
    setFiltroEstado(estado);
    setPage(1);
  };

  const cambiarSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const pedidos = data?.results ?? [];
  const total   = data?.count ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const filtrados = pedidos.filter((p) => {
    const matchSearch =
      p.codigo.toLowerCase().includes(search.toLowerCase()) ||
      p.cliente_nombre.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filtroEstado === "todos" || p.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <ConfirmModal
        open={confirmModal}
        onClose={() => { setConfirmModal(false); setEliminandoId(null); }}
        onConfirm={() => eliminandoId !== null && eliminar.mutate(eliminandoId)}
        title="Eliminar pedido"
        description="¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer."
        loading={eliminar.isPending}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Pedidos</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{total} pedidos en total</p>
        </div>
        {!isOperario && (
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate("/pedidos/nuevo")} className="self-start sm:self-auto">
            Nuevo pedido
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Buscar por código o cliente..."
            value={search}
            onChange={(e) => cambiarSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="overflow-x-auto min-w-0">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1.5 w-max">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            {ESTADOS.map((e) => (
              <button
                key={e.value}
                onClick={() => cambiarFiltroEstado(e.value)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  filtroEstado === e.value
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/7"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards — mobile */}
      <Card className="sm:hidden">
        {filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-sm">
            <ShoppingBag className="w-8 h-8 mb-2 opacity-30" />
            No se encontraron pedidos
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/4">
            {filtrados.map((pedido) => (
              <div
                key={pedido.id}
                onClick={() => navigate(`/pedidos/${pedido.id}`)}
                className="flex flex-col gap-1.5 px-4 py-3.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-primary/5 active:bg-primary/10 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-mono font-semibold text-primary">{pedido.codigo}</span>
                  <div className="flex items-center gap-2">
                    <EstadoBadge estado={pedido.estado} />
                    {!isOperario && (
                      <button
                        onClick={(e) => confirmarEliminar(pedido.id, e)}
                        title="Eliminar pedido"
                        className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-100">{pedido.cliente_nombre}</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-400">Entrega: {formatDate(pedido.fecha_entrega)}</p>
                  <span className="text-sm font-semibold text-slate-700 dark:text-white">{formatCurrency(pedido.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Table — sm+ */}
      <Card className="hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/6">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">Código</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">Cliente</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">Ingreso</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">Entrega</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">Estado</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">Total</th>
                {!isOperario && <th className="px-3 py-3" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/4">
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={isOperario ? 6 : 7} className="text-center py-12 text-slate-400 text-sm">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No se encontraron pedidos
                  </td>
                </tr>
              )}
              {filtrados.map((pedido) => (
                <tr
                  key={pedido.id}
                  onClick={() => navigate(`/pedidos/${pedido.id}`)}
                  className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-mono font-semibold text-primary group-hover:text-primary-dark whitespace-nowrap">
                      {pedido.codigo}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-100">{pedido.cliente_nombre}</p>
                    <p className="text-xs text-slate-400">{pedido.empleado_nombre}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(pedido.fecha_ingreso)}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(pedido.fecha_entrega)}</td>
                  <td className="px-5 py-3.5"><EstadoBadge estado={pedido.estado} /></td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm font-semibold text-slate-700 dark:text-white whitespace-nowrap">{formatCurrency(pedido.total)}</span>
                  </td>
                  {!isOperario && (
                    <td className="px-3 py-3.5">
                      <button
                        onClick={(e) => confirmarEliminar(pedido.id, e)}
                        title="Eliminar pedido"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Pagination page={page} totalPages={totalPages} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}
