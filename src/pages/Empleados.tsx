import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, UserCog, Pencil, Trash2, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { PageSpinner } from "@/components/ui/spinner";
import { Pagination } from "@/components/ui/pagination";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { Empleado, Rol, PaginatedResponse } from "@/types";

const PAGE_SIZE = 8;

const contrasenaSchema = z.object({
  nueva_contrasena: z.string().min(8, "Mín. 8 caracteres"),
  confirmar:        z.string().min(8, "Mín. 8 caracteres"),
}).refine((d) => d.nueva_contrasena === d.confirmar, {
  message: "Las contraseñas no coinciden",
  path: ["confirmar"],
});

type ContrasenaData = z.infer<typeof contrasenaSchema>;

const crearSchema = z.object({
  usuario:    z.string().min(3, "Mín. 3 caracteres"),
  contrasena: z.string().min(8, "Mín. 8 caracteres"),
  nombres:    z.string().min(1, "Requerido"),
  apellidos:  z.string().min(1, "Requerido"),
  telefono:   z.string().optional(),
  id_rol:     z.coerce.number().min(1, "Selecciona un rol"),
});

const editarSchema = z.object({
  nombres:   z.string().min(1, "Requerido"),
  apellidos: z.string().min(1, "Requerido"),
  telefono:  z.string().optional(),
  id_rol:    z.coerce.number().min(1, "Selecciona un rol"),
});

type CrearData  = z.infer<typeof crearSchema>;
type EditarData = z.infer<typeof editarSchema>;

export function Empleados() {
  const qc           = useQueryClient();
  const sesion        = useAuthStore((s) => s.empleado);
  const esAdminTotal  = useAuthStore((s) => s.isAdminTotal)();

  const [page, setPage]                         = useState(1);
  const [crearModal, setCrearModal]             = useState(false);
  const [editModal, setEditModal]               = useState(false);
  const [confirmModal, setConfirmModal]         = useState(false);
  const [contrasenaModal, setContrasenaModal]   = useState(false);
  const [empContrasena, setEmpContrasena]       = useState<Empleado | null>(null);
  const [eliminandoId, setEliminandoId]         = useState<number | null>(null);
  const [editando, setEditando]                 = useState<Empleado | null>(null);
  const [crearError, setCrearError]             = useState<string | null>(null);
  const [editError, setEditError]               = useState<string | null>(null);
  const [contrasenaError, setContrasenaError]   = useState<string | null>(null);

  const { data, isLoading } = useQuery<PaginatedResponse<Empleado>>({
    queryKey: ["empleados", page],
    queryFn: () => api.get(`/usuarios/empleados/?page=${page}&page_size=${PAGE_SIZE}`).then((r) => r.data),
  });

  const { data: rolesData } = useQuery<PaginatedResponse<Rol>>({
    queryKey: ["roles"],
    queryFn: () => api.get("/usuarios/roles/").then((r) => r.data),
  });

  const roles = rolesData?.results ?? [];

  const crearForm = useForm<CrearData>({
    resolver: zodResolver(crearSchema) as Resolver<CrearData>,
  });

  const editarForm = useForm<EditarData>({
    resolver: zodResolver(editarSchema) as Resolver<EditarData>,
  });

  const contrasenaForm = useForm<ContrasenaData>({
    resolver: zodResolver(contrasenaSchema) as Resolver<ContrasenaData>,
  });

  const parseError = (err: unknown): string => {
    const d = (err as { response?: { data?: Record<string, unknown> } }).response?.data;
    if (d && typeof d === "object") return Object.values(d).flat().join(" ") || "Error al guardar.";
    return "Error al guardar. Verifica los datos.";
  };

  const crear = useMutation({
    mutationFn: (d: CrearData) => api.post("/usuarios/empleados/", d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["empleados"] });
      setCrearModal(false);
      crearForm.reset();
      setCrearError(null);
    },
    onError: (err) => setCrearError(parseError(err)),
  });

  const editar = useMutation({
    mutationFn: (d: EditarData) => api.patch(`/usuarios/empleados/${editando!.id}/`, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["empleados"] });
      setEditModal(false);
      editarForm.reset();
      setEditError(null);
      setEditando(null);
    },
    onError: (err) => setEditError(parseError(err)),
  });

  const eliminar = useMutation({
    mutationFn: (id: number) => api.delete(`/usuarios/empleados/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["empleados"] });
      setConfirmModal(false);
      setEliminandoId(null);
      if (empleados.length === 1 && page > 1) setPage((p) => p - 1);
    },
  });

  const pedirConfirmacion = (id: number) => { setEliminandoId(id); setConfirmModal(true); };

  const toggleEstado = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: boolean }) =>
      api.patch(`/usuarios/empleados/${id}/cambiar-estado/`, { estado }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["empleados"] }),
  });

  const cambiarContrasena = useMutation({
    mutationFn: ({ id, nueva_contrasena }: { id: number; nueva_contrasena: string }) =>
      api.patch(`/usuarios/empleados/${id}/cambiar-contrasena/`, { nueva_contrasena }),
    onSuccess: () => {
      setContrasenaModal(false);
      contrasenaForm.reset();
      setContrasenaError(null);
      setEmpContrasena(null);
    },
    onError: (err) => setContrasenaError(parseError(err)),
  });

  const abrirEditar = (emp: Empleado) => {
    setEditando(emp);
    const rol = roles.find((r) => r.nombre_rol === emp.rol_nombre);
    editarForm.setValue("nombres", emp.nombres);
    editarForm.setValue("apellidos", emp.apellidos);
    editarForm.setValue("telefono", emp.telefono ?? "");
    editarForm.setValue("id_rol", rol?.id ?? 0);
    setEditError(null);
    setEditModal(true);
  };

  const cerrarCrear = () => { setCrearModal(false); crearForm.reset(); setCrearError(null); };
  const cerrarEditar = () => { setEditModal(false); editarForm.reset(); setEditError(null); setEditando(null); };
  const cerrarContrasena = () => { setContrasenaModal(false); contrasenaForm.reset(); setContrasenaError(null); setEmpContrasena(null); };

  const abrirContrasena = (emp: Empleado) => {
    setEmpContrasena(emp);
    contrasenaForm.reset();
    setContrasenaError(null);
    setContrasenaModal(true);
  };

  // Un admin creado no puede tocar a otro admin (solo el admin total puede)
  const puedeModificar = (emp: Empleado) => {
    if (esAdminTotal) return true;
    if (emp.rol_nombre === "administrador" && emp.id !== sesion?.id) return false;
    return true;
  };

  if (isLoading) return <PageSpinner />;

  const empleados  = data?.results ?? [];
  const total      = data?.count ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Empleados</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{total} empleados registrados</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCrearModal(true)} className="shrink-0">
          Nuevo empleado
        </Button>
      </div>

      {/* Cards — mobile */}
      <Card className="sm:hidden">
        {empleados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-sm">
            <UserCog className="w-8 h-8 mb-2 opacity-30" />
            Sin empleados
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/4">
            {empleados.map((emp) => (
              <div key={emp.id} className="flex items-center justify-between gap-3 px-4 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary/10 dark:bg-primary/15 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                    {emp.nombres[0]}{emp.apellidos[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-100 truncate">{emp.nombres} {emp.apellidos}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <Badge variant="secondary" className="capitalize">{emp.rol_nombre}</Badge>
                      <Badge variant={emp.estado ? "success" : "danger"}>
                        {emp.estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {puedeModificar(emp) && (
                    <>
                      <button
                        onClick={() => abrirEditar(emp)}
                        title="Editar empleado"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => abrirContrasena(emp)}
                        title="Cambiar contraseña"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => pedirConfirmacion(emp.id)}
                        title="Eliminar empleado"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleEstado.mutate({ id: emp.id, estado: !emp.estado })}
                        className={`${emp.estado ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"}`}
                      >
                        {emp.estado ? "Desactivar" : "Activar"}
                      </Button>
                    </>
                  )}
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
                {["Empleado", "Usuario", "Rol", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 last:text-right whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/4">
              {empleados.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 text-sm">
                    <UserCog className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Sin empleados
                  </td>
                </tr>
              )}
              {empleados.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-white/4 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/15 flex items-center justify-center text-primary text-xs font-bold">
                        {emp.nombres[0]}{emp.apellidos[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-100">{emp.nombres} {emp.apellidos}</p>
                        {emp.telefono && <p className="text-xs text-slate-500">{emp.telefono}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">{emp.usuario}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant="secondary" className="capitalize">{emp.rol_nombre}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={emp.estado ? "success" : "danger"}>
                      {emp.estado ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {puedeModificar(emp) ? (
                        <>
                          <button
                            onClick={() => abrirEditar(emp)}
                            title="Editar empleado"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => abrirContrasena(emp)}
                            title="Cambiar contraseña"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => pedirConfirmacion(emp.id)}
                            title="Eliminar empleado"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEstado.mutate({ id: emp.id, estado: !emp.estado })}
                            className={emp.estado ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"}
                          >
                            {emp.estado ? "Desactivar" : "Activar"}
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 italic pr-2">Solo lectura</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
      </Card>

      <Pagination page={page} totalPages={totalPages} total={total} pageSize={PAGE_SIZE} onChange={setPage} />

      {/* Modal: Crear empleado */}
      <Modal open={crearModal} onClose={cerrarCrear} title="Nuevo empleado">
        <form onSubmit={crearForm.handleSubmit((d) => { setCrearError(null); crear.mutate(d); })} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nombres" {...crearForm.register("nombres")} error={crearForm.formState.errors.nombres?.message} />
            <Input label="Apellidos" {...crearForm.register("apellidos")} error={crearForm.formState.errors.apellidos?.message} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Usuario" {...crearForm.register("usuario")} error={crearForm.formState.errors.usuario?.message} placeholder="nombre_usuario" />
            <Input label="Contraseña" type="password" {...crearForm.register("contrasena")} error={crearForm.formState.errors.contrasena?.message} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Teléfono" {...crearForm.register("telefono")} placeholder="999 000 000" />
            <Select
              label="Rol"
              {...crearForm.register("id_rol")}
              options={roles.map((r) => ({ value: r.id, label: r.nombre_rol }))}
              placeholder="Selecciona un rol"
              error={crearForm.formState.errors.id_rol?.message}
            />
          </div>
          {crearError && (
            <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2">{crearError}</p>
          )}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={cerrarCrear}>Cancelar</Button>
            <Button type="submit" className="flex-1" loading={crear.isPending}>Crear empleado</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Confirmar eliminación */}
      <ConfirmModal
        open={confirmModal}
        onClose={() => { setConfirmModal(false); setEliminandoId(null); }}
        onConfirm={() => eliminandoId !== null && eliminar.mutate(eliminandoId)}
        title="Eliminar empleado"
        description="¿Estás seguro de que deseas eliminar este empleado? Esta acción no se puede deshacer."
        loading={eliminar.isPending}
      />

      {/* Modal: Editar empleado */}
      <Modal open={editModal} onClose={cerrarEditar} title="Editar empleado">
        <form onSubmit={editarForm.handleSubmit((d) => { setEditError(null); editar.mutate(d); })} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nombres" {...editarForm.register("nombres")} error={editarForm.formState.errors.nombres?.message} />
            <Input label="Apellidos" {...editarForm.register("apellidos")} error={editarForm.formState.errors.apellidos?.message} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Teléfono" {...editarForm.register("telefono")} placeholder="999 000 000" />
            <Select
              label="Rol"
              {...editarForm.register("id_rol")}
              options={roles.map((r) => ({ value: r.id, label: r.nombre_rol }))}
              placeholder="Selecciona un rol"
              error={editarForm.formState.errors.id_rol?.message}
            />
          </div>
          {editError && (
            <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2">{editError}</p>
          )}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={cerrarEditar}>Cancelar</Button>
            <Button type="submit" className="flex-1" loading={editar.isPending}>Guardar cambios</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Cambiar contraseña */}
      <Modal
        open={contrasenaModal}
        onClose={cerrarContrasena}
        title={`Cambiar contraseña — ${empContrasena?.nombres ?? ""}`}
      >
        <form
          onSubmit={contrasenaForm.handleSubmit((d) => {
            if (!empContrasena) return;
            setContrasenaError(null);
            cambiarContrasena.mutate({ id: empContrasena.id, nueva_contrasena: d.nueva_contrasena });
          })}
          className="space-y-4"
        >
          <Input
            label="Nueva contraseña"
            type="password"
            {...contrasenaForm.register("nueva_contrasena")}
            error={contrasenaForm.formState.errors.nueva_contrasena?.message}
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            {...contrasenaForm.register("confirmar")}
            error={contrasenaForm.formState.errors.confirmar?.message}
          />
          {contrasenaError && (
            <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2">
              {contrasenaError}
            </p>
          )}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={cerrarContrasena}>Cancelar</Button>
            <Button type="submit" className="flex-1" loading={cambiarContrasena.isPending}>Cambiar contraseña</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
