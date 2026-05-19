import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: string | number) {
  return `S/ ${Number(value).toFixed(2)}`;
}

export function formatDate(date: string | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatDateShort(date: string | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item); (acc[k] ??= []).push(item); return acc;
  }, {});
}

export function sumBy<T>(arr: T[], key: (item: T) => number): number {
  return arr.reduce((acc, item) => acc + key(item), 0);
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "—";
  const d = phone.replace(/\D/g, "");
  return d.length === 9 ? `${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6)}` : phone;
}

export function truncateText(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max).trimEnd()}…`;
}
export function getInitials(nombres: string, apellidos: string): string {
  return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
}

export function capitalize(text: string): string {
  return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "";
}
export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
export function parseApiError(err: unknown): string {
  const data = (err as { response?: { data?: Record<string, unknown> } }).response?.data;
  if (!data || typeof data !== "object") return "Error inesperado.";
  return Object.values(data).flat().join(" ") || "Error al procesar la solicitud.";
}

export function getEstadoLabel(estado: string): string {
  const labels: Record<string, string> = {
    pendiente:"Pendiente", en_proceso:"En proceso",
    listo:"Listo", entregado:"Entregado", cancelado:"Cancelado",
  };
  return labels[estado] ?? estado;
}
export function formatDateRange(from: string | null, to: string | null): string {
  if (!from && !to) return "Todas las fechas";
  if (from && !to)  return `Desde ${formatDateShort(from)}`;
  if (!from && to)  return `Hasta ${formatDateShort(to)}`;
  return `${formatDateShort(from)} — ${formatDateShort(to)}`;
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {} as Pick<T, K>);
}
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((k) => delete (result as Record<string, unknown>)[k as string]);
  return result as Omit<T, K>;
}

export function clampPage(page: number, totalPages: number): number {
  return Math.max(1, Math.min(page, Math.max(1, totalPages)));
}
export function buildQueryString(params: Record<string, string | number | boolean | null | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== null && v !== undefined && v !== "");
  return entries.length ? "?" + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&") : "";
}

export function formatIGV(amount: number, rate = 0.18) {
  const subtotal = amount / (1 + rate);
  const igv = amount - subtotal;
  return { subtotal: +subtotal.toFixed(2), igv: +igv.toFixed(2), total: +amount.toFixed(2) };
}

export function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const now = new Date(); now.setHours(0,0,0,0);
  const t   = new Date(dateStr); t.setHours(0,0,0,0);
  return Math.round((t.getTime() - now.getTime()) / 86_400_000);
}
