import type { Competencia } from '@/types/dominio'
import type { Minimos } from './competencias'

/** Título exibido nos cards e na trilha de navegação. Ex.: "1. Desenvolvimento". */
export const tituloEquipe = ({ id, nome }: { id: number; nome: string }): string => `${id}. ${nome}`

/** Rótulo curto usado na tag do colaborador. Ex.: "Equipe 03". */
export const rotuloEquipe = ({ id }: { id: number }): string => `Equipe ${String(id).padStart(2, '0')}`

/** Mapa de sigla para nível mínimo esperado na equipe. */
export const minimosDe = (competenciasMinimas: Competencia[] | null | undefined): Minimos =>
  Object.fromEntries((competenciasMinimas ?? []).map(({ sigla, nivel }) => [sigla, nivel]))
