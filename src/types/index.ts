export interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
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
  cliente_nombre: string;
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
