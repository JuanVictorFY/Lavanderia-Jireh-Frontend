import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Users, Phone, Mail, History, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { PageSpinner } from "@/components/ui/spinner";
import { Pagination } from "@/components/ui/pagination";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDateShort } from "@/lib/utils";
import api from "@/lib/api";
import type { Cliente, PaginatedResponse } from "@/types";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 6;

const schema = z.object({
  nombres:   z.string().min(1, "Requerido"),
  apellidos: z.string().min(1, "Requerido"),
  telefono:  z.string().optional(),
  correo:    z.string().email("Email inválido").optional().or(z.literal("")),
  direccion: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function Clientes() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [page, setPage]                 = useState(1);
  const [search, setSearch]             = useState("");
  const [modalOpen, setModalOpen]       = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const [editando, setEditando]         = useState<Cliente | null>(null);
  const [apiError, setApiError]         = useState<string | null>(null);

  const { data, isLoading } = useQuery<PaginatedResponse<Cliente>>({
    queryKey: ["clientes", page],
    queryFn: () => api.get(`/clientes/?page=${page}&page_size=${PAGE_SIZE}`).then((r) => r.data),
  });

  const total      = data?.count ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const clientes  = data?.results ?? [];
  const filtrados = clientes.filter(
    (c) =>
      `${c.nombres} ${c.apellidos}`.toLowerCase().includes(search.toLowerCase()) ||
      c.correo?.toLowerCase().includes(search.toLowerCase()) ||
      c.telefono?.includes(search)
  );

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleError = (err: unknown) => {
    const d = (err as { response?: { data?: Record<string, unknown> } }).response?.data;
    if (d && typeof d === "object") {
      setApiError(Object.values(d).flat().join(" ") || "Error al guardar.");
    } else {
      setApiError("Error al guardar. Verifica los datos.");
    }
  };

  const crear = useMutation({
    mutationFn: (d: FormData) => api.post("/clientes/", d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["clientes"] }); cerrar(); },
    onError: handleError,
  });

  const editar = useMutation({
    mutationFn: (d: FormData) => api.put(`/clientes/${editando!.id}/`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["clientes"] }); cerrar(); },
    onError: handleError,
  });

  const eliminar = useMutation({
    mutationFn: (id: number) => api.delete(`/clientes/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clientes"] });
      setConfirmModal(false);
      setEliminandoId(null);
      if (clientes.length === 1 && page > 1) setPage((p) => p - 1);
    },
  });

  const cerrar = () => { setModalOpen(false); setEditando(null); reset(); setApiError(null); };

  const abrirEditar = (c: Cliente, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditando(c);
    setValue("nombres", c.nombres);
    setValue("apellidos", c.apellidos);
    setValue("telefono", c.telefono ?? "");
    setValue("correo", c.correo ?? "");
    setValue("direccion", c.direccion ?? "");
    setModalOpen(true);
  };

  const confirmarEliminar = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEliminandoId(id);
    setConfirmModal(true);
  };

  const cambiarSearch = (value: string) => { setSearch(value); setPage(1); };

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Clientes</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{total} clientes registrados</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)} className="self-start sm:self-auto">
          Nuevo cliente
        </Button>
      </div>

      <div className="max-w-sm">
        <Input
          placeholder="Buscar cliente..."
          value={search}
          onChange={(e) => cambiarSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {filtrados.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No se encontraron clientes</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtrados.map((cliente) => (
              <Card key={cliente.id} hoverable onClick={() => navigate(`/clientes/${cliente.id}`)}>
                <div className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/15 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {cliente.nombres[0]}{cliente.apellidos[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-100 truncate">
                        {cliente.nombres} {cliente.apellidos}
                      </p>
                      <p className="text-xs text-slate-400">
                        Desde {formatDateShort(cliente.fecha_registro)}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={(e) => abrirEditar(cliente, e)}
                        title="Editar cliente"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => confirmarEliminar(cliente.id, e)}
                        title="Eliminar cliente"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {cliente.telefono && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        {cliente.telefono}
                      </div>
                    )}
                    {cliente.correo && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{cliente.correo}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/6 flex items-center gap-1.5 text-xs text-primary font-medium">
                    <History className="w-3.5 h-3.5" />
                    Ver historial de pedidos
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}

      <ConfirmModal
        open={confirmModal}
        onClose={() => { setConfirmModal(false); setEliminandoId(null); }}
        onConfirm={() => eliminandoId !== null && eliminar.mutate(eliminandoId)}
        title="Eliminar cliente"
        description="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
        loading={eliminar.isPending}
      />

      <Modal open={modalOpen} onClose={cerrar} title={editando ? "Editar cliente" : "Nuevo cliente"}>
        <form
          onSubmit={handleSubmit((d) => { setApiError(null); editando ? editar.mutate(d) : crear.mutate(d); })}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nombres" {...register("nombres")} error={errors.nombres?.message} />
            <Input label="Apellidos" {...register("apellidos")} error={errors.apellidos?.message} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Teléfono" {...register("telefono")} placeholder="999 000 000" />
            <Input label="Correo" type="email" {...register("correo")} placeholder="correo@ejemplo.com" error={errors.correo?.message} />
          </div>
          <Input label="Dirección" {...register("direccion")} placeholder="Av. Principal 123..." />
          {apiError && (
            <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2">{apiError}</p>
          )}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={cerrar}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" loading={crear.isPending || editar.isPending}>
              {editando ? "Guardar cambios" : "Guardar cliente"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
