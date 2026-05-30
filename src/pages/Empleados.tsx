import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, UserCog } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { PageSpinner } from "@/components/ui/spinner";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import type { Empleado, Rol, PaginatedResponse } from "@/types";

const schema = z.object({
  usuario:    z.string().min(3, "Mín. 3 caracteres"),
  contrasena: z.string().min(8, "Mín. 8 caracteres"),
  nombres:    z.string().min(1, "Requerido"),
  apellidos:  z.string().min(1, "Requerido"),
  telefono:   z.string().optional(),
  id_rol:     z.coerce.number().min(1, "Selecciona un rol"),
});

type FormData = z.infer<typeof schema>;

export function Empleados() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useQuery<PaginatedResponse<Empleado>>({
    queryKey: ["empleados"],
    queryFn: () => api.get("/usuarios/empleados/").then((r) => r.data),
  });

  const { data: rolesData } = useQuery<PaginatedResponse<Rol>>({
    queryKey: ["roles"],
    queryFn: () => api.get("/usuarios/roles/").then((r) => r.data),
  });

  const roles = rolesData?.results ?? [];

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
  });

  const crear = useMutation({
    mutationFn: (d: FormData) => api.post("/usuarios/empleados/", d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["empleados"] }); setModalOpen(false); reset(); },
  });

  const toggleEstado = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: boolean }) =>
      api.patch(`/usuarios/empleados/${id}/cambiar-estado/`, { estado }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["empleados"] }),
  });

  if (isLoading) return <PageSpinner />;

  const empleados = data?.results ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Empleados</h1>
          <p className="text-slate-400 text-sm mt-0.5">{data?.count ?? 0} empleados registrados</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)} className="shrink-0">
          Nuevo empleado
        </Button>
      </div>

      {/* Cards — mobile */}
      <Card className="sm:hidden">
        {empleados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-sm">
            <UserCog className="w-8 h-8 mb-2 opacity-30" />
            Sin empleados
          </div>
        ) : (
          <div className="divide-y divide-white/4">
            {empleados.map((emp) => (
              <div key={emp.id} className="flex items-center justify-between gap-3 px-4 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-violet-500/15 flex items-center justify-center text-violet-300 text-xs font-bold shrink-0">
                    {emp.nombres[0]}{emp.apellidos[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-100 truncate">{emp.nombres} {emp.apellidos}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <Badge variant="secondary" className="capitalize">{emp.rol_nombre}</Badge>
                      <Badge variant={emp.estado ? "success" : "danger"}>
                        {emp.estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleEstado.mutate({ id: emp.id, estado: !emp.estado })}
                  className={`shrink-0 ${emp.estado ? "text-red-400 hover:bg-red-500/10" : "text-emerald-400 hover:bg-emerald-500/10"}`}
                >
                  {emp.estado ? "Desactivar" : "Activar"}
                </Button>
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
              <tr className="border-b border-white/6">
                {["Empleado", "Usuario", "Rol", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 last:text-right whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {empleados.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500 text-sm">
                    <UserCog className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Sin empleados
                  </td>
                </tr>
              )}
              {empleados.map((emp) => (
                <tr key={emp.id} className="hover:bg-white/4 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-500/15 flex items-center justify-center text-violet-300 text-xs font-bold">
                        {emp.nombres[0]}{emp.apellidos[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-100">{emp.nombres} {emp.apellidos}</p>
                        {emp.telefono && <p className="text-xs text-slate-500">{emp.telefono}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-400 font-mono whitespace-nowrap">{emp.usuario}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant="secondary" className="capitalize">{emp.rol_nombre}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={emp.estado ? "success" : "danger"}>
                      {emp.estado ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleEstado.mutate({ id: emp.id, estado: !emp.estado })}
                      className={emp.estado ? "text-red-400 hover:bg-red-500/10" : "text-emerald-400 hover:bg-emerald-500/10"}
                    >
                      {emp.estado ? "Desactivar" : "Activar"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); reset(); }} title="Nuevo empleado">
        <form onSubmit={handleSubmit((d) => crear.mutate(d))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombres" {...register("nombres")} error={errors.nombres?.message} />
            <Input label="Apellidos" {...register("apellidos")} error={errors.apellidos?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Usuario" {...register("usuario")} error={errors.usuario?.message} placeholder="nombre_usuario" />
            <Input label="Contraseña" type="password" {...register("contrasena")} error={errors.contrasena?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Teléfono" {...register("telefono")} placeholder="999 000 000" />
            <Select
              label="Rol"
              {...register("id_rol")}
              options={roles.map((r) => ({ value: r.id, label: r.nombre_rol }))}
              placeholder="Selecciona un rol"
              error={errors.id_rol?.message}
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => { setModalOpen(false); reset(); }}>Cancelar</Button>
            <Button type="submit" className="flex-1" loading={isSubmitting}>Crear empleado</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
