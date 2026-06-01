import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Phone, Mail, MapPin, Users, ShoppingBag, Plus, Trash2, X } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { EstadoBadge } from "@/components/ui/badge";
import { PageSpinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, formatDateShort } from "@/lib/utils";
import api from "@/lib/api";
import type { Cliente, Pedido, PersonaAutorizada } from "@/types";

// ── Modal agregar persona autorizada ──────────────────────────────────────────
const paSchema = z.object({
  nombres:  z.string().min(2, "Mínimo 2 caracteres"),
  dni:      z.string().length(8, "DNI debe tener 8 dígitos").regex(/^\d+$/, "Solo números"),
  telefono: z.string().min(9, "Mínimo 9 dígitos").regex(/^\d+$/, "Solo números").optional().or(z.literal("")),
});
type PaForm = z.infer<typeof paSchema>;

function ModalAgregarPA({
  clienteId,
  onClose,
}: {
  clienteId: number;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PaForm>({
    resolver: zodResolver(paSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: PaForm) =>
      api.post(`/clientes/${clienteId}/personas-autorizadas/`, {
        nombres:  data.nombres,
        dni:      data.dni,
        telefono: data.telefono || null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cliente-historial", String(clienteId)] });
      onClose();
    },
  });

  const inputCls =
    "w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#0F1120] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <h3 className="text-sm font-semibold text-white">Agregar persona autorizada</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/8 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit((d) => mutation.mutate(d))}
          className="px-5 py-4 space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Nombres completos</label>
            <input {...register("nombres")} placeholder="Ej: María García" className={inputCls} />
            {errors.nombres && <p className="mt-1 text-xs text-red-400">{errors.nombres.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">DNI</label>
            <input {...register("dni")} placeholder="12345678" maxLength={8} className={inputCls} />
            {errors.dni && <p className="mt-1 text-xs text-red-400">{errors.dni.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Teléfono <span className="text-slate-600">(opcional)</span>
            </label>
            <input {...register("telefono")} placeholder="987654321" className={inputCls} />
            {errors.telefono && <p className="mt-1 text-xs text-red-400">{errors.telefono.message}</p>}
          </div>

          {mutation.isError && (
            <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
              Error al guardar. Verifica los datos e intenta nuevamente.
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" loading={isSubmitting || mutation.isPending}>
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Fila de persona autorizada ─────────────────────────────────────────────────
function PARow({
  pa,
  clienteId,
}: {
  pa: PersonaAutorizada;
  clienteId: number;
}) {
  const qc = useQueryClient();
  const del = useMutation({
    mutationFn: () => api.delete(`/clientes/${clienteId}/personas-autorizadas/${pa.id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cliente-historial", String(clienteId)] }),
  });

  return (
    <div className="p-3 bg-white/4 rounded-lg flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-slate-100">{pa.nombres}</p>
        <p className="text-xs text-slate-500">DNI: {pa.dni}{pa.telefono ? ` · ${pa.telefono}` : ""}</p>
      </div>
      <button
        onClick={() => del.mutate()}
        disabled={del.isPending}
        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-40 shrink-0"
        title="Eliminar"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── Página principal ───────────────────────────────────────────────────────────
export function ClienteDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading } = useQuery<{ cliente: Cliente; pedidos: Pedido[] }>({
    queryKey: ["cliente-historial", id],
    queryFn: () => api.get(`/clientes/${id}/historial/`).then((r) => r.data),
  });

  if (isLoading || !data) return <PageSpinner />;

  const { cliente, pedidos } = data;

  return (
    <div className="space-y-6">
      {showModal && id && (
        <ModalAgregarPA clienteId={Number(id)} onClose={() => setShowModal(false)} />
      )}

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
          {/* Contacto */}
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <h2 className="text-sm font-semibold text-slate-100">
                    Personas autorizadas ({cliente.personas_autorizadas?.length ?? 0})
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
                  title="Agregar persona autorizada"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Agregar
                </button>
              </div>
            </CardHeader>
            <CardBody className="space-y-2">
              {(cliente.personas_autorizadas ?? []).length === 0 ? (
                <p className="text-sm text-slate-500">Sin personas autorizadas</p>
              ) : (
                cliente.personas_autorizadas!.map((p) => (
                  <PARow key={p.id} pa={p} clienteId={Number(id)} />
                ))
              )}
            </CardBody>
          </Card>
        </div>

        {/* Historial de pedidos */}
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
