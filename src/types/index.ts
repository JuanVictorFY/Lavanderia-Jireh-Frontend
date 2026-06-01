export interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  dni?: string;
  telefono: string | null;
  direccion: string | null;
  correo: string | null;
  fecha_registro: string;
  personas_autorizadas?: PersonaAutorizada[];
}

export interface PersonaAutorizada {
  id: number;
  nombres: string;
  dni: string;
  telefono: string | null;
}

export interface Prenda {
  id?: number;
  tipo_prenda: string;
  color: string;
  peso: number;
  cantidad: number;
  observaciones: string;
}

export interface EstadoPedido {
  id: number;
  estado: string;
  fecha_estado: string;
  descripcion: string | null;
}

export interface Pedido {
  id: number;
  codigo: string;
  cliente_id?: number;
  cliente_nombre: string;
  cliente_dni?: string;
  cliente_telefono?: string;
  cliente_correo?: string;
  cliente_direccion?: string;
  empleado_nombre: string;
  fecha_ingreso: string;
  fecha_entrega: string | null;
  estado: EstadoPedidoValue;
  total: string;
  observaciones: string | null;
  prendas: Prenda[];
  estados: EstadoPedido[];
}

export type EstadoPedidoValue =
  | "pendiente"
  | "en_proceso"
  | "listo"
  | "entregado"
  | "cancelado";

export interface Servicio {
  id: number;
  nombre_servicio: string;
  descripcion: string | null;
  precio_base: string;
}

export interface Pago {
  id: number;
  id_pedido: number;
  monto: string;
  metodo_pago: string;
  fecha_pago: string;
  estado_pago: string;
}

export interface Empleado {
  id: number;
  nombres: string;
  apellidos: string;
  telefono: string | null;
  estado: boolean;
  rol_nombre: string;
  usuario: string;
}

export interface Rol {
  id: number;
  nombre_rol: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface DetalleServicio {
  id: number;
  id_servicio: number;
  nombre_servicio: string;
  cantidad: number;
  precio_unitario: string;
  subtotal: string;
}

export type MetodoPago  = "efectivo" | "tarjeta" | "yape" | "transferencia" | "otro";
export type EstadoPagoV = "pendiente" | "pagado" | "anulado";

export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: "info" | "warning" | "error" | "success";
  leida: boolean;
  fecha: string;
}

export interface AnalyticsResumen {
  pedidos_hoy: number;
  ingresos_hoy: number;
  pedidos_mes: number;
  total_clientes: number;
}
export interface IngresosPorDia { fecha: string; total: number; }

export interface ServicioStats { nombre_servicio: string; cantidad: number; }
export interface TopServiciosResponse {
  top_servicios: ServicioStats[];
  por_estado: Record<EstadoPedidoValue, number>;
  ingresos_7_dias: IngresosPorDia[];
  ingresos_6_meses: { mes: string; total: number }[];
  resumen: AnalyticsResumen;
}

export interface DateRange { from: string | null; to: string | null; }
export interface SearchFilters {
  query: string;
  page: number;
  pageSize: number;
  dateRange?: DateRange;
}

export interface ApiValidationError { [field: string]: string[]; }
export type ApiError = { detail?: string; non_field_errors?: string[]; } & ApiValidationError;

export interface PagedQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}

export interface PagoDetalle extends Pago { pedido_codigo: string; cliente_nombre: string; }

export type Nullable<T>  = T | null;
export type Optional<T>  = T | null | undefined;
export type WithId<T>    = T & { id: number };

export interface EmpleadoConRol extends Empleado { id_rol: number; }
export type RolNombre = "administrador" | "recepcionista" | "operario";

export interface PaginationState {
  page: number; pageSize: number; total: number; totalPages: number;
}

export interface SortConfig<T> { key: keyof T; direction: "asc" | "desc"; }

export interface ReciboPedido {
  codigo: string;
  cliente: string;
  empleado: string;
  fecha_ingreso: string;
  fecha_entrega: string | null;
  prendas: Prenda[];
  subtotal: number;
  igv: number;
  total: number;
}

export interface ClienteConPedidos extends Cliente {
  total_pedidos: number;
  pedidos_activos: number;
  ultimo_pedido: string | null;
}

export interface PrintOptions {
  copies?: number;
  orientation?: "portrait" | "landscape";
  includeHeader?: boolean;
  includeFooter?: boolean;
}

export interface EmpleadoStats {
  total_pedidos: number;
  pedidos_mes: number;
  pedidos_activos: number;
}

export type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

export interface Turno {
  id: number;
  empleado_id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string | null;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface UploadedFile { name: string; size: number; type: string; url: string; }

export interface Config { apiBaseUrl: string; appName: string; version: string; igvRate: number; }

export interface ChartDataPoint { label: string; value: number; color?: string; }
export interface ChartSeries    { name: string; data: ChartDataPoint[]; }
