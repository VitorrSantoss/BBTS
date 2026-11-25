import type { Competencia } from '@/types/dominio'
import type { Minimos } from '@/utils/competencias'
import { EmptyState } from '../ui/Estados'
import { CompetencyBar } from './CompetencyBar'

/** Lista de competências. `minimos` é um mapa opcional de sigla para nível mínimo esperado. */
export function CompetencyList({
  competencias,
  minimos = {},
  compacta,
}: {
  competencias: Competencia[]
  minimos?: Minimos
  compacta?: boolean
}) {
  if (competencias.length === 0) {
    return (
      <EmptyState compacto titulo="Nenhuma competência registrada" descricao="As competências aparecem aqui assim que forem avaliadas." />
    )
  }
  return (
    <ul className={compacta ? 'flex flex-col gap-4' : 'flex flex-col gap-5'}>
      {competencias.map((c) => (
        <li key={c.sigla}>
          <CompetencyBar {...c} nivelMinimo={minimos[c.sigla]} compacta={compacta} />
        </li>
      ))}
    </ul>
  )
}
