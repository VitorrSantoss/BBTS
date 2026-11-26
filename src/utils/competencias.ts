import type { Competencia } from '@/types/dominio'

/** Qualquer pessoa com níveis de competência (colaborador ou membro de equipe). */
type ComCompetencias = { competencias: Competencia[] }

/** Mapa de sigla para nível mínimo esperado. */
export type Minimos = Record<string, number>

/** Percentual do nível total: soma dos níveis atuais sobre a soma dos níveis máximos. */
export function calcularNivelTotal(competencias: Competencia[]): number {
  const maximo = competencias.reduce((soma, { nivelMax }) => soma + nivelMax, 0)
  if (maximo === 0) return 0
  const atual = competencias.reduce((soma, { nivel }) => soma + nivel, 0)
  return Math.round((atual / maximo) * 100)
}

/** Situação de uma competência frente ao mínimo da equipe. */
export type SituacaoMinimo = 'sem-minimo' | 'atende' | 'abaixo'

export function situacaoDoMinimo(nivel: number, minimo: number | undefined): SituacaoMinimo {
  if (minimo === undefined) return 'sem-minimo'
  return nivel >= minimo ? 'atende' : 'abaixo'
}

/**
 * Competências mínimas que o colaborador não atinge.
 * Competência exigida que não existe no perfil conta como nível 0.
 */
export function competenciasAbaixoDoMinimo(
  competencias: Competencia[],
  minimos: Minimos,
): Array<{ sigla: string; nivel: number; minimo: number }> {
  return Object.entries(minimos)
    .map(([sigla, minimo]) => ({ sigla, minimo, nivel: competencias.find((c) => c.sigla === sigla)?.nivel ?? 0 }))
    .filter(({ nivel, minimo }) => nivel < minimo)
}

/** Aderência (%) de um colaborador: mínimos atendidos sobre o total de mínimos. */
export function aderenciaAoMinimo(competencias: Competencia[], minimos: Minimos): number {
  const total = Object.keys(minimos).length
  if (total === 0) return 100
  const abaixo = competenciasAbaixoDoMinimo(competencias, minimos).length
  return Math.round(((total - abaixo) / total) * 100)
}

/** Aderência média da equipe. Sem membros, não há aderência a medir (null). */
export function aderenciaDaEquipe(membros: ComCompetencias[], minimos: Minimos): number | null {
  if (membros.length === 0) return null
  const soma = membros.reduce((acc, m) => acc + aderenciaAoMinimo(m.competencias, minimos), 0)
  return Math.round(soma / membros.length)
}

/** Quantos membros atendem o mínimo de uma competência. */
export function membrosQueAtendem(membros: ComCompetencias[], sigla: string, minimo: number): number {
  return membros.filter((m) => (m.competencias.find((c) => c.sigla === sigla)?.nivel ?? 0) >= minimo).length
}
