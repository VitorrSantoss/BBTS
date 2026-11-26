import { clsx, type ClassValue } from 'clsx'

/** Junta classes condicionalmente. */
export function cx(...entradas: ClassValue[]): string {
  return clsx(entradas)
}
