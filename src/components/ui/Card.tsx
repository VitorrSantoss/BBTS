import { useId, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '@/utils/classes'

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  titulo?: ReactNode
  descricao?: ReactNode
  /** Ações à direita do título (botões, links). */
  acoes?: ReactNode
  /** Remove o padding interno (para tabelas e listas que vão de borda a borda). */
  semPadding?: boolean
  as?: 'section' | 'div' | 'article' | 'aside'
}

/** Superfície branca do sistema. Com título, vira uma região nomeada para leitores de tela. */
export function Card({ titulo, descricao, acoes, semPadding, as: Tag = 'section', className, children, ...props }: CardProps) {
  const tituloId = useId()
  return (
    <Tag
      aria-labelledby={titulo ? tituloId : undefined}
      className={cx('rounded-xl border border-primary-100 bg-surface shadow-xs', !semPadding && 'p-5 sm:p-6', className)}
      {...props}
    >
      {(titulo || acoes) && (
        <header
          className={cx(
            'flex flex-wrap items-start justify-between gap-x-4 gap-y-2',
            semPadding ? 'px-5 pt-5 sm:px-6 sm:pt-6' : '',
            'mb-5',
          )}
        >
          <div className="flex min-w-0 flex-col gap-1">
            {titulo && (
              <h2 id={tituloId} className="text-lg font-bold text-primary">
                {titulo}
              </h2>
            )}
            {descricao && <p className="text-sm text-fg-muted">{descricao}</p>}
          </div>
          {acoes && <div className="flex shrink-0 flex-wrap items-center gap-2">{acoes}</div>}
        </header>
      )}
      {children}
    </Tag>
  )
}
