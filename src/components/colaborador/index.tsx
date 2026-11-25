import { useId, type ReactNode } from 'react'
import type { Colaborador, Competencia } from '@/types/dominio'
import { calcularNivelTotal, type Minimos } from '@/utils/competencias'
import { rotuloEquipe } from '@/utils/equipes'
import { CompetencyList, DonutChart } from '../competencias'
import { Avatar } from '../ui/Avatar'
import { Tag } from '../ui/Tag'

/** Quantas tecnologias aparecem como tag ao lado da equipe. */
const TAGS_DE_TECNOLOGIA = 4

/** Foto, nome, área, equipe e principais tecnologias. O nome é o título principal da tela. */
export function CartaoColaborador({ colaborador, acoes }: { colaborador: Colaborador; acoes?: ReactNode }) {
  const tituloId = useId()
  const { nome, foto, area, equipe, tecnologias } = colaborador
  const tags = [...(equipe ? [rotuloEquipe(equipe)] : []), ...tecnologias.slice(0, TAGS_DE_TECNOLOGIA).map((t) => t.nome)]

  return (
    <section
      aria-labelledby={tituloId}
      className="flex flex-col gap-5 rounded-xl border border-primary-100 bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:p-6"
    >
      <Avatar src={foto} alt={`Foto de ${nome}`} tamanho={96} borda="azul" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div>
          <h1 id={tituloId} className="text-display font-bold text-primary">
            {nome}
          </h1>
          {area && <p className="text-fg-muted">{area}</p>}
        </div>
        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Equipe e tecnologias">
            {tags.map((tag, i) => (
              <li key={tag}>
                <Tag variante={i === 0 && equipe ? 'chip' : 'destaque'}>{tag}</Tag>
              </li>
            ))}
          </ul>
        )}
      </div>
      {acoes && <div className="flex flex-wrap gap-2 sm:self-start">{acoes}</div>}
    </section>
  )
}

/** Barras de competência ao lado do nível total, nas telas de perfil e do gestor. */
export function PainelCompetencias({
  competencias,
  minimos,
  titulo = 'Níveis de competências',
}: {
  competencias: Competencia[]
  minimos?: Minimos
  titulo?: string
}) {
  const tituloId = useId()
  return (
    <section
      aria-labelledby={tituloId}
      className="grid gap-6 rounded-xl border border-primary-100 bg-surface p-5 shadow-xs sm:p-6 md:grid-cols-[minmax(0,1fr)_240px]"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 id={tituloId} className="text-lg font-bold text-primary">
            {titulo}
          </h2>
          {minimos && <p className="text-sm text-fg-muted">A linha escura marca o mínimo esperado pela equipe.</p>}
        </div>
        <CompetencyList competencias={competencias} minimos={minimos} />
      </div>
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-primary-50 p-6 text-center">
        <h3 className="text-base font-bold text-primary">Nível total</h3>
        <DonutChart valor={calcularNivelTotal(competencias)} tamanho={148} />
        <p className="text-xs text-fg-muted">Soma dos níveis atuais sobre a soma dos níveis máximos.</p>
      </div>
    </section>
  )
}
