import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Package, Clock, ChevronRight, Calculator, CreditCard, AlertCircle, FileText, Trash2,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EstadoBadge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { PageSpinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import api from "@/lib/api";
import type { Pedido, EstadoPedidoValue } from "@/types";

const ESTADOS_OPTIONS = [
  { value: "pendiente",  label: "Pendiente" },
  { value: "en_proceso", label: "En Proceso" },
  { value: "listo",      label: "Listo para entrega" },
  { value: "entregado",  label: "Entregado" },
  { value: "cancelado",  label: "Cancelado" },
];

const METODOS_PAGO = [
  { value: "efectivo",      label: "Efectivo" },
  { value: "yape",          label: "Yape" },
  { value: "plin",          label: "Plin" },
  { value: "tarjeta",       label: "Tarjeta" },
  { value: "transferencia", label: "Transferencia" },
];

export function PedidoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate   = useNavigate();
  const qc         = useQueryClient();
  const isOperario = useAuthStore((s) => s.isOperario)();

  const [modalEstado, setModalEstado]     = useState(false);
  const [modalPago, setModalPago]         = useState(false);
  const [confirmEliminar, setConfirmEliminar] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoPedidoValue>("pendiente");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto]             = useState("");
  const [metodoPago, setMetodoPago]   = useState("efectivo");

  const { data: pedido, isLoading } = useQuery<Pedido>({
    queryKey: ["pedido", id],
    queryFn: () => api.get(`/pedidos/${id}/`).then((r) => r.data),
  });

  const eliminar = useMutation({
    mutationFn: () => api.delete(`/pedidos/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pedidos"] });
      navigate("/pedidos");
    },
  });

  const calcularTotal = useMutation({
    mutationFn: () => api.post(`/pedidos/${id}/calcular-total/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pedido", id] }),
  });

  const cambiarEstado = useMutation({
    mutationFn: () =>
      api.patch(`/pedidos/${id}/cambiar-estado/`, { estado: nuevoEstado, descripcion }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pedido", id] });
      qc.invalidateQueries({ queryKey: ["pedidos"] });
      setModalEstado(false);
      setDescripcion("");
    },
  });

  const registrarPago = useMutation({
    mutationFn: () =>
      api.post("/pagos/", { id_pedido: parseInt(id!, 10), monto: parseFloat(monto), metodo_pago: metodoPago }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pagos"] });
      qc.invalidateQueries({ queryKey: ["pedido", id] });
      setModalPago(false);
      setMonto("");
    },
  });

  if (isLoading || !pedido) return <PageSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button
            onClick={() => navigate("/pedidos")}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/7 text-slate-400 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white font-mono">{pedido.codigo}</h1>
              <EstadoBadge estado={pedido.estado} />
            </div>
            <p className="text-slate-400 text-sm mt-0.5 truncate">{pedido.cliente_nombre} · Ingresado {formatDate(pedido.fecha_ingreso)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:shrink-0">
          {!isOperario && (
            <Button variant="outline" leftIcon={<Calculator className="w-4 h-4" />} onClick={() => calcularTotal.mutate()} loading={calcularTotal.isPending}>
              Calcular total
            </Button>
          )}
          {!isOperario && (
            <Button
              variant="outline"
              className="border-teal-500/40 text-teal-400 hover:bg-teal-500/10 hover:border-teal-400/60 hover:text-teal-300"
              leftIcon={<FileText className="w-4 h-4" />}
              onClick={() => navigate(`/pedidos/${id}/recibo`)}
            >
              Ver Recibo
            </Button>
          )}
          <Button variant="secondary" onClick={() => { setNuevoEstado(pedido.estado); setModalEstado(true); }}>
            Cambiar estado
          </Button>
          {!isOperario && (
            <Button leftIcon={<CreditCard className="w-4 h-4" />} onClick={() => { setMonto(pedido.total); setModalPago(true); }}>
              Registrar pago
            </Button>
          )}
          {!isOperario && (
            <Button
              variant="ghost"
              leftIcon={<Trash2 className="w-4 h-4" />}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={() => setConfirmEliminar(true)}
            >
              Eliminar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info + Prendas */}
        <div className="lg:col-span-2 space-y-5">
          {/* Info general */}
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-slate-100">Información del pedido</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Cliente",       value: pedido.cliente_nombre },
                  { label: "Empleado",      value: pedido.empleado_nombre },
                  { label: "Ingreso",       value: formatDate(pedido.fecha_ingreso) },
                  { label: "Entrega",       value: formatDate(pedido.fecha_entrega) },
                  { label: "Total",         value: <span className="text-lg font-bold text-white">{formatCurrency(pedido.total)}</span> },
                  { label: "Observaciones", value: pedido.observaciones || "—" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
                    <p className="text-sm text-slate-200">{value}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Prendas */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-100">
                  Prendas ({pedido.prendas.length})
                </h2>
              </div>
            </CardHeader>
            <div className="divide-y divide-white/5">
              {pedido.prendas.map((prenda, i) => (
                <div key={prenda.id ?? i} className="px-5 py-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-100">{prenda.tipo_prenda}</p>
                    <p className="text-xs text-slate-500">
                      Color: {prenda.color || "—"} · Peso: {prenda.peso} kg · Cantidad: {prenda.cantidad}
                    </p>
                    {prenda.observaciones && (
                      <p className="text-xs text-slate-500 mt-0.5">{prenda.observaciones}</p>
                    )}
                  </div>
                </div>
              ))}
              {pedido.prendas.length === 0 && (
                <p className="px-5 py-4 text-sm text-slate-500">Sin prendas registradas</p>
              )}
            </div>
          </Card>
        </div>

        {/* Timeline */}
        <div>
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-100">Historial de estados</h2>
              </div>
            </CardHeader>
            <CardBody className="py-4">
              {pedido.estados.length === 0 && (
                <p className="text-sm text-slate-500">Sin historial</p>
              )}
              <div className="space-y-4">
                {[...pedido.estados].reverse().map((estado, i) => (
                  <div key={estado.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${i === 0 ? "bg-violet-500" : "bg-slate-600"}`} />
                      {i < pedido.estados.length - 1 && (
                        <div className="w-px flex-1 bg-white/10 mt-1.5 mb-0" />
                      )}
                    </div>
                    <div className="pb-3">
                      <p className="text-xs font-semibold text-slate-200 capitalize">
                        {estado.estado.replace("_", " ")}
                      </p>
                      <p className="text-xs text-slate-500">{formatDate(estado.fecha_estado)}</p>
                      {estado.descripcion && (
                        <p className="text-xs text-slate-400 mt-0.5">{estado.descripcion}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modal confirmar eliminación */}
      <ConfirmModal
        open={confirmEliminar}
        onClose={() => setConfirmEliminar(false)}
        onConfirm={() => eliminar.mutate()}
        title="Eliminar pedido"
        description={`¿Eliminar el pedido ${pedido.codigo}? Esta acción no se puede deshacer.`}
        loading={eliminar.isPending}
      />

      {/* Modal cambiar estado */}
      <Modal open={modalEstado} onClose={() => setModalEstado(false)} title="Cambiar estado del pedido">
        <div className="space-y-4">
          <Select
            label="Nuevo estado"
            value={nuevoEstado}
            onChange={(e) => setNuevoEstado(e.target.value as EstadoPedidoValue)}
            options={ESTADOS_OPTIONS}
          />
          <Textarea
            label="Descripción (opcional)"
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Añade una nota sobre este cambio..."
          />
          {cambiarEstado.isError && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Error al cambiar el estado</span>
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <Button variant="secondary" className="flex-1" onClick={() => setModalEstado(false)}>Cancelar</Button>
            <Button className="flex-1" onClick={() => cambiarEstado.mutate()} loading={cambiarEstado.isPending}>
              <ChevronRight className="w-4 h-4" /> Confirmar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal registrar pago */}
      <Modal open={modalPago} onClose={() => { setModalPago(false); registrarPago.reset(); }} title="Registrar pago">
        <div className="space-y-4">
          <Input
            label="Monto (S/)"
            type="number"
            min="0"
            step="0.01"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="0.00"
          />
          <Select
            label="Método de pago"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            options={METODOS_PAGO}
          />
          {registrarPago.isError && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {(registrarPago.error as any)?.response?.data?.error
                  ?? (registrarPago.error as any)?.response?.data?.detail
                  ?? (registrarPago.error as any)?.response?.data?.non_field_errors?.[0]
                  ?? "Error al registrar el pago"}
              </span>
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <Button variant="secondary" className="flex-1" onClick={() => { setModalPago(false); registrarPago.reset(); }}>Cancelar</Button>
            <Button
              className="flex-1"
              onClick={() => registrarPago.mutate()}
              loading={registrarPago.isPending}
              disabled={!monto || parseFloat(monto) <= 0}
            >
              Confirmar pago
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}