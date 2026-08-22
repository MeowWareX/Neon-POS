import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function currency(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function compactNumber(value: number) {
  return new Intl.NumberFormat("es-CO", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function formatDateTime(value: string | Date) {
  const d = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00-05:00`)
    : new Date(value);

  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export function formatTime(value: string | Date) {
  const d = new Date(value);
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

export function formatDate(value: string | Date) {
  const d = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00-05:00`)
    : new Date(value);

  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    dateStyle: "medium",
  }).format(d);
}

