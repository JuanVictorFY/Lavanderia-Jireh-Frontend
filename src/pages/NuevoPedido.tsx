import { useFieldArray, useForm, useWatch, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus, Trash2, ArrowLeft, Package } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import type { Cliente, Empleado, Servicio } from "@/types";

const prendaSchema = z.object({
  tipo_prenda:   z.string().min(1, "Requerido"),
  color:         z.string().optional(),
  peso:          z.coerce.number().min(0.01, "Debe ser > 0"),
  cantidad:      z.coerce.number().int().min(1, "Mín. 1"),
  observaciones: z.string().optional(),
  id_servicio:   z.coerce.number().optional(),
});

const schema = z.object({
  id_cliente:    z.coerce.number().min(1, "Selecciona un cliente"),
  id_empleado:   z.coerce.number().min(1, "Selecciona un empleado"),
  fecha_entrega: z.string().optional(),
  observaciones: z.string().optional(),
  prendas:       z.array(prendaSchema).min(1, "Agrega al menos una prenda"),
});

type FormData = z.infer<typeof schema>;

const SELECT_CLASS =
  "w-full rounded-lg border border-white/10 bg-[#1A1C2E] px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent";

export function NuevoPedido() {
  const navigate = useNavigate();

  const { data: clientes } = useQuery<{ results: Cliente[] }>({
    queryKey: ["clientes"],
    queryFn: () => api.get("/clientes/").then((r) => r.data),
  });

  const { data: empleados } = useQuery<{ results: Empleado[] }>({
    queryKey: ["empleados"],
    queryFn: () => api.get("/usuarios/empleados/").then((r) => r.data),
  });

  const { data: servicios } = useQuery<{ results: Servicio[] }>({
    queryKey: ["servicios"],
    queryFn: () => api.get("/servicios/").then((r) => r.data),
  });

  const {
    register, control, handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      prendas: [{ tipo_prenda: "", color: "", peso: 0, cantidad: 1, observaciones: "", id_servicio: undefined }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "prendas" });

  const watchedPrendas = useWatch({ control, name: "prendas" });

  const calcularPrecioPrenda = (p: { id_servicio?: number; peso: number; cantidad: number }) => {
    if (!p.id_servicio || !servicios?.results) return null;
    const servicio = servicios.results.find((s) => s.id === Number(p.id_servicio));
    if (!servicio) return null;
    return parseFloat(servicio.precio_base) * (p.peso || 0) * (p.cantidad || 1);
  };

  const totalEstimado =
    watchedPrendas?.reduce((sum, p) => sum + (calcularPrecioPrenda(p as never) ?? 0), 0) ?? 0;

  const crear = useMutation({
    mutationFn: async (data: FormData) => {
      // 1. Crear el pedido sin id_servicio en prendas
      const pedidoRes = await api.post("/pedidos/", {
        id_cliente:    data.id_cliente,
        id_empleado:   data.id_empleado,
        fecha_entrega: data.fecha_entrega,
        observaciones: data.observaciones,
        prendas: data.prendas.map(({ id_servicio: _s, ...p }) => p),
      });

      const pedido = pedidoRes.data;

      // 2. Asignar servicio a cada prenda que lo tenga
      const calcRequests = (pedido.prendas as Array<{ id: number }>)
        .map((prenda, i) => {
          const id_servicio = data.prendas[i]?.id_servicio;
          if (id_servicio) {
            return api.post("/servicios/detalles/calcular/", {
              id_prenda:   prenda.id,
              id_servicio: Number(id_servicio),
            });
          }
          return null;
        })
        .filter(Boolean);

      if (calcRequests.length > 0) {
        await Promise.all(calcRequests);
        await api.post(`/pedidos/${pedido.id}/calcular-total/`, {});
      }

      return pedidoRes;
    },
    onSuccess: (res) => navigate(`/pedidos/${res.data.id}`),
  });

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/pedidos")}
          className="p-2 rounded-lg hover:bg-white/7 text-slate-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Nuevo pedido</h1>
          <p className="text-slate-400 text-sm">Registra un nuevo pedido de lavandería</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => crear.mutate(d))} className="space-y-5">
        {/* Datos generales */}
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-slate-100">Datos generales</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300">Cliente</label>
                <select {...register("id_cliente")} className={SELECT_CLASS}>
                  <option value="">Selecciona un cliente</option>
                  {clientes?.results.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombres} {c.apellidos}
                    </option>
                  ))}
                </select>
                {errors.id_cliente && <p className="text-xs text-red-400">{errors.id_cliente.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300">Empleado asignado</label>
                <select {...register("id_empleado")} className={SELECT_CLASS}>
                  <option value="">Selecciona un empleado</option>
                  {empleados?.results.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nombres} {e.apellidos}
                    </option>
                  ))}
                </select>
                {errors.id_empleado && <p className="text-xs text-red-400">{errors.id_empleado.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Fecha de entrega estimada"
                type="datetime-local"
                {...register("fecha_entrega")}
              />
              <Textarea
                label="Observaciones"
                rows={1}
                placeholder="Notas adicionales..."
                {...register("observaciones")}
              />
            </div>
          </CardBody>
        </Card>

        {/* Prendas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-100">Prendas</h2>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() =>
                  append({ tipo_prenda: "", color: "", peso: 0, cantidad: 1, observaciones: "", id_servicio: undefined })
                }
              >
                Agregar prenda
              </Button>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {errors.prendas?.root && (
              <p className="text-xs text-red-400">{errors.prendas.root.message}</p>
            )}

            {fields.map((field, i) => {
              const pActual = watchedPrendas?.[i];
              const precio = pActual ? calcularPrecioPrenda(pActual as never) : null;

              return (
                <div
                  key={field.id}
                  className="border border-white/8 rounded-xl p-4 space-y-3 bg-white/3"
                >
                  {/* Cabecera prenda */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Prenda {i + 1}
                    </p>
                    <div className="flex items-center gap-3">
                      {precio !== null && (
                        <span className="text-sm font-bold text-violet-400">
                          S/ {precio.toFixed(2)}
                        </span>
                      )}
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(i)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tipo y Color */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Tipo de prenda"
                      placeholder="Ej: Camisa, Pantalón..."
                      {...register(`prendas.${i}.tipo_prenda`)}
                      error={errors.prendas?.[i]?.tipo_prenda?.message}
                    />
                    <Input
                      label="Color"
                      placeholder="Ej: Azul, Blanco..."
                      {...register(`prendas.${i}.color`)}
                    />
                  </div>

                  {/* Peso, Cantidad, Observaciones */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <Input
                      label="Peso (kg)"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...register(`prendas.${i}.peso`)}
                      error={errors.prendas?.[i]?.peso?.message}
                    />
                    <Input
                      label="Cantidad"
                      type="number"
                      min="1"
                      placeholder="1"
                      {...register(`prendas.${i}.cantidad`)}
                      error={errors.prendas?.[i]?.cantidad?.message}
                    />
                    <Input
                      label="Observaciones"
                      placeholder="Opcional..."
                      {...register(`prendas.${i}.observaciones`)}
                    />
                  </div>

                  {/* Servicio */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">Servicio</label>
                    <select {...register(`prendas.${i}.id_servicio`)} className={SELECT_CLASS}>
                      <option value="">Sin servicio asignado</option>
                      {servicios?.results.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nombre_servicio} — S/ {parseFloat(s.precio_base).toFixed(2)}/kg
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}

            {/* Total estimado */}
            {totalEstimado > 0 && (
              <div className="flex justify-end pt-2 border-t border-white/8">
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-0.5">Total estimado</p>
                  <p className="text-xl font-bold text-white">S/ {totalEstimado.toFixed(2)}</p>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          <Button variant="secondary" type="button" onClick={() => navigate("/pedidos")}>
            Cancelar
          </Button>
          <Button type="submit" loading={crear.isPending} className="px-8">
            Crear pedido
          </Button>
        </div>
      </form>
    </div>
  );
}
