import type { CSSProperties, ReactNode } from 'react'
import { CircleAlert, Inbox, RefreshCw } from 'lucide-react'
import { cx } from '@/utils/classes'
import { Button } from './Button'

/** Bloco de carregamento. Monte com o formato real do conteúdo. */
export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return <span aria-hidden className={cx('block skeleton rounded-md', className)} style={style} />
}

/** Região de carregamento acessível. Com `consultaApi`, avisa que a API pode demorar a acordar. */
export function LoadingState({ children, consultaApi, className }: { children: ReactNode; consultaApi?: boolean; className?: string }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className={cx('flex flex-col gap-6', className)}>
      <span className="sr-only">Carregando…</span>
      {consultaApi && (
        <p className="w-fit rounded-full bg-on-primary-soft px-3 py-1 text-sm text-white" data-surface="primary">
          Conectando à API. Ela pode levar até 1 minuto para acordar.
        </p>
      )}
      {children}
    </div>
  )
}

/** Vazio com orientação do que fazer. */
export function EmptyState({
  titulo,
  descricao,
  icone,
  children,
  compacto,
  className,
}: {
  titulo: string
  descricao?: ReactNode
  icone?: ReactNode
  children?: ReactNode
  compacto?: boolean
  className?: string
}) {
  return (
    <div
      className={cx(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-primary-200 bg-primary-50/60 text-center',
        compacto ? 'px-4 py-6' : 'px-6 py-12',
        className,
      )}
    >
      <span aria-hidden className="flex size-11 items-center justify-center rounded-full bg-surface text-primary shadow-xs [&>svg]:size-5">
        {icone ?? <Inbox />}
      </span>
      <div className="flex max-w-sm flex-col gap-1">
        <p className="font-semibold text-fg">{titulo}</p>
        {descricao && <p className="text-sm text-fg-muted">{descricao}</p>}
      </div>
      {children}
    </div>
  )
}

/** Erro com saída. `aviso` é a faixa fina usada quando a tela segue com dados de exemplo. */
export function ErrorState({
  titulo = 'Não conseguimos carregar esta tela',
  descricao = 'Pode ser instabilidade na conexão. Tenta de novo?',
  aoTentarDeNovo,
  tentando,
  variante = 'erro',
}: {
  titulo?: string
  descricao?: ReactNode
  aoTentarDeNovo?: () => void
  tentando?: boolean
  variante?: 'erro' | 'aviso'
}) {
  if (variante === 'aviso') {
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-lg border border-primary-200 bg-surface px-4 py-3 shadow-xs"
      >
        <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
          <CircleAlert className="size-4" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-sm font-semibold text-fg">{titulo}</p>
          {descricao && <p className="text-sm text-fg-muted">{descricao}</p>}
        </div>
        {aoTentarDeNovo && (
          <Button
            variante="secundario"
            tamanho="sm"
            icone={<RefreshCw aria-hidden className="size-4" />}
            carregando={tentando}
            onClick={aoTentarDeNovo}
          >
            Tentar de novo
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-xl border border-primary-100 bg-surface px-6 py-14 text-center shadow-sm"
    >
      <span aria-hidden className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
        <CircleAlert className="size-6" />
      </span>
      <div className="flex max-w-md flex-col gap-1.5">
        <p className="text-xl font-bold text-primary">{titulo}</p>
        {descricao && <p className="text-fg-muted">{descricao}</p>}
      </div>
      {aoTentarDeNovo && (
        <Button icone={<RefreshCw aria-hidden className="size-4" />} carregando={tentando} onClick={aoTentarDeNovo}>
          Tentar de novo
        </Button>
      )}
    </div>
  )
}
