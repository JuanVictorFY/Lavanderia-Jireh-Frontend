import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Scissors, Pencil, Trash2 } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { PageSpinner } from "@/components/ui/spinner";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCurrency } from "@/lib/utils";
import api from "@/lib/api";
import type { Servicio, PaginatedResponse } from "@/types";

const schema = z.object({
  nombre_servicio: z.string().min(1, "Requerido"),
  descripcion:     z.string().optional(),
  precio_base:     z.coerce.number().min(0.01, "Debe ser mayor a 0"),
});

type FormData = z.infer<typeof schema>;

export function Servicios() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Servicio | null>(null);

  const { data, isLoading } = useQuery<PaginatedResponse<Servicio>>({
    queryKey: ["servicios"],
    queryFn: () => api.get("/servicios/").then((r) => r.data),
  });

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
  });

  const crear = useMutation({
    mutationFn: (d: FormData) => api.post("/servicios/", d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["servicios"] }); cerrar(); },
  });

  const editar = useMutation({
    mutationFn: (d: FormData) => api.put(`/servicios/${editando!.id}/`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["servicios"] }); cerrar(); },
  });

  const eliminar = useMutation({
    mutationFn: (id: number) => api.delete(`/servicios/${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["servicios"] }),
  });

  const cerrar = () => { setModalOpen(false); setEditando(null); reset(); };

  const abrirEditar = (s: Servicio) => {
    setEditando(s);
    setValue("nombre_servicio", s.nombre_servicio);
    setValue("descripcion", s.descripcion ?? "");
    setValue("precio_base", parseFloat(s.precio_base));
    setModalOpen(true);
  };

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Servicios</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{data?.count ?? 0} servicios disponibles</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)} className="self-start sm:self-auto">
          Nuevo servicio
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data?.results ?? []).map((s) => (
          <Card key={s.id}>
            <CardBody>
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                  <Scissors className="w-5 h-5 text-violet-400" />
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => abrirEditar(s)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { if (confirm("¿Eliminar este servicio?")) eliminar.mutate(s.id); }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{s.nombre_servicio}</p>
                {s.descripcion && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{s.descripcion}</p>}
                <p className="text-lg font-bold text-violet-600 dark:text-violet-400 mt-2">{formatCurrency(s.precio_base)}<span className="text-xs text-slate-500 dark:text-slate-400 font-normal"> / kg</span></p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={cerrar}
        title={editando ? "Editar servicio" : "Nuevo servicio"}
      >
        <form
          onSubmit={handleSubmit((d) => editando ? editar.mutate(d) : crear.mutate(d))}
          className="space-y-4"
        >
          <Input
            label="Nombre del servicio"
            {...register("nombre_servicio")}
            error={errors.nombre_servicio?.message}
            placeholder="Ej: Lavado a máquina"
          />
          <Textarea
            label="Descripción"
            rows={2}
            {...register("descripcion")}
            placeholder="Descripción del servicio..."
          />
          <Input
            label="Precio base (S/ por kg)"
            type="number"
            step="0.01"
            min="0"
            {...register("precio_base")}
            error={errors.precio_base?.message}
            placeholder="0.00"
          />
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={cerrar}>Cancelar</Button>
            <Button type="submit" className="flex-1" loading={isSubmitting}>
              {editando ? "Guardar cambios" : "Crear servicio"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
