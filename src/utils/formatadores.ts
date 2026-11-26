import type { Experiencia, Formacao, NivelIdioma, NivelItem, NivelTecnologia, StatusFormacao } from '@/types/dominio'

const ROTULOS_NIVEL: Record<NivelItem, string> = {
  INICIANTE: 'Iniciante',
  BASICO: 'Básico',
  INTERMEDIARIO: 'Intermediário',
  AVANCADO: 'Avançado',
  FLUENTE: 'Fluente',
  NATIVO: 'Nativo',
  JUNIOR: 'Júnior',
  PLENO: 'Pleno',
  SENIOR: 'Sênior',
}

export interface OpcaoNivel<T extends string> {
  valor: T
  rotulo: string
}

const opcoes = <T extends NivelItem>(...niveis: T[]): OpcaoNivel<T>[] => niveis.map((valor) => ({ valor, rotulo: ROTULOS_NIVEL[valor] }))

/** Valores dos enums NivelIdioma e NivelHabilidades da API. */
export const NIVEIS_IDIOMA = opcoes<NivelIdioma>('INICIANTE', 'BASICO', 'INTERMEDIARIO', 'AVANCADO', 'FLUENTE', 'NATIVO')
export const NIVEIS_TECNOLOGIA = opcoes<NivelTecnologia>('JUNIOR', 'PLENO', 'SENIOR')

export const STATUS_FORMACAO: OpcaoNivel<StatusFormacao>[] = [
  { valor: 'CONCLUIDO', rotulo: 'Concluído' },
  { valor: 'CURSANDO', rotulo: 'Cursando' },
]

export const rotuloNivel = (nivel: string): string => ROTULOS_NIVEL[nivel as NivelItem] ?? nivel

/** Posição do nível na sua escala, de 0 a 1 (para a barrinha de proficiência). */
export function proporcaoDoNivel(nivel: string): number {
  const idioma = NIVEIS_IDIOMA.findIndex((o) => o.valor === nivel)
  if (idioma >= 0) return (idioma + 1) / NIVEIS_IDIOMA.length
  const tec = NIVEIS_TECNOLOGIA.findIndex((o) => o.valor === nivel)
  if (tec >= 0) return (tec + 1) / NIVEIS_TECNOLOGIA.length
  return 0
}

export const primeiroNome = (nome = ''): string => nome.trim().split(/\s+/)[0] ?? ''

/** 2023-08-01 vira 08.2023, o formato das telas de perfil. */
export function formatarMesAno(dataIso: string | null | undefined): string {
  if (!dataIso) return ''
  const [ano, mes] = dataIso.split('-')
  return `${mes}.${ano}`
}

export function periodoDaExperiencia({
  dataInicio,
  dataFim,
  empregoAtual,
}: Pick<Experiencia, 'dataInicio' | 'dataFim' | 'empregoAtual'>): string {
  const fim = empregoAtual ? 'Atual' : formatarMesAno(dataFim)
  return [formatarMesAno(dataInicio), fim].filter(Boolean).join(' – ')
}

/** 2021 – 2024; cursando com previsão: 2025 – 2026 (previsto); sem fim: 2025 – Atual. */
export function periodoDaFormacao({ anoInicio, anoFim, status }: Pick<Formacao, 'anoInicio' | 'anoFim' | 'status'>): string {
  if (!anoFim) return `${anoInicio} – Atual`
  return `${anoInicio} – ${anoFim}${status === 'CURSANDO' ? ' (previsto)' : ''}`
}

/** 2026-11-21T12:19:41 vira 21/11/2026. */
export function formatarData(dataIso: string | null | undefined): string {
  if (!dataIso) return ''
  const [ano, mes, dia] = dataIso.slice(0, 10).split('-')
  return `${dia}/${mes}/${ano}`
}

/** "1 membro", "4 membros", "Sem membros". */
export function rotuloDeMembros(quantidade: number): string {
  if (quantidade === 0) return 'Sem membros'
  return quantidade === 1 ? '1 membro' : `${quantidade} membros`
}
