import { useId } from 'react'
import { ArrowDown, Check } from 'lucide-react'
import type { Competencia } from '@/types/dominio'
import { cx } from '@/utils/classes'
import { situacaoDoMinimo } from '@/utils/competencias'
import { Tag } from '../ui/Tag'

export interface CompetencyBarProps extends Competencia {
  /** Mínimo esperado pela equipe (telas do gestor). Desenha a marca e a situação. */
  nivelMinimo?: number
  compacta?: boolean
}

/**
 * Competência no modelo SFIA: sigla de 4 letras e nível atual sobre o nível máximo.
 * Um segmento por nível mostra a escala de cada competência.
 */
export function CompetencyBar({ nome, sigla, nivel, nivelMax, nivelMinimo, compacta }: CompetencyBarProps) {
  const rotuloId = useId()
  const situacao = situacaoDoMinimo(nivel, nivelMinimo)
  const textoMinimo =
    situacao === 'sem-minimo'
      ? ''
      : `Mínimo esperado: nível ${nivelMinimo} de ${nivelMax}${situacao === 'abaixo' ? `, faltam ${(nivelMinimo ?? 0) - nivel}` : ', atende'}.`

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span id={rotuloId} className="flex max-w-full min-w-0 items-center gap-2 text-sm font-semibold text-fg">
          <span className="rounded-xs bg-primary-50 px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-primary tabular">{sigla}</span>
          <span className="truncate">{nome}</span>
        </span>
        <span className="flex items-center gap-2">
          {situacao === 'abaixo' && (
            <Tag variante="chip" aria-hidden>
              <ArrowDown className="size-3" />
              Abaixo do mínimo
            </Tag>
          )}
          {situacao === 'atende' && !compacta && (
            <Tag variante="primaria" aria-hidden>
              <Check className="size-3" />
              Atende
            </Tag>
          )}
          <span aria-hidden className="text-sm font-bold text-primary tabular">
            {nivel}
            <span className="font-semibold text-fg-muted">/{nivelMax}</span>
          </span>
        </span>
      </div>

      <div className="relative">
        <div
          role="progressbar"
          aria-labelledby={rotuloId}
          aria-valuemin={0}
          aria-valuenow={nivel}
          aria-valuemax={nivelMax}
          aria-valuetext={`Nível ${nivel} de ${nivelMax}. ${textoMinimo}`.trim()}
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${nivelMax}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: nivelMax }, (_, i) => (
            <span key={i} className={cx('relative overflow-hidden rounded-full bg-primary-100', compacta ? 'h-1.5' : 'h-2')}>
              {i < nivel && (
                <span
                  className="absolute inset-0 origin-left rounded-full bg-progress"
                  style={{ animation: `preencher 400ms var(--ease-saida) both`, animationDelay: `${i * 60}ms` }}
                />
              )}
            </span>
          ))}
        </div>
        {nivelMinimo !== undefined && (
          <span
            aria-hidden
            className="absolute -top-1 -bottom-1 w-0.5 rounded-full bg-primary-deep"
            style={{ left: `calc(${(Math.min(nivelMinimo, nivelMax) / nivelMax) * 100}% - 1px)` }}
          />
        )}
      </div>

      {situacao !== 'sem-minimo' && !compacta && (
        <p aria-hidden className={cx('text-xs', situacao === 'abaixo' ? 'font-semibold text-fg' : 'text-fg-muted')}>
          {textoMinimo}
        </p>
      )}
    </div>
  )
}
