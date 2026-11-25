import type { ComponentProps, ReactNode } from 'react'
import { Tabs as T } from 'radix-ui'
import { cx } from '@/utils/classes'

/**
 * Cabeçalho da página. Fica sobre a faixa azul: título branco, descrição suave e ações à direita.
 */
export function PageHeader({
  titulo,
  descricao,
  acoes,
  antes,
}: {
  titulo: ReactNode
  descricao?: ReactNode
  acoes?: ReactNode
  antes?: ReactNode
}) {
  return (
    <div data-surface="primary" className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="flex min-w-0 items-center gap-4">
        {antes}
        <div className="flex min-w-0 flex-col gap-1.5">
          <h1 className="text-display font-bold text-white">{titulo}</h1>
          {descricao && <p className="text-fg-inverse-muted">{descricao}</p>}
        </div>
      </div>
      {acoes && <div className="flex flex-wrap items-center gap-2">{acoes}</div>}
    </div>
  )
}

/** Indicador numérico (KPI). */
export function StatCard({
  rotulo,
  valor,
  sufixo,
  apoio,
  icone,
  destaque,
}: {
  rotulo: string
  valor: ReactNode
  sufixo?: string
  apoio?: ReactNode
  icone: ReactNode
  /** Fundo amarelo: chama atenção para algo que pede ação. */
  destaque?: boolean
}) {
  return (
    <div
      className={cx(
        'flex flex-col gap-3 rounded-xl border p-5 shadow-xs',
        destaque ? 'border-transparent bg-accent' : 'border-primary-100 bg-surface',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className={cx('text-sm font-semibold', destaque ? 'text-primary' : 'text-fg-muted')}>{rotulo}</p>
        <span
          aria-hidden
          className={cx(
            'flex size-9 items-center justify-center rounded-md [&>svg]:size-[18px]',
            destaque ? 'bg-primary text-accent' : 'bg-primary-50 text-primary',
          )}
        >
          {icone}
        </span>
      </div>
      <p className="flex items-baseline gap-1 text-kpi font-bold text-primary tabular">
        {valor}
        {sufixo && <span className="text-base font-semibold">{sufixo}</span>}
      </p>
      {apoio && <p className={cx('text-xs', destaque ? 'text-primary' : 'text-fg-muted')}>{apoio}</p>}
    </div>
  )
}

/** Barra de progresso simples (percentual). */
export function BarraProgresso({ valor, rotulo, className }: { valor: number; rotulo: string; className?: string }) {
  const v = Math.max(0, Math.min(100, valor))
  return (
    <div
      role="progressbar"
      aria-label={rotulo}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      className={cx('h-2 w-full overflow-hidden rounded-full bg-primary-100', className)}
    >
      <div
        className="h-full origin-left [animation:preencher_var(--dur-lenta)_var(--ease-saida)] rounded-full bg-progress"
        style={{ width: `${v}%` }}
      />
    </div>
  )
}

export const Tabs = T.Root
export const TabsConteudo = T.Content

export function TabsLista({ className, ...props }: ComponentProps<typeof T.List>) {
  return <T.List className={cx('flex gap-1 border-b border-primary-100', className)} {...props} />
}

export function TabsGatilho({ className, ...props }: ComponentProps<typeof T.Trigger>) {
  return (
    <T.Trigger
      className={cx(
        '-mb-px inline-flex h-11 items-center gap-2 border-b-2 border-transparent px-3 text-sm font-semibold text-fg-muted',
        'hover:text-primary data-[state=active]:border-primary data-[state=active]:text-primary',
        className,
      )}
      {...props}
    />
  )
}
