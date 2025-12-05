import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina clases de Tailwind de forma segura
 * Útil para combinar clases condicionales
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

