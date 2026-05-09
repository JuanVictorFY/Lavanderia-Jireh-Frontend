export const APP_NAME    = "Lavandería Jireh";
export const APP_VERSION = "1.0.0";

export const PAGE_SIZES = { small: 6, medium: 8, large: 10, xlarge: 12 } as const;

export const ESTADO_LABELS: Record<string, string> = {
  pendiente:"Pendiente", en_proceso:"En proceso",
  listo:"Listo", entregado:"Entregado", cancelado:"Cancelado",
};

export const METODO_PAGO_LABELS: Record<string, string> = {
  efectivo:"Efectivo", tarjeta:"Tarjeta",
  yape:"Yape", transferencia:"Transferencia", otro:"Otro",
};

export const ROL_LABELS: Record<string, string> = {
  administrador:"Administrador", recepcionista:"Recepcionista", operario:"Operario",
};
